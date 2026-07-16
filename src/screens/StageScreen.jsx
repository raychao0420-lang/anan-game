import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { STAGE_NAMES } from '../data/questions'
import './StageScreen.css'

const CHAPTERS = [
  { label: '加減法',       range: [1,  10], icon: '➕', cat: 'addsub'  },
  { label: '加減進階',     range: [41, 55], icon: '⚡', cat: 'addsub'  },
  { label: '兩位加減進階', range: [71, 80], icon: '💪', cat: 'addsub'  },
  { label: '三位數',       range: [11, 20], icon: '🔢', cat: 'digits3' },
  { label: '乘法',         range: [21, 30], icon: '✖️',  cat: 'muldiv'  },
  { label: '除法',         range: [31, 40], icon: '➗', cat: 'muldiv'  },
  { label: '乘除進階',     range: [86, 95], icon: '🎯', cat: 'muldiv'  },
  { label: '兩位數乘法',   range: [96, 100], icon: '🧮', cat: 'muldiv'  },
  { label: '綜合進階',     range: [56, 70], icon: '🚀', cat: 'mixed'   },
]

const CAT_TABS = [
  { id: 'all',     label: '全部' },
  { id: 'addsub',  label: '➕ 加減' },
  { id: 'muldiv',  label: '✖️ 乘除' },
  { id: 'digits3', label: '🔢 三位數' },
  { id: 'mixed',   label: '🚀 綜合' },
]

// chapter-first-stage → prerequisite stage
const CHAPTER_PREREQS = { 41: 10, 11: 55, 71: 55, 86: 40, 96: 30 }

const CHAPTER_LOCK_HINT = {
  11:  '完成加減進階第55關才能挑戰！',
  56:  '完成加減進階第55關才能解鎖！',
  71:  '完成加減進階第55關才能解鎖！',
  86:  '完成除法第40關才能解鎖！',
  96:  '完成乘法第30關才能解鎖！',
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
  const { stages, coins } = useGameStore()
  const [cat, setCat] = useState('all')

  const isUnlocked = (id) => {
    if (id === 1) return true
    const prereq = CHAPTER_PREREQS[id] ?? id - 1
    return stages[prereq]?.completed
  }

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
                return (
                  <motion.button
                    key={id}
                    className={`stage-btn ${!unlocked ? 'locked' : ''} ${s?.completed ? 'done' : ''}`}
                    whileTap={unlocked ? { scale: 0.9 } : {}}
                    onClick={() => unlocked && onStartStage(id)}
                    disabled={!unlocked}
                  >
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
