import { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { PLANT_KINDS, SEED_KINDS, FERTILIZER, plantView, todayKey, ALL_BLOOMS, MAX_PLANTS, GARDEN_SCENES, isGardenScene, plantsOf, makeGardenQuestion } from '../data/garden'
import { BOUNDS, PLANT_BOUNDS, ACTIVITY_RADIUS, chasesToy, habitatOfPet } from '../data/roomRules'
import { sfx, startAmbient, stopAmbient } from '../utils/sound'
import PetAvatar from '../components/PetAvatar'
import DecoArt from '../components/DecoArt'
import './HomeRoomScreen.css'

// 3D 版整包（含 three.js）只有切到 3D 才載，平常一個位元組都不會下載
const RoomWorld3D = lazy(() => import('../three/RoomWorld3D'))
const read3D = () => {
  const q = new URLSearchParams(location.search).get('3d')
  if (q === '1') return true
  if (q === '0') return false
  return localStorage.getItem('anan-3d') === '1'
}

// 3D 那邊沒有 DOM 事件可以擋冒泡，共用同一批 handler 時塞這個假事件進去
const NO_EVENT = { stopPropagation() {} }

const POOL_RADIUS = 18   // % distance threshold for pool interaction

// Items closer to back wall (small y) appear smaller; front of room (large y) = full size
function getDepthScale(y) {
  if (y < 38) return 1.0  // on the wall
  const t = Math.min(1, (y - 38) / 50)
  return 0.68 + t * 0.32
}

// 仿3D：寵物依 y 產生景深（越靠牆越遠、越模糊一點點）
function getDepthBlur(y) {
  const t = Math.min(1, Math.max(0, (y - 42) / 24))
  const blur = (1 - t) * 0.7
  return blur > 0.1 ? `blur(${blur.toFixed(2)}px) saturate(${(0.9 + t * 0.1).toFixed(2)})` : 'none'
}

// 夜晚會發光的家具
const GLOW_DECOS = new Set(['fairy_light', 'mushroom_lamp', 'reunion_lamp', 'fireplace'])

// 依真實時間決定房間光線：白天 / 黃昏 / 夜晚
function getDayPhase() {
  const h = new Date().getHours()
  if (h >= 6 && h < 16) return 'day'
  if (h >= 16 && h < 19) return 'dusk'
  return 'night'
}

// ── 第2彈：窗外的世界（天氣＋飛過的訪客） ──────────────────────────────────
// 每次進房間隨機一種天氣；點窗戶可以手動換天氣（彩虹只在白天/黃昏出現）
function pickWeather(phase) {
  const r = Math.random()
  if (phase === 'night') return r < 0.62 ? 'clear' : r < 0.84 ? 'rain' : 'snow'
  return r < 0.5 ? 'clear' : r < 0.7 ? 'rain' : r < 0.85 ? 'snow' : 'rainbow'
}

// 窗外訪客：依時段輪替；🕊️ 白色信天翁＝S5 飛飛彩蛋（壞天氣只有牠敢飛）
const WINDOW_VISITORS = {
  day: [
    { e: '🐦', dur: 7,   w: 34, size: '1.05rem', flip: true },
    { e: '🦋', dur: 12,  w: 18, size: '0.95rem' },
    { e: '🎈', dur: 26,  w: 9,  size: '1.5rem' },
    { e: '🕊️', dur: 10,  w: 7,  size: '1.35rem', flip: true, feifei: true },
  ],
  dusk: [
    { e: '🐦', dur: 7,   w: 26, size: '1.05rem', flip: true },
    { e: '🎈', dur: 26,  w: 10, size: '1.5rem' },
    { e: '🕊️', dur: 10,  w: 8,  size: '1.35rem', flip: true, feifei: true },
  ],
  night: [
    { e: '🌠', dur: 1.5, w: 30, size: '1.2rem',  shoot: true },
    { e: '🦉', dur: 9,   w: 12, size: '1.15rem', flip: true },
    { e: '🕊️', dur: 11,  w: 6,  size: '1.35rem', flip: true, feifei: true },
  ],
}

function pickVisitor(list) {
  const total = list.reduce((s, v) => s + v.w, 0)
  let r = Math.random() * total
  for (const v of list) { r -= v.w; if (r < 0) return v }
  return list[0]
}

// ── 第3彈：天氣聯動室內＋寵物相遇 ─────────────────────────────────────────
// 窗外天氣 → 寵物頭上冒心情泡泡；下雨時怕水的 LULU 會衝去帳篷躲雨（有擺的話）
const WEATHER_MOODS = {
  rain:    { lulu: '☔' },
  snow:    { kitsune: '⛄', penguin: '⛄', seal: '❄️' },
  rainbow: { mejiro: '🌈', twinkle: '🌈', luna: '🌈', penguin: '🌈' },
}
const MEET_DIST   = 13                    // 兩隻寵物多近算「相遇」(%)
const MEET_EMOJIS = ['💕', '🎶', '✨']    // 相遇互動表情（好朋友水獺檔專屬 💞）

// ── 第4彈：主題壁紙＋拍照＋環境音 ─────────────────────────────────────────
// 主題壁紙（shop theme_* 擺放後整室換裝，一次一款）；各主題有「覺得像家」的寵物冒泡泡
const THEME_IDS = { theme_forest: 'forest', theme_ocean: 'ocean', theme_space: 'space' }
const THEME_MOODS = {
  forest: { lulu: '🌿', kitsune: '🍄', beaver: '🪵', hamster: '🌰', mejiro: '🌸', xiaohu: '🐾' },
  ocean:  { hana: '🫧', kotaro: '🫧', seal: '🐟', penguin: '🐠', feifei: '🌊' },
  space:  { twinkle: '⭐', luna: '🌙', pluto: '🪐', xiaoq: '🔭', owl: '✨' },
}

// ── 第5彈：跟寵物玩（丟零食＋玩具球＋摸摸加心情） ─────────────────────────
// 點🍪/🎾再點地板丟出去：零食大家都愛搶著吃（心情+8）；球只有愛玩的寵物會去追，
// 追到就往別處踢（最後一腳心情+5）。摸寵物也會心情+2。
const TOY_TOOLS = {
  treat: { emoji: '🍪', hint: '點地板，把零食丟過去！' },
  ball:  { emoji: '🎾', hint: '點地板，把球丟過去！' },
}
const PET_CONFIG = {
  lulu:   { startPos: { x: 12, y: 50 }, bobDuration: 1.8, wanderInterval: 2800, burstEmoji: '🐾' },
  hana:   { startPos: { x: 44, y: 54 }, bobDuration: 2.1, wanderInterval: 3500, burstEmoji: '💙' },
  kotaro: { startPos: { x: 72, y: 51 }, bobDuration: 2.4, wanderInterval: 4200, burstEmoji: '💚' },
  jiji:   { startPos: { x: 58, y: 48 }, bobDuration: 2.0, wanderInterval: 3200, burstEmoji: '✨' },
  kitsune:{ startPos: { x: 28, y: 52 }, bobDuration: 2.3, wanderInterval: 3800, burstEmoji: '❄️' },
  mejiro: { startPos: { x: 64, y: 45 }, bobDuration: 1.5, wanderInterval: 2500, burstEmoji: '🌸' },
  penguin:{ startPos: { x: 20, y: 58 }, bobDuration: 1.7, wanderInterval: 3000, burstEmoji: '🐟' },
  owl:    { startPos: { x: 50, y: 44 }, bobDuration: 2.6, wanderInterval: 4500, burstEmoji: '🌙' },
  seal:   { startPos: { x: 36, y: 60 }, bobDuration: 2.2, wanderInterval: 3600, burstEmoji: '💧' },
  beaver: { startPos: { x: 66, y: 56 }, bobDuration: 2.0, wanderInterval: 3400, burstEmoji: '🪵' },
  hamster:{ startPos: { x: 40, y: 50 }, bobDuration: 1.4, wanderInterval: 2400, burstEmoji: '🌰' },
}
const DEFAULT_PET_CONFIG = { startPos: { x: 42, y: 52 }, bobDuration: 2.0, wanderInterval: 3200, burstEmoji: '🐾' }

// ── 寵物 ↔ 家具互動 ──────────────────────────────────────────────────────────
// 每個家具：哪些寵物會被吸引(依個性)、靠近時的動作(motion)與冒出的表情(emoji)。
// pets: '*' 代表所有寵物都愛。要新增家具互動，往這裡加一筆即可。
const DECO_ACTIVITIES = {
  trampoline:  { pets: ['lulu', 'monkey', 'hamster', 'dino'],            motion: 'bounce', emoji: '🤸' },
  disco:       { pets: ['monkey', 'hamster', 'lulu', 'mejiro'],          motion: 'bounce', emoji: '🕺' },
  castle:      { pets: ['monkey', 'dino', 'hamster', 'lulu'],            motion: 'play',   emoji: '👑' },
  pool:        { pets: ['hana', 'kotaro', 'seal', 'penguin', 'beaver', 'feifei'],  motion: 'splash', emoji: '💦' },
  hot_spring:  { pets: ['hana', 'kotaro', 'seal', 'monkey'],             motion: 'soak',   emoji: '♨️' },
  fish_tank:   { pets: ['jiji', 'hana', 'kotaro', 'seal', 'penguin'],    motion: 'gaze',   emoji: '😻' },
  piano:       { pets: ['mejiro', 'owl', 'jiji'],                        motion: 'play',   emoji: '🎵' },
  art_studio:  { pets: ['monkey', 'mejiro', 'dino'],                     motion: 'play',   emoji: '🎨' },
  pet_bed:     { pets: '*',                                             motion: 'sleep',  emoji: '💤' },
  sofa:        { pets: '*',                                             motion: 'sleep',  emoji: '😌' },
  fireplace:   { pets: ['jiji', 'lulu', 'kitsune', 'seal', 'xiaohu'],    motion: 'sleep',  emoji: '😌' },
  tent:        { pets: ['raccoon', 'dino', 'hamster', 'lulu', 'xiaohu'], motion: 'hide',   emoji: '⛺' },
  igloo:       { pets: ['kitsune', 'penguin', 'seal'],                   motion: 'hide',   emoji: '❄️' },
  snow_globe:  { pets: ['kitsune', 'penguin', 'seal'],                   motion: 'gaze',   emoji: '😍' },
  telescope:   { pets: ['owl', 'mejiro', 'jiji', 'raccoon', 'twinkle', 'luna', 'pluto', 'xiaoq'], motion: 'gaze', emoji: '🌟' },
  star_swing:  { pets: ['twinkle', 'luna', 'monkey', 'hamster'],         motion: 'bounce', emoji: '🌠' },
  moon_hammock:{ pets: ['luna', 'twinkle', 'pluto', 'jiji', 'seal'],     motion: 'sleep',  emoji: '🌙' },
  reunion_lamp:{ pets: ['pluto', 'twinkle', 'luna', 'lulu', 'hamster', 'monkey', 'jiji', 'seal'], motion: 'gaze', emoji: '💗' },
  puzzle_board:{ pets: ['xiaoq', 'owl', 'jiji', 'beaver', 'dino', 'hamster'],     motion: 'gaze',   emoji: '🖍️' },
  world_route_map:{ pets: ['feifei', 'xiaoq', 'owl', 'mejiro', 'raccoon', 'monkey'], motion: 'gaze', emoji: '✈️' },
  taiwan_puzzle_wall:{ pets: ['xiaohu', 'lulu', 'owl', 'dino', 'feifei', 'xiaoq'], motion: 'gaze', emoji: '🧩' },
  library:     { pets: ['owl', 'jiji', 'xiaoq'],                                  motion: 'gaze',   emoji: '📖' },
  painting:    { pets: ['jiji', 'owl', 'mejiro', 'xiaoq'],                        motion: 'gaze',   emoji: '🖼️' },
  fairy_light: { pets: ['raccoon', 'monkey', 'mejiro', 'jiji', 'twinkle', 'luna', 'pluto', 'xiaoq'], motion: 'gaze', emoji: '✨' },
  mushroom_lamp:{ pets: ['raccoon', 'jiji', 'owl', 'twinkle', 'luna', 'xiaoq'],   motion: 'gaze',   emoji: '🍄' },
  rainbow:     { pets: ['mejiro', 'penguin', 'seal', 'twinkle', 'luna', 'feifei'], motion: 'gaze',   emoji: '🌈' },
  bamboo:      { pets: ['hamster', 'beaver', 'dino', 'mejiro'],          motion: 'gaze',   emoji: '😋' },
  plant:       { pets: ['mejiro', 'hamster', 'beaver'],                  motion: 'gaze',   emoji: '🌿' },
  bird_perch:  { pets: ['mejiro', 'owl', 'xiaoq', 'feifei'],                      motion: 'gaze',   emoji: '🐤' },
}

// 動作 → 上下擺動的幅度(px)與速度(秒)。讓不同活動看起來不一樣。
const MOTION = {
  walk:   { amp: 10, dur: null },  // 一般遊走用寵物自己的 bobDuration
  bounce: { amp: 26, dur: 0.5 },
  splash: { amp: 5,  dur: 0.7 },
  soak:   { amp: 3,  dur: 1.5 },
  gaze:   { amp: 2,  dur: 1.7 },
  play:   { amp: 15, dur: 0.6 },
  sleep:  { amp: 3,  dur: 2.6 },
  hide:   { amp: 4,  dur: 1.2 },
}

// Default decoration slots (% positions)
const DECO_SLOTS = [
  { x: 5,  y: 7  },
  { x: 22, y: 4  },
  { x: 45, y: 3  },
  { x: 67, y: 4  },
  { x: 87, y: 7  },
  { x: 6,  y: 75 },
  { x: 85, y: 73 },
  { x: 46, y: 79 },
]

const DECO_BOUNDS = { xMin: 2,  xMax: 88, yMin: 2,  yMax: 86 }
const EMPTY_ITEMS = []  // 穩定的空陣列參照，避免沒裝備的寵物每次 render 都拿到新陣列而白重繪

// ── 室內外雙場景：寵物與家具各自歸屬，一次只渲染一個場景 → 同時動畫的寵物數減半、另一半完全卸載 ──
// 戶外＝水生/星空/野外的孩子與家具；沒列到的都算室內。要調整歸屬只改這兩個 Set。

const OUTDOOR_DECOS = new Set(['pool', 'hot_spring', 'tent', 'igloo', 'telescope', 'star_swing', 'moon_hammock', 'bamboo', 'plant', 'castle', 'trampoline', 'bird_perch', 'world_route_map', 'taiwan_puzzle_wall', 'rainbow'])

const habitatOfDeco = (id) => (OUTDOOR_DECOS.has(id) ? 'outdoor' : 'indoor')

// ── 秘密庭園：種花種樹，每天澆水成長（規則見 data/garden.js）─────────────────

// ── Draggable decoration ──────────────────────────────────────────────────────

const DraggableDeco = memo(function DraggableDeco({ item, pos, onMove, containerRef }) {
  const [localPos, setLocalPos]   = useState({ x: pos.x, y: pos.y })
  const [userScale, setUserScale] = useState(pos.scale ?? 1)
  const [dragging, setDragging]   = useState(false)
  const [pinching, setPinching]   = useState(false)

  const pointersRef   = useRef(new Map())
  const dragStartRef  = useRef(null)
  const pinchStartRef = useRef(null)
  const localPosRef   = useRef(localPos)
  const userScaleRef  = useRef(pos.scale ?? 1)
  const wheelTimerRef = useRef(null)
  const decoRef       = useRef(null)

  useEffect(() => { localPosRef.current = localPos },  [localPos])
  useEffect(() => { userScaleRef.current = userScale }, [userScale])

  useEffect(() => {
    if (!dragging && !pinching) {
      setLocalPos({ x: pos.x, y: pos.y })
      setUserScale(pos.scale ?? 1)
    }
  }, [pos.x, pos.y, pos.scale, dragging, pinching])

  const save = useCallback(() => {
    onMove(item.id, localPosRef.current.x, localPosRef.current.y, userScaleRef.current)
  }, [item.id, onMove])

  // Non-passive wheel listener for desktop scaling
  useEffect(() => {
    const el = decoRef.current
    if (!el) return
    const handleWheel = (e) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      const next = Math.max(0.3, Math.min(3.0, userScaleRef.current * factor))
      userScaleRef.current = next
      setUserScale(next)
      clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(save, 400)
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [save])

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointersRef.current.size === 1) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setDragging(true)
      dragStartRef.current = {
        cx: e.clientX, cy: e.clientY,
        px: localPosRef.current.x, py: localPosRef.current.y,
        rw: rect.width, rh: rect.height,
      }
    } else if (pointersRef.current.size === 2) {
      setDragging(false)
      dragStartRef.current = null
      setPinching(true)
      const pts = [...pointersRef.current.values()]
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
      pinchStartRef.current = { dist, scale: userScaleRef.current }
    }
  }

  const onPointerMove = (e) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointersRef.current.size >= 2 && pinchStartRef.current) {
      const pts = [...pointersRef.current.values()]
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
      const next = Math.max(0.3, Math.min(3.0, pinchStartRef.current.scale * dist / pinchStartRef.current.dist))
      userScaleRef.current = next
      setUserScale(next)
    } else if (dragging && dragStartRef.current) {
      const { cx, cy, px, py, rw, rh } = dragStartRef.current
      const nx = Math.max(DECO_BOUNDS.xMin, Math.min(DECO_BOUNDS.xMax, px + (e.clientX - cx) / rw * 100))
      const ny = Math.max(DECO_BOUNDS.yMin, Math.min(DECO_BOUNDS.yMax, py + (e.clientY - cy) / rh * 100))
      setLocalPos({ x: nx, y: ny })
    }
  }

  const onPointerUp = (e) => {
    pointersRef.current.delete(e.pointerId)
    const remaining = pointersRef.current.size

    if (remaining === 0) {
      if (dragging || pinching) save()
      setDragging(false)
      setPinching(false)
      dragStartRef.current  = null
      pinchStartRef.current = null
    } else if (remaining < 2 && pinching) {
      save()
      setPinching(false)
      pinchStartRef.current = null
    }
  }

  const isPool      = item.id === 'pool'
  const isFloorItem = localPos.y >= 38
  const depthScale  = getDepthScale(localPos.y)
  const finalScale  = depthScale * userScale
  const activeScale = dragging ? Math.max(finalScale * 1.12, 0.88) : finalScale
  const itemZIndex  = dragging ? 100 : (isFloorItem ? Math.round(localPos.y) : 7)

  return (
    <motion.div
      ref={decoRef}
      className={`room-deco ${dragging ? 'dragging' : ''}`}
      style={{
        left: `${localPos.x}%`,
        top: `${localPos.y}%`,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: itemZIndex,
        transformOrigin: 'bottom center',
      }}
      animate={{ scale: pinching ? finalScale : activeScale, opacity: 1 }}
      initial={{ scale: 0, opacity: 0 }}
      transition={pinching ? { duration: 0 } : { type: 'spring', stiffness: 280 }}
      data-glow={GLOW_DECOS.has(item.id) ? 'true' : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {isFloorItem && <div className="room-deco-shadow" />}
      {isPool ? (
        <div className="room-pool-visual">
          <div className="room-pool-water">
            <span className="room-pool-wave">🌊</span>
            <span className="room-pool-wave delay">🌊</span>
          </div>
          <div className="room-deco-label">大水池</div>
        </div>
      ) : (
        <>
          <DecoArt id={item.id} size={62} emojiFallback={item.emoji} />
          <div className="room-deco-label">{item.name}</div>
        </>
      )}
      {dragging  && <div className="room-deco-drag-hint">放開擺放</div>}
      {pinching  && <div className="room-deco-drag-hint">縮放中...</div>}
    </motion.div>
  )
})

// ── Wandering pet ─────────────────────────────────────────────────────────────

const WanderingPet = memo(function WanderingPet({ petId, petDef, petData, equippedPetItems, placedDecos, poolPos, onPetClick, mood = 100, weather = 'clear', theme = null, reportPos, meetX = null, toy = null, onToyReach }) {
  const cfg = PET_CONFIG[petId] ?? DEFAULT_PET_CONFIG

  // 這隻寵物會被吸引的家具（依個性）
  const myDecos = placedDecos.filter((d) => {
    const a = DECO_ACTIVITIES[d.id]
    return a && (a.pets === '*' || a.pets.includes(petId))
  })
  const myDecosRef = useRef(myDecos)
  useEffect(() => { myDecosRef.current = myDecos })

  const [pos, setPos]   = useState(cfg.startPos)
  const [facing, setFacing] = useState(1)
  const [burst, setBurst]   = useState(false)
  const targetRef = useRef(null)  // 目前想去玩的家具 id

  const poolPosRef = useRef(poolPos)
  useEffect(() => { poolPosRef.current = poolPos }, [poolPos])

  const weatherRef = useRef(weather)
  useEffect(() => { weatherRef.current = weather }, [weather])

  const toyRef = useRef(toy)
  useEffect(() => { toyRef.current = toy }, [toy])

  // 位置回報給父層做「寵物相遇」偵測
  useEffect(() => { reportPos?.(petId, pos) }, [petId, pos, reportPos])

  // 追到零食/球了 → 通知父層處理（吃掉／踢走）
  useEffect(() => {
    if (chasesToy(petId, toy) && Math.hypot(pos.x - toy.x, pos.y - toy.y) < 8) onToyReach?.(petId, toy)
  }, [petId, pos, toy, onToyReach])

  // 現在正在「使用中」的家具（在附近就算）
  const activeDeco = myDecos.find((d) => Math.hypot(pos.x - d.x, pos.y - d.y) < ACTIVITY_RADIUS)
  const activity   = activeDeco ? DECO_ACTIVITIES[activeDeco.id] : null

  // 怕水的 LULU 靠近水池會嚇到
  const isScared = petId === 'lulu' && poolPos &&
    Math.hypot(pos.x - poolPos.x, pos.y - poolPos.y) < POOL_RADIUS

  useEffect(() => {
    const timer = setInterval(() => {
      setPos(prev => {
        const decos = myDecosRef.current
        const pool  = poolPosRef.current
        let target  = targetRef.current && decos.find(d => d.id === targetRef.current)

        // 挑一個家具去玩 / 玩夠了就離開
        if (!target && decos.length && Math.random() < 0.6) {
          target = decos[Math.floor(Math.random() * decos.length)]
          targetRef.current = target.id
        } else if (target && Math.random() < 0.25) {
          targetRef.current = null; target = null
        }

        // 窗外下雨：怕水的 LULU 一路衝去帳篷躲雨
        if (petId === 'lulu' && weatherRef.current === 'rain') {
          const tent = decos.find((d) => d.id === 'tent')
          if (tent) { targetRef.current = 'tent'; target = tent }
        }

        let dx, dy
        const t5 = toyRef.current
        if (chasesToy(petId, t5)) {
          // 有零食/球在地上：放下手邊的事衝過去
          dx = (t5.x - prev.x) * 0.75 + (Math.random() - 0.5) * 4
          dy = (t5.y - prev.y) * 0.75 + (Math.random() - 0.5) * 3
        } else if (target) {
          // 雨天躲帳篷要真的鑽進去（抵達半徑收緊），平常在家具旁玩就好
          const arriveR = (petId === 'lulu' && weatherRef.current === 'rain' && target.id === 'tent') ? 7 : ACTIVITY_RADIUS
          const near = Math.hypot(prev.x - target.x, prev.y - target.y) < arriveR
          if (near) { dx = (Math.random() - 0.5) * 6; dy = (Math.random() - 0.5) * 4 }        // 在旁邊玩，小幅晃動
          else { dx = (target.x - prev.x) * 0.6 + (Math.random() - 0.5) * 6                    // 朝家具走過去
                 dy = (target.y - prev.y) * 0.6 + (Math.random() - 0.5) * 4 }
        } else {
          dx = (Math.random() - 0.5) * 26; dy = (Math.random() - 0.5) * 12                     // 隨意亂晃
        }

        let newX = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, prev.x + dx))
        let newY = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, prev.y + dy))

        // 怕水的 LULU 逃離水池
        if (petId === 'lulu' && pool) {
          const dist = Math.hypot(newX - pool.x, newY - pool.y)
          if (dist < POOL_RADIUS) {
            const angle = Math.atan2(newY - pool.y, newX - pool.x)
            newX = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, pool.x + Math.cos(angle) * POOL_RADIUS * 1.7))
            newY = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, pool.y + Math.sin(angle) * POOL_RADIUS * 1.7))
            targetRef.current = null
          }
        }

        setFacing(newX >= prev.x ? 1 : -1)
        return { x: newX, y: newY }
      })
    }, cfg.wanderInterval + Math.random() * 1500)
    return () => clearInterval(timer)
  }, [cfg.wanderInterval, petId])

  const handleClick = () => {
    setBurst(true)
    setTimeout(() => setBurst(false), 900)
    onPetClick(petId)
  }

  const depthScale = getDepthScale(pos.y)
  const bob = activity ? MOTION[activity.motion] : MOTION.walk
  const bobDur = bob.dur ?? cfg.bobDuration

  return (
    <div
      className={`room-pet ${activity ? 'busy' : ''} ${isScared ? 'scared-pool' : ''}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translateX(-50%) scale(${depthScale})`,
        transformOrigin: 'bottom center',
        zIndex: Math.round(pos.y),
        filter: getDepthBlur(pos.y),
      }}
      onClick={handleClick}
    >
      <div className="room-pet-shadow" />
      {/* Bob layer（room-pet-body 帶拋光地板倒影） */}
      <motion.div
        className="room-pet-body"
        animate={{ y: [0, -bob.amp, 0] }}
        transition={{ repeat: Infinity, duration: bobDur, ease: 'easeInOut' }}
        whileTap={{ scale: 1.3 }}
      >
        {/* Flip layer（相遇時轉頭面向對方） */}
        <motion.div
          animate={{ scaleX: meetX != null ? (meetX >= pos.x ? 1 : -1) : facing }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <PetAvatar
            petId={petId}
            evolutionStage={petData.evolutionStage}
            equipped={equippedPetItems}
            size={65}
            mood={mood}
          />
        </motion.div>
      </motion.div>

      <div className="room-pet-name">{petDef.name}</div>

      {/* 正在玩家具時冒出的表情 */}
      {activity && (
        <motion.div className="room-pet-activity"
          animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.4 }}>
          {activity.emoji}
        </motion.div>
      )}

      {/* 窗外天氣／主題壁紙的心情泡泡（沒在玩家具時才冒；天氣優先） */}
      {!activity && (WEATHER_MOODS[weather]?.[petId] || THEME_MOODS[theme]?.[petId]) && (
        <motion.div className="room-pet-weather"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}>
          {WEATHER_MOODS[weather]?.[petId] || THEME_MOODS[theme]?.[petId]}
        </motion.div>
      )}

      {/* Scared when near pool */}
      {isScared && <div className="room-pet-scared">😱</div>}

      <AnimatePresence>
        {burst && (
          <motion.div
            key="burst"
            className="room-pet-burst"
            initial={{ opacity: 1, y: 0, scale: 0.7 }}
            animate={{ opacity: 0, y: -50, scale: 1.4 }}
            transition={{ duration: 0.8 }}
          >
            {activity ? activity.emoji : cfg.burstEmoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

// ── Main screen ───────────────────────────────────────────────────────────────

export default function HomeRoomScreen({ onNavigate }) {
  const { pets, petEquipment, equippedHomeItems, homeDecoPositions, moveHomeDeco, petMoods, updatePetMood, garden, plantSeed, collectPlant, addCoins,
          seedlings, fertilizer, waterPlant, waterAll, useFertilizer, addSeedling, updateDailyProgress,
          solveMagicPlant, recordBloom, registerWaterDay, gardenKeeper, setGardenKeeper, keeperTend, gardenDex, addFlower, petHabitat } = useGameStore()
  const containerRef = useRef(null)

  // 溫暖的家（室內）／ 秘密庭園（戶外）雙場景：一次只渲染一個，另一個完全卸載（省掉一半的寵物 SVG 與無限動畫）
  const [scene, setScene] = useState('indoor')

  // 3D 立體場景（feature flag）：網址帶 ?3d=1 或按畫面上的切換鈕；2D 版原封不動保留著
  const [use3D, setUse3D] = useState(read3D)
  useEffect(() => { localStorage.setItem('anan-3d', use3D ? '1' : '0') }, [use3D])
  // 燈的開關：null＝照晝夜自動，按下去才變成手動的 true／false
  const [lamp, setLamp] = useState(null)

  // 晝夜光線（每分鐘檢查一次）
  const [phase, setPhase] = useState(getDayPhase)
  useEffect(() => {
    const t = setInterval(() => setPhase(getDayPhase()), 60000)
    return () => clearInterval(t)
  }, [])

  // 窗外天氣（進房隨機，點窗戶手動切換）＋不定時飛過的訪客
  const [weather, setWeather] = useState(() => pickWeather(getDayPhase()))
  const [visitor, setVisitor] = useState(null)
  const visitorRef = useRef(null)
  useEffect(() => { visitorRef.current = visitor }, [visitor])

  useEffect(() => {
    const spawn = () => {
      if (visitorRef.current) return
      const stormy = weather === 'rain' || weather === 'snow'
      if (Math.random() > (stormy ? 0.22 : 0.55)) return
      const list = stormy
        ? WINDOW_VISITORS[phase].filter((v) => v.feifei)   // 壞天氣只有信天翁敢飛（S5 飛飛彩蛋）
        : WINDOW_VISITORS[phase]
      if (!list.length) return
      const v = pickVisitor(list)
      setVisitor({ ...v, key: Date.now(), top: 10 + Math.random() * 32 })
    }
    spawn()
    const t = setInterval(spawn, 8000)
    return () => clearInterval(t)
  }, [phase, weather])

  const cycleWeather = (e) => {
    e.stopPropagation()   // 丟零食模式下點窗戶只換天氣，不丟東西
    sfx.click()
    const opts = phase === 'night' ? ['clear', 'rain', 'snow'] : ['clear', 'rain', 'snow', 'rainbow']
    setWeather((w) => opts[(opts.indexOf(w) + 1) % opts.length])
  }

  // ── 第5彈：丟零食／玩具球 ──
  const [tool, setTool]   = useState(null)   // 'treat' | 'ball'：按了按鈕等著點地板
  const [toy, setToy]     = useState(null)   // 地上的零食/球 {kind,x,y,key,kicks}
  const [toyFx, setToyFx] = useState(null)   // 吃掉/踢完的表情特效
  const toyKeyRef = useRef(null)             // 防兩隻寵物同時搶到重複觸發
  // 丟出去的零食／球需要一個唯一 key。原本用 Date.now()，那是不純的函式，
  // React Compiler 會擋（"Cannot call impure function"）；改用遞增的計數器，
  // 效果一樣而且純粹。ref 在事件處理函式裡改是允許的。
  const toySeq = useRef(0)

  // 直接吃百分比座標（2D 由滑鼠換算、3D 由射線打在地板上換算，兩邊共用這一份規則）
  const throwToyAt = (rawX, rawY) => {
    if (!tool) return
    // 種花／種樹：點草地種下（庭園可種範圍比丟東西更廣）；沒花苗就不種
    if (SEED_KINDS.includes(tool)) {
      if ((seedlings?.[tool] || 0) <= 0) { setTool(null); return }
      // 每個庭園只收自己的花苗：魔法花苗只能種在魔法花園，其餘只能種在秘密庭園
      if (!GARDEN_SCENES[scene]?.seeds.includes(tool)) {
        say(tool === 'magic'
          ? '🔮 魔法花苗要種在「魔法花園」喔！'
          : `🌱 這種花苗要種在「${GARDEN_SCENES.outdoor.label}」喔！`)
        return
      }
      // 花園滿了要說出來，不能默默不種（以前是默默把最舊的一株擠掉，更糟）
      if (sceneGarden.length >= MAX_PLANTS) {
        say(`🌱 這個花園滿了（${MAX_PLANTS} 株），先採收一些開好的花再種吧！`)
        return
      }
      plantSeed(tool,
        Math.max(PLANT_BOUNDS.xMin, Math.min(PLANT_BOUNDS.xMax, rawX)),
        Math.max(PLANT_BOUNDS.yMin, Math.min(PLANT_BOUNDS.yMax, rawY)), scene)
      sfx.click()
      if ((seedlings?.[tool] || 0) <= 1) setTool(null)   // 種到最後一顆才收起工具，連種更順手
      return
    }
    // 撒肥料工具：點草地無效（要點在植物上），直接忽略
    if (tool === 'fert') return
    const x = Math.max(10, Math.min(74, rawX))
    const y = Math.max(45, Math.min(64, rawY))
    setToy({ kind: tool, x, y, key: ++toySeq.current, kicks: tool === 'ball' ? 3 : 0 })
    ;(tool === 'ball' ? sfx.boing : sfx.click)()
    setTool(null)
  }

  const throwToy = (e) => {
    if (!tool) return
    const r = containerRef.current.getBoundingClientRect()
    throwToyAt((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100)
  }

  // ── 花園第二彈：小提示浮條／圖鑑／魔法花答題／小幫手 ──
  const [notice, setNotice]       = useState(null)  // 畫面上方冒出的小提示
  const [quiz, setQuiz]           = useState(null)  // 魔法花答題 {key,x,y,q,ans,choices,wrong}
  const [nameTag, setNameTag] = useState(null)      // 3D 版點到寵物時冒出的名字
  const [codexOpen, setCodexOpen] = useState(false) // 花園圖鑑彈窗
  const [keeperOpen, setKeeperOpen] = useState(false) // 選小幫手彈窗
  const say = useCallback((msg) => setNotice({ msg, key: Date.now() }), [])
  const petFace = (id) => PETS[id]?.stages?.[1]?.emoji ?? '🐾'

  // 今天有澆到水就登記一次連續澆水（每 3 天小獎、7 天大獎）
  const bumpStreak = useCallback(() => {
    const r = registerWaterDay()
    if (r?.reward) say(`🔥 連續澆水 ${r.streak} 天！獎勵 ${r.reward} 金幣！`)
  }, [registerWaterDay, say])

  // 開花後點一下採收：換金幣＋冒星星，清出位置可再種
  // 寵物適性：愛這種花的寵物（已解鎖的）會開心；彩虹天採收金幣加成；集進圖鑑
  const harvest = (p, v) => {
    const cfg = v.cfg
    sfx.coins()
    const rainbow = weather === 'rainbow'
    addCoins(Math.round(v.reward * (rainbow ? 1.5 : 1)))
    // 採收的花進背包，之後可以拿去送給寵物（原本採收只換金幣，那朵花什麼都沒留下）
    addFlower(v.emoji)
    const lover = (cfg?.love || []).find((id) => pets[id]?.unlocked)
    if (lover) updatePetMood(lover, 6)
    // 採收回收：35% 掉回一顆同種花苗（魔法花只回收普通花苗，免得太好賺）
    if (Math.random() < 0.35) addSeedling(p.kind === 'magic' ? 'flower' : p.kind)
    const dex = recordBloom(v.emoji)
    setToyFx({ x: p.x, y: p.y - 4, emoji: lover ? '💖' : rainbow ? '🌈' : '✨', key: p.key })
    collectPlant(p.key)
    if (dex?.complete) say('🏵️ 花園圖鑑全部收集完成！獎勵 200 金幣！')
  }

  // 魔法花澆滿後，點一下出一題數學，答對才盛開
  const openQuiz = (p) => {
    sfx.click()
    const { q, ans, choices } = makeGardenQuestion()
    setQuiz({ key: p.key, x: p.x, y: p.y, q, ans, choices, wrong: null })
  }
  const answerQuiz = (choice) => {
    if (!quiz) return
    if (choice === quiz.ans) {
      solveMagicPlant(quiz.key)
      sfx.correct()
      setToyFx({ x: quiz.x, y: quiz.y - 4, emoji: '🌈', key: `${quiz.key}-m` })
      setQuiz(null)
      say('🔮 答對了！魔法花盛開啦，好厲害！')
    } else {
      sfx.wrong()
      setQuiz((q) => ({ ...q, wrong: choice }))
    }
  }

  // 點植物：已開花→採收；魔法花澆滿→答題；持肥料→施肥；否則→今天澆水（尚未澆過的話）
  const tapPlant = (e, p, v) => {
    e.stopPropagation()
    if (v.bloomed) { harvest(p, v); return }
    if (v.ready) { openQuiz(p); return }
    if (tool === 'fert') {
      if ((fertilizer || 0) <= 0) return
      useFertilizer(p.key)
      sfx.coins()
      setToyFx({ x: p.x, y: p.y - 4, emoji: '✨', key: `${p.key}-f` })
      return
    }
    if (p.lastWater === todayKey()) return   // 今天澆過了
    waterPlant(p.key)
    updateDailyProgress('water', 1)
    bumpStreak()
    sfx.click()
    setToyFx({ x: p.x, y: p.y - 4, emoji: '💧', key: `${p.key}-${p.waterCount}` })
  }

  // 一鍵全部澆水
  const handleWaterAll = (e) => {
    e.stopPropagation()
    const today = todayKey()
    const n = garden.filter((p) => p.lastWater !== today && (p.waterCount || 0) < (PLANT_KINDS[p.kind]?.need ?? 2)).length
    if (n === 0) return
    waterAll()
    updateDailyProgress('water', n)
    bumpStreak()
    sfx.coins()
  }

  // 下雨天：進到庭園自動幫所有口渴的植物澆一遍（免費小驚喜）
  useEffect(() => {
    if (!isGardenScene(scene) || weather !== 'rain') return
    const today = todayKey()
    const n = garden.filter((p) => p.lastWater !== today && (p.waterCount || 0) < (PLANT_KINDS[p.kind]?.need ?? 2)).length
    if (n === 0) return
    waterAll()
    updateDailyProgress('water', n)
    bumpStreak()
    say('☔ 今天下雨，幫你把花園都澆好了！')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, weather])

  // 小幫手：進庭園時，牠趁你不在幫喜歡的花澆水
  useEffect(() => {
    if (!isGardenScene(scene)) return
    const r = keeperTend()
    if (r) say(`${petFace(r.petId)} ${PETS[r.petId].name} 趁你不在，幫忙澆了 ${r.count} 株花！`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  // 小提示浮條 2.6 秒後自動消失
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 2600)
    return () => clearTimeout(t)
  }, [notice])

  // 3D 版點到寵物時冒出牠的名字。2D 版每隻腳下本來就掛著常駐名牌，
  // 但 3D 是畫布，常駐名牌得逐幀把世界座標投影回螢幕，成本高又會擋住畫面 ——
  // 改成「點到誰、誰的名字才冒出來」，跟叫聲一起，剛好也教安安誰是誰。
  useEffect(() => {
    if (!nameTag) return
    const t = setTimeout(() => setNameTag(null), 1700)
    return () => clearTimeout(t)
  }, [nameTag])

  const onToyReach = useCallback((petId, t) => {
    if (toyKeyRef.current === t.key) return
    toyKeyRef.current = t.key
    if (t.kind === 'treat') {
      sfx.munch()
      updatePetMood(petId, 8)
      setToyFx({ x: t.x, y: t.y, emoji: '😋', key: t.key })
      setToy(null)
    } else if (t.kicks > 0) {
      sfx.boing()   // 追到球 → 往別處踢，再追！
      setToy({ kind: 'ball', x: 10 + Math.random() * 62, y: 45 + Math.random() * 18, key: Date.now(), kicks: t.kicks - 1 })
    } else {
      sfx.coins()
      updatePetMood(petId, 5)
      setToyFx({ x: t.x, y: t.y, emoji: '🌟', key: t.key })
      setToy(null)
    }
  }, [updatePetMood])

  // 沒寵物理它就自動收走；特效秀完自動消失
  useEffect(() => {
    if (!toy) return
    const t = setTimeout(() => setToy(null), 25000)
    return () => clearTimeout(t)
  }, [toy])
  useEffect(() => {
    if (!toyFx) return
    const t = setTimeout(() => setToyFx(null), 1000)
    return () => clearTimeout(t)
  }, [toyFx])

  // 寵物位置回報 → 相遇偵測（兩隻靠近就冒互動表情、面對面）
  const [petPositions, setPetPositions] = useState({})
  const reportPos = useCallback((id, p) => {
    setPetPositions((prev) => (prev[id]?.x === p.x && prev[id]?.y === p.y ? prev : { ...prev, [id]: p }))
  }, [])

  // 環境音：雨聲 / 風雪 / 白天鳥叫 / 夜晚蟲鳴（離開房間自動停）
  useEffect(() => {
    const kind = weather === 'rain' ? 'rain'
      : weather === 'snow' ? 'wind'
      : phase === 'night' ? 'crickets' : 'birds'
    startAmbient(kind)
    return stopAmbient
  }, [weather, phase])

  // 拍照模式：隱藏 UI → html2canvas 拍下房間 → 拍立得預覽
  const [snapping, setSnapping] = useState(false)
  const [photo, setPhoto] = useState(null)
  const takePhoto = async () => {
    sfx.click()
    setSnapping(true)
    await new Promise((r) => setTimeout(r, 120))   // 等 UI 隱藏
    try {
      const canvas = await html2canvas(containerRef.current, { backgroundColor: null, scale: 2, logging: false })
      setPhoto(canvas.toDataURL('image/png'))
      sfx.coins()
    } catch (e) {
      void e
    }
    setSnapping(false)
  }
  const downloadPhoto = () => {
    const a = document.createElement('a')
    a.href = photo
    a.download = `anan-home-${new Date().toISOString().slice(0, 10)}.png`
    a.click()
  }

  // iOS 13+ 陀螺儀需要使用者手勢授權，顯示一顆「體感」按鈕
  const [gyroNeed, setGyroNeed] = useState(false)
  useEffect(() => {
    if (typeof window.DeviceOrientationEvent !== 'undefined' &&
        typeof window.DeviceOrientationEvent.requestPermission === 'function') setGyroNeed(true)
  }, [])
  const enableGyro = () => {
    window.DeviceOrientationEvent.requestPermission()
      .then((r) => { if (r === 'granted') setGyroNeed(false) })
      .catch(() => {})
  }

  // 仿3D 視差：把傾斜/滑鼠位置寫進 CSS 變數，各圖層用不同倍率位移
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let raf = 0
    const clamp = (v) => Math.max(-1, Math.min(1, v))
    const apply = (nx, ny) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--par-x', String(nx))
        el.style.setProperty('--par-y', String(ny))
      })
    }
    const onPointer = (e) => {
      const r = el.getBoundingClientRect()
      apply(clamp(((e.clientX - r.left) / r.width - 0.5) * 2),
            clamp(((e.clientY - r.top) / r.height - 0.5) * 2))
    }
    const onTilt = (e) => {
      if (e.gamma == null || e.beta == null) return
      apply(clamp(e.gamma / 22), clamp((e.beta - 40) / 30))
    }
    el.addEventListener('pointermove', onPointer)
    window.addEventListener('deviceorientation', onTilt)
    return () => {
      el.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onTilt)
      cancelAnimationFrame(raf)
    }
  }, [])

  const unlockedPets = useMemo(
    () => Object.entries(pets).filter(([, data]) => data.unlocked),
    [pets]
  )

  // 主題壁紙不當家具擺、改成整室換裝
  const activeTheme = equippedHomeItems.map((id) => THEME_IDS[id]).find(Boolean) ?? null

  const getDecoPos = (item, idx) => {
    if (homeDecoPositions[item.id]) return homeDecoPositions[item.id]
    if (item.id === 'pool') return { x: 45, y: 71, scale: 1 }
    return { ...DECO_SLOTS[idx % DECO_SLOTS.length], scale: 1 }
  }

  // 家具清單＋座標一次算好（只在擺設變動時重算），避免寵物移動時整室重繪拖累家具與其他寵物
  const homeDecos = useMemo(() => {
    const items = equippedHomeItems
      .filter(id => !THEME_IDS[id])
      .map(id => SHOP_ITEMS.find(i => i.id === id))
      .filter(Boolean)
    return items.map((item, idx) => ({ item, pos: getDecoPos(item, idx) }))
  }, [equippedHomeItems, homeDecoPositions])

  // Pool position (default to floor-center if not moved)
  const poolEquipped = equippedHomeItems.includes('pool')
  const poolPos = useMemo(
    () => (poolEquipped ? (homeDecoPositions['pool'] || { x: 45, y: 71 }) : null),
    [poolEquipped, homeDecoPositions]
  )

  // 已擺放、且有互動的家具座標，給寵物尋路用
  const placedDecos = useMemo(
    () => homeDecos.map(({ item, pos }) => ({ id: item.id, ...pos })).filter((d) => DECO_ACTIVITIES[d.id]),
    [homeDecos]
  )

  // 只留目前場景的寵物 / 家具 / 尋路點（另一場景整組不 render）
  // 目前這個庭園場景裡的植物。兩個庭園各自獨立（各自 24 株上限），
  // 舊存檔沒有 sc 欄位的一律算秘密庭園。
  const sceneGarden = useMemo(() => plantsOf(garden, scene), [garden, scene])

  // 歸屬吃安安在寵物圖鑑裡的搬家設定（petHabitat），沒設過的用預設
  const scenePets    = useMemo(() => unlockedPets.filter(([id]) => habitatOfPet(id, petHabitat) === scene), [unlockedPets, scene, petHabitat])
  const sceneDecos   = useMemo(() => homeDecos.filter(({ item }) => habitatOfDeco(item.id) === scene), [homeDecos, scene])
  const scenePlaced  = useMemo(() => placedDecos.filter((d) => habitatOfDeco(d.id) === scene), [placedDecos, scene])

  // 每隻寵物身上裝備解析好的道具（只在裝備變動時重算，寵物移動不影響）
  const petItemsById = useMemo(() => {
    const map = {}
    for (const [petId, ids] of Object.entries(petEquipment)) {
      map[petId] = (ids || []).map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)
    }
    return map
  }, [petEquipment])

  const handlePetClick = useCallback((petId) => {
    sfx.pet(petId)
    updatePetMood(petId, 2)   // 摸摸也會開心
    setNameTag({ petId, key: Date.now() })
  }, [updatePetMood])

  // 相遇配對：任兩隻已解鎖寵物距離 < MEET_DIST
  const meetings = []
  const meetPartner = {}
  const posIds = scenePets.map(([id]) => id).filter((id) => petPositions[id])
  for (let i = 0; i < posIds.length; i++) {
    for (let j = i + 1; j < posIds.length; j++) {
      const a = posIds[i], b = posIds[j]
      const pa = petPositions[a], pb = petPositions[b]
      if (Math.hypot(pa.x - pb.x, pa.y - pb.y) < MEET_DIST) {
        const pair = [a, b].sort().join('-')
        const emoji = pair === 'hana-kotaro' ? '💞' : MEET_EMOJIS[pair.length % MEET_EMOJIS.length]
        meetings.push({ key: pair, x: (pa.x + pb.x) / 2, y: Math.min(pa.y, pb.y), emoji })
        meetPartner[a] = pb.x
        meetPartner[b] = pa.x
      }
    }
  }

  return (
    <div className="home-room">
      <div className="room-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="room-title">🏠 我的家</span>
        <motion.button className="room-shop-btn" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('shop')}>
          🛍️ 佈置
        </motion.button>
      </div>

      {/* 進場運鏡：鏡頭從遠處緩緩推進 */}
      {/* 庭園的版型（隱藏窗戶、地面、按鈕位置…）整套寫在 .scene-outdoor 上，
          所以魔法花園也掛上它當「基底」，自己的 .scene-magic 只負責覆蓋顏色，不必複製一份 CSS */}
      <motion.div
        className={`room-scene scene-${scene}${scene === 'magic' ? ' scene-outdoor' : ''} phase-${phase} weather-${weather}${activeTheme ? ` theme-${activeTheme}` : ''}${snapping ? ' snapping' : ''}${tool ? ' throwing' : ''}`}
        ref={containerRef}
        onClick={throwToy}
        initial={{ scale: 1.16, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── 3D 立體場景：整個房間／庭園交給 three.js 畫，狀態仍由上面這些 state 提供 ── */}
        {use3D && (
          <Suspense fallback={<div className="room-3d-loading">🧊 立體場景載入中…</div>}>
            <RoomWorld3D
              scene={scene}
              theme={activeTheme}
              phase={phase}
              weather={weather}
              lamp={lamp}
              pets={scenePets}
              petMoods={petMoods}
              decos={sceneDecos}
              garden={garden}
              toy={toy}
              tool={tool}
              onPetClick={handlePetClick}
              onDecoMove={(id, p) => moveHomeDeco(id, p.x, p.y, p.scale)}
              onPlantTap={(key) => {
                const p = garden.find((g) => g.key === key)
                if (p) tapPlant(NO_EVENT, p, plantView(p))
              }}
              onFloorTap={(pt) => throwToyAt(pt.x, pt.y)}
              onWindowTap={() => cycleWeather(NO_EVENT)}
              onToyReach={onToyReach}
              onPetPos={reportPos}
            />
          </Suspense>
        )}

        {/* 3D 版：點到寵物時在牠身上冒出名字（2D 版本來就有常駐名牌，不需要） */}
        {use3D && nameTag && petPositions[nameTag.petId] && (
          <motion.div className="room-nametag" key={nameTag.key}
            style={{ left: `${petPositions[nameTag.petId].x}%`,
              top: `${petPositions[nameTag.petId].y}%`,
              zIndex: Math.round(petPositions[nameTag.petId].y) + 2 }}
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <span className="room-pet-name">{PETS[nameTag.petId]?.name}</span>
          </motion.div>
        )}

        {!use3D && (<>
        {/* Isometric room background layers（視差：背景反向微移） */}
        <div className="room-wall" />

        {/* 大觀景窗：窗外天空反向視差＋天氣＋遠山＋飛過的訪客；點窗戶換天氣 */}
        <div className="room-window" onClick={cycleWeather} role="button" aria-label="點一下換天氣">
          <div className="room-window-sky">
            <span className="rw-orb">{phase === 'night' ? '🌙' : '☀️'}</span>
            <span className="rw-cloud c1">☁️</span>
            <span className="rw-cloud c2">☁️</span>
            <span className="rw-cloud c3">🌥️</span>
            {weather === 'rainbow' && phase !== 'night' && <span className="rw-rainbow">🌈</span>}
            <AnimatePresence>
              {visitor && (
                <motion.span
                  key={visitor.key}
                  className={`rw-visitor ${visitor.feifei ? 'rw-feifei' : ''}`}
                  style={{ fontSize: visitor.size }}
                  initial={{ left: '-16%', top: `${visitor.top}%`, opacity: 1 }}
                  animate={{ left: '112%', top: `${visitor.shoot ? visitor.top + 36 : visitor.top}%` }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: visitor.dur, ease: visitor.shoot ? 'easeIn' : 'linear' }}
                  onAnimationComplete={() => setVisitor(null)}
                >
                  <span className={visitor.flip ? 'rw-flip' : ''}>{visitor.e}</span>
                </motion.span>
              )}
            </AnimatePresence>
            <div className="rw-hills" />
            {weather === 'rain' && <div className="rw-rain" />}
            {weather === 'snow' && <div className="rw-snow" />}
          </div>
          <div className="rw-bars" />
        </div>
        <div className="room-window-sill" />
        <div className="room-window-light" />
        <div className="room-floor-wrap">
          <div className="room-floor-grid" />
        </div>
        <div className="room-side-shade" />

        {/* 秘密庭園的天空：流動的雲＋夜晚閃爍的星星 */}
        {scene === 'outdoor' && (
          <div className="room-sky-fx" aria-hidden="true">
            {phase === 'night' && <div className="osky-stars" />}
            <span className="osky-cloud o1">☁️</span>
            <span className="osky-cloud o2">🌥️</span>
            <span className="osky-cloud o3">☁️</span>
          </div>
        )}

        {/* 互動層（家具+寵物）：視差正向微移 */}
        <div className="room-actors">
          {/* Decorations (draggable) — 只渲染目前場景的家具 */}
          {sceneDecos.map(({ item, pos }) => (
            <DraggableDeco
              key={item.id}
              item={item}
              pos={pos}
              onMove={moveHomeDeco}
              containerRef={containerRef}
            />
          ))}

          {/* Pets — 只渲染目前場景的寵物 */}
          {scenePets.map(([petId, petData]) => (
            <WanderingPet
              key={petId}
              petId={petId}
              petDef={PETS[petId]}
              petData={petData}
              equippedPetItems={petItemsById[petId] || EMPTY_ITEMS}
              placedDecos={scenePlaced}
              poolPos={scene === 'outdoor' ? poolPos : null}
              onPetClick={handlePetClick}
              mood={petMoods?.[petId] ?? 80}
              weather={weather}
              theme={activeTheme}
              reportPos={reportPos}
              meetX={meetPartner[petId] ?? null}
              toy={toy}
              onToyReach={onToyReach}
            />
          ))}

          {/* 第5彈：地上的零食/球＋吃掉/踢完的表情 */}
          {toy && (
            <motion.div key={toy.key} className="room-toy"
              style={{ left: `${toy.x}%`, top: `${toy.y}%`, zIndex: Math.round(toy.y) }}
              initial={{ opacity: 0, scale: 0.4, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: [-40, 0, -12, 0, -5, 0] }}
              transition={{ duration: 0.6 }}>
              {toy.kind === 'treat' ? '🍪' : '🎾'}
            </motion.div>
          )}
          <AnimatePresence>
            {toyFx && (
              <motion.div key={toyFx.key} className="room-toy-fx"
                style={{ left: `${toyFx.x}%`, top: `${toyFx.y}%` }}
                initial={{ opacity: 1, y: 0, scale: 0.7 }}
                animate={{ opacity: 0, y: -46, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}>
                {toyFx.emoji}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 秘密庭園：種下的花草樹木，依真實時間長大→開花，開花後可點採收 */}
          {isGardenScene(scene) && sceneGarden.map((p) => {
            const v = plantView(p)
            const ds = getDepthScale(p.y)
            const needsWater = !v.bloomed && !v.ready && p.lastWater !== todayKey()
            return (
              <div
                key={p.key}
                className={`room-plant${v.bloomed ? ' bloomed' : ''}${v.ready ? ' ready' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: Math.round(p.y),
                  transform: `translateX(-50%) scale(${ds})`, transformOrigin: 'bottom center' }}
                onClick={(e) => tapPlant(e, p, v)}
              >
                <div className="room-plant-shadow" />
                <motion.span className="room-plant-emoji"
                  key={v.emoji}
                  initial={{ scale: 0, y: 6 }} animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 14 }}>
                  {v.emoji}
                </motion.span>
                {v.bloomed && <span className="room-plant-ping">✨</span>}
                {/* 開花的花上飛來蝴蝶／蜜蜂：小小生態 */}
                {/* ⚠️ 以下三個常駐動畫刻意用 CSS class 而不是 framer-motion：
                    一株植物最多同時掛三個，24 株就是幾十個 JS 逐幀動畫，平板會卡到點不動 */}
                {v.bloomed && (
                  <span className="room-plant-critter">{p.v % 2 ? '🐝' : '🦋'}</span>
                )}
                {/* 魔法花澆滿了：冒問號，等安安答題 */}
                {v.ready && <span className="room-plant-quiz">❓</span>}
                {/* 今天還沒澆水：冒一滴水珠提醒安安來照顧 */}
                {needsWater && <span className="room-plant-thirsty">💧</span>}
              </div>
            )
          })}

          {/* 夜晚的秘密庭園：地面飄起螢火蟲 */}
          {isGardenScene(scene) && phase === 'night' && (
            <div className="garden-fireflies" aria-hidden="true">
              {[...Array(7)].map((_, i) => (
                <span key={i} className="firefly"
                  style={{ left: `${8 + i * 12}%`, top: `${58 + (i % 3) * 9}%`,
                    '--d': `${4 + i * 0.6}s`, '--dl': `${i * 0.4}s` }}>
                  ✨
                </span>
              ))}
            </div>
          )}

          {/* 寵物相遇：兩隻靠近時中間冒互動表情 */}
          {meetings.map((m) => (
            <div key={m.key} className="room-meet"
              style={{ left: `${m.x}%`, top: `${m.y}%`, zIndex: Math.round(m.y) + 1 }}>
              <motion.span
                style={{ display: 'inline-block' }}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1], y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.3 }}>
                {m.emoji}
              </motion.span>
            </div>
          ))}

          {/* Hint */}
          {sceneDecos.length === 0 && (
            <motion.div
              className="room-empty-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>💡</span>
              <p>去商店的「家居」分類購買家具來佈置吧！</p>
            </motion.div>
          )}
        </div>
        </>)}

        {/* 晝夜色調 + 前景暗角（最上層，不吃點擊） */}
        <div className="room-tint" />
        <div className="room-fore" />

        {/* iPad 體感視差授權鈕 */}
        {gyroNeed && (
          <motion.button className="room-gyro-btn" whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); enableGyro() }}
            data-tip="開啟後傾斜平板，畫面會跟著移動">
            📱 開啟體感
          </motion.button>
        )}

        {/* 拍照按鈕＋快門閃光 */}
        {!snapping && !photo && (
          <motion.button className="room-photo-btn" whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); takePhoto() }} aria-label="拍照" data-tip="拍一張照片">
            📸
          </motion.button>
        )}

        {/* 2D／3D 切換 */}
        {!snapping && (
          <motion.button className="room-3d-btn" whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); sfx.click(); setUse3D((v) => !v) }}
            aria-label={use3D ? '切回平面' : '切換立體'}
            data-tip={use3D ? '切回平面場景' : '切換成立體場景'}>
            {use3D ? '🖼️ 2D' : '🧊 3D'}
          </motion.button>
        )}

        {/* 電燈開關（只有立體場景有燈）。沒按過就照晝夜自動亮 */}
        {use3D && !snapping && (
          <motion.button className="room-lamp-btn" whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation(); sfx.click()
              setLamp((v) => !(v ?? (phase === 'night' || phase === 'evening')))
            }}
            aria-label="電燈開關"
            data-tip={(lamp ?? (phase === 'night' || phase === 'evening'))
              ? '把燈關掉（晚上才看得到螢火蟲）' : '把燈點亮'}>
            {(lamp ?? (phase === 'night' || phase === 'evening')) ? '💡 關燈' : '🔦 開燈'}
          </motion.button>
        )}

        {/* 室內 / 戶外 場景切換 */}
        {!snapping && (
          <div className="room-scene-tabs">
            {[['indoor', '🏠 溫暖的家'], ['outdoor', GARDEN_SCENES.outdoor.label], ['magic', GARDEN_SCENES.magic.label]].map(([id, label]) => (
              <motion.button key={id} className={`room-scene-tab${scene === id ? ' active' : ''}`}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); if (scene !== id) { sfx.click(); setScene(id); setTool(null) } }}>
                {label}
              </motion.button>
            ))}
          </div>
        )}

        {/* 第5彈：丟零食/丟球按鈕＋提示 */}
        {!snapping && (
          <div className="room-toy-btns">
            {Object.entries(TOY_TOOLS).map(([k, t]) => (
              <motion.button key={k} className={`room-toy-btn${tool === k ? ' armed' : ''}`}
                whileTap={{ scale: 0.85 }}
                onClick={(e) => { e.stopPropagation(); sfx.click(); setTool(tool === k ? null : k) }}
                aria-label={t.hint} data-tip={t.hint}>
                {t.emoji}
              </motion.button>
            ))}
          </div>
        )}
        {/* 秘密庭園：花苗／肥料／全部澆水按鈕（只在庭園場景出現） */}
        {!snapping && isGardenScene(scene) && (
          <div className="room-seed-btns">
            {/* 只列出這個庭園收的花苗：魔法花園只有魔法花苗，秘密庭園沒有魔法花苗 */}
            {(GARDEN_SCENES[scene]?.seeds || SEED_KINDS).map((k) => {
              const count = seedlings?.[k] || 0
              return (
                <motion.button key={k} className={`room-seed-btn${tool === k ? ' armed' : ''}${count === 0 ? ' empty' : ''}`}
                  whileTap={count > 0 ? { scale: 0.85 } : {}}
                  disabled={count === 0}
                  onClick={(e) => { e.stopPropagation(); if (count === 0) return; sfx.click(); setTool(tool === k ? null : k) }}
                  data-tip={count === 0 ? `${PLANT_KINDS[k].seedName}（沒有了）` : `種下${PLANT_KINDS[k].seedName}`}>
                  {PLANT_KINDS[k].bagEmoji}
                  <span className="room-seed-count">{count}</span>
                </motion.button>
              )
            })}
            {/* 魔法肥料 */}
            <motion.button className={`room-seed-btn${tool === 'fert' ? ' armed' : ''}${(fertilizer || 0) === 0 ? ' empty' : ''}`}
              whileTap={(fertilizer || 0) > 0 ? { scale: 0.85 } : {}}
              disabled={(fertilizer || 0) === 0}
              onClick={(e) => { e.stopPropagation(); if ((fertilizer || 0) === 0) return; sfx.click(); setTool(tool === 'fert' ? null : 'fert') }}
              data-tip={(fertilizer || 0) === 0 ? '魔法肥料（沒有了）' : '灑魔法肥料'}>
              {FERTILIZER.emoji}
              <span className="room-seed-count">{fertilizer || 0}</span>
            </motion.button>
            {/* 一鍵全部澆水 */}
            <motion.button className="room-seed-btn water-all"
              whileTap={{ scale: 0.85 }}
              onClick={handleWaterAll} data-tip="一次幫全部的花澆水">
              💦
            </motion.button>
            {/* 花園圖鑑 */}
            <motion.button className="room-seed-btn codex"
              whileTap={{ scale: 0.85 }}
              onClick={(e) => { e.stopPropagation(); sfx.click(); setCodexOpen(true) }}
              data-tip="花園圖鑑：看看收集了哪些花">
              📖
              <span className="room-seed-count">{(gardenDex || []).length}</span>
            </motion.button>
            {/* 花園小幫手 */}
            <motion.button className={`room-seed-btn keeper${gardenKeeper ? ' on' : ''}`}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => { e.stopPropagation(); sfx.click(); setKeeperOpen(true) }}
              data-tip={gardenKeeper ? '換一隻花園小幫手' : '指派花園小幫手'}>
              {gardenKeeper ? petFace(gardenKeeper) : '🐾'}
            </motion.button>
          </div>
        )}
        {tool && (
          <div className="room-toy-hint">
            {TOY_TOOLS[tool]?.hint
              || (tool === 'fert' ? '點一株植物撒肥料，立刻多長一天！'
              : SEED_KINDS.includes(tool) ? `點草地種下${PLANT_KINDS[tool].seedName}，每天澆水就會長大～`
              : '')}
          </div>
        )}
        <AnimatePresence>
          {snapping && (
            <motion.div className="room-photo-flash"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* 拍立得預覽 */}
      <AnimatePresence>
        {photo && (
          <motion.div className="room-photo-modal" onClick={() => setPhoto(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="room-polaroid" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.6, rotate: -8, y: 60 }} animate={{ scale: 1, rotate: -2, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
              <img src={photo} alt="我的家紀念照" />
              <div className="room-polaroid-caption">
                🏠 安安的家 · {new Date().toLocaleDateString('zh-TW')}
              </div>
              <div className="room-polaroid-btns">
                <button onClick={downloadPhoto}>💾 儲存照片</button>
                <button onClick={() => { sfx.click(); setPhoto(null) }}>✕ 關閉</button>
              </div>
              <div className="room-polaroid-hint">平板可以長按照片存到相簿喔</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 花園小提示浮條 */}
      <AnimatePresence>
        {notice && (
          <motion.div key={notice.key} className="garden-notice"
            initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            {notice.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 魔法花答題 */}
      <AnimatePresence>
        {quiz && (
          <motion.div className="garden-modal" onClick={() => setQuiz(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="garden-quiz" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
              <div className="garden-quiz-title">🔮 魔法花要盛開了！答對就綻放～</div>
              <div className="garden-quiz-q">{quiz.q} = ?</div>
              <div className="garden-quiz-choices">
                {quiz.choices.map((c) => (
                  <motion.button key={c} whileTap={{ scale: 0.9 }}
                    className={`garden-quiz-choice${quiz.wrong === c ? ' wrong' : ''}`}
                    onClick={() => answerQuiz(c)}>
                    {c}
                  </motion.button>
                ))}
              </div>
              {quiz.wrong != null && <div className="garden-quiz-hint">再想想看，你可以的！💪</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 花園圖鑑 */}
      <AnimatePresence>
        {codexOpen && (
          <motion.div className="garden-modal" onClick={() => setCodexOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="garden-codex" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
              <div className="garden-codex-title">📖 花園圖鑑</div>
              <div className="garden-codex-sub">已收集 {(gardenDex || []).length} / {ALL_BLOOMS.length} 種花色</div>
              <div className="garden-codex-grid">
                {ALL_BLOOMS.map((e) => {
                  const got = (gardenDex || []).includes(e)
                  return <span key={e} className={`garden-codex-cell${got ? ' got' : ''}`}>{got ? e : '❔'}</span>
                })}
              </div>
              <div className="garden-codex-tip">全部收集完成可得 200 金幣大獎！</div>
              <button className="garden-modal-close" onClick={() => { sfx.click(); setCodexOpen(false) }}>關閉</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 選花園小幫手 */}
      <AnimatePresence>
        {keeperOpen && (
          <motion.div className="garden-modal" onClick={() => setKeeperOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="garden-keeper" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
              <div className="garden-codex-title">🐾 花園小幫手</div>
              <div className="garden-codex-sub">選一隻寵物，牠會每天幫忙澆牠喜歡的花</div>
              <div className="garden-keeper-grid">
                {unlockedPets.map(([id]) => (
                  <motion.button key={id} whileTap={{ scale: 0.9 }}
                    className={`garden-keeper-cell${gardenKeeper === id ? ' on' : ''}`}
                    onClick={() => { sfx.click(); setGardenKeeper(id); setKeeperOpen(false) }}>
                    <span className="gk-face">{petFace(id)}</span>
                    <span className="gk-name">{PETS[id].name}</span>
                  </motion.button>
                ))}
              </div>
              <button className="garden-modal-close"
                onClick={() => { sfx.click(); if (gardenKeeper) setGardenKeeper(gardenKeeper); setKeeperOpen(false) }}>
                {gardenKeeper ? '不指派了' : '關閉'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
