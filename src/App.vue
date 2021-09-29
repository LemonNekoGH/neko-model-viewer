<template>
  <div class="app">
    <header class="header">
      <span class="header-title">
        模型查看器
      </span>
      <div class="spacer"></div>
      <input style="display: none" type="file" ref="fileInput" @change="onFileChanged">
      <button class="upload-btn" @click="onUploadClick">
        {{ scene ? '更换要预览的文件' : '上传文件进行预览' }}
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
import * as dat from 'dat.gui'

/**
 * 模型查看器实体类
 */
class ModelViewer {
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  debug: dat.GUI

  constructor (group: Group, canvas: HTMLCanvasElement) {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
    this.camera.position.set(0, 0, 5)
    this.addLights()

    this.scene.add(group)

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    this.renderer.outputEncoding = sRGBEncoding
    // 设置像素比率防止画面太糊
    this.renderer.setPixelRatio(window.devicePixelRatio)

    window.addEventListener('resize', () => {
      this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight
      this.camera.updateProjectionMatrix()
    })

    // 开始渲染
    const animate = () => {
      requestAnimationFrame(animate)
      this.renderer.render(this.scene, this.camera)
    }

    animate()
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
      this.$nextTick(() => {
        this.viewer = new ModelViewer(this.scene!, this.$refs.modelView as HTMLCanvasElement)
      })
    },
    loadError (ev: ErrorEvent) {
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
.upload-btn {
  padding: 5px;
  border: 2px solid black;
  background: white;
  font-weight: bold;
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
