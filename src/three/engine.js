// 3D 引擎底座：一個 renderer、等角正交相機、燈光、render loop。
// 座標沿用遊戲原本的百分比系統（x 0~100 左右、y 40~90 前後），由 toWorld() 換算成世界座標，
// 這樣 gameStore 的存檔格式（家具座標、花園座標）一個欄位都不用改。
import * as THREE from 'three'

// 中心點取寵物與家具活動範圍的中間（x 2~88、y 38~86），讓畫面不會偏一邊
export const U = 0.10                              // 1% ≒ 0.10 世界單位
const CX = 45, CZ = 58
export const toWorldX = (px) => (px - CX) * U
export const toWorldZ = (py) => (py - CZ) * U
export const toPctX   = (wx) => wx / U + CX
export const toPctY   = (wz) => wz / U + CZ

// 2D 版的規則：y < 38 的家具是掛在牆上的，其餘落地（見 HomeRoomScreen 的 isFloorItem）
export const WALL_Y = 38
export const isWallItem = (py) => py < WALL_Y
// 牆上家具的高度：越靠畫面上方掛越高
export const toWallHeight = (py) => 2.5 - (py / WALL_Y) * 1.5

// 等角視角：相機固定，安安不會轉到看不見東西、也不用做碰撞偵測
const VIEW = 7.2                                    // 正交相機的可視高度（世界單位）
const CAM_DIR = new THREE.Vector3(6, 7.5, 9).normalize()

export function createEngine(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))   // 平板上限 2，再高只是燒 GPU
  renderer.shadowMap.enabled = false                      // 不用即時陰影，改用假影子貼片（省很多）
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.copy(CAM_DIR).multiplyScalar(20)
  camera.lookAt(0, 0, 0)

  // 三盞燈就夠：半球光給環境色、方向光給立體感、補光消死黑
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.5)
  const key  = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(5, 10, 6)
  const fill = new THREE.DirectionalLight(0xffffff, 0.5)
  fill.position.set(-6, 4, -4)
  scene.add(hemi, key, fill)

  const root = new THREE.Group()                    // 場景內容都掛這裡，切換場景時整個換掉
  scene.add(root)

  const resize = () => {
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    const aspect = w / h
    camera.left = -VIEW * aspect / 2
    camera.right = VIEW * aspect / 2
    camera.top = VIEW / 2
    camera.bottom = -VIEW / 2
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  // ── render loop：把每幀的更新工作交給註冊進來的 tick ──
  const ticks = new Set()
  const onTick = (fn) => { ticks.add(fn); return () => ticks.delete(fn) }

  let raf = 0
  let last = performance.now()
  let running = true
  const loop = (now) => {
    raf = requestAnimationFrame(loop)
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.1)   // 切分頁回來時 dt 會爆掉，夾住
    last = now
    for (const fn of ticks) fn(dt, now / 1000)
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(loop)

  // iPad Safari 偶爾會掉 WebGL context，掉了要停手、回來要繼續（不然整片黑畫面）
  const onLost = (e) => { e.preventDefault(); running = false }
  const onRestored = () => { resize(); running = true }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  // 切到背景就停算，回前景再跑（平板省電）
  const onVis = () => { running = !document.hidden; last = performance.now() }
  document.addEventListener('visibilitychange', onVis)

  // ── 點擊 → 射線偵測（取代原本的滑鼠座標換算）──
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const hitPoint = new THREE.Vector3()

  const setRay = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect()
    ndc.x = ((clientX - r.left) / r.width) * 2 - 1
    ndc.y = -((clientY - r.top) / r.height) * 2 + 1
    ray.setFromCamera(ndc, camera)
  }
  // 螢幕座標 → 地板上的百分比座標（種花、丟零食、拖曳家具都用這個）
  const pickFloor = (clientX, clientY) => {
    setRay(clientX, clientY)
    if (!ray.ray.intersectPlane(floorPlane, hitPoint)) return null
    return { x: toPctX(hitPoint.x), y: toPctY(hitPoint.z) }
  }
  // 螢幕座標 → 最近的可互動物件（物件上掛 userData.pick 當識別）
  const pickObject = (clientX, clientY) => {
    setRay(clientX, clientY)
    for (const hit of ray.intersectObjects(root.children, true)) {
      let o = hit.object
      while (o && !o.userData?.pick) o = o.parent
      if (o?.userData?.pick) return { ...o.userData.pick, point: hit.point }
    }
    return null
  }

  const dispose = () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    canvas.removeEventListener('webglcontextlost', onLost)
    canvas.removeEventListener('webglcontextrestored', onRestored)
    document.removeEventListener('visibilitychange', onVis)
    scene.traverse((o) => {
      o.geometry?.dispose()
      const m = o.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m?.dispose()
    })
    renderer.dispose()
  }

  return { renderer, scene, camera, root, onTick, pickFloor, pickObject, resize, dispose, lights: { hemi, key, fill } }
}

// 清空一個 Group 底下所有東西並釋放記憶體（切場景時用）
export function clearGroup(g) {
  for (const child of [...g.children]) {
    child.traverse?.((o) => {
      o.geometry?.dispose()
      const m = o.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m?.dispose()
    })
    g.remove(child)
  }
}
