import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { SUBJECT_CONFIGS, getSubjectQuestionIds, getQuestionsByIds } from '../data/examBoss'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { sfx } from '../utils/sound'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import './ExamBossScreen.css'

const CATEGORY_TIPS = {
  '數學': '💡 用草稿區計算再填答案',
  '社會': '💡 想想社區與生活',
  '自然': '💡 回想自然課知識',
  '國語': '💡 想想語文課學的',
}

const formatTime = (t) => t >= 60 ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` : `${t}s`

export default function ExamBossScreen({ onBack }) {
  const {
    activePet, pets, petEquipment, subjectStreaks, ownedItems,
    addCoins, recordSubjectResult, popSubjectQuestions, updatePetMood,
  } = useGameStore()
  const equipped = (petEquipment[activePet] || []).map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)
  const pet      = PETS[activePet]
  const petData  = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]

  const [phase, setPhase]         = useState('select')
  const [activeSubject, setActiveSubject] = useState(null)
  const [questions, setQuestions] = useState([])

  const [qIndex, setQIndex]               = useState(0)
  const [input, setInput]                 = useState('')
  const [timeLeft, setTimeLeft]           = useState(20)
  const [correctCount, setCorrectCount]   = useState(0)
  const [wrongCount, setWrongCount]       = useState(0)
  const [feedback, setFeedback]           = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [wasPerfect, setWasPerfect]       = useState(false)
  const [coinsEarned, setCoinsEarned]     = useState(0)

  const prevStreakRef = useRef(0)
  const timerRef     = useRef(null)
  const feedbackRef  = useRef(null)
  const canvasRef    = useRef(null)
  const drawingRef   = useRef(false)
  const lastXRef     = useRef(0)
  const lastYRef     = useRef(0)

  const currentQ = questions[qIndex]

  const showFeedback = (type) => {
    clearTimeout(feedbackRef.current)
    setFeedback(type)
    feedbackRef.current = setTimeout(() => setFeedback(null), 700)
  }

  const nextQuestion = useCallback((isCorrect) => {
    const newCorrect = correctCount + (isCorrect ? 1 : 0)
    const newWrong   = wrongCount   + (isCorrect ? 0 : 1)
    setCorrectCount(newCorrect)
    setWrongCount(newWrong)

    if (qIndex >= activeSubject.totalQuestions - 1) {
      const passed    = newCorrect >= activeSubject.passScore
      const isPerfect = newCorrect === activeSubject.totalQuestions
      const coins     = passed ? (isPerfect ? 200 : 100) : 0
      setWasPerfect(isPerfect)
      setCoinsEarned(coins)
      if (coins > 0) addCoins(coins)
      recordSubjectResult(activeSubject.id, passed, activeSubject.rewardItemId, activeSubject.streakNeeded)
      setTimeout(() => passed ? sfx.bossWin() : sfx.bossLose(), 300)
      setPhase(passed ? 'win' : 'lose')
    } else {
      setQIndex(i => i + 1)
      setInput('')
      setSelectedChoice(null)
      setTimeLeft(activeSubject.timePerQuestion)
    }
  }, [qIndex, correctCount, wrongCount, activeSubject, addCoins, recordSubjectResult])

  useEffect(() => {
    if (phase !== 'fight' || !currentQ) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          showFeedback('wrong')
          sfx.wrong()
          setTimeout(() => nextQuestion(false), 700)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, qIndex, nextQuestion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || phase !== 'fight') return
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  }, [qIndex, phase])

  const getCanvasPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    drawingRef.current = true
    const { x, y } = getCanvasPos(e)
    lastXRef.current = x
    lastYRef.current = y
  }

  const doDraw = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getCanvasPos(e)
    ctx.beginPath()
    ctx.moveTo(lastXRef.current, lastYRef.current)
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastXRef.current = x
    lastYRef.current = y
  }

  const endDraw = () => { drawingRef.current = false }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleConfirm = useCallback(() => {
    if (!input.trim() || phase !== 'fight') return
    clearInterval(timerRef.current)
    const userVal   = parseFloat(input)
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - currentQ.answer) < 0.01
    showFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) { sfx.correct(); updatePetMood(activePet, 4) } else sfx.wrong()
    setTimeout(() => nextQuestion(isCorrect), 700)
  }, [input, currentQ, phase, nextQuestion, activePet, updatePetMood])

  const handleChoiceSelect = useCallback((optionIndex) => {
    if (phase !== 'fight' || selectedChoice !== null) return
    clearInterval(timerRef.current)
    const isCorrect = optionIndex === currentQ.answer
    setSelectedChoice(optionIndex)
    showFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) { sfx.correct(); updatePetMood(activePet, 4) } else sfx.wrong()
    setTimeout(() => nextQuestion(isCorrect), isCorrect ? 700 : 1500)
  }, [currentQ, phase, nextQuestion, selectedChoice, activePet, updatePetMood])

  const startSubject = (subConf) => {
    prevStreakRef.current = subjectStreaks?.[subConf.id] ?? 0
    setActiveSubject(subConf)
    const allIds    = getSubjectQuestionIds(subConf.category)
    const pickedIds = popSubjectQuestions(subConf.id, allIds, subConf.totalQuestions)
    setQuestions(getQuestionsByIds(pickedIds))
    setQIndex(0)
    setInput(''); setSelectedChoice(null)
    setTimeLeft(subConf.timePerQuestion)
    setCorrectCount(0); setWrongCount(0)
    setFeedback(null)
    setWasPerfect(false); setCoinsEarned(0)
    setPhase('fight')
  }

  // ── SELECT ─────────────────────────────────────────────────────
  if (phase === 'select') return (
    <div className="exam-screen exam-intro">
      <div className="exam-select-wrap">
        <motion.button className="exam-back-btn" whileTap={{ scale: 0.9 }} onClick={onBack}>
          ← 返回
        </motion.button>

        <motion.div className="exam-intro-emoji"
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 2.8 }}
        >📚</motion.div>
        <div className="exam-intro-title">期末考大魔王</div>
        <div className="exam-intro-sub">選擇科目挑戰・題目全做過就得皇冠 👑</div>

        <div className="exam-subject-grid">
          {SUBJECT_CONFIGS.map(sub => {
            const streak      = subjectStreaks?.[sub.id] ?? 0
            const crownEarned = ownedItems.includes(sub.rewardItemId)
            const displayStreak = Math.min(streak, sub.streakNeeded)
            return (
              <motion.button
                key={sub.id}
                className="exam-subject-card"
                style={{ borderColor: sub.color }}
                whileTap={{ scale: 0.93 }}
                onClick={() => startSubject(sub)}
              >
                {crownEarned && <span className="exam-subject-crown-badge">👑</span>}
                <span className="exam-subject-emoji">{sub.emoji}</span>
                <span className="exam-subject-name" style={{ color: sub.color }}>{sub.category}</span>
                <div className="exam-subject-streak-dots">
                  {Array.from({ length: sub.streakNeeded }, (_, i) => (
                    <span key={i} className={`streak-dot ${i < displayStreak ? 'on' : ''}`}
                      style={{ background: i < displayStreak ? sub.color : undefined }}
                    />
                  ))}
                </div>
                <span className="exam-subject-hint">
                  {crownEarned ? '👑 皇冠已獲得' : `連過 ${displayStreak}/${sub.streakNeeded} 關`}
                </span>
                <span className="exam-subject-hint">
                  {sub.totalQuestions} 題・{sub.timePerQuestion >= 60 ? `${sub.timePerQuestion / 60}分鐘/題` : `${sub.timePerQuestion}秒/題`}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ── WIN ────────────────────────────────────────────────────────
  if (phase === 'win') {
    const currentStreak   = subjectStreaks?.[activeSubject?.id] ?? 0
    const crownEarned     = ownedItems.includes(activeSubject?.rewardItemId)
    const justEarnedCrown = prevStreakRef.current < activeSubject?.streakNeeded && currentStreak >= activeSubject?.streakNeeded

    return (
      <div className="exam-screen exam-win">
        <motion.div className="exam-result-card"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="exam-win-title">{wasPerfect ? '🌟 完美滿分！' : '🎉 過關了！'}</div>

          <motion.div className="exam-result-pet"
            style={{ background: petStage.bg, border: `3px solid ${petStage.border}` }}
            animate={{ scale: [1, 1.2, 1, 1.2, 1], rotate: [0, 15, -15, 10, 0] }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span style={{ fontSize: '3.5rem' }}>{petStage.emoji}</span>
          </motion.div>

          <div className="exam-score">
            {activeSubject.category} ・ 答對 {correctCount} / {activeSubject.totalQuestions} 題
          </div>

          {/* 連勝進度 / 皇冠解鎖 */}
          <div className="exam-perfect-box" style={{ borderColor: activeSubject.color }}>
            {justEarnedCrown ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, delay: 0.4 }}
                  style={{ fontSize: '4rem' }}
                >👑</motion.div>
                <div style={{ color: '#FFD700', fontWeight: 800, fontSize: '1.05rem', textAlign: 'center' }}>
                  🎊 {activeSubject.category}皇冠 解鎖！道具袋已收錄
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 700 }}>
                  🔥 {activeSubject.category} 連勝進度
                </div>
                <div className="exam-perfect-stars">
                  {Array.from({ length: activeSubject.streakNeeded }, (_, i) => (
                    <span key={i} className={`streak-dot-lg ${i < Math.min(currentStreak, activeSubject.streakNeeded) ? 'on' : ''}`}
                      style={{ background: i < Math.min(currentStreak, activeSubject.streakNeeded) ? activeSubject.color : undefined }}
                    />
                  ))}
                </div>
                {!crownEarned && (
                  <div style={{ color: '#888', fontSize: '0.82rem' }}>
                    再連過 {activeSubject.streakNeeded - Math.min(currentStreak, activeSubject.streakNeeded)} 關即可獲得皇冠！
                  </div>
                )}
              </>
            )}
            <div style={{ color: '#FFD700', fontWeight: 900, fontSize: '1.4rem' }}>+ {coinsEarned} 💰</div>
          </div>

          <div className="exam-result-btns">
            <motion.button className="btn-primary" whileTap={{ scale: 0.94 }}
              onClick={() => startSubject(activeSubject)}
            >🔄 再挑戰 {activeSubject.category}</motion.button>
            <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }}
              onClick={() => setPhase('select')}
            >📚 選擇其他科目</motion.button>
            <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }}
              onClick={onBack}
            >🏠 回首頁</motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── LOSE ───────────────────────────────────────────────────────
  if (phase === 'lose') {
    const prevStreak = prevStreakRef.current
    return (
      <div className="exam-screen exam-lose">
        <motion.div className="exam-result-card"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="exam-lose-title">😓 這次沒過關</div>
          <motion.div className="exam-lose-emoji"
            animate={{ x: [0, -8, 8, -8, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >📚</motion.div>
          <div className="exam-score">
            {activeSubject.category} ・ 答對 {correctCount} / {activeSubject.totalQuestions} 題（需要 {activeSubject.passScore} 題）
          </div>
          {prevStreak > 0 && (
            <div style={{ color: '#FF9966', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
              💔 {prevStreak} 連勝中斷，下次重新累積！
            </div>
          )}
          <div className="exam-retry-hint">再多練習幾次，一定可以過關！加油 💪</div>
          <div className="exam-result-btns">
            <motion.button className="btn-primary" whileTap={{ scale: 0.94 }}
              onClick={() => startSubject(activeSubject)}
            >🔄 再挑戰！</motion.button>
            <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }}
              onClick={() => setPhase('select')}
            >📚 選擇其他科目</motion.button>
            <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }}
              onClick={onBack}
            >🏠 回首頁</motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── FIGHT ──────────────────────────────────────────────────────
  if (!currentQ) return null

  const catColor   = activeSubject.color
  const timerPct   = (timeLeft / activeSubject.timePerQuestion) * 100
  const timerColor = timerPct > 65 ? '#6BCB77' : timerPct > 35 ? '#FFB347' : '#FF6B6B'

  return (
    <div className="exam-screen exam-fight">

      <div className="exam-fight-header">
        <div className="exam-fight-left">
          <div className="exam-pet-mini">
            <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={36} />
          </div>
          <span className="exam-fight-count">第 {qIndex + 1} / {activeSubject.totalQuestions} 題</span>
        </div>
        <div className="exam-fight-score">
          <span className="exam-score-correct">{correctCount} ✅</span>
          <span className="exam-score-wrong">{wrongCount} ❌</span>
        </div>
      </div>

      <div className="exam-timer-track">
        <motion.div className="exam-timer-fill"
          style={{ background: timerColor }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      <div className="exam-meta-row">
        <span className="exam-category-badge" style={{ background: catColor }}>
          {currentQ.category}
        </span>
        <span className="exam-category-tip">{CATEGORY_TIPS[currentQ.category]}</span>
        <span className="exam-timer-label" style={{ color: timerColor }}>{formatTime(timeLeft)}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`q-${qIndex}`} className="exam-question"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {currentQ.question}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div className={`exam-feedback-overlay ${feedback}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {feedback === 'correct' ? '✅ 答對了！' : '❌ 答錯了！'}
          </motion.div>
        )}
      </AnimatePresence>

      {currentQ.type === 'number' ? (
        <>
          <div className="exam-scratchpad-wrap">
            <div className="exam-scratchpad-label">
              ✏️ 塗鴉草稿區
              <button className="exam-scratchpad-clear" onClick={clearCanvas}>清除</button>
            </div>
            <canvas
              ref={canvasRef}
              className="exam-scratchpad-canvas"
              width={800}
              height={200}
              onPointerDown={startDraw}
              onPointerMove={doDraw}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
            />
          </div>
          <div className="exam-numpad-wrap">
            {currentQ.unit && <div className="exam-numpad-unit">單位：{currentQ.unit}</div>}
            <NumberPad value={input} onChange={setInput} onConfirm={handleConfirm} />
          </div>
        </>
      ) : (
        <div className="exam-choices">
          {currentQ.options.map((opt, idx) => {
            const optNum          = idx + 1
            const isCorrectOpt    = optNum === currentQ.answer
            const isSelectedWrong = selectedChoice !== null && optNum === selectedChoice && !isCorrectOpt
            const choiceClass     = selectedChoice !== null
              ? isCorrectOpt ? 'choice-correct' : isSelectedWrong ? 'choice-wrong' : 'choice-dim'
              : ''
            return (
              <motion.button
                key={idx}
                className={`exam-choice-btn ${choiceClass}`}
                style={selectedChoice === null ? { borderColor: catColor } : {}}
                whileTap={selectedChoice === null ? { scale: 0.93 } : {}}
                onClick={() => handleChoiceSelect(optNum)}
                disabled={selectedChoice !== null}
              >
                <span className="exam-choice-num"
                  style={{ background: isCorrectOpt && selectedChoice !== null ? '#22C55E' : isSelectedWrong ? '#EF4444' : catColor }}
                >
                  {['①','②','③','④'][idx]}
                </span>
                <span className="exam-choice-text">{opt}</span>
              </motion.button>
            )
          })}
        </div>
      )}

    </div>
  )
}
