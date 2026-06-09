import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS, PET_ORDER, EVOLVE_EXP } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import PetAvatar from '../components/PetAvatar'
import EvolveModal from '../components/EvolveModal'
import { sfx } from '../utils/sound'
import './PetScreen.css'

const FOOD_ITEMS = SHOP_ITEMS.filter(i => i.category === 'food')

export default function PetScreen({ onNavigate }) {
  const { coins, pets, activePet, evolvePetFood, unlockPet, setActivePet, petEquipment } = useGameStore()
  const [selected, setSelected] = useState(activePet)
  const [evolveModal, setEvolveModal] = useState(null)

  const petData = pets[selected]
  const petDef = PETS[selected]
  const stage = petDef.stages[petData.evolutionStage]
  const nextStage = petDef.stages[petData.evolutionStage + 1]
  const maxEvolved = petData.evolutionStage >= 4

  const foodExp = petData.foodExp || 0
  const expThreshold = EVOLVE_EXP[petData.evolutionStage] || 0
  const expPct = maxEvolved ? 100 : Math.min(100, (foodExp / expThreshold) * 100)
  const canEvolve = petData.unlocked && !maxEvolved && foodExp >= expThreshold

  const equipped = (petEquipment[selected] || []).map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)

  const handleEvolve = () => {
    if (!canEvolve) return
    evolvePetFood(selected)
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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={petData.unlocked ? { scale: 1, opacity: 1, y: [0, -10, 0] } : { scale: 1, opacity: 1 }}
          transition={petData.unlocked
            ? { scale: { type: 'spring', stiffness: 250 }, y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }
            : { type: 'spring', stiffness: 250 }}
        >
          {petData.unlocked
            ? <PetAvatar petId={selected} evolutionStage={petData.evolutionStage} equipped={equipped} size={150} />
            : <div className="pet-locked-bubble">🔒</div>
          }
        </motion.div>

        <div className="pet-info">
          <div className="pet-info-name">{petDef.name}</div>
          <div className="pet-info-breed">{petDef.breed} · {petDef.personality}</div>
          {petData.unlocked && (
            <div className="pet-info-stage">{stage.label}</div>
          )}
        </div>

        {/* Evolution stage dots */}
        {petData.unlocked && (
          <div className="evo-track">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`evo-dot ${s <= petData.evolutionStage ? 'filled' : ''}`}>
                <span>{petDef.stages[s].emoji}</span>
              </div>
            ))}
          </div>
        )}

        {/* Exp bar */}
        {petData.unlocked && !maxEvolved && (
          <div className="pet-exp-wrap">
            <div className="pet-exp-label">
              <span>🍖 進化經驗</span>
              <span className="pet-exp-num">{foodExp} / {expThreshold}</span>
            </div>
            <div className="pet-exp-bar-bg">
              <motion.div
                className="pet-exp-bar"
                animate={{ width: `${expPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            {/* Food preference hints */}
            <div className="pet-food-hints">
              {FOOD_ITEMS.map(f => (
                <span key={f.id} className="pet-food-hint-chip">
                  {f.emoji} <b>+{f.exp[selected]}</b>
                </span>
              ))}
            </div>
            <div className="pet-food-goto" onClick={() => onNavigate('shop')}>
              去商店餵食 →
            </div>
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
        ) : canEvolve ? (
          <div className="pet-evolve-area">
            <div className="pet-evolve-preview">
              <span>下一階段：</span>
              <span style={{ fontSize: '1.4rem' }}>{nextStage?.emoji}</span>
              <span className="pet-evolve-label">{nextStage?.label}</span>
            </div>
            <motion.button
              className="btn-primary evolve-btn"
              whileTap={{ scale: 0.94 }}
              onClick={handleEvolve}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              ✨ 進化！
            </motion.button>
          </div>
        ) : (
          <div className="pet-feed-hint">
            <span>繼續餵食來積累進化經驗吧！</span>
            <motion.button
              className="btn-secondary"
              whileTap={{ scale: 0.94 }}
              onClick={() => onNavigate('shop')}
            >
              🛍️ 去商店餵食
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
