import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { sfx } from '../utils/sound'

const TIER_STYLE = {
  normal: { label: '普通', color: '#66BB6A', bg: '#F1F8E9' },
  rare:   { label: '稀有', color: '#42A5F5', bg: '#E3F2FD' },
  legend: { label: '傳說', color: '#FFA726', bg: '#FFF8E1' },
}

const overlay = {
  position: 'fixed', inset: 0, zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.55)', padding: 20,
}
const card = {
  width: '100%', maxWidth: 340, borderRadius: 24, padding: '28px 22px',
  background: '#fff', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
}

export default function LuckyEggModal({ onClose }) {
  const luckyEggs = useGameStore(s => s.luckyEggs)
  const openLuckyEgg = useGameStore(s => s.openLuckyEgg)
  const [phase, setPhase] = useState('idle')   // idle | cracking | reveal
  const [result, setResult] = useState(null)

  const crack = () => {
    if (phase === 'cracking' || luckyEggs <= 0) return
    const r = openLuckyEgg()
    if (!r) return
    setResult(r)
    setPhase('cracking')
    sfx.click()
    setTimeout(() => {
      setPhase('reveal')
      if (r.isDup) sfx.coins()
      else sfx.unlock()
    }, 700)
  }

  const again = () => { setResult(null); setPhase('idle') }
  const tier = result ? TIER_STYLE[result.tier] : TIER_STYLE.normal

  return (
    <motion.div style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        style={card}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#5A4A3F', marginBottom: 4 }}>🥚 幸運蛋</div>
        <div style={{ fontSize: '0.95rem', color: '#9A8A7F', marginBottom: 18 }}>還有 {luckyEggs} 顆</div>

        {phase !== 'reveal' && (
          <motion.button
            onClick={crack}
            disabled={luckyEggs <= 0}
            whileTap={{ scale: 0.9 }}
            style={{ border: 'none', background: 'transparent', cursor: luckyEggs > 0 ? 'pointer' : 'default', padding: 0 }}
            animate={phase === 'cracking'
              ? { rotate: [0, -12, 12, -12, 12, 0], scale: [1, 1.1, 1.1, 1.1, 1.1, 0] }
              : { y: [0, -8, 0] }}
            transition={phase === 'cracking' ? { duration: 0.7 } : { repeat: Infinity, duration: 1.4 }}
          >
            <span style={{ fontSize: '5.5rem', filter: luckyEggs > 0 ? 'none' : 'grayscale(1) opacity(0.5)' }}>🥚</span>
          </motion.button>
        )}

        {phase === 'idle' && (
          <div style={{ marginTop: 14, fontSize: '0.95rem', color: '#7A6A5F' }}>
            {luckyEggs > 0 ? '點一下敲開它！' : '答題、每天登入就能拿到幸運蛋喔～'}
          </div>
        )}

        <AnimatePresence>
          {phase === 'reveal' && result && (
            <motion.div
              key="reveal"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
            >
              <div style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: tier.bg, border: `3px solid ${tier.color}`, borderRadius: 20, padding: '18px 26px',
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: tier.color }}>{tier.label}</span>
                <span style={{ fontSize: '4rem' }}>{result.item.emoji}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#5A4A3F' }}>{result.item.name}</span>
              </div>
              <div style={{ marginTop: 12, fontSize: '0.95rem', color: '#7A6A5F', minHeight: 22 }}>
                {result.isDup ? `已經有了～換 ${result.dupBonus} 金幣 💰` : '新收藏入手！🎉'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {phase === 'reveal' && luckyEggs > 0 && (
            <motion.button className="btn-primary" style={{ flex: 1 }} whileTap={{ scale: 0.94 }} onClick={again}>
              再開一顆 🥚
            </motion.button>
          )}
          <motion.button className="btn-secondary" style={{ flex: 1 }} whileTap={{ scale: 0.94 }} onClick={onClose}>
            {phase === 'reveal' ? '收起來' : '關閉'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
