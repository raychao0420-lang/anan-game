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

function WanderingPet({ petId, petDef, petData, equippedPetItems, poolPos, onPetClick, mood = 100 }) {
  const cfg     = PET_CONFIG[petId] ?? DEFAULT_PET_CONFIG
  const isOtter = petId === 'hana' || petId === 'kotaro'

  const [pos, setPos]   = useState(cfg.startPos)
  const [facing, setFacing] = useState(1)
  const [burst, setBurst]   = useState(false)

  const poolPosRef = useRef(poolPos)
  useEffect(() => { poolPosRef.current = poolPos }, [poolPos])

  // Distance to pool
  const distToPool = poolPos
    ? Math.sqrt((pos.x - poolPos.x) ** 2 + (pos.y - poolPos.y) ** 2)
    : Infinity
  const isNearPool = distToPool < POOL_RADIUS
  const isInPool   = isNearPool && isOtter
  const isScared   = isNearPool && petId === 'lulu'

  useEffect(() => {
    const timer = setInterval(() => {
      setPos(prev => {
        const pool = poolPosRef.current
        let dx = (Math.random() - 0.5) * 26
        let dy = (Math.random() - 0.5) * 12

        if (pool && isOtter && Math.random() < 0.45) {
          // Otters drift toward pool
          dx = pool.x - prev.x + (Math.random() - 0.5) * 8
          dy = pool.y - prev.y + (Math.random() - 0.5) * 5
        }

        let newX = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, prev.x + dx))
        let newY = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, prev.y + dy))

        // LULU flees pool
        if (petId === 'lulu' && pool) {
          const dist = Math.sqrt((newX - pool.x) ** 2 + (newY - pool.y) ** 2)
          if (dist < POOL_RADIUS) {
            const angle = Math.atan2(newY - pool.y, newX - pool.x)
            newX = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, pool.x + Math.cos(angle) * POOL_RADIUS * 1.7))
            newY = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, pool.y + Math.sin(angle) * POOL_RADIUS * 1.7))
          }
        }

        setFacing(newX >= prev.x ? 1 : -1)
        return { x: newX, y: newY }
      })
    }, cfg.wanderInterval + Math.random() * 1500)
    return () => clearInterval(timer)
  }, [cfg.wanderInterval, isOtter, petId])

  const handleClick = () => {
    setBurst(true)
    setTimeout(() => setBurst(false), 900)
    onPetClick(petId)
  }

  const depthScale = getDepthScale(pos.y)

  return (
    <div
      className={`room-pet ${isInPool ? 'in-pool' : ''} ${isScared ? 'scared-pool' : ''}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translateX(-50%) scale(${depthScale})`,
        transformOrigin: 'bottom center',
        zIndex: Math.round(pos.y),
      }}
      onClick={handleClick}
    >
      <div className="room-pet-shadow" />
      {/* Bob layer */}
      <motion.div
        animate={{ y: isInPool ? [0, -4, 0] : [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: isInPool ? 0.7 : cfg.bobDuration, ease: 'easeInOut' }}
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

      {/* Splash when in pool */}
      {isInPool && <div className="room-pet-splash">💦</div>}

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
            {isInPool ? '💦' : cfg.burstEmoji}
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

      <div className="room-scene" ref={containerRef}>
        {/* Isometric room background layers */}
        <div className="room-wall" />
        <div className="room-floor-wrap">
          <div className="room-floor-grid" />
        </div>
        <div className="room-side-shade" />

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
    </div>
  )
}
