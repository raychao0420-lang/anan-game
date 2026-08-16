// 家具的程式化建模。可擺放的家具其實只有 29 件（shop.js 的 home 分類扣掉 3 個主題壁紙），
// 這裡逐件用基本幾何體組出來；沒建模的走 standee()——像紙板立牌一樣把 emoji 立在小底座上，
// 在等角視角下看起來是刻意的模型玩具，不會像飄在半空的平面貼圖。
import * as THREE from 'three'
import { SHOP_ITEMS } from '../data/shop'

const M = (c, o) => new THREE.MeshLambertMaterial({ color: c, ...o })
const box = (g, w, h, d, c, x, y, z, rot) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), c instanceof THREE.Material ? c : M(c))
  m.position.set(x, y, z)
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0)
  g.add(m); return m
}
const cyl = (g, rt, rb, h, c, x, y, z, seg = 10, rot) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), c instanceof THREE.Material ? c : M(c))
  m.position.set(x, y, z)
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0)
  g.add(m); return m
}
const sph = (g, r, c, x, y, z, sc, seg = 10) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg - 2), c instanceof THREE.Material ? c : M(c))
  m.position.set(x, y, z)
  if (sc) m.scale.set(sc[0], sc[1], sc[2])
  g.add(m); return m
}
const cone = (g, r, h, c, x, y, z, seg = 8, rot) => {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), c instanceof THREE.Material ? c : M(c))
  m.position.set(x, y, z)
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0)
  g.add(m); return m
}
// 會發光的東西用 Basic 材質，不吃燈光，夜裡才亮得起來
const glowMat = (c, o = 0.9) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o })

// ── emoji 立牌（沒建模的家具走這條）──────────────────────────────────────────
function standee(emoji, h = 0.6) {
  const g = new THREE.Group()
  const cv = document.createElement('canvas')
  cv.width = cv.height = 128
  const ctx = cv.getContext('2d')
  ctx.font = '96px system-ui, "Apple Color Emoji", "Segoe UI Emoji"'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, 64, 70)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(h, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide })
  )
  plate.position.y = h * 0.55 + 0.04
  plate.rotation.y = -Math.PI / 5          // 微微轉向相機，看起來像立牌不像貼紙
  g.add(plate)
  cyl(g, h * 0.3, h * 0.34, 0.07, '#C9B79C', 0, 0.035, 0, 12)
  return g
}

// ── 逐件家具 ────────────────────────────────────────────────────────────────
const BUILD = {
  sofa: () => { const g = new THREE.Group()
    box(g, 0.9, 0.26, 0.42, '#FF9EBB', 0, 0.2, 0)
    box(g, 0.9, 0.3, 0.14, '#FF86A9', 0, 0.34, -0.2)
    box(g, 0.16, 0.34, 0.42, '#FF86A9', -0.46, 0.3, 0)
    box(g, 0.16, 0.34, 0.42, '#FF86A9', 0.46, 0.3, 0)
    box(g, 0.24, 0.14, 0.1, '#FFDCE7', -0.2, 0.38, -0.12)
    box(g, 0.24, 0.14, 0.1, '#FFDCE7', 0.2, 0.38, -0.12)
    for (const x of [-0.4, 0.4]) for (const z of [-0.16, 0.16]) box(g, 0.07, 0.14, 0.07, '#C96A86', x, 0.07, z)
    return g },

  plant: () => { const g = new THREE.Group()
    cyl(g, 0.17, 0.13, 0.2, '#D98E5A', 0, 0.1, 0, 10)
    cyl(g, 0.19, 0.19, 0.05, '#C47A48', 0, 0.21, 0, 10)
    for (const [x, y, z, r] of [[0, 0.42, 0, 0.2], [-0.14, 0.34, 0.06, 0.14], [0.14, 0.36, -0.05, 0.15], [0.03, 0.55, -0.04, 0.12]])
      sph(g, r, '#7CC26A', x, y, z)
    return g },

  pet_bed: () => { const g = new THREE.Group()
    cyl(g, 0.34, 0.32, 0.1, '#9C7BE8', 0, 0.05, 0, 14)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.07, 8, 18), M('#B69BF0'))
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; g.add(ring)
    cyl(g, 0.26, 0.26, 0.03, '#F2E9FF', 0, 0.11, 0, 14)
    return g },

  tent: () => { const g = new THREE.Group()
    cone(g, 0.46, 0.68, '#E8734A', 0, 0.34, 0, 4, [0, Math.PI / 4, 0])
    box(g, 0.2, 0.34, 0.02, '#3A2418', 0, 0.17, 0.32)
    sph(g, 0.05, '#FFD166', 0, 0.7, 0)
    return g },

  painting: () => { const g = new THREE.Group()
    box(g, 0.5, 0.4, 0.04, '#B98A5E', 0, 0.62, 0)
    box(g, 0.42, 0.32, 0.01, '#87CEEB', 0, 0.62, 0.03)
    cone(g, 0.1, 0.14, '#7CC26A', -0.08, 0.56, 0.04, 6)
    sph(g, 0.05, '#FFD166', 0.12, 0.7, 0.04)
    cyl(g, 0.03, 0.03, 0.6, '#8A7A66', 0, 0.3, -0.02, 6)
    return g },

  rainbow: () => { const g = new THREE.Group()
    const cols = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA']
    cols.forEach((c, i) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.34 + i * 0.055, 0.026, 6, 20, Math.PI), M(c))
      t.position.y = 0.02; g.add(t)
    })
    return g },

  disco: () => { const g = new THREE.Group()
    cyl(g, 0.012, 0.012, 0.36, '#666', 0, 0.72, 0, 6)
    const b = sph(g, 0.16, '#C8D4E0', 0, 0.48, 0, null, 12)
    b.material = new THREE.MeshLambertMaterial({ color: '#C8D4E0', emissive: '#334455' })
    b.userData.spin = 1.6
    return g },

  fish_tank: () => { const g = new THREE.Group()
    box(g, 0.5, 0.06, 0.28, '#6B5844', 0, 0.03, 0)
    const water = box(g, 0.48, 0.34, 0.26, M('#4DC4E8', { transparent: true, opacity: 0.55 }), 0, 0.23, 0)
    water.renderOrder = 1
    box(g, 0.48, 0.03, 0.26, '#E8D9B8', 0, 0.08, 0)
    sph(g, 0.05, '#FF8C42', -0.1, 0.24, 0.02, [1.4, 1, 0.6])
    sph(g, 0.04, '#FFD166', 0.12, 0.3, -0.02, [1.4, 1, 0.6])
    cone(g, 0.05, 0.16, '#4CAF50', 0.16, 0.17, 0.04, 6)
    return g },

  pool: () => { const g = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 22), M('#4FC3F7'))
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; g.add(ring)
    const w = cyl(g, 0.48, 0.48, 0.14, M('#29B6F6', { transparent: true, opacity: 0.8 }), 0, 0.08, 0, 20)
    w.userData.ripple = true
    return g },

  mushroom_lamp: () => { const g = new THREE.Group()
    cyl(g, 0.07, 0.1, 0.26, '#FFF3E0', 0, 0.13, 0, 10)
    sph(g, 0.22, '#E85D5D', 0, 0.28, 0, [1, 0.66, 1], 12)
    for (const [x, z] of [[-0.1, 0.08], [0.1, 0.04], [0, -0.11]]) sph(g, 0.04, '#FFF6E8', x, 0.36, z, [1, 0.4, 1], 6)
    const light = new THREE.PointLight(0xffc078, 0, 1.4)
    light.position.y = 0.3; g.add(light); g.userData.lamp = light
    return g },

  bamboo: () => { const g = new THREE.Group()
    for (const [x, z, h] of [[0, 0, 0.9], [-0.13, 0.08, 0.72], [0.12, -0.06, 0.8]]) {
      for (let i = 0; i < 4; i++) cyl(g, 0.035, 0.035, h / 4 - 0.02, '#7CB342', x, h / 8 + i * (h / 4), z, 7)
      sph(g, 0.1, '#9CCC65', x + 0.06, h * 0.86, z, [1.6, 0.25, 0.6])
      sph(g, 0.09, '#8BC34A', x - 0.06, h * 0.94, z, [1.6, 0.25, 0.6])
    }
    return g },

  bird_perch: () => { const g = new THREE.Group()
    cyl(g, 0.11, 0.14, 0.04, '#8A6A44', 0, 0.02, 0, 10)
    cyl(g, 0.02, 0.02, 0.66, '#A0764C', 0, 0.35, 0, 7)
    cyl(g, 0.016, 0.016, 0.36, '#A0764C', 0, 0.6, 0, 7, [0, 0, Math.PI / 2])
    cyl(g, 0.05, 0.05, 0.03, '#C9B79C', 0.13, 0.66, 0, 8)
    return g },

  fairy_light: () => { const g = new THREE.Group()
    const cols = ['#FFD166', '#FF9EAA', '#8ED8F8', '#B6E36B']
    for (let i = 0; i < 9; i++) {
      const t = (i / 8 - 0.5) * 1.1
      const b = sph(g, 0.036, glowMat(cols[i % 4]), t, 0.62 - Math.cos(t * 2.4) * 0.09, 0, null, 6)
      b.userData.twinkle = i
    }
    return g },

  snow_globe: () => { const g = new THREE.Group()
    cyl(g, 0.16, 0.19, 0.1, '#8A6A44', 0, 0.05, 0, 12)
    sph(g, 0.2, M('#DDF2FF', { transparent: true, opacity: 0.42 }), 0, 0.26, 0, null, 14)
    cone(g, 0.08, 0.18, '#4CAF50', 0, 0.22, 0, 6)
    return g },

  igloo: () => { const g = new THREE.Group()
    sph(g, 0.42, '#EAF4FF', 0, 0.02, 0, [1, 0.8, 1], 14)
    const d = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.06, 6, 12, Math.PI), M('#DCEBFA'))
    d.position.set(0, 0.06, 0.4); g.add(d)
    box(g, 0.2, 0.16, 0.08, '#2C3E50', 0, 0.08, 0.4)
    return g },

  castle: () => { const g = new THREE.Group()
    box(g, 0.56, 0.42, 0.36, '#D9CBB2', 0, 0.21, 0)
    for (const x of [-0.32, 0.32]) {
      cyl(g, 0.13, 0.14, 0.62, '#E5D8C0', x, 0.31, 0, 10)
      cone(g, 0.17, 0.22, '#5B7DB1', x, 0.73, 0, 8)
    }
    box(g, 0.16, 0.22, 0.04, '#6B4A2E', 0, 0.11, 0.19)
    for (let i = -1; i <= 1; i++) box(g, 0.09, 0.09, 0.36, '#D9CBB2', i * 0.16, 0.46, 0)
    return g },

  hot_spring: () => { const g = new THREE.Group()
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2
      sph(g, 0.1, '#8D8378', Math.cos(a) * 0.44, 0.05, Math.sin(a) * 0.44, [1, 0.7, 1], 7)
    }
    const w = cyl(g, 0.4, 0.4, 0.1, M('#7FD8C8', { transparent: true, opacity: 0.85 }), 0, 0.06, 0, 18)
    w.userData.ripple = true
    for (let i = 0; i < 3; i++) {
      const s = sph(g, 0.07, M('#FFFFFF', { transparent: true, opacity: 0.3 }), (i - 1) * 0.14, 0.2, 0, null, 6)
      s.userData.steam = i
    }
    return g },

  piano: () => { const g = new THREE.Group()
    box(g, 0.62, 0.28, 0.34, '#2C2C34', 0, 0.28, 0)
    box(g, 0.58, 0.05, 0.14, '#FFFDF5', 0, 0.44, 0.14)
    for (let i = 0; i < 8; i++) box(g, 0.03, 0.05, 0.08, '#1A1A20', -0.24 + i * 0.07, 0.47, 0.12)
    box(g, 0.66, 0.03, 0.36, '#3A3A44', 0, 0.43, -0.04, [-0.16, 0, 0])
    for (const x of [-0.26, 0.26]) for (const z of [-0.12, 0.12]) box(g, 0.05, 0.28, 0.05, '#1A1A20', x, 0.14, z)
    box(g, 0.26, 0.06, 0.18, '#5B4636', 0, 0.16, 0.34)
    return g },

  fireplace: () => { const g = new THREE.Group()
    box(g, 0.6, 0.5, 0.24, '#8D6E63', 0, 0.25, 0)
    box(g, 0.36, 0.3, 0.06, '#2B1B12', 0, 0.17, 0.12)
    box(g, 0.68, 0.06, 0.3, '#A1887F', 0, 0.53, 0)
    for (let i = 0; i < 3; i++) {
      const f = cone(g, 0.07 - i * 0.015, 0.18, glowMat(i ? '#FFB03A' : '#FF6B35'), (i - 1) * 0.08, 0.14, 0.13, 6)
      f.userData.flame = i
    }
    const light = new THREE.PointLight(0xff8844, 0, 1.6)
    light.position.set(0, 0.24, 0.2); g.add(light); g.userData.lamp = light
    return g },

  telescope: () => { const g = new THREE.Group()
    for (const a of [0, 2.1, 4.2]) cyl(g, 0.012, 0.02, 0.5, '#6B7280', Math.cos(a) * 0.1, 0.25, Math.sin(a) * 0.1, 6, [Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3])
    const tube = cyl(g, 0.07, 0.09, 0.52, '#37474F', 0, 0.58, 0, 12, [-0.72, 0, 0])
    tube.userData.scope = true
    cyl(g, 0.05, 0.05, 0.08, '#90A4AE', 0.0, 0.42, -0.18, 10, [-0.72, 0, 0])
    return g },

  art_studio: () => { const g = new THREE.Group()
    for (const [x, z] of [[-0.16, 0.1], [0.16, 0.1], [0, -0.16]]) cyl(g, 0.014, 0.02, 0.6, '#A0764C', x, 0.3, z, 6)
    box(g, 0.42, 0.34, 0.03, '#FFFDF5', 0, 0.52, 0.02, [-0.12, 0, 0])
    sph(g, 0.07, '#69DB7C', -0.08, 0.54, 0.05, [1, 0.8, 0.3])
    sph(g, 0.06, '#FF6B6B', 0.08, 0.48, 0.05, [1, 0.8, 0.3])
    const pal = cyl(g, 0.11, 0.11, 0.02, '#D9B382', 0.24, 0.2, 0.14, 12)
    pal.rotation.z = 0.4
    return g },

  library: () => { const g = new THREE.Group()
    box(g, 0.62, 0.72, 0.2, '#8D6E63', 0, 0.36, -0.02)
    const cols = ['#FF6B6B', '#4DABF7', '#FFD43B', '#69DB7C', '#9775FA', '#FF922B']
    for (let s = 0; s < 3; s++) {
      box(g, 0.58, 0.02, 0.18, '#6D4C41', 0, 0.16 + s * 0.22, 0)
      for (let i = 0; i < 7; i++) box(g, 0.055, 0.16, 0.14, cols[(i + s) % 6], -0.24 + i * 0.08, 0.25 + s * 0.22, 0.01)
    }
    return g },

  trampoline: () => { const g = new THREE.Group()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      cyl(g, 0.018, 0.018, 0.18, '#607D8B', Math.cos(a) * 0.36, 0.09, Math.sin(a) * 0.36, 6)
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 8, 20), M('#4DABF7'))
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.2; g.add(ring)
    const mat_ = cyl(g, 0.37, 0.37, 0.02, '#2C3E50', 0, 0.2, 0, 18)
    mat_.userData.bounce = true
    return g },

  star_swing: () => { const g = new THREE.Group()
    box(g, 0.04, 0.8, 0.04, '#A0764C', -0.36, 0.4, 0)
    box(g, 0.04, 0.8, 0.04, '#A0764C', 0.36, 0.4, 0)
    box(g, 0.78, 0.04, 0.04, '#A0764C', 0, 0.8, 0)
    const sw = new THREE.Group()
    sw.position.y = 0.8; g.add(sw); g.userData.swing = sw
    for (const x of [-0.14, 0.14]) cyl(sw, 0.008, 0.008, 0.44, '#C9B79C', x, -0.22, 0, 5)
    box(sw, 0.34, 0.04, 0.16, '#FFD166', 0, -0.44, 0)
    sph(sw, 0.07, glowMat('#FFE066'), 0, -0.38, 0.1, null, 6)
    return g },

  moon_hammock: () => { const g = new THREE.Group()
    const moon = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 8, 18, Math.PI * 1.25), M('#FFF3B0'))
    moon.rotation.z = -Math.PI * 0.3; moon.position.y = 0.7; g.add(moon)
    const net = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 6, 14, Math.PI), M('#E8DCC0'))
    net.position.y = 0.42; g.add(net)
    g.userData.swing = moon
    return g },

  reunion_lamp: () => { const g = new THREE.Group()
    cyl(g, 0.1, 0.14, 0.06, '#8D6E63', 0, 0.03, 0, 10)
    cyl(g, 0.014, 0.014, 0.46, '#6D4C41', 0, 0.26, 0, 6)
    sph(g, 0.19, glowMat('#FFD9A0', 0.92), 0, 0.58, 0, [1, 1.1, 1], 12)
    const light = new THREE.PointLight(0xffd9a0, 0, 1.5)
    light.position.y = 0.58; g.add(light); g.userData.lamp = light
    return g },

  puzzle_board: () => { const g = new THREE.Group()
    for (const x of [-0.24, 0.24]) cyl(g, 0.02, 0.026, 0.5, '#A0764C', x, 0.25, 0.04, 6, [0.16, 0, 0])
    box(g, 0.6, 0.46, 0.03, '#B98A5E', 0, 0.62, 0)
    box(g, 0.52, 0.38, 0.01, '#2F5D50', 0, 0.62, 0.02)
    box(g, 0.5, 0.05, 0.04, '#A0764C', 0, 0.4, 0.03)
    for (const [i, c] of [[0, '#FDF6E3'], [1, '#FF9EAA'], [2, '#FFD166']]) box(g, 0.07, 0.026, 0.03, c, -0.12 + i * 0.12, 0.425, 0.05)
    return g },

  world_route_map: () => { const g = new THREE.Group()
    box(g, 0.76, 0.5, 0.03, '#F3E7C9', 0, 0.6, 0)
    box(g, 0.8, 0.54, 0.01, '#B98A5E', 0, 0.6, -0.02)
    for (const [x, y] of [[-0.26, 0.06], [-0.1, -0.06], [0.06, 0.08], [0.24, -0.02]]) sph(g, 0.026, '#E85D5D', x, 0.6 + y, 0.02, null, 6)
    sph(g, 0.14, '#8ED8F8', -0.2, 0.62, 0.015, [1.3, 0.8, 0.1])
    sph(g, 0.12, '#B6E36B', 0.16, 0.58, 0.015, [1.4, 0.9, 0.1])
    cyl(g, 0.02, 0.02, 0.6, '#8A7A66', 0, 0.3, -0.02, 6)
    return g },

  taiwan_puzzle_wall: () => { const g = new THREE.Group()
    box(g, 0.56, 0.66, 0.03, '#EFE3C8', 0, 0.66, 0)
    box(g, 0.6, 0.7, 0.01, '#8D6E63', 0, 0.66, -0.02)
    const cols = ['#69DB7C', '#4DABF7', '#FFD43B', '#FF922B', '#9775FA', '#FF6B6B']
    let i = 0
    for (let r = 0; r < 4; r++) for (let cI = 0; cI < 2; cI++) {
      box(g, 0.2, 0.14, 0.015, cols[i % 6], -0.11 + cI * 0.22, 0.44 + r * 0.16, 0.02); i++
    }
    return g },

  // ── 庭園大型配件（2026-08-16）。單價 600~3000，不能用 emoji 立牌打發。 ──
  carousel: () => { const g = new THREE.Group()
    cyl(g, 0.52, 0.56, 0.08, '#E8DCC8', 0, 0.04, 0, 16)          // 底盤
    // ⚠️ userData.spin 要放「速度數字」而且掛在**要轉的那個節點**上
    //    （RoomWorld3D 是 n.rotation.y += n.userData.spin * dt）。
    //    塞 Group 進去會變成 rotation.y += NaN，整個模型會消失。
    const spin = new THREE.Group(); spin.position.y = 0.08; g.add(spin)
    spin.userData.spin = 0.55
    cyl(spin, 0.05, 0.05, 0.72, '#F2C14E', 0, 0.36, 0, 10)        // 中柱
    const horse = ['#FF8FA3', '#8ED8F8', '#FFD166', '#B6E36B']
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2, x = Math.cos(a) * 0.34, z = Math.sin(a) * 0.34
      cyl(spin, 0.012, 0.012, 0.6, '#D9CBB2', x, 0.4, z, 6)       // 吊桿
      sph(spin, 0.1, horse[i], x, 0.3, z, [1.35, 0.85, 0.7], 8)   // 馬身
      sph(spin, 0.065, horse[i], x + 0.1, 0.4, z, null, 8)        // 馬頭
    }
    cone(spin, 0.62, 0.26, '#FF6B6B', 0, 0.85, 0, 12)             // 頂棚
    sph(spin, 0.05, glowMat('#FFE066'), 0, 1.02, 0, null, 8)
    return g },

  treehouse: () => { const g = new THREE.Group()
    cyl(g, 0.13, 0.19, 0.72, '#8A6A44', 0, 0.36, 0, 10)           // 樹幹
    sph(g, 0.34, '#6FBF5B', -0.16, 0.9, 0.1, [1, 0.8, 1], 9)      // 樹冠
    sph(g, 0.28, '#5EAE4C', 0.2, 1.0, -0.08, [1, 0.8, 1], 9)
    box(g, 0.46, 0.05, 0.4, '#B08050', 0.05, 0.66, 0)             // 平台
    box(g, 0.36, 0.3, 0.32, '#C99A63', 0.08, 0.83, 0)             // 小屋
    cone(g, 0.32, 0.2, '#C0563E', 0.08, 1.06, 0, 4, [0, Math.PI / 4, 0])
    box(g, 0.11, 0.13, 0.02, '#5B4632', 0.08, 0.8, 0.17)          // 窗
    for (let i = 0; i < 4; i++) box(g, 0.16, 0.02, 0.02, '#8A6A44', -0.2, 0.14 + i * 0.15, 0.14)
    return g },

  greenhouse: () => { const g = new THREE.Group()
    const glass = M('#CFEFEA', { transparent: true, opacity: 0.42 })
    box(g, 0.66, 0.04, 0.5, '#B9A98C', 0, 0.02, 0)                // 地基
    box(g, 0.62, 0.5, 0.46, glass, 0, 0.29, 0)                    // 玻璃體
    for (const x of [-0.31, 0.31]) box(g, 0.03, 0.5, 0.03, '#8FA88F', x, 0.29, 0.23)
    cone(g, 0.47, 0.22, glass, 0, 0.65, 0, 4, [0, Math.PI / 4, 0])// 屋頂
    box(g, 0.03, 0.5, 0.5, '#8FA88F', 0, 0.29, 0)                 // 中脊
    for (const [x, z, c] of [[-0.16, 0.1, '#FF8FA3'], [0.16, -0.1, '#FFD166'], [0.05, 0.15, '#B6E36B']]) {
      cyl(g, 0.06, 0.07, 0.08, '#C0764A', x, 0.08, z, 8)          // 盆栽
      sph(g, 0.07, c, x, 0.16, z, [1, 0.8, 1], 8)
    }
    return g },

  fountain: () => { const g = new THREE.Group()
    cyl(g, 0.56, 0.6, 0.12, '#C9C2B4', 0, 0.06, 0, 18)            // 外池
    const w1 = cyl(g, 0.48, 0.48, 0.06, M('#7FC8E8', { transparent: true, opacity: 0.85 }), 0, 0.13, 0, 18)
    w1.userData.ripple = true
    cyl(g, 0.1, 0.12, 0.28, '#D6CFC0', 0, 0.28, 0, 10)            // 柱
    cyl(g, 0.3, 0.26, 0.06, '#D6CFC0', 0, 0.44, 0, 14)            // 二層盤
    cyl(g, 0.06, 0.08, 0.2, '#D6CFC0', 0, 0.56, 0, 8)
    cyl(g, 0.16, 0.13, 0.05, '#D6CFC0', 0, 0.68, 0, 12)           // 三層盤
    for (let i = 0; i < 5; i++) {                                  // 水花（閃爍，不用 steam）
      // steam 的處理會把 y 強制設成 0.2~0.7，水花會穿過噴泉柱身，所以改用 twinkle
      const a = (i / 5) * Math.PI * 2
      const d = sph(g, 0.035, M('#BFE9FF', { transparent: true, opacity: 0.75 }),
                    Math.cos(a) * 0.12, 0.78, Math.sin(a) * 0.12, null, 6)
      d.userData.twinkle = i
    }
    return g },

  windmill: () => { const g = new THREE.Group()
    cyl(g, 0.17, 0.26, 0.66, '#EFE3C8', 0, 0.33, 0, 12)           // 塔身
    cone(g, 0.3, 0.24, '#C0563E', 0, 0.78, 0, 12)                 // 屋頂
    box(g, 0.1, 0.14, 0.02, '#6B4A2E', 0, 0.22, 0.25)             // 門
    // 葉片做成靜態：渲染器只支援繞 Y 軸轉（rotation.y），
    // 而風車葉片要繞 Z 軸才對，硬套會變成整片葉子像轉盤一樣平轉。
    const fan = new THREE.Group(); fan.position.set(0, 0.72, 0.3); g.add(fan)
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Group(); arm.rotation.z = (i / 4) * Math.PI * 2
      fan.add(arm)
      box(arm, 0.06, 0.42, 0.02, '#F5F0E2', 0, 0.21, 0)
    }
    cyl(fan, 0.04, 0.04, 0.06, '#8A6A44', 0, 0, 0, 8, [Math.PI / 2, 0, 0])
    return g },

  swing: () => { const g = new THREE.Group()
    for (const x of [-0.34, 0.34]) {
      cyl(g, 0.028, 0.036, 0.78, '#A0764C', x, 0.39, 0, 8)
      cyl(g, 0.02, 0.02, 0.3, '#A0764C', x, 0.72, 0.12, 6, [0.5, 0, 0])
    }
    cyl(g, 0.03, 0.03, 0.76, '#8A6A44', 0, 0.78, 0, 8, [0, 0, Math.PI / 2])
    const sw = new THREE.Group(); sw.position.y = 0.78; g.add(sw); g.userData.swing = sw
    for (const x of [-0.13, 0.13]) cyl(sw, 0.008, 0.008, 0.44, '#C9B79C', x, -0.22, 0, 5)
    box(sw, 0.34, 0.04, 0.16, '#C99A63', 0, -0.44, 0)
    return g },

  sandbox: () => { const g = new THREE.Group()
    box(g, 0.7, 0.09, 0.56, '#C99A63', 0, 0.045, 0)               // 木框
    box(g, 0.6, 0.06, 0.46, '#EFDFB8', 0, 0.08, 0)                // 沙
    for (const [x, z] of [[-0.36, 0.3], [0.36, -0.3], [0.36, 0.3], [-0.36, -0.3]])
      box(g, 0.1, 0.13, 0.1, '#B0834F', x, 0.065, z)              // 四角座位
    cyl(g, 0.07, 0.055, 0.1, '#4DABF7', 0.16, 0.16, 0.1, 10)      // 小水桶
    cyl(g, 0.008, 0.008, 0.18, '#FF922B', -0.12, 0.17, -0.05, 5, [0, 0, 0.7])
    box(g, 0.07, 0.02, 0.06, '#FF922B', -0.18, 0.25, -0.05)       // 鏟子
    return g },

  flower_arch: () => { const g = new THREE.Group()
    const cols = ['#FF8FA3', '#FFD166', '#B6E36B', '#C9A7EB', '#8ED8F8']
    for (const x of [-0.3, 0.3]) cyl(g, 0.035, 0.045, 0.62, '#F5F0E2', x, 0.31, 0, 8)
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 18, Math.PI), M('#F5F0E2'))
    arc.position.y = 0.62; g.add(arc)
    for (let i = 0; i <= 10; i++) {                                // 拱上的花
      const a = (i / 10) * Math.PI
      sph(g, 0.05, cols[i % 5], Math.cos(a) * 0.3, 0.62 + Math.sin(a) * 0.3, 0, [1, 0.8, 0.8], 7)
    }
    for (const x of [-0.3, 0.3]) for (let i = 0; i < 3; i++)
      sph(g, 0.04, cols[(i + 2) % 5], x, 0.14 + i * 0.17, 0.04, [1, 0.8, 0.8], 6)
    return g },

  bird_bath: () => { const g = new THREE.Group()
    cyl(g, 0.14, 0.2, 0.07, '#B9B2A4', 0, 0.035, 0, 12)           // 底座
    cyl(g, 0.07, 0.09, 0.34, '#C9C2B4', 0, 0.24, 0, 10)           // 柱
    cyl(g, 0.28, 0.22, 0.08, '#D6CFC0', 0, 0.45, 0, 16)           // 盆
    const w = cyl(g, 0.24, 0.24, 0.03, M('#8ED8F8', { transparent: true, opacity: 0.8 }), 0, 0.49, 0, 16)
    w.userData.ripple = true
    return g },

  // ── 寵物專屬的窩（2026-08-16）。都是「有個凹進去的地方可以躺」的造型。 ──
  kennel: () => { const g = new THREE.Group()
    box(g, 0.5, 0.34, 0.44, '#C99A63', 0, 0.17, 0)                // 屋身
    cone(g, 0.42, 0.24, '#C0563E', 0, 0.46, 0, 4, [0, Math.PI / 4, 0])
    box(g, 0.2, 0.26, 0.03, '#4A3728', 0, 0.13, 0.225)            // 門洞
    box(g, 0.16, 0.07, 0.02, '#F5E6C8', 0, 0.35, 0.235)           // 名牌
    sph(g, 0.16, '#F0E4D0', 0, 0.06, 0.02, [1.1, 0.45, 1], 8)     // 裡面的軟墊
    return g },

  cat_tower: () => { const g = new THREE.Group()
    box(g, 0.44, 0.05, 0.36, '#B98A5E', 0, 0.025, 0)              // 底座
    cyl(g, 0.055, 0.055, 0.34, '#D8C6AE', -0.1, 0.2, 0, 10)       // 柱
    box(g, 0.32, 0.05, 0.28, '#E8DCC8', 0.02, 0.39, 0)            // 第二層
    cyl(g, 0.05, 0.05, 0.3, '#D8C6AE', 0.12, 0.55, 0, 10)
    cyl(g, 0.2, 0.2, 0.07, '#F0E4D0', 0.06, 0.73, 0, 14)          // 頂層圓床
    sph(g, 0.15, '#FFD9E0', 0.06, 0.78, 0, [1, 0.4, 1], 9)        // 軟墊
    sph(g, 0.035, '#FF8FA3', -0.16, 0.5, 0.1, null, 7)            // 吊著的小球
    return g },

  otter_raft: () => { const g = new THREE.Group()
    const w = cyl(g, 0.5, 0.5, 0.04, M('#7FC8E8', { transparent: true, opacity: 0.75 }), 0, 0.02, 0, 18)
    w.userData.ripple = true
    for (let i = 0; i < 6; i++) {                                  // 木頭浮排
      cyl(g, 0.045, 0.045, 0.5, '#C99A63', -0.13 + i * 0.052, 0.08, 0, 8, [0, 0, Math.PI / 2])
    }
    sph(g, 0.17, '#FFF1C9', 0, 0.13, 0, [1.15, 0.4, 0.85], 9)     // 軟墊
    cyl(g, 0.02, 0.02, 0.26, '#A0764C', 0.2, 0.2, 0, 6)           // 小旗桿
    box(g, 0.11, 0.07, 0.01, '#FF8FA3', 0.26, 0.29, 0)
    return g },

  nest_house: () => { const g = new THREE.Group()
    cyl(g, 0.05, 0.07, 0.5, '#8A6A44', 0, 0.25, 0, 8)             // 支柱
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      M('#C9A063', { side: THREE.DoubleSide }))
    bowl.rotation.x = Math.PI; bowl.position.y = 0.58; g.add(bowl) // 碗狀巢（開口朝上）
    for (let i = 0; i < 12; i++) {                                 // 編織的草
      const a = (i / 12) * Math.PI * 2
      cyl(g, 0.012, 0.012, 0.2, '#B08A50', Math.cos(a) * 0.25, 0.5, Math.sin(a) * 0.25, 5, [0.3, a, 0])
    }
    sph(g, 0.16, '#FFF6E0', 0, 0.5, 0, [1, 0.45, 1], 9)           // 羽毛墊
    return g },

  tree_hollow: () => { const g = new THREE.Group()
    cyl(g, 0.26, 0.32, 0.62, '#8A6A44', 0, 0.31, 0, 12)           // 樹幹
    sph(g, 0.3, '#6FBF5B', 0, 0.68, 0, [1, 0.55, 1], 9)           // 頂上的葉子
    const hole = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      M('#3B2A1B', { side: THREE.DoubleSide }))
    hole.rotation.x = -Math.PI / 2; hole.position.set(0, 0.3, 0.2); g.add(hole)   // 樹洞
    sph(g, 0.12, '#C9A063', 0, 0.24, 0.22, [1, 0.4, 0.7], 8)      // 乾草
    for (let i = 0; i < 3; i++) sph(g, 0.05, '#C0563E', -0.2 + i * 0.2, 0.06, 0.16, [1, 0.6, 1], 6)
    return g },

  dino_nest: () => { const g = new THREE.Group()
    for (let i = 0; i < 11; i++) {                                 // 圍一圈石頭
      const a = (i / 11) * Math.PI * 2
      sph(g, 0.09, '#9E9384', Math.cos(a) * 0.4, 0.05, Math.sin(a) * 0.4, [1, 0.75, 1], 7)
    }
    cyl(g, 0.36, 0.36, 0.05, '#E8D8B0', 0, 0.035, 0, 16)          // 細沙
    for (const [x, z, s] of [[-0.1, 0.05, 1], [0.11, -0.04, 0.9], [0.02, 0.14, 0.8]])
      sph(g, 0.11 * s, '#F2E4C8', x, 0.11, z, [0.85, 1.15, 0.85], 9)  // 蛋
    return g },

  moss_bed: () => { const g = new THREE.Group()
    box(g, 0.5, 0.06, 0.38, '#8A6A44', 0, 0.03, 0)                // 木框
    sph(g, 0.25, '#6FBF5B', 0, 0.06, 0, [1.05, 0.42, 0.82], 10)   // 苔蘚墊
    for (let i = 0; i < 7; i++) {                                  // 冒出來的小草
      const a = (i / 7) * Math.PI * 2
      cyl(g, 0.008, 0.012, 0.09, '#5EAE4C', Math.cos(a) * 0.16, 0.14, Math.sin(a) * 0.11, 5)
    }
    for (const [x, z] of [[-0.15, 0.1], [0.17, -0.07]])
      sph(g, 0.035, '#FFD9E0', x, 0.13, z, [1, 0.8, 1], 6)        // 小花點綴
    return g },

  star_bed: () => { const g = new THREE.Group()
    cyl(g, 0.34, 0.3, 0.07, glowMat('#8E7BD8', 0.85), 0, 0.05, 0, 16)   // 浮起的底盤
    sph(g, 0.26, '#3B2E6B', 0, 0.08, 0, [1.05, 0.42, 0.85], 10)         // 銀河被
    for (let i = 0; i < 9; i++) {                                        // 被子上的星星
      const a = (i / 9) * Math.PI * 2, r = 0.1 + (i % 3) * 0.06
      const s = sph(g, 0.022, glowMat('#FFF3C4'), Math.cos(a) * r, 0.16, Math.sin(a) * r * 0.8, null, 6)
      s.userData.twinkle = i
    }
    for (const x of [-0.3, 0.3]) {                                       // 兩顆床角星
      const s = sph(g, 0.06, glowMat('#FFE066'), x, 0.2, -0.16, null, 8)
      s.userData.twinkle = x > 0 ? 3 : 6
    }
    return g },

  // ── 魔法花園 ──
  crystal_pond: () => { const g = new THREE.Group()
    for (let i = 0; i < 10; i++) {                                 // 水晶環
      const a = (i / 10) * Math.PI * 2
      cone(g, 0.06, 0.2 + (i % 3) * 0.07, glowMat('#9AD8FF', 0.75),
           Math.cos(a) * 0.48, 0.1, Math.sin(a) * 0.48, 5)
    }
    const w = cyl(g, 0.44, 0.44, 0.05, M('#5AA6D8', { transparent: true, opacity: 0.7 }), 0, 0.05, 0, 20)
    w.userData.ripple = true
    for (let i = 0; i < 6; i++) {                                  // 浮起的光點
      const a = (i / 6) * Math.PI * 2
      const s = sph(g, 0.03, glowMat('#DDF3FF'), Math.cos(a) * 0.22, 0.2 + (i % 3) * 0.08, Math.sin(a) * 0.22, null, 6)
      s.userData.twinkle = i
    }
    return g },

  moon_fountain: () => { const g = new THREE.Group()
    cyl(g, 0.46, 0.5, 0.1, '#C4C8DA', 0, 0.05, 0, 16)
    const w = cyl(g, 0.4, 0.4, 0.05, M('#CBD8FF', { transparent: true, opacity: 0.72 }), 0, 0.11, 0, 18)
    w.userData.ripple = true
    cyl(g, 0.08, 0.1, 0.34, '#D6D9E8', 0, 0.28, 0, 10)
    const moon = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 8, 16, Math.PI * 1.3), glowMat('#FFF6C8'))
    moon.position.y = 0.6; moon.rotation.z = -0.6; g.add(moon)
    for (let i = 0; i < 5; i++) {
      const s = sph(g, 0.028, glowMat('#FFF6C8'), (i - 2) * 0.09, 0.74 + (i % 2) * 0.08, 0, null, 6)
      s.userData.twinkle = i
    }
    return g },

  star_gate: () => { const g = new THREE.Group()
    for (const x of [-0.32, 0.32]) {
      cyl(g, 0.05, 0.07, 0.72, glowMat('#B79CFF', 0.8), x, 0.36, 0, 8)
      sph(g, 0.06, glowMat('#FFE9A8'), x, 0.74, 0, null, 8)
    }
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 8, 18, Math.PI), glowMat('#B79CFF', 0.8))
    arc.position.y = 0.72; g.add(arc)
    for (let i = 0; i <= 8; i++) {                                 // 拱上的星屑
      const a = (i / 8) * Math.PI
      const s = sph(g, 0.032, glowMat('#FFF3C4'), Math.cos(a) * 0.32, 0.72 + Math.sin(a) * 0.32, 0, null, 6)
      s.userData.twinkle = i
    }
    return g },
}

// 主題壁紙不是家具，由場景整室換色處理
export const THEME_ONLY = new Set(['theme_forest', 'theme_ocean', 'theme_space'])

/** 依家具 id 組出模型；沒建模的用 emoji 立牌。回傳 Group（userData.pick 供點擊辨識） */
export function buildDeco(id, scale = 1) {
  const g = new THREE.Group()
  const built = BUILD[id]?.() ?? standee(SHOP_ITEMS.find((i) => i.id === id)?.emoji ?? '📦')
  g.add(built)
  g.scale.setScalar(scale)
  g.userData.pick = { type: 'deco', id }

  // 落地影子（有些是掛牆的就不畫）
  if (!['painting', 'rainbow', 'disco', 'world_route_map', 'taiwan_puzzle_wall'].includes(id)) {
    const sh = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false })
    )
    sh.rotation.x = -Math.PI / 2
    sh.position.y = 0.008
    built.add(sh)
  }
  return g
}

export const hasDecoModel = (id) => !!BUILD[id]
