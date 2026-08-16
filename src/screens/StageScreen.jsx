import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { STAGE_NAMES } from '../data/questions'
import { CHAPTERS, isStageUnlocked } from '../data/stages'
import './StageScreen.css'

const CAT_TABS = [
  { id: 'all',     label: '全部' },
  { id: 'addsub',  label: '➕ 加減' },
  { id: 'muldiv',  label: '✖️ 乘除' },
  { id: 'digits3', label: '🔢 三位數' },
  { id: 'mixed',   label: '🚀 綜合' },
]

const CHAPTER_LOCK_HINT = {
  11:  '完成加減進階第55關才能挑戰！',
  56:  '完成加減進階第55關才能解鎖！',
  71:  '完成加減進階第55關才能解鎖！',
  86:  '完成除法第40關才能解鎖！',
  96:  '完成乘法第30關才能解鎖！',
  101: '完成乘法第30關才能解鎖！',
  111: '完成除法第40關才能解鎖！',
  116: '完成三位數第20關才能解鎖！',
}

function Stars({ count }) {
  return (
    <span className="stage-stars">
      {[1,2,3].map(i => (
        <span key={i} style={{ opacity: i <= count ? 1 : 0.2 }}>⭐</span>
      ))}
    </span>
  )
}

export default function StageScreen({ onNavigate, onStartStage }) {
  const { stages, coins, challengeStage, challengeDone } = useGameStore()
  const [cat, setCat] = useState('all')

  const isUnlocked = (id) => isStageUnlocked(stages, id)

  const visibleChapters = cat === 'all' ? CHAPTERS : CHAPTERS.filter(c => c.cat === cat)

  return (
    <div className="stage-screen">
      <div className="stage-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="stage-coins">💰 {coins}</span>
      </div>

      {/* Category filter tabs */}
      <div className="stage-cat-tabs">
        {CAT_TABS.map(t => (
          <button
            key={t.id}
            className={`stage-cat-tab ${cat === t.id ? 'active' : ''}`}
            onClick={() => setCat(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="stage-chapters">
        {visibleChapters.map(({ label, range, icon }) => {
          const chapterLocked = !isUnlocked(range[0])
          const hint = CHAPTER_LOCK_HINT[range[0]]
          return (
          <div key={label} className="chapter-section">
            <div className="chapter-title">{icon} {label}
              {chapterLocked && hint && <span className="chapter-lock-hint">{hint}</span>}
            </div>
            <div className="stage-grid">
              {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => {
                const id = range[0] + i
                const unlocked = isUnlocked(id)
                const s = stages[id]
                const isChallenge = id === challengeStage && !challengeDone
                return (
                  <motion.button
                    key={id}
                    className={`stage-btn ${!unlocked ? 'locked' : ''} ${s?.completed ? 'done' : ''} ${isChallenge ? 'challenge' : ''}`}
                    whileTap={unlocked ? { scale: 0.9 } : {}}
                    onClick={() => unlocked && onStartStage(id)}
                    disabled={!unlocked}
                  >
                    {isChallenge && <span className="stage-challenge-tag">✨×2</span>}
                    <span className="stage-num">{id}</span>
                    {unlocked ? (
                      s?.completed
                        ? <Stars count={s.stars} />
                        : <span className="stage-name">{STAGE_NAMES[id] || `關卡${id}`}</span>
                    ) : (
                      <span className="stage-lock">🔒</span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
