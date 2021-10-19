import {
  AnimationMixer, Clock,
  Color,
  Group,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  sRGBEncoding,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { toRaw } from 'vue'

/**
 * 模型查看器实体类
 */
export class ModelViewer {
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  logRenderTimes: boolean
  gltf: GLTF
  animationMixer: AnimationMixer
  clock: Clock
  orbitControl: OrbitControls
  renderID = 0

  constructor (gltf: GLTF, canvas: HTMLCanvasElement) {
    this.logRenderTimes = true
    this.gltf = gltf

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 2000)
    this.camera.position.set(0, 0, 5)

    this.scene.background = new Color(0xD6DFFF)
    this.scene.add(gltf.scene)

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    this.renderer.outputEncoding = sRGBEncoding
    // 设置像素比率防止画面太糊
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(innerWidth, innerHeight)

    const pmremGenerator = new PMREMGenerator(this.renderer)
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture

    window.addEventListener('resize', () => {
      this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight
      this.renderer.setSize(innerWidth, innerHeight)
      this.camera.updateProjectionMatrix()
    })

    this.orbitControl = new OrbitControls(this.camera, canvas)
    this.orbitControl.enableDamping = true

    this.animationMixer = new AnimationMixer(this.gltf.scene)
    this.animationMixer.clipAction(gltf.animations[0]).play()
    this.clock = new Clock()

    this.startRender()
  }

  startRender (): void {
    const animate = () => {
      this.renderID = requestAnimationFrame(animate)

      this.animationMixer.update(this.clock.getDelta())
      this.orbitControl.update()
      this.renderer.render(this.scene, this.camera)
    }

    this.renderID = requestAnimationFrame(animate)
  }

  stopRender (): void {
    cancelAnimationFrame(this.renderID)
  }

  setModel (gltf: GLTF): void {
    this.stopRender()

    this.scene.remove(this.gltf.scene)
    this.scene.add(gltf.scene)

    this.animationMixer = new AnimationMixer(gltf.scene)
    this.animationMixer.clipAction(gltf.animations[0]).play()
    this.clock = new Clock()

    this.gltf = gltf

    toRaw(this).startRender()
  }
}
