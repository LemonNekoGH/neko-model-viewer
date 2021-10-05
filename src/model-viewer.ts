import { DirectionalLight, Group, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * 模型查看器实体类
 */
export class ModelViewer {
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  destroyed: boolean
  logRenderTimes: boolean
  group: Group

  constructor (group: Group, canvas: HTMLCanvasElement) {
    this.destroyed = false
    this.logRenderTimes = true
    this.group = group

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
    this.renderer.setPixelRatio(4)

    window.addEventListener('resize', () => {
      this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight
      this.camera.updateProjectionMatrix()
    })

    const control = new OrbitControls(this.camera, canvas)
    control.enableDamping = true

    let frames = 0

    // 开始渲染
    const animate = () => {
      frames++
      if (frames % 60 === 0 && this.logRenderTimes) {
        console.log(`Rendered times: ${frames / 60}s`)
      }

      if (!this.destroyed) {
        requestAnimationFrame(animate)
      }
      control.update()
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  addLights (): void {
    const light = new DirectionalLight()
    light.position.set(0, 0, 1)
    this.scene.add(light)
  }

  setGroup (group: Group): void {
    this.scene.remove(this.group)
    this.scene.add(group)
    this.group = group
  }
}
