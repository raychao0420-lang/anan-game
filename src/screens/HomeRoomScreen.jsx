import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { sfx } from '../utils/sound'
import './HomeRoomScreen.css'

const PET_CONFIG = {
  lulu:   { startPos: { x: 12, y: 50 }, bobDuration: 1.8, wanderInterval: 2800, burstEmoji: '🐾' },
  hana:   { startPos: { x: 44, y: 54 }, bobDuration: 2.1, wanderInterval: 3500, burstEmoji: '💙' },
  kotaro: { startPos: { x: 72, y: 51 }, bobDuration: 2.4, wanderInterval: 4200, burstEmoji: '💚' },
}

// 8 decoration slots around the room (% positions)
const DECO_SLOTS = [
  { left: '4%',  top: '7%',  fontSize: '2.2rem' },
  { left: '22%', top: '4%',  fontSize: '2.2rem' },
  { left: '45%', top: '3%',  fontSize: '2.4rem' },
  { left: '67%', top: '4%',  fontSize: '2.2rem' },
  { left: '87%', top: '7%',  fontSize: '2.2rem' },
  { left: '5%',  top: '75%', fontSize: '2.6rem' },
  { left: '86%', top: '73%', fontSize: '2.6rem' },
  { left: '46%', top: '79%', fontSize: '2.6rem' },
]

const BOUNDS = { xMin: 6, xMax: 78, yMin: 42, yMax: 66 }

function WanderingPet({ petId, petDef, petData, equippedPetItems, onPetClick }) {
  const cfg = PET_CONFIG[petId]
  const [pos, setPos] = useState(cfg.startPos)
  const [facing, setFacing] = useState(1)
  const [burst, setBurst] = useState(false)

  const petStage = petDef.stages[petData.evolutionStage]

  useEffect(() => {
    const timer = setInterval(() => {
      setPos(prev => {
        const dx = (Math.random() - 0.5) * 26
        const dy = (Math.random() - 0.5) * 12
        const newX = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, prev.x + dx))
        const newY = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, prev.y + dy))
        setFacing(newX >= prev.x ? 1 : -1)
        return { x: newX, y: newY }
      })
    }, cfg.wanderInterval + Math.random() * 1500)
    return () => clearInterval(timer)
  }, [cfg.wanderInterval])

  const handleClick = () => {
    setBurst(true)
    setTimeout(() => setBurst(false), 900)
    onPetClick(petId)
  }

  return (
    <div
      className="room-pet"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onClick={handleClick}
    >
      {/* Bob layer */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: cfg.bobDuration, ease: 'easeInOut' }}
        whileTap={{ scale: 1.3 }}
      >
        {/* Flip layer */}
        <motion.div
          animate={{ scaleX: facing }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <span className="room-pet-emoji">{petStage.emoji}</span>
          {equippedPetItems.length > 0 && (
            <div className="room-pet-accs">
              {equippedPetItems.map(item => (
                <span key={item.id}>{item.emoji}</span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      <div className="room-pet-name">{petDef.name}</div>

      <AnimatePresence>
        {burst && (
          <motion.div
            key="burst"
            className="room-pet-burst"
            initial={{ opacity: 1, y: 0, scale: 0.7 }}
            animate={{ opacity: 0, y: -50, scale: 1.4 }}
            transition={{ duration: 0.8 }}
          >
            {cfg.burstEmoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HomeRoomScreen({ onNavigate }) {
  const { pets, equippedItems, equippedHomeItems } = useGameStore()

  const unlockedPets = Object.entries(pets).filter(([, data]) => data.unlocked)

  const petAccessories = equippedItems
    .map(id => SHOP_ITEMS.find(i => i.id === id))
    .filter(Boolean)

  const homeDecos = equippedHomeItems
    .map(id => SHOP_ITEMS.find(i => i.id === id))
    .filter(Boolean)

  const handlePetClick = (petId) => {
    if (petId === 'lulu') {
      sfx.beagle()
    } else {
      sfx.otter()
    }
  }

  return (
    <div className="home-room">
      <div className="room-header">
        <motion.button
          className="btn-back"
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('home')}
        >
          ← 返回
        </motion.button>
        <span className="room-title">🏠 我的家</span>
        <motion.button
          className="room-shop-btn"
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('shop')}
        >
          🛍️ 佈置
        </motion.button>
      </div>

      <div className="room-scene">
        {/* Home decorations */}
        {homeDecos.map((item, idx) => {
          const slot = DECO_SLOTS[idx % DECO_SLOTS.length]
          return (
            <motion.div
              key={item.id}
              className="room-deco"
              style={slot}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: idx * 0.06 }}
            >
              <span style={{ fontSize: slot.fontSize }}>{item.emoji}</span>
              <div className="room-deco-label">{item.name}</div>
            </motion.div>
          )
        })}

        {/* Pets */}
        {unlockedPets.map(([petId, petData]) => (
          <WanderingPet
            key={petId}
            petId={petId}
            petDef={PETS[petId]}
            petData={petData}
            equippedPetItems={petAccessories}
            onPetClick={handlePetClick}
          />
        ))}

        {/* Hint when no decorations */}
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
