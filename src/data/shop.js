export const SHOP_CATEGORIES = [
  { id: 'food',      label: '食物', icon: '🍖' },
  { id: 'hat',       label: '帽子', icon: '🎩' },
  { id: 'clothes',   label: '衣著', icon: '👗' },
  { id: 'accessory', label: '配件', icon: '👓' },
  { id: 'toy',       label: '玩具', icon: '🎮' },
  { id: 'home',      label: '家居', icon: '🏠' },
  { id: 'rare',      label: '稀有', icon: '⭐' },
]

export const SHOP_ITEMS = [
  // ── 食物（餵食用，直接給 exp，不佔道具欄）──
  { id: 'bone',  name: '大骨頭', emoji: '🦴', category: 'food', price: 50,  desc: 'LULU 超愛！水獺普通',  exp: { lulu: 100, hana: 50,  kotaro: 50,  jiji: 20,  kitsune: 80,  mejiro: 5   } },
  { id: 'fish',  name: '小魚乾', emoji: '🐟', category: 'food', price: 50,  desc: '水獺超愛！',           exp: { lulu: 50,  hana: 100, kotaro: 100, jiji: 120, kitsune: 60,  mejiro: 40  } },
  { id: 'meat',  name: '烤肉串', emoji: '🍖', category: 'food', price: 80,  desc: '大家都愛！',           exp: { lulu: 80,  hana: 80,  kotaro: 80,  jiji: 80,  kitsune: 90,  mejiro: 10  } },
  { id: 'apple', name: '蘋果',   emoji: '🍎', category: 'food', price: 40,  desc: '健康零食',             exp: { lulu: 30,  hana: 30,  kotaro: 30,  jiji: 10,  kitsune: 40,  mejiro: 60  } },
  { id: 'berry', name: '莓果',   emoji: '🫐', category: 'food', price: 60,  desc: '北極狐超愛！繡眼鳥也喜歡', exp: { lulu: 40, hana: 40, kotaro: 40,  jiji: 30,  kitsune: 100, mejiro: 80  } },
  { id: 'nectar',name: '花蜜',   emoji: '🌺', category: 'food', price: 70,  desc: '繡眼鳥的最愛！香甜花蜜',   exp: { lulu: 10, hana: 20, kotaro: 20,  jiji: 10,  kitsune: 30,  mejiro: 120 } },
  // ── 帽子 ──
  { id: 'bow',     name: '蝴蝶結',   emoji: '🎀', category: 'hat',  price: 100, desc: '可愛滿分' },
  { id: 'cap',     name: '棒球帽',   emoji: '🧢', category: 'hat',  price: 120, desc: '運動風' },
  { id: 'crown',   name: '皇冠',     emoji: '👑', category: 'hat',  price: 300, desc: '王者之選' },
  { id: 'flower',  name: '花圈',     emoji: '🌸', category: 'hat',  price: 150, desc: '春天氣息' },
  // ── 衣著 ──
  { id: 'sweater',  name: '毛衣',     emoji: '🧶', category: 'clothes',   price: 150, desc: '柔軟暖心' },
  { id: 'apron',    name: '廚師圍裙', emoji: '🍳', category: 'clothes',   price: 120, desc: '小廚師登場' },
  { id: 'hoodie',   name: '帽T',      emoji: '🫧', category: 'clothes',   price: 180, desc: '酷帥休閒風' },
  { id: 'dress',    name: '小洋裝',   emoji: '👗', category: 'clothes',   price: 200, desc: '超美麗！' },
  // ── 配件 ──
  { id: 'glasses',  name: '眼鏡',     emoji: '👓', category: 'accessory', price: 100, desc: '知識感滿滿' },
  { id: 'scarf',    name: '圍巾',     emoji: '🧣', category: 'accessory', price: 80,  desc: '暖暖的' },
  { id: 'backpack', name: '小背包',   emoji: '🎒', category: 'accessory', price: 120, desc: '探險必備' },
  { id: 'necklace', name: '珍珠項鍊', emoji: '💎', category: 'accessory', price: 150, desc: '閃亮亮！' },
  // ── 玩具 ──
  { id: 'ball',    name: '網球',     emoji: '🎾', category: 'toy',  price: 80,  desc: 'LULU 愛追' },
  { id: 'teddy',   name: '玩偶',     emoji: '🧸', category: 'toy',  price: 120, desc: '軟綿綿' },
  { id: 'balloon', name: '彩色氣球', emoji: '🎈', category: 'toy',  price: 60,  desc: '繽紛可愛' },
  { id: 'star',    name: '閃亮星星', emoji: '⭐',  category: 'toy',  price: 200, desc: '閃閃發光' },
  // ── 家居裝飾 ──
  { id: 'sofa',         name: '粉紅沙發',  emoji: '🛋️', category: 'home', price: 150, desc: '舒適柔軟' },
  { id: 'plant',        name: '盆栽',      emoji: '🪴', category: 'home', price: 80,  desc: '生機勃勃' },
  { id: 'tent',         name: '小帳篷',    emoji: '⛺', category: 'home', price: 200, desc: '寵物秘密基地' },
  { id: 'pet_bed',      name: '寵物床',    emoji: '🛏️', category: 'home', price: 120, desc: '香甜好夢' },
  { id: 'painting',     name: '掛畫',      emoji: '🖼️', category: 'home', price: 100, desc: '藝術感十足' },
  { id: 'rainbow',      name: '彩虹窗',    emoji: '🌈', category: 'home', price: 90,  desc: '光線美麗' },
  { id: 'disco',        name: '旋轉燈',    emoji: '🪩', category: 'home', price: 180, desc: '派對時間！' },
  { id: 'fish_tank',    name: '小魚缸',    emoji: '🐠', category: 'home', price: 160, desc: '水獺最愛盯著看' },
  { id: 'pool',         name: '大水池',    emoji: '🌊', category: 'home', price: 280, desc: '水獺最愛！LULU有點怕…' },
  { id: 'mushroom_lamp',name: '蘑菇燈',    emoji: '🍄', category: 'home', price: 120, desc: '夜晚森林的魔法小燈' },
  { id: 'bamboo',       name: '竹林角落',  emoji: '🎋', category: 'home', price: 90,  desc: '清新自然、超療癒' },
  { id: 'bird_perch',   name: '棲木架',    emoji: '🪵', category: 'home', price: 110, desc: '繡眼鳥最愛停的地方' },
  { id: 'fairy_light',  name: '星光燈串',  emoji: '✨', category: 'home', price: 150, desc: '夢幻閃爍、超浪漫' },
  { id: 'snow_globe',   name: '雪景水晶球', emoji: '🔮', category: 'home', price: 180, desc: 'Yuki 的最愛' },
  { id: 'igloo',        name: '冰屋',       emoji: '🛖', category: 'home', price: 220, desc: 'Yuki 的秘密冬日基地' },
  // ── 稀有（Boss 獎勵，不可購買） ──
  { id: 'boss_medal1', name: '勇者勳章',   emoji: '🎖️', category: 'rare', price: 0, desc: '打倒第一章Boss', boss: true },
  { id: 'boss_medal2', name: '三位數之印', emoji: '🏅', category: 'rare', price: 0, desc: '打倒第二章Boss', boss: true },
  { id: 'boss_medal3', name: '乘法魔法戒', emoji: '💍', category: 'rare', price: 0, desc: '打倒第三章Boss', boss: true },
  { id: 'boss_medal4', name: '傳說盾牌',   emoji: '🛡️', category: 'rare', price: 0, desc: '打倒終章Boss',   boss: true },
  { id: 'exam_trophy', name: '狀元獎盃',   emoji: '🏆', category: 'rare', price: 0, desc: '期末考大魔王首次過關獎勵', boss: true },
]
