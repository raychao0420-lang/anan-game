import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { GACHA_TIERS, pullGacha } from '../data/gacha'
import { sfx } from '../utils/sound'
import './GachaScreen.css'

export default function GachaScreen({ onBack }) {
  const { coins, ownedItems, addCoins, buyItem } = useGameStore()
  const [phase, setPhase]   = useState('pick')
  const [tierId, setTierId] = useState(null)
  const [result, setResult] = useState(null)

  const handlePull = (tid) => {
    const tier = GACHA_TIERS.find(t => t.id === tid)
    if (coins < tier.cost) return
    sfx.click()
    addCoins(-tier.cost)
    setTierId(tid)
    const res = pullGacha(tid, ownedItems)
    setResult(res)
    setPhase('pulling')
    setTimeout(() => { sfx.bossWin(); setPhase('reveal') }, 1800)
  }

  const handleCollect = () => {
    if (!result) return
    if (!result.isDup) {
      buyItem(result.item.id, 0)
    } else {
      addCoins(result.dupBonus)
    }
    sfx.correct()
    setPhase('pick')
    setResult(null)
    setTierId(null)
  }

  const tier = GACHA_TIERS.find(t => t.id === tierId)

  // ── Pick ──────────────────────────────────────────────────────────────────
  if (phase === 'pick') return (
    <div className="gacha-screen">
      <div className="gacha-top-bar">
        <button className="gacha-back-btn" onClick={() => { sfx.click(); onBack() }}>← 返回</button>
        <div className="gacha-coins-badge">💰 {coins}</div>
      </div>

      <motion.div className="gacha-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🎰 扭蛋機
      </motion.div>

      <div className="gacha-tier-list">
        {GACHA_TIERS.map((t, i) => {
          const canAfford = coins >= t.cost
          return (
            <motion.div key={t.id} className="gacha-tier-card"
              style={{ borderColor: t.color, opacity: canAfford ? 1 : 0.5 }}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: canAfford ? 1 : 0.5 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="gacha-egg-icon" style={{ background: t.bg, color: t.color }}>
                {t.egg}
              </div>
              <div className="gacha-tier-info">
                <div className="gacha-tier-name" style={{ color: t.color }}>{t.name}</div>
                <div className="gacha-tier-desc">{t.desc}</div>
                <div className="gacha-tier-dup">重複時退回 {t.dupBonus} 💰</div>
              </div>
              <motion.button
                className="gacha-pull-btn"
                style={{ background: canAfford ? t.color : '#CCC' }}
                disabled={!canAfford}
                whileTap={{ scale: canAfford ? 0.92 : 1 }}
                onClick={() => handlePull(t.id)}
              >
                {t.cost} 💰
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      <p className="gacha-hint">扭蛋內含各種道具、配件、家居裝飾！</p>
    </div>
  )

  // ── Pulling ───────────────────────────────────────────────────────────────
  if (phase === 'pulling') return (
    <div className="gacha-screen gacha-center" style={{ background: tier?.bg }}>
      <motion.div className="gacha-big-egg"
        style={{ background: tier?.color }}
        animate={{
          rotate: [0, -18, 18, -14, 14, -8, 8, 0],
          scale:  [1, 1.15, 1.1, 1.18, 1.1, 1.2, 1.1, 1.25],
        }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      >
        {tier?.egg}
      </motion.div>
      <motion.div className="gacha-pulling-text"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      >
        搖搖搖…
      </motion.div>
    </div>
  )

  // ── Reveal ────────────────────────────────────────────────────────────────
  if (phase === 'reveal' && result) return (
    <div className="gacha-screen gacha-center" style={{ background: tier?.bg }}>
      <AnimatePresence>
        <motion.div className="gacha-reveal-card"
          style={{ borderColor: tier?.color }}
          key="reveal"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <motion.div className="gacha-prize-emoji"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            {result.item.emoji}
          </motion.div>

          <div className="gacha-prize-name" style={{ color: tier?.color }}>
            {result.item.name}
          </div>
          <div className="gacha-prize-desc">{result.item.desc}</div>

          {result.isDup ? (
            <motion.div className="gacha-dup-notice"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
            >
              已擁有！退還 <b style={{ color: '#FF8F00' }}>+{result.dupBonus} 💰</b>
            </motion.div>
          ) : (
            <motion.div className="gacha-new-badge"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
            >
              ✨ 新道具！
            </motion.div>
          )}

          <motion.button className="gacha-collect-btn"
            style={{ background: tier?.color }}
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            onClick={handleCollect}
          >
            收下！
          </motion.button>

          <motion.button className="gacha-back-small"
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => { sfx.click(); onBack() }}
          >
            離開扭蛋機
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  )

  return null
}
