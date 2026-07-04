import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS, PET_ORDER } from '../data/pets'
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shop'
import PetAvatar from '../components/PetAvatar'
import DecoArt from '../components/DecoArt'
import './BackpackScreen.css'

// 背包只放「可收藏／可使用」的道具（食物是消耗品，不進背包）
const BAG_CATEGORIES = SHOP_CATEGORIES.filter(c => c.id !== 'food')

export default function BackpackScreen({ onNavigate }) {
  const {
    coins, activePet, pets,
    ownedItems, petEquipment, equippedHomeItems,
    equipToPet, toggleHomeItem,
  } = useGameStore()

  const [category, setCategory] = useState('hat')

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

  const catCount = (catId) =>
    SHOP_ITEMS.filter(i => i.category === catId && ownedItems.includes(i.id)).length

  const isHomePlaced = (item) => equippedHomeItems.includes(item.id)

  return (
    <div className="bag-screen">
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
            {category === 'home' ? '點道具「擺放」到家裡佈置' : '點寵物頭像幫他穿戴'}
          </div>
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

      {/* Owned items */}
      {ownedInCategory.length === 0 ? (
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

                {isHome ? (
                  <motion.button
                    className={`bag-place-btn ${isHomePlaced(item) ? 'unplace' : ''}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHomeItem(item.id)}
                  >
                    {isHomePlaced(item) ? '✅ 已擺放' : '🏠 擺放'}
                  </motion.button>
                ) : (
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
    </div>
  )
}
