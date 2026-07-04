import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { PETS } from '../data/pets'
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shop'
import PetAvatar from '../components/PetAvatar'
import './ShopScreen.css'

export default function ShopScreen({ onNavigate }) {
  const {
    coins, activePet, pets, ownedItems,
    petEquipment, equippedHomeItems,
    buyItem, feedPet,
  } = useGameStore()
  const [category, setCategory] = useState('food')
  const [buyFeedback, setBuyFeedback] = useState(null)
  const [feedFlash, setFeedFlash] = useState(null) // { itemId, exp }

  const petDef = PETS[activePet]
  const petData = pets[activePet]

  const hasAnyRare = SHOP_ITEMS.filter(i => i.category === 'rare').some(i => ownedItems.includes(i.id))
  const visibleCategories = SHOP_CATEGORIES.filter(c => c.id !== 'rare' || hasAnyRare)

  const isHomePlaced = (item) => equippedHomeItems.includes(item.id)
  const anyPetEquipped = (item) => Object.values(petEquipment).some(arr => arr.includes(item.id))
  const isAnyEquipped = (item) => item.category === 'home' ? isHomePlaced(item) : anyPetEquipped(item)

  const filtered = SHOP_ITEMS.filter((i) => i.category === category)

  const activePetEquipped = (petEquipment[activePet] || [])
    .map(id => SHOP_ITEMS.find(i => i.id === id))
    .filter(Boolean)

  const MOOD_BOOST = { toy: 8, home: 5, accessory: 3 }

  const handleBuy = (item) => {
    if (ownedItems.includes(item.id) || coins < item.price) return
    buyItem(item.id, item.price, MOOD_BOOST[item.category] || 0)
    setBuyFeedback(item.id)
    setTimeout(() => setBuyFeedback(null), 1000)
  }

  const handleFeed = (item) => {
    if (coins < item.price) return
    const expGain = item.exp[activePet] || 0
    feedPet(activePet, item.price, expGain)
    setFeedFlash({ itemId: item.id, exp: expGain })
    setTimeout(() => setFeedFlash(null), 1200)
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
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <PetAvatar
              petId={activePet}
              evolutionStage={petData.evolutionStage}
              equipped={activePetEquipped}
              size={100}
            />
          </motion.div>
          <div className="shop-equipped-row">
            {activePetEquipped.length === 0
              ? <span className="shop-equipped-empty">
                  {category === 'home' ? '買好的家具會收進🎒背包！' : '買好的道具會收進🎒背包！'}
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
          const isFood = item.category === 'food'
          const owned = !isFood && ownedItems.includes(item.id)
          const canAfford = coins >= item.price
          const isHome = item.category === 'home'
          const petExpGain = isFood ? (item.exp[activePet] || 0) : 0

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
              {feedFlash?.itemId === item.id && (
                <motion.div
                  className="shop-buy-flash shop-feed-flash"
                  initial={{ scale: 0, y: 0 }}
                  animate={{ scale: [1.2, 1], y: -24, opacity: [1, 1, 0] }}
                  transition={{ duration: 1 }}
                >
                  +{feedFlash.exp} exp
                </motion.div>
              )}

              {isFood ? (
                /* Food: always feedable, costs coins, gives pet-specific exp */
                <motion.button
                  className={`shop-buy-btn food-feed-btn ${!canAfford ? 'broke' : ''}`}
                  whileTap={canAfford ? { scale: 0.9 } : {}}
                  onClick={() => handleFeed(item)}
                  disabled={!canAfford}
                >
                  🍖 餵食 <span className="feed-exp-badge">+{petExpGain} exp</span>
                </motion.button>
              ) : owned ? (
                <motion.button
                  className="shop-owned-tag"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onNavigate('backpack')}
                >
                  ✅ 已擁有 · 🎒 去背包{isHome ? '擺放' : '穿戴'}
                </motion.button>
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
