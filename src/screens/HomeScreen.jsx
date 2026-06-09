import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { getTodayTasks } from '../data/dailyTasks'
import './HomeScreen.css'

export default function HomeScreen({ onNavigate }) {
  const { coins, activePet, pets, equippedItems, dailyTasksDone, achievements } = useGameStore()
  const today = new Date().toISOString().slice(0, 10)
  const todayTasks = getTodayTasks(today)
  const dailyDoneCount = todayTasks.filter(t => dailyTasksDone.includes(t.id)).length
  const dailyAllDone = dailyDoneCount >= 3
  const achieveCount = Object.keys(achievements).length
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const stage = pet.stages[petData.evolutionStage]
  const equipped = equippedItems.map((id) => SHOP_ITEMS.find((i) => i.id === id)).filter(Boolean)

  return (
    <div className="home-screen">
      <div className="home-title">
        <span>安安</span>
        <span className="home-title-sub">數學大冒險</span>
      </div>

      <div className="home-coins">
        💰 {coins} 金幣
      </div>

      <motion.div
        className="home-pet-area"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="home-pet-bubble"
          style={{ background: stage.bg, border: `3px solid ${stage.border}` }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <span style={{ fontSize: stage.size }}>{stage.emoji}</span>
        </motion.div>
        {equipped.length > 0 && (
          <div className="home-equipped-row">
            {equipped.map((item) => (
              <span key={item.id} className="home-equipped-badge">{item.emoji}</span>
            ))}
          </div>
        )}
        <div className="home-pet-name">{pet.name} · {stage.label}</div>
      </motion.div>

      <div className="home-buttons">
        <motion.button
          className="btn-primary btn-lg"
          whileTap={{ scale: 0.94 }}
          onClick={() => onNavigate('stages')}
        >
          🎮 開始闖關
        </motion.button>

        <div className="home-row">
          <motion.button
            className="btn-secondary"
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate('pets')}
          >
            🐾 我的寵物
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate('shop')}
          >
            🛍️ 商店
          </motion.button>
        </div>

        <div className="home-row">
          <motion.button
            className="btn-secondary home-daily-btn"
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate('daily')}
          >
            📋 每日任務
            {!dailyAllDone && (
              <span className="home-badge">{dailyDoneCount}/3</span>
            )}
            {dailyAllDone && <span className="home-badge done">✓</span>}
          </motion.button>
          <motion.button
            className="btn-secondary home-achieve-btn"
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate('achievements')}
          >
            🏆 成就
            {achieveCount > 0 && (
              <span className="home-badge achieve">{achieveCount}</span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
