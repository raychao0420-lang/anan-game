import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { ACHIEVEMENTS } from '../data/achievements'
import './AchievementScreen.css'

export default function AchievementScreen({ onNavigate }) {
  const { coins, achievements } = useGameStore()
  const unlockedCount = ACHIEVEMENTS.filter(a => achievements[a.id]).length

  return (
    <div className="achieve-screen">
      <div className="achieve-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="achieve-title">🏆 成就</span>
        <span className="achieve-coins">💰 {coins}</span>
      </div>

      <div className="achieve-progress">
        <span className="achieve-count">{unlockedCount} / {ACHIEVEMENTS.length}</span>
        <div className="achieve-bar">
          <motion.div
            className="achieve-bar-fill"
            animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="achieve-list">
        {ACHIEVEMENTS.map((a, i) => {
          const unlocked = !!achievements[a.id]
          return (
            <motion.div
              key={a.id}
              className={`achieve-item ${unlocked ? 'unlocked' : 'locked'}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="achieve-icon">{unlocked ? a.icon : '🔒'}</div>
              <div className="achieve-info">
                <div className="achieve-label">{unlocked ? a.label : '???'}</div>
                <div className="achieve-desc">{unlocked ? a.desc : '繼續遊戲來解鎖'}</div>
              </div>
              {unlocked && <div className="achieve-badge">✅</div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
