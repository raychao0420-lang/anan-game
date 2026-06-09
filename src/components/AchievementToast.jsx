import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { ACHIEVEMENTS } from '../data/achievements'
import { sfx } from '../utils/sound'
import './AchievementToast.css'

export default function AchievementToast() {
  const { pendingAchievement, clearPendingAchievement } = useGameStore()
  const achieve = pendingAchievement
    ? ACHIEVEMENTS.find(a => a.id === pendingAchievement)
    : null

  useEffect(() => {
    if (!achieve) return
    sfx.achieve()
    const timer = setTimeout(clearPendingAchievement, 3500)
    return () => clearTimeout(timer)
  }, [achieve, clearPendingAchievement])

  return (
    <AnimatePresence>
      {achieve && (
        <motion.div
          className="achieve-toast"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={clearPendingAchievement}
        >
          <span className="achieve-toast-icon">{achieve.icon}</span>
          <div className="achieve-toast-text">
            <div className="achieve-toast-title">成就解鎖！</div>
            <div className="achieve-toast-label">{achieve.label}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
