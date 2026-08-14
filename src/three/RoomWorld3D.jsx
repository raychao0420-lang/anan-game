// 3D 世界：把「溫暖的家」與「秘密庭園」畫成等角 3D 場景。
// 遊戲狀態一律由外面（HomeRoomScreen）傳進來，這裡只負責畫與回報互動 —— gameStore 完全不動。
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createEngine, clearGroup, toWorldX, toWorldZ, isWallItem, toWallHeight, U } from './engine'
import { buildPet } from './petMesh'
import { buildDeco } from './decoMesh'
import { buildRoom, buildGarden, buildPlant, buildWeather, buildFireflies, PHASE_LIGHT } from './worldMesh'
import { BOUNDS, chasesToy } from '../data/roomRules'
import { plantView } from '../data/garden'

const WALK_SPEED = 9          // 每秒走幾 %
const REACH = 2.5             // 走到多近算抵達（%）
const TOY_REACH = 4

const rnd = (a, b) => a + Math.random() * (b - a)
const pickTarget = () => ({ x: rnd(BOUNDS.xMin, BOUNDS.xMax), y: rnd(BOUNDS.yMin, BOUNDS.yMax) })

export default function RoomWorld3D({
  scene, theme, phase, weather, lamp = null,   // lamp: true 開／false 關／null 照晝夜自動
  pets = [], petMoods = {}, decos = [], garden = [], toy = null, tool = null,
  onPetClick, onDecoMove, onPlantTap, onFloorTap, onWindowTap, onToyReach, onPetPos,
}) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const worldRef = useRef({ pets: new Map(), decos: new Map(), plants: new Map(), fx: [], toy: null })
  // 回呼與「當下狀態」放進 ref，這樣 render loop 不必因為 props 變動而重建
  const cb = useRef({})
  const live = useRef({ toy: null, tool: null })
  useEffect(() => {
    cb.current = { onPetClick, onDecoMove, onPlantTap, onFloorTap, onWindowTap, onToyReach, onPetPos }
    live.current = { toy, tool, weather, phase, scene }
  })

  // ── 引擎只建一次 ──
  useEffect(() => {
    const engine = createEngine(canvasRef.current)
    engineRef.current = engine
    const W = worldRef.current

    const stop = engine.onTick((dt, t) => {
      // 寵物：走向目標、上下擺動、搖尾巴、眨眼
      for (const [id, p] of W.pets) {
        const activeToy = live.current.toy
        let tx = p.target.x, ty = p.target.y
        if (activeToy && chasesToy(id, activeToy)) { tx = activeToy.x; ty = activeToy.y }

        const dx = tx - p.pos.x, dy = ty - p.pos.y
        const dist = Math.hypot(dx, dy)
        const arrived = dist < (activeToy && chasesToy(id, activeToy) ? TOY_REACH : REACH)

        if (!arrived) {
          const step = Math.min(WALK_SPEED * dt, dist)
          p.pos.x += (dx / dist) * step
          p.pos.y += (dy / dist) * step
          p.walking = true
          p.facing = Math.atan2(dx, dy)          // 面向前進方向
          cb.current.onPetPos?.(id, { x: p.pos.x, y: p.pos.y })
        } else if (activeToy && chasesToy(id, activeToy)) {
          if (W.toy !== activeToy.key) { W.toy = activeToy.key; cb.current.onToyReach?.(id, activeToy) }
          p.walking = false
        } else {
          p.walking = false
          p.wait -= dt
          if (p.wait <= 0) { p.target = pickTarget(); p.wait = rnd(1.2, 4) }
        }

        p.group.position.set(toWorldX(p.pos.x), 0, toWorldZ(p.pos.y))
        p.group.rotation.y = p.facing
        const parts = p.group.userData.parts

        // 停下來發呆一會兒就坐下（狗坐著的剪影比站著好認），要走了再站起來
        p.idle = p.walking ? 0 : p.idle + dt
        const wantSit = parts?.canSit && !p.walking && p.idle > 0.7 ? 1 : 0
        p.sit += (wantSit - p.sit) * Math.min(dt * 5, 1)          // 平滑過渡，不會瞬間彈起來
        const sit = p.sit < 0.002 ? 0 : p.sit
        const h = p.group.userData.height || 0.6

        const bob = p.walking ? Math.abs(Math.sin(t * 7)) * 0.045
          : Math.sin(t * 1.6 + p.seed) * 0.012 * (1 - sit)        // 坐著就不上下晃了
        if (parts?.body) {
          // 身體是繞著自己中央的地面轉，所以往後仰本身就會把屁股壓下去、胸口抬起來；
          // 再往下沉一點點把最後那截空隙補掉（沉太多前腳會插到地板下面）
          parts.body.position.y = bob - sit * h * 0.08
          parts.body.rotation.x = -sit * 0.38
          parts.body.rotation.z = p.walking ? Math.sin(t * 7) * 0.05 : 0
        }
        if (parts?.head) parts.head.rotation.x = sit * 0.22       // 頭轉回水平，不然會朝天
        if (parts?.float) parts.float.position.y += (Math.sin(t * 1.4 + p.seed) * 0.0009)
        if (parts?.tail) {
          parts.tail.rotation.y = Math.sin(t * (p.walking ? 9 : 3)) * (p.walking ? 0.5 : 0.22)
          parts.tail.rotation.x = sit * 0.3                       // 坐著時尾巴貼地
        }
        for (const [i, leg] of (parts?.legs || []).entries()) {
          const walkSwing = p.walking ? Math.sin(t * 7 + i * Math.PI / 2) * 0.5 : 0
          const front = leg.userData.front
          // 坐下：腿的角度會跟身體的 -0.34 疊加，所以前腳要 +0.34 抵銷才會是垂直撐著（不是 -0.34）。
          // 後腿是「大腿往前轉、小腿在膝蓋往後折下去踩地」，屁股才坐得到地上；
          // 後腿往後伸直那是伸懶腰，不是坐。
          leg.rotation.x = walkSwing * (1 - sit) + (front ? sit * 0.38 : -sit * 0.41)
          // 膝蓋：往前擺（swing 為負）時彎起來把腳掌提高，踩到地時打直＝真的在走路而不是滑步。
          // 站著也留一點點彎，打太直會像玩具兵。
          if (leg.userData.knee) {
            leg.userData.knee.rotation.x =
              (0.1 + Math.max(0, -walkSwing) * 1.3) * (1 - sit) + sit * (front ? 0.1 : 1.6)
          }
        }
        // 以建立時的角度為基準相加。直接指派會把小鳥水平展開的翅膀（π/2）轉成垂直
        for (const w of parts?.wings || []) {
          w.rotation.z = (w.userData.rest || 0) + Math.sin(t * 2.2 + p.seed) * 0.12
        }
        // 垂耳跟著步伐甩，站著時輕輕晃 —— 不會動的垂耳看起來還是很僵
        for (const [i, ear] of (parts?.ears || []).entries()) {
          ear.rotation.x = ear.userData.rest +
            (p.walking ? Math.sin(t * 7 + i * 0.5) * 0.24 : Math.sin(t * 1.5 + p.seed + i * 0.5) * 0.05)
        }
        // 眨眼：每隔幾秒壓一下
        const blink = (Math.sin(t * 0.9 + p.seed * 3) > 0.985) ? 0.12 : 1
        for (const e of parts?.eyes || []) e.scale.y = blink
      }

      // 家具的小動作
      for (const d of W.decos.values()) {
        for (const n of d.anim) {
          if (n.userData.spin) n.rotation.y += n.userData.spin * dt
          else if (n.userData.ripple) n.scale.set(1 + Math.sin(t * 2) * 0.012, 1, 1 + Math.cos(t * 2) * 0.012)
          else if (n.userData.flame !== undefined) n.scale.y = 1 + Math.sin(t * 9 + n.userData.flame) * 0.22
          else if (n.userData.twinkle !== undefined) n.material.opacity = 0.45 + 0.5 * (0.5 + 0.5 * Math.sin(t * 3 + n.userData.twinkle))
          else if (n.userData.steam !== undefined) {
            n.position.y = 0.2 + ((t * 0.3 + n.userData.steam * 0.33) % 1) * 0.5
            n.material.opacity = 0.3 * (1 - ((t * 0.3 + n.userData.steam * 0.33) % 1))
          }
        }
        if (d.swing) d.swing.rotation.x = Math.sin(t * 1.4) * 0.18
      }

      // 植物隨風擺
      for (const pl of W.plants.values()) {
        if (pl.sway) pl.sway.rotation.z = Math.sin(t * 1.3 + pl.seed) * 0.07
        if (pl.pulse) pl.pulse.scale.setScalar(1 + Math.sin(t * 3) * 0.12)
      }

      for (const f of W.fx) f.update?.(dt, t)
    })

    return () => { stop(); engine.dispose(); engineRef.current = null }
  }, [])

  // ── 場景本體（切換家／庭園、換主題壁紙時重建）──
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const W = worldRef.current
    clearGroup(engine.root)
    W.pets.clear(); W.decos.clear(); W.plants.clear(); W.fx = []

    const env = scene === 'outdoor' ? buildGarden(theme) : buildRoom(theme)
    engine.root.add(env)
    W.env = env
  }, [scene, theme])

  // ── 晝夜／天氣：調燈光、天空色、特效 ──
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const W = worldRef.current
    const L = PHASE_LIGHT[phase] || PHASE_LIGHT.day

    engine.lights.hemi.color.set(L.hemiSky)
    engine.lights.hemi.groundColor.set(L.hemiGround)
    engine.lights.hemi.intensity = L.hemi
    engine.lights.key.color.set(L.key)
    engine.lights.key.intensity = L.keyI

    let bg = L.bg
    if (weather === 'rain') bg = phase === 'night' ? '#2A3040' : '#8FA6B8'
    if (weather === 'snow') bg = phase === 'night' ? '#3A3F55' : '#DDE6F0'
    if (W.env?.userData.sky) W.env.userData.sky.material.color.set(bg)


    // 天氣特效重建
    for (const f of W.fx) { engine.root.remove(f.group); clearGroup(f.group) }
    W.fx = []
    const wx = buildWeather(weather)
    if (wx && (scene === 'outdoor' || weather === 'rain' || weather === 'snow')) {
      // 室內只在窗外下（把粒子推到牆後），戶外整片下
      if (scene === 'indoor') wx.group.position.set(1.6, 0.6, -3.2), wx.group.scale.set(0.25, 0.5, 0.2)
      engine.root.add(wx.group)
      W.fx.push(wx)
    }
    if (scene === 'outdoor' && phase === 'night') {
      const ff = buildFireflies()
      engine.root.add(ff.group)
      W.fx.push(ff)
    }
  }, [phase, weather, scene, theme])

  // ── 燈的開關：lamp 沒指定就照晝夜自動。
  //    要排在天氣特效那個 effect 之後，螢火蟲重建完才輪到這裡調暗。
  useEffect(() => {
    const W = worldRef.current
    const on = lamp ?? (phase === 'night' || phase === 'evening')
    W.env?.userData.roomLamp?.(on)                 // 室內吸頂燈／庭園燈（同一個介面）
    for (const d of W.decos.values()) if (d.lamp) d.lamp.intensity = on ? 1.1 : 0
    for (const f of W.fx) f.setMuted?.(on)         // 開燈時螢火蟲變不明顯
  }, [lamp, phase, weather, scene, theme, decos])

  // ── 寵物同步（新解鎖／進化／離開場景）──
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const W = worldRef.current
    const want = new Map(pets.map(([id, data]) => [id, data]))

    for (const [id, p] of W.pets) {
      if (!want.has(id) || p.stage !== (want.get(id).evolutionStage || 1)) {
        engine.root.remove(p.group); clearGroup(p.group); W.pets.delete(id)
      }
    }
    for (const [id, data] of want) {
      if (W.pets.has(id)) continue
      const stage = data.evolutionStage || 1
      const group = buildPet(id, stage, { mood: petMoods[id] ?? 80 })
      engine.root.add(group)
      const pos = pickTarget()
      W.pets.set(id, {
        group, stage, pos, target: pickTarget(), wait: rnd(0.5, 3),
        facing: 0, walking: false, idle: 0, sit: 0, seed: Math.random() * 10,
      })
      group.position.set(toWorldX(pos.x), 0, toWorldZ(pos.y))
    }
  }, [pets, petMoods])

  // ── 家具同步 ──
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const W = worldRef.current
    const want = new Map(decos.map(({ item, pos }) => [item.id, pos]))

    for (const [id, d] of W.decos) {
      if (!want.has(id)) { engine.root.remove(d.group); clearGroup(d.group); W.decos.delete(id) }
    }
    for (const [id, pos] of want) {
      let d = W.decos.get(id)
      if (!d) {
        const group = buildDeco(id, pos.scale ?? 1)
        engine.root.add(group)
        const anim = []
        let lamp = null, swing = null
        group.traverse((n) => {
          if (n.userData?.spin || n.userData?.ripple || n.userData?.flame !== undefined ||
              n.userData?.twinkle !== undefined || n.userData?.steam !== undefined) anim.push(n)
          if (n.userData?.lamp) lamp = n.userData.lamp
          if (n.userData?.swing) swing = n.userData.swing
        })
        // buildDeco 把 lamp/swing 掛在子 Group 的 userData 上，這裡往下再撈一層
        if (!lamp) group.children[0] && (lamp = group.children[0].userData?.lamp || null)
        if (!swing) group.children[0] && (swing = group.children[0].userData?.swing || null)
        d = { group, anim, lamp, swing }
        W.decos.set(id, d)
        if (lamp) lamp.intensity = (phase === 'night' || phase === 'evening') ? 1.1 : 0
      }
      placeDeco(d.group, pos)
    }
  }, [decos, phase])

  // ── 花園植物同步 ──
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const W = worldRef.current
    const list = scene === 'outdoor' ? garden : []
    const want = new Map(list.map((p) => [p.key, p]))

    for (const [key, pl] of W.plants) {
      const p = want.get(key)
      if (!p || pl.sig !== sigOf(p)) { engine.root.remove(pl.group); clearGroup(pl.group); W.plants.delete(key) }
    }
    for (const [key, p] of want) {
      if (W.plants.has(key)) continue
      const view = plantView(p)
      const group = buildPlant(p, view)
      group.position.set(toWorldX(p.x), 0, toWorldZ(p.y))
      engine.root.add(group)
      W.plants.set(key, { group, sig: sigOf(p), sway: group.userData.sway, pulse: group.userData.pulse, seed: Math.random() * 10 })
    }
  }, [garden, scene])

  // ── 地上的零食／球 ──
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    const W = worldRef.current
    if (W.toyMesh) { engine.root.remove(W.toyMesh); clearGroup(W.toyMesh); W.toyMesh = null }
    if (!toy) { W.toy = null; return }
    const g = new THREE.Group()
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(toy.kind === 'ball' ? 0.11 : 0.08, 10, 8),
      new THREE.MeshLambertMaterial({ color: toy.kind === 'ball' ? 0xffd166 : 0xc98a52 })
    )
    mesh.position.y = toy.kind === 'ball' ? 0.11 : 0.06
    if (toy.kind === 'treat') mesh.scale.set(1.3, 0.6, 1.3)
    g.add(mesh)
    g.position.set(toWorldX(toy.x), 0, toWorldZ(toy.y))
    engine.root.add(g)
    W.toyMesh = g
  }, [toy])

  // ── 互動：點擊／拖曳家具 ──
  useEffect(() => {
    const canvas = canvasRef.current
    const engine = engineRef.current
    if (!canvas || !engine) return
    const W = worldRef.current
    let drag = null
    let downAt = null

    const onDown = (e) => {
      canvas.setPointerCapture?.(e.pointerId)
      downAt = { x: e.clientX, y: e.clientY, t: performance.now() }
      const hit = engine.pickObject(e.clientX, e.clientY)
      // 拿著工具時不拖家具，讓使用者專心種花／丟東西
      if (hit?.type === 'deco' && !live.current.tool) {
        const d = W.decos.get(hit.id)
        if (d) drag = { id: hit.id, group: d.group, moved: false }
      }
      W.hit = hit
    }

    const onMove = (e) => {
      if (!drag) return
      const f = engine.pickFloor(e.clientX, e.clientY)
      if (!f) return
      const x = Math.max(2, Math.min(88, f.x))
      const y = Math.max(2, Math.min(86, f.y))
      drag.pos = { x, y }
      drag.moved = true
      placeDeco(drag.group, { ...drag.pos, scale: drag.group.scale.x })
    }

    const onUp = (e) => {
      const moved = downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8
      if (drag && drag.moved && moved) {
        cb.current.onDecoMove?.(drag.id, { ...drag.pos, scale: drag.group.scale.x })
      } else if (!moved) {
        const hit = W.hit
        if (hit?.type === 'plant') cb.current.onPlantTap?.(hit.key)
        else if (hit?.type === 'pet') cb.current.onPetClick?.(hit.id)
        else if (hit?.type === 'window') cb.current.onWindowTap?.()
        else {
          const f = engine.pickFloor(e.clientX, e.clientY)
          if (f) cb.current.onFloorTap?.(f)
        }
      }
      drag = null; downAt = null; W.hit = null
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return <canvas ref={canvasRef} className="room-canvas3d" style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }} />
}

const sigOf = (p) => `${p.kind}|${p.waterCount || 0}|${p.solved ? 1 : 0}|${p.v}`

// 沿用 2D 的規則：y < 38 掛牆上、其餘落地
function placeDeco(group, pos) {
  if (isWallItem(pos.y)) {
    group.position.set(toWorldX(pos.x), toWallHeight(pos.y), -3.0 + 0.06)
    group.rotation.y = 0
  } else {
    group.position.set(toWorldX(pos.x), 0, toWorldZ(pos.y))
  }
  if (pos.scale) group.scale.setScalar(pos.scale)
}

export { U }
