<template>
  <v-app>
    <v-app-bar app flat>
      <v-toolbar-title>模型查看器</v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="file" style="display: none" ref="fileInput" @change="onFileChanged">
      <v-btn outlined color="primary" @click="onUploadClick" :loading="selecting">
        <v-icon left>mdi-upload</v-icon>
        上传文件进行预览
      </v-btn>
    </v-app-bar>
    <v-main>
      <div class="main">
        <v-divider></v-divider>
        <div class="progress-container" v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <canvas v-if="scene" ref="modelView" class="model-viewer"></canvas>
      </div>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Group, WebGLRenderer } from 'three'

/**
 * 模型查看器实体类
 */
class ModelViewer {
  renderer: WebGLRenderer

  constructor (group: Group, canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas: canvas
    })
  }
}

export default Vue.extend({
  data () {
    return {
      loading: false,
      selecting: false,
      scene: null as Group,
      viewer: null as ModelViewer
    }
  },
  methods: {
    /**
     * 当上传按钮点击时
     */
    onUploadClick () {
      this.selecting = true
      this.$refs.fileInput.click()
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
      this.viewer = new ModelViewer(this.scene, this.$refs.modelView)
    },
    loadError (ev: ErrorEvent) {
      this.loading = false
      this.$msg.error('请确保上传的文件格式正确')
    }
  }
})
</script>
<style lang="less">
.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.model-viewer {
  flex: 1;
}
</style>
