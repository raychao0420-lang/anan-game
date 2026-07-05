import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { SEASON1, EPISODE_ORDER, SHARD_BOARD } from '../data/series'
import { parseText } from '../data/wordProblems'
import { PETS } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import PetAvatar from '../components/PetAvatar'
import NumberPad from '../components/NumberPad'
import { sfx } from '../utils/sound'
import { speakEnglish, stopSpeaking, isSpeechSupported } from '../utils/speech'
import './DetectiveScreen.css'
import './SeriesScreen.css'

// 「讀給我聽」朗讀鈕：唸出英文。裝置不支援就不顯示。
function SpeakBtn({ text }) {
  const [on, setOn] = useState(false)
  if (!isSpeechSupported() || !text) return null
  return (
    <button
      type="button"
      className={`srs-speak ${on ? 'on' : ''}`}
      title="讀給我聽 Read aloud"
      aria-label="讀給我聽 Read aloud"
      onClick={(e) => {
        e.stopPropagation()
        setOn(true)
        speakEnglish(text, { onEnd: () => setOn(false) })
      }}
    >
      🔊
    </button>
  )
}

// 高亮題目：{數字} → dtv-num、[關鍵詞] → dtv-topic
function renderClue(text) {
  return parseText(text).map((tok, i) => {
    if (tok.kind === 'num')   return <span key={i} className="dtv-num">{tok.value}</span>
    if (tok.kind === 'topic') return <span key={i} className="dtv-topic">{tok.value}</span>
    return <span key={i}>{tok.value}</span>
  })
}

// 中英同時顯示：中文一行、英文一行
function Bi({ t, className = '' }) {
  return (
    <div className={`srs-bi ${className}`}>
      <p className="srs-zh">{t.zh}</p>
      <p className="srs-en">{t.en}<SpeakBtn text={t.en} /></p>
    </div>
  )
}

export default function SeriesScreen({ onBack }) {
  const { activePet, pets, petEquipment, petMoods, seriesSolved, seriesShards,
          solveEpisode, updatePetMood, grantPet, grantItem } = useGameStore()

  const [epId, setEpId]   = useState(null)
  const ep = epId ? SEASON1.episodes.find((e) => e.id === epId) : null

  const [phase, setPhase]       = useState('select') // select | intro | scene | accuse | solved
  const [sceneIdx, setSceneIdx] = useState(0)
  const [solvedClue, setSolvedClue] = useState(false)
  const [value, setValue]       = useState('')
  const [hint, setHint]         = useState(false)
  const [accuseHint, setAccuseHint] = useState(false)
  const [newPet, setNewPet]     = useState(null)
  const [newItem, setNewItem]   = useState(null)

  const petData  = pets[activePet]
  const equipped = (petEquipment[activePet] || [])
    .map((id) => SHOP_ITEMS.find((i) => i.id === id)).filter(Boolean)
  const partner = (size) => (
    <PetAvatar petId={activePet} evolutionStage={petData.evolutionStage}
      equipped={equipped} size={size} mood={petMoods?.[activePet] ?? 80} />
  )

  const scene = ep ? ep.scenes[sceneIdx] : null
  const alreadySolved = ep ? !!seriesSolved?.[ep.id] : false

  const isLocked = (id) => {
    const idx = EPISODE_ORDER.indexOf(id)
    return idx > 0 && !seriesSolved?.[EPISODE_ORDER[idx - 1]]
  }

  const resetCase = () => {
    setSceneIdx(0); setSolvedClue(false); setValue('')
    setHint(false); setAccuseHint(false); setNewPet(null); setNewItem(null)
  }

  const openEpisode = (id) => {
    if (isLocked(id)) { sfx.wrong(); return }
    stopSpeaking(); sfx.click(); setEpId(id); setPhase('intro'); resetCase()
  }

  const backToList = () => { stopSpeaking(); sfx.click(); setEpId(null); setPhase('select') }
  const restart    = () => { stopSpeaking(); sfx.click(); setPhase('intro'); resetCase() }

  const checkAnswer = () => {
    if (Number(value) === scene.puzzle.answer) {
      sfx.correct(); setSolvedClue(true); setHint(false)
    } else {
      sfx.wrong(); setHint(true); setValue('')
    }
  }

  const nextScene = () => {
    stopSpeaking(); sfx.click(); setValue(''); setHint(false); setSolvedClue(false)
    if (sceneIdx < ep.scenes.length - 1) setSceneIdx(sceneIdx + 1)
    else setPhase('accuse')
  }

  const accuse = (id) => {
    if (id === ep.culprit) {
      sfx.unlock()
      solveEpisode(ep.id, ep.reward, ep.shard?.color)
      updatePetMood(activePet, 15)
      const gotPet = ep.petReward ? grantPet(ep.petReward) : false
      setNewPet(gotPet ? ep.petReward : null)
      const gotItem = ep.itemReward ? grantItem(ep.itemReward) : false
      setNewItem(gotItem ? SHOP_ITEMS.find((i) => i.id === ep.itemReward) : null)
      setPhase('solved')
    } else {
      sfx.wrong(); setAccuseHint(true)
    }
  }

  return (
    <div className={`dtv-screen ${phase === 'scene' ? 'dtv-screen-scene' : ''}`} style={{ '--accent': ep?.accent ?? '#b06bd6' }}>
      <button className="dtv-back"
        onClick={phase === 'select' ? () => { stopSpeaking(); sfx.click(); onBack() } : backToList}>
        {phase === 'select' ? '← 回首頁 Home' : '← 回劇場 Episodes'}
      </button>

      <AnimatePresence mode="wait">
        {/* ── 劇場選單 ＋ 推理牆 ── */}
        {phase === 'select' && (
          <motion.div key="select" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">📺</div>
            <h1 className="dtv-title">{SEASON1.title.zh}</h1>
            <div className="srs-title-en">{SEASON1.title.en}</div>

            {/* 推理牆：碎片收集 */}
            <div className="srs-wall">
              <div className="srs-wall-label">🧩 星願石碎片 Shards ({seriesShards.length}/7)</div>
              <div className="srs-shards">
                {SHARD_BOARD.map((s) => {
                  const got = seriesShards.includes(s.color)
                  return (
                    <div key={s.color} className={`srs-shard ${got ? 'got' : ''}`}
                      title={`${s.name.zh} ${s.name.en}`}>
                      {got ? s.emoji : '⬜'}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 推理牆：斗篷客線索卡（已破集數累積） */}
            {SEASON1.episodes.some((e) => seriesSolved?.[e.id] && e.arcClue) && (
              <div className="srs-wall">
                <div className="srs-wall-label">🧙 斗篷客線索 Clues</div>
                {SEASON1.episodes.filter((e) => seriesSolved?.[e.id] && e.arcClue).map((e) => (
                  <div key={e.id} className="srs-clue">
                    <span className="srs-clue-no">EP{e.no}</span>
                    <Bi t={e.arcClue} />
                  </div>
                ))}
              </div>
            )}

            {/* 集數列表 */}
            <div className="srs-ep-list">
              {SEASON1.episodes.map((e) => {
                const done   = !!seriesSolved?.[e.id]
                const locked = isLocked(e.id)
                return (
                  <motion.button key={e.id} className={`srs-ep-card ${locked ? 'locked' : ''}`}
                    whileTap={locked ? {} : { scale: 0.96 }} style={{ '--accent': e.accent }}
                    onClick={() => openEpisode(e.id)}>
                    <span className="srs-ep-emoji">{locked ? '🔒' : e.emoji}</span>
                    <span className="srs-ep-info">
                      <span className="srs-ep-no">第 {e.no} 集 · EP{e.no}</span>
                      <span className="srs-ep-title">{e.title.zh}</span>
                      <span className="srs-ep-title-en">{e.title.en}</span>
                    </span>
                    {done && <span className="dtv-case-done">✓ 已破案</span>}
                  </motion.button>
                )
              })}
              <div className="srs-coming">更多集數陸續上線… More episodes coming soon…</div>
            </div>
          </motion.div>
        )}

        {/* ── 開場 ── */}
        {phase === 'intro' && (
          <motion.div key="intro" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">{ep.emoji}</div>
            <div className="dtv-tone">第 {ep.no} 集 · {ep.difficulty.zh} / {ep.difficulty.en}</div>
            <h1 className="dtv-title">{ep.title.zh}</h1>
            <div className="srs-title-en">{ep.title.en}</div>
            <div className="dtv-partner-hero">
              <motion.div animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}>
                {partner(120)}
              </motion.div>
              <div className="dtv-partner-tag">🕵️ {PETS[activePet].name} 偵探出動！</div>
            </div>
            {ep.no === 1 && SEASON1.seasonIntro.map((line, i) => <Bi key={`s${i}`} t={line} />)}
            {ep.intro.map((line, i) => <Bi key={i} t={line} />)}
            {alreadySolved && <div className="dtv-replay-note">（這集破過囉，重玩不會再拿獎勵～ Replay: no new rewards）</div>}
            <button className="dtv-btn" onClick={() => { sfx.click(); setPhase('scene') }}>
              開始查案 Start 🔍
            </button>
          </motion.div>
        )}

        {/* ── 現場調查 ── */}
        {phase === 'scene' && (
          <motion.div key={`scene-${sceneIdx}`} className="dtv-panel dtv-scene-panel"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            {/* 上方內容可捲動 */}
            <div className="dtv-scene-scroll">
              <div className="dtv-progress">現場 Scene {sceneIdx + 1} / {ep.scenes.length}</div>
              <div className="dtv-place">
                <span className="dtv-place-emoji">{scene.emoji}</span>
                <span className="dtv-place-name">{scene.place.zh} · {scene.place.en}</span>
              </div>
              <div className="dtv-partner-row">{partner(56)}<Bi t={scene.story} /></div>

              {!solvedClue ? (
                <>
                  <div className="dtv-clue-card">
                    <div className="dtv-clue-label">🔍 現場謎題 Puzzle</div>
                    <p className="dtv-clue-text">{renderClue(scene.puzzle.text.zh)}</p>
                    <p className="dtv-clue-text srs-en">{renderClue(scene.puzzle.text.en)}<SpeakBtn text={scene.puzzle.text.en} /></p>
                  </div>
                  {hint && (
                    <div className="dtv-hint">
                      💡 {scene.puzzle.hint.zh}<br /><span className="srs-en">{scene.puzzle.hint.en}</span>
                    </div>
                  )}
                </>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="dtv-reward"><Bi t={scene.puzzle.reward} /></div>
                  <button className="dtv-btn" onClick={nextScene}>
                    {sceneIdx < ep.scenes.length - 1 ? '下一個現場 Next →' : '整理線索，指認真相 🕵️'}
                  </button>
                </motion.div>
              )}
            </div>

            {/* 數字鍵盤固定在底部欄，綠色確認鍵永遠按得到 */}
            {!solvedClue && (
              <div className="dtv-numpad-dock">
                <NumberPad value={value} onChange={setValue} onConfirm={checkAnswer} />
              </div>
            )}
          </motion.div>
        )}

        {/* ── 指認 ── */}
        {phase === 'accuse' && (
          <motion.div key="accuse" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="dtv-subtitle">📓 指認真相 Who did it?</h2>
            <Bi t={ep.accuse} className="dtv-accuse-prompt" />
            {accuseHint && <div className="dtv-hint">{ep.wrongAccuse.zh}<br /><span className="srs-en">{ep.wrongAccuse.en}</span></div>}
            <div className="dtv-suspects">
              {ep.suspects.map((s) => (
                <motion.button key={s.id} className="dtv-suspect" whileTap={{ scale: 0.92 }}
                  onClick={() => accuse(s.id)}>
                  <span className="dtv-suspect-emoji">{s.emoji}</span>
                  <span>{s.name.zh}</span>
                  <span className="srs-en">{s.name.en}</span>
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
            <h1 className="dtv-title">破案成功！Case Solved!</h1>
            <div className="dtv-partner-hero">
              <motion.div animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}>
                {partner(120)}
              </motion.div>
            </div>
            {ep.solve.map((line, i) => <Bi key={i} t={line} />)}

            {ep.shard && (
              <div className="srs-got-shard">
                <span className="srs-got-shard-emoji">{ep.shard.emoji}</span>
                <span>收集到 {ep.shard.name.zh}！<br /><span className="srs-en">Got the {ep.shard.name.en}!</span></span>
              </div>
            )}

            {newPet && (
              <motion.div className="dtv-newpet"
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.2 }}>
                <div className="dtv-newpet-title">🎊 新同伴加入！New friend!</div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
                  <PetAvatar petId={newPet} evolutionStage={1} equipped={[]} size={110} mood={100} />
                </motion.div>
                <div className="dtv-newpet-name">{PETS[newPet].name} · {PETS[newPet].breed}</div>
              </motion.div>
            )}
            {newItem && (
              <motion.div className="dtv-newpet"
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.35 }}>
                <div className="dtv-newpet-title">🎁 獲得稀有擺飾！Rare décor!</div>
                <div className="dtv-newitem-emoji">{newItem.emoji}</div>
                <div className="dtv-newpet-name">{newItem.name}</div>
              </motion.div>
            )}

            {!alreadySolved && <div className="dtv-reward dtv-coins">💰 獲得 {ep.reward} 金幣！+{ep.reward} coins</div>}

            {ep.nextPreview && (
              <div className="srs-next">
                <div className="srs-next-label">📺 下集預告 Next Time</div>
                <Bi t={ep.nextPreview} />
              </div>
            )}

            <div className="dtv-btn-row">
              <button className="dtv-btn dtv-btn-ghost" onClick={restart}>再看一次 🔁</button>
              <button className="dtv-btn" onClick={backToList}>回劇場 📺</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
