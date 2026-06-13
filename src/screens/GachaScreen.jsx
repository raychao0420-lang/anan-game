import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { GACHA_TIERS, pullGacha } from '../data/gacha'
import { sfx } from '../utils/sound'
import './GachaScreen.css'

// 4-pointed star path around (cx, cy) with outer radius r
function star4(cx, cy, r) {
  return Array.from({ length: 8 }, (_, i) => {
    const angle  = (i * 45 - 90) * Math.PI / 180
    const radius = i % 2 === 0 ? r : r * 0.36
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
  }).join(' ')
}

const TIER_CONFIG = {
  normal: { rayCount: 8,  outerR: 90,  ringR: 98,  sparkleR: 100, sparkleN: 4, sparkleSize: 5, ringSpeed: 11 },
  rare:   { rayCount: 12, outerR: 100, ringR: 107, sparkleR: 109, sparkleN: 6, sparkleSize: 6, ringSpeed: 9  },
  legend: { rayCount: 16, outerR: 110, ringR: 114, sparkleR: 116, sparkleN: 8, sparkleSize: 8, ringSpeed: 7  },
}

function GachaPrize({ item, tierId }) {
  const tier = GACHA_TIERS.find(t => t.id === tierId)
  const color  = tier.color
  const color2 = tierId === 'legend' ? '#FFD54F' : color
  const cfg    = TIER_CONFIG[tierId]
  const W = 240, CX = 120, CY = 120

  const rays = Array.from({ length: cfg.rayCount }, (_, i) => {
    const angle  = (i / cfg.rayCount) * 360
    const rad    = angle * Math.PI / 180
    const isLong = tierId === 'legend' ? i % 2 === 0 : true
    const rOuter = isLong ? cfg.outerR : cfg.outerR * 0.72
    return {
      x1: CX + 50 * Math.cos(rad), y1: CY + 50 * Math.sin(rad),
      x2: CX + rOuter * Math.cos(rad), y2: CY + rOuter * Math.sin(rad),
      sw: isLong ? (tierId === 'legend' ? 3 : 2) : 1.2,
      op: isLong ? 0.65 : 0.35,
      color: i % 2 === 0 ? color : color2,
    }
  })

  const sparkles = Array.from({ length: cfg.sparkleN }, (_, i) => {
    const angle = (i / cfg.sparkleN) * 360 + 22
    const rad   = angle * Math.PI / 180
    const big   = tierId === 'legend' && i % 3 === 0
    return {
      x: CX + cfg.sparkleR * Math.cos(rad),
      y: CY + cfg.sparkleR * Math.sin(rad),
      size:  big ? cfg.sparkleSize + 4 : cfg.sparkleSize,
      delay: i * 0.18,
      color: i % 2 === 0 ? color : color2,
    }
  })

  return (
    <div className="gacha-prize-scene">
      <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`}>
        <defs>
          <radialGradient id={`glow-${tierId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={color} stopOpacity={tierId === 'legend' ? 0.55 : 0.28}/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </radialGradient>
          {tierId === 'legend' && (
            <radialGradient id="legend-inner" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#FFFDE7" stopOpacity="1"/>
              <stop offset="100%" stopColor="#FFF8E1" stopOpacity="1"/>
            </radialGradient>
          )}
        </defs>

        {/* Background glow */}
        <circle cx={CX} cy={CY} r={CX - 4} fill={`url(#glow-${tierId})`}/>

        {/* Rays */}
        {rays.map((r, i) => (
          <line key={i}
            x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={r.color} strokeWidth={r.sw} strokeLinecap="round" opacity={r.op}
          />
        ))}

        {/* Rotating dashed ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: cfg.ringSpeed, ease: 'linear' }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <circle cx={CX} cy={CY} r={cfg.ringR}
            fill="none" stroke={color} strokeWidth="1.8"
            strokeDasharray={tierId === 'legend' ? '14 7' : '9 6'}
            opacity="0.6"
          />
        </motion.g>

        {/* Counter-rotating second ring (legend only) */}
        {tierId === 'legend' && (
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            <circle cx={CX} cy={CY} r={cfg.ringR - 8}
              fill="none" stroke={color2} strokeWidth="1.2"
              strokeDasharray="6 11" opacity="0.4"
            />
          </motion.g>
        )}

        {/* Inner platform circle */}
        <circle cx={CX} cy={CY} r={48}
          fill={tierId === 'legend' ? 'url(#legend-inner)' : 'white'}
          opacity="0.97"
        />
        <circle cx={CX} cy={CY} r={48}
          fill="none" stroke={color} strokeWidth={tierId === 'legend' ? 3.5 : 2.5}
        />
        {tierId === 'legend' && (
          <circle cx={CX} cy={CY} r={53}
            fill="none" stroke={color2} strokeWidth="1.5" opacity="0.45"
          />
        )}

        {/* Sparkle stars */}
        {sparkles.map((sp, i) => (
          <motion.g key={i}
            animate={{ scale: [1, 1.55, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ repeat: Infinity, duration: 1.3 + sp.delay, delay: sp.delay }}
            style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
          >
            <polygon points={star4(sp.x, sp.y, sp.size)} fill={sp.color}/>
          </motion.g>
        ))}
      </svg>

      {/* Prize emoji floating over SVG */}
      <motion.div
        className="gacha-prize-float"
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        {item.emoji}
      </motion.div>
    </div>
  )
}

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
              style={{ borderColor: t.color, opacity: canAfford ? 1 : 0.52 }}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: canAfford ? 1 : 0.52 }}
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
          scale:  [1, 1.15, 1.1, 1.18, 1.1, 1.2, 1.1, 1.28],
        }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      >
        {tier?.egg}
      </motion.div>
      <motion.div className="gacha-pulling-text"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ repeat: Infinity, duration: 0.55 }}
      >
        搖搖搖…
      </motion.div>
    </div>
  )

  // ── Reveal ────────────────────────────────────────────────────────────────
  if (phase === 'reveal' && result) {
    const isLegend = tierId === 'legend'
    return (
      <div className="gacha-screen gacha-center gacha-reveal-bg"
        style={{ background: isLegend
          ? 'linear-gradient(160deg, #FFF9C4, #FFE0B2)'
          : `linear-gradient(160deg, ${tier?.bg}, white)` }}
      >
        <AnimatePresence>
          <motion.div className="gacha-reveal-card"
            style={{ borderColor: tier?.color, borderWidth: isLegend ? 3 : 2 }}
            key="reveal"
            initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          >
            {/* Tier label */}
            <div className="gacha-tier-label" style={{ background: tier?.color }}>
              {tier?.egg} {tier?.name}
            </div>

            {/* SVG prize display */}
            <GachaPrize item={result.item} tierId={tierId} />

            {/* Prize info */}
            <div className="gacha-prize-name" style={{ color: tier?.color, fontSize: isLegend ? '1.9rem' : '1.6rem' }}>
              {result.item.name}
            </div>
            <div className="gacha-prize-desc">{result.item.desc}</div>

            {result.isDup ? (
              <motion.div className="gacha-dup-notice"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
              >
                已擁有！退還 <b style={{ color: '#FF8F00' }}>+{result.dupBonus} 💰</b>
              </motion.div>
            ) : (
              <motion.div className="gacha-new-badge"
                style={{ borderColor: tier?.color, color: tier?.color }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
              >
                ✨ 新道具入手！
              </motion.div>
            )}

            <motion.button className="gacha-collect-btn"
              style={{ background: tier?.color }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleCollect}
            >
              收下！
            </motion.button>

            <motion.button className="gacha-back-small"
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              onClick={() => { sfx.click(); onBack() }}
            >
              離開扭蛋機
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return null
}
