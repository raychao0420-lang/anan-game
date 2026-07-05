import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { SHOP_ITEMS } from '../data/shop'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import { SkillBar } from '../components/PetSkillButton'
import { usePetSkill } from '../hooks/usePetSkill'
import { sfx } from '../utils/sound'
import './MaketenScreen.css'
import './CrossEqualsScreen.css'

const ROUNDS = [
  { no: 1, timeLimit: 20, label: '熱身', color: '#7E57C2', bg: '#F3E5F5', maxF: 5 },
  { no: 2, timeLimit: 12, label: '加速', color: '#5E35B1', bg: '#EDE7F6', maxF: 7 },
  { no: 3, timeLimit: 7,  label: '極速', color: '#4527A0', bg: '#E1D9F5', maxF: 9 },
]
const Q_PER_ROUND = 10

// 題型權重：搬家題（DIV_DIVIDEND）最重要，加重出現
// 0: a × □ = c   →   □ = c ÷ a
// 1: □ × b = c   →   □ = c ÷ b
// 2: c ÷ a = □   →   □ = c ÷ a   (基本除法)
// 3: c ÷ □ = b   →   □ = c ÷ b   (找除數)
// 4: □ ÷ a = b   →   □ = a × b   (搬家！除法變乘法)
const FORM_WEIGHTS = [1, 1, 2, 2, 3]

function pickForm() {
  const total = FORM_WEIGHTS.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < FORM_WEIGHTS.length; i++) {
    r -= FORM_WEIGHTS[i]
    if (r <= 0) return i
  }
  return FORM_WEIGHTS.length - 1
}

function makeOne(maxF) {
  const a = Math.floor(Math.random() * (maxF - 1)) + 2  // 2..maxF
  const b = Math.floor(Math.random() * (maxF - 1)) + 2
  const c = a * b
  const form = pickForm()
  // tokens: [left, op, right, '=', result] — exactly one is null (the blank)
  switch (form) {
    case 0: return { form, tokens: [a,   '×', null, '=', c],   answer: b, hint: '找因數' }
    case 1: return { form, tokens: [null,'×', b,    '=', c],   answer: a, hint: '找因數' }
    case 2: return { form, tokens: [c,   '÷', a,    '=', null],answer: b, hint: '直接除' }
    case 3: return { form, tokens: [c,   '÷', null, '=', b],   answer: a, hint: '找除數' }
    case 4: return { form, tokens: [null,'÷', a,    '=', b],   answer: c, hint: '🔄 搬家！變乘法' }
    default: return { form: 0, tokens: [a, '×', null, '=', c], answer: b, hint: '找因數' }
  }
}

function makeQuestions(maxF) {
  // 確保每輪至少 2 題搬家題
  const qs = []
  let dividendCount = 0
  while (qs.length < Q_PER_ROUND) {
    const q = makeOne(maxF)
    if (q.form === 4) dividendCount++
    qs.push(q)
  }
  // 如果不夠 2 題搬家題，硬塞
  if (dividendCount < 2) {
    for (let i = 0; i < 2 - dividendCount; i++) {
      const a = Math.floor(Math.random() * (maxF - 1)) + 2
      const b = Math.floor(Math.random() * (maxF - 1)) + 2
      qs[i] = { form: 4, tokens: [null, '÷', a, '=', b], answer: a * b, hint: '🔄 搬家！變乘法' }
    }
    // 重新洗牌
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[qs[i], qs[j]] = [qs[j], qs[i]]
    }
  }
  return qs
}

function EqDisplay({ tokens, input, round }) {
  const blankStyle = {
    borderColor: input ? round.color : '#CCC',
    color: input ? round.color : '#CCC',
  }
  return (
    <div className="ce-equation">
      {tokens.map((t, i) => {
        if (t === null) {
          return (
            <span key={i} className="mt-blank ce-blank" style={blankStyle}>
              {input || '□'}
            </span>
          )
        }
        if (t === '×' || t === '÷') {
          return <span key={i} className="ce-op">{t}</span>
        }
        if (t === '=') {
          return <span key={i} className="ce-eq">=</span>
        }
        return <span key={i} className="ce-num">{t}</span>
      })}
    </div>
  )
}

export default function CrossEqualsScreen({ onBack }) {
  const { activePet, pets, petEquipment, crossEqualsCleared, clearCrossEquals, updatePetMood, addCoins } = useGameStore()
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
    setQuestions(makeQuestions(ROUNDS[rIdx].maxF))
    setQIdx(0)
    setInput('')
    setTimeLeft(ROUNDS[rIdx].timeLimit)
    setFeedback(null)
    setFailInfo(null)
    skill.nextQuestion()
    setPhase('playing')
  }, [])

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
    setFailInfo({ answer: currentQ?.answer, reason: 'timeout', hint: currentQ?.hint })
    clearTimeout(fbRef.current)
    fbRef.current = setTimeout(() => setPhase('fail'), 1100)
  }, [timeLeft, phase, currentQ])

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
        setFailInfo({ answer: currentQ.answer, reason: 'wrong', hint: currentQ.hint })
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
            setWonFirst(!crossEqualsCleared)
            clearCrossEquals()
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
  }, [phase, feedback, input, currentQ, qIdx, roundIdx, round, crossEqualsCleared, clearCrossEquals, activePet, updatePetMood])

  const timerPct   = round ? Math.max(0, (timeLeft / round.timeLimit) * 100) : 100
  const timerColor = timerPct > 50 ? '#4CAF50' : timerPct > 25 ? '#FF9800' : '#F44336'

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="mt-screen" style={{ background: '#F3E5F5' }}>
      <div className="mt-top-bar">
        <button className="mt-back-btn" onClick={() => { sfx.click(); onBack() }}>← 返回</button>
      </div>
      <motion.div className="mt-card"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="mt-main-title">⚖️ 等號搬家</div>

        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={100} />
        </motion.div>

        <p className="mt-desc">
          訓練乘除互換的邏輯！<br />
          看懂 <b style={{ color: '#5E35B1' }}>□ ÷ 3 = 6</b> 就是 <b style={{ color: '#5E35B1' }}>□ = 3 × 6</b><br />
          連過三關得到 <b style={{ color: '#4527A0', fontSize: '1.1rem' }}>⚖️ 等號天秤</b>！
        </p>

        <div className="ce-form-preview">
          <div className="ce-form-row"><span>找因數</span><b>3 × □ = 12</b></div>
          <div className="ce-form-row"><span>找答案</span><b>12 ÷ 4 = □</b></div>
          <div className="ce-form-row"><span>找除數</span><b>12 ÷ □ = 4</b></div>
          <div className="ce-form-row ce-form-key">
            <span>🔄 搬家</span><b>□ ÷ 3 = 4</b><em>= 3×4</em>
          </div>
        </div>

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

        {crossEqualsCleared && (
          <div className="mt-cleared-badge">✅ 已獲得等號天秤！可再次挑戰</div>
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
        <motion.div key={qIdx} className="mt-q-card ce-q-card"
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
          {currentQ?.form === 4 && !feedback && (
            <div className="ce-hint-pill" style={{ background: round.color }}>🔄 搬家題</div>
          )}
          {currentQ && <EqDisplay tokens={currentQ.tokens} input={input} round={round} />}
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
    <div className="mt-screen" style={{ background: '#F1F8E9' }}>
      <motion.div className="mt-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div style={{ fontSize: '3.5rem' }}
          animate={{ rotate: [0, 15, -15, 8, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.7 }}
        >⭐</motion.div>
        <div className="mt-pass-title">第 {roundIdx + 1} 關通過！</div>

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

        <motion.button className="btn-primary" style={{ width: '100%', maxWidth: 260 }}
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
            {failInfo.hint && (
              <div style={{ fontSize: '0.85rem', color: '#7E57C2', marginTop: 6 }}>
                💡 提示：{failInfo.hint}
              </div>
            )}
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
    <div className="mt-screen" style={{ background: 'linear-gradient(160deg, #F3E5F5, #D1C4E9)' }}>
      <motion.div className="mt-card mt-victory-card"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
      >
        <motion.div style={{ fontSize: '2.5rem', display: 'inline-block' }}
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
        >✨</motion.div>

        <div className="mt-victory-title">三關全過！</div>

        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.9, repeat: 2 }}
        >
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={110} />
        </motion.div>

        <motion.div className="mt-reward-box"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <div style={{ fontSize: '3.2rem' }}>⚖️</div>
          <div className="mt-reward-name">等號天秤</div>
          <div className="mt-reward-sub">乘除互換邏輯大師！</div>
          {wonFirst && (
            <motion.div className="mt-reward-coins"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }}
            >
              +600 💰 金幣
            </motion.div>
          )}
        </motion.div>

        <motion.button className="btn-primary" style={{ width: '100%', maxWidth: 260 }}
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
