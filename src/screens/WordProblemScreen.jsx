import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { SHOP_ITEMS } from '../data/shop'
import { WORD_PROBLEMS, parseText } from '../data/wordProblems'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import { sfx } from '../utils/sound'
import './MaketenScreen.css'
import './WordProblemScreen.css'

const ROUNDS = [
  { no: 1, key: 'round1', timeLimit: 60, label: '熱身 · 加減',         color: '#26A69A', bg: '#E0F2F1', highlightLevel: 2, pickOp: false },
  { no: 2, key: 'round2', timeLimit: 60, label: '加速 · 乘除 + 選運算', color: '#FB8C00', bg: '#FFF3E0', highlightLevel: 1, pickOp: true  },
  { no: 3, key: 'round3', timeLimit: 50, label: '極速 · 全靠自己',     color: '#D81B60', bg: '#FCE4EC', highlightLevel: 0, pickOp: true  },
]
// highlightLevel: 2 = 數字+關鍵詞全亮, 1 = 只亮數字, 0 = 全素
// pickOp: true 表示算式裡的運算符號要安安自己選

const Q_PER_ROUND = 5

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ProblemText({ tokens, level }) {
  return (
    <div className="wp-problem-text">
      {tokens.map((tok, i) => {
        if (tok.kind === 'text') return <span key={i}>{tok.value}</span>
        if (tok.kind === 'num') {
          const cls = level >= 1 ? 'wp-hl-num' : 'wp-plain-num'
          return <b key={i} className={cls}>{tok.value}</b>
        }
        if (tok.kind === 'topic') {
          const cls = level >= 2 ? 'wp-hl-topic' : 'wp-plain-topic'
          return <span key={i} className={cls}>{tok.value}</span>
        }
        return null
      })}
    </div>
  )
}

function StepRow({ step, status, input, color, pickOp, pickedOp, onResetOp }) {
  // status: 'pending' | 'active' | 'cleared'
  const blankCls = `wp-blank ${status === 'active' ? 'wp-blank-active' : ''} ${status === 'cleared' ? 'wp-blank-done' : ''}`
  const blankStyle = status === 'active'
    ? { borderColor: input ? color : color, color: input ? color : '#BBB' }
    : {}
  const showVal = status === 'cleared' ? step.answer : (status === 'active' ? (input || '□') : '□')

  // 顯示用的運算符號：若是 pickOp 關卡，依「安安已選 / 還沒選」決定
  const needPickOp = pickOp && step.type === 'eq' && status !== 'cleared'
  const displayOp = step.type === 'rem'
    ? '÷'
    : needPickOp
      ? (pickedOp || '?')
      : step.op
  const opClickable = needPickOp && pickedOp && status === 'active'

  return (
    <div className={`wp-step wp-step-${status}`} style={status === 'active' ? { borderColor: color } : {}}>
      <div className="wp-step-label" style={status === 'active' ? { color } : {}}>
        {status === 'cleared' ? '✓ ' : status === 'active' ? '👉 ' : ''}
        {step.label}
      </div>
      {step.type === 'rem' ? (
        <div className="wp-eq">
          <span className="wp-num">{step.a}</span>
          <span className="wp-op">÷</span>
          <span className="wp-num">{step.b}</span>
          <span className="wp-eq-sym">的</span>
          <span className="wp-rem-tag">餘數</span>
          <span className="wp-eq-sym">=</span>
          <span className={blankCls} style={blankStyle}>{showVal}</span>
        </div>
      ) : (
        <div className="wp-eq">
          <span className="wp-num">{step.a}</span>
          <span
            className={`wp-op ${needPickOp && !pickedOp ? 'wp-op-empty' : ''} ${opClickable ? 'wp-op-clickable' : ''}`}
            style={needPickOp ? { color } : {}}
            onClick={opClickable ? onResetOp : undefined}
          >
            {displayOp}
          </span>
          <span className="wp-num">{step.b}</span>
          <span className="wp-eq-sym">=</span>
          <span className={blankCls} style={blankStyle}>{showVal}</span>
        </div>
      )}
    </div>
  )
}

function OpPicker({ onPick, color }) {
  const ops = ['+', '-', '×', '÷']
  return (
    <div className="wp-op-picker" style={{ borderColor: color }}>
      <div className="wp-op-picker-label" style={{ color }}>選運算 ⬇</div>
      <div className="wp-op-buttons">
        {ops.map(op => (
          <motion.button
            key={op}
            className="wp-op-btn"
            style={{ borderColor: color, color }}
            whileTap={{ scale: 0.86 }}
            onPointerDown={() => onPick(op)}
          >
            {op}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function WordProblemScreen({ onBack }) {
  const { activePet, pets, petEquipment, wordProblemCleared, clearWordProblem } = useGameStore()
  const petData = pets[activePet]
  const equipped = (petEquipment[activePet] || [])
    .map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)

  const [phase, setPhase]       = useState('intro')
  const [roundIdx, setRoundIdx] = useState(0)
  const [problems, setProblems] = useState([])
  const [qIdx, setQIdx]         = useState(0)
  const [stepIdx, setStepIdx]   = useState(0)
  const [input, setInput]       = useState('')
  const [pickedOp, setPickedOp] = useState(null)  // pickOp 關卡：當前 step 選的運算
  const [timeLeft, setTimeLeft] = useState(60)
  const [feedback, setFeedback] = useState(null)
  const [failInfo, setFailInfo] = useState(null)
  const [step1Value, setStep1Value] = useState(null)
  const [wonFirst, setWonFirst] = useState(false)
  const timerRef = useRef(null)
  const fbRef    = useRef(null)

  const round    = ROUNDS[roundIdx]
  const currentQ = problems[qIdx]
  const currentTokens = currentQ ? parseText(currentQ.text) : []

  const startRound = useCallback((rIdx) => {
    clearInterval(timerRef.current)
    clearTimeout(fbRef.current)
    const r = ROUNDS[rIdx]
    setRoundIdx(rIdx)
    setProblems(shuffle(WORD_PROBLEMS[r.key]).slice(0, Q_PER_ROUND))
    setQIdx(0)
    setStepIdx(0)
    setStep1Value(null)
    setInput('')
    setPickedOp(null)
    setTimeLeft(r.timeLimit)
    setFeedback(null)
    setFailInfo(null)
    setPhase('playing')
  }, [])

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
    const failStep = currentQ?.steps[stepIdx]
    setFeedback('timeout')
    setFailInfo({
      answer: failStep?.answer,
      reason: 'timeout',
      problem: currentQ?.text,
      stepLabel: failStep?.label,
      correctOp: failStep?.type === 'eq' ? failStep?.op : null,
      pickedOp: round.pickOp ? pickedOp : null,
    })
    clearTimeout(fbRef.current)
    fbRef.current = setTimeout(() => setPhase('fail'), 1100)
  }, [timeLeft, phase, currentQ, stepIdx, round, pickedOp])

  const handlePad = useCallback((v) => {
    if (phase !== 'playing' || feedback) return
    if (v === 'del') { setInput(i => i.slice(0, -1)); return }
    if (v === '.') return // word problems don't need decimal
    if (v === 'ok') {
      if (!input) return
      const step = currentQ.steps[stepIdx]
      // pickOp 關卡且為一般算式 → 必須先選運算
      if (round.pickOp && step.type === 'eq' && !pickedOp) {
        sfx.wrong()
        return
      }
      const correct = parseInt(input) === step.answer
      clearInterval(timerRef.current)

      if (!correct) {
        sfx.wrong()
        setFeedback('wrong')
        setFailInfo({
          answer: step.answer,
          reason: 'wrong',
          problem: currentQ.text,
          stepLabel: step.label,
          correctOp: step.type === 'eq' ? step.op : null,
          pickedOp: round.pickOp ? pickedOp : null,
        })
        clearTimeout(fbRef.current)
        fbRef.current = setTimeout(() => setPhase('fail'), 1100)
        return
      }

      sfx.correct()
      setFeedback('correct')
      clearTimeout(fbRef.current)

      // step1 → step2
      if (stepIdx === 0) {
        const newStep1Value = step.answer
        fbRef.current = setTimeout(() => {
          setFeedback(null)
          setStep1Value(newStep1Value)
          setStepIdx(1)
          setInput('')
          setPickedOp(null)
        }, 500)
        return
      }

      // step2 完成 → 下一題或關卡通過
      const nextQ = qIdx + 1
      const lastQ = nextQ >= Q_PER_ROUND
      const lastRnd = roundIdx >= ROUNDS.length - 1

      fbRef.current = setTimeout(() => {
        setFeedback(null)
        if (lastQ) {
          if (lastRnd) {
            setWonFirst(!wordProblemCleared)
            clearWordProblem()
            setPhase('victory')
            sfx.bossWin()
          } else {
            setPhase('roundPass')
            sfx.combo(3)
          }
        } else {
          setQIdx(nextQ)
          setStepIdx(0)
          setStep1Value(null)
          setInput('')
          setPickedOp(null)
          setTimeLeft(round.timeLimit)
        }
      }, 600)
    } else {
      if (input.length < 3) setInput(i => i + v)
    }
  }, [phase, feedback, input, currentQ, stepIdx, qIdx, roundIdx, round, pickedOp, wordProblemCleared, clearWordProblem])

  const handlePickOp = useCallback((op) => {
    if (feedback) return
    sfx.click()
    setPickedOp(op)
  }, [feedback])

  const timerPct   = round ? Math.max(0, (timeLeft / round.timeLimit) * 100) : 100
  const timerColor = timerPct > 50 ? '#4CAF50' : timerPct > 25 ? '#FF9800' : '#F44336'

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="mt-screen" style={{ background: '#E0F2F1' }}>
      <div className="mt-top-bar">
        <button className="mt-back-btn" onClick={() => { sfx.click(); onBack() }}>← 返回</button>
      </div>
      <motion.div className="mt-card"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="mt-main-title">🤓 兩步應用題</div>

        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={100} />
        </motion.div>

        <p className="mt-desc">
          看懂題目最重要！每題分兩步驟，<br />
          越後面提示越少，要自己想<b style={{ color: '#FB8C00' }}>運算符號</b>！<br />
          連過三關得到 <b style={{ color: '#00695C', fontSize: '1.1rem' }}>🤓 智慧眼鏡</b>！
        </p>

        <div className="wp-intro-sample">
          <div className="wp-intro-label">範例（熱身關有提示）：</div>
          <div className="wp-intro-text">
            安安有 <b className="wp-hl-num">12</b> 顆糖，<span className="wp-hl-topic">吃掉</span> <b className="wp-hl-num">3</b> 顆，弟弟<span className="wp-hl-topic">又給</span>他 <b className="wp-hl-num">5</b> 顆，現在有幾顆？
          </div>
          <div className="wp-intro-steps">
            <span>第一步：12 - 3 = 9</span>
            <span>第二步：9 + 5 = 14</span>
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

        <p className="mt-warn">⚠️ 每題 5 道、共 3 關，答錯或時間到要從第 1 關重來！</p>

        {wordProblemCleared && (
          <div className="mt-cleared-badge">✅ 已獲得智慧眼鏡！可再次挑戰</div>
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
  if (phase === 'playing' && currentQ) return (
    <div className="mt-screen mt-play wp-play" style={{ background: round.bg }}>
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
        <div className="mt-q-counter">{qIdx + 1}<span style={{ color: '#BBB' }}>/{Q_PER_ROUND}</span></div>
      </div>

      <div className="mt-timer-wrap">
        <div className="mt-timer-track">
          <motion.div className="mt-timer-fill"
            animate={{ width: `${timerPct}%`, background: timerColor }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.span className="mt-timer-num"
          animate={{ color: timerColor, scale: timeLeft <= 5 && timeLeft > 0 ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.25 }}
        >{timeLeft}</motion.span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} className="wp-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <ProblemText tokens={currentTokens} level={round.highlightLevel} />

          <div className="wp-steps">
            {currentQ.steps.map((step, i) => {
              const status = i < stepIdx ? 'cleared' : i === stepIdx ? 'active' : 'pending'
              return (
                <StepRow
                  key={i}
                  step={step}
                  status={status}
                  input={i === stepIdx ? input : ''}
                  color={round.color}
                  pickOp={round.pickOp}
                  pickedOp={i === stepIdx ? pickedOp : (status === 'cleared' ? step.op : null)}
                  onResetOp={() => { sfx.click(); setPickedOp(null) }}
                />
              )
            })}
          </div>

          {/* pickOp 關卡：當前 step 是一般算式且還沒選運算時，顯示運算選擇器 */}
          {round.pickOp
            && currentQ.steps[stepIdx]?.type === 'eq'
            && !pickedOp
            && !feedback && (
              <OpPicker onPick={handlePickOp} color={round.color} />
          )}

          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div className="wp-fb wp-fb-ok"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {stepIdx === 0 ? '✓ 第一步答對！' : '🎉 全部答對！'}
              </motion.div>
            )}
            {feedback && feedback !== 'correct' && (
              <motion.div className="wp-fb wp-fb-ng"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {feedback === 'timeout' ? '⏱ 時間到！' : '✗ 答錯了！'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="mt-pad wp-pad">
        <NumberPad value={input} onInput={handlePad} />
      </div>
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
          <span style={{ color: '#666' }}>
            {roundIdx + 1 === 1
              ? '要自己選 + − × ÷ 喔！'
              : '沒有顏色提示，全部自己想！'}
          </span>
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

        <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={80} />

        {failInfo?.stepLabel && (
          <div className="wp-fail-step">{failInfo.stepLabel}</div>
        )}
        {failInfo?.correctOp && failInfo?.pickedOp && failInfo.pickedOp !== failInfo.correctOp && (
          <div className="wp-fail-op-hint">
            💡 你選了 <b className="wp-op-wrong">{failInfo.pickedOp}</b>，
            正解是 <b className="wp-op-right">{failInfo.correctOp}</b>
          </div>
        )}
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
    <div className="mt-screen" style={{ background: 'linear-gradient(160deg, #E0F2F1, #FCE4EC)' }}>
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
          <div style={{ fontSize: '3.2rem' }}>🤓</div>
          <div className="mt-reward-name">智慧眼鏡</div>
          <div className="mt-reward-sub">讀題理解小天才！</div>
          {wonFirst && (
            <motion.div className="mt-reward-coins"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }}
            >
              +700 💰 金幣
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
