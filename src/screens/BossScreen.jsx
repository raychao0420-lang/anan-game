import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { generateStageQuestions } from '../data/questions'
import { BOSS_DEFS, BOSS_REWARDS } from '../data/achievements'
import { PETS } from '../data/pets'
import NumberPad from '../components/NumberPad'
import { sfx } from '../utils/sound'
import './BossScreen.css'

const BOSS_QUESTIONS = 15
const BOSS_PASS = 10

export default function BossScreen({ chapterId, onBack }) {
  const { activePet, pets, clearBoss, bossCleared, updateMaxCombo, updateTotalCoins } = useGameStore()
  const pet = PETS[activePet]
  const petData = pets[activePet]
  const petStage = pet.stages[petData.evolutionStage]

  const boss = BOSS_DEFS[chapterId]
  const BOSS_TIME = boss.time ?? 10
  const reward = BOSS_REWARDS[chapterId]
  const alreadyCleared = bossCleared[chapterId]

  const [questions] = useState(() => {
    const qs = []
    for (let i = 0; i < BOSS_QUESTIONS; i++) {
      qs.push(...generateStageQuestions(chapterId))
    }
    return qs.slice(0, BOSS_QUESTIONS)
  })

  const [phase, setPhase] = useState('intro') // intro | fight | win | lose
  const [qIndex, setQIndex] = useState(0)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(BOSS_TIME)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [bossHp, setBossHp] = useState(100)
  const [eggHatched, setEggHatched] = useState(false)
  const timerRef = useRef(null)
  const feedbackRef = useRef(null)

  const currentQ = questions[qIndex]
  const dmgPerHit = 100 / BOSS_QUESTIONS

  const showFeedback = (correct) => {
    clearTimeout(feedbackRef.current)
    setFeedback(correct)
    feedbackRef.current = setTimeout(() => setFeedback(null), 600)
  }

  const nextQuestion = useCallback((correct) => {
    const newCorrect = correctCount + (correct ? 1 : 0)
    const newCombo = correct ? combo + 1 : 0
    setCorrectCount(newCorrect)
    setCombo(newCombo)
    if (correct) setBossHp(hp => Math.max(0, hp - dmgPerHit))
    updateMaxCombo(newCombo)

    if (qIndex >= BOSS_QUESTIONS - 1) {
      if (newCorrect >= BOSS_PASS) {
        clearBoss(chapterId, reward.id)
        updateTotalCoins(100)
        setTimeout(() => sfx.bossWin(), 300)
        setPhase('win')
      } else {
        setTimeout(() => sfx.bossLose(), 300)
        setPhase('lose')
      }
    } else {
      setQIndex(i => i + 1)
      setInput('')
      setTimeLeft(BOSS_TIME)
    }
  }, [qIndex, correctCount, combo, chapterId, reward, clearBoss, dmgPerHit, updateMaxCombo, updateTotalCoins])

  useEffect(() => {
    if (phase !== 'fight') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          showFeedback(false)
          sfx.wrong()
          nextQuestion(false)
          return BOSS_TIME
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, qIndex, nextQuestion])

  const handleConfirm = useCallback(() => {
    if (!input || phase !== 'fight') return
    clearInterval(timerRef.current)
    const correct = parseInt(input) === currentQ.answer
    showFeedback(correct)
    if (correct) sfx.bossHit()
    else sfx.wrong()
    setTimeout(() => nextQuestion(correct), 500)
  }, [input, currentQ, phase, nextQuestion])

  const timerPct = (timeLeft / BOSS_TIME) * 100
  const timerColor = timeLeft > 5 ? '#6BCB77' : timeLeft > 2 ? '#FFB347' : '#FF6B6B'

  if (phase === 'intro') return (
    <div className="boss-screen boss-intro">
      <motion.div
        className="boss-intro-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="boss-chapter-label">{boss.chapter} BOSS</div>
        <motion.div
          className="boss-emoji-big"
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {boss.emoji}
        </motion.div>
        <div className="boss-name">{boss.name}</div>
        <div className="boss-rules">
          <div>⚡ 每題 {BOSS_TIME} 秒</div>
          <div>📝 共 {BOSS_QUESTIONS} 題</div>
          <div>🎯 答對 {BOSS_PASS} 題以上即可過關</div>
          <div>🎁 過關獎勵：{reward.emoji} {reward.name}</div>
        </div>
        {alreadyCleared && <div className="boss-already-cleared">✅ 你已打倒過此Boss！可再次挑戰</div>}
        <motion.button
          className="btn-primary"
          style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setPhase('fight')}
        >
          ⚔️ 開始挑戰！
        </motion.button>
        <motion.button
          className="btn-secondary"
          style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
        >
          先回去準備
        </motion.button>
      </motion.div>
    </div>
  )

  if (phase === 'win') return (
    <div className="boss-screen boss-win">
      <motion.div
        className="boss-result-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="boss-win-title">🎉 Boss 打倒了！</div>
        <motion.div
          className="boss-result-pet"
          style={{ background: petStage.bg, border: `3px solid ${petStage.border}` }}
          animate={{ scale: [1, 1.2, 1, 1.2, 1], rotate: [0, 15, -15, 10, 0] }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span style={{ fontSize: '3.5rem' }}>{petStage.emoji}</span>
        </motion.div>
        <div className="boss-score">答對 {correctCount} / {BOSS_QUESTIONS} 題</div>
        <div className="boss-coin-reward">+ 100 💰</div>

        {/* Egg hatching */}
        <div className="boss-egg-area">
          {!eggHatched ? (
            <motion.div
              className="boss-egg"
              animate={{ rotate: [-5, 5, -5, 5, -5, 0], y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: 2, onComplete: () => setEggHatched(true) }}
              onClick={() => setEggHatched(true)}
            >
              🥚
            </motion.div>
          ) : (
            <motion.div
              className="boss-reward-reveal"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260 }}
            >
              <span className="boss-reward-emoji">{reward.emoji}</span>
              <div className="boss-reward-name">{reward.name} 已收入道具袋！</div>
            </motion.div>
          )}
          {!eggHatched && <div className="boss-egg-hint">點擊蛋來孵化！</div>}
        </div>

        <motion.button
          className="btn-primary"
          style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
        >
          🏠 回首頁
        </motion.button>
      </motion.div>
    </div>
  )

  if (phase === 'lose') return (
    <div className="boss-screen boss-lose">
      <motion.div
        className="boss-result-card"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="boss-lose-title">😓 這次沒過關</div>
        <motion.div
          className="boss-lose-emoji"
          animate={{ x: [0, -8, 8, -8, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {boss.emoji}
        </motion.div>
        <div className="boss-score">答對 {correctCount} / {BOSS_QUESTIONS} 題（需要 {BOSS_PASS} 題）</div>
        <div className="boss-retry-hint">繼續練習再來挑戰！</div>
        <motion.button
          className="btn-primary"
          style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setPhase('intro')
            setQIndex(0)
            setInput('')
            setTimeLeft(BOSS_TIME)
            setCorrectCount(0)
            setCombo(0)
            setBossHp(100)
            setEggHatched(false)
          }}
        >
          🔄 再挑戰！
        </motion.button>
        <motion.button
          className="btn-secondary"
          style={{ maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
        >
          🏠 回首頁
        </motion.button>
      </motion.div>
    </div>
  )

  // fight phase
  return (
    <div className="boss-screen boss-fight">
      {/* Header */}
      <div className="boss-fight-header">
        <div className="boss-fight-info">
          <span className="boss-fight-name">{boss.emoji} {boss.name}</span>
          <span className="boss-fight-count">{qIndex + 1}/{BOSS_QUESTIONS}</span>
        </div>
        <div className="boss-fight-meta">
          {combo >= 2 && <span className="boss-combo">🔥×{combo}</span>}
          <span className="boss-correct">{correctCount}✅</span>
        </div>
      </div>

      {/* Boss HP bar */}
      <div className="boss-hp-row">
        <span className="boss-hp-label">Boss HP</span>
        <div className="boss-hp-bar">
          <motion.div
            className="boss-hp-fill"
            animate={{ width: `${bossHp}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="boss-hp-val">{Math.round(bossHp)}%</span>
      </div>

      {/* Timer */}
      <div className="boss-timer-bar">
        <motion.div
          className="boss-timer-fill"
          style={{ background: timerColor }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      {/* Pet */}
      <div className="boss-pet-area">
        <motion.div
          className="boss-pet-bubble"
          style={{ background: petStage.bg, border: `2px solid ${petStage.border}` }}
          animate={feedback === true ? { scale: [1, 1.2, 1] }
            : feedback === false ? { x: [0, -8, 8, 0] }
            : { y: [0, -5, 0] }}
          transition={feedback === null
            ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            : { duration: 0.3 }}
        >
          <span style={{ fontSize: '2.5rem' }}>{petStage.emoji}</span>
        </motion.div>

        <AnimatePresence>
          {feedback !== null && (
            <motion.div
              className={`boss-feedback ${feedback ? 'correct' : 'wrong'}`}
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: 1, y: -16 }}
              exit={{ opacity: 0, y: -32 }}
            >
              {feedback ? '⚔️ 命中！' : '❌ 失誤！'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <motion.div
        key={qIndex}
        className="boss-question"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {currentQ.display} = ?
      </motion.div>

      <div className="boss-numpad">
        <NumberPad value={input} onChange={setInput} onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
