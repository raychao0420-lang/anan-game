import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS, PET_ORDER } from '../data/pets'
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shop'
import './ShopScreen.css'

export default function ShopScreen({ onNavigate }) {
  const {
    coins, activePet, pets, ownedItems,
    petEquipment, equippedHomeItems,
    buyItem, equipToPet, toggleHomeItem,
  } = useGameStore()
  const [category, setCategory] = useState('food')
  const [buyFeedback, setBuyFeedback] = useState(null)

  const petDef = PETS[activePet]
  const petData = pets[activePet]
  const petStage = petDef.stages[petData.evolutionStage]

  const hasAnyRare = SHOP_ITEMS.filter(i => i.category === 'rare').some(i => ownedItems.includes(i.id))
  const visibleCategories = SHOP_CATEGORIES.filter(c => c.id !== 'rare' || hasAnyRare)

  const isHomePlaced = (item) => equippedHomeItems.includes(item.id)
  const anyPetEquipped = (item) => Object.values(petEquipment).some(arr => arr.includes(item.id))
  const isAnyEquipped = (item) => item.category === 'home' ? isHomePlaced(item) : anyPetEquipped(item)

  const filtered = SHOP_ITEMS.filter((i) => i.category === category)
  const unlockedPetIds = PET_ORDER.filter(id => pets[id]?.unlocked)

  const activePetEquipped = (petEquipment[activePet] || [])
    .map(id => SHOP_ITEMS.find(i => i.id === id))
    .filter(Boolean)

  const handleBuy = (item) => {
    if (ownedItems.includes(item.id) || coins < item.price) return
    buyItem(item.id, item.price)
    setBuyFeedback(item.id)
    setTimeout(() => setBuyFeedback(null), 1000)
  }

  return (
    <div className="shop-screen">
      {/* Header */}
      <div className="shop-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="shop-title">🛍️ 裝飾商店</span>
        <span className="shop-coins">💰 {coins}</span>
      </div>

      <div className="shop-sidebar">
        {/* Active pet preview */}
        <div className="shop-pet-preview">
          <motion.div
            className="shop-pet-bubble"
            style={{ background: petStage.bg, border: `3px solid ${petStage.border}` }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <span style={{ fontSize: '3.5rem' }}>{petStage.emoji}</span>
          </motion.div>
          <div className="shop-equipped-row">
            {activePetEquipped.length === 0
              ? <span className="shop-equipped-empty">
                  {category === 'home' ? '家具會出現在你的家！' : '購買道具後幫寵物裝備！'}
                </span>
              : activePetEquipped.map((item) => (
                  <motion.span
                    key={item.id}
                    className="shop-equipped-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    title={item.name}
                  >
                    {item.emoji}
                  </motion.span>
                ))
            }
          </div>
          <div className="shop-pet-name">
            {category === 'home' ? '🏠 家居佈置' : `${petDef.name} 的裝扮`}
          </div>
        </div>

        {/* Category tabs */}
        <div className="shop-cats">
          {visibleCategories.map((c) => (
            <motion.button
              key={c.id}
              className={`shop-cat-btn ${category === c.id ? 'active' : ''}`}
              whileTap={{ scale: 0.92 }}
              onClick={() => setCategory(c.id)}
            >
              {c.icon} {c.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="shop-grid">
        {filtered.map((item) => {
          const owned = ownedItems.includes(item.id)
          const canAfford = coins >= item.price
          const isHome = item.category === 'home'

          return (
            <motion.div
              key={item.id}
              className={`shop-item ${owned ? 'owned' : ''} ${isAnyEquipped(item) ? 'equipped' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="shop-item-emoji">{item.emoji}</div>
              <div className="shop-item-name">{item.name}</div>
              <div className="shop-item-desc">{item.desc}</div>

              {buyFeedback === item.id && (
                <motion.div className="shop-buy-flash" initial={{ scale: 0 }} animate={{ scale: [1.2, 1] }}>
                  🎉
                </motion.div>
              )}

              {owned ? (
                isHome ? (
                  /* Home items: single place/remove button */
                  <motion.button
                    className={`shop-equip-btn ${isHomePlaced(item) ? 'unequip' : ''}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHomeItem(item.id)}
                  >
                    {isHomePlaced(item) ? '✅ 已擺放' : '擺放'}
                  </motion.button>
                ) : (
                  /* Pet accessories: one button per unlocked pet */
                  <div className="shop-pet-btns">
                    {unlockedPetIds.map(petId => {
                      const pDef = PETS[petId]
                      const pStage = pDef.stages[pets[petId].evolutionStage]
                      const eq = petEquipment[petId]?.includes(item.id)
                      return (
                        <motion.button
                          key={petId}
                          className={`shop-pet-btn ${eq ? 'active' : ''}`}
                          whileTap={{ scale: 0.82 }}
                          onClick={() => equipToPet(petId, item.id)}
                          title={pDef.name}
                        >
                          <span className="shop-pet-btn-emoji">{pStage.emoji}</span>
                          {eq && <span className="shop-pet-btn-check">✓</span>}
                        </motion.button>
                      )
                    })}
                  </div>
                )
              ) : item.boss ? (
                <div className="shop-boss-locked">⚔️ Boss獎勵</div>
              ) : (
                <motion.button
                  className={`shop-buy-btn ${!canAfford ? 'broke' : ''}`}
                  whileTap={canAfford ? { scale: 0.9 } : {}}
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                >
                  💰 {item.price}
                </motion.button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
