import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { generateStageQuestions, STAGE_NAMES } from '../data/questions'
import { PETS } from '../data/pets'
import NumberPad from '../components/NumberPad'
import { sfx } from '../utils/sound'
import './GameScreen.css'

const TIME_LIMIT = 20
const QUESTIONS_PER_STAGE = 10

export default function GameScreen({ stageId, onFinish }) {
  const { activePet, pets, updateDailyProgress, updateMaxCombo, updateTotalCoins } = useGameStore()
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]

  const [questions] = useState(() => generateStageQuestions(stageId))
  const [qIndex, setQIndex] = useState(0)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [combo, setCombo] = useState(0)
  const [totalCoins, setTotalCoins] = useState(0)
  const [results, setResults] = useState([]) // { correct, coins, time }
  const [mood, setMood] = useState('idle')
  const [feedback, setFeedback] = useState(null) // { correct, points }
  const timerRef = useRef(null)
  const feedbackRef = useRef(null)
  const comboRef = useRef(0)

  const currentQ = questions[qIndex]
  const isLast = qIndex >= QUESTIONS_PER_STAGE - 1

  const showFeedback = (correct, points) => {
    clearTimeout(feedbackRef.current)
    setFeedback({ correct, points })
    feedbackRef.current = setTimeout(() => setFeedback(null), 800)
  }

  const nextQuestion = useCallback((result) => {
    setResults(prev => [...prev, result])
    if (qIndex < QUESTIONS_PER_STAGE - 1) {
      setQIndex(i => i + 1)
      setInput('')
      setTimeLeft(TIME_LIMIT)
      setMood('idle')
    } else {
      // finish — let App handle with all results + current
      setQIndex(QUESTIONS_PER_STAGE) // signals done
    }
  }, [qIndex])

  // Timer
  useEffect(() => {
    if (qIndex >= QUESTIONS_PER_STAGE) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setMood('sad')
          showFeedback(false, 0)
          setCombo(0)
          sfx.wrong()
          nextQuestion({ correct: false, coins: 0, time: TIME_LIMIT })
          return TIME_LIMIT
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [qIndex, nextQuestion])

  // Navigate to result when done
  useEffect(() => {
    if (qIndex >= QUESTIONS_PER_STAGE && results.length === QUESTIONS_PER_STAGE) {
      onFinish(stageId, results)
    }
  }, [qIndex, results, stageId, onFinish])

  const handleConfirm = useCallback(() => {
    if (!input) return
    clearInterval(timerRef.current)
    const correct = parseInt(input) === currentQ.answer
    const timeTaken = TIME_LIMIT - timeLeft
    const speedBonus = timeTaken <= 5 ? 5 : 0
    const newCombo = correct ? combo + 1 : 0
    const baseCoins = correct ? 10 : 0
    const comboBonus = correct && newCombo >= 3 ? Math.floor(baseCoins * 0.5) : 0
    const earned = baseCoins + speedBonus + comboBonus

    setCombo(newCombo)
    comboRef.current = newCombo
    setTotalCoins(c => c + earned)
    setMood(correct ? 'happy' : 'sad')
    showFeedback(correct, earned)
    if (correct) {
      if (newCombo >= 3) sfx.combo(newCombo)
      else sfx.correct()
    } else {
      sfx.wrong()
    }
    if (correct) updateDailyProgress('correct', 1)
    if (earned > 0) updateDailyProgress('coins', earned)
    if (newCombo >= 5) updateDailyProgress('combo5', 1)
    updateMaxCombo(newCombo)

    setTimeout(() => {
      nextQuestion({ correct, coins: earned, time: timeTaken })
    }, 600)
  }, [input, currentQ, timeLeft, combo, nextQuestion])

  if (qIndex >= QUESTIONS_PER_STAGE) return null

  const timerPct = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 8 ? '#6BCB77' : timeLeft > 4 ? '#FFB347' : '#FF6B6B'

  return (
    <div className="game-screen">
      {/* Header */}
      <div className="game-header">
        <div className="game-info">
          <span className="game-stage-label">{STAGE_NAMES[stageId] || `關卡${stageId}`}</span>
          <span className="game-qcount">{qIndex + 1} / {QUESTIONS_PER_STAGE}</span>
        </div>
        <div className="game-meta">
          {combo >= 2 && <span className="game-combo">🔥 ×{combo}</span>}
          <span className="game-coins">💰 {totalCoins}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="timer-bar-bg">
        <motion.div
          className="timer-bar-fill"
          style={{ background: timerColor }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      {/* Pet */}
      <div className="game-pet-area">
        <motion.div
          className="game-pet-bubble"
          style={{ background: petStage.bg, border: `2px solid ${petStage.border}` }}
          animate={mood === 'happy' ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }
            : mood === 'sad' ? { x: [0, -8, 8, -8, 0] }
            : { y: [0, -5, 0] }}
          transition={mood === 'idle'
            ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            : { duration: 0.4 }}
        >
          <span style={{ fontSize: '3rem' }}>{petStage.emoji}</span>
        </motion.div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              className={`feedback-badge ${feedback.correct ? 'correct' : 'wrong'}`}
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: 1, y: -20 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {feedback.correct ? `+${feedback.points} 💰` : '再試試！'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <motion.div
        key={qIndex}
        className="question-card"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="question-text">{currentQ.display} = ?</span>
      </motion.div>

      {/* Number pad */}
      <div className="game-numpad">
        <NumberPad value={input} onChange={setInput} onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
