// 場景本體：室內（溫暖的家）與戶外（秘密庭園）的地板、牆、窗、天空、天氣，
// 以及花園裡會長大的花草樹木。成長規則仍由 data/garden.js 決定，這裡只負責「長什麼樣」。
import * as THREE from 'three'
import { PLANT_KINDS } from '../data/garden'

const M = (c, o) => new THREE.MeshLambertMaterial({ color: c, ...o })
const ball = (r, s = 10) => new THREE.SphereGeometry(r, s, s - 2)

// 主題壁紙：整室換色（對應 shop 的 theme_forest / theme_ocean / theme_space）
const THEMES = {
  forest: { wall: '#4E6B4A', wall2: '#3E5A3C', floor: '#8A6A44', ground: '#5C8A4A' },
  ocean:  { wall: '#3A6B8A', wall2: '#2E587A', floor: '#C9B79C', ground: '#4A8AA0' },
  space:  { wall: '#2A2440', wall2: '#1E1A32', floor: '#3A3358', ground: '#2E2A48' },
  null:   { wall: '#F3DFC6', wall2: '#E6CEB0', floor: '#C08A52', ground: '#7CB85C' },
}

// 晝夜：直接調燈光顏色與強度，室內外共用
export const PHASE_LIGHT = {
  morning: { hemiSky: 0xfff3e0, hemiGround: 0xc9b79c, hemi: 1.5, key: 0xffffff, keyI: 1.5, bg: '#FFE9C9' },
  day:     { hemiSky: 0xffffff, hemiGround: 0x99aabb, hemi: 1.6, key: 0xffffff, keyI: 1.6, bg: '#BFE6FF' },
  evening: { hemiSky: 0xffcc99, hemiGround: 0x8a6a5a, hemi: 1.2, key: 0xffa860, keyI: 1.3, bg: '#FFC08A' },
  night:   { hemiSky: 0x5566aa, hemiGround: 0x222244, hemi: 0.6, key: 0x8899dd, keyI: 0.5, bg: '#2A3358' },
}

/** 室內：地板＋兩面牆＋窗戶（窗外天空會隨晝夜天氣變色）＋地毯 */
export function buildRoom(theme) {
  const t = THEMES[theme] || THEMES.null
  const g = new THREE.Group()
  const W = 9.6, D = 6.4, CZ = 0.3          // 涵蓋家具座標換算後的範圍（x ±4.3、z −2.0~2.8）

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), M(t.floor))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = CZ
  g.add(floor)

  // 地板木紋（幾條深色細線就夠，等角視角看得到方向感）
  for (let i = -4; i <= 4; i++) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(W, 0.02), M('#000000', { transparent: true, opacity: 0.12 }))
    line.rotation.x = -Math.PI / 2
    line.position.set(0, 0.002, CZ + i * 0.72)
    g.add(line)
  }

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, 3.2), M(t.wall))
  backWall.position.set(0, 1.6, CZ - D / 2)
  g.add(backWall)

  const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(D, 3.2), M(t.wall2))
  sideWall.rotation.y = Math.PI / 2
  sideWall.position.set(-W / 2, 1.6, CZ)
  g.add(sideWall)

  // 窗戶：外框＋天空面（顏色由 applyPhase 控制）＋窗台
  const win = new THREE.Group()
  win.position.set(1.6, 1.8, CZ - D / 2 + 0.03)
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), new THREE.MeshBasicMaterial({ color: 0xbfe6ff }))
  win.add(sky)
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 1.22), M('#FFF6E8'))
  frame.position.z = -0.01
  win.add(frame)
  for (const [w, h] of [[1.5, 0.05], [0.05, 1.1]]) {
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M('#FFF6E8'))
    bar.position.z = 0.01
    win.add(bar)
  }
  const sill = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.16), M('#E0CDB0'))
  sill.position.set(0, -0.62, 0.06)
  win.add(sill)
  win.userData.pick = { type: 'window' }
  g.add(win)

  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), M('#F2C9D8'))
  rug.rotation.x = -Math.PI / 2
  rug.position.set(-0.4, 0.004, 0.4)
  g.add(rug)

  // 吸頂燈：夜裡自動亮，不必等玩家買檯燈（不然晚上進房間只看得到一片藍黑）。
  // 掛高、靠後牆，讓它畫在牆面上而不是蓋住地板上的寵物。
  const lamp = new THREE.Group()
  lamp.position.set(0, 2.9, CZ - 1.1)
  lamp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.36, 6), M('#8A7A66')))
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.46, 0.34, 20, 1, true),
    M('#F6E3C0', { side: THREE.DoubleSide })
  )
  shade.position.y = -0.35
  lamp.add(shade)
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff0c8 })
  const bulb = new THREE.Mesh(ball(0.15), bulbMat)
  bulb.position.y = -0.46
  lamp.add(bulb)
  const bulbLight = new THREE.PointLight(0xffd9a0, 0, 16, 1.5)
  bulbLight.position.y = -0.5
  lamp.add(bulbLight)
  g.add(lamp)

  g.userData.sky = sky
  // 交出一個開關函式而不是燈本身：呼叫端只要 roomLamp(true/false)，不必知道裡面有幾個東西要改
  g.userData.roomLamp = (on) => {
    bulbLight.intensity = on ? 14 : 0
    bulbMat.color.set(on ? 0xfff0c8 : 0xdcd6c8)
  }
  return g
}

/** 戶外：草地＋遠景樹叢＋天空背板 */
export function buildGarden(theme) {
  const t = THEMES[theme] || THEMES.null
  const g = new THREE.Group()

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(10.4, 7.2), M(t.ground))
  ground.rotation.x = -Math.PI / 2
  ground.position.z = 0.3
  g.add(ground)

  // 草地色塊，讓地面不要死板
  for (let i = 0; i < 16; i++) {
    const p = new THREE.Mesh(new THREE.CircleGeometry(0.3 + Math.random() * 0.45, 10), M(i % 2 ? '#6FA84E' : '#88C263'))
    p.rotation.x = -Math.PI / 2
    p.position.set((Math.random() - 0.5) * 9, 0.003, 0.3 + (Math.random() - 0.5) * 6)
    g.add(p)
  }

  // 天空背板（大片，擋住背景）
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(20, 11), new THREE.MeshBasicMaterial({ color: 0xbfe6ff }))
  sky.position.set(0, 4, -4.2)
  g.add(sky)

  // 遠景樹叢
  for (const [x, z, s] of [[-3.8, -3.0, 1.15], [-2.6, -3.3, 0.85], [3.0, -3.1, 1.05], [4.0, -2.7, 0.8]]) {
    const tree = new THREE.Group()
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * s, 0.11 * s, 0.6 * s, 7), M('#7A5A3A'))
    trunk.position.y = 0.3 * s
    tree.add(trunk)
    for (const [ox, oy, oz, r] of [[0, 0.75, 0, 0.42], [-0.24, 0.62, 0.1, 0.3], [0.24, 0.66, -0.08, 0.32]]) {
      const c = new THREE.Mesh(ball(r * s), M('#4E8C3C'))
      c.position.set(ox * s, oy * s, oz * s)
      tree.add(c)
    }
    tree.position.set(x, 0, z)
    g.add(tree)
  }

  g.userData.sky = sky
  return g
}

/** 一株花／樹：外觀依澆水次數推進，跟 data/garden.js 的 plantView 對齊 */
export function buildPlant(p, view) {
  const cfg = PLANT_KINDS[p.kind] || PLANT_KINDS.flower
  const wc = p.waterCount || 0
  const g = new THREE.Group()
  g.userData.pick = { type: 'plant', key: p.key }

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.05, 10), M('#7A5A3A'))
  soil.position.y = 0.025
  g.add(soil)

  if (wc === 0) {                                   // 🌱 剛種下
    const sprout = new THREE.Mesh(ball(0.06, 8), M('#8BD17C'))
    sprout.position.y = 0.1
    sprout.scale.set(0.6, 1.4, 0.6)
    g.add(sprout)
    g.userData.sway = sprout
    return g
  }

  const isTree = p.kind === 'tree'
  // 每澆一次水就長高一截，讓安安看得出「今天有進度」（樹苗尤其需要，它要澆 3 天）
  const prog = Math.min(wc / (cfg.need || 1), 1)
  const h = isTree ? 0.3 + prog * 0.62 : 0.16 + prog * 0.28
  const girth = isTree ? 0.04 + prog * 0.035 : 0.02

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(girth, girth * 1.5, h, 7),
    M(isTree ? '#7A5A3A' : '#5FA347')
  )
  stem.position.y = h / 2 + 0.04
  g.add(stem)

  const top = new THREE.Group()
  top.position.y = h + 0.04
  g.add(top)
  g.userData.sway = top

  if (isTree) {
    // 還沒長成大樹前，先冒出小小的樹冠，一次比一次大
    if (!view?.bloomed) {
      const r = 0.1 + prog * 0.14
      for (const [ox, oz] of [[0, 0], [-0.11, 0.06], [0.1, -0.05]]) {
        const c = new THREE.Mesh(ball(r, 8), M('#5FA347'))
        c.position.set(ox, 0.02, oz)
        top.add(c)
      }
    }
  } else for (const sx of [-1, 1]) {                  // 葉子
    const leaf = new THREE.Mesh(ball(0.08, 8), M('#6FBB58'))
    leaf.position.set(sx * 0.09, -h * 0.42, 0)
    leaf.scale.set(1.5, 0.34, 0.8)
    top.add(leaf)
  }

  if (view?.bloomed) {
    if (isTree) {
      for (const [ox, oy, oz, r] of [[0, 0.12, 0, 0.34], [-0.24, 0.02, 0.08, 0.24], [0.24, 0.05, -0.06, 0.26]]) {
        const c = new THREE.Mesh(ball(r), M('#4E9A38'))
        c.position.set(ox, oy, oz)
        top.add(c)
      }
    } else {
      // 花瓣顏色沿用該花種的色系，v 決定是哪一朵
      const COLORS = { flower: ['#FF8FB1', '#FFD93D', '#FF9EC7', '#FFB86B', '#FF6F91'],
                       rare: ['#E0466E', '#C77DFF', '#FF7AA2', '#F4A0C0'],
                       magic: ['#7BE0FF', '#FFE066', '#B388FF'] }
      const list = COLORS[p.kind] || COLORS.flower
      const col = list[(p.v || 0) % list.length]
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        const petal = new THREE.Mesh(ball(0.075, 8), M(col))
        petal.position.set(Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1)
        petal.scale.set(1, 0.5, 1)
        top.add(petal)
      }
      const core = new THREE.Mesh(ball(0.055, 8), M('#FFE9A0'))
      top.add(core)
    }
  } else if (view?.ready) {                          // 🔮 魔法花等答題
    const orb = new THREE.Mesh(ball(0.12, 12), new THREE.MeshBasicMaterial({ color: 0xb388ff, transparent: true, opacity: 0.85 }))
    top.add(orb)
    g.userData.pulse = orb
  } else if (cfg.bud && wc === cfg.need - 1) {       // 稀有花的花苞
    const bud = new THREE.Mesh(ball(0.09, 8), M('#F07AA8'))
    bud.scale.set(0.8, 1.4, 0.8)
    top.add(bud)
  }

  // 今天還沒澆水 → 頭上冒個小水滴提示（比照 2D 版的 room-plant-thirsty）
  g.userData.thirstyAnchor = top
  return g
}

/** 天氣特效：雨、雪、彩虹（回傳含 update 的物件，掛在 root 上） */
export function buildWeather(kind) {
  if (kind === 'rainbow') {
    const g = new THREE.Group()
    const cols = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA']
    cols.forEach((c, i) => {
      const t = new THREE.Mesh(
        new THREE.TorusGeometry(2.4 + i * 0.16, 0.08, 6, 28, Math.PI),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.55 })
      )
      t.position.set(0, 0.2, -3.2)
      g.add(t)
    })
    return { group: g, update: () => {} }
  }
  if (kind !== 'rain' && kind !== 'snow') return null

  const N = kind === 'rain' ? 260 : 160
  const pos = new Float32Array(N * 3)
  const spread = { x: 9, y: 6, z: 7 }
  for (let i = 0; i < N; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * spread.x
    pos[i * 3 + 1] = Math.random() * spread.y
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread.z
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    color: kind === 'rain' ? 0x9FD8F5 : 0xffffff,
    size: kind === 'rain' ? 0.05 : 0.08,
    transparent: true,
    opacity: kind === 'rain' ? 0.7 : 0.9,
    depthWrite: false,
  }))
  const speed = kind === 'rain' ? 6 : 1.1
  const update = (dt, t) => {
    const a = geo.attributes.position
    for (let i = 0; i < N; i++) {
      a.array[i * 3 + 1] -= speed * dt
      if (kind === 'snow') a.array[i * 3] += Math.sin(t + i) * 0.004
      if (a.array[i * 3 + 1] < 0) a.array[i * 3 + 1] = spread.y
    }
    a.needsUpdate = true
  }
  const g = new THREE.Group()
  g.add(points)
  return { group: g, update }
}

/** 夜晚庭園的螢火蟲 */
export function buildFireflies(n = 18) {
  const g = new THREE.Group()
  const bugs = []
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 6, 5),
      new THREE.MeshBasicMaterial({ color: 0xdfff8a, transparent: true, opacity: 0.9 })
    )
    b.position.set((Math.random() - 0.5) * 6, 0.3 + Math.random() * 1.1, (Math.random() - 0.5) * 4)
    b.userData.seed = Math.random() * 10
    g.add(b)
    bugs.push(b)
  }
  const update = (dt, t) => {
    for (const b of bugs) {
      const s = b.userData.seed
      b.position.x += Math.sin(t * 0.7 + s) * 0.004
      b.position.y += Math.cos(t * 0.9 + s * 1.7) * 0.003
      b.material.opacity = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4 + s * 3))
    }
  }
  return { group: g, update }
}

export const themeOf = (id) => THEMES[id] || THEMES.null
