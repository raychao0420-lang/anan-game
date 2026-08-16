import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS, PET_ORDER, EVOLVE_EXP, PET_SKILLS, PET_TRAITS, SKILL_COST, ENERGY_PER_QUESTION } from '../data/pets'
import { SHOP_ITEMS } from '../data/shop'
import { habitatOfPet, MAX_PETS_PER_SCENE, HOME_SCENES } from '../data/roomRules'
import PetAvatar from '../components/PetAvatar'
import EvolveModal from '../components/EvolveModal'
import { sfx } from '../utils/sound'
import './PetScreen.css'

const FOOD_ITEMS = SHOP_ITEMS.filter(i => i.category === 'food')

function getMoodEmoji(val) {
  if (val >= 80) return '😄'
  if (val >= 60) return '🙂'
  if (val >= 40) return '😐'
  if (val >= 20) return '😔'
  return '😢'
}

function getMoodColor(val) {
  if (val >= 80) return '#6BCB77'
  if (val >= 60) return '#B8D95A'
  if (val >= 40) return '#FFB347'
  if (val >= 20) return '#FF8C42'
  return '#FF6B6B'
}

export default function PetScreen({ onNavigate }) {
  const { coins, pets, activePet, evolvePetFood, unlockPet, setActivePet, petEquipment, petMoods,
          petHabitat, setPetHabitat, petNests, clearPetNest } = useGameStore()
  const [selected, setSelected] = useState(activePet)
  const [moveMsg, setMoveMsg] = useState('')

  // 每個場景目前住了幾隻（只算已解鎖的）
  const homeCount = useMemo(() => {
    const c = { indoor: 0, outdoor: 0, magic: 0 }
    for (const id of PET_ORDER) if (pets[id]?.unlocked) c[habitatOfPet(id, petHabitat)]++
    return c
  }, [pets, petHabitat])

  const moveHome = (sc) => {
    const r = setPetHabitat(selected, sc)
    if (r === 'same') return
    sfx.click()
    setMoveMsg(r === 'full'
      ? `⚠️ 那邊已經住滿 ${MAX_PETS_PER_SCENE} 隻了，要先把別隻搬過來這邊喔！`
      : `✅ 搬好了！${PETS[selected].name} 現在住在${HOME_SCENES.find((h) => h.id === sc)?.label}。`)
  }
  // 訊息 2.6 秒後消失
  useEffect(() => {
    if (!moveMsg) return
    const t = setTimeout(() => setMoveMsg(''), 3800)   // 小三要讀得完，別太快消失
    return () => clearTimeout(t)
  }, [moveMsg])
  const [evolveModal, setEvolveModal] = useState(null)

  const petData = pets[selected]
  const petDef = PETS[selected]
  const stage = petDef.stages[petData.evolutionStage]
  const moodVal = petMoods?.[selected] ?? 80
  const nextStage = petDef.stages[petData.evolutionStage + 1]
  const maxEvolved = petData.evolutionStage >= 4

  const foodExp = petData.foodExp || 0
  const expThreshold = EVOLVE_EXP[petData.evolutionStage] || 0
  const expPct = maxEvolved ? 100 : Math.min(100, (foodExp / expThreshold) * 100)
  const canEvolve = petData.unlocked && !maxEvolved && foodExp >= expThreshold

  const equipped = (petEquipment[selected] || []).map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean)

  const handleEvolve = () => {
    if (!canEvolve) return
    evolvePetFood(selected)
    sfx.evolve()
    setEvolveModal({ petId: selected, newStage: petData.evolutionStage + 1 })
  }

  const handleUnlock = () => {
    if (coins < petDef.unlockCost) return
    unlockPet(selected, petDef.unlockCost)
    sfx.unlock()
  }

  return (
    <div className="pet-screen">
      {/* Header */}
      <div className="pet-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="pet-screen-title">我的寵物</span>
        <span className="pet-coins">💰 {coins}</span>
      </div>

      {/* Pet tabs */}
      <div className="pet-tabs">
        {PET_ORDER.map((id) => {
          const p = PETS[id]
          const pd = pets[id]
          const isHidden = p.unlockRequires && !pets[p.unlockRequires]?.unlocked
          if (isHidden) return null
          return (
            <motion.button
              key={id}
              className={`pet-tab ${selected === id ? 'active' : ''} ${!pd.unlocked ? 'locked' : ''}`}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelected(id)}
            >
              <span className="pet-tab-emoji">
                {pd.unlocked ? p.stages[pd.evolutionStage].emoji : '🔒'}
              </span>
              <span className="pet-tab-name">{pd.unlocked ? p.name : '???'}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Main pet display */}
      <div className="pet-main">
        <motion.div
          key={selected}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={petData.unlocked ? { scale: 1, opacity: 1, y: [0, -10, 0] } : { scale: 1, opacity: 1 }}
          transition={petData.unlocked
            ? { scale: { type: 'spring', stiffness: 250 }, y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }
            : { type: 'spring', stiffness: 250 }}
        >
          {petData.unlocked
            ? <PetAvatar petId={selected} evolutionStage={petData.evolutionStage} equipped={equipped} size={150} mood={moodVal} />
            : <div className="pet-locked-bubble">🔒</div>
          }
        </motion.div>

        <div className="pet-info">
          <div className="pet-info-name">
            {petData.unlocked ? petDef.name : (petDef.unlockRequires ? '???' : petDef.name)}
          </div>
          <div className="pet-info-breed">
            {petData.unlocked
              ? `${petDef.breed} · ${petDef.personality}`
              : petDef.unlockRequires
              ? '神秘來客，快解鎖牠吧！'
              : `${petDef.breed} · ${petDef.personality}`}
          </div>
          {petData.unlocked && (
            <div className="pet-info-stage">{stage.label}</div>
          )}
          {petData.unlocked && (
            <div className="pet-mood-wrap">
              <div className="pet-mood-label">
                <span>心情</span>
                <span className="pet-mood-emoji">{getMoodEmoji(moodVal)}</span>
                <span className="pet-mood-num" style={{ color: getMoodColor(moodVal) }}>{moodVal}</span>
              </div>
              <div className="pet-mood-bar-bg">
                <motion.div
                  className="pet-mood-bar"
                  style={{ background: getMoodColor(moodVal) }}
                  animate={{ width: `${moodVal}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* 專屬技能說明 */}
          {petData.unlocked && PET_SKILLS[selected] && (
            <div className="pet-skill-card">
              <div className="pet-skill-title">✨ 專屬技能</div>
              <div className="pet-skill-row">
                <span className="pet-skill-icon">{PET_SKILLS[selected].icon}</span>
                <span className="pet-skill-name">{PET_SKILLS[selected].name}</span>
                <span className="pet-skill-cost">耗能 ⚡{SKILL_COST}</span>
              </div>
              <div className="pet-skill-desc">{PET_SKILLS[selected].desc}</div>
              <div className="pet-skill-note">
                答題每題回復 ⚡{ENERGY_PER_QUESTION}，闖關或特訓時按下方技能鈕就能發動（一次只作用當下這一題）。
              </div>
            </div>
          )}

          {/* 搬家：安安可以把寵物改成住室內或戶外（覆蓋預設歸屬） */}
          {petData.unlocked && (
            <div className="pet-home-card">
              <div className="pet-home-title">🏡 {petDef.name} 住在哪裡</div>
              <div className="pet-home-btns">
                {HOME_SCENES.map(({ id: sc, icon, label }) => {
                  const here = habitatOfPet(selected, petHabitat) === sc
                  const full = !here && homeCount[sc] >= MAX_PETS_PER_SCENE
                  return (
                    <motion.button key={sc}
                      className={`pet-home-btn${here ? ' on' : ''}${full ? ' full' : ''}`}
                      whileTap={{ scale: here ? 1 : 0.92 }}
                      onClick={() => moveHome(sc)}>
                      <span className="pet-home-icon">{icon}</span>
                      <span>{label}</span>
                      <span className="pet-home-num">{homeCount[sc]}/{MAX_PETS_PER_SCENE}</span>
                    </motion.button>
                  )
                })}
              </div>
              <div className="pet-home-note">
                {moveMsg || `每個場景最多 ${MAX_PETS_PER_SCENE} 隻，這樣畫面才跑得順。`}
              </div>
              {/* 窩：在房間裡把寵物拖到喜歡的位置就會定下來，這裡可以取消 */}
              <div className="pet-home-note">
                {petNests?.[selected]
                  ? <>🏠 牠有自己的窩，只在附近活動。
                      <button className="pet-nest-clear"
                        onClick={() => { sfx.click(); clearPetNest(selected); setMoveMsg(`✅ ${petDef.name} 可以到處跑了！`) }}>
                        放牠自由跑
                      </button>
                    </>
                  : '💡 在房間裡把牠拖到喜歡的地方放開，那裡就會變成牠的窩。'}
              </div>
            </div>
          )}

          {/* 動物小知識：養寵物順便認識牠 */}
          {petData.unlocked && PET_TRAITS[selected] && (
            <div className="pet-trait-card">
              <div className="pet-trait-title">🔍 {petDef.breed}小知識</div>
              {PET_TRAITS[selected].map((fact, i) => (
                <div className="pet-trait-row" key={i}>
                  <span className="pet-trait-dot">•</span>
                  <span className="pet-trait-text">{fact}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evolution stage dots */}
        {petData.unlocked && (
          <div className="evo-track">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`evo-dot ${s <= petData.evolutionStage ? 'filled' : ''}`}>
                <span>{petDef.stages[s].emoji}</span>
              </div>
            ))}
          </div>
        )}

        {/* Exp bar */}
        {petData.unlocked && !maxEvolved && (
          <div className="pet-exp-wrap">
            <div className="pet-exp-label">
              <span>🍖 進化經驗</span>
              <span className="pet-exp-num">{foodExp} / {expThreshold}</span>
            </div>
            <div className="pet-exp-bar-bg">
              <motion.div
                className="pet-exp-bar"
                animate={{ width: `${expPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            {/* Food preference hints */}
            <div className="pet-food-hints">
              {FOOD_ITEMS.map(f => (
                <span key={f.id} className="pet-food-hint-chip">
                  {f.emoji} <b>+{f.exp[selected]}</b>
                </span>
              ))}
            </div>
            <div className="pet-food-goto" onClick={() => onNavigate('shop')}>
              去商店餵食 →
            </div>
          </div>
        )}
      </div>

      {/* Action area */}
      <div className="pet-actions">
        {!petData.unlocked ? (
          petDef.purchasable === false ? (
            <div className="pet-unlock-area">
              <div className="pet-quest-lock">🎯 闖關限定夥伴</div>
              <div className="pet-quest-hint">{petDef.unlockHint || '完成指定關卡就能獲得！'}</div>
            </div>
          ) : (
            <div className="pet-unlock-area">
              <div className="pet-unlock-cost">解鎖費用：{petDef.unlockCost} 💰</div>
              <motion.button
                className={`btn-primary ${coins < petDef.unlockCost ? 'disabled' : ''}`}
                whileTap={coins >= petDef.unlockCost ? { scale: 0.94 } : {}}
                onClick={handleUnlock}
                disabled={coins < petDef.unlockCost}
              >
                {coins >= petDef.unlockCost
                  ? `🔓 解鎖${petDef.unlockRequires ? '牠' : petDef.name}！`
                  : `💰 金幣不足（差 ${petDef.unlockCost - coins}）`}
              </motion.button>
            </div>
          )
        ) : maxEvolved ? (
          <div className="pet-max-label">👑 已達最高進化！傳說等級！</div>
        ) : canEvolve ? (
          <div className="pet-evolve-area">
            <div className="pet-evolve-preview">
              <span>下一階段：</span>
              <span style={{ fontSize: '1.4rem' }}>{nextStage?.emoji}</span>
              <span className="pet-evolve-label">{nextStage?.label}</span>
            </div>
            <motion.button
              className="btn-primary evolve-btn"
              whileTap={{ scale: 0.94 }}
              onClick={handleEvolve}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              ✨ 進化！
            </motion.button>
          </div>
        ) : (
          <div className="pet-feed-hint">
            <span>繼續餵食來積累進化經驗吧！</span>
            <motion.button
              className="btn-secondary"
              whileTap={{ scale: 0.94 }}
              onClick={() => onNavigate('shop')}
            >
              🛍️ 去商店餵食
            </motion.button>
          </div>
        )}

        {/* Set active */}
        {petData.unlocked && (
          <motion.button
            className={`btn-secondary set-active-btn ${activePet === selected ? 'is-active' : ''}`}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActivePet(selected)}
          >
            {activePet === selected ? '✅ 目前使用中' : `🐾 設為主要寵物`}
          </motion.button>
        )}
      </div>

      {/* Evolution modal */}
      <AnimatePresence>
        {evolveModal && (
          <EvolveModal
            petId={evolveModal.petId}
            newStage={evolveModal.newStage}
            onClose={() => setEvolveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
