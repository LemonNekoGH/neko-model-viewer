<template>
  <div class="app">
    <header class="header">
      <span class="header-title">
        模型查看器
      </span>
      <div class="spacer"></div>
      <input style="display: none" type="file" ref="fileInput" @change="onFileChanged">
      <button class="btn" @click="onUploadClick">
        <div class="btn-content">
          <i class="fas fa-folder-open"></i>
          {{ scene ? '更换要预览的文件' : '上传文件进行预览' }}
        </div>
      </button>
      <div class="w-10px"></div>
    </header>
    <main class="main">
      <canvas ref="modelView" class="model-viewer"></canvas>
    </main>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import {
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer
} from 'three'
import gsap from 'gsap'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

/**
 * 模型查看器实体类
 */
class ModelViewer {
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  rotationSpeed: number

  constructor (group: Group, canvas: HTMLCanvasElement) {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
    this.camera.position.set(0, 0, 5)
    this.addLights()
    this.rotationSpeed = 0.1

    this.scene.add(group)

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    this.renderer.outputEncoding = sRGBEncoding
    // 设置像素比率防止画面太糊
    this.renderer.setPixelRatio(4)

    window.addEventListener('resize', () => {
      this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight
      this.camera.updateProjectionMatrix()
    })

    // 开始渲染
    const animate = () => {
      requestAnimationFrame(animate)
      this.renderer.render(this.scene, this.camera)
    }

    this.listenEvents(canvas, group)
    // this.addTransformControl(this.camera, canvas, group)

    animate()
  }

  /**
   * 添加变化控制器
   */
  addTransformControl (camera: PerspectiveCamera, canvas: HTMLCanvasElement, group: Group) {
    const control = new TransformControls(camera, canvas)
    control.attach(group)
    control.enabled = true
    control.setMode('rotate')
    this.scene.add(control)

    control.addEventListener('objectChange', (ev) => {
      console.log(group.rotation.x, group.rotation.y, group.rotation.z)
    })
  }

  /**
   * 添加各种事件的监听器
   */
  listenEvents (canvas: HTMLCanvasElement, group: Group) {
    // 鼠标是否按下
    let mouseDown = false
    canvas.addEventListener('mousedown', () => {
      mouseDown = true
    })
    canvas.addEventListener('mouseup', () => {
      mouseDown = false
    })
    canvas.addEventListener('mousemove', (ev: MouseEvent) => {
      if (mouseDown) {
        // 如果鼠标按下，视为拖动事件
        group.rotateX(ev.movementY * this.rotationSpeed)
        group.rotateY(ev.movementX * this.rotationSpeed)
      }
    })
  }

  addLights () {
    const light = new DirectionalLight()
    light.position.set(0, 0, 1)
    this.scene.add(light)
  }
}

export default Vue.extend({
  data () {
    return {
      loading: false,
      selecting: false,
      scene: null as Group | null,
      viewer: null as ModelViewer | null,
      file: null as File | null
    }
  },
  watch: {
    /**
     * 监听场景变化
     * @param value
     */
    scene (value: Group | null) {
      if (value) {
        this.viewer = new ModelViewer(value, this.$refs.modelView as HTMLCanvasElement)
      } else {
        this.viewer = null
      }
    }
  },
  methods: {
    /**
     * 当上传按钮点击时
     */
    onUploadClick () {
      if (!this.$refs.fileInput) {
        return
      }
      this.selecting = true
      const fileInput: HTMLInputElement = this.$refs.fileInput as HTMLInputElement
      fileInput.click()
      // 监听一次「焦点变化」事件
      window.addEventListener('focus', () => {
        // 当选择框被关闭时，将 selecting 设置为 false
        this.selecting = false
      }, { once: true })
    },
    /**
     * 当选中文件后加载模型文件
     * 加载成功时调用 loadComplete
     * 加载失败后调用 loadError
     * @param e
     */
    async onFileChanged (e: Event) {
      if (!e.target) {
        return
      }
      const files = (e.target as HTMLInputElement).files
      if (!files) {
        console.log('取消了选择')
        return
      }
      const file: File = files[0]
      // 把当前文件对象保存起来
      this.file = file
      const dacroLoader = new DRACOLoader()
      dacroLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/')
      const loader = new GLTFLoader()
      loader.setDRACOLoader(dacroLoader)
      try {
        this.loading = true
        loader.parse(await file.arrayBuffer(), '', this.loadComplete, this.loadError)
      } catch (e) {
        this.loadError(e)
      }
    },
    loadComplete (model: GLTF) {
      this.loading = false
      this.scene = model.scene
    },
    loadError (ev: ErrorEvent) {
      if (process.env.NODE_ENV === 'development') {
        console.log(ev.message)
      }
      this.loading = false
    }
  }
})
</script>
<style lang="less">
html {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
  width: 100%;
  height: 100%;
}
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header {
  height: 56px;
  border-bottom: 2px black solid;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  &-title {
    font-size: 24px;
    font-weight: bold;
    padding: 10px;
  }
}
.btn {
  box-sizing: border-box;
  background: white;
  padding: 0;
  border: 2px solid black;
  &-content {
    padding: 5px 5px;
    background: white;
    font-weight: bold;
    transition: all 250ms;
    &:hover {
      background: black;
      color: white;
    }
  }
}
.spacer {
  flex: 1;
}
.w-10px {
  width: 10px;
}
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.model-viewer {
  flex: 1;
}
</style>
