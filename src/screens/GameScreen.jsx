import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { generateStageQuestions, STAGE_NAMES } from '../data/questions'
import { PETS } from '../data/pets'
import NumberPad from '../components/NumberPad'
import { sfx } from '../utils/sound'
import './GameScreen.css'

// ── Floating hearts on correct answer ─────────────────────────────────────────
function FloatingHearts({ trigger, count }) {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    if (!trigger) return
    const n = Math.min(count, 5)
    setHearts(Array.from({ length: n }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 70,
      delay: i * 0.08,
    })))
    const t = setTimeout(() => setHearts([]), 1000)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className="floating-hearts">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="floating-heart"
            style={{ left: `calc(50% + ${h.x}px)` }}
            initial={{ y: 0, opacity: 1, scale: 0.6 }}
            animate={{ y: -65, opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: h.delay }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

const QUESTIONS_PER_STAGE = 10
const getTimeLimit = (id) => {
  if (id >= 11 && id <= 20) return 30               // 3位數
  if (id <= 10 || (id >= 41 && id <= 55)) return 35 // 2位數
  return 20                                          // 乘除法
}

// ── Vertical question display ──────────────────────────────────────────────────
function VerticalQuestion({ q }) {
  const { num1, num2, operator } = q
  const s1 = String(num1)
  const s2 = String(num2)
  const sp = ' '
  const w  = Math.max(s1.length, 1 + s2.length)

  return (
    <div className="vq">
      <div>{sp.repeat(w - s1.length)}{s1}</div>
      <div><span className="vq-op">{operator}</span>{sp.repeat(w - 1 - s2.length)}{s2}</div>
      <div className="vq-line" />
      <div className="vq-ans">{sp.repeat(w - 1)}？</div>
    </div>
  )
}

// ── Scratch pad (doodle canvas) ────────────────────────────────────────────────
function DoodleCanvas() {
  const canvasRef  = useRef(null)
  const drawingRef = useRef(false)
  const lastRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const init = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width) return
      const dpr = window.devicePixelRatio || 1
      canvas.width  = Math.round(rect.width  * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      ctx.strokeStyle = '#444'
      ctx.lineWidth   = 2.5
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
    }
    const obs = new ResizeObserver(init)
    obs.observe(canvas)
    return () => obs.disconnect()
  }, [])

  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const src  = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  const onStart = (e) => {
    e.preventDefault()
    drawingRef.current = true
    lastRef.current    = getXY(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.arc(lastRef.current.x, lastRef.current.y, 1, 0, Math.PI * 2)
    ctx.fillStyle = '#444'
    ctx.fill()
  }

  const onMove = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const pos = getXY(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(lastRef.current.x, lastRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastRef.current = pos
  }

  const onEnd = () => { drawingRef.current = false; lastRef.current = null }

  const clear = () => {
    const c = canvasRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
  }

  return (
    <div className="doodle-area">
      <div className="doodle-topbar">
        <span className="doodle-label">✏️ 算草紙</span>
        <button className="doodle-clear-btn" onClick={clear} title="清除">🗑️</button>
      </div>
      <canvas
        ref={canvasRef}
        className="doodle-canvas"
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      />
    </div>
  )
}

export default function GameScreen({ stageId, onFinish, onExit }) {
  const { activePet, pets, updateDailyProgress, updateMaxCombo, updateTotalCoins, updatePetMood } = useGameStore()
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]

  const TIME_LIMIT = getTimeLimit(stageId)

  const [questions] = useState(() => generateStageQuestions(stageId))
  const [qIndex, setQIndex] = useState(0)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [combo, setCombo] = useState(0)
  const [totalCoins, setTotalCoins] = useState(0)
  const [results, setResults] = useState([]) // { correct, coins, time }
  const [mood, setMood] = useState('idle')
  const [feedback, setFeedback] = useState(null) // { correct, points }
  const [paused, setPaused] = useState(false)
  const [heartTrigger, setHeartTrigger] = useState(0)
  const timerRef = useRef(null)
  const feedbackRef = useRef(null)
  const comboRef = useRef(0)
  const pausedRef = useRef(false)

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

  const handlePause = () => { pausedRef.current = true; setPaused(true) }
  const handleResume = () => { pausedRef.current = false; setPaused(false) }
  const handleExit = () => { if (onExit) onExit() }

  // Timer
  useEffect(() => {
    if (qIndex >= QUESTIONS_PER_STAGE) return
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setMood('sad')
          showFeedback(false, 0)
          setCombo(0)
          sfx.wrong()
          updatePetMood(activePet, 1)
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
      updatePetMood(activePet, 4)
      setHeartTrigger(n => n + 1)
    } else {
      sfx.wrong()
      updatePetMood(activePet, 1)
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

  const heartCount = combo >= 5 ? 3 : combo >= 2 ? 2 : 1

  return (
    <div className="game-screen">
      {/* Pause overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            className="pause-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="pause-panel"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="pause-title">⏸️ 暫停中</div>
              <motion.button className="btn-primary pause-btn" whileTap={{ scale: 0.94 }} onClick={handleResume}>
                ▶️ 繼續
              </motion.button>
              <motion.button className="btn-secondary pause-btn" whileTap={{ scale: 0.94 }} onClick={handleExit}>
                🚪 離開
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="game-header">
        <div className="game-info">
          <span className="game-stage-label">{STAGE_NAMES[stageId] || `關卡${stageId}`}</span>
          <span className="game-qcount">{qIndex + 1} / {QUESTIONS_PER_STAGE}</span>
        </div>
        <div className="game-meta">
          {combo >= 2 && <span className="game-combo">🔥 ×{combo}</span>}
          <span className="game-coins">💰 {totalCoins}</span>
          <motion.button className="pause-icon-btn" whileTap={{ scale: 0.85 }} onClick={handlePause}>
            ⏸
          </motion.button>
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
        <FloatingHearts trigger={heartTrigger} count={heartCount} />
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

      {/* Question (vertical) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          className="question-card"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <VerticalQuestion q={currentQ} />
        </motion.div>
      </AnimatePresence>

      {/* Scratch pad – key clears canvas on each new question */}
      <DoodleCanvas key={qIndex} />

      {/* Number pad */}
      <div className="game-numpad">
        <NumberPad value={input} onChange={setInput} onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
