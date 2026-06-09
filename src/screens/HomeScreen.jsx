import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { getTodayTasks } from '../data/dailyTasks'
import MuteButton from '../components/MuteButton'
import SaveModal from '../components/SaveModal'
import PetAvatar from '../components/PetAvatar'
import { sfx } from '../utils/sound'
import './HomeScreen.css'

export default function HomeScreen({ onNavigate }) {
  const { coins, activePet, pets, petEquipment, dailyTasksDone, achievements } = useGameStore()
  const [showSave, setShowSave] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const todayTasks = getTodayTasks(today)
  const dailyDoneCount = todayTasks.filter(t => dailyTasksDone.includes(t.id)).length
  const dailyAllDone = dailyDoneCount >= 3
  const achieveCount = Object.keys(achievements).length
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const stage = pet.stages[petData.evolutionStage]
  const equipped = (petEquipment[activePet] || []).map((id) => SHOP_ITEMS.find((i) => i.id === id)).filter(Boolean)

  const nav = (dest) => { sfx.click(); onNavigate(dest) }

  return (
    <div className="home-screen">
      <div className="home-title">
        <span>安安</span>
        <span className="home-title-sub">數學大冒險</span>
        <MuteButton className="home-mute" />
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
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <PetAvatar
            petId={activePet}
            evolutionStage={petData.evolutionStage}
            equipped={equipped}
            size={130}
          />
        </motion.div>
        <div className="home-pet-name">{pet.name} · {stage.label}</div>
      </motion.div>

      <div className="home-buttons">
        <motion.button
          className="btn-primary btn-lg"
          whileTap={{ scale: 0.94 }}
          onClick={() => nav('stages')}
        >
          🎮 開始闖關
        </motion.button>

        <div className="home-row">
          <motion.button
            className="btn-secondary"
            whileTap={{ scale: 0.94 }}
            onClick={() => nav('pets')}
          >
            🐾 我的寵物
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileTap={{ scale: 0.94 }}
            onClick={() => nav('shop')}
          >
            🛍️ 商店
          </motion.button>
        </div>

        <motion.button
          className="btn-home-room"
          whileTap={{ scale: 0.94 }}
          onClick={() => nav('homeroom')}
        >
          🏠 我的家
        </motion.button>

        <div className="home-row">
          <motion.button
            className="btn-secondary home-daily-btn"
            whileTap={{ scale: 0.94 }}
            onClick={() => nav('daily')}
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
            onClick={() => nav('achievements')}
          >
            🏆 成就
            {achieveCount > 0 && (
              <span className="home-badge achieve">{achieveCount}</span>
            )}
          </motion.button>
        </div>

        <motion.button
          className="btn-cloud"
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowSave(true)}
        >
          ☁️ 雲端存檔
        </motion.button>
      </div>

      <AnimatePresence>
        {showSave && <SaveModal onClose={() => setShowSave(false)} />}
      </AnimatePresence>
    </div>
  )
}
