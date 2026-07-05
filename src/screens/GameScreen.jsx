import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { generateStageQuestions, STAGE_NAMES } from '../data/questions'
import { PETS, ENERGY_PER_QUESTION, SKILL_COST } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import PetSkillButton from '../components/PetSkillButton'
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
// 除法關卡（含綜合進階裡的純除法）給多一點作答時間
const DIVISION_STAGES = new Set([31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 59, 60, 67, 91, 92])
const getTimeLimit = (id) => {
  if (id >= 11 && id <= 20) return 30               // 3位數
  if (id <= 10 || (id >= 41 && id <= 55)) return 35 // 2位數
  if (DIVISION_STAGES.has(id)) return 30            // 除法
  return 20                                          // 乘法等
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
  const { activePet, pets, petEquipment, petEnergy, gainEnergy, spendEnergy, updateDailyProgress, updateMaxCombo, updateTotalCoins, updatePetMood } = useGameStore()
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]
  const equipped = (petEquipment[activePet] || []).map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)

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
  // ── 寵物技能（只作用在當下這一題）──
  const [skillUsedThisQ, setSkillUsedThisQ] = useState(false) // 一題只能發動一次
  const [coinBoost, setCoinBoost] = useState(null)            // { mult?, add? } 當題答對金幣加碼
  const [skillFlash, setSkillFlash] = useState(null)          // 發動技能時的提示文字
  const shieldRef = useRef(false)                             // 當題護盾：答錯/逾時不斷連段
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
    // 技能效果只作用於當題，換題全部歸零
    setSkillUsedThisQ(false)
    setCoinBoost(null)
    shieldRef.current = false
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

  // 手動發動出戰寵物的技能，只作用在當下這一題。能量不足或本題已用則不動作。
  const activateSkill = (skill) => {
    if (skillUsedThisQ) return
    if (!spendEnergy(activePet, SKILL_COST)) return
    setSkillUsedThisQ(true)
    const eff = skill.effect
    if (eff.type === 'time') {
      setTimeLeft(t => t + eff.value)
    } else if (eff.type === 'coin') {
      setCoinBoost({ mult: eff.mult, add: eff.add })
    } else if (eff.type === 'shield') {
      shieldRef.current = true
    }
    sfx.pet(activePet)
    setSkillFlash(`${skill.icon} ${skill.name}！`)
    setTimeout(() => setSkillFlash(null), 900)
  }

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
          // 護盾：逾時不斷連段
          if (!shieldRef.current) setCombo(0)
          sfx.wrong()
          updatePetMood(activePet, 1)
          gainEnergy(activePet, ENERGY_PER_QUESTION) // 答題回復能量
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
    const timeTaken = Math.max(0, TIME_LIMIT - timeLeft) // 加時技能可能讓 timeLeft > 上限
    const speedBonus = timeTaken <= 5 ? 5 : 0
    const shielded = !correct && shieldRef.current        // 護盾：答錯不斷連段
    const newCombo = correct ? combo + 1 : (shielded ? combo : 0)
    const baseCoins = correct ? 10 : 0
    const comboBonus = correct && newCombo >= 3 ? Math.floor(baseCoins * 0.5) : 0
    let earned = baseCoins + speedBonus + comboBonus
    if (correct && coinBoost) {                            // 金幣技能加碼
      if (coinBoost.mult) earned *= coinBoost.mult
      if (coinBoost.add)  earned += coinBoost.add
    }
    gainEnergy(activePet, ENERGY_PER_QUESTION)             // 答題回復能量

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
  }, [input, currentQ, timeLeft, combo, coinBoost, nextQuestion])

  if (qIndex >= QUESTIONS_PER_STAGE) return null

  const timerPct = Math.min(100, (timeLeft / TIME_LIMIT) * 100)
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
          animate={mood === 'happy' ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }
            : mood === 'sad' ? { x: [0, -8, 8, -8, 0] }
            : { y: [0, -5, 0] }}
          transition={mood === 'idle'
            ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            : { duration: 0.4 }}
        >
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={80} />
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

        <AnimatePresence>
          {skillFlash && (
            <motion.div
              className="skill-flash"
              initial={{ scale: 0.5, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: -46 }}
              exit={{ opacity: 0, y: -70 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {skillFlash}
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

      {/* 寵物技能鈕 */}
      <div className="game-skill">
        <PetSkillButton
          petId={activePet}
          energy={petEnergy?.[activePet] ?? 0}
          used={skillUsedThisQ}
          disabled={paused || !!feedback}
          onActivate={activateSkill}
        />
      </div>

      {/* Number pad */}
      <div className="game-numpad">
        <NumberPad value={input} onChange={setInput} onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
