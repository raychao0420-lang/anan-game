// LULU: 膽小、怕人、怕水的米格魯
// Hana & Kotaro: 日本超人氣水獺組合

export const PETS = {
  lulu: {
    id: 'lulu',
    name: 'LULU',
    breed: '米格魯',
    personality: '膽小、黏人、怕陌生人、怕水',
    unlockCost: 0,
    evolveCosts: [0, 200, 500, 1000], // cost to reach stage 2/3/4
    stages: [
      null,
      { emoji: '🐶', label: '小幼犬', size: '5rem', bg: '#FFF0E0', border: '#FFB347' },
      { emoji: '🐕', label: '活潑成犬', size: '6rem', bg: '#FFE0C0', border: '#FF8C00' },
      { emoji: '🦮', label: '英勇獵犬', size: '7rem', bg: '#FFD0A0', border: '#FF6600' },
      { emoji: '👑🐕👑', label: '傳說米格魯', size: '7.5rem', bg: '#FFE066', border: '#FFD700', glow: true },
    ],
    // scared reaction (怕水 / 怕人)
    scaredEmoji: '😰',
    happyEmoji: '🥰',
    sadEmoji: '😢',
  },
  hana: {
    id: 'hana',
    name: 'Hana',
    breed: '水獺',
    personality: '活潑好奇、愛玩水',
    unlockCost: 300,
    evolveCosts: [0, 300, 700, 1200],
    stages: [
      null,
      { emoji: '🦦', label: '小水獺', size: '5rem', bg: '#E0F4FF', border: '#64B5F6' },
      { emoji: '🦦✨', label: '靈動水獺', size: '6rem', bg: '#C0E8FF', border: '#2196F3' },
      { emoji: '⭐🦦⭐', label: '閃耀水獺', size: '7rem', bg: '#A0D8FF', border: '#1565C0' },
      { emoji: '👑🦦👑', label: '傳說水獺', size: '7.5rem', bg: '#80C4FF', border: '#0D47A1', glow: true },
    ],
    happyEmoji: '😄',
    sadEmoji: '🥺',
  },
  kotaro: {
    id: 'kotaro',
    name: 'Kotaro',
    breed: '水獺',
    personality: '沉穩、愛吃、和 Hana 形影不離',
    unlockCost: 600,
    evolveCosts: [0, 300, 700, 1200],
    stages: [
      null,
      { emoji: '🦦', label: '小水獺', size: '5rem', bg: '#E8FFE0', border: '#81C784' },
      { emoji: '🦦💚', label: '溫柔水獺', size: '6rem', bg: '#D0FFD0', border: '#4CAF50' },
      { emoji: '💚🦦💚', label: '翡翠水獺', size: '7rem', bg: '#B0F0B0', border: '#2E7D32' },
      { emoji: '👑🦦👑', label: '傳說水獺', size: '7.5rem', bg: '#90E090', border: '#1B5E20', glow: true },
    ],
    happyEmoji: '😊',
    sadEmoji: '🥺',
  },
}

export const PET_ORDER = ['lulu', 'hana', 'kotaro']
