import { SHOP_ITEMS } from './shop'

export const GACHA_TIERS = [
  { id: 'normal', name: '普通扭蛋', cost: 80,  color: '#66BB6A', bg: '#F1F8E9', egg: '🟢', dupBonus: 20,  desc: '各種可愛配件和玩具！' },
  { id: 'rare',   name: '稀有扭蛋', cost: 250, color: '#42A5F5', bg: '#E3F2FD', egg: '🔵', dupBonus: 60,  desc: '精美服裝和特殊道具！' },
  { id: 'legend', name: '傳說扭蛋', cost: 600, color: '#FFA726', bg: '#FFF8E1', egg: '🌟', dupBonus: 150, desc: '超頂級家居和傳說道具！' },
]

const isGachable = (item) => item.category !== 'food' && !item.boss

export const GACHA_POOLS = {
  normal: SHOP_ITEMS.filter(i => isGachable(i) && i.price <= 120),
  rare:   SHOP_ITEMS.filter(i => isGachable(i) && i.price > 120 && i.price <= 250),
  legend: SHOP_ITEMS.filter(i => isGachable(i) && i.price > 250),
}

export function pullGacha(tierId, ownedItems) {
  const pool = GACHA_POOLS[tierId]
  if (!pool.length) return null
  const item    = pool[Math.floor(Math.random() * pool.length)]
  const isDup   = ownedItems.includes(item.id)
  const tier    = GACHA_TIERS.find(t => t.id === tierId)
  const dupBonus = isDup ? tier.dupBonus : 0
  return { item, isDup, dupBonus }
}
