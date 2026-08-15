// 場景本體：室內（溫暖的家）與戶外（秘密庭園）的地板、牆、窗、天空、天氣，
// 以及花園裡會長大的花草樹木。成長規則仍由 data/garden.js 決定，這裡只負責「長什麼樣」。
import * as THREE from 'three'
import { PLANT_KINDS, bloomKind } from '../data/garden'

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

  // 窗戶。2D 版的窗戶裡有一整個世界（太陽/月亮、雲、遠山、彩虹、飛過的訪客、雨雪），
  // 3D 版原本只有一片會隨晝夜換色的純色平面 —— 使用者回報「效果不明顯」，
  // 主因是裡面什麼都沒有，其次才是太小（原本 1.5 寬對上 9.6 的牆＝只佔 16%）。
  const win = new THREE.Group()
  win.position.set(1.6, 1.85, CZ - D / 2 + 0.03)
  const WW = 3.2, WH = 2.2       // 佔後牆寬的 33%、高的 69%，才看得出是一扇窗而不是一塊補丁
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(WW, WH), new THREE.MeshBasicMaterial({ color: 0xbfe6ff }))
  win.add(sky)
  // 窗外景物：z 往房間方向疊上去，數字越大越靠前
  const flat = (mesh, x, y, z) => { mesh.position.set(x, y, z); win.add(mesh); return mesh }
  // 遠山：三片壓扁的圓，貼在窗戶下緣。下雪時整片換成雪白（由 RoomWorld3D 依天氣改色），
  // 光靠飄下來的雪粒子看不出「外面在下雪」，地上要積雪才有雪景。
  const hills = []
  for (const [x, r] of [[-0.75, 0.85], [0.15, 1.0], [0.95, 0.8]]) {
    const hill = new THREE.Mesh(new THREE.CircleGeometry(r, 18), M('#8FBF7A'))
    hill.scale.y = 0.45
    hills.push(flat(hill, x, -WH / 2 + 0.02, 0.004))
  }
  // 太陽／月亮：顏色由 applyPhase 換（白天暖黃、夜裡淡白）
  const orb = new THREE.Mesh(new THREE.CircleGeometry(0.26, 20), new THREE.MeshBasicMaterial({ color: 0xffe27a }))
  flat(orb, -0.95, 0.6, 0.006)
  // 雲：每朵用三顆圓疊出蓬鬆感，一片扁的長方形做不出雲。
  // 每朵各自一個 Group 並記下來，讓 RoomWorld3D 逐幀往右飄、飄出窗框就從左邊回來。
  const puffs = []
  const clouds = []
  for (const [cx, cy, cs] of [[0.5, 0.68, 1.15], [-0.25, 0.2, 0.85], [1.0, 0.0, 0.7]]) {
    const cloud = new THREE.Group()
    for (const [dx, dy, r] of [[-0.16, 0, 0.15], [0, 0.05, 0.2], [0.17, -0.01, 0.14]]) {
      const puff = new THREE.Mesh(new THREE.CircleGeometry(r, 14), M('#FFFFFF', { transparent: true, opacity: 0.92 }))
      puff.position.set(dx, dy, 0)
      cloud.add(puff)
      puffs.push(puff)
    }
    cloud.scale.setScalar(cs)
    clouds.push(flat(cloud, cx, cy, 0.008))
  }

  // 窗外的訪客：白天是飛過的小鳥、夜裡是劃過的流星（2D 版的 rw-visitor，3D 補上）。
  // 平常整組 visible=false，由 RoomWorld3D 每隔一段時間放牠飛一趟。
  const visitor = new THREE.Group()
  const bird = new THREE.Group()
  for (const sx of [-1, 1]) {          // 兩片翅膀：壓扁的半圓，就是遠處小鳥的剪影
    const wing = new THREE.Mesh(new THREE.CircleGeometry(0.075, 10, 0, Math.PI), M('#4A5A6A'))
    wing.position.x = sx * 0.055
    wing.scale.set(1, 0.5, 1)
    bird.add(wing)
  }
  const star = new THREE.Group()      // 流星：亮點＋往後拖的尾巴
  const head = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), M('#FFFFFF'))
  star.add(head)
  const tail = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.03), M('#FFF3B0', { transparent: true, opacity: 0.7 }))
  tail.position.set(0.19, 0.05, 0)
  tail.rotation.z = 0.28
  star.add(tail)
  star.visible = false
  visitor.add(bird, star)
  visitor.visible = false
  flat(visitor, 0, 0.5, 0.009)
  // 彩虹：半圈圓環，只有彩虹天氣才顯示（由 RoomWorld3D 切 visible）
  const bow = new THREE.Group()
  for (const [i, c] of ['#FF6B6B', '#FFB86B', '#FFE66B', '#7BD88F', '#6BC5FF', '#B07BFF'].entries()) {
    const arc = new THREE.Mesh(new THREE.RingGeometry(0.52 - i * 0.055, 0.57 - i * 0.055, 22, 1, 0, Math.PI), M(c))
    bow.add(arc)
  }
  bow.visible = false
  flat(bow, 0.2, -WH / 2 + 0.06, 0.007)
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(WW + 0.14, WH + 0.14), M('#FFF6E8'))
  frame.position.z = -0.01
  win.add(frame)
  for (const [w, h] of [[WW, 0.06], [0.06, WH]]) {
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M('#FFF6E8'))
    bar.position.z = 0.02
    win.add(bar)
  }
  const sill = new THREE.Mesh(new THREE.BoxGeometry(WW + 0.3, 0.08, 0.16), M('#E0CDB0'))
  sill.position.set(0, -WH / 2 - 0.1, 0.06)
  win.add(sill)
  g.userData.winHills = hills
  g.userData.winPuffs = puffs
  g.userData.winClouds = clouds
  g.userData.winOrb = orb
  g.userData.winBow = bow
  // 窗戶的可見範圍：雲與訪客飄到這個界線外就要繞回來／收起來，不然會浮在牆上
  g.userData.winSpan = WW / 2
  g.userData.winVisitor = { group: visitor, bird, star }
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

  // 庭園燈：夜裡可以手動點亮（開關在畫面右下）。放在後方角落，不擋寵物活動範圍。
  const lamp = new THREE.Group()
  lamp.position.set(-3.7, 0, -1.4)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8), M('#4A4038'))
  post.position.y = 0.75
  lamp.add(post)
  const globeMat = new THREE.MeshBasicMaterial({ color: 0x8F8A7C })
  const globe = new THREE.Mesh(ball(0.2), globeMat)
  globe.position.y = 1.6
  lamp.add(globe)
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.2, 10), M('#4A4038'))
  cap.position.y = 1.82
  lamp.add(cap)
  const gardenLight = new THREE.PointLight(0xffd9a0, 0, 14, 1.4)
  gardenLight.position.y = 1.55
  lamp.add(gardenLight)
  g.add(lamp)
  // 介面跟室內吸頂燈一樣，RoomWorld3D 兩邊共用同一段開關邏輯
  g.userData.roomLamp = (on) => {
    gardenLight.intensity = on ? 16 : 0
    globeMat.color.set(on ? 0xfff0c8 : 0x8f8a7c)
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

// 擺出來當裝飾的花：陶花瓶＋一朵花。顏色沿用該花色所屬花種的色系（跟 buildPlant 同一套），
// 所以 2D 看到的是哪一朵、3D 就是同一個色系，不會兩邊對不起來。
const VASE_BLOOM = { flower: '#FF8FB1', rare: '#E0466E', tree: '#4E9A38', magic: '#B388FF' }
export function buildFlowerDeco(f) {
  const g = new THREE.Group()
  g.userData.pick = { type: 'flowerdeco', key: f.key }

  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.06, 0.17, 10), M('#C98A52'))
  vase.position.y = 0.085
  g.add(vase)
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.016, 6, 12), M('#B0743F'))
  lip.position.y = 0.17
  lip.rotation.x = Math.PI / 2
  g.add(lip)

  const top = new THREE.Group()
  top.position.y = 0.31
  g.add(top)
  g.userData.sway = top          // 跟植物一樣會輕輕搖

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6), M('#5FA347'))
  stem.position.y = -0.08
  top.add(stem)

  const col = VASE_BLOOM[bloomKind(f.emoji)] || VASE_BLOOM.flower
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const petal = new THREE.Mesh(ball(0.055, 8), M(col))
    petal.position.set(Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07)
    petal.scale.set(1, 0.5, 1)
    top.add(petal)
  }
  top.add(new THREE.Mesh(ball(0.04, 8), M('#FFE9A0')))
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
  // 開燈時螢火蟲要變得不明顯 —— 亮處本來就看不太到螢火蟲
  let muted = false
  const update = (dt, t) => {
    for (const b of bugs) {
      const s = b.userData.seed
      // ⚠️ 要乘 dt。原本是每「幀」加固定值，120Hz 的平板會飄得比 60Hz 遠一倍
      b.position.x += Math.sin(t * 0.7 + s) * 0.24 * dt
      b.position.y += Math.cos(t * 0.9 + s * 1.7) * 0.18 * dt
      b.material.opacity = (0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4 + s * 3))) * (muted ? 0.22 : 1)
    }
  }
  return { group: g, update, setMuted: (on) => { muted = on } }
}

export const themeOf = (id) => THEMES[id] || THEMES.null
