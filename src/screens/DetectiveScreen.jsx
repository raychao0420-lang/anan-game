import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { MYSTERIES, MYSTERY_ORDER } from '../data/mysteries'
import { parseText } from '../data/wordProblems'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import PetAvatar from '../components/PetAvatar'
import NumberPad from '../components/NumberPad'
import { sfx } from '../utils/sound'
import './DetectiveScreen.css'

// 把題目標記語法渲染成高亮 span
function renderClue(text) {
  return parseText(text).map((tok, i) => {
    if (tok.kind === 'num')   return <span key={i} className="dtv-num">{tok.value}</span>
    if (tok.kind === 'topic') return <span key={i} className="dtv-topic">{tok.value}</span>
    return <span key={i}>{tok.value}</span>
  })
}

export default function DetectiveScreen({ onBack }) {
  const { activePet, pets, petEquipment, petMoods, mysterySolved,
          solveMystery, updatePetMood, grantPet, grantItem } = useGameStore()

  const [chapterId, setChapterId] = useState(null)
  const chapter = chapterId ? MYSTERIES[chapterId] : null

  const [phase, setPhase]     = useState('select')  // select | intro | scene | accuse | solved
  const [sceneIdx, setSceneIdx] = useState(0)
  const [solvedClue, setSolvedClue] = useState(false) // 本現場謎題是否已解開
  const [value, setValue]     = useState('')
  const [hint, setHint]       = useState('')
  const [clues, setClues]     = useState([])          // 偵探筆記
  const [accuseHint, setAccuseHint] = useState('')
  const [newPet, setNewPet]   = useState(null)        // 本次破案帶回的新同伴（首次才有）
  const [newItem, setNewItem] = useState(null)        // 本次破案獲得的道具／裝飾（首次才有）

  const petData  = pets[activePet]
  const equipped = (petEquipment[activePet] || [])
    .map((id) => SHOP_ITEMS.find((i) => i.id === id)).filter(Boolean)
  const partner = (size) => (
    <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage}
      equipped={equipped} size={size} mood={petMoods?.[activePet] ?? 80} />
  )

  const scene = chapter ? chapter.scenes[sceneIdx] : null
  const alreadySolved = chapter ? !!mysterySolved?.[chapter.id] : false

  const checkAnswer = () => {
    if (Number(value) === scene.puzzle.answer) {
      sfx.correct()
      setSolvedClue(true)
      setClues((c) => [...c, scene.puzzle.reward])
      setHint('')
    } else {
      sfx.wrong()
      setHint(scene.puzzle.hint)
      setValue('')
    }
  }

  const nextScene = () => {
    sfx.click()
    setValue(''); setHint(''); setSolvedClue(false)
    if (sceneIdx < chapter.scenes.length - 1) {
      setSceneIdx(sceneIdx + 1)
    } else {
      setPhase('accuse')
    }
  }

  const accuse = (id) => {
    if (id === chapter.culprit) {
      sfx.unlock()
      solveMystery(chapter.id, chapter.reward)
      updatePetMood(activePet, 15)
      // 帶回新同伴：grantPet 首次解鎖回傳 true，已擁有回傳 false
      const gotNew = chapter.petReward ? grantPet(chapter.petReward) : false
      setNewPet(gotNew ? chapter.petReward : null)
      // 帶回新裝飾：grantItem 首次獲得回傳 true，已擁有回傳 false
      const gotItem = chapter.itemReward ? grantItem(chapter.itemReward) : false
      setNewItem(gotItem ? SHOP_ITEMS.find((i) => i.id === chapter.itemReward) : null)
      setPhase('solved')
    } else {
      sfx.wrong()
      setAccuseHint(chapter.wrongAccuse)
    }
  }

  const resetCaseState = () => {
    setSceneIdx(0); setSolvedClue(false)
    setValue(''); setHint(''); setClues([]); setAccuseHint(''); setNewPet(null); setNewItem(null)
  }

  const openCase = (id) => {
    sfx.click(); setChapterId(id); setPhase('intro'); resetCaseState()
  }

  const backToList = () => {
    sfx.click(); setChapterId(null); setPhase('select')
  }

  const restart = () => {
    sfx.click(); setPhase('intro'); resetCaseState()
  }

  return (
    <div className="dtv-screen" style={{ '--accent': chapter?.accent ?? '#7c9cff' }}>
      <button className="dtv-back"
        onClick={phase === 'select' ? () => { sfx.click(); onBack() } : backToList}>
        {phase === 'select' ? '← 回首頁' : '← 回事件簿'}
      </button>

      <AnimatePresence mode="wait">
        {/* ── 案件選單 ── */}
        {phase === 'select' && (
          <motion.div key="select" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">🕵️</div>
            <h1 className="dtv-title">推理事件簿</h1>
            <p className="dtv-story">選一個案子，帶著搭檔去查案吧！</p>
            <div className="dtv-case-list">
              {MYSTERY_ORDER.map((id) => {
                const c = MYSTERIES[id]
                const done = !!mysterySolved?.[id]
                return (
                  <motion.button key={id} className="dtv-case-card" whileTap={{ scale: 0.96 }}
                    style={{ '--accent': c.accent }} onClick={() => openCase(id)}>
                    <span className="dtv-case-card-emoji">{c.emoji}</span>
                    <span className="dtv-case-card-info">
                      <span className="dtv-case-card-tone">{c.toneLabel}</span>
                      <span className="dtv-case-card-title">{c.title}</span>
                    </span>
                    {done && <span className="dtv-case-done">✓ 已破案</span>}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── 開場 ── */}
        {phase === 'intro' && (
          <motion.div key="intro" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">{chapter.emoji}</div>
            <div className="dtv-tone">{chapter.toneLabel}</div>
            <h1 className="dtv-title">{chapter.title}</h1>
            <div className="dtv-partner-hero">
              <motion.div animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}>
                {partner(120)}
              </motion.div>
              <div className="dtv-partner-tag">🕵️ {PETS[activePet].name} 偵探出動！</div>
            </div>
            {chapter.intro.map((line, i) => <p key={i} className="dtv-story">{line}</p>)}
            {alreadySolved && <div className="dtv-replay-note">（這個案子破過囉，重玩不會再拿金幣～）</div>}
            <button className="dtv-btn" onClick={() => { sfx.click(); setPhase('scene') }}>
              開始查案 🔍
            </button>
          </motion.div>
        )}

        {/* ── 現場調查 ── */}
        {phase === 'scene' && (
          <motion.div key={`scene-${sceneIdx}`} className="dtv-panel"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <div className="dtv-progress">現場 {sceneIdx + 1} / {chapter.scenes.length}</div>
            <div className="dtv-place">
              <span className="dtv-place-emoji">{scene.emoji}</span>
              <span className="dtv-place-name">{scene.place}</span>
            </div>
            <div className="dtv-partner-row">{partner(56)}<p className="dtv-story">{scene.story}</p></div>

            {!solvedClue ? (
              <>
                <div className="dtv-clue-card">
                  <div className="dtv-clue-label">🔍 現場謎題</div>
                  <p className="dtv-clue-text">{renderClue(scene.puzzle.text)}</p>
                </div>
                {hint && <div className="dtv-hint">💡 {hint}</div>}
                <div className="dtv-numpad-dock">
                  <NumberPad value={value} onChange={setValue} onConfirm={checkAnswer} />
                </div>
              </>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="dtv-reward">{scene.puzzle.reward}</div>
                <button className="dtv-btn" onClick={nextScene}>
                  {sceneIdx < chapter.scenes.length - 1 ? '前往下一個現場 →' : '整理線索，指認真相 🕵️'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── 指認 ── */}
        {phase === 'accuse' && (
          <motion.div key="accuse" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="dtv-subtitle">📓 偵探筆記</h2>
            <div className="dtv-notebook">
              {clues.map((c, i) => <div key={i} className="dtv-note-item">{c}</div>)}
            </div>
            <p className="dtv-story dtv-accuse-prompt">{chapter.accuse}</p>
            {accuseHint && <div className="dtv-hint">{accuseHint}</div>}
            <div className="dtv-suspects">
              {chapter.suspects.map((s) => (
                <motion.button key={s.id} className="dtv-suspect" whileTap={{ scale: 0.92 }}
                  onClick={() => accuse(s.id)}>
                  <span className="dtv-suspect-emoji">{s.emoji}</span>
                  <span>{s.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 破案 ── */}
        {phase === 'solved' && (
          <motion.div key="solved" className="dtv-panel"
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">🎉</div>
            <h1 className="dtv-title">破案成功！</h1>
            <div className="dtv-partner-hero">
              <motion.div animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}>
                {partner(120)}
              </motion.div>
            </div>
            {chapter.solve.map((line, i) => <p key={i} className="dtv-story">{line}</p>)}
            {newPet && (
              <motion.div className="dtv-newpet"
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.2 }}>
                <div className="dtv-newpet-title">🎊 新同伴加入！</div>
                <motion.div animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
                  <PetAvatar petId={newPet} evolutionStage={1} equipped={[]} size={110} mood={100} />
                </motion.div>
                <div className="dtv-newpet-name">{PETS[newPet].name} · {PETS[newPet].breed}</div>
                <div className="dtv-newpet-hint">牠決定跟著你回家，快去寵物頁看看牠吧！</div>
              </motion.div>
            )}
            {newItem && (
              <motion.div className="dtv-newpet"
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.35 }}>
                <div className="dtv-newpet-title">🎁 獲得新裝飾！</div>
                <div className="dtv-newitem-emoji">{newItem.emoji}</div>
                <div className="dtv-newpet-name">{newItem.name}</div>
                <div className="dtv-newpet-hint">快去🎒背包把它擺進寵物的家吧！</div>
              </motion.div>
            )}
            {!alreadySolved && <div className="dtv-reward dtv-coins">💰 獲得 {chapter.reward} 金幣！</div>}
            <div className="dtv-btn-row">
              <button className="dtv-btn dtv-btn-ghost" onClick={restart}>再玩一次 🔁</button>
              <button className="dtv-btn" onClick={backToList}>回事件簿 📓</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
