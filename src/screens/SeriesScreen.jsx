import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { SEASONS } from '../data/seasons'
import { parseText } from '../data/wordProblems'
import { PETS, TUTOR_PETS, SOS_COST, SOS_REGEN } from '../data/pets'
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
  const { activePet, pets, petEquipment, petMoods, seriesSolved, seriesShards, seriesBadges,
          petEnergy, gainEnergy, spendEnergy,
          solveEpisode, updatePetMood, grantPet, grantItem } = useGameStore()

  const [season, setSeason] = useState(null)          // 選定的季（物件）
  const [epId, setEpId]     = useState(null)
  const [phase, setPhase]   = useState('seasons')     // seasons | select | intro | scene | accuse | solved
  const [sceneIdx, setSceneIdx] = useState(0)
  const [solvedClue, setSolvedClue] = useState(false)
  const [value, setValue]       = useState('')
  const [hint, setHint]         = useState(false)
  const [accuseHint, setAccuseHint] = useState(false)
  const [newPet, setNewPet]     = useState(null)
  const [newItem, setNewItem]   = useState(null)
  const [showTutor, setShowTutor] = useState(false)   // 家教求救面板
  const [sosMsg, setSosMsg]       = useState('')       // 能量不足提示
  const [showNotes, setShowNotes] = useState(false)   // 答對後的偵探筆記解說

  // 家教寵物：擁有清單中任一隻即可求救（依序優先，不限出戰寵物）
  const activeTutor  = TUTOR_PETS.find((id) => pets[id]?.unlocked) || null
  const tutorEnergy  = activeTutor ? (petEnergy?.[activeTutor] ?? 0) : 0

  const episodes = season?.episodes ?? []
  const order    = season?.order ?? []
  const collected = season?.collType === 'badge' ? (seriesBadges ?? []) : (seriesShards ?? [])
  const boardKey = (item) => (season?.collType === 'badge' ? item.id : item.color)

  const ep = epId ? episodes.find((e) => e.id === epId) : null

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
    const idx = order.indexOf(id)
    return idx > 0 && !seriesSolved?.[order[idx - 1]]
  }

  const resetCase = () => {
    setSceneIdx(0); setSolvedClue(false); setValue('')
    setHint(false); setAccuseHint(false); setNewPet(null); setNewItem(null)
    setShowTutor(false); setSosMsg(''); setShowNotes(false)
  }

  // 家教求救：扣能量、打開教學面板（給方法、不給答案）
  const callTutor = () => {
    if (!activeTutor) return
    if ((petEnergy?.[activeTutor] ?? 0) < SOS_COST) {
      sfx.wrong()
      setSosMsg(`${PETS[activeTutor].name}老師的能量不夠了，先答對幾題幫牠充電，再來求救喔！ (Solve a few to recharge!)`)
      return
    }
    if (spendEnergy(activeTutor, SOS_COST)) { sfx.click(); setShowTutor(true); setSosMsg('') }
  }

  const openSeason = (s) => { stopSpeaking(); sfx.click(); setSeason(s); setPhase('select') }
  const backToSeasons = () => { stopSpeaking(); sfx.click(); setSeason(null); setEpId(null); setPhase('seasons') }

  const openEpisode = (id) => {
    if (isLocked(id)) { sfx.wrong(); return }
    stopSpeaking(); sfx.click(); setEpId(id); setPhase('intro'); resetCase()
  }

  const backToList = () => { stopSpeaking(); sfx.click(); setEpId(null); setPhase('select') }
  const restart    = () => { stopSpeaking(); sfx.click(); setPhase('intro'); resetCase() }

  const checkAnswer = () => {
    if (Number(value) === scene.puzzle.answer) {
      sfx.correct(); setSolvedClue(true); setHint(false)
      // 答對就幫家教充電，讓求救能持續使用
      if (activeTutor) gainEnergy(activeTutor, SOS_REGEN)
    } else {
      sfx.wrong(); setHint(true); setValue('')
    }
  }

  const nextScene = () => {
    stopSpeaking(); sfx.click(); setValue(''); setHint(false); setSolvedClue(false)
    setShowTutor(false); setSosMsg(''); setShowNotes(false)
    if (sceneIdx < ep.scenes.length - 1) setSceneIdx(sceneIdx + 1)
    else setPhase('accuse')
  }

  const accuse = (id) => {
    if (id === ep.culprit) {
      sfx.unlock()
      // 第三參數收 S1 碎片色、第四參數收 S2 星座徽章 id（一集只會有其一）
      solveEpisode(ep.id, ep.reward, ep.shard?.color, ep.badge?.id)
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

  // 破案收集物（S1 碎片 / S2 徽章）通用取用
  const gotCollectible = ep?.shard || ep?.badge

  const backBtn = () => {
    if (phase === 'seasons') { stopSpeaking(); sfx.click(); onBack() }
    else if (phase === 'select') backToSeasons()
    else backToList()
  }
  const backLabel = phase === 'seasons' ? '← 回首頁 Home'
    : phase === 'select' ? '← 選季 Seasons'
    : '← 回劇場 Episodes'

  return (
    <div className={`dtv-screen ${phase === 'scene' ? 'dtv-screen-scene' : ''}`} style={{ '--accent': ep?.accent ?? season?.accent ?? '#b06bd6' }}>
      <button className="dtv-back" onClick={backBtn}>{backLabel}</button>

      <AnimatePresence mode="wait">
        {/* ── 季選單 ── */}
        {phase === 'seasons' && (
          <motion.div key="seasons" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">📺</div>
            <h1 className="dtv-title">連載劇場</h1>
            <div className="srs-title-en">The Detective Serials</div>
            <div className="srs-season-list">
              {SEASONS.map((s, i) => {
                const solvedCount = s.episodes.filter((e) => seriesSolved?.[e.id]).length
                return (
                  <motion.button key={s.key} className="srs-season-card"
                    whileTap={{ scale: 0.96 }} style={{ '--accent': s.episodes[0]?.accent || '#b06bd6' }}
                    onClick={() => openSeason(s)}>
                    <span className="srs-season-emoji">{s.emoji}</span>
                    <span className="srs-ep-info">
                      <span className="srs-ep-no">{s.subtitle.zh} · {s.subtitle.en}</span>
                      <span className="srs-ep-title">第 {i + 1} 季：{s.title.zh}</span>
                      <span className="srs-ep-title-en">{s.title.en}</span>
                      <span className="srs-season-prog">
                        {s.done && solvedCount === s.episodes.length ? '🏆 全破 Complete' : `進度 ${solvedCount}/${s.episodes.length}`}
                      </span>
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── 劇場選單 ＋ 收集牆 ── */}
        {phase === 'select' && season && (
          <motion.div key="select" className="dtv-panel"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="dtv-case-emoji">{season.emoji}</div>
            <h1 className="dtv-title">{season.title.zh}</h1>
            <div className="srs-title-en">{season.title.en}</div>

            {/* 收集牆：碎片 / 星座徽章 */}
            <div className="srs-wall">
              <div className="srs-wall-label">
                {season.collType === 'badge' ? '⭐' : '🧩'} {season.collLabel.zh} {season.collLabel.en} ({collected.length}/{season.board.length})
              </div>
              <div className="srs-shards">
                {season.board.map((item) => {
                  const got = collected.includes(boardKey(item))
                  return (
                    <div key={boardKey(item)} className={`srs-shard ${got ? 'got' : ''}`}
                      title={`${item.name.zh} ${item.name.en}`}>
                      {got ? item.emoji : '⬜'}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 收集牆：主線線索卡（已破集數累積） */}
            {season.episodes.some((e) => seriesSolved?.[e.id] && e.arcClue) && (
              <div className="srs-wall">
                <div className="srs-wall-label">{season.clueIcon} {season.clueLabel.zh} {season.clueLabel.en}</div>
                {season.episodes.filter((e) => seriesSolved?.[e.id] && e.arcClue).map((e) => (
                  <div key={e.id} className="srs-clue">
                    <span className="srs-clue-no">EP{e.no}</span>
                    <Bi t={e.arcClue} />
                  </div>
                ))}
              </div>
            )}

            {/* 集數列表 */}
            <div className="srs-ep-list">
              {season.episodes.map((e) => {
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
              {!season.done && <div className="srs-coming">更多集數陸續上線… More episodes coming soon…</div>}
            </div>
          </motion.div>
        )}

        {/* ── 開場 ── */}
        {phase === 'intro' && ep && (
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
            {ep.no === 1 && season.seasonIntro?.map((line, i) => <Bi key={`s${i}`} t={line} />)}
            {ep.intro.map((line, i) => <Bi key={i} t={line} />)}
            {alreadySolved && <div className="dtv-replay-note">（這集破過囉，重玩不會再拿獎勵～ Replay: no new rewards）</div>}
            <button className="dtv-btn" onClick={() => { sfx.click(); setPhase('scene') }}>
              開始查案 Start 🔍
            </button>
          </motion.div>
        )}

        {/* ── 現場調查 ── */}
        {phase === 'scene' && ep && (
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

                  {/* 家教求救：擁有智慧寵物就能按，用教學方式帶著想（不給答案），消耗能量 */}
                  {activeTutor && !showTutor && (
                    <button className="srs-sos-btn" onClick={callTutor} disabled={tutorEnergy < SOS_COST}>
                      <PetAvatar petId={activeTutor} evolutionStage={1} equipped={[]} size={34} mood={100} />
                      <span className="srs-sos-txt">
                        🔔 求救！問問{PETS[activeTutor].name}老師
                        <span className="srs-sos-en">Ask {PETS[activeTutor].name} for a hint</span>
                      </span>
                      <span className="srs-sos-cost">⚡{Math.round(tutorEnergy)}/{SOS_COST}</span>
                    </button>
                  )}
                  {sosMsg && <div className="dtv-hint">🔋 {sosMsg}</div>}

                  {showTutor && (
                    <motion.div className="srs-tutor"
                      initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <div className="srs-tutor-head">
                        <PetAvatar petId={activeTutor} evolutionStage={1} equipped={[]} size={48} mood={100} />
                        <span className="srs-tutor-name">🎓 {PETS[activeTutor].name}老師</span>
                      </div>
                      <div className="srs-tutor-bubble">
                        <p className="srs-tutor-lead">別急，我們一步一步想～（老師只教方法，最後的答案要你自己算出來喔！）</p>
                        <p className="srs-tutor-lead srs-en">Let’s think step by step — I’ll teach the method, you find the answer!</p>
                        <div className="srs-tutor-steps">
                          {scene.puzzle.teach
                            ? scene.puzzle.teach.map((step, i) => (
                                <div key={i} className="srs-tutor-step">
                                  <span className="srs-tutor-step-no">{i + 1}</span>
                                  <Bi t={step} />
                                </div>
                              ))
                            : <Bi t={scene.puzzle.hint} />}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {hint && !showTutor && (
                    <div className="dtv-hint">
                      💡 {scene.puzzle.hint.zh}<br /><span className="srs-en">{scene.puzzle.hint.en}</span>
                    </div>
                  )}
                </>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="dtv-reward"><Bi t={scene.puzzle.reward} /></div>

                  {/* 偵探筆記：答對後可展開完整解說（柯南式破解過程），答對也學得到方法 */}
                  {scene.puzzle.teach && (showNotes ? (
                    <div className="srs-notes">
                      <div className="srs-notes-title">🕵️ 偵探筆記 · 這題是怎麼破解的 Detective Notes</div>
                      {scene.puzzle.teach.map((step, i) => (
                        <div key={i} className="srs-tutor-step">
                          <span className="srs-tutor-step-no">{i + 1}</span>
                          <Bi t={step} />
                        </div>
                      ))}
                      <div className="srs-notes-ans">
                        ✨ 所以答案就是 {scene.puzzle.answer} {scene.puzzle.unit.zh}！
                        <span className="srs-en"> So the answer is {scene.puzzle.answer} {scene.puzzle.unit.en}!</span>
                      </div>
                    </div>
                  ) : (
                    <button className="srs-notes-btn" onClick={() => { sfx.click(); setShowNotes(true) }}>
                      🕵️ 翻開偵探筆記，學會這一招！ <span className="srs-en">See how it was solved</span>
                    </button>
                  ))}

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
        {phase === 'accuse' && ep && (
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
        {phase === 'solved' && ep && (
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

            {gotCollectible && (
              <div className="srs-got-shard">
                <span className="srs-got-shard-emoji">{gotCollectible.emoji}</span>
                <span>收集到 {gotCollectible.name.zh}！<br /><span className="srs-en">Got the {gotCollectible.name.en}!</span></span>
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
