import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import { SkillBar } from '../components/PetSkillButton'
import { usePetSkill } from '../hooks/usePetSkill'
import { sfx } from '../utils/sound'
import './MaketenScreen.css'

const ROUNDS = [
  { no: 1, timeLimit: 20, label: '練習', color: '#4CAF50', bg: '#F1F8E9' },
  { no: 2, timeLimit: 12, label: '加速', color: '#FF9800', bg: '#FFF3E0' },
  { no: 3, timeLimit: 8,  label: '極速', color: '#F44336', bg: '#FFEBEE' },
]
const Q_PER_ROUND = 10

function makeQuestions() {
  const pool = []
  for (let a = 2; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      const product = a * b
      pool.push({ type: 'mult', a, b, product, answer: b })
      pool.push({ type: 'div',  a, b, product, answer: b })
    }
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Q_PER_ROUND)
}

export default function MultiplyScreen({ onBack }) {
  const { activePet, pets, petEquipment, multiplyCleared, clearMultiply, updatePetMood, addCoins } = useGameStore()
  const petData = pets[activePet]
  const equipped = (petEquipment[activePet] || [])
    .map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)

  const [phase, setPhase]       = useState('intro')
  const [roundIdx, setRoundIdx] = useState(0)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx]         = useState(0)
  const [input, setInput]       = useState('')
  const [timeLeft, setTimeLeft] = useState(20)
  const [retryKey, setRetryKey] = useState(0)      // 護盾重試同一題時重啟計時器
  const [feedback, setFeedback] = useState(null)
  const [failInfo, setFailInfo] = useState(null)
  const [wonFirst, setWonFirst] = useState(false)
  const timerRef = useRef(null)
  const fbRef    = useRef(null)

  const round    = ROUNDS[roundIdx]
  const currentQ = questions[qIdx]

  // 寵物技能：加時 / 立即金幣 / 護盾（擋下一次答錯或逾時，這題重來）
  const skill = usePetSkill({
    onTime: (sec) => setTimeLeft(t => t + sec),
    onCoin: (n)   => addCoins(n),
  })
  const shieldRetry = () => {
    clearInterval(timerRef.current)
    clearTimeout(fbRef.current)
    setFeedback(null)
    setInput('')
    setTimeLeft(round.timeLimit)
    setRetryKey(k => k + 1)
  }

  const startRound = useCallback((rIdx) => {
    clearInterval(timerRef.current)
    clearTimeout(fbRef.current)
    setRoundIdx(rIdx)
    setQuestions(makeQuestions())
    setQIdx(0)
    setInput('')
    setTimeLeft(ROUNDS[rIdx].timeLimit)
    setFeedback(null)
    setFailInfo(null)
    skill.nextQuestion()
    setPhase('playing')
  }, [])

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') { clearInterval(timerRef.current); return }
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, qIdx, retryKey])

  useEffect(() => {
    if (phase !== 'playing' || timeLeft !== 0) return
    clearInterval(timerRef.current)
    skill.addEnergy()
    if (skill.consumeShield()) { shieldRetry(); return }
    sfx.wrong()
    setFeedback('timeout')
    setFailInfo({ answer: currentQ?.answer, reason: 'timeout' })
    clearTimeout(fbRef.current)
    fbRef.current = setTimeout(() => setPhase('fail'), 1100)
  }, [timeLeft, phase, currentQ])

  // ── Input ─────────────────────────────────────────────────────────────────
  const handlePad = useCallback((v) => {
    if (phase !== 'playing' || feedback) return
    if (v === 'del') { setInput(i => i.slice(0, -1)); return }
    if (v === 'ok') {
      if (!input) return
      clearInterval(timerRef.current)
      const correct = parseInt(input) === currentQ.answer
      skill.addEnergy()

      if (!correct) {
        if (skill.consumeShield()) { shieldRetry(); return }
        sfx.wrong()
        setFeedback('wrong')
        setFailInfo({ answer: currentQ.answer, reason: 'wrong' })
        clearTimeout(fbRef.current)
        fbRef.current = setTimeout(() => setPhase('fail'), 1000)
        return
      }

      sfx.correct()
      updatePetMood(activePet, 4)
      setFeedback('correct')
      clearTimeout(fbRef.current)
      const nextIdx = qIdx + 1
      const lastQ   = nextIdx >= Q_PER_ROUND
      const lastRnd = roundIdx >= ROUNDS.length - 1

      fbRef.current = setTimeout(() => {
        setFeedback(null)
        if (lastQ) {
          if (lastRnd) {
            setWonFirst(!multiplyCleared)
            clearMultiply()
            setPhase('victory')
            sfx.bossWin()
          } else {
            setPhase('roundPass')
            sfx.combo(3)
          }
        } else {
          skill.nextQuestion()
          setQIdx(nextIdx)
          setInput('')
          setTimeLeft(round.timeLimit)
        }
      }, 480)
      return
    }
    if (input.length < 2) setInput(i => i + v)
  }, [phase, feedback, input, currentQ, qIdx, roundIdx, round, multiplyCleared, clearMultiply, activePet, updatePetMood])

  const timerPct   = round ? Math.max(0, (timeLeft / round.timeLimit) * 100) : 100
  const timerColor = timerPct > 50 ? '#4CAF50' : timerPct > 25 ? '#FF9800' : '#F44336'

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="mt-screen" style={{ background: '#E8EAF6' }}>
      <div className="mt-top-bar">
        <button className="mt-back-btn" onClick={() => { sfx.click(); onBack() }}>← 返回</button>
      </div>
      <motion.div className="mt-card"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="mt-main-title" style={{ color: '#3949AB' }}>🔢 九九大作戰</div>

        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={100} />
        </motion.div>

        <p className="mt-desc">
          乘法除法混合出題！<br />
          連過三關就能得到傳說道具<br />
          <b style={{ color: '#3949AB', fontSize: '1.1rem' }}>🧮 算盤大師</b>！
        </p>

        <div className="mt-round-list">
          {ROUNDS.map(r => (
            <div key={r.no} className="mt-round-row" style={{ borderLeftColor: r.color }}>
              <span className="mt-round-no" style={{ color: r.color }}>第{r.no}關</span>
              <span className="mt-round-lbl">{r.label}</span>
              <span className="mt-round-time" style={{ color: r.color }}>⏱ {r.timeLimit}秒/題</span>
            </div>
          ))}
        </div>

        <p className="mt-warn">⚠️ 答錯或時間到，從第1關重新開始！</p>

        {multiplyCleared && (
          <div className="mt-cleared-badge">✅ 已獲得算盤大師！可再次挑戰</div>
        )}

        <motion.button className="btn-primary" style={{ width: '100%', maxWidth: 280 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { sfx.click(); startRound(0) }}
        >
          ⚔️ 開始挑戰！
        </motion.button>
      </motion.div>
    </div>
  )

  // ── Playing ───────────────────────────────────────────────────────────────
  if (phase === 'playing') return (
    <div className="mt-screen mt-play" style={{ background: round.bg }}>
      <div className="mt-play-header">
        <div className="mt-pips">
          {ROUNDS.map((r, i) => (
            <span key={i} className="mt-pip"
              style={{
                background: i === roundIdx ? r.color : i < roundIdx ? '#4CAF50' : '#DDD',
                color: i <= roundIdx ? 'white' : '#999',
              }}
            >第{r.no}關</span>
          ))}
        </div>
        <div className="mt-q-counter">{qIdx + 1}<span style={{ color: '#BBB' }}>/10</span></div>
      </div>

      <div className="mt-dots">
        {Array.from({ length: Q_PER_ROUND }, (_, i) => (
          <span key={i} className="mt-dot"
            style={{ background: i < qIdx ? '#4CAF50' : i === qIdx ? round.color : '#DDD' }}
          />
        ))}
      </div>

      <div className="mt-timer-wrap">
        <div className="mt-timer-track">
          <motion.div className="mt-timer-fill"
            animate={{ width: `${timerPct}%`, background: timerColor }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.span className="mt-timer-num"
          animate={{ color: timerColor, scale: timeLeft <= 3 && timeLeft > 0 ? [1, 1.25, 1] : 1 }}
          transition={{ duration: 0.25 }}
        >{timeLeft}</motion.span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} className="mt-q-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.18 }}
          style={{
            borderColor: feedback === 'correct' ? '#4CAF50' : feedback ? '#F44336' : '#E0E0E0',
            background:  feedback === 'correct' ? '#F1F8E9' : feedback ? '#FFF0F0' : 'white',
          }}
        >
          {feedback === 'correct' && (
            <motion.div className="mt-fb mt-fb-ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
          )}
          {feedback && feedback !== 'correct' && (
            <motion.div className="mt-fb mt-fb-ng" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {feedback === 'timeout' ? '⏱' : '✗'}
            </motion.div>
          )}
          <div className="mt-equation">
            {currentQ?.type === 'mult' ? (
              <>
                <span className="mt-number">{currentQ.a}</span>
                <span className="mt-plus">×</span>
                <span className="mt-blank" style={{ borderColor: input ? round.color : '#CCC', color: input ? round.color : '#CCC' }}>
                  {input || '□'}
                </span>
                <span className="mt-eq">=</span>
                <span className="mt-ten" style={{ color: '#3949AB' }}>{currentQ.product}</span>
              </>
            ) : (
              <>
                <span className="mt-number">{currentQ?.product}</span>
                <span className="mt-plus">÷</span>
                <span className="mt-number">{currentQ?.a}</span>
                <span className="mt-eq">=</span>
                <span className="mt-blank" style={{ borderColor: input ? round.color : '#CCC', color: input ? round.color : '#CCC' }}>
                  {input || '□'}
                </span>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-pad">
        <NumberPad value={input} onInput={handlePad} />
      </div>

      <SkillBar skill={skill} disabled={!!feedback} />
    </div>
  )

  // ── Round pass ────────────────────────────────────────────────────────────
  if (phase === 'roundPass') return (
    <div className="mt-screen" style={{ background: '#E8EAF6' }}>
      <motion.div className="mt-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div style={{ fontSize: '3.5rem' }}
          animate={{ rotate: [0, 15, -15, 8, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.7 }}
        >⭐</motion.div>
        <div className="mt-pass-title" style={{ color: '#3949AB' }}>第 {roundIdx + 1} 關通過！</div>

        <motion.div animate={{ y: [0, -16, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={100} />
        </motion.div>

        <div className="mt-next-hint">
          <span style={{ color: ROUNDS[roundIdx + 1].color, fontWeight: 800, fontSize: '1.15rem' }}>
            第{roundIdx + 2}關 · {ROUNDS[roundIdx + 1].label}
          </span>
          <br />
          <span style={{ color: '#666' }}>每題只有 {ROUNDS[roundIdx + 1].timeLimit} 秒！加油！</span>
        </div>

        <motion.button className="btn-primary" style={{ width: '100%', maxWidth: 260, background: '#3949AB', borderColor: '#3949AB' }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { sfx.click(); startRound(roundIdx + 1) }}
        >
          衝下一關 →
        </motion.button>
      </motion.div>
    </div>
  )

  // ── Fail ──────────────────────────────────────────────────────────────────
  if (phase === 'fail') return (
    <div className="mt-screen" style={{ background: '#FFF8F8' }}>
      <motion.div className="mt-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div style={{ fontSize: '3.5rem' }}
          animate={{ x: [0, -8, 8, -8, 0] }} transition={{ duration: 0.4 }}
        >
          {failInfo?.reason === 'timeout' ? '⏱️' : '💥'}
        </motion.div>

        <div className="mt-fail-title">
          {failInfo?.reason === 'timeout' ? '時間到！' : '答錯了！'}
        </div>

        <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={90} />

        {failInfo?.answer != null && (
          <div className="mt-ans-hint">
            答案是 <b style={{ color: '#F44336', fontSize: '1.6rem' }}>{failInfo.answer}</b> 喔！
          </div>
        )}

        <div className="mt-restart-note">從第1關重新挑戰</div>

        <motion.button className="btn-primary" style={{ width: '100%', maxWidth: 260 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { sfx.click(); startRound(0) }}
        >
          再試一次！
        </motion.button>
        <motion.button className="btn-secondary" style={{ width: '100%', maxWidth: 260, marginTop: 8 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => { sfx.click(); onBack() }}
        >
          先回去練習
        </motion.button>
      </motion.div>
    </div>
  )

  // ── Victory ───────────────────────────────────────────────────────────────
  if (phase === 'victory') return (
    <div className="mt-screen" style={{ background: 'linear-gradient(160deg, #E8EAF6, #C5CAE9)' }}>
      <motion.div className="mt-card mt-victory-card"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
      >
        <motion.div style={{ fontSize: '2.5rem', display: 'inline-block' }}
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
        >✨</motion.div>

        <div className="mt-victory-title" style={{ color: '#3949AB' }}>三關全過！</div>

        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.9, repeat: 2 }}
        >
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={110} />
        </motion.div>

        <motion.div className="mt-reward-box"
          style={{ background: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <div style={{ fontSize: '3.2rem' }}>🧮</div>
          <div className="mt-reward-name" style={{ color: '#3949AB' }}>算盤大師</div>
          <div className="mt-reward-sub">乘除法天才！</div>
          {wonFirst && (
            <motion.div className="mt-reward-coins"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }}
            >
              +500 💰 金幣
            </motion.div>
          )}
        </motion.div>

        <motion.button className="btn-primary"
          style={{ width: '100%', maxWidth: 260, background: '#3949AB', borderColor: '#3949AB' }}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => { sfx.click(); onBack() }}
        >
          太棒了！回首頁
        </motion.button>
      </motion.div>
    </div>
  )

  return null
}
