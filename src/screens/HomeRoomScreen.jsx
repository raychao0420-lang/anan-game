import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { sfx } from '../utils/sound'
import PetAvatar from '../components/PetAvatar'
import DecoArt from '../components/DecoArt'
import './HomeRoomScreen.css'

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
  pool:        { pets: ['hana', 'kotaro', 'seal', 'penguin', 'beaver'],  motion: 'splash', emoji: '💦' },
  hot_spring:  { pets: ['hana', 'kotaro', 'seal', 'monkey'],             motion: 'soak',   emoji: '♨️' },
  fish_tank:   { pets: ['jiji', 'hana', 'kotaro', 'seal', 'penguin'],    motion: 'gaze',   emoji: '😻' },
  piano:       { pets: ['mejiro', 'owl', 'jiji'],                        motion: 'play',   emoji: '🎵' },
  art_studio:  { pets: ['monkey', 'mejiro', 'dino'],                     motion: 'play',   emoji: '🎨' },
  pet_bed:     { pets: '*',                                             motion: 'sleep',  emoji: '💤' },
  sofa:        { pets: '*',                                             motion: 'sleep',  emoji: '😌' },
  fireplace:   { pets: ['jiji', 'lulu', 'kitsune', 'seal'],              motion: 'sleep',  emoji: '😌' },
  tent:        { pets: ['raccoon', 'dino', 'hamster', 'lulu'],           motion: 'hide',   emoji: '⛺' },
  igloo:       { pets: ['kitsune', 'penguin', 'seal'],                   motion: 'hide',   emoji: '❄️' },
  snow_globe:  { pets: ['kitsune', 'penguin', 'seal'],                   motion: 'gaze',   emoji: '😍' },
  telescope:   { pets: ['owl', 'mejiro', 'jiji', 'raccoon', 'twinkle', 'luna', 'pluto', 'xiaoq'], motion: 'gaze', emoji: '🌟' },
  star_swing:  { pets: ['twinkle', 'luna', 'monkey', 'hamster'],         motion: 'bounce', emoji: '🌠' },
  moon_hammock:{ pets: ['luna', 'twinkle', 'pluto', 'jiji', 'seal'],     motion: 'sleep',  emoji: '🌙' },
  reunion_lamp:{ pets: ['pluto', 'twinkle', 'luna', 'lulu', 'hamster', 'monkey', 'jiji', 'seal'], motion: 'gaze', emoji: '💗' },
  puzzle_board:{ pets: ['xiaoq', 'owl', 'jiji', 'beaver', 'dino', 'hamster'],     motion: 'gaze',   emoji: '🖍️' },
  library:     { pets: ['owl', 'jiji', 'xiaoq'],                                  motion: 'gaze',   emoji: '📖' },
  painting:    { pets: ['jiji', 'owl', 'mejiro', 'xiaoq'],                        motion: 'gaze',   emoji: '🖼️' },
  fairy_light: { pets: ['raccoon', 'monkey', 'mejiro', 'jiji', 'twinkle', 'luna', 'pluto', 'xiaoq'], motion: 'gaze', emoji: '✨' },
  mushroom_lamp:{ pets: ['raccoon', 'jiji', 'owl', 'twinkle', 'luna', 'xiaoq'],   motion: 'gaze',   emoji: '🍄' },
  rainbow:     { pets: ['mejiro', 'penguin', 'seal', 'twinkle', 'luna'], motion: 'gaze',   emoji: '🌈' },
  bamboo:      { pets: ['hamster', 'beaver', 'dino', 'mejiro'],          motion: 'gaze',   emoji: '😋' },
  plant:       { pets: ['mejiro', 'hamster', 'beaver'],                  motion: 'gaze',   emoji: '🌿' },
  bird_perch:  { pets: ['mejiro', 'owl', 'xiaoq'],                                motion: 'gaze',   emoji: '🐤' },
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

const ACTIVITY_RADIUS = 24  // 距家具多近算「正在使用」

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

const BOUNDS      = { xMin: 6,  xMax: 78, yMin: 42, yMax: 66 }
const DECO_BOUNDS = { xMin: 2,  xMax: 88, yMin: 2,  yMax: 86 }

// ── Draggable decoration ──────────────────────────────────────────────────────

function DraggableDeco({ item, pos, onMove, containerRef }) {
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
}

// ── Wandering pet ─────────────────────────────────────────────────────────────

function WanderingPet({ petId, petDef, petData, equippedPetItems, placedDecos, poolPos, onPetClick, mood = 100 }) {
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

        let dx, dy
        if (target) {
          const near = Math.hypot(prev.x - target.x, prev.y - target.y) < ACTIVITY_RADIUS
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
        {/* Flip layer */}
        <motion.div
          animate={{ scaleX: facing }}
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
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function HomeRoomScreen({ onNavigate }) {
  const { pets, petEquipment, equippedHomeItems, homeDecoPositions, moveHomeDeco, petMoods } = useGameStore()
  const containerRef = useRef(null)

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

  const cycleWeather = () => {
    sfx.click()
    const opts = phase === 'night' ? ['clear', 'rain', 'snow'] : ['clear', 'rain', 'snow', 'rainbow']
    setWeather((w) => opts[(opts.indexOf(w) + 1) % opts.length])
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

  const unlockedPets = Object.entries(pets).filter(([, data]) => data.unlocked)

  const homeDecos = equippedHomeItems
    .map(id => SHOP_ITEMS.find(i => i.id === id))
    .filter(Boolean)

  // Pool position (default to floor-center if not moved)
  const poolEquipped = equippedHomeItems.includes('pool')
  const poolPos = poolEquipped
    ? (homeDecoPositions['pool'] || { x: 45, y: 71 })
    : null

  const getDecoPos = (item, idx) => {
    if (homeDecoPositions[item.id]) return homeDecoPositions[item.id]
    if (item.id === 'pool') return { x: 45, y: 71, scale: 1 }
    return { ...DECO_SLOTS[idx % DECO_SLOTS.length], scale: 1 }
  }

  // 已擺放、且有互動的家具座標，給寵物尋路用
  const placedDecos = homeDecos
    .map((item, idx) => ({ id: item.id, ...getDecoPos(item, idx) }))
    .filter((d) => DECO_ACTIVITIES[d.id])

  const handlePetClick = (petId) => {
    sfx.pet(petId)
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
      <motion.div
        className={`room-scene phase-${phase} weather-${weather}`}
        ref={containerRef}
        initial={{ scale: 1.16, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
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

        {/* 互動層（家具+寵物）：視差正向微移 */}
        <div className="room-actors">
          {/* Decorations (draggable) */}
          {homeDecos.map((item, idx) => (
            <DraggableDeco
              key={item.id}
              item={item}
              pos={getDecoPos(item, idx)}
              onMove={moveHomeDeco}
              containerRef={containerRef}
            />
          ))}

          {/* Pets */}
          {unlockedPets.map(([petId, petData]) => (
            <WanderingPet
              key={petId}
              petId={petId}
              petDef={PETS[petId]}
              petData={petData}
              equippedPetItems={(petEquipment[petId] || [])
                .map(id => SHOP_ITEMS.find(i => i.id === id))
                .filter(Boolean)}
              placedDecos={placedDecos}
              poolPos={poolPos}
              onPetClick={handlePetClick}
              mood={petMoods?.[petId] ?? 80}
            />
          ))}

          {/* Hint */}
          {homeDecos.length === 0 && (
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

        {/* 晝夜色調 + 前景暗角（最上層，不吃點擊） */}
        <div className="room-tint" />
        <div className="room-fore" />

        {/* iPad 體感視差授權鈕 */}
        {gyroNeed && (
          <motion.button className="room-gyro-btn" whileTap={{ scale: 0.9 }} onClick={enableGyro}>
            📱 開啟體感
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
