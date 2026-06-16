import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { SHOP_ITEMS } from '../data/shop'
import { WORD_PROBLEMS, parseText } from '../data/wordProblems'
import NumberPad from '../components/NumberPad'
import PetAvatar from '../components/PetAvatar'
import ScratchPad from '../components/ScratchPad'
import { sfx } from '../utils/sound'
import './MaketenScreen.css'
import './WordProblemScreen.css'

const ROUNDS = [
  { no: 1, key: 'round1', timeLimit: 120, label: '熱身 · 加減',        color: '#26A69A', bg: '#E0F2F1', highlightLevel: 2 },
  { no: 2, key: 'round2', timeLimit: 100, label: '加速 · 乘除',        color: '#FB8C00', bg: '#FFF3E0', highlightLevel: 1 },
  { no: 3, key: 'round3', timeLimit:  90, label: '極速 · 混合 + 餘數', color: '#D81B60', bg: '#FCE4EC', highlightLevel: 0 },
]
// 所有關卡安安都要自己挑數字+選運算，差別只在題目文字的提示多寡

const Q_PER_ROUND = 5
const OPS = ['+', '−', '×', '÷']
const OP_NORMALIZE = { '+': '+', '−': '-', '-': '-', '×': '×', '÷': '÷' }

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

function extractNumbers(tokens) {
  const nums = []
  tokens.forEach(t => {
    if (t.kind === 'num') {
      const n = parseInt(t.value)
      if (!nums.includes(n)) nums.push(n)
    }
  })
  return nums
}

// 把使用者選的運算符號標準化（畫面上顯示 − ，內部比對用 -）
function normalizeOp(op) {
  return OP_NORMALIZE[op] ?? op
}

function validateEquation(step, userA, userOp, userB, userInput) {
  const result = parseInt(userInput)
  if (step.type === 'rem') {
    return { ok: result === step.answer, operandsOk: true, opOk: true, resultOk: result === step.answer }
  }
  const stepOp = step.op
  const userOpNorm = normalizeOp(userOp)
  const isComm = stepOp === '+' || stepOp === '×'
  const operandsOk = isComm
    ? (userA === step.a && userB === step.b) || (userA === step.b && userB === step.a)
    : (userA === step.a && userB === step.b)
  const opOk = userOpNorm === stepOp
  const resultOk = result === step.answer
  return { ok: operandsOk && opOk && resultOk, operandsOk, opOk, resultOk }
}

function StepDisplay({ step, status, userA, userOp, userB, input, color, onClearA, onClearOp, onClearB }) {
  // status: 'pending' | 'active' | 'cleared'
  const isActive = status === 'active'
  const isCleared = status === 'cleared'

  // 算式裡每個欄位顯示什麼值
  let aDisp, opDisp, bDisp, rDisp
  if (isCleared) {
    aDisp = step.a; opDisp = step.op; bDisp = step.b; rDisp = step.answer
  } else if (isActive) {
    aDisp = userA ?? '□'
    opDisp = userOp ?? '?'
    bDisp = userB ?? '□'
    rDisp = input || '□'
  } else {
    aDisp = '□'; opDisp = '?'; bDisp = '□'; rDisp = '□'
  }

  // 下一個應該填的格子（用於高亮提示）
  const nextSlot = isActive
    ? (userA === null ? 'a' : userOp === null ? 'op' : userB === null ? 'b' : 'r')
    : null

  const slotClass = (slot, hasValue) => {
    let cls = `wp-slot`
    if (slot === nextSlot && !hasValue) cls += ' wp-slot-next'
    if (hasValue && isActive) cls += ' wp-slot-filled'
    if (isCleared) cls += ' wp-slot-locked'
    return cls
  }

  return (
    <div className={`wp-step wp-step-${status}`} style={isActive ? { borderColor: color } : {}}>
      <div className="wp-step-label" style={isActive ? { color } : {}}>
        {isCleared ? '✓ ' : isActive ? '👉 ' : ''}
        {step.label}
      </div>

      {step.type === 'rem' ? (
        // 餘數題：a ÷ b 固定，只填餘數
        <div className="wp-eq">
          <span className="wp-num-fixed">{step.a}</span>
          <span className="wp-op-fixed">÷</span>
          <span className="wp-num-fixed">{step.b}</span>
          <span className="wp-eq-sym">的</span>
          <span className="wp-rem-tag">餘數</span>
          <span className="wp-eq-sym">=</span>
          <span className={`wp-blank ${isActive ? 'wp-blank-active' : ''} ${isCleared ? 'wp-blank-done' : ''}`}
                style={isActive ? { borderColor: color, color: input ? color : '#BBB' } : {}}>
            {rDisp}
          </span>
        </div>
      ) : (
        // 一般算式：4 個格子全部安安自己填
        <div className="wp-eq wp-eq-build">
          <button className={slotClass('a', userA !== null)}
                  style={isActive && userA !== null ? { borderColor: color, color } : (nextSlot === 'a' ? { borderColor: color, color } : {})}
                  onClick={isActive && userA !== null ? onClearA : undefined}
                  disabled={!isActive}>
            {aDisp}
          </button>
          <button className={`${slotClass('op', userOp !== null)} wp-slot-op-btn`}
                  style={isActive && userOp !== null ? { borderColor: color, color } : (nextSlot === 'op' ? { borderColor: color, color } : {})}
                  onClick={isActive && userOp !== null ? onClearOp : undefined}
                  disabled={!isActive}>
            {opDisp}
          </button>
          <button className={slotClass('b', userB !== null)}
                  style={isActive && userB !== null ? { borderColor: color, color } : (nextSlot === 'b' ? { borderColor: color, color } : {})}
                  onClick={isActive && userB !== null ? onClearB : undefined}
                  disabled={!isActive}>
            {bDisp}
          </button>
          <span className="wp-eq-sym">=</span>
          <span className={`wp-blank ${isActive ? 'wp-blank-active' : ''} ${isCleared ? 'wp-blank-done' : ''} ${nextSlot === 'r' ? 'wp-blank-next' : ''}`}
                style={isActive ? { borderColor: color, color: input ? color : '#BBB' } : {}}>
            {rDisp}
          </span>
        </div>
      )}
    </div>
  )
}

function BuildPanel({ numbers, prevValue, onTapNum, onTapOp, color, disabled }) {
  return (
    <div className="wp-build-panel">
      <div className="wp-build-row">
        <span className="wp-build-label">數字</span>
        <div className="wp-tiles">
          {numbers.map(n => (
            <motion.button key={`n-${n}`}
              className="wp-tile"
              whileTap={{ scale: disabled ? 1 : 0.86 }}
              onPointerDown={() => !disabled && onTapNum(n)}
              disabled={disabled}
            >
              {n}
            </motion.button>
          ))}
          {prevValue !== null && prevValue !== undefined && (
            <motion.button
              className="wp-tile wp-tile-prev"
              style={{ borderColor: color, color }}
              whileTap={{ scale: disabled ? 1 : 0.86 }}
              onPointerDown={() => !disabled && onTapNum(prevValue)}
              disabled={disabled}
            >
              <span className="wp-tile-prev-label">上一步</span>
              <span className="wp-tile-prev-val">{prevValue}</span>
            </motion.button>
          )}
        </div>
      </div>
      <div className="wp-build-row">
        <span className="wp-build-label">運算</span>
        <div className="wp-ops">
          {OPS.map(op => (
            <motion.button key={op}
              className="wp-op-btn"
              style={{ borderColor: color, color }}
              whileTap={{ scale: disabled ? 1 : 0.86 }}
              onPointerDown={() => !disabled && onTapOp(op)}
              disabled={disabled}
            >
              {op}
            </motion.button>
          ))}
        </div>
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
  const [userA, setUserA]       = useState(null)
  const [userOp, setUserOp]     = useState(null)
  const [userB, setUserB]       = useState(null)
  const [timeLeft, setTimeLeft] = useState(120)
  const [feedback, setFeedback] = useState(null)
  const [failInfo, setFailInfo] = useState(null)
  const [step1Value, setStep1Value] = useState(null)
  const [wonFirst, setWonFirst] = useState(false)
  const timerRef = useRef(null)
  const fbRef    = useRef(null)

  const round    = ROUNDS[roundIdx]
  const currentQ = problems[qIdx]
  const currentTokens = currentQ ? parseText(currentQ.text) : []
  const availableNumbers = currentQ ? extractNumbers(currentTokens) : []
  const currentStep = currentQ?.steps[stepIdx]

  const resetEquation = () => {
    setUserA(null); setUserOp(null); setUserB(null); setInput('')
  }

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
    setUserA(null); setUserOp(null); setUserB(null)
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
      stepLabel: failStep?.label,
      step: failStep,
    })
    clearTimeout(fbRef.current)
    fbRef.current = setTimeout(() => setPhase('fail'), 1100)
  }, [timeLeft, phase, currentQ, stepIdx])

  const tapNum = useCallback((n) => {
    if (feedback) return
    if (!currentStep || currentStep.type === 'rem') return
    sfx.click()
    if (userA === null) setUserA(n)
    else if (userB === null) setUserB(n)
  }, [feedback, currentStep, userA, userB])

  const tapOp = useCallback((op) => {
    if (feedback) return
    if (!currentStep || currentStep.type === 'rem') return
    sfx.click()
    setUserOp(op)
  }, [feedback, currentStep])

  const advanceAfterCorrect = useCallback(() => {
    const step = currentQ.steps[stepIdx]
    if (stepIdx === 0) {
      const v = step.answer
      fbRef.current = setTimeout(() => {
        setFeedback(null)
        setStep1Value(v)
        setStepIdx(1)
        resetEquation()
      }, 500)
      return
    }
    // step 2 完成
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
        resetEquation()
        setTimeLeft(round.timeLimit)
      }
    }, 600)
  }, [currentQ, stepIdx, qIdx, roundIdx, round, wordProblemCleared, clearWordProblem])

  const handlePad = useCallback((v) => {
    if (phase !== 'playing' || feedback) return
    if (v === 'del') { setInput(i => i.slice(0, -1)); return }
    if (v === '.') return
    if (v === 'ok') {
      if (!input) return
      const step = currentQ.steps[stepIdx]
      // 一般算式：要把 a/op/b 都填好才能驗算
      if (step.type === 'eq' && (userA === null || userOp === null || userB === null)) {
        sfx.wrong()
        return
      }
      clearInterval(timerRef.current)
      const result = validateEquation(step, userA, userOp, userB, input)
      if (!result.ok) {
        sfx.wrong()
        setFeedback('wrong')
        setFailInfo({
          answer: step.answer,
          reason: 'wrong',
          stepLabel: step.label,
          step,
          userA, userOp: userOp ? normalizeOp(userOp) : null, userB,
          userResult: input,
          operandsOk: result.operandsOk,
          opOk: result.opOk,
          resultOk: result.resultOk,
        })
        clearTimeout(fbRef.current)
        fbRef.current = setTimeout(() => setPhase('fail'), 1200)
        return
      }
      sfx.correct()
      setFeedback('correct')
      clearTimeout(fbRef.current)
      advanceAfterCorrect()
      return
    }
    // 數字鍵：填到 result（如果還沒選完運算式也允許先輸入結果）
    if (input.length < 3) setInput(i => i + v)
  }, [phase, feedback, input, currentQ, stepIdx, userA, userOp, userB, advanceAfterCorrect])

  const timerPct   = round ? Math.max(0, (timeLeft / round.timeLimit) * 100) : 100
  const timerColor = timerPct > 50 ? '#4CAF50' : timerPct > 25 ? '#FF9800' : '#F44336'

  // 顯示用：step 2 的「上一步」tile 值
  const prevTileValue = stepIdx === 1 ? step1Value : null

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
          每題都要<b style={{ color: '#26A69A' }}>自己組算式</b>！<br />
          點數字填到格子裡 → 選 + − × ÷ → 算出答案<br />
          連過三關得到 <b style={{ color: '#00695C', fontSize: '1.1rem' }}>🤓 智慧眼鏡</b>！
        </p>

        <div className="wp-intro-sample">
          <div className="wp-intro-label">範例：</div>
          <div className="wp-intro-text">
            安安有 <b className="wp-hl-num">12</b> 顆糖，<span className="wp-hl-topic">吃掉</span> <b className="wp-hl-num">3</b> 顆，弟弟<span className="wp-hl-topic">又給</span>他 <b className="wp-hl-num">5</b> 顆，現在有幾顆？
          </div>
          <div className="wp-intro-steps">
            <span>第一步：自己點出 <b>12 − 3 = 9</b></span>
            <span>第二步：用上一步 → <b>9 + 5 = 14</b></span>
          </div>
        </div>

        <div className="mt-round-list">
          {ROUNDS.map(r => (
            <div key={r.no} className="mt-round-row" style={{ borderLeftColor: r.color }}>
              <span className="mt-round-no" style={{ color: r.color }}>第{r.no}關</span>
              <span className="mt-round-lbl">{r.label}</span>
              <span className="mt-round-time" style={{ color: r.color }}>⏱ {r.timeLimit}秒</span>
            </div>
          ))}
        </div>

        <p className="mt-warn">⚠️ 每關 5 題，答錯或時間到要從第 1 關重來！</p>

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
  if (phase === 'playing' && currentQ) {
    const isRemStep = currentStep?.type === 'rem'
    return (
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

            <div className="wp-side-row">
              <div className="wp-side-left">
                <div className="wp-steps">
                  {currentQ.steps.map((step, i) => {
                    const status = i < stepIdx ? 'cleared' : i === stepIdx ? 'active' : 'pending'
                    return (
                      <StepDisplay
                        key={i}
                        step={step}
                        status={status}
                        userA={i === stepIdx ? userA : null}
                        userOp={i === stepIdx ? userOp : null}
                        userB={i === stepIdx ? userB : null}
                        input={i === stepIdx ? input : ''}
                        color={round.color}
                        onClearA={() => { sfx.click(); setUserA(null) }}
                        onClearOp={() => { sfx.click(); setUserOp(null) }}
                        onClearB={() => { sfx.click(); setUserB(null) }}
                      />
                    )
                  })}
                </div>

                {!isRemStep && (
                  <BuildPanel
                    numbers={availableNumbers}
                    prevValue={prevTileValue}
                    onTapNum={tapNum}
                    onTapOp={tapOp}
                    color={round.color}
                    disabled={!!feedback}
                  />
                )}
              </div>

              <div className="wp-side-right">
                <ScratchPad key={`scratch-${qIdx}`} fill />
              </div>
            </div>

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
                  {feedback === 'timeout' ? '⏱ 時間到！' : '✗ 再想想看！'}
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
          <span style={{ color: '#666' }}>
            {roundIdx + 1 === 1
              ? '進入乘除題，提示變少了！'
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
  if (phase === 'fail') {
    const fi = failInfo || {}
    const step = fi.step
    const showOpHint = step?.type === 'eq' && fi.opOk === false
    const showOperandHint = step?.type === 'eq' && fi.operandsOk === false
    return (
      <div className="mt-screen" style={{ background: '#FFF8F8' }}>
        <motion.div className="mt-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div style={{ fontSize: '3.5rem' }}
            animate={{ x: [0, -8, 8, -8, 0] }} transition={{ duration: 0.4 }}
          >
            {fi.reason === 'timeout' ? '⏱️' : '💥'}
          </motion.div>

          <div className="mt-fail-title">
            {fi.reason === 'timeout' ? '時間到！' : '答錯了！'}
          </div>

          <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage} equipped={equipped} size={80} />

          {fi.stepLabel && (
            <div className="wp-fail-step">{fi.stepLabel}</div>
          )}

          {step?.type === 'eq' && (
            <div className="wp-fail-eq-box">
              <div className="wp-fail-eq-row">
                <span>正解</span>
                <b>{step.a} {step.op} {step.b} = {step.answer}</b>
              </div>
              {fi.reason === 'wrong' && (fi.userA !== null || fi.userOp || fi.userB !== null || fi.userResult) && (
                <div className="wp-fail-eq-row wp-fail-eq-yours">
                  <span>你寫的</span>
                  <b>
                    {fi.userA ?? '□'} {fi.userOp ?? '?'} {fi.userB ?? '□'} = {fi.userResult || '□'}
                  </b>
                </div>
              )}
              <div className="wp-fail-hint-row">
                {showOperandHint && <span className="wp-fail-tag">數字選錯</span>}
                {showOpHint && <span className="wp-fail-tag">運算選錯</span>}
                {step?.type === 'eq' && fi.operandsOk && fi.opOk && fi.resultOk === false && <span className="wp-fail-tag">計算錯</span>}
              </div>
            </div>
          )}

          {step?.type === 'rem' && fi.answer != null && (
            <div className="mt-ans-hint">
              {step.a} ÷ {step.b} 餘數是 <b style={{ color: '#F44336', fontSize: '1.6rem' }}>{fi.answer}</b>
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
  }

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
