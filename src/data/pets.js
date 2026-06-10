// LULU: 膽小、怕人、怕水的米格魯（永遠的小奶狗！）
// Hana & Kotaro: 日本超人氣水獺組合
// 吉吉: 神秘隱藏黑貓，解鎖 Kotaro 後出現

// exp needed to go from stage N to N+1 (index = current stage)
export const EVOLVE_EXP = [0, 500, 2000, 5000]

export const PETS = {
  lulu: {
    id: 'lulu',
    name: 'LULU',
    breed: '米格魯',
    personality: '膽小、黏人、怕陌生人、怕水',
    unlockCost: 0,
    stages: [
      null,
      { emoji: '🐶', label: '小奶狗',     size: '5rem', bg: '#FFF0E0', border: '#FFB347' },
      { emoji: '🐶', label: '蓬鬆幼犬',   size: '5rem', bg: '#FFE0D0', border: '#FF9060' },
      { emoji: '🐶', label: '蜂蜜小狗',   size: '5rem', bg: '#FFF0A0', border: '#FFB800' },
      { emoji: '🐶', label: '傳說小奶狗', size: '5rem', bg: '#FFE066', border: '#FFD700', glow: true },
    ],
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
    stages: [
      null,
      { emoji: '🦦', label: '小水獺',   size: '5rem', bg: '#E0F4FF', border: '#64B5F6' },
      { emoji: '🦦', label: '靈動水獺', size: '5rem', bg: '#C0E8FF', border: '#2196F3' },
      { emoji: '🦦', label: '閃耀水獺', size: '5rem', bg: '#A0D8FF', border: '#1565C0' },
      { emoji: '🦦', label: '傳說水獺', size: '5rem', bg: '#80C4FF', border: '#0D47A1', glow: true },
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
    stages: [
      null,
      { emoji: '🦦', label: '小水獺',   size: '5rem', bg: '#E8FFE0', border: '#81C784' },
      { emoji: '🦦', label: '溫柔水獺', size: '5rem', bg: '#D0FFD0', border: '#4CAF50' },
      { emoji: '🦦', label: '翡翠水獺', size: '5rem', bg: '#B0F0B0', border: '#2E7D32' },
      { emoji: '🦦', label: '傳說水獺', size: '5rem', bg: '#90E090', border: '#1B5E20', glow: true },
    ],
    happyEmoji: '😊',
    sadEmoji: '🥺',
  },
  jiji: {
    id: 'jiji',
    name: '吉吉',
    breed: '黑貓',
    personality: '神秘、安靜、會魔法？',
    unlockCost: 800,
    unlockRequires: 'kotaro',
    stages: [
      null,
      { emoji: '🐱', label: '小黑貓',     size: '5rem', bg: '#F0E6FF', border: '#9C6FD6' },
      { emoji: '🐈‍⬛', label: '淘氣黑貓',   size: '5rem', bg: '#DDD0FF', border: '#7B4FC8' },
      { emoji: '🐈‍⬛', label: '神秘黑貓',   size: '5rem', bg: '#C4B0FF', border: '#5A2FA0' },
      { emoji: '🐈‍⬛', label: '傳說魔法貓', size: '5rem', bg: '#2A1A4A', border: '#C084FC', glow: true },
    ],
    happyEmoji: '😸',
    sadEmoji: '😾',
  },
}

export const PET_ORDER = ['lulu', 'hana', 'kotaro', 'jiji']
