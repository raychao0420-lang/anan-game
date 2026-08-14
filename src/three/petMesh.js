// 寵物的程式化建模：用基本幾何體組出 21 隻寵物，配色直接讀 2D 版共用的 EVO 表，
// 所以進化到第幾階、換什麼顏色，3D 這邊自動跟著變（不必準備 84 個模型檔）。
//
// 美術方向＝配合遊戲原本的手繪 SVG 風格，走「卡通賽璐璐」而不是寫實：
//   ① 賽璐璐上色（MeshToonMaterial + 三階漸層），不要平滑的寫實明暗
//   ② 黑色描邊（放大的 BackSide 外殼），輪廓清楚才像插畫
//   ③ 大頭短腿的可愛比例，腿用膠囊＋圓腳掌，關節放在髖部才會擺得自然
//   ④ 大眼睛加高光點、臉頰腮紅
import * as THREE from 'three'
import { EVO } from '../data/petColors'

// 阿榕（S7 老榕樹靈）在 EVO 表裡沒有配色（2D 版也因此誤用 LULU 的顏色），這裡補一份樹靈色。
const ARONG_EVO = [null,
  { body: '#6B7A4A', belly: '#8FA46A', ear: '#4E5C34', nose: '#2E3A1C', leaf: '#5FA347' },
  { body: '#5E7040', belly: '#86A05F', ear: '#44522C', nose: '#26301A', leaf: '#4E9A38' },
  { body: '#4F6436', belly: '#7C9A55', ear: '#3A4824', nose: '#1E2814', leaf: '#3F8F2C' },
  { body: '#3F5A2C', belly: '#9BC46A', ear: '#2E3C1C', nose: '#16200E', leaf: '#7CE05A', glow: '#A8E063' },
]

// ── 賽璐璐材質：三階漸層，顏色不會糊掉，看起來像上色的插畫 ──────────────────
const GRADIENT = (() => {
  const tex = new THREE.DataTexture(new Uint8Array([80, 170, 255]), 3, 1, THREE.RedFormat)
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  return tex
})()
// 材質跨寵物共用（同色只建一份），所以一律標 shared，避免切場景時被 dispose 掉變黑
const shared = (m) => { m.userData.shared = true; return m }
const matCache = new Map()
const toon = (color) => {
  const key = String(color)
  if (!matCache.has(key)) matCache.set(key, shared(new THREE.MeshToonMaterial({ color, gradientMap: GRADIENT })))
  return matCache.get(key)
}
const OUTLINE_MAT = shared(new THREE.MeshBasicMaterial({ color: 0x2a1e14, side: THREE.BackSide }))
const EYE_HILIGHT = shared(new THREE.MeshBasicMaterial({ color: 0xffffff }))

// 描邊：把同一顆幾何放大一點、只畫背面，就會在輪廓外圍露出一圈深色線。
// 固定倍率的問題是「小零件的線會細到看不見」（放大 7% 對半徑 0.02 的耳朵只有 0.0014），
// 所以這裡改成保證至少有 OUTLINE_W 的世界座標寬度，全身線寬才一致。
const OUTLINE_W = 0.017
function outline(mesh, thickness = 1.07) {
  const o = new THREE.Mesh(mesh.geometry, OUTLINE_MAT)
  const geo = mesh.geometry
  if (!geo.boundingSphere) geo.computeBoundingSphere()
  const r = geo.boundingSphere.radius * Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z)
  o.scale.setScalar(Math.max(thickness, 1 + OUTLINE_W / Math.max(r, 0.02)))
  o.position.copy(mesh.position)
  o.rotation.copy(mesh.rotation)
  o.scale.multiply(mesh.scale)
  mesh.parent.add(o)
  return o
}

// 每隻寵物的體型設定。kind 決定骨架，其餘是細節開關。
const SPECIES = {
  // 米格魯：三色斑（白口鼻胸腹／棕頭臀／黑背鞍）＋白襪子＋翹起來的白尾尖「旗尾」
  lulu:    { kind: 'quad', ear: 'flop',  tail: 'flag',   size: 1.00, snout: 1.0, saddle: true, blush: true,
             socks: true, bib: true, blaze: true, eyePatch: true },
  // 臘腸狗：黑背黃腳的雙色，同樣有眼上的黃斑
  xiaohu:  { kind: 'quad', ear: 'flop',  tail: 'wag',    size: 0.92, snout: 1.0, long: 1.5, leg: 0.55,
             socks: true, eyePatch: true },
  hana:    { kind: 'quad', ear: 'tiny',  tail: 'flat',   size: 0.95, snout: 0.7, blush: true },
  kotaro:  { kind: 'quad', ear: 'tiny',  tail: 'flat',   size: 1.00, snout: 0.7, blush: true },
  jiji:    { kind: 'quad', ear: 'point', tail: 'long',   size: 0.92, snout: 0.5 },
  kitsune: { kind: 'quad', ear: 'point', tail: 'bushy',  size: 0.95, snout: 0.8, blush: true },
  raccoon: { kind: 'quad', ear: 'round', tail: 'ring',   size: 0.95, snout: 0.7, mask: true },
  beaver:  { kind: 'quad', ear: 'tiny',  tail: 'paddle', size: 0.95, snout: 0.7, teeth: true },
  hamster: { kind: 'quad', ear: 'round', tail: 'nub',    size: 0.72, snout: 0.5, blush: true },
  seal:    { kind: 'blob', tail: 'fin',  size: 1.00, snout: 0.6, blush: true },
  penguin: { kind: 'upright', beak: true, size: 0.95, blush: true },
  owl:     { kind: 'upright', beak: true, size: 0.90, tuft: true, bigEyes: true },
  xiaoq:   { kind: 'upright', beak: true, size: 0.90, tuft: true, bigEyes: true, glasses: true },
  mejiro:  { kind: 'bird', beak: true, size: 0.58 },
  feifei:  { kind: 'bird', beak: true, size: 1.05, wingspan: 1.45 },   // 信天翁翼長，但收翅時不能長到拖地
  dino:    { kind: 'biped', tail: 'thick', size: 1.00, spikes: true },
  monkey:  { kind: 'biped', tail: 'curl',  size: 0.90, ear: 'round', snout: 0.6 },
  twinkle: { kind: 'float', shape: 'star',   size: 0.85 },
  luna:    { kind: 'float', shape: 'moon',   size: 0.85 },
  pluto:   { kind: 'float', shape: 'planet', size: 0.85 },
  arong:   { kind: 'tree', size: 1.15 },
}
const DEFAULT_SPEC = { kind: 'quad', ear: 'tiny', tail: 'wag', size: 1, snout: 0.8 }

const BASE = 0.62
const ball = (r, s = 14) => new THREE.SphereGeometry(r, s, Math.max(8, s - 4))
const capsule = (r, len, s = 10) => new THREE.CapsuleGeometry(r, len, 3, s)

function put(parent, geo, material, x, y, z, scale, rot) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
  if (scale) m.scale.set(scale[0], scale[1], scale[2])
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0)
  parent.add(m)
  return m
}

export function getPalette(petId, stage) {
  const table = petId === 'arong' ? ARONG_EVO : EVO[petId]
  const s = Math.max(1, Math.min(4, stage || 1))
  return table?.[s] ?? EVO.lulu[1]
}

// 斑紋＝貼在球面上的一小片球殼（半徑比主體大一點點，所以會浮在表面）。
// 直接塞一顆球進去是行不通的——會整顆埋在身體裡看不見。
// three 的球面參數：phi=π/2 是正前方（+z）、theta 從 0（頭頂）到 π（下巴）。
function patch(parent, r, mat, phi, phiLen, theta, thetaLen, cx = 0, cy = 0, cz = 0) {
  const geo = new THREE.SphereGeometry(r * 1.015, 16, 12, phi - phiLen / 2, phiLen, theta - thetaLen / 2, thetaLen)
  const m = new THREE.Mesh(geo, mat)
  m.position.set(cx, cy, cz)
  parent.add(m)
  return m
}
const FRONT = Math.PI / 2

// 背鞍＝披在背上的一片曲面。整齊的圓柱切片四邊都是直的，側看就像貼了塊方形膏藥，
// 所以把每一圈的包覆角度依前後位置往正上方收窄，邊緣才變成有生物感的橄欖形。
// straight＝身體膠囊的圓柱段長度，len＝背鞍要蓋多長（可以超出去蓋到半球帽上）
function saddleGeo(r, straight, len, spread) {
  const geo = new THREE.CylinderGeometry(r, r, len, 24, 16, true, Math.PI - spread / 2, spread)
  const pos = geo.attributes.position
  const half = len / 2
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const t = y / half                              // −1（尾端）→ +1（肩端）
    // 前段收得慢＝肩膀寬，後段收得快＝往尾巴收尖，比左右對稱自然
    // 留 0.08 的底不要完全收成一個點：收死的話尖端三角形會退化，邊緣出現鋸齒破洞
    const k = 0.08 + 0.92 * Math.cos(Math.PI / 2 * Math.abs(t) ** (t > 0 ? 1.7 : 1))
    // 超出圓柱段的部分要跟著半球帽一起縮半徑，不然會從身體裡穿出來變成一片飄布
    const over = Math.max(0, Math.abs(y) - straight / 2)
    const rr = r * Math.sqrt(Math.max(0, 1 - (over / r) ** 2))
    const a = Math.atan2(pos.getX(i), pos.getZ(i))  // 目前角度（0＝正下方、π＝正上方）
    const na = Math.PI + (a - Math.PI) * k          // 往正上方收
    pos.setX(i, Math.sin(na) * rr)
    pos.setZ(i, Math.cos(na) * rr)
  }
  geo.computeVertexNormals()
  return geo
}

// 一條腿＝髖部 Group（擺動）→ 大腿 → 膝蓋 Group（彎曲）→ 小腿＋圓腳掌。
// 拆成兩節才有關節感：單根膠囊繞髖部擺，看起來就像掃把在掃地。
// 動畫端只要轉 hip.rotation.x 和 hip.userData.knee.rotation.x 就有完整步態。
function makeLeg(parent, mBody, mPaw, s, x, y, z, legH) {
  const hip = new THREE.Group()
  hip.position.set(x, y, z)
  parent.add(hip)

  const upper = legH * 0.5
  const lower = legH - upper
  outline(put(hip, capsule(s * 0.086, upper * 0.7), mBody, 0, -upper * 0.5, 0), 1.1)

  const knee = new THREE.Group()
  knee.position.y = -upper
  hip.add(knee)
  outline(put(knee, capsule(s * 0.070, lower * 0.66), mBody, 0, -lower * 0.5, 0), 1.1)
  // 腳掌不描邊：它幾乎都被小腿的描邊蓋住，省下來的 draw call 比較實在
  put(knee, ball(s * 0.10, 10), mPaw, 0, -lower - s * 0.008, s * 0.028, [1.15, 0.8, 1.35])

  hip.userData.knee = knee
  return hip
}

// 大眼睛＋高光點：卡通角色的可愛度幾乎都在這
function makeEyes(target, parts, y, z, r, spread) {
  const geo = ball(r, 12)
  const hi = ball(r * 0.34, 8)
  const dark = toon('#1B1208')
  for (const sx of [-1, 1]) {
    const e = put(target, geo, dark, sx * spread, y, z)
    put(e, hi, EYE_HILIGHT, r * 0.3, r * 0.32, r * 0.62)   // 高光跟著眼睛一起縮放
    parts.eyes.push(e)
  }
}

// 登記一片會擺動的翅膀／手臂／氣根。要記下原本的角度，
// 因為動畫端是「指派」rotation.z，不記的話小鳥水平展開的翅膀會被轉成垂直。
const wing = (parts, m) => { m.userData.rest = m.rotation.z; parts.wings.push(m); return m }

const blushMat = shared(new THREE.MeshBasicMaterial({ color: 0xff9db0, transparent: true, opacity: 0.5 }))
function makeBlush(head, s, y, z, spread) {
  for (const sx of [-1, 1]) put(head, ball(s * 0.07, 8), blushMat, sx * spread, y, z, [1.3, 0.85, 0.5])
}

export function buildPet(petId, stage = 1, { mood = 100 } = {}) {
  const spec = { ...DEFAULT_SPEC, ...(SPECIES[petId] || {}) }
  const c = getPalette(petId, stage)
  const s = BASE * (spec.size ?? 1)

  const g = new THREE.Group()
  g.userData.pick = { type: 'pet', id: petId }

  const mBody = toon(c.body)
  const mBelly = toon(c.belly || c.body)
  const mEar = toon(c.ear || c.body)
  const mDark = toon(c.nose || '#1a1008')
  const mMuzzle = toon(c.muzzle || c.belly || '#fff8ee')

  const parts = { legs: [], eyes: [], wings: [], ears: [] }
  g.userData.parts = parts

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(s * 0.5, 18),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2, depthWrite: false })
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

  switch (spec.kind) {
    // ── 四足：狗、水獺、貓、狐狸、浣熊、河狸、倉鼠 ──
    case 'quad': {
      const long = spec.long ?? 1
      const legH = s * 0.34 * (spec.leg ?? 1)   // 腿加長：原本 0.26 太短，肚子幾乎貼地
      const bodyR = s * 0.245                    // 身體收窄，才襯得出大頭、也才看得到脖子
      const bodyLen = s * 0.36 * long
      const bodyY = legH + bodyR * 0.95
      // ⚠️ 膠囊的實際長度是 length + 2×radius（兩端各有一顆半球帽）。
      // 之前所有前後位置都只算 bodyLen*0.5，忘了加半徑，結果整顆頭埋進身體＝一坨馬鈴薯。
      const halfLen = bodyLen * 0.5 + bodyR

      const torso = put(body, capsule(bodyR, bodyLen), mBody, 0, bodyY, 0, null, [Math.PI / 2, 0, 0])
      outline(torso, 1.05)
      put(body, capsule(bodyR * 0.8, bodyLen * 0.92), mBelly, 0, bodyY - bodyR * 0.36, s * 0.03,
        [1, 1, 0.72], [Math.PI / 2, 0, 0])

      // 米格魯的背鞍＝貼合身體曲面的一片曲面（見 saddleGeo）。
      // 用實心橢球做不出來：小一點會整塊縮在身體裡看不見，大一點就在背上凸一個駝峰。
      if (spec.saddle && c.saddle) {
        put(body, saddleGeo(bodyR * 1.03, bodyLen, bodyLen + bodyR * 0.8, Math.PI * 0.62), toon(c.saddle),
          0, bodyY, s * 0.02, null, [Math.PI / 2, 0, 0])
      }

      // 白襪子：腳掌用口鼻的白（米格魯／臘腸狗的四腳是白的）
      const mPaw = spec.socks ? mMuzzle : mBody
      for (const [lx, lz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
        const leg = makeLeg(body, mBody, mPaw, s, lx * bodyR * 0.62, bodyY - bodyR * 0.55, lz * halfLen * 0.6, legH + bodyR * 0.55)
        leg.userData.front = lz > 0      // 坐下時前腳打直、後腿摺起來，要分得出來
        parts.legs.push(leg)
      }
      parts.canSit = true                // 四足才會「坐下」，鳥／海豹／精靈不套用
      parts.standY = bodyY

      // 白胸兜：貼在胸前那顆半球（膠囊的前端圓帽）上，三色犬最好認的一塊
      if (spec.bib) {
        patch(body, bodyR, mMuzzle, FRONT, 1.5, 1.9, 1.1, 0, bodyY, bodyLen * 0.5)
      }

      // 大頭＋脖子。脖子是關鍵：沒有它，頭和身體兩顆球就會糊成一團看不出是動物
      const headR = s * 0.30
      const neckY = bodyY + bodyR * 0.62
      const neckZ = halfLen * 0.72
      head.position.set(0, neckY + headR * 0.62, neckZ + headR * 0.62)
      body.add(head)
      outline(put(body, capsule(bodyR * 0.44, bodyR * 0.66), mBody,
        0, (neckY + head.position.y) / 2, (neckZ + head.position.z) / 2, null, [0.72, 0, 0]), 1.06)
      const skull = put(head, ball(headR, 16), mBody, 0, 0, 0, [1, 0.96, 1])
      outline(skull, 1.06)

      // 眼睛上方的深色斑：三色犬「棕頭」的來源，也給米格魯一點眉毛的表情
      if (spec.eyePatch) for (const sx of [-1, 1]) {
        patch(head, headR, mEar, FRONT + sx * 0.50, 0.60, 1.02, 0.46)
      }
      // 臉中央的白色鼻樑線：只走臉的前面，別繞過頭頂（不然像貼了一條賽車貼紙）
      if (spec.blaze) {
        patch(head, headR, mMuzzle, FRONT, 0.34, 1.28, 0.78)
      }

      if (spec.snout) {
        const snoutLen = headR * 0.62 * spec.snout
        // 口鼻不描邊：它埋在頭的描邊裡面，畫了也看不到
        put(head, capsule(headR * 0.30, snoutLen), mMuzzle, 0, -headR * 0.30, headR * 0.66,
          [1, 0.92, 0.95], [Math.PI / 2, 0, 0])
        put(head, ball(headR * 0.17, 10), mDark, 0, -headR * 0.20, headR * 0.72 + snoutLen * 0.6, [1.2, 0.92, 1])
      }
      if (spec.teeth) put(head, new THREE.BoxGeometry(headR * 0.34, headR * 0.28, headR * 0.1), toon('#FFFBEA'), 0, -headR * 0.52, headR * 0.82)
      if (spec.mask) put(head, ball(headR * 0.94, 12), toon(c.ear || '#4A4A4A'), 0, headR * 0.06, headR * 0.16, [1.02, 0.4, 0.92])

      for (const sx of [-1, 1]) {
        if (spec.ear === 'flop') {
          // 米格魯的招牌垂耳：是從「頭頂側邊」掛下來的一片，不是從臉頰長出來的肉。
          // 耳根接在接近頭頂的高度（原本接在頭中心下方，才會看起來像頭的延伸），
          // 再讓整片往下垂、稍微外撇，耳根和臉之間就會露出一道縫。
          // 用 Group 當耳根，動畫端轉它就能讓耳朵跟著甩。
          const root = new THREE.Group()
          root.position.set(sx * headR * 0.62, headR * 0.46, -headR * 0.04)
          root.rotation.set(0.16, 0, sx * 0.30)
          root.userData.rest = 0.16      // 動畫甩耳朵時以這個角度為基準
          head.add(root)
          const earLen = headR * 1.05
          outline(put(root, capsule(headR * 0.30, earLen), mEar,
            sx * headR * 0.14, -earLen * 0.62, 0, [0.34, 1, 1.22]), 1.1)
          parts.ears.push(root)
        } else if (spec.ear === 'point') {
          const ear = put(head, new THREE.ConeGeometry(headR * 0.34, headR * 0.66, 8), mEar,
            sx * headR * 0.56, headR * 0.82, 0, null, [0, 0, sx * -0.22])
          outline(ear, 1.1)
          put(head, new THREE.ConeGeometry(headR * 0.18, headR * 0.4, 8), toon(c.earInner || '#F5B8C8'),
            sx * headR * 0.56, headR * 0.84, headR * 0.1, null, [0, 0, sx * -0.22])
        } else if (spec.ear === 'round') {
          const ear = put(head, ball(headR * 0.32, 10), mEar, sx * headR * 0.76, headR * 0.66, 0, [1, 1, 0.55])
          outline(ear, 1.1)
        } else {
          const ear = put(head, ball(headR * 0.22, 10), mEar, sx * headR * 0.7, headR * 0.66, 0, [1, 1, 0.6])
          outline(ear, 1.1)
        }
      }
      makeEyes(head, parts, headR * 0.10, headR * 0.82, headR * 0.20, headR * 0.34)
      if (spec.blush) makeBlush(head, s, -headR * 0.20, headR * 0.68, headR * 0.60)

      // 尾巴（髖部 Group 讓它從根部搖）
      const tail = new THREE.Group()
      tail.position.set(0, bodyY + bodyR * 0.45, -halfLen + bodyR * 0.12)
      body.add(tail)
      parts.tail = tail
      if (spec.tail === 'flag') {
        // 米格魯的「旗尾」：高高翹起、尾端一撮白，是最好認的特徵之一。
        // 白尖要貼在膠囊「含半球帽」的真正末端，否則會變成一顆飄在尾巴前面的白球。
        const tilt = -0.42, tr = s * 0.058, tipLen = s * 0.12 + tr
        outline(put(tail, capsule(tr, s * 0.24), mBody, 0, s * 0.14, -s * 0.04, null, [tilt, 0, 0]), 1.1)
        outline(put(tail, ball(tr * 1.15, 10), mMuzzle,
          0, s * 0.14 + tipLen * Math.cos(tilt), -s * 0.04 + tipLen * Math.sin(tilt)), 1.12)
      } else if (spec.tail === 'bushy') {
        // 狐狸的大蓬尾：往「後上方」掃（不是垂直豎起來，那會變成一根沖天棒），
        // 掃出身體輪廓才認得出是狐狸不是白貓
        outline(put(tail, capsule(s * 0.13, s * 0.30), mEar, 0, s * 0.14, -s * 0.10, null, [-1.0, 0, 0]), 1.08)
      } else if (spec.tail === 'paddle') {
        outline(put(tail, new THREE.BoxGeometry(s * 0.26, s * 0.06, s * 0.36), toon(c.ear || c.body),
          0, s * 0.14, -s * 0.20, null, [-0.5, 0, 0]), 1.06)
      } else if (spec.tail === 'flat') {
        outline(put(tail, capsule(s * 0.07, s * 0.3), mBody, 0, s * 0.10, -s * 0.16, [1.4, 1, 1], [-1.15, 0, 0]), 1.08)
      } else if (spec.tail === 'long') {
        outline(put(tail, capsule(s * 0.045, s * 0.42), mBody, 0, s * 0.20, -s * 0.06, null, [-0.45, 0, 0]), 1.1)
      } else if (spec.tail === 'ring') {
        // 環紋尾往上畫一道弧，五節才數得出黑白相間
        for (let i = 0; i < 5; i++) {
          outline(put(tail, ball(s * (0.085 - i * 0.007), 10), i % 2 ? mDark : mBelly,
            0, s * (0.05 + i * 0.068), -s * (0.05 + i * 0.075)), 1.1)
        }
      } else if (spec.tail === 'nub') {
        outline(put(tail, ball(s * 0.08, 10), mBelly, 0, 0, -s * 0.06), 1.1)
      } else {
        outline(put(tail, capsule(s * 0.055, s * 0.18), mBody, 0, s * 0.12, -s * 0.06, null, [-0.5, 0, 0]), 1.1)
      }
      break
    }

    // ── 海豹：一顆圓滾滾的身體＋前鰭 ──
    case 'blob': {
      const r = s * 0.34
      const bodyLen = s * 0.4
      const bodyY = r * 1.02
      // 跟四足一樣：膠囊的真正半長要加上半球帽，之前頭是埋在身體裡的（所以像一坨軟糖）
      const halfLen = bodyLen / 2 + r
      const torso = put(body, capsule(r, bodyLen), mBody, 0, bodyY, 0, null, [Math.PI / 2, 0, 0])
      outline(torso, 1.05)
      put(body, capsule(r * 0.76, s * 0.34), mBelly, 0, r * 0.76, s * 0.06, [1, 1, 0.7], [Math.PI / 2, 0, 0])
      for (const sx of [-1, 1]) {
        const f = put(body, ball(r * 0.44, 10), mBody, sx * r * 0.92, r * 0.62, s * 0.1, [0.5, 0.28, 1.1], [0, sx * 0.4, 0])
        outline(f, 1.1)
        parts.legs.push(f)
      }
      outline(put(body, ball(r * 0.44, 10), mBody, 0, r * 0.8, -halfLen * 0.95, [1.7, 0.3, 0.6]), 1.08)
      const headR = s * 0.29
      head.position.set(0, bodyY + r * 0.66, halfLen * 0.92)
      body.add(head)
      // 短脖子。海豹的脖子短，但完全沒有的話頭和身體還是會糊成一團
      outline(put(body, capsule(r * 0.52, r * 0.32), mBody,
        0, bodyY + r * 0.3, halfLen * 0.6, null, [0.85, 0, 0]), 1.06)
      outline(put(head, ball(headR, 16), mBody, 0, 0, 0), 1.06)
      outline(put(head, capsule(headR * 0.4, headR * 0.2), mMuzzle, 0, -headR * 0.3, headR * 0.6, [1.2, 1, 0.9], [Math.PI / 2, 0, 0]), 1.08)
      put(head, ball(headR * 0.14, 10), mDark, 0, -headR * 0.18, headR * 0.86)
      for (const sx of [-1, 1]) {   // 鬍鬚
        put(head, capsule(headR * 0.018, headR * 0.34), toon('#5A4636'), sx * headR * 0.3, -headR * 0.28, headR * 0.7, null, [0, 0, Math.PI / 2 + sx * 0.2])
      }
      makeEyes(head, parts, headR * 0.14, headR * 0.8, headR * 0.17, headR * 0.34)
      if (spec.blush) makeBlush(head, s, -headR * 0.16, headR * 0.7, headR * 0.62)
      break
    }

    // ── 直立型：企鵝、貓頭鷹 ──
    case 'upright': {
      const r = s * 0.32
      const torso = put(body, capsule(r, s * 0.3), mBody, 0, r + s * 0.14, 0)
      outline(torso, 1.05)
      put(body, capsule(r * 0.72, s * 0.26), mBelly, 0, r + s * 0.12, s * 0.12, [1, 1, 0.6])
      for (const sx of [-1, 1]) {
        const w = put(body, capsule(s * 0.08, s * 0.2), mEar, sx * r * 0.96, r + s * 0.14, 0, [0.55, 1, 1], [0, 0, sx * 0.12])
        outline(w, 1.1)
        wing(parts, w)
      }
      for (const sx of [-1, 1]) {
        outline(put(body, ball(s * 0.1, 10), toon('#F5A623'), sx * s * 0.13, s * 0.05, s * 0.07, [1, 0.42, 1.5]), 1.1)
      }
      const headR = s * 0.31
      head.position.set(0, r * 2 + s * 0.28, 0)
      body.add(head)
      outline(put(head, ball(headR, 16), mBody, 0, 0, 0), 1.06)
      if (spec.tuft) for (const sx of [-1, 1]) {
        outline(put(head, new THREE.ConeGeometry(headR * 0.3, headR * 0.62, 8), mEar,
          sx * headR * 0.56, headR * 0.86, 0, null, [0, 0, sx * -0.34]), 1.1)
      }
      if (spec.bigEyes) for (const sx of [-1, 1]) {
        put(head, ball(headR * 0.44, 12), toon(c.belly || '#FFF6D8'), sx * headR * 0.42, headR * 0.06, headR * 0.68, [1, 1, 0.42])
      }
      makeEyes(head, parts, headR * 0.08, headR * 0.82, headR * (spec.bigEyes ? 0.24 : 0.18), headR * 0.42)
      if (spec.beak) {
        outline(put(head, new THREE.ConeGeometry(headR * 0.24, headR * 0.5, 8), toon('#F5A623'),
          0, -headR * 0.24, headR * 0.82, null, [Math.PI / 2, 0, 0]), 1.1)
      }
      if (spec.glasses) for (const sx of [-1, 1]) {   // 小Q 的偵探眼鏡
        put(head, new THREE.TorusGeometry(headR * 0.3, headR * 0.045, 8, 18), toon('#2E2A26'), sx * headR * 0.42, headR * 0.06, headR * 0.9)
      }
      if (spec.blush) makeBlush(head, s, -headR * 0.24, headR * 0.72, headR * 0.66)
      break
    }

    // ── 小鳥：綠繡眼、信天翁 ──
    case 'bird': {
      const span = spec.wingspan ?? 1
      const r = s * 0.3
      outline(put(body, capsule(r, s * 0.22), mBody, 0, r + s * 0.1, 0, null, [1.35, 0, 0]), 1.05)
      put(body, capsule(r * 0.72, s * 0.18), mBelly, 0, r + s * 0.06, s * 0.1, [1, 1, 0.7], [1.35, 0, 0])
      for (const sx of [-1, 1]) {
        // 站著的鳥是把翅膀「收在身側」的，橫著展開會變成一塊穿過身體的板子。
        // 所以掛一個肩膀 Group，翅膀從那裡往下垂、稍微往後掃、翼尖外撇。
        // scale 的軸也要對：膠囊沒轉時 local Y 是長度、X 是厚度、Z 是前後翼弦。
        const sh = new THREE.Group()
        // 注意 z 旋轉的符號：下垂的翅膀繞 Z 轉，正值才會把翼尖往 +x 帶。
        // 寫成 sx * -0.5 會讓兩片翅膀都往內轉進身體裡，整個看不見。
        sh.position.set(sx * r * 0.82, r + s * 0.2, s * 0.02)
        sh.rotation.set(0.24, 0, sx * 0.2)
        body.add(sh)
        const len = s * 0.26 * span
        outline(put(sh, capsule(s * 0.068, len), mEar, 0, -(len / 2 + s * 0.05), 0, [0.5, 1, 1.5]), 1.1)
        wing(parts, sh)
      }
      outline(put(body, capsule(s * 0.06, s * 0.2), mEar, 0, r + s * 0.02, -s * 0.34, [1.6, 1, 0.4], [1.4, 0, 0]), 1.1)
      const headR = s * 0.24
      head.position.set(0, r * 2 + s * 0.1, s * 0.08)
      body.add(head)
      outline(put(head, ball(headR, 14), mBody, 0, 0, 0), 1.07)
      makeEyes(head, parts, headR * 0.14, headR * 0.8, headR * 0.2, headR * 0.4)
      if (petId === 'mejiro') for (const sx of [-1, 1]) {   // 綠繡眼的白眼圈
        put(head, new THREE.TorusGeometry(headR * 0.28, headR * 0.07, 8, 16), toon('#FFFFFF'), sx * headR * 0.4, headR * 0.14, headR * 0.78)
      }
      outline(put(head, new THREE.ConeGeometry(headR * 0.22, headR * 0.66, 8), toon('#F5A623'),
        0, -headR * 0.06, headR * 0.86, null, [Math.PI / 2, 0, 0]), 1.1)
      break
    }

    // ── 兩足：恐龍、猴子 ──
    case 'biped': {
      const r = s * 0.3
      const bodyY = s * 0.42
      outline(put(body, capsule(r, s * 0.24), mBody, 0, bodyY, 0), 1.05)
      put(body, capsule(r * 0.72, s * 0.2), mBelly, 0, bodyY - s * 0.02, s * 0.12, [1, 1, 0.62])
      for (const sx of [-1, 1]) {
        parts.legs.push(makeLeg(body, mBody, mBody, s, sx * r * 0.5, bodyY - r * 0.9, 0, s * 0.3))
      }
      for (const sx of [-1, 1]) {
        const a = put(body, capsule(s * 0.07, s * 0.18), mBody, sx * r * 0.94, bodyY + s * 0.02, s * 0.02, null, [0, 0, sx * 0.3])
        outline(a, 1.1)
        wing(parts, a)
      }
      const headR = s * 0.31
      head.position.set(0, bodyY + r + headR * 0.7, s * 0.03)
      body.add(head)
      outline(put(head, ball(headR, 16), mBody, 0, 0, 0), 1.06)
      if (spec.snout) {
        outline(put(head, capsule(headR * 0.42, headR * 0.3), mMuzzle, 0, -headR * 0.26, headR * 0.6, [1, 1, 0.9], [Math.PI / 2, 0, 0]), 1.08)
        put(head, ball(headR * 0.14, 10), mDark, 0, -headR * 0.14, headR * 0.96)
      }
      if (spec.ear === 'round') for (const sx of [-1, 1]) {
        outline(put(head, ball(headR * 0.34, 10), mEar, sx * headR * 0.9, headR * 0.14, 0, [0.45, 1, 1]), 1.1)
      }
      if (spec.spikes) for (let i = 0; i < 5; i++) {
        outline(put(body, new THREE.ConeGeometry(s * 0.07 - i * 0.008, s * 0.16, 6), mEar,
          0, bodyY + r * 0.78 - i * s * 0.1, -r * 0.62 - i * s * 0.055, null, [-0.3, 0, 0]), 1.1)
      }
      makeEyes(head, parts, headR * 0.14, headR * 0.82, headR * 0.19, headR * 0.38)
      const tail = new THREE.Group()
      tail.position.set(0, bodyY - r * 0.4, -r * 0.7)
      body.add(tail)
      parts.tail = tail
      if (spec.tail === 'curl') {
        for (let i = 0; i < 5; i++) {
          outline(put(tail, ball(s * 0.05, 8), mBody, Math.sin(i * 0.95) * s * 0.11, s * 0.055 * i, -s * (0.05 + i * 0.07)), 1.12)
        }
      } else {
        for (let i = 0; i < 4; i++) {
          outline(put(tail, ball(s * (0.15 - i * 0.03), 10), mBody, 0, -s * 0.025 * i, -s * (0.1 + i * 0.14)), 1.1)
        }
      }
      break
    }

    // ── 精靈型：小星、小月、小冥（會浮空）──
    case 'float': {
      const floatY = s * 0.64
      const core = new THREE.Group()
      if (spec.shape === 'star') {
        // 用五角星輪廓拉出厚度，比五根圓錐像星星多了
        const shape = new THREE.Shape()
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2
          const rad = i % 2 ? s * 0.19 : s * 0.44
          const px = Math.cos(a) * rad, py = Math.sin(a) * rad
          i ? shape.lineTo(px, py) : shape.moveTo(px, py)
        }
        shape.closePath()
        const geo = new THREE.ExtrudeGeometry(shape, { depth: s * 0.16, bevelEnabled: true, bevelSize: s * 0.03, bevelThickness: s * 0.03, bevelSegments: 2 })
        geo.center()
        outline(put(core, geo, mBody, 0, 0, 0), 1.05)
      } else if (spec.shape === 'moon') {
        const ring = put(core, new THREE.TorusGeometry(s * 0.3, s * 0.14, 10, 22, Math.PI * 1.3), mBody, 0, 0, 0, null, [0, 0, -Math.PI * 0.3])
        outline(ring, 1.06)
      } else {
        outline(put(core, ball(s * 0.34, 16), mBody, 0, 0, 0), 1.05)
        put(core, new THREE.TorusGeometry(s * 0.52, s * 0.035, 8, 28), mBelly, 0, 0, 0, null, [Math.PI * 0.42, 0, 0])
      }
      core.position.y = floatY
      body.add(core)
      parts.float = core
      makeEyes(core, parts, 0, s * 0.3, s * 0.055, s * 0.11)
      makeBlush(core, s, -s * 0.08, s * 0.26, s * 0.19)
      break
    }

    // ── 阿榕：老榕樹靈 ──
    case 'tree': {
      const trunk = put(body, new THREE.CylinderGeometry(s * 0.19, s * 0.28, s * 0.62, 10), mBody, 0, s * 0.31, 0)
      outline(trunk, 1.05)
      for (const sx of [-1, 1]) {   // 氣根當手
        const r = put(body, capsule(s * 0.04, s * 0.24), mBody, sx * s * 0.27, s * 0.4, 0, null, [0, 0, sx * 0.5])
        outline(r, 1.12)
        wing(parts, r)
      }
      const crown = new THREE.Group()
      crown.position.y = s * 0.84
      const leafMat = toon(c.leaf || '#5FA347')
      for (const [lx, ly, lz, lr] of [[0, 0.1, 0, 0.36], [-0.28, -0.02, 0.1, 0.24], [0.28, 0, -0.08, 0.26], [0.05, 0.26, -0.16, 0.21]]) {
        outline(put(crown, ball(s * lr, 12), leafMat, s * lx, s * ly, s * lz), 1.06)
      }
      body.add(crown)
      parts.float = crown
      head.position.set(0, s * 0.44, s * 0.24)
      body.add(head)
      makeEyes(head, parts, 0, 0, s * 0.06, s * 0.11)
      break
    }
    default: break
  }

  // 第 4 階段的傳說光暈
  if (c.glow) {
    const glow = new THREE.Mesh(
      ball(s * 0.85, 12),
      new THREE.MeshBasicMaterial({ color: c.glow, transparent: true, opacity: 0.14, depthWrite: false })
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
