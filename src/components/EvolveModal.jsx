import { motion, AnimatePresence } from 'framer-motion'
import { PETS } from '../data/pets'
import './EvolveModal.css'

const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i / 12) * 360,
  emoji: ['✨','⭐','💫','🌟'][i % 4],
}))

export default function EvolveModal({ petId, newStage, onClose }) {
  const pet = PETS[petId]
  const prev = pet.stages[newStage - 1]
  const next = pet.stages[newStage]

  return (
    <motion.div
      className="evolve-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="evolve-card"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparks */}
        {SPARKS.map((s) => (
          <motion.span
            key={s.id}
            className="evolve-spark"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos((s.angle * Math.PI) / 180) * 100,
              y: Math.sin((s.angle * Math.PI) / 180) * 100,
              opacity: [0, 1, 0],
              scale: [0, 1.4, 0],
            }}
            transition={{ duration: 0.9, delay: 0.3 + s.id * 0.04 }}
          >
            {s.emoji}
          </motion.span>
        ))}

        <div className="evolve-title">✨ 進化成功！</div>

        <div className="evolve-pets">
          <div className="evolve-before">
            <div className="evolve-bubble" style={{ background: prev.bg, border: `2px solid ${prev.border}` }}>
              <span style={{ fontSize: '3rem' }}>{prev.emoji}</span>
            </div>
            <div className="evolve-sublabel">{prev.label}</div>
          </div>

          <motion.div
            className="evolve-arrow"
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            →
          </motion.div>

          <div className="evolve-after">
            <motion.div
              className="evolve-bubble"
              style={{ background: next.bg, border: `3px solid ${next.border}`, boxShadow: next.glow ? '0 0 20px 6px #FFD700' : undefined }}
              animate={{ scale: [0.8, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span style={{ fontSize: '3.5rem' }}>{next.emoji}</span>
            </motion.div>
            <div className="evolve-sublabel new">{next.label}</div>
          </div>
        </div>

        <div className="evolve-name">
          {pet.name} 變成了「{next.label}」！
        </div>

        <motion.button
          className="btn-primary"
          style={{ maxWidth: 200 }}
          whileTap={{ scale: 0.93 }}
          onClick={onClose}
        >
          太棒了！🎉
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
