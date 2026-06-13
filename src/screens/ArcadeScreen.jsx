import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { sfx } from '../utils/sound'
import './ArcadeScreen.css'

const GAMES = [
  {
    id: 'lightning', name: '閃電60秒', emoji: '⚡',
    cost: 100, reward: '每題 +20 💰',
    color: '#FF9800', bg: '#FFF3E0',
    desc: '60秒內答越多題越好，每答對一題得20金幣！',
  },
  {
    id: 'allin', name: '一題定江山', emoji: '🎯',
    cost: 200, reward: '答對得 700 💰',
    color: '#E91E63', bg: '#FCE4EC',
    desc: '只有一題！5秒內答對得700金幣，答錯全輸！',
  },
  {
    id: 'gauntlet', name: '傳說連十關', emoji: '🏆',
    cost: 500, reward: '全過得 2000 💰',
    color: '#6C63FF', bg: '#EDE7F6',
    desc: '10題全對才算過，有一題答錯就輸！',
  },
]

function makeQ(level) {
  if (level === 1) {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    if (Math.random() > 0.5) return { text: `${a} + ${b}`, answer: a + b }
    const [big, sml] = a >= b ? [a, b] : [b, a]
    return { text: `${big} - ${sml}`, answer: big - sml }
  }
  if (level === 2) {
    const a = Math.floor(Math.random() * 4) + 2
    const b = Math.floor(Math.random() * 8) + 2
    return { text: `${a} × ${b}`, answer: a * b }
  }
  const type = Math.floor(Math.random() * 3)
  if (type === 0) {
    const a = Math.floor(Math.random() * 30) + 10
    const b = Math.floor(Math.random() * 20) + 5
    return { text: `${a} + ${b}`, answer: a + b }
  }
  if (type === 1) {
    const a = Math.floor(Math.random() * 40) + 20
    const b = Math.floor(Math.random() * 18) + 2
    return { text: `${a} - ${b}`, answer: a - b }
  }
  const a = Math.floor(Math.random() * 6) + 2
  const b = Math.floor(Math.random() * 8) + 2
  return { text: `${a} × ${b}`, answer: a * b }
}

function ArcadePad({ onInput, disabled }) {
  const keys = ['7','8','9','4','5','6','1','2','3','←','0','✓']
  return (
    <div className="arc-pad">
      {keys.map(k => (
        <motion.button key={k}
          className={`arc-pad-btn ${k === '←' ? 'del' : k === '✓' ? 'ok' : ''}`}
          disabled={disabled}
          onPointerDown={() => !disabled && onInput(k === '←' ? 'del' : k === '✓' ? 'ok' : k)}
          whileTap={{ scale: disabled ? 1 : 0.85 }}
          transition={{ duration: 0.07 }}
        >{k}</motion.button>
      ))}
    </div>
  )
}

export default function ArcadeScreen({ onBack }) {
  const { coins, addCoins } = useGameStore()
  const [screen, setScreen]   = useState('hub')
  const [gameId, setGameId]   = useState(null)
  const [input, setInput]     = useState('')
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  // lightning
  const [score, setScore]     = useState(0)
  const [currentQ, setCurrentQ] = useState(null)
  // gauntlet
  const [qList, setQList]     = useState([])
  const [qIdx, setQIdx]       = useState(0)
  const [resultData, setResultData] = useState(null)

  const timerRef = useRef(null)
  const fbRef    = useRef(null)

  const startGame = (id) => {
    const game = GAMES.find(g => g.id === id)
    if (coins < game.cost) return
    sfx.click()
    addCoins(-game.cost)
    setGameId(id)
    setInput('')
    setFeedback(null)
    setScore(0)
    setResultData(null)

    if (id === 'lightning') {
      setCurrentQ(makeQ(1))
      setTimeLeft(60)
      setScreen('l_play')
    } else if (id === 'allin') {
      setCurrentQ(makeQ(2))
      setTimeLeft(5)
      setScreen('a_play')
    } else if (id === 'gauntlet') {
      const qs = Array.from({ length: 10 }, () => makeQ(3))
      setQList(qs)
      setQIdx(0)
      setCurrentQ(qs[0])
      setTimeLeft(8)
      setScreen('g_play')
    }
  }

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const playing = screen === 'l_play' || screen === 'a_play' || screen === 'g_play'
    if (!playing) { clearInterval(timerRef.current); return }
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen, qIdx])

  // Timeout handling
  useEffect(() => {
    if (timeLeft !== 0) return
    if (screen === 'l_play') {
      clearInterval(timerRef.current)
      setScreen('l_end')
    } else if (screen === 'a_play') {
      clearInterval(timerRef.current)
      sfx.wrong()
      setResultData({ win: false, earned: 0, cost: GAMES.find(g => g.id === 'allin').cost })
      setScreen('result')
    } else if (screen === 'g_play') {
      clearInterval(timerRef.current)
      sfx.wrong()
      setFeedback('timeout')
      clearTimeout(fbRef.current)
      fbRef.current = setTimeout(() => {
        setResultData({ win: false, earned: 0, cost: GAMES.find(g => g.id === 'gauntlet').cost })
        setScreen('result')
      }, 900)
    }
  }, [timeLeft, screen])

  // ── Input handler ─────────────────────────────────────────────────────────
  const handleInput = useCallback((v) => {
    if (feedback) return
    if (v === 'del') { setInput(i => i.slice(0, -1)); return }
    if (v === 'ok') {
      if (!input) return
      clearInterval(timerRef.current)
      const ans = parseInt(input)
      const correct = ans === currentQ?.answer

      if (screen === 'l_play') {
        if (correct) {
          sfx.correct()
          setScore(s => s + 1)
          setFeedback('correct')
          clearTimeout(fbRef.current)
          fbRef.current = setTimeout(() => {
            setFeedback(null)
            setInput('')
            setCurrentQ(makeQ(1))
            setTimeLeft(t => t)
          }, 350)
        } else {
          sfx.wrong()
          setFeedback('wrong')
          clearTimeout(fbRef.current)
          fbRef.current = setTimeout(() => {
            setFeedback(null)
            setInput('')
            setCurrentQ(makeQ(1))
          }, 400)
        }
        // re-start timer after feedback
        return
      }

      if (screen === 'a_play') {
        if (correct) {
          sfx.bossWin()
          setResultData({ win: true, earned: 700, cost: 200 })
          addCoins(700)
          setScreen('result')
        } else {
          sfx.wrong()
          setResultData({ win: false, earned: 0, cost: 200 })
          setScreen('result')
        }
        return
      }

      if (screen === 'g_play') {
        if (correct) {
          sfx.correct()
          setFeedback('correct')
          clearTimeout(fbRef.current)
          const next = qIdx + 1
          fbRef.current = setTimeout(() => {
            setFeedback(null)
            setInput('')
            if (next >= 10) {
              sfx.bossWin()
              addCoins(2000)
              setResultData({ win: true, earned: 2000, cost: 500 })
              setScreen('result')
            } else {
              setQIdx(next)
              setCurrentQ(qList[next])
              setTimeLeft(8)
            }
          }, 420)
        } else {
          sfx.wrong()
          setFeedback('wrong')
          clearTimeout(fbRef.current)
          fbRef.current = setTimeout(() => {
            setResultData({ win: false, earned: 0, cost: 500 })
            setScreen('result')
          }, 800)
        }
        return
      }
    }
    if (input.length < 3) setInput(i => i + v)
  }, [input, feedback, currentQ, screen, qIdx, qList, addCoins])

  // ── Resume timer after lightning feedback ─────────────────────────────────
  useEffect(() => {
    if (screen !== 'l_play' || feedback) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [feedback, screen])

  const game = GAMES.find(g => g.id === gameId)

  // ── Hub ───────────────────────────────────────────────────────────────────
  if (screen === 'hub') return (
    <div className="arc-screen">
      <div className="arc-top-bar">
        <button className="arc-back-btn" onClick={() => { sfx.click(); onBack() }}>← 返回</button>
        <div className="arc-coins-badge">💰 {coins}</div>
      </div>

      <motion.div className="arc-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🎮 迷你遊戲場
      </motion.div>

      <div className="arc-game-list">
        {GAMES.map((g, i) => {
          const canAfford = coins >= g.cost
          return (
            <motion.div key={g.id} className="arc-game-card"
              style={{ borderColor: g.color, opacity: canAfford ? 1 : 0.55 }}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: canAfford ? 1 : 0.55 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="arc-game-icon" style={{ background: g.bg, color: g.color }}>
                {g.emoji}
              </div>
              <div className="arc-game-info">
                <div className="arc-game-name" style={{ color: g.color }}>{g.name}</div>
                <div className="arc-game-desc">{g.desc}</div>
                <div className="arc-game-reward" style={{ color: g.color }}>✨ {g.reward}</div>
              </div>
              <motion.button
                className="arc-enter-btn"
                style={{ background: canAfford ? g.color : '#CCC' }}
                disabled={!canAfford}
                whileTap={{ scale: canAfford ? 0.92 : 1 }}
                onClick={() => startGame(g.id)}
              >
                {g.cost} 💰<br /><span style={{ fontSize: '0.7rem' }}>入場</span>
              </motion.button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  const timerPct = screen === 'l_play' ? (timeLeft / 60) * 100
    : screen === 'a_play' ? (timeLeft / 5) * 100
    : (timeLeft / 8) * 100
  const timerColor = timerPct > 50 ? '#4CAF50' : timerPct > 25 ? '#FF9800' : '#F44336'

  // ── Lightning 60s playing ─────────────────────────────────────────────────
  if (screen === 'l_play') return (
    <div className="arc-screen arc-play-screen" style={{ background: game.bg }}>
      <div className="arc-play-header">
        <div className="arc-game-label" style={{ color: game.color }}>{game.emoji} {game.name}</div>
        <div className="arc-score-badge" style={{ borderColor: game.color, color: game.color }}>
          {score} 題 · +{score * 20} 💰
        </div>
      </div>

      <div className="arc-timer-wrap">
        <div className="arc-timer-track">
          <motion.div className="arc-timer-fill"
            animate={{ width: `${timerPct}%`, background: timerColor }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <motion.span className="arc-timer-num"
          animate={{ color: timerColor, scale: timeLeft <= 5 && timeLeft > 0 ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.25 }}
        >{timeLeft}</motion.span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ?.text} className="arc-q-card"
          style={{
            borderColor: feedback === 'correct' ? '#4CAF50' : feedback ? '#F44336' : '#DDD',
            background:  feedback === 'correct' ? '#F1F8E9'  : feedback ? '#FFF0F0' : 'white',
          }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="arc-q-text">{currentQ?.text} = <span className="arc-blank">{input || '□'}</span></div>
          {feedback === 'correct' && <div className="arc-fb arc-fb-ok">✓</div>}
          {feedback === 'wrong'   && <div className="arc-fb arc-fb-ng">✗ {currentQ?.answer}</div>}
        </motion.div>
      </AnimatePresence>

      <ArcadePad onInput={handleInput} disabled={!!feedback} />
    </div>
  )

  // ── Lightning end ─────────────────────────────────────────────────────────
  if (screen === 'l_end') {
    const earned = score * 20
    const net    = earned - 100
    if (!resultData) {
      addCoins(earned)
      setResultData({ win: earned > 100, earned, cost: 100 })
    }
    return (
      <div className="arc-screen arc-result-screen" style={{ background: game?.bg }}>
        <motion.div className="arc-result-card"
          style={{ borderColor: game?.color }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="arc-result-emoji">{score >= 5 ? '⚡' : '😅'}</div>
          <div className="arc-result-title" style={{ color: game?.color }}>
            {score >= 10 ? '超強！' : score >= 5 ? '不錯喔！' : '繼續練習！'}
          </div>
          <div className="arc-result-score">答對 <b style={{ color: game?.color, fontSize: '2rem' }}>{score}</b> 題</div>
          <div className="arc-coins-row">
            <div className="arc-coins-item"><span>入場費</span><span>-100 💰</span></div>
            <div className="arc-coins-item"><span>答題獎勵</span><span style={{ color: '#4CAF50' }}>+{earned} 💰</span></div>
            <div className="arc-coins-divider" />
            <div className="arc-coins-item arc-coins-net">
              <span>淨收益</span>
              <span style={{ color: net >= 0 ? '#4CAF50' : '#F44336', fontWeight: 800 }}>
                {net >= 0 ? '+' : ''}{net} 💰
              </span>
            </div>
          </div>
          <motion.button className="arc-result-btn"
            style={{ background: game?.color }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { sfx.click(); setScreen('hub'); setResultData(null) }}
          >再玩一次</motion.button>
          <motion.button className="arc-result-btn-sec"
            whileTap={{ scale: 0.94 }}
            onClick={() => { sfx.click(); onBack() }}
          >離開遊戲場</motion.button>
        </motion.div>
      </div>
    )
  }

  // ── All-in playing ────────────────────────────────────────────────────────
  if (screen === 'a_play') return (
    <div className="arc-screen arc-play-screen" style={{ background: game.bg }}>
      <div className="arc-play-header">
        <div className="arc-game-label" style={{ color: game.color }}>{game.emoji} {game.name}</div>
        <div className="arc-allin-stake" style={{ color: game.color }}>答對得 700 💰！</div>
      </div>

      <div className="arc-timer-wrap">
        <div className="arc-timer-track">
          <motion.div className="arc-timer-fill"
            animate={{ width: `${timerPct}%`, background: timerColor }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <motion.span className="arc-timer-num"
          style={{ fontSize: '2rem' }}
          animate={{ color: timerColor, scale: timeLeft <= 2 ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 0.25 }}
        >{timeLeft}</motion.span>
      </div>

      <div className="arc-q-card arc-q-card-big">
        <div className="arc-q-text arc-q-big">{currentQ?.text} = <span className="arc-blank arc-blank-big">{input || '□'}</span></div>
      </div>

      <ArcadePad onInput={handleInput} disabled={false} />
    </div>
  )

  // ── Gauntlet playing ──────────────────────────────────────────────────────
  if (screen === 'g_play') return (
    <div className="arc-screen arc-play-screen" style={{ background: game.bg }}>
      <div className="arc-play-header">
        <div className="arc-game-label" style={{ color: game.color }}>{game.emoji} {game.name}</div>
        <div className="arc-q-counter">{qIdx + 1}<span style={{ color: '#BBB' }}>/10</span></div>
      </div>

      <div className="arc-g-dots">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="arc-g-dot"
            style={{ background: i < qIdx ? '#4CAF50' : i === qIdx ? game.color : '#DDD' }}
          />
        ))}
      </div>

      <div className="arc-timer-wrap">
        <div className="arc-timer-track">
          <motion.div className="arc-timer-fill"
            animate={{ width: `${timerPct}%`, background: timerColor }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <motion.span className="arc-timer-num"
          animate={{ color: timerColor, scale: timeLeft <= 3 && timeLeft > 0 ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.25 }}
        >{timeLeft}</motion.span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} className="arc-q-card"
          style={{
            borderColor: feedback === 'correct' ? '#4CAF50' : feedback ? '#F44336' : '#DDD',
            background:  feedback === 'correct' ? '#F1F8E9'  : feedback ? '#FFF0F0' : 'white',
          }}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.16 }}
        >
          <div className="arc-q-text">{currentQ?.text} = <span className="arc-blank">{input || '□'}</span></div>
          {feedback === 'correct'  && <div className="arc-fb arc-fb-ok">✓</div>}
          {feedback === 'wrong'    && <div className="arc-fb arc-fb-ng">✗</div>}
          {feedback === 'timeout'  && <div className="arc-fb arc-fb-ng">⏱</div>}
        </motion.div>
      </AnimatePresence>

      <ArcadePad onInput={handleInput} disabled={!!feedback} />
    </div>
  )

  // ── Result (all-in / gauntlet) ────────────────────────────────────────────
  if (screen === 'result' && resultData) {
    const net = resultData.earned - resultData.cost
    return (
      <div className="arc-screen arc-result-screen" style={{ background: resultData.win ? game?.bg : '#FFF8F8' }}>
        <motion.div className="arc-result-card"
          style={{ borderColor: resultData.win ? game?.color : '#F44336' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div className="arc-result-emoji"
            animate={resultData.win
              ? { rotate: [0, 20, -20, 10, 0], scale: [1, 1.3, 1] }
              : { x: [0, -8, 8, -8, 0] }
            }
            transition={{ duration: 0.6 }}
          >
            {resultData.win ? '🎉' : '💸'}
          </motion.div>
          <div className="arc-result-title" style={{ color: resultData.win ? game?.color : '#F44336' }}>
            {resultData.win ? '大贏家！' : '可惜了！'}
          </div>
          <div className="arc-coins-row">
            <div className="arc-coins-item"><span>入場費</span><span>-{resultData.cost} 💰</span></div>
            <div className="arc-coins-item">
              <span>獎勵</span>
              <span style={{ color: resultData.win ? '#4CAF50' : '#CCC' }}>
                {resultData.win ? `+${resultData.earned} 💰` : '0 💰'}
              </span>
            </div>
            <div className="arc-coins-divider" />
            <div className="arc-coins-item arc-coins-net">
              <span>淨收益</span>
              <span style={{ color: net >= 0 ? '#4CAF50' : '#F44336', fontWeight: 800 }}>
                {net >= 0 ? '+' : ''}{net} 💰
              </span>
            </div>
          </div>
          <motion.button className="arc-result-btn"
            style={{ background: resultData.win ? game?.color : '#EF5350' }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { sfx.click(); setScreen('hub'); setResultData(null) }}
          >再挑戰！</motion.button>
          <motion.button className="arc-result-btn-sec"
            whileTap={{ scale: 0.94 }}
            onClick={() => { sfx.click(); onBack() }}
          >離開遊戲場</motion.button>
        </motion.div>
      </div>
    )
  }

  return null
}
