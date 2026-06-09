import { motion, AnimatePresence } from 'framer-motion'
import { PETS } from '../data/pets'
import './PetDisplay.css'

export default function PetDisplay({ petId, mood = 'idle', size = 'md' }) {
  const pet = PETS[petId]
  const { pets } = window.__gameStore?.getState?.() || {}
  const evolutionStage = pets?.[petId]?.evolutionStage || 1
  const stage = pet.stages[evolutionStage]

  const moodEmoji = mood === 'happy' ? pet.happyEmoji
    : mood === 'sad' ? pet.sadEmoji
    : mood === 'scared' ? (pet.scaredEmoji || pet.sadEmoji)
    : null

  const sizeMap = { sm: 0.7, md: 1, lg: 1.3 }
  const scale = sizeMap[size] || 1

  return (
    <div className="pet-display-wrap">
      <motion.div
        className={`pet-bubble ${stage.glow ? 'glow' : ''}`}
        style={{
          background: stage.bg,
          border: `3px solid ${stage.border}`,
          transform: `scale(${scale})`,
        }}
        animate={mood === 'idle' ? { y: [0, -6, 0] } : {}}
        transition={mood === 'idle' ? { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } : {}}
      >
        <span className="pet-emoji" style={{ fontSize: stage.size }}>
          {stage.emoji}
        </span>
        <AnimatePresence>
          {moodEmoji && (
            <motion.span
              className="pet-mood"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: 1, y: -10 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {moodEmoji}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="pet-label">{pet.name} · {stage.label}</div>
    </div>
  )
}
