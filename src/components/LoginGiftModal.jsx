import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { sfx } from '../utils/sound'

const overlay = {
  position: 'fixed', inset: 0, zIndex: 55,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.55)', padding: 20,
}
const card = {
  width: '100%', maxWidth: 330, borderRadius: 24, padding: '26px 22px',
  background: 'linear-gradient(160deg, #FFF7E6, #FFE9C7)', textAlign: 'center',
  boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
}

export default function LoginGiftModal({ onOpenEggs }) {
  const gift = useGameStore(s => s.pendingLoginGift)
  const clearLoginGift = useGameStore(s => s.clearLoginGift)
  if (!gift) return null

  const { coins, eggs, streak, milestone } = gift
  const close = () => { sfx.click(); clearLoginGift() }
  const openEggs = () => { clearLoginGift(); onOpenEggs?.() }

  return (
    <motion.div style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        style={card}
        initial={{ scale: 0.6, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        <motion.div
          style={{ fontSize: '3.4rem' }}
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8 }}
        >
          🎁
        </motion.div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#7A5A2F', margin: '6px 0 2px' }}>
          每日登入禮物
        </div>
        <div style={{ fontSize: '0.95rem', color: '#A6864F', marginBottom: 16 }}>
          🔥 連續登入 {streak} 天{milestone ? ` · ${milestone} 天大禮包！` : ''}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '12px 18px', minWidth: 84 }}>
            <div style={{ fontSize: '2rem' }}>💰</div>
            <div style={{ fontWeight: 800, color: '#5A4A3F' }}>+{coins}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '12px 18px', minWidth: 84 }}>
            <div style={{ fontSize: '2rem' }}>🥚</div>
            <div style={{ fontWeight: 800, color: '#5A4A3F' }}>×{eggs}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button className="btn-primary" style={{ flex: 1 }} whileTap={{ scale: 0.94 }} onClick={openEggs}>
            去敲蛋 🥚
          </motion.button>
          <motion.button className="btn-secondary" style={{ flex: 1 }} whileTap={{ scale: 0.94 }} onClick={close}>
            收下 🎉
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
