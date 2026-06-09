import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS, PET_ORDER } from '../data/pets'
import EvolveModal from '../components/EvolveModal'
import { sfx } from '../utils/sound'
import './PetScreen.css'

const EVOLVE_COSTS = [0, 200, 500, 1000] // cost to reach stage 2/3/4

export default function PetScreen({ onNavigate }) {
  const { coins, pets, activePet, evolvePet, unlockPet, setActivePet } = useGameStore()
  const [selected, setSelected] = useState(activePet)
  const [evolveModal, setEvolveModal] = useState(null) // { petId, newStage }

  const petData = pets[selected]
  const petDef = PETS[selected]
  const stage = petDef.stages[petData.evolutionStage]
  const nextStage = petDef.stages[petData.evolutionStage + 1]
  const evolveCost = EVOLVE_COSTS[petData.evolutionStage] // cost to go to next stage
  const canEvolve = petData.unlocked && petData.evolutionStage < 4 && coins >= evolveCost
  const maxEvolved = petData.evolutionStage >= 4

  const handleEvolve = () => {
    if (!canEvolve) return
    evolvePet(selected, evolveCost)
    sfx.evolve()
    setEvolveModal({ petId: selected, newStage: petData.evolutionStage + 1 })
  }

  const handleUnlock = () => {
    if (coins < petDef.unlockCost) return
    unlockPet(selected, petDef.unlockCost)
    sfx.unlock()
  }

  return (
    <div className="pet-screen">
      {/* Header */}
      <div className="pet-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="pet-screen-title">我的寵物</span>
        <span className="pet-coins">💰 {coins}</span>
      </div>

      {/* Pet tabs */}
      <div className="pet-tabs">
        {PET_ORDER.map((id) => {
          const p = PETS[id]
          const pd = pets[id]
          return (
            <motion.button
              key={id}
              className={`pet-tab ${selected === id ? 'active' : ''} ${!pd.unlocked ? 'locked' : ''}`}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelected(id)}
            >
              <span className="pet-tab-emoji">
                {pd.unlocked ? p.stages[pd.evolutionStage].emoji : '🔒'}
              </span>
              <span className="pet-tab-name">{p.name}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Main pet display */}
      <div className="pet-main">
        <motion.div
          key={selected}
          className="pet-big-bubble"
          style={{ background: stage.bg, border: `4px solid ${stage.border}`, boxShadow: stage.glow ? '0 0 24px 8px #FFD700' : '0 6px 24px rgba(0,0,0,0.12)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={petData.unlocked ? { scale: 1, opacity: 1, y: [0, -10, 0] } : { scale: 1, opacity: 1 }}
          transition={petData.unlocked
            ? { scale: { type: 'spring', stiffness: 250 }, y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }
            : { type: 'spring', stiffness: 250 }}
        >
          <span style={{ fontSize: '5.5rem' }}>
            {petData.unlocked ? stage.emoji : '🔒'}
          </span>
        </motion.div>

        <div className="pet-info">
          <div className="pet-info-name">{petDef.name}</div>
          <div className="pet-info-breed">{petDef.breed} · {petDef.personality}</div>
          {petData.unlocked && (
            <div className="pet-info-stage">{stage.label}</div>
          )}
        </div>

        {/* Evolution stages progress */}
        {petData.unlocked && (
          <div className="evo-track">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`evo-dot ${s <= petData.evolutionStage ? 'filled' : ''}`}>
                <span>{petDef.stages[s].emoji}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action area */}
      <div className="pet-actions">
        {!petData.unlocked ? (
          <div className="pet-unlock-area">
            <div className="pet-unlock-cost">解鎖費用：{petDef.unlockCost} 💰</div>
            <motion.button
              className={`btn-primary ${coins < petDef.unlockCost ? 'disabled' : ''}`}
              whileTap={coins >= petDef.unlockCost ? { scale: 0.94 } : {}}
              onClick={handleUnlock}
              disabled={coins < petDef.unlockCost}
            >
              {coins >= petDef.unlockCost ? `🔓 解鎖 ${petDef.name}！` : `💰 金幣不足（差 ${petDef.unlockCost - coins}）`}
            </motion.button>
          </div>
        ) : maxEvolved ? (
          <div className="pet-max-label">👑 已達最高進化！傳說等級！</div>
        ) : (
          <div className="pet-evolve-area">
            <div className="pet-evolve-preview">
              <span>下一階段：</span>
              <span style={{ fontSize: '1.5rem' }}>{nextStage?.emoji}</span>
              <span className="pet-evolve-label">{nextStage?.label}</span>
            </div>
            <div className="pet-evolve-cost">進化費用：{evolveCost} 💰</div>
            <motion.button
              className={`btn-primary evolve-btn ${!canEvolve ? 'disabled' : ''}`}
              whileTap={canEvolve ? { scale: 0.94 } : {}}
              onClick={handleEvolve}
              disabled={!canEvolve}
            >
              {canEvolve ? '✨ 進化！' : `💰 還差 ${evolveCost - coins} 金幣`}
            </motion.button>
          </div>
        )}

        {/* Set active */}
        {petData.unlocked && (
          <motion.button
            className={`btn-secondary set-active-btn ${activePet === selected ? 'is-active' : ''}`}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActivePet(selected)}
          >
            {activePet === selected ? '✅ 目前使用中' : `🐾 設為主要寵物`}
          </motion.button>
        )}
      </div>

      {/* Evolution modal */}
      <AnimatePresence>
        {evolveModal && (
          <EvolveModal
            petId={evolveModal.petId}
            newStage={evolveModal.newStage}
            onClose={() => setEvolveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
