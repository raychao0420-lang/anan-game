import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import { sfx } from '../utils/sound'
import './MaketenScreen.css'

const ROUNDS = [
  { no: 1, timeLimit: 22, label: '熱身', color: '#4CAF50', bg: '#F1F8E9' },
  { no: 2, timeLimit: 14, label: '加速', color: '#FF9800', bg: '#FFF3E0' },
  { no: 3, timeLimit: 8,  label: '極速', color: '#F44336', bg: '#FFEBEE' },
]
const Q_PER_ROUND = 10

// 練習模式：時間充足、題目多、答錯不重來
const PRACTICE_TOTAL = 20
const PRACTICE_TIME  = 30
const PRACTICE_COIN  = 3   // 每答對一題送金幣
const PRACTICE_CFG   = { timeLimit: PRACTICE_TIME, color: '#1976D2', bg: '#E3F2FD', label: '練習' }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 特訓：固定 10 組配對
function makeQuestions() {
  const pairs = [
    [10,90],[20,80],[30,70],[40,60],[50,50],
    [25,75],[35,65],[45,55],[15,85],[5,95],
  ]
  const pool = []
  pairs.forEach(([a, b]) => {
    pool.push({ shown: a, answer: b, leftBlank: false })
    if (a !== b) pool.push({ shown: b, answer: a, leftBlank: true })
  })
  return shuffle(pool).slice(0, Q_PER_ROUND)
}

// 練習：5~95 所有整五配對，題庫大、抽 n 題連續練
function makePracticeQuestions(n) {
  const forms = []
  for (let a = 5; a <= 95; a += 5) {
    const b = 100 - a
    forms.push({ shown: a, answer: b, leftBlank: false })
    if (a !== b) forms.push({ shown: b, answer: a, leftBlank: true })
  }
  const out = []
  let bag = []
  while (out.length < n) {
    if (bag.length === 0) bag = shuffle([...forms])
    out.push(bag.pop())
  }
  return out
}

export default function MakeHundredScreen({ onBack }) {
  const { activePet, pets, petEquipment, makeHundredCleared, clearMakeHundred, updatePetMood, addCoins } = useGameStore()
  const petData = pets[activePet]
  const equipped = (petEquipment[activePet] || [])
    .map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)

  const [phase, setPhase]       = useState('intro')
  const [mode, setMode]         = useState('challenge')  // 'challenge' | 'practice'
  const [roundIdx, setRoundIdx] = useState(0)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx]         = useState(0)
  const [input, setInput]       = useState('')
  const [timeLeft, setTimeLeft] = useState(22)
  const [feedback, setFeedback] = useState(null)
  const [failInfo, setFailInfo] = useState(null)
  const [wonFirst, setWonFirst] = useState(false)
  const [pracCorrect, setPracCorrect] = useState(0)
  const [pracEarned, setPracEarned]   = useState(0)
  const timerRef = useRef(null)
  const fbRef    = useRef(null)

  const round      = ROUNDS[roundIdx]
  const currentQ   = questions[qIdx]
  const isPractice = mode === 'practice'
  const cfg        = isPractice ? PRACTICE_CFG : round
  const totalQ     = isPractice ? PRACTICE_TOTAL : Q_PER_ROUND

  const startRound = useCallback((rIdx) => {
    clearInterval(timerRef.current)
    clearTimeout(fbRef.current)
    setMode('challenge')
    setRoundIdx(rIdx)
    setQuestions(makeQuestions())
    setQIdx(0)
    setInput('')
    setTimeLeft(ROUNDS[rIdx].timeLimit)
    setFeedback(null)
    setFailInfo(null)
    setPhase('playing')
  }, [])

  const startPractice = useCallback(() => {
    clearInterval(timerRef.current)
    clearTimeout(fbRef.current)
    setMode('practice')
    setQuestions(makePracticeQuestions(PRACTICE_TOTAL))
    setQIdx(0)
    setInput('')
    setTimeLeft(PRACTICE_TIME)
    setFeedback(null)
    setFailInfo(null)
    setPracCorrect(0)
    setPracEarned(0)
    setPhase('playing')
  }, [])

  // 練習：答完一題後前進，或結算
  const nextPractice = useCallback((correctSoFar) => {
    const nextIdx = qIdx + 1
    if (nextIdx >= PRACTICE_TOTAL) {
      const earned = correctSoFar * PRACTICE_COIN
      if (earned > 0) addCoins(earned)
      setPracEarned(earned)
      if (correctSoFar >= PRACTICE_TOTAL * 0.9) sfx.bossWin()
      setPhase('pracDone')
    } else {
      setFeedback(null)
      setFailInfo(null)
      setQIdx(nextIdx)
      setInput('')
      setTimeLeft(PRACTICE_TIME)
    }
  }, [qIdx, addCoins])

  useEffect(() => {
    if (phase !== 'playing') { clearInterval(timerRef.current); return }
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, qIdx])

  useEffect(() => {
    if (phase !== 'playing' || timeLeft !== 0) return
    clearInterval(timerRef.current)
    sfx.wrong()
    setFeedback('timeout')
    setFailInfo({ answer: currentQ?.answer, reason: 'timeout' })
    clearTimeout(fbRef.current)
    if (isPractice) {
      fbRef.current = setTimeout(() => nextPractice(pracCorrect), 1300)
    } else {
      fbRef.current = setTimeout(() => setPhase('fail'), 1100)
    }
  }, [timeLeft, phase, currentQ, isPractice, pracCorrect, nextPractice])

  const handlePad = useCallback((v) => {
    if (phase !== 'playing' || feedback) return
    if (v === 'del') { setInput(i => i.slice(0, -1)); return }
    if (v === 'ok') {
      if (!input) return
      clearInterval(timerRef.current)
      const correct = parseInt(input) === currentQ.answer

      // ── 練習模式：答錯只看正解、不重來 ──
      if (isPractice) {
        const nextCorrect = pracCorrect + (correct ? 1 : 0)
        if (correct) {
          sfx.correct()
          updatePetMood(activePet, 2)
          setFeedback('correct')
        } else {
          sfx.wrong()
          setFeedback('wrong')
          setFailInfo({ answer: currentQ.answer, reason: 'wrong' })
        }
        setPracCorrect(nextCorrect)
        clearTimeout(fbRef.current)
        fbRef.current = setTimeout(() => nextPractice(nextCorrect), correct ? 480 : 1200)
        return
      }

      // ── 特訓模式：答錯從頭來 ──
      if (!correct) {
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
            setWonFirst(!makeHundredCleared)
            clearMakeHundred()
            setPhase('victory')
            sfx.bossWin()
          } else {
            setPhase('roundPass')
            sfx.combo(3)
          }
        } else {
          setQIdx(nextIdx)
          setInput('')
          setTimeLeft(round.timeLimit)
        }
      }, 480)
      return
    }
    if (input.length < 2) setInput(i => i + v)
  }, [phase, feedback, input, currentQ, qIdx, roundIdx, round, isPractice, pracCorrect, nextPractice, makeHundredCleared, clearMakeHundred, activePet, updatePetMood])

  const timerPct   = cfg ? Math.max(0, (timeLeft / cfg.timeLimit) * 100) : 100
  const timerColor = timerPct > 50 ? '#4CAF50' : timerPct > 25 ? '#FF9800' : '#F44336'

  // ── Intro：選模式 ───────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="mt-screen" style={{ background: '#E8F5E9' }}>
      <div className="mt-top-bar">
        <button className="mt-back-btn" onClick={() => { sfx.click(); onBack() }}>← 返回</button>
      </div>
      <motion.div className="mt-card"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="mt-main-title">💯 湊100</div>

        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={96} />
        </motion.div>

        <p className="mt-desc">兩個數字加起來剛好 <b style={{ color: '#1565C0' }}>100</b>！<br />選一個模式開始練習 👇</p>

        <div className="mt-round-list">
          <motion.button className="btn-primary" style={{ width: '100%' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { sfx.click(); startPractice() }}
          >
            🎯 練習模式
          </motion.button>
          <p className="mt-desc" style={{ marginTop: -4, fontSize: '0.82rem' }}>
            時間充足（{PRACTICE_TIME}秒）· 連續 {PRACTICE_TOTAL} 題 · 答錯看正解不重來
          </p>

          <motion.button className="btn-secondary" style={{ width: '100%', marginTop: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { sfx.click(); startRound(0) }}
          >
            ⚔️ 特訓挑戰
          </motion.button>
          <p className="mt-desc" style={{ marginTop: -4, fontSize: '0.82rem' }}>
            限時三關越來越快 · 全對才過關 · 拿 💯 百分皇冠
          </p>
        </div>

        {makeHundredCleared && (
          <div className="mt-cleared-badge">✅ 已獲得百分皇冠！</div>
        )}
      </motion.div>
    </div>
  )

  // ── Playing（特訓＋練習共用）────────────────────────────────────────────────
  if (phase === 'playing') return (
    <div className="mt-screen mt-play" style={{ background: cfg.bg }}>
      <div className="mt-play-header">
        {isPractice ? (
          <div className="mt-pips">
            <span className="mt-pip" style={{ background: cfg.color, color: 'white' }}>🎯 練習</span>
            <span className="mt-pip" style={{ background: '#E8F5E9', color: '#2E7D32' }}>✓ {pracCorrect}</span>
          </div>
        ) : (
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
        )}
        <div className="mt-q-counter">{qIdx + 1}<span style={{ color: '#BBB' }}>/{totalQ}</span></div>
      </div>

      {!isPractice && (
        <div className="mt-dots">
          {Array.from({ length: Q_PER_ROUND }, (_, i) => (
            <span key={i} className="mt-dot"
              style={{ background: i < qIdx ? '#4CAF50' : i === qIdx ? round.color : '#DDD' }}
            />
          ))}
        </div>
      )}

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
            {currentQ?.leftBlank ? (
              <>
                <span className="mt-blank" style={{ borderColor: input ? cfg.color : '#CCC', color: input ? cfg.color : '#CCC' }}>
                  {input || '□'}
                </span>
                <span className="mt-plus">+</span>
                <span className="mt-number">{currentQ.shown}</span>
              </>
            ) : (
              <>
                <span className="mt-number">{currentQ?.shown}</span>
                <span className="mt-plus">+</span>
                <span className="mt-blank" style={{ borderColor: input ? cfg.color : '#CCC', color: input ? cfg.color : '#CCC' }}>
                  {input || '□'}
                </span>
              </>
            )}
            <span className="mt-eq">=</span>
            <span className="mt-ten">100</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {isPractice && feedback && feedback !== 'correct' && (
        <div className="mt-ans-hint" style={{ marginBottom: 8 }}>
          正確答案是 <b style={{ color: '#F44336', fontSize: '1.4rem' }}>{failInfo?.answer}</b> 喔！
        </div>
      )}

      <div className="mt-pad">
        <NumberPad value={input} onInput={handlePad} />
      </div>
    </div>
  )

  // ── 練習結算 ────────────────────────────────────────────────────────────────
  if (phase === 'pracDone') {
    const pct = Math.round((pracCorrect / PRACTICE_TOTAL) * 100)
    const tier = pct >= 90 ? { t: '太厲害了！🏆', c: '#E65100' }
      : pct >= 70 ? { t: '很棒喔！🌟', c: '#2E7D32' }
      : pct >= 50 ? { t: '不錯，繼續練！💪', c: '#1976D2' }
      : { t: '多練幾次會更順！🔥', c: '#F57C00' }
    return (
      <div className="mt-screen" style={{ background: '#E3F2FD' }}>
        <motion.div className="mt-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="mt-pass-title" style={{ color: tier.c }}>{tier.t}</div>

          <motion.div animate={{ y: [0, -16, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={100} />
          </motion.div>

          <div className="mt-reward-box">
            <div style={{ fontSize: '2.6rem' }}>💯</div>
            <div className="mt-reward-name" style={{ color: '#1565C0' }}>答對 {pracCorrect} / {PRACTICE_TOTAL} 題</div>
            <div className="mt-reward-sub">正確率 {pct}%</div>
            {pracEarned > 0 && (
              <motion.div className="mt-reward-coins"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
              >
                +{pracEarned} 💰 金幣
              </motion.div>
            )}
          </div>

          <motion.button className="btn-primary" style={{ width: '100%', maxWidth: 260 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { sfx.click(); startPractice() }}
          >
            🎯 再練一輪
          </motion.button>
          <motion.button className="btn-secondary" style={{ width: '100%', maxWidth: 260, marginTop: 8 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { sfx.click(); onBack() }}
          >
            回首頁
          </motion.button>
        </motion.div>
      </div>
    )
  }

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

  // ── Fail（特訓）─────────────────────────────────────────────────────────────
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

  // ── Victory（特訓）──────────────────────────────────────────────────────────
  if (phase === 'victory') return (
    <div className="mt-screen" style={{ background: 'linear-gradient(160deg, #E3F2FD, #BBDEFB)' }}>
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
          <div style={{ fontSize: '3.2rem' }}>💯</div>
          <div className="mt-reward-name">百分皇冠</div>
          <div className="mt-reward-sub">湊百心算大師！</div>
          {wonFirst && (
            <motion.div className="mt-reward-coins"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }}
            >
              +800 💰 金幣
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
