// LULU: 膽小、怕人、怕水的米格魯（永遠的小狗寶貝！）
// Hana & Kotaro: 日本超人氣水獺組合
// 吉吉: 神秘隱藏黑貓，解鎖 Kotaro 後出現
// 小北: 動物園來的北極狐，解鎖吉吉後出現
// 小綠: 動物園的小綠繡眼，解鎖小北後出現
// 波波: 企鵝，闖過「兩步驟應用題」三關後加入（也可金幣解鎖）
// 嚕嚕: 貓頭鷹，吉吉的魔法夥伴，傳說扭蛋有機會抽到（也可金幣解鎖）
// 圓圓: 海豹，遊樂場「傳說連十關」全過獲得（也可金幣解鎖）
// 阿丁 / 小麥: 河狸與倉鼠，圖鑑金幣解鎖
// 註：事件取得的寵物刻意不設 unlockRequires，確保拿到後一定看得到

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
      { emoji: '🐶', label: '狗寶寶',     size: '5rem', bg: '#FFF0E0', border: '#FFB347' },
      { emoji: '🐶', label: '毛茸茸',     size: '5rem', bg: '#FFE0D0', border: '#FF9060' },
      { emoji: '🐶', label: '蜂蜜狗狗',   size: '5rem', bg: '#FFF0A0', border: '#FFB800' },
      { emoji: '🐶', label: '傳說毛寶貝', size: '5rem', bg: '#FFE066', border: '#FFD700', glow: true },
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
      { emoji: '🐱',  label: '小黑貓',     size: '5rem', bg: '#F0E6FF', border: '#9C6FD6' },
      { emoji: '🐈‍⬛', label: '淘氣黑貓',   size: '5rem', bg: '#DDD0FF', border: '#7B4FC8' },
      { emoji: '🐈‍⬛', label: '神秘黑貓',   size: '5rem', bg: '#C4B0FF', border: '#5A2FA0' },
      { emoji: '🐈‍⬛', label: '傳說魔法貓', size: '5rem', bg: '#2A1A4A', border: '#C084FC', glow: true },
    ],
    happyEmoji: '😸',
    sadEmoji: '😾',
  },
  kitsune: {
    id: 'kitsune',
    name: 'Yuki',
    breed: '北極狐',
    personality: '愛在雪地打滾、慵懶又傲嬌',
    unlockCost: 1000,
    unlockRequires: 'jiji',
    stages: [
      null,
      { emoji: '🦊', label: '雪地小狐',   size: '5rem', bg: '#EEF8FF', border: '#A8D8EA' },
      { emoji: '🦊', label: '冰原狐狸',   size: '5rem', bg: '#D4EEFF', border: '#5BA4CF' },
      { emoji: '🦊', label: '霜雪之狐',   size: '5rem', bg: '#B8E0FF', border: '#2C7CB0' },
      { emoji: '🦊', label: '傳說北極狐', size: '5rem', bg: '#9ACFFF', border: '#0A5CA8', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
  mejiro: {
    id: 'mejiro',
    name: '小綠',
    breed: '繡眼鳥',
    personality: '愛唱歌、停不下來、喜歡花蜜',
    unlockCost: 1200,
    unlockRequires: 'kitsune',
    stages: [
      null,
      { emoji: '🐦', label: '小小繡眼', size: '5rem', bg: '#F0FFF4', border: '#90EE90' },
      { emoji: '🐦', label: '翠鳴繡眼', size: '5rem', bg: '#DCFFDC', border: '#4CAF50' },
      { emoji: '🐦', label: '林間歌者', size: '5rem', bg: '#C8FFC8', border: '#2E7D32' },
      { emoji: '🐦', label: '傳說繡眼', size: '5rem', bg: '#B4FFB4', border: '#1B5E20', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '😔',
  },
  penguin: {
    id: 'penguin',
    name: '波波',
    breed: '企鵝',
    personality: '搖搖擺擺、愛滑冰、超怕熱',
    unlockCost: 1400,
    stages: [
      null,
      { emoji: '🐧', label: '小企鵝',   size: '5rem', bg: '#E1F5FE', border: '#4FC3F7' },
      { emoji: '🐧', label: '滑冰菜鳥', size: '5rem', bg: '#C5EAFB', border: '#29B6F6' },
      { emoji: '🐧', label: '冰上舞者', size: '5rem', bg: '#A8DEF8', border: '#0288D1' },
      { emoji: '🐧', label: '傳說企鵝', size: '5rem', bg: '#8BD2F5', border: '#01579B', glow: true },
    ],
    happyEmoji: '😆',
    sadEmoji: '🥶',
  },
  owl: {
    id: 'owl',
    name: '嚕嚕',
    breed: '貓頭鷹',
    personality: '博學、晚上才有精神、會看星象',
    unlockCost: 1600,
    stages: [
      null,
      { emoji: '🦉', label: '小貓頭鷹',     size: '5rem', bg: '#EDE7F6', border: '#9575CD' },
      { emoji: '🦉', label: '夜行貓頭鷹',   size: '5rem', bg: '#D9CEF0', border: '#7E57C2' },
      { emoji: '🦉', label: '星空貓頭鷹',   size: '5rem', bg: '#C3B0E6', border: '#5E35B1' },
      { emoji: '🦉', label: '傳說魔法貓頭鷹', size: '5rem', bg: '#2A1A4A', border: '#B388FF', glow: true },
    ],
    happyEmoji: '🤩',
    sadEmoji: '😴',
  },
  seal: {
    id: 'seal',
    name: '圓圓',
    breed: '海豹',
    personality: '圓滾滾、愛曬太陽、會拍手',
    unlockCost: 1800,
    stages: [
      null,
      { emoji: '🦭', label: '小海豹',   size: '5rem', bg: '#E3F2FD', border: '#64B5F6' },
      { emoji: '🦭', label: '圓潤海豹', size: '5rem', bg: '#CDE7FB', border: '#42A5F5' },
      { emoji: '🦭', label: '陽光海豹', size: '5rem', bg: '#B3DAF8', border: '#1E88E5' },
      { emoji: '🦭', label: '傳說海豹', size: '5rem', bg: '#9BCDF5', border: '#1565C0', glow: true },
    ],
    happyEmoji: '😄',
    sadEmoji: '🥺',
  },
  beaver: {
    id: 'beaver',
    name: '阿丁',
    breed: '河狸',
    personality: '認真的小工程師、愛蓋水壩、有點固執',
    unlockCost: 2000,
    stages: [
      null,
      { emoji: '🦫', label: '小木匠',     size: '5rem', bg: '#EFEBE9', border: '#A1887F' },
      { emoji: '🦫', label: '築壩高手',   size: '5rem', bg: '#E0D6CF', border: '#8D6E63' },
      { emoji: '🦫', label: '河川工程師', size: '5rem', bg: '#D2C2B5', border: '#6D4C41' },
      { emoji: '🦫', label: '傳說河狸',   size: '5rem', bg: '#C4AE9C', border: '#4E342E', glow: true },
    ],
    happyEmoji: '😁',
    sadEmoji: '😟',
  },
  hamster: {
    id: 'hamster',
    name: '小麥',
    breed: '倉鼠',
    personality: '貪吃、愛塞滿頰袋、天不怕地不怕',
    unlockCost: 2200,
    stages: [
      null,
      { emoji: '🐹', label: '小不點',   size: '5rem', bg: '#FFF8E1', border: '#FFCA28' },
      { emoji: '🐹', label: '圓滾頰袋', size: '5rem', bg: '#FFEFC0', border: '#FFB300' },
      { emoji: '🐹', label: '黃金麥鼠', size: '5rem', bg: '#FFE49E', border: '#FF8F00' },
      { emoji: '🐹', label: '傳說倉鼠', size: '5rem', bg: '#FFD877', border: '#E65100', glow: true },
    ],
    happyEmoji: '😋',
    sadEmoji: '🥺',
  },
}

export const PET_ORDER = ['lulu', 'hana', 'kotaro', 'jiji', 'kitsune', 'mejiro', 'penguin', 'owl', 'seal', 'beaver', 'hamster']
