import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS, PET_ORDER } from '../data/pets'
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shop'
import { CROSS_BLOOMS, CROSS_COST, bloomInfo, flowerLovers } from '../data/garden'
import { HOME_SCENES, MAX_DECOS_PER_SCENE, habitatOfDeco } from '../data/roomRules'
import PetAvatar from '../components/PetAvatar'
import DecoArt from '../components/DecoArt'
import { sfx } from '../utils/sound'
import './BackpackScreen.css'

// 背包只放「可收藏／可使用」的道具（食物是消耗品，不進背包）
// 「花」不是商店道具，是自己種出來採收的，所以另外接一個分頁
const FLOWER_CAT = { id: 'flower', icon: '🌸', label: '花' }
const BAG_CATEGORIES = [...SHOP_CATEGORIES.filter(c => c.id !== 'food'), FLOWER_CAT]

// ── 花的配種：選兩朵不同的花 ＋ 金幣 → 一朵新的花 ──────────────────────
// 種花原本的循環是「種→澆水→採收→換金幣」，金幣早就沒意義所以沒目標；
// 配種給花一個新用途，也順便當金幣出口。
function CrossPanel({ flowers, coins, onCross, onMsg }) {
  const [pick, setPick] = useState([])          // 選到的兩朵
  const [result, setResult] = useState(null)
  const list = Object.entries(flowers || {}).filter(([, n]) => n > 0)

  const toggle = (emoji) => {
    setResult(null)
    setPick((p) => p.includes(emoji) ? p.filter((e) => e !== emoji)
      : p.length >= 2 ? [p[1], emoji] : [...p, emoji])
  }

  const ready = pick.length === 2 && coins >= CROSS_COST
  const run = () => {
    const r = onCross(pick[0], pick[1])
    if (r?.error === 'coins') { onMsg(`💰 配種要 ${CROSS_COST} 金幣，先去闖關賺一點再來～`); return }
    if (r?.error) { onMsg('🧬 要選兩朵「不一樣」的花才能配種喔！'); return }
    sfx.coins()
    setResult(r)
    setPick([])
  }

  if (list.length < 2) return null               // 只有一種花時不用出現，免得占版面
  return (
    <div className="bag-cross">
      <div className="bag-cross-title">🧬 花的配種
        <span className="bag-cross-cost">每次 {CROSS_COST} 💰</span>
      </div>
      <div className="bag-cross-hint">
        選兩朵<b>不一樣</b>的花合合看！有些組合會開出只有配種才拿得到的稀有花～
        配錯也不會白費，一定會拿到一朵普通花。
      </div>
      <div className="bag-cross-picker">
        {list.map(([emoji, n]) => (
          <button key={emoji}
            className={`bag-cross-flower${pick.includes(emoji) ? ' on' : ''}`}
            onClick={() => toggle(emoji)}>
            {emoji}<span className="bag-cross-n">{n}</span>
          </button>
        ))}
      </div>
      <div className="bag-cross-slots">
        <span className="bag-cross-slot">{pick[0] || '？'}</span>
        <span className="bag-cross-plus">＋</span>
        <span className="bag-cross-slot">{pick[1] || '？'}</span>
        <span className="bag-cross-plus">＝</span>
        <span className={`bag-cross-slot out${result ? ' got' : ''}`}>{result?.emoji || '？'}</span>
      </div>
      <motion.button className="bag-cross-btn" whileTap={{ scale: 0.94 }}
        disabled={!ready} onClick={run}>
        {pick.length < 2 ? '選兩朵花'
          : coins < CROSS_COST ? `金幣不夠（要 ${CROSS_COST}）`
          : `🧬 配種看看（${CROSS_COST} 💰）`}
      </motion.button>
      {result && (
        <motion.div className="bag-cross-result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {result.known
            ? `✨ 配出了「${bloomInfo(result.emoji)?.name}」！${result.firstTime ? '第一次配出來，已記進圖鑑～' : ''}`
            : `🌱 這兩朵配不出特別的花，拿到一朵「${bloomInfo(result.emoji)?.name}」`}
          {result.known && bloomInfo(result.emoji)?.fact && (
            <div className="bag-cross-fact">🔍 {bloomInfo(result.emoji).fact}</div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default function BackpackScreen({ onNavigate }) {
  const {
    coins, activePet, pets,
    ownedItems, petEquipment, equippedHomeItems,
    equipToPet, toggleHomeItem, flowers, giveFlower, crossFlowers,
  } = useGameStore()

  const [category, setCategory] = useState('hat')
  const [giving, setGiving] = useState(null)    // 正要送出的花（emoji），開啟選寵物的彈窗
  const [giveFx, setGiveFx] = useState(null)    // 送完之後的反應
  const [bagMsg, setBagMsg] = useState(null)    // 擺不下之類的提示

  useEffect(() => {
    if (!bagMsg) return
    const t = setTimeout(() => setBagMsg(null), 3800)   // 小三要讀得完，別太快消失
    return () => clearTimeout(t)
  }, [bagMsg])

  // 每個場景擺了幾件（主題壁紙不算家具）
  const placedCount = HOME_SCENES.reduce((acc, sc) => {
    acc[sc.id] = equippedHomeItems.filter(
      (id) => !id.startsWith('theme_') && habitatOfDeco(id) === sc.id).length
    return acc
  }, {})

  const petDef = PETS[activePet]
  const petData = pets[activePet]
  const unlockedPetIds = PET_ORDER.filter(id => pets[id]?.unlocked)

  const activePetEquipped = (petEquipment[activePet] || [])
    .map(id => SHOP_ITEMS.find(i => i.id === id))
    .filter(Boolean)

  // 這個分類「已擁有」的道具
  const ownedInCategory = SHOP_ITEMS.filter(
    i => i.category === category && ownedItems.includes(i.id)
  )
  // 全背包擁有數（不含食物）
  const totalOwned = SHOP_ITEMS.filter(
    i => i.category !== 'food' && ownedItems.includes(i.id)
  ).length

  const flowerList = Object.entries(flowers || {}).filter(([, n]) => n > 0)
  const flowerTotal = flowerList.reduce((a, [, n]) => a + n, 0)

  const catCount = (catId) =>
    catId === 'flower' ? flowerTotal
      : SHOP_ITEMS.filter(i => i.category === catId && ownedItems.includes(i.id)).length

  // 送花：點花 → 選一隻寵物 → 喜歡這種花的收到會特別開心
  const doGive = (petId) => {
    const r = giveFlower(giving, petId)
    if (!r) return
    setGiveFx({ petId, ...r })
    setGiving(null)
  }

  // 送花提示 2.2 秒後自動消失（用 effect 才能在連續送花時正確重設計時器）
  useEffect(() => {
    if (!giveFx) return
    const t = setTimeout(() => setGiveFx(null), 2200)
    return () => clearTimeout(t)
  }, [giveFx])

  const isHomePlaced = (item) => equippedHomeItems.includes(item.id)

  return (
    <div className="bag-screen">
      {/* 沿用送花那組的提示樣式，不要多做一套不一致的 */}
      {bagMsg && (
        <motion.div className="bag-give-fx bag-msg"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {bagMsg}
        </motion.div>
      )}

      {/* Header */}
      <div className="bag-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="bag-title">🎒 我的背包</span>
        <span className="bag-coins">💰 {coins}</span>
      </div>

      {/* Active pet preview */}
      <div className="bag-preview">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <PetAvatar
            petId={activePet}
            evolutionStage={petData.evolutionStage}
            equipped={activePetEquipped}
            size={96}
          />
        </motion.div>
        <div className="bag-preview-info">
          <div className="bag-preview-name">{petDef.name}</div>
          <div className="bag-preview-count">🎒 收藏 {totalOwned} 件道具</div>
          <div className="bag-preview-hint">
            {category === 'home' ? '點道具「擺放」到家裡佈置，再點一次收回背包' : '點寵物頭像幫他穿戴'}
          </div>
          {category === 'home' && (
            <div className="bag-placed-count">
              {HOME_SCENES.map((sc) => (
                <span key={sc.id} className={placedCount[sc.id] >= MAX_DECOS_PER_SCENE ? 'full' : ''}>
                  {sc.icon} {placedCount[sc.id]}/{MAX_DECOS_PER_SCENE}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="bag-cats">
        {BAG_CATEGORIES.map((c) => (
          <motion.button
            key={c.id}
            className={`bag-cat-btn ${category === c.id ? 'active' : ''}`}
            whileTap={{ scale: 0.92 }}
            onClick={() => setCategory(c.id)}
          >
            {c.icon} {c.label}
            {catCount(c.id) > 0 && <span className="bag-cat-count">{catCount(c.id)}</span>}
          </motion.button>
        ))}
      </div>

      {/* 花：自己種出來採收的，可以送給寵物 */}
      {category === 'flower' ? (
        flowerList.length === 0 ? (
          <div className="bag-empty">
            <div className="bag-empty-icon">🌱</div>
            <p>還沒有採收過的花</p>
            <p className="bag-empty-sub">到「我的家 → 秘密庭園」種花，開花後點一下就能採收</p>
          </div>
        ) : (
          <>
          <CrossPanel flowers={flowers} coins={coins} onCross={crossFlowers} onMsg={setBagMsg} />
          <div className="bag-grid">
            {flowerList.map(([emoji, n]) => {
              const lovers = flowerLovers(emoji).filter((id) => pets[id]?.unlocked)
              const info = bloomInfo(emoji)
              return (
                <motion.div key={emoji} className={`bag-item${CROSS_BLOOMS[emoji] ? ' cross' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  {CROSS_BLOOMS[emoji] && <span className="bag-cross-tag">🧬 配種</span>}
                  <div className="bag-item-art bag-flower-art">{emoji}</div>
                  <div className="bag-item-name">{info?.name} ×{n}</div>
                  {/* 先告訴安安誰喜歡這種花，送花才是「選擇」而不是亂猜 */}
                  <div className="bag-flower-love">
                    {lovers.length ? `${lovers.map((id) => PETS[id].name).join('、')} 喜歡` : '大家都可以收'}
                  </div>
                  <motion.button className="bag-item-btn" whileTap={{ scale: 0.92 }}
                    onClick={() => setGiving(emoji)}>
                    🎁 送給寵物
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
          </>
        )
      ) : ownedInCategory.length === 0 ? (
        <div className="bag-empty">
          <div className="bag-empty-icon">🕳️</div>
          <p>背包裡還沒有這類道具</p>
          <motion.button className="bag-empty-btn" whileTap={{ scale: 0.94 }} onClick={() => onNavigate('shop')}>
            🛍️ 去商店逛逛
          </motion.button>
        </div>
      ) : (
        <div className="bag-grid">
          {ownedInCategory.map((item) => {
            const isHome = item.category === 'home'
            return (
              <motion.div
                key={item.id}
                className={`bag-item ${isHome && isHomePlaced(item) ? 'placed' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bag-item-art">
                  <DecoArt id={item.id} size={56} emojiFallback={item.emoji} />
                </div>
                <div className="bag-item-name">{item.name}</div>

                {isHome ? (() => {
                  // 按之前就要看得出來放不放得進去 —— 不然按了沒反應會被當成壞掉
                  const placed = isHomePlaced(item)
                  const sc = item.id.startsWith('theme_') ? null : habitatOfDeco(item.id)
                  const full = !placed && sc && placedCount[sc] >= MAX_DECOS_PER_SCENE
                  const where = HOME_SCENES.find((s) => s.id === sc)
                  return (
                  <motion.button
                    className={`bag-place-btn ${placed ? 'unplace' : ''} ${full ? 'full' : ''}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const r = toggleHomeItem(item.id)
                      if (r && r.ok === false && r.full) {
                        const w = HOME_SCENES.find((s) => s.id === r.full)
                        setBagMsg(`${w?.icon || '🏠'}${w?.label || '這裡'}已經擺滿 ${MAX_DECOS_PER_SCENE} 件了！先收起一件再擺，收起來的東西還在背包不會不見～`)
                      }
                    }}
                  >
                    {placed ? '✅ 已擺放' : full ? `🈵 ${where?.label || '這裡'}滿了` : '🏠 擺放'}
                  </motion.button>
                  )
                })() : (
                  /* 幫每隻已解鎖寵物裝備 */
                  <div className="bag-pet-btns">
                    {unlockedPetIds.map(petId => {
                      const pDef = PETS[petId]
                      const pStage = pDef.stages[pets[petId].evolutionStage]
                      const eq = petEquipment[petId]?.includes(item.id)
                      return (
                        <motion.button
                          key={petId}
                          className={`bag-pet-btn ${eq ? 'active' : ''}`}
                          whileTap={{ scale: 0.82 }}
                          onClick={() => equipToPet(petId, item.id)}
                          title={pDef.name}
                        >
                          <span className="bag-pet-btn-emoji">{pStage.emoji}</span>
                          {eq && <span className="bag-pet-btn-check">✓</span>}
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* 選一隻寵物送花。喜歡這種花的排前面並標出來，安安才知道送誰最開心 */}
      {giving && (
        <div className="bag-give-mask" onClick={() => setGiving(null)}>
          <motion.div className="bag-give-card" onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="bag-give-title">把 {giving} 送給誰？</div>
            <div className="bag-give-pets">
              {unlockedPetIds
                .map((id) => ({ id, loved: flowerLovers(giving).includes(id) }))
                .sort((a, b) => Number(b.loved) - Number(a.loved))
                .map(({ id, loved }) => (
                  <motion.button key={id} className={`bag-give-pet${loved ? ' loved' : ''}`}
                    whileTap={{ scale: 0.92 }} onClick={() => doGive(id)}>
                    <span className="bag-give-face">{PETS[id].stages?.[1]?.emoji ?? '🐾'}</span>
                    <span className="bag-give-name">{PETS[id].name}</span>
                    {loved && <span className="bag-give-heart">💗 最愛</span>}
                  </motion.button>
                ))}
            </div>
            <button className="bag-give-cancel" onClick={() => setGiving(null)}>取消</button>
          </motion.div>
        </div>
      )}

      {/* 送出後的反應 */}
      {giveFx && (
        <motion.div className="bag-give-fx" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {giveFx.loved
            ? `💗 ${PETS[giveFx.petId].name} 超級喜歡這種花！心情 +${giveFx.mood}、經驗 +${giveFx.exp}`
            : `😊 ${PETS[giveFx.petId].name} 收下了！心情 +${giveFx.mood}、經驗 +${giveFx.exp}`}
        </motion.div>
      )}
    </div>
  )
}
