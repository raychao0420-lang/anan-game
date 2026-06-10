import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { STAGE_NAMES } from '../data/questions'
import { sfx } from '../utils/sound'
import './ResultScreen.css'

function calcStars(correctCount) {
  if (correctCount >= 9) return 3
  if (correctCount >= 7) return 2
  if (correctCount >= 5) return 1
  return 0
}

export default function ResultScreen({ stageId, results, onRetry, onNext, onHome, onBoss }) {
  const { completeStage, addCoins, activePet, pets, bossCleared, updateDailyProgress } = useGameStore()
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]

  const correctCount = results.filter(r => r.correct).length
  const totalCoins = results.reduce((sum, r) => sum + r.coins, 0)
  const stars = calcStars(correctCount)

  const savedData = useGameStore(s => s.stages[stageId])
  const isReplay = savedData?.completed
  const replayCoins = Math.floor(totalCoins / 4)
  const displayCoins = isReplay ? replayCoins : totalCoins

  useEffect(() => {
    if (!isReplay) {
      completeStage(stageId, stars, totalCoins)
      updateDailyProgress('stages', 1)
      if (stars === 3) updateDailyProgress('stars3', 1)
    } else if (replayCoins > 0) {
      addCoins(replayCoins)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t1 = setTimeout(() => {
      for (let i = 1; i <= stars; i++) {
        setTimeout(() => sfx.star(i), (i - 1) * 200)
      }
    }, 500)
    const t2 = setTimeout(() => { if (displayCoins > 0) sfx.coins() }, 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isBossStage = stageId % 10 === 0 && [10, 20, 30, 40].includes(stageId)
  const bossClearedThis = bossCleared[stageId]

  const messages = [
    ['再試一次加油！', '😅'],
    ['做得不錯！', '😊'],
    ['好厲害！', '🎉'],
    ['完美通關！太強了！', '🏆'],
  ]
  const [msg, icon] = messages[stars]

  return (
    <div className="result-screen">
      <motion.div
        className="result-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="result-title">{icon} {msg}</div>
        <div className="result-stage">{STAGE_NAMES[stageId] || `關卡 ${stageId}`}</div>

        {/* Stars */}
        <div className="result-stars">
          {[1,2,3].map(i => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: i <= stars ? 1 : 0.4 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
              style={{ opacity: i <= stars ? 1 : 0.2, fontSize: '2.4rem' }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Pet celebrate */}
        <motion.div
          className="result-pet"
          style={{ background: petStage.bg, border: `3px solid ${petStage.border}` }}
          animate={stars >= 2
            ? { scale: [1, 1.2, 1, 1.2, 1], rotate: [0, 15, -15, 10, 0] }
            : { x: [0, -6, 6, 0] }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span style={{ fontSize: '3.2rem' }}>{petStage.emoji}</span>
        </motion.div>

        {/* Score */}
        <div className="result-score">
          <div className="result-row">
            <span>答對題數</span>
            <span className="result-val">{correctCount} / {results.length}</span>
          </div>
          <div className="result-row">
            <span>獲得金幣{isReplay && <span className="replay-badge">重複挑戰 ×¼</span>}</span>
            <span className="result-val coins">+{displayCoins} 💰</span>
          </div>
        </div>

        {/* Boss button */}
        {isBossStage && (
          <motion.button
            className={`btn-boss ${bossClearedThis ? 'cleared' : ''}`}
            whileTap={{ scale: 0.94 }}
            onClick={onBoss}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
          >
            {bossClearedThis ? '⚔️ 再戰Boss' : '⚔️ 挑戰Boss！'}
          </motion.button>
        )}

        {/* Buttons */}
        <div className="result-buttons">
          <motion.button className="btn-secondary" whileTap={{ scale: 0.92 }} onClick={onRetry}>
            🔄 再挑戰
          </motion.button>
          {stageId < 40 && (
            <motion.button className="btn-primary" whileTap={{ scale: 0.92 }} onClick={onNext}>
              下一關 →
            </motion.button>
          )}
        </div>

        <motion.button
          className="btn-home"
          whileTap={{ scale: 0.92 }}
          onClick={onHome}
        >
          🏠 回首頁
        </motion.button>
      </motion.div>
    </div>
  )
}
