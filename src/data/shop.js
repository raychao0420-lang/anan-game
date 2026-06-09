export const SHOP_CATEGORIES = [
  { id: 'food', label: '食物', icon: '🍖' },
  { id: 'hat',  label: '帽子', icon: '🎩' },
  { id: 'toy',  label: '玩具', icon: '🎮' },
  { id: 'rare', label: '稀有', icon: '⭐' },
]

export const SHOP_ITEMS = [
  // ── 食物 ──
  { id: 'bone',    name: '大骨頭',   emoji: '🦴', category: 'food', price: 50,  desc: 'LULU 最愛' },
  { id: 'fish',    name: '小魚乾',   emoji: '🐟', category: 'food', price: 50,  desc: '水獺最愛' },
  { id: 'meat',    name: '烤肉串',   emoji: '🍖', category: 'food', price: 80,  desc: '超美味！' },
  { id: 'apple',   name: '蘋果',     emoji: '🍎', category: 'food', price: 40,  desc: '健康零食' },
  // ── 帽子 ──
  { id: 'bow',     name: '蝴蝶結',   emoji: '🎀', category: 'hat',  price: 100, desc: '可愛滿分' },
  { id: 'cap',     name: '棒球帽',   emoji: '🧢', category: 'hat',  price: 120, desc: '運動風' },
  { id: 'crown',   name: '皇冠',     emoji: '👑', category: 'hat',  price: 300, desc: '王者之選' },
  { id: 'flower',  name: '花圈',     emoji: '🌸', category: 'hat',  price: 150, desc: '春天氣息' },
  // ── 玩具 ──
  { id: 'ball',    name: '網球',     emoji: '🎾', category: 'toy',  price: 80,  desc: 'LULU 愛追' },
  { id: 'teddy',   name: '玩偶',     emoji: '🧸', category: 'toy',  price: 120, desc: '軟綿綿' },
  { id: 'balloon', name: '彩色氣球', emoji: '🎈', category: 'toy',  price: 60,  desc: '繽紛可愛' },
  { id: 'star',    name: '閃亮星星', emoji: '⭐',  category: 'toy',  price: 200, desc: '閃閃發光' },
  // ── 稀有（Boss 獎勵，不可購買） ──
  { id: 'boss_medal1', name: '勇者勳章',   emoji: '🎖️', category: 'rare', price: 0, desc: '打倒第一章Boss', boss: true },
  { id: 'boss_medal2', name: '三位數之印', emoji: '🏅', category: 'rare', price: 0, desc: '打倒第二章Boss', boss: true },
  { id: 'boss_medal3', name: '乘法魔法戒', emoji: '💍', category: 'rare', price: 0, desc: '打倒第三章Boss', boss: true },
  { id: 'boss_medal4', name: '傳說盾牌',   emoji: '🛡️', category: 'rare', price: 0, desc: '打倒終章Boss',   boss: true },
]
