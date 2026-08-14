// 寵物的程式化建模：用基本幾何體組出 21 隻寵物，配色直接讀 2D 版共用的 EVO 表，
// 所以進化到第幾階、換什麼顏色，3D 這邊自動跟著變（不必準備 84 個模型檔）。
import * as THREE from 'three'
import { EVO } from '../data/petColors'

// 阿榕（S7 老榕樹靈）在 EVO 表裡沒有配色（2D 版也因此誤用 LULU 的顏色），這裡補一份樹靈色。
const ARONG_EVO = [null,
  { body: '#6B7A4A', belly: '#8FA46A', ear: '#4E5C34', nose: '#2E3A1C', leaf: '#5FA347' },
  { body: '#5E7040', belly: '#86A05F', ear: '#44522C', nose: '#26301A', leaf: '#4E9A38' },
  { body: '#4F6436', belly: '#7C9A55', ear: '#3A4824', nose: '#1E2814', leaf: '#3F8F2C' },
  { body: '#3F5A2C', belly: '#9BC46A', ear: '#2E3C1C', nose: '#16200E', leaf: '#7CE05A', glow: '#A8E063' },
]

// 每隻寵物的體型設定。kind 決定骨架，其餘是細節開關。
const SPECIES = {
  lulu:    { kind: 'quad', ear: 'flop',  tail: 'wag',    size: 1.00, snout: 1.0, saddle: true },
  xiaohu:  { kind: 'quad', ear: 'flop',  tail: 'wag',    size: 0.92, snout: 1.0, long: 1.55, leg: 0.55 },
  hana:    { kind: 'quad', ear: 'tiny',  tail: 'flat',   size: 0.95, snout: 0.7 },
  kotaro:  { kind: 'quad', ear: 'tiny',  tail: 'flat',   size: 1.00, snout: 0.7 },
  jiji:    { kind: 'quad', ear: 'point', tail: 'long',   size: 0.92, snout: 0.5 },
  kitsune: { kind: 'quad', ear: 'point', tail: 'bushy',  size: 0.95, snout: 0.8 },
  raccoon: { kind: 'quad', ear: 'round', tail: 'ring',   size: 0.95, snout: 0.7, mask: true },
  beaver:  { kind: 'quad', ear: 'tiny',  tail: 'paddle', size: 0.95, snout: 0.7, teeth: true },
  hamster: { kind: 'quad', ear: 'round', tail: 'nub',    size: 0.70, snout: 0.5 },
  seal:    { kind: 'blob', tail: 'fin',  size: 1.00, snout: 0.6 },
  penguin: { kind: 'upright', beak: true, size: 0.95 },
  owl:     { kind: 'upright', beak: true, size: 0.90, tuft: true, bigEyes: true },
  xiaoq:   { kind: 'upright', beak: true, size: 0.90, tuft: true, bigEyes: true, glasses: true },
  mejiro:  { kind: 'bird', beak: true, size: 0.55 },
  feifei:  { kind: 'bird', beak: true, size: 1.05, wingspan: 2.1 },
  dino:    { kind: 'biped', tail: 'thick', size: 1.00, spikes: true },
  monkey:  { kind: 'biped', tail: 'curl',  size: 0.90, ear: 'round', snout: 0.6 },
  twinkle: { kind: 'float', shape: 'star',   size: 0.85 },
  luna:    { kind: 'float', shape: 'moon',   size: 0.85 },
  pluto:   { kind: 'float', shape: 'planet', size: 0.85 },
  arong:   { kind: 'tree', size: 1.15 },
}
const DEFAULT_SPEC = { kind: 'quad', ear: 'tiny', tail: 'wag', size: 1, snout: 0.8 }

const BASE = 0.62                       // 寵物大約多高（世界單位）
const mat = (color, opts) => new THREE.MeshLambertMaterial({ color, ...opts })
const ball = (r, seg = 10) => new THREE.SphereGeometry(r, seg, Math.max(6, seg - 2))

// 放一顆球（可壓扁），回傳 mesh
function put(parent, geo, material, x, y, z, scale) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
  if (scale) m.scale.set(scale[0], scale[1], scale[2])
  parent.add(m)
  return m
}

export function getPalette(petId, stage) {
  const table = petId === 'arong' ? ARONG_EVO : EVO[petId]
  const s = Math.max(1, Math.min(4, stage || 1))
  return table?.[s] ?? EVO.lulu[1]
}

/**
 * 組出一隻寵物。回傳 Group，並在 userData 掛上：
 *   pick  — 射線點擊時用來辨識是哪隻寵物
 *   parts — 給場景做走路／眨眼／搖尾巴動畫用
 */
export function buildPet(petId, stage = 1, { mood = 100 } = {}) {
  const spec = { ...DEFAULT_SPEC, ...(SPECIES[petId] || {}) }
  const c = getPalette(petId, stage)
  const s = BASE * (spec.size ?? 1)

  const g = new THREE.Group()
  g.userData.pick = { type: 'pet', id: petId }

  const mBody  = mat(c.body)
  const mBelly = mat(c.belly || c.body)
  const mEar   = mat(c.ear || c.body)
  const mDark  = mat(c.nose || '#1a1008')
  const mMuzzle = mat(c.muzzle || c.belly || '#fff8ee')

  const parts = { legs: [], eyes: [], wings: [] }
  g.userData.parts = parts

  // ── 影子：假的圓形貼片，比即時陰影便宜太多 ──
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(s * 0.55, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false })
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  g.add(shadow)
  parts.shadow = shadow

  const body = new THREE.Group()
  g.add(body)
  parts.body = body

  const head = new THREE.Group()
  parts.head = head

  // 眼睛（所有體型共用）
  const addEyes = (target, y, z, r, spread) => {
    const geo = ball(r, 8)
    for (const sx of [-1, 1]) {
      parts.eyes.push(put(target, geo, mDark, sx * spread, y, z))
    }
  }

  switch (spec.kind) {
    // ── 四足：狗、水獺、貓、狐狸、浣熊、河狸、倉鼠 ──
    case 'quad': {
      const len = s * 0.62 * (spec.long ?? 1)
      const legH = s * 0.3 * (spec.leg ?? 1)
      put(body, ball(s * 0.42, 12), mBody, 0, legH + s * 0.34, 0, [len / (s * 0.42) * 0.85, 0.85, 1])
      put(body, ball(s * 0.3, 10), mBelly, 0, legH + s * 0.2, s * 0.06, [len / (s * 0.3) * 0.7, 0.6, 0.9])

      if (spec.saddle && c.saddle) {   // 米格魯的背鞍
        put(body, ball(s * 0.36, 10), mat(c.saddle), 0, legH + s * 0.5, -s * 0.02, [len / (s * 0.36) * 0.7, 0.5, 0.85])
      }

      // 四條腿
      const legGeo = new THREE.CylinderGeometry(s * 0.09, s * 0.08, legH * 2, 7)
      for (const [lx, lz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
        parts.legs.push(put(body, legGeo, mBody, lx * s * 0.24, legH, lz * len * 0.5))
      }

      head.position.set(0, legH + s * 0.62, len * 0.62)
      put(head, ball(s * 0.32, 12), mBody, 0, 0, 0)
      if (spec.snout) {   // 口鼻
        put(head, ball(s * 0.17, 10), mMuzzle, 0, -s * 0.08, s * 0.26, [1, 0.8, spec.snout * 1.5])
        put(head, ball(s * 0.06, 8), mDark, 0, -s * 0.04, s * 0.26 + s * 0.17 * spec.snout * 1.2)
      }
      if (spec.teeth) put(head, new THREE.BoxGeometry(s * 0.12, s * 0.1, s * 0.03), mat('#FFFBEA'), 0, -s * 0.16, s * 0.34)
      if (spec.mask) put(head, ball(s * 0.3, 10), mat(c.ear || '#4A4A4A'), 0, s * 0.02, s * 0.1, [1.02, 0.42, 0.9])

      // 耳朵
      const earMat = mat(c.earInner || c.ear || c.body)
      for (const sx of [-1, 1]) {
        if (spec.ear === 'flop') {
          put(head, ball(s * 0.13, 8), mEar, sx * s * 0.28, -s * 0.02, -s * 0.02, [0.55, 1.5, 0.8])
        } else if (spec.ear === 'point') {
          const e = new THREE.Mesh(new THREE.ConeGeometry(s * 0.12, s * 0.24, 6), mEar)
          e.position.set(sx * s * 0.2, s * 0.28, 0)
          e.rotation.z = sx * -0.2
          head.add(e)
          put(head, new THREE.ConeGeometry(s * 0.06, s * 0.14, 6), earMat, sx * s * 0.2, s * 0.29, s * 0.03)
        } else if (spec.ear === 'round') {
          put(head, ball(s * 0.12, 8), mEar, sx * s * 0.26, s * 0.22, 0, [1, 1, 0.5])
        } else {
          put(head, ball(s * 0.08, 8), mEar, sx * s * 0.24, s * 0.22, 0, [1, 1, 0.6])
        }
      }
      addEyes(head, s * 0.06, s * 0.26, s * 0.052, s * 0.13)

      // 尾巴
      const tail = new THREE.Group()
      tail.position.set(0, legH + s * 0.42, -len * 0.62)
      if (spec.tail === 'bushy')      put(tail, ball(s * 0.22, 10), mEar, 0, s * 0.08, -s * 0.16, [0.8, 1, 1.5])
      else if (spec.tail === 'paddle') put(tail, new THREE.BoxGeometry(s * 0.28, s * 0.06, s * 0.42), mat(c.ear || c.body), 0, 0, -s * 0.2)
      else if (spec.tail === 'flat')   put(tail, ball(s * 0.1, 8), mBody, 0, 0, -s * 0.22, [1, 0.6, 2.4])
      else if (spec.tail === 'long')   put(tail, new THREE.CylinderGeometry(s * 0.05, s * 0.035, s * 0.5, 6), mBody, 0, s * 0.16, -s * 0.12).rotation.x = 0.9
      else if (spec.tail === 'ring') {
        for (let i = 0; i < 4; i++) {
          put(tail, ball(s * 0.075, 8), i % 2 ? mDark : mBelly, 0, s * 0.04 * i, -s * (0.1 + i * 0.11))
        }
      } else if (spec.tail === 'nub')  put(tail, ball(s * 0.07, 8), mBelly, 0, 0, -s * 0.08)
      else                             put(tail, ball(s * 0.09, 8), mBody, 0, s * 0.06, -s * 0.14, [1, 1, 1.6])
      body.add(tail)
      parts.tail = tail
      break
    }

    // ── 海豹：一顆胖胖的身體＋前鰭 ──
    case 'blob': {
      put(body, ball(s * 0.42, 12), mBody, 0, s * 0.34, 0, [1, 0.86, 1.5])
      put(body, ball(s * 0.3, 10), mBelly, 0, s * 0.24, s * 0.1, [0.9, 0.7, 1.2])
      for (const sx of [-1, 1]) {
        const f = put(body, ball(s * 0.16, 8), mBody, sx * s * 0.34, s * 0.2, s * 0.12, [0.5, 0.3, 1])
        f.rotation.y = sx * 0.4
        parts.legs.push(f)
      }
      put(body, ball(s * 0.15, 8), mBody, 0, s * 0.24, -s * 0.6, [1.6, 0.35, 0.6])
      head.position.set(0, s * 0.62, s * 0.44)
      put(head, ball(s * 0.28, 12), mBody, 0, 0, 0)
      put(head, ball(s * 0.14, 8), mMuzzle, 0, -s * 0.08, s * 0.2, [1.2, 0.8, 1])
      put(head, ball(s * 0.05, 8), mDark, 0, -s * 0.05, s * 0.3)
      addEyes(head, s * 0.06, s * 0.22, s * 0.055, s * 0.12)
      break
    }

    // ── 直立型：企鵝、貓頭鷹 ──
    case 'upright': {
      put(body, ball(s * 0.36, 12), mBody, 0, s * 0.44, 0, [1, 1.35, 0.9])
      put(body, ball(s * 0.26, 10), mBelly, 0, s * 0.4, s * 0.14, [1, 1.25, 0.7])
      for (const sx of [-1, 1]) {   // 翅膀（短短的）
        const w = put(body, ball(s * 0.12, 8), mEar, sx * s * 0.33, s * 0.46, 0, [0.45, 1.7, 0.8])
        parts.wings.push(w)
      }
      for (const sx of [-1, 1]) {   // 腳丫
        put(body, ball(s * 0.1, 8), mat('#F5A623'), sx * s * 0.14, s * 0.05, s * 0.06, [1, 0.4, 1.5])
      }
      head.position.set(0, s * 0.92, 0)
      put(head, ball(s * 0.3, 12), mBody, 0, 0, 0)
      if (spec.tuft) for (const sx of [-1, 1]) {
        const t = new THREE.Mesh(new THREE.ConeGeometry(s * 0.09, s * 0.2, 6), mEar)
        t.position.set(sx * s * 0.18, s * 0.28, 0)
        t.rotation.z = sx * -0.35
        head.add(t)
      }
      const er = spec.bigEyes ? s * 0.14 : s * 0.06
      if (spec.bigEyes) for (const sx of [-1, 1]) {   // 貓頭鷹的大眼圈
        put(head, ball(er, 10), mat(c.belly || '#FFF6D8'), sx * s * 0.14, s * 0.03, s * 0.22, [1, 1, 0.4])
      }
      addEyes(head, s * 0.03, s * 0.26, spec.bigEyes ? s * 0.07 : s * 0.055, s * 0.14)
      if (spec.beak) {
        const b = new THREE.Mesh(new THREE.ConeGeometry(s * 0.08, s * 0.16, 6), mat('#F5A623'))
        b.position.set(0, -s * 0.08, s * 0.28)
        b.rotation.x = Math.PI / 2
        head.add(b)
      }
      if (spec.glasses) for (const sx of [-1, 1]) {   // 小Q 的偵探眼鏡
        const r = new THREE.Mesh(new THREE.TorusGeometry(s * 0.1, s * 0.014, 6, 14), mat('#2E2A26'))
        r.position.set(sx * s * 0.14, s * 0.03, s * 0.3)
        head.add(r)
      }
      break
    }

    // ── 小鳥：綠繡眼、信天翁 ──
    case 'bird': {
      const span = spec.wingspan ?? 1
      put(body, ball(s * 0.34, 12), mBody, 0, s * 0.4, 0, [1, 1, 1.25])
      put(body, ball(s * 0.24, 10), mBelly, 0, s * 0.34, s * 0.14, [0.9, 0.8, 1])
      for (const sx of [-1, 1]) {
        const w = put(body, ball(s * 0.2 * span, 8), mEar, sx * s * 0.3, s * 0.44, 0, [1.5, 0.16, 0.75])
        w.position.x = sx * s * 0.3 * span
        parts.wings.push(w)
      }
      put(body, ball(s * 0.12, 8), mEar, 0, s * 0.34, -s * 0.4, [1, 0.3, 1.8])
      head.position.set(0, s * 0.74, s * 0.12)
      put(head, ball(s * 0.22, 12), mBody, 0, 0, 0)
      addEyes(head, s * 0.04, s * 0.18, s * 0.045, s * 0.1)
      if (petId === 'mejiro') for (const sx of [-1, 1]) {   // 綠繡眼的白眼圈
        const r = new THREE.Mesh(new THREE.TorusGeometry(s * 0.07, s * 0.018, 6, 12), mat('#FFFFFF'))
        r.position.set(sx * s * 0.1, s * 0.04, s * 0.19)
        head.add(r)
      }
      const b = new THREE.Mesh(new THREE.ConeGeometry(s * 0.06, s * 0.2, 6), mat('#F5A623'))
      b.position.set(0, -s * 0.02, s * 0.26)
      b.rotation.x = Math.PI / 2
      head.add(b)
      break
    }

    // ── 兩足：恐龍、猴子 ──
    case 'biped': {
      put(body, ball(s * 0.34, 12), mBody, 0, s * 0.5, 0, [1, 1.15, 1])
      put(body, ball(s * 0.24, 10), mBelly, 0, s * 0.44, s * 0.14, [0.9, 0.95, 0.8])
      const legGeo = new THREE.CylinderGeometry(s * 0.1, s * 0.09, s * 0.34, 7)
      for (const sx of [-1, 1]) parts.legs.push(put(body, legGeo, mBody, sx * s * 0.15, s * 0.17, 0))
      for (const sx of [-1, 1]) {
        const a = put(body, ball(s * 0.09, 8), mBody, sx * s * 0.3, s * 0.5, s * 0.04, [1, 1.6, 1])
        parts.wings.push(a)
      }
      head.position.set(0, s * 0.92, s * 0.04)
      put(head, ball(s * 0.28, 12), mBody, 0, 0, 0)
      if (spec.snout) {
        put(head, ball(s * 0.15, 10), mMuzzle, 0, -s * 0.08, s * 0.22, [1, 0.85, 1.3])
        put(head, ball(s * 0.05, 8), mDark, 0, -s * 0.05, s * 0.34)
      }
      if (spec.ear === 'round') for (const sx of [-1, 1]) {
        put(head, ball(s * 0.11, 8), mEar, sx * s * 0.27, s * 0.06, 0, [0.5, 1, 1])
      }
      if (spec.spikes) for (let i = 0; i < 4; i++) {   // 恐龍背鰭
        const sp = new THREE.Mesh(new THREE.ConeGeometry(s * 0.07, s * 0.16, 5), mEar)
        sp.position.set(0, s * (0.74 - i * 0.13), -s * (0.16 + i * 0.1))
        body.add(sp)
      }
      addEyes(head, s * 0.05, s * 0.22, s * 0.05, s * 0.12)
      const tail = new THREE.Group()
      tail.position.set(0, s * 0.36, -s * 0.24)
      if (spec.tail === 'curl') {
        for (let i = 0; i < 5; i++) put(tail, ball(s * 0.045, 6), mBody, Math.sin(i * 0.9) * s * 0.1, s * 0.05 * i, -s * (0.06 + i * 0.08))
      } else {
        for (let i = 0; i < 4; i++) put(tail, ball(s * (0.14 - i * 0.028), 8), mBody, 0, -s * 0.02 * i, -s * (0.1 + i * 0.14))
      }
      body.add(tail)
      parts.tail = tail
      break
    }

    // ── 精靈型：小星、小月、小冥（會浮空）──
    case 'float': {
      const floatY = s * 0.62
      let core
      if (spec.shape === 'star') {
        core = new THREE.Group()
        for (let i = 0; i < 5; i++) {   // 五角星：五根圓錐繞一圈
          const p = new THREE.Mesh(new THREE.ConeGeometry(s * 0.16, s * 0.44, 4), mBody)
          p.rotation.z = (i / 5) * Math.PI * 2
          p.position.set(Math.sin((i / 5) * Math.PI * 2) * s * 0.22, Math.cos((i / 5) * Math.PI * 2) * s * 0.22, 0)
          core.add(p)
        }
        put(core, ball(s * 0.22, 10), mBelly, 0, 0, s * 0.02)
      } else if (spec.shape === 'moon') {
        core = new THREE.Group()
        const ring = new THREE.Mesh(new THREE.TorusGeometry(s * 0.3, s * 0.13, 8, 18, Math.PI * 1.35), mBody)
        ring.rotation.z = -Math.PI * 0.32
        core.add(ring)
      } else {
        core = new THREE.Group()
        put(core, ball(s * 0.34, 14), mBody, 0, 0, 0)
        const ring = new THREE.Mesh(new THREE.TorusGeometry(s * 0.5, s * 0.03, 6, 24), mBelly)
        ring.rotation.x = Math.PI * 0.42
        core.add(ring)
      }
      core.position.y = floatY
      body.add(core)
      parts.float = core
      addEyes(core, 0, s * 0.3, s * 0.05, s * 0.11)
      break
    }

    // ── 阿榕：老榕樹靈 ──
    case 'tree': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.18, s * 0.26, s * 0.62, 8), mBody)
      trunk.position.y = s * 0.31
      body.add(trunk)
      for (const sx of [-1, 1]) {   // 氣根當手
        const r = put(body, new THREE.CylinderGeometry(s * 0.04, s * 0.03, s * 0.34, 5), mBody, sx * s * 0.26, s * 0.4, 0)
        r.rotation.z = sx * 0.5
        parts.wings.push(r)
      }
      const crown = new THREE.Group()
      crown.position.y = s * 0.82
      const leafMat = mat(c.leaf || '#5FA347')
      for (const [lx, ly, lz, lr] of [[0, 0.1, 0, 0.34], [-0.26, -0.02, 0.1, 0.22], [0.26, 0, -0.08, 0.24], [0.05, 0.24, -0.16, 0.2]]) {
        put(crown, ball(s * lr, 10), leafMat, s * lx, s * ly, s * lz)
      }
      body.add(crown)
      parts.float = crown
      head.position.set(0, s * 0.46, s * 0.2)
      addEyes(head, 0, 0, s * 0.05, s * 0.1)
      break
    }
    default: break
  }

  if (head.parent !== body && head.children.length) body.add(head)

  // 第 4 階段的傳說光暈
  if (c.glow) {
    const glow = new THREE.Mesh(
      ball(s * 0.8, 10),
      new THREE.MeshBasicMaterial({ color: c.glow, transparent: true, opacity: 0.13, depthWrite: false })
    )
    glow.position.y = s * 0.5
    g.add(glow)
    parts.glow = glow
  }

  // 心情 0：整隻壓扁趴地（比照 2D 版的 collapsedStyle）
  if (mood <= 0) body.scale.set(1.05, 0.72, 1.05)

  g.userData.height = s
  return g
}

export const petSpecies = (id) => SPECIES[id]?.kind ?? 'quad'
