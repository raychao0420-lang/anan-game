import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { EXAM_BOSS_CONFIG, pickExamQuestions } from '../data/examBoss'
import { PETS } from '../data/pets'
import { sfx } from '../utils/sound'
import './ExamBossScreen.css'

const CATEGORY_TIPS = {
  '數學': '💡 用草稿區計算再填答案',
  '社會': '💡 想想社區與生活',
  '自然': '💡 回想自然課知識',
  '國語': '💡 想想語文課學的',
}

const CATEGORY_COLORS = {
  '數學': '#6C63FF',
  '社會': '#0EA5E9',
  '自然': '#22C55E',
  '國語': '#EF4444',
}

const { totalQuestions, passScore, timePerQuestion, mathTimePerQuestion, firstClearCoins, replayClearCoins, rewardItemId } = EXAM_BOSS_CONFIG

const getQTime = (q) => q?.type === 'number' ? mathTimePerQuestion : timePerQuestion
const formatTime = (t) => t >= 60 ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` : `${t}s`

export default function ExamBossScreen({ onBack }) {
  const { activePet, pets, examBossCleared, clearExamBoss } = useGameStore()
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]

  const [questions] = useState(() => pickExamQuestions(totalQuestions))
  const [phase, setPhase]             = useState('intro')
  const [qIndex, setQIndex]           = useState(0)
  const [input, setInput]             = useState('')
  const [scratchpad, setScratchpad]   = useState('')
  const [timeLeft, setTimeLeft]       = useState(() => getQTime(questions[0]))
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount]   = useState(0)
  const [feedback, setFeedback]       = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [wasFirstClear, setWasFirstClear] = useState(false)
  const [eggHatched, setEggHatched]   = useState(false)

  const timerRef    = useRef(null)
  const feedbackRef = useRef(null)
  const inputRef    = useRef(null)

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

    if (qIndex >= totalQuestions - 1) {
      if (newCorrect >= passScore) {
        const isFirst = !examBossCleared
        setWasFirstClear(isFirst)
        clearExamBoss(isFirst ? firstClearCoins : replayClearCoins, rewardItemId)
        setTimeout(() => sfx.bossWin(), 300)
        setPhase('win')
      } else {
        setTimeout(() => sfx.bossLose(), 300)
        setPhase('lose')
      }
    } else {
      setQIndex(i => i + 1)
      setInput('')
      setScratchpad('')
      setSelectedChoice(null)
      setTimeLeft(getQTime(questions[qIndex + 1]))
    }
  }, [qIndex, correctCount, wrongCount, examBossCleared, clearExamBoss])

  useEffect(() => {
    if (phase !== 'fight') return
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

  const handleConfirm = useCallback(() => {
    if (!input.trim() || phase !== 'fight') return
    clearInterval(timerRef.current)
    const userVal  = parseFloat(input)
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - currentQ.answer) < 0.01
    showFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) sfx.correct()
    else sfx.wrong()
    setTimeout(() => nextQuestion(isCorrect), 700)
  }, [input, currentQ, phase, nextQuestion])

  const handleChoiceSelect = useCallback((optionIndex) => {
    if (phase !== 'fight' || selectedChoice !== null) return
    clearInterval(timerRef.current)
    const isCorrect = optionIndex === currentQ.answer
    setSelectedChoice(optionIndex)
    showFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) sfx.correct()
    else sfx.wrong()
    setTimeout(() => nextQuestion(isCorrect), isCorrect ? 700 : 1500)
  }, [currentQ, phase, nextQuestion, selectedChoice])

  const resetBattle = () => {
    setQIndex(0); setInput(''); setScratchpad('')
    setSelectedChoice(null)
    setTimeLeft(getQTime(questions[0])); setCorrectCount(0); setWrongCount(0)
    setFeedback(null); setEggHatched(false)
  }

  const maxTime    = getQTime(currentQ)
  const timerPct   = (timeLeft / maxTime) * 100
  const timerColor = timerPct > 65 ? '#6BCB77' : timerPct > 35 ? '#FFB347' : '#FF6B6B'

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="exam-screen exam-intro">
      <motion.div className="exam-intro-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="exam-intro-label">📖 期末考 BOSS</div>
        <motion.div className="exam-intro-emoji"
          animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.8 }}
        >
          📚
        </motion.div>
        <div className="exam-intro-title">{EXAM_BOSS_CONFIG.name}</div>
        <div className="exam-intro-sub">{EXAM_BOSS_CONFIG.subtitle}</div>
        <div className="exam-intro-rules">
          <div>🎲 每次隨機抽 {totalQuestions} 題（數學4、社會2、自然2、國語2）</div>
          <div>✅ 答對 {passScore} 題以上過關</div>
          <div>⏱️ 數學題 <strong>2分鐘</strong>、其他科目 {timePerQuestion} 秒</div>
          <div>🔢 數學題輸入答案；其他科目點選選項</div>
          <div>✏️ 數學題有計算草稿區</div>
          <div>🏆 首次過關：<strong>{firstClearCoins} 金幣 + 狀元獎盃</strong></div>
        </div>
        {examBossCleared && (
          <div className="exam-already-cleared">✅ 你已打倒過此Boss！再次過關 +{replayClearCoins} 金幣</div>
        )}
        <motion.button className="btn-primary" style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { resetBattle(); setPhase('fight') }}
        >
          📝 開始應試！
        </motion.button>
        <motion.button className="btn-secondary" style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
        >
          先回去練習
        </motion.button>
      </motion.div>
    </div>
  )

  // ── WIN ────────────────────────────────────────────────────────────────────
  if (phase === 'win') return (
    <div className="exam-screen exam-win">
      <motion.div className="exam-result-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="exam-win-title">🎉 期末考過關啦！</div>
        <motion.div className="exam-result-pet"
          style={{ background: petStage.bg, border: `3px solid ${petStage.border}` }}
          animate={{ scale: [1, 1.2, 1, 1.2, 1], rotate: [0, 15, -15, 10, 0] }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span style={{ fontSize: '3.5rem' }}>{petStage.emoji}</span>
        </motion.div>
        <div className="exam-score">答對 {correctCount} / {totalQuestions} 題</div>

        <div className="exam-egg-area">
          {!eggHatched ? (
            <>
              <motion.div className="exam-egg"
                animate={{ rotate: [-5, 5, -5, 5, -5, 0], y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: 2, onComplete: () => setEggHatched(true) }}
                onClick={() => setEggHatched(true)}
              >
                🥚
              </motion.div>
              <div className="exam-egg-hint">點擊蛋來開獎！</div>
            </>
          ) : (
            <motion.div className="exam-reward-reveal"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260 }}
            >
              {wasFirstClear ? (
                <>
                  <span className="exam-reward-emoji">🏆</span>
                  <div className="exam-reward-name">狀元獎盃 已收入道具袋！</div>
                  <div className="exam-reward-coins">+ {firstClearCoins} 💰</div>
                </>
              ) : (
                <>
                  <span className="exam-reward-emoji">💰</span>
                  <div className="exam-reward-name">再次過關！</div>
                  <div className="exam-reward-coins">+ {replayClearCoins} 💰</div>
                </>
              )}
            </motion.div>
          )}
        </div>

        <motion.button className="btn-primary" style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
        >
          🏠 回首頁
        </motion.button>
        <motion.button className="btn-secondary" style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { resetBattle(); setPhase('intro') }}
        >
          🔄 再挑戰一次
        </motion.button>
      </motion.div>
    </div>
  )

  // ── LOSE ───────────────────────────────────────────────────────────────────
  if (phase === 'lose') return (
    <div className="exam-screen exam-lose">
      <motion.div className="exam-result-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="exam-lose-title">😓 這次沒過關</div>
        <motion.div className="exam-lose-emoji"
          animate={{ x: [0, -8, 8, -8, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          📚
        </motion.div>
        <div className="exam-score">答對 {correctCount} / {totalQuestions} 題（需要 {passScore} 題）</div>
        <div className="exam-retry-hint">再多練習幾次，一定可以過關！加油 💪</div>
        <motion.button className="btn-primary" style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { resetBattle(); setPhase('intro') }}
        >
          🔄 再挑戰！
        </motion.button>
        <motion.button className="btn-secondary" style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
        >
          🏠 回首頁
        </motion.button>
      </motion.div>
    </div>
  )

  // ── FIGHT ──────────────────────────────────────────────────────────────────
  const catColor = CATEGORY_COLORS[currentQ.category] || '#6C63FF'

  return (
    <div className="exam-screen exam-fight">

      {/* Header */}
      <div className="exam-fight-header">
        <div className="exam-fight-left">
          <div className="exam-pet-mini"
            style={{ background: petStage.bg, border: `2px solid ${petStage.border}` }}
          >
            <span>{petStage.emoji}</span>
          </div>
          <span className="exam-fight-count">第 {qIndex + 1} / {totalQuestions} 題</span>
        </div>
        <div className="exam-fight-score">
          <span className="exam-score-correct">{correctCount} ✅</span>
          <span className="exam-score-wrong">{wrongCount} ❌</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="exam-timer-track">
        <motion.div className="exam-timer-fill"
          style={{ background: timerColor }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      {/* Category + timer label */}
      <div className="exam-meta-row">
        <span className="exam-category-badge" style={{ background: catColor }}>
          {currentQ.category}
        </span>
        <span className="exam-category-tip">{CATEGORY_TIPS[currentQ.category]}</span>
        <span className="exam-timer-label" style={{ color: timerColor }}>{formatTime(timeLeft)}</span>
      </div>

      {/* Question */}
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

      {/* Feedback overlay */}
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

      {/* Scratchpad (number type only) */}
      {currentQ.type === 'number' ? (
        <>
          <div className="exam-scratchpad-wrap">
            <div className="exam-scratchpad-label">✏️ 計算草稿區</div>
            <textarea
              className="exam-scratchpad"
              value={scratchpad}
              onChange={e => setScratchpad(e.target.value)}
              placeholder="在這裡寫算式草稿..."
              rows={3}
            />
          </div>
          <div className="exam-answer-wrap">
            <span className="exam-answer-label">答案：</span>
            <input
              ref={inputRef}
              className="exam-answer-input"
              type="text"
              inputMode="decimal"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="填入答案"
              onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
            />
            {currentQ.unit && <span className="exam-answer-unit">{currentQ.unit}</span>}
            <motion.button
              className="exam-confirm-btn"
              style={{ background: catColor }}
              whileTap={{ scale: 0.94 }}
              onClick={handleConfirm}
              disabled={!input.trim()}
            >
              確認 ✓
            </motion.button>
          </div>
        </>
      ) : (
        <div className="exam-choices">
          {currentQ.options.map((opt, idx) => {
            const optNum = idx + 1
            const isCorrectOpt = optNum === currentQ.answer
            const isSelectedWrong = selectedChoice !== null && optNum === selectedChoice && !isCorrectOpt
            const isDim = selectedChoice !== null && !isCorrectOpt && optNum !== selectedChoice
            const choiceClass = selectedChoice !== null
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
