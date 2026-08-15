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
  // 黑臘腸：眼睛用榛色而不是金色 —— 黑狗配金瞳會像夜裡發光，但純黑眼珠又會消失在毛色裡
  xiaohu:  { kind: 'quad', ear: 'flop',  tail: 'wag',    size: 0.92, snout: 1.0, long: 1.5, leg: 0.55,
             socks: true, eyePatch: true, eye: '#B8813A' },
  // 兩隻都是水獺，第 1～3 階的配色幾乎一樣（#8B6347 / #7A5538），遠看分不出來，
  // 所以改用體型拉開差距，而且對得上個性：
  // Hana「活潑好奇」＝腿長、身形苗條、嘴尖一點；Kotaro「沉穩愛吃」＝矮胖、圓臉。
  hana:    { kind: 'quad', ear: 'tiny', tail: 'flat', size: 0.94, snout: 0.70, long: 1.50, leg: 0.50, neck: 0.38, girth: 0.92, blush: true },
  kotaro:  { kind: 'quad', ear: 'tiny', tail: 'flat', size: 1.02, snout: 0.60, long: 1.58, leg: 0.44, neck: 0.32, girth: 1.12, blush: true },
  // 貓：臉是楔形不是球 —— 頭骨窄一點、前後長一點，配上高尖耳
  jiji:    { kind: 'quad', ear: 'point', tail: 'long',   size: 0.92, snout: 0.55, skull: [0.86, 0.90, 1.14] },
  kitsune: { kind: 'quad', ear: 'point', tail: 'bushy',  size: 0.95, snout: 0.8, blush: true },
  raccoon: { kind: 'quad', ear: 'round', tail: 'ring',   size: 0.95, snout: 0.7, mask: true },
  beaver:  { kind: 'quad', ear: 'tiny',  tail: 'paddle', size: 0.95, snout: 0.7, teeth: true },
  // 倉鼠：套狗的比例就只是一隻縮小的狗。倉鼠是「一顆大頭加一團身體」——
  // 頭比身體還大、幾乎沒脖子、腿短到看不見，再加上鼓頰（2D 版就是靠這個一眼認出來）。
  // 腮紅由頰囊自己帶（畫在臉頰上），所以不掛 blush，否則會被鼓起來的臉頰蓋住。
  // ⚠️ 圓滾滾要靠 girth（胖）而不是 long（短）：真倉鼠四腳著地時長寬比約 1.6~1.8，
  // 把 long 壓到 0.55 會變成一顆球（實測 1.28），讀起來像天竺鼠。
  // 也別拿 2D 版的 ellipse 當身體長度的依據 —— 那是正面視角，只看得到寬和高。
  hamster: { kind: 'quad', ear: 'round', tail: 'nub',    size: 0.72, snout: 0.42,
             long: 0.90, girth: 1.45, leg: 0.30, neck: 0.10, head: 1.30, pouch: true },
  seal:    { kind: 'blob', tail: 'fin',  size: 1.00, snout: 0.6, blush: true },
  // 企鵝：白臉罩是關鍵（深色頭殼配白臉才有立體感），喙也要真的突出來才不像一張平面的臉。
  // 眼睛改回近黑：深藍身體會觸發自動亮眼珠（金瞳配企鵝很怪），先前折衷用暖褐色，
  // 但現在眼睛落在白臉罩上，黑眼珠對比最好、也跟 2D 版一致。
  penguin: { kind: 'upright', beak: 1.7, size: 0.95, blush: true, face: true, eye: '#1A1A1A' },
  // 貓頭鷹：臉盤要貼在頭上看得到，喙也要真的突出來；headTurn＝招牌的轉頭。
  // 身體要跟企鵝拉開：蹲著的圓球（girth 胖、long 矮）＋胸口只有一小塊淡色（front）
  // ＋收攏的寬翅膀（wing:'fold'）。三者都不做的話，牠就只是一隻紫色企鵝。
  owl:     { kind: 'upright', beak: 1.35, size: 0.90, tuft: true, bigEyes: true, headTurn: true,
             girth: 1.18, long: 0.18, front: 0.60, wing: 'fold' },
  xiaoq:   { kind: 'upright', beak: 1.35, size: 0.90, tuft: true, bigEyes: true, glasses: true, headTurn: true,
             girth: 1.18, long: 0.18, front: 0.60, wing: 'fold' },
  // 小綠（綠繡眼）：走「幼鳥寶寶」路線 —— 大頭、大眼、圓身、短翅短尾、短鈍喙。
  // 頭/身 1.17（2D 版是 23/21＝1.10），成鳥比例會讓牠看起來像一隻普通小鳥。
  mejiro:  { kind: 'bird', beak: 1.25, beakR: 0.15, size: 0.58, head: 1.35, girth: 0.92, long: 0.50,
             eyeSize: 1.25, wingspan: 0.85, tailLen: 0.65 },
  // 飛飛（信天翁）：翼長，但收翅時不能長到拖地。特色＝又長又粗的鉤嘴＋溫柔的眉羽，
  // 這兩樣 2D 版都有標名字，3D 原本兩樣都沒做，只是一隻放大的普通小鳥。
  feifei:  { kind: 'bird', beak: 1.5, beakR: 0.17, beakHook: true, brow: true, size: 1.05, wingspan: 1.45 },
  // 豆豆＝副櫛龍（鴨嘴龍類）：長頭冠＋寬扁的鴨嘴，兩者缺一就只是一隻泛用小恐龍
  dino:    { kind: 'biped', tail: 'thick', size: 1.00, crest: true, bill: true },
  // 皮皮（猴子）：長手臂＋抓握的手（原本套企鵝的短鰭）、奶油色臉、外推的大圓耳。
  // 這三樣是「看得出是猴子」的最低配；缺了臉那片淺色，就只是一顆單色圓頭。
  monkey:  { kind: 'biped', tail: 'curl',  size: 0.90, ear: 'round', snout: 0.6,
             arm: 'long', face: 'cream' },
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
  const s = Math.max(1, Math.min(4, stage || 1))
  return EVO[petId]?.[s] ?? EVO.lulu[1]
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
// mid＝要往哪個方向收窄：π＝local −z（米格魯背鞍、企鵝圍兜都用這個）、0＝local +z（小鳥的腹側）
function saddleGeo(r, straight, len, spread, mid = Math.PI) {
  const geo = new THREE.CylinderGeometry(r, r, len, 24, 16, true, mid - spread / 2, spread)
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
    // ⚠️ atan2 的值域是 (-π, π]，而這片曲面正好跨在 π 上 —— 超過 π 的那半圈會被回報成負角
    // （4.367 變 -1.916），接著收窄時就往反方向繞，中段的 k（約 0.4~0.7）會把頂點甩到正對面去。
    // 先接回 [0, 2π) 讓角度連續，收窄才會乖乖往 π 靠。
    let a = Math.atan2(pos.getX(i), pos.getZ(i))    // 目前角度（0＝正下方、π＝正上方）
    if (mid > Math.PI / 2 && a < 0) a += Math.PI * 2
    const na = mid + (a - mid) * k                  // 往 mid 的方向收
    pos.setX(i, Math.sin(na) * rr)
    pos.setZ(i, Math.cos(na) * rr)
  }
  geo.computeVertexNormals()
  return geo
}

// 把一條輪廓曲線旋轉成尾巴。profile(t) 回傳 t（0＝根部、1＝尖端）處的半徑倍率。
// 用基本柱體做不出尾巴：側邊是直線就是三角錐，等粗就是香腸／圓柱 ——
// 真實尾巴的差別在「曲率」，而每個物種的曲率還不一樣（水獺根部粗、狐狸中段蓬）。
// Lathe 的原點就在根部，所以直接擺在尾巴基座上往後轉即可，不必再算位移。
function latheTail(rmax, len, profile, segs = 12) {
  const pts = []
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    pts.push(new THREE.Vector2(rmax * profile(t), t * len))
  }
  return new THREE.LatheGeometry(pts, 14)
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

// 螢幕亮度（用來判斷毛色深淺）
const lum = (hex) => {
  const n = parseInt(String(hex).slice(1), 16)
  return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255
}

// 大眼睛＋高光點：卡通角色的可愛度幾乎都在這。
// 眼珠顏色從 parts.eyeCol 讀（由 buildPet 依毛色算好），深色寵物不能用黑眼珠 ——
// 黑貓吉吉的黑眼睛會整顆融進毛色裡，只剩高光那一點，看起來像獨眼。
function makeEyes(target, parts, y, z, r, spread) {
  const geo = ball(r, 12)
  const hi = ball(r * 0.34, 8)
  const dark = toon(parts.eyeCol || '#1B1208')
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
  // 毛色太深就改用亮眼珠，否則黑眼睛會整顆消失在毛色裡（吉吉曾經看起來像獨眼）。
  // spec.eye 可逐物種覆寫：黑貓配金瞳很對，但黑狗配金瞳會像夜裡發光的眼睛。
  parts.eyeCol = spec.eye || (lum(c.body) < 0.34 ? '#F0C24A' : '#1B1208')
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
      // 身體收窄，才襯得出大頭、也才看得到脖子；girth 用來拉開同物種的胖瘦（兩隻水獺）
      const bodyR = s * 0.245 * (spec.girth ?? 1)
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
      // head＝頭相對身體的大小。倉鼠這種「頭比身體還大」的物種，光靠 size 縮放沒用
      // （整隻一起縮，比例不變），要單獨把頭放大才會從狗變成倉鼠。
      const headR = s * 0.30 * (spec.head ?? 1)
      // neck＝頭抬多高。狗要抬頭挺胸（1）；水獺這種鼬科是長身短腿、頭幾乎跟背同高（0.3~0.4），
      // 不壓低的話同一套骨架看起來就都是狗。
      const lift = spec.neck ?? 1
      const neckY = bodyY + bodyR * (0.30 + 0.32 * lift)
      const neckZ = halfLen * 0.72
      head.position.set(0, neckY + headR * (0.22 + 0.40 * lift), neckZ + headR * 0.62)
      body.add(head)
      outline(put(body, capsule(bodyR * 0.44, bodyR * 0.66), mBody,
        0, (neckY + head.position.y) / 2, (neckZ + head.position.z) / 2, null, [0.72, 0, 0]), 1.06)
      // skull＝頭骨比例 [寬, 高, 長]。狗是圓的，貓要窄一點、前後長一點才有楔形感。
      // ⚠️ 斑紋 patch() 是照 headR 貼在正球面上的，所以有斑紋的寵物（米格魯）別改這個。
      const skull = put(head, ball(headR, 16), mBody, 0, 0, 0, spec.skull ?? [1, 0.96, 1])
      outline(skull, 1.06)

      // 眼睛上方的深色斑：三色犬「棕頭」的來源，也給米格魯一點眉毛的表情
      if (spec.eyePatch) for (const sx of [-1, 1]) {
        patch(head, headR, mEar, FRONT + sx * 0.50, 0.60, 1.02, 0.46)
      }
      // 臉中央的白色鼻樑線：只走臉的前面，別繞過頭頂（不然像貼了一條賽車貼紙）
      if (spec.blaze) {
        patch(head, headR, mMuzzle, FRONT, 0.34, 1.28, 0.78)
      }

      // 門牙掛在哪：有嘴管的掛在嘴管最前端、沒有的貼臉前（實際值在 snout 區塊算完覆寫）
      let toothY = -headR * 0.52
      let toothZ = headR * 0.86
      if (spec.snout) {
        // 米格魯（史努比）的招牌是「明顯突出的嘴管」，不是臉上一個小凸起。
        // 原本只凸出頭部半徑的 27%，太含蓄；拉長到 41% 並「加上描邊」，
        // 才會讀成一截接出去的獨立體積而不是頭的一部分。
        const snoutLen = headR * 0.78 * spec.snout
        const snoutR = headR * 0.32
        outline(put(head, capsule(snoutR, snoutLen), mMuzzle, 0, -headR * 0.26, headR * 0.70,
          [1.05, 1, 0.95], [Math.PI / 2, 0, 0]), 1.06)
        // 大鼻頭壓在嘴管前端的上緣（史努比的鼻子又大又圓）
        put(head, ball(headR * 0.19, 10), mDark, 0, -headR * 0.16,
          headR * 0.70 + snoutLen * 0.5 + snoutR * 0.72, [1.15, 0.95, 1])
        // 嘴管前端最外緣（capsule 實際長度＝height + 2×radius；scale 的 0.95 壓的是厚度不是長度，別乘進來）
        toothZ = headR * 0.70 + snoutLen * 0.5 + snoutR + headR * 0.04
        toothY = -headR * 0.26 - snoutR * 0.55
      }
      // 河狸的門牙原本是一塊板子塞在 z=0.82headR，整個埋在嘴管裡看不到（本專案最常見的 bug）。
      // 改掛到嘴管最前端再往下垂，並拆成左右兩顆＋描邊，俯視角才讀得出「兩顆大門牙」。
      if (spec.teeth) for (const sx of [-1, 1]) {
        const tw = headR * 0.17
        outline(put(head, new THREE.BoxGeometry(tw, headR * 0.34, headR * 0.12), toon('#FFF6D8'),
          sx * tw * 0.58, toothY, toothZ), 1.10)
      }
      // 浣熊的眼罩：原本是一顆壓扁的球塞在頭裡（三個半軸都小於 headR），只有臉正前方擠出一條縫，
      // 而遊戲是俯視角＝整個看不到，偏偏眼罩正是浣熊最好認的特徵。
      // 改用 patch() 貼合頭部曲面，並把上緣拉到「眉毛以上」（theta 中心 1.24 比眼睛的 1.46 高），
      // 俯視時看到的就是那一塊。顏色改用 nose 的近黑：ear 跟毛色只差一階，遠看等於沒畫。
      if (spec.mask) for (const sx of [-1, 1]) {
        patch(head, headR, mDark, FRONT + sx * 0.42, 0.80, 1.24, 0.92)
      }
      // 倉鼠的鼓頰：塞滿食物的臉頰，是倉鼠最好認的一點（palette 註解寫的「金黃＋鼓頰」就是它）。
      // 要用實心球「疊在頭外面」而不是貼曲面的 patch —— 鼓頰的重點是撐出輪廓，
      // 從俯視角看得到臉的兩側鼓出來，貼平的色塊做不到。
      if (spec.pouch) for (const sx of [-1, 1]) {
        const cheek = put(head, ball(headR * 0.46, 10), mBody,
          sx * headR * 0.80, -headR * 0.16, headR * 0.30, [1, 0.94, 1.06])
        outline(cheek, 1.08)
        // 腮紅畫在頰囊上，比照 2D 版；掛在 head 上的話會被鼓起來的臉頰整個蓋住
        put(cheek, ball(headR * 0.20, 8), blushMat, sx * headR * 0.10, -headR * 0.04, headR * 0.32)
      }

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
          // 貓和狐狸的尖耳要「高而窄」，圓球頭配矮耳朵會整隻變成泰迪熊
          const ear = put(head, new THREE.ConeGeometry(headR * 0.31, headR * 0.84, 8), mEar,
            sx * headR * 0.54, headR * 0.90, 0, null, [0, 0, sx * -0.20])
          outline(ear, 1.1)
          put(head, new THREE.ConeGeometry(headR * 0.16, headR * 0.50, 8), toon(c.earInner || '#F5B8C8'),
            sx * headR * 0.54, headR * 0.92, headR * 0.1, null, [0, 0, sx * -0.20])
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
        // 掃出身體輪廓才認得出是狐狸不是白貓。
        // 輪廓是「中段最蓬、兩端收」——等粗的膠囊做出來就是一支大圓柱。
        outline(put(tail, latheTail(s * 0.145, s * 0.60,
          (t) => Math.sin(Math.PI * (0.28 + 0.72 * t)) ** 0.7), mEar,
          0, 0, 0, null, [-1.0, 0, 0]), 1.08)
      } else if (spec.tail === 'paddle') {
        // 河狸的招牌是一片「槳」：根部收窄、中段最寬、末端收圓。原本是一塊 BoxGeometry，
        // 四個角都是直角，看起來像屁股後面拖了片木板。改用旋轉輪廓做出橢圓槳形，
        // 再壓成 0.3 的厚度（河狸尾巴比水獺的舵還扁），並往後放平才會落在剪影裡。
        // ⚠️ LatheGeometry 不封口，根部是一個開口 —— 一旦露出身體表面就會看到中空的洞。
        // 這裡刻意把根部往前塞進身體（z +0.05s）留出餘裕；先前往後上方挪了一點點
        // 就讓開口跑到體外，尾巴根部整個看起來是破的。
        // （水獺與狐狸的尾根餘裕只有 0.002，等於擦邊過關，動它們的位置前先量過再改。）
        outline(put(tail, latheTail(s * 0.165, s * 0.54,
          (t) => Math.sin(Math.PI * (0.20 + 0.80 * t)) ** 0.5), toon(c.ear || c.body),
          0, 0, s * 0.05, [1.34, 1, 0.30], [-1.22, 0, 0]), 1.06)
      } else if (spec.tail === 'flat') {
        // 水獺的尾巴是一支「舵」：根部粗壯、往尾端收尖，而且左右寬、上下扁。
        // 等粗的膠囊做不出來，看起來就是一根香腸接在屁股上 —— 改用截頂圓錐取得漸縮。
        // 水獺的尾巴是一支「舵」：根部粗壯、一路粗到底、末段才突然收尖，
        // 而且左右寬、上下扁。指數越小中段越飽滿（0.5 比 0.75 更晚收尖）。
        outline(put(tail, latheTail(s * 0.13, s * 0.62, (t) => Math.cos(t * Math.PI / 2) ** 0.5), mBody,
          0, 0, 0, [1.26, 1, 0.72], [-1.28, 0, 0]), 1.08)
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
      // girth／long＝軀幹的胖與高。貓頭鷹和企鵝原本共用完全相同的一副身體，
      // 難怪貓頭鷹看起來像企鵝 —— 2D 版裡企鵝是直立的長橢圓（rx26 ry31），
      // 貓頭鷹卻是一顆蹲著的圓球（rx25 ry22），身體形狀本來就是這兩隻最大的差別。
      const r = s * 0.32 * (spec.girth ?? 1)
      const straight = s * 0.3 * (spec.long ?? 1)
      const bodyY = r + s * 0.14
      const torso = put(body, capsule(r, straight), mBody, 0, bodyY, 0)
      outline(torso, 1.05)
      // 白胸腹：原本是一根縮小的膠囊擺在 z=0.12s，但它的前緣只到 0.258s，而軀幹半徑是 0.32s
      // —— 整根埋在身體裡看不見，等於企鵝／貓頭鷹／小Q 三隻站姿寵物**沒有任何分得出正面的特徵**，
      // 從背後看跟正面一模一樣（貓頭鷹的轉頭要成立，就靠這片撐出身體的朝向）。
      // 改用 saddleGeo（本來給米格魯背鞍的貼合曲面），繞 Y 轉 180° 讓收窄的那面朝前＝胸前的圍兜。
      // front＝這片白斑要多大。企鵝是「一整片白肚」（2D rx18/ry25，幾乎蓋滿身體），
      // 貓頭鷹只是胸口一小塊淡色（rx16/ry15）。給貓頭鷹畫企鵝那種大白肚，牠就會變成企鵝。
      const fw = spec.front ?? 1
      put(body, saddleGeo(r * 1.03, straight, straight + r * 1.1 * fw, Math.PI * 0.78 * fw), mBelly,
        0, bodyY, 0, null, [0, Math.PI, 0])
      for (const sx of [-1, 1]) {
        // 企鵝的鰭腳是細長一條、貼在體側；貓頭鷹是「收攏的翅膀」——
        // 要寬、要包住整片體側、而且要用深色的 ear 羽色，才看得出那是翅膀不是鰭。
        const fold = spec.wing === 'fold'
        const w = put(body, capsule(s * (fold ? 0.115 : 0.08), s * (fold ? 0.30 : 0.2)), mEar,
          sx * r * (fold ? 0.86 : 0.96), bodyY, 0,
          fold ? [0.40, 1, 1.55] : [0.55, 1, 1], [0, 0, sx * 0.12])
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
      // 貓頭鷹的臉盤：原本是兩顆壓扁的球擺在 z=0.68 headR，最外緣只到 1.081 headR，
      // 幾乎整片陷在頭裡，只露出一絲邊 —— 貓頭鷹最好認的就是這兩圈臉盤，看不到當然不像。
      // 改用 patch() 貼合頭部曲面，中心對準眼睛的方位（phi=FRONT±0.47、theta=1.48），
      // 兩片在正前方剛好接在一起，中間讓喙穿出來。
      if (spec.bigEyes) for (const sx of [-1, 1]) {
        patch(head, headR, toon(c.belly || '#FFF6D8'), FRONT + sx * 0.47, 0.92, 1.48, 0.92)
      }
      // 企鵝的白臉罩：企鵝的臉有立體感靠的是「深色頭殼 vs 白臉」的對比（2D 版的 White face mask）。
      // 少了它，整顆頭就是一顆同色的球、深色眼睛又貼在深色上，看起來就是一張平面的臉。
      // 上緣停在 theta 0.60：頭頂那圈深色一定要留著，那是企鵝的「帽子」，蓋掉就不像企鵝了。
      if (spec.face) patch(head, headR, mMuzzle, FRONT, 1.90, 1.45, 1.70)
      makeEyes(head, parts, headR * 0.08, headR * 0.82, headR * (spec.bigEyes ? 0.24 : 0.18), headR * 0.42)
      if (spec.beak) {
        // beak 可以給數字當長度倍率。原本寫死 headR*0.5，圓錐尖端只到 1.096 headR ——
        // 頭的表面就在 1.0，等於整支喙埋在頭裡面，臉上什麼都沒突出來。
        // 位移跟著長度一起算，bk=1 時與舊值完全相同（貓頭鷹／小Q 不受影響）。
        const bLen = headR * 0.5 * (spec.beak === true ? 1 : spec.beak)
        outline(put(head, new THREE.ConeGeometry(headR * 0.24, bLen, 8), toon('#F5A623'),
          0, -headR * 0.24, headR * 0.82 + (bLen - headR * 0.5) * 0.5, null, [Math.PI / 2, 0, 0]), 1.1)
      }
      // 小Q 的偵探眼鏡：原本 z=0.9 headR，鏡框內側只到 0.909 headR ——
      // 本來就有一半陷在臉裡，臉盤改成貼在 1.015 headR 之後更會被整個吃掉。
      // 推到 1.06 讓它架在臉盤前面（眼鏡本來就該浮在臉上）。
      if (spec.glasses) for (const sx of [-1, 1]) {
        put(head, new THREE.TorusGeometry(headR * 0.3, headR * 0.045, 8, 18), toon('#2E2A26'), sx * headR * 0.42, headR * 0.06, headR * 1.06)
      }
      if (spec.blush) makeBlush(head, s, -headR * 0.24, headR * 0.72, headR * 0.66)
      parts.headTurn = !!spec.headTurn      // 貓頭鷹的招牌轉頭，動畫端讀這個
      break
    }

    // ── 小鳥：綠繡眼、信天翁 ──
    case 'bird': {
      const span = spec.wingspan ?? 1
      // 幼鳥＝小小的圓身體配一顆大頭。girth／long 用來把小綠的身體縮成一團，
      // 成鳥（飛飛）維持原值不受影響。
      const r = s * 0.3 * (spec.girth ?? 1)
      const straight = s * 0.22 * (spec.long ?? 1)
      const bodyY = r + s * 0.1
      outline(put(body, capsule(r, straight), mBody, 0, bodyY, 0, null, [1.35, 0, 0]), 1.05)
      // 淡色胸腹：原本是一根縮小的膠囊擺在 z=0.1s，前緣只到 0.251s，而軀幹半徑是 0.3s
      // —— 又是整根埋在身體裡看不見。改用貼合曲面，mid=0 收在腹側（背側是深色羽毛）。
      put(body, saddleGeo(r * 1.03, straight, straight + r * 1.0, Math.PI * 0.68, 0), mBelly,
        0, bodyY, 0, null, [1.35, 0, 0])
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
      // 尾羽：位置跟著身體長度走（原本寫死 -0.34s，身體一縮就會飄在屁股後面）。
      // 幼鳥的尾羽還沒長齊，用 tailLen 收短。
      const tl = spec.tailLen ?? 1
      outline(put(body, capsule(s * 0.06, s * 0.2 * tl), mEar,
        0, r + s * 0.02, -(straight * 0.5 + r * 0.72), [1.6, 1, 0.4], [1.4, 0, 0]), 1.1)
      // 幼鳥的頭要大：2D 版的小綠是頭 r23 配身體 rx21＝頭比身體還大，
      // 3D 原本是 0.24s 配 0.30s＝頭只有身體的 0.8 倍，所以看起來是成鳥不是寶寶。
      const headR = s * 0.24 * (spec.head ?? 1)
      // 頭放大多少就往上抬多少，不然大頭會整顆陷進身體裡。head=1 時與舊值完全相同（飛飛不受影響）。
      head.position.set(0, bodyY + r + (headR - s * 0.24) * 1.1, s * 0.08)
      body.add(head)
      outline(put(head, ball(headR, 14), mBody, 0, 0, 0), 1.07)
      makeEyes(head, parts, headR * 0.14, headR * 0.8, headR * 0.2 * (spec.eyeSize ?? 1), headR * 0.4)
      // 綠繡眼的白眼圈（牠的名字就是從這來的）：原本是一圈 Torus 擺在 z=0.78 headR，
      // 內側只到 0.80 headR、頭的表面在 1.0 —— 一半陷在頭裡，最該看到的特徵反而看不見。
      // 改成貼合頭部曲面的白色圓斑，中心對準眼睛的方位；眼珠本身凸出到 1.1 headR，
      // 疊上去之後露在外圈的白就是「眼圈」，不必真的做一個環。
      if (petId === 'mejiro') for (const sx of [-1, 1]) {
        patch(head, headR, toon('#FFFFFF'), FRONT + sx * 0.465, 0.84, 1.415, 0.84)
      }
      // beak＝長度倍率、beakR＝底部粗細（beak=true + 預設 beakR 時與舊值完全相同）。
      // 「尖」是靠細長比，不是靠長度：底半徑 0.22 配長 0.56 就是一顆鈍豆點，
      // 會變成圓球配小嘴的シマエナガ。綠繡眼的嘴要細而突出，這是牠的辨識特徵，
      // 不能為了做「寶寶感」把它縮掉。
      const bkLen = headR * 0.66 * (spec.beak === true ? 1 : spec.beak)
      const bkZ = headR * 0.86 + (bkLen - headR * 0.66) * 0.5
      outline(put(head, new THREE.ConeGeometry(headR * (spec.beakR ?? 0.22), bkLen, 8), toon('#F5A623'),
        0, -headR * 0.06, bkZ, null, [Math.PI / 2, 0, 0]), 1.1)
      // 信天翁的前端小勾：一支往下前方斜的小圓錐接在嘴尖上（2D 版用深一階的 #D89432 畫）。
      // 沒有這個勾，長嘴只是一根圓錐；有了它才讀得出是信天翁那種鉤嘴。
      if (spec.beakHook) {
        const hk = headR * 0.24
        outline(put(head, new THREE.ConeGeometry(headR * 0.135, hk, 8), toon('#D89432'),
          0, -headR * 0.10, bkZ + bkLen * 0.42, null, [Math.PI / 2 + 0.85, 0, 0]), 1.12)
      }
      // 眉羽：信天翁招牌的「溫柔眼影」，眼睛上方兩道深色弧（2D 版就是靠它讓表情變柔）
      if (spec.brow) for (const sx of [-1, 1]) {
        patch(head, headR, mEar, FRONT + sx * 0.465, 0.72, 1.03, 0.34)
      }
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
        if (spec.arm === 'long') {
          // 猴子是「長手臂＋能抓握的手」。原本跟企鵝共用同一根短鰭 ——
          // 那是鳥收起來的翅膀，掛在靈長類身上完全不對。
          // 掛肩膀 Group 讓手臂從那裡垂下來（動畫端轉這個就會晃），末端加一顆手掌。
          const sh = new THREE.Group()
          sh.position.set(sx * r * 0.9, bodyY + s * 0.09, s * 0.02)
          sh.rotation.set(0.12, 0, sx * 0.24)
          body.add(sh)
          const armLen = s * 0.30
          outline(put(sh, capsule(s * 0.055, armLen), mBody, 0, -(armLen / 2 + s * 0.05), 0), 1.1)
          // 手掌用 ear 色（2D 版的手腳也是 ear 色），稍微捏長一點才像手不像球
          outline(put(sh, ball(s * 0.075, 10), mEar, 0, -(armLen + s * 0.11), s * 0.012, [0.85, 1.15, 1]), 1.1)
          wing(parts, sh)
        } else {
          const a = put(body, capsule(s * 0.07, s * 0.18), mBody, sx * r * 0.94, bodyY + s * 0.02, s * 0.02, null, [0, 0, sx * 0.3])
          outline(a, 1.1)
          wing(parts, a)
        }
      }
      const headR = s * 0.31
      head.position.set(0, bodyY + r + headR * 0.7, s * 0.03)
      body.add(head)
      outline(put(head, ball(headR, 16), mBody, 0, 0, 0), 1.06)
      if (spec.snout) {
        // bill＝鴨嘴龍類的寬扁嘴（副櫛龍就是鴨嘴龍類），要橫向加寬、上下壓扁
        outline(put(head, capsule(headR * 0.42, headR * 0.3), mMuzzle, 0, -headR * 0.26, headR * 0.6,
          spec.bill ? [1.45, 1, 0.55] : [1, 1, 0.9], [Math.PI / 2, 0, 0]), 1.08)
        // 鼻孔要放在嘴的「上緣」：擺在中心會整顆埋進嘴管裡（原本那顆就是這樣，一直看不見）
        if (spec.bill) for (const sx of [-1, 1]) {
          put(head, ball(headR * 0.07, 8), mDark, sx * headR * 0.17, -headR * 0.02, headR * 0.86)
        } else {
          put(head, ball(headR * 0.14, 10), mDark, 0, -headR * 0.14, headR * 0.96)
        }
      }
      // 猴子的奶油色臉：2D 版用「上面一片寬扁 + 下面一球圓」兩片橢圓疊出來（`MonkeyBase`），
      // 3D 照同一套邏輯用兩片貼合曲面的球殼疊。臉上有這片淺色，猴子才認得出來 ——
      // 少了它就只是一顆單色的圓頭。眼睛在 theta 1.42，剛好落在上面那片裡（跟 2D 一樣）。
      if (spec.face === 'cream') {
        patch(head, headR, mBelly, FRONT, 1.40, 1.33, 0.80)   // 上：寬而扁，蓋住眉眼
        patch(head, headR, mBelly, FRONT, 1.50, 1.85, 1.30)   // 下：圓而飽滿，蓋住口鼻
      }
      if (spec.ear === 'round') for (const sx of [-1, 1]) {
        // 大圓耳往外推到 1.0 headR：原本 0.9 只露出 0.05，幾乎貼在頭上看不出是耳朵
        outline(put(head, ball(headR * 0.34, 10), mBody, sx * headR * 1.0, headR * 0.14, 0, [0.45, 1, 1]), 1.1)
        put(head, ball(headR * 0.19, 8), mBelly, sx * headR * 1.06, headR * 0.14, 0, [0.45, 1, 1])
      }
      // 副櫛龍的長頭冠：從後腦往後上方伸出的一根長管。牠的冠是「中空」的，
      // 學者推測可以像喇叭一樣吹出低沉的聲音跟同伴互相呼叫。
      // 這是牠最好認的特徵 —— 剪影上只要有這根就認得出來，所以要夠長（1.35 倍頭半徑）。
      if (spec.crest) {
        outline(put(head, latheTail(headR * 0.21, headR * 1.35,
          (t) => Math.sin(Math.PI * (0.34 + 0.60 * t)) ** 0.45), mEar,
          0, headR * 0.42, -headR * 0.52, null, [-1.0, 0, 0]), 1.08)
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
      // 擠出的薄片正面在哪，眼睛就要放在哪。原本一律用 s*0.3，
      // 但星星／月亮擠出後正面只到 0.11s，眼睛等於浮在臉前面 0.19s 的空中。
      const flatDepth = s * 0.16, flatBevel = s * 0.03
      let eyeZ                                    // 由下面各形狀自己填
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
        const geo = new THREE.ExtrudeGeometry(shape, { depth: flatDepth, bevelEnabled: true, bevelSize: flatBevel, bevelThickness: flatBevel, bevelSegments: 2 })
        geo.center()
        outline(put(core, geo, mBody, 0, 0, 0), 1.05)
        eyeZ = flatDepth / 2 + flatBevel
      } else if (spec.shape === 'moon') {
        // 彎月＝大圓「挖掉」一個偏心的小圓。原本用一段等粗的圓環，
        // 兩端是平的開口，看起來像馬蹄鐵／磁鐵，不像月亮 ——
        // 月牙的關鍵就在「兩端要收成尖角、內緣要是圓弧」。
        const R = s * 0.44, r2 = s * 0.36, d = s * 0.22
        const x0 = (R * R - r2 * r2 + d * d) / (2 * d)       // 兩圓交點
        const y0 = Math.sqrt(Math.max(0, R * R - x0 * x0))
        const a0 = Math.atan2(y0, x0)                        // 交點在外圓的角度
        const b0 = Math.atan2(y0, x0 - d)                    // 交點在內圓的角度
        const pts = []
        for (let i = 0; i <= 26; i++) {                      // 外弧：走左半邊
          const a = a0 + (2 * Math.PI - 2 * a0) * (i / 26)
          pts.push(new THREE.Vector2(Math.cos(a) * R, Math.sin(a) * R))
        }
        for (let i = 0; i <= 20; i++) {                      // 內弧：沿內圓左側繞回去
          const b = (2 * Math.PI - b0) + (b0 - (2 * Math.PI - b0)) * (i / 20)
          pts.push(new THREE.Vector2(d + Math.cos(b) * r2, Math.sin(b) * r2))
        }
        const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts),
          { depth: flatDepth, bevelEnabled: true, bevelSize: flatBevel, bevelThickness: flatBevel, bevelSegments: 2 })
        geo.center()
        outline(put(core, geo, mBody, 0, 0, 0, null, [0, 0, 0.5]), 1.05)   // 稍微側躺才像掛在天上
        eyeZ = flatDepth / 2 + flatBevel
      } else {
        outline(put(core, ball(s * 0.34, 16), mBody, 0, 0, 0), 1.05)
        put(core, new THREE.TorusGeometry(s * 0.52, s * 0.035, 8, 28), mBelly, 0, 0, 0, null, [Math.PI * 0.42, 0, 0])
        eyeZ = s * 0.30
      }
      core.position.y = floatY
      body.add(core)
      parts.float = core
      // 月牙的臉要放在「彎進去那一側」的實心處，放正中央會落在挖掉的缺口上
      const faceX = spec.shape === 'moon' ? -s * 0.12 : 0
      makeEyes(core, parts, 0, eyeZ, s * 0.055, s * 0.11)
      for (const e of parts.eyes) e.position.x += faceX
      makeBlush(core, s, -s * 0.08, eyeZ * 0.92, s * 0.19 - faceX * 0.5)
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
