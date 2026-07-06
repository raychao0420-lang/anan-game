// LULU: 膽小、怕人、怕水的米格魯（永遠的小狗寶貝！）
// Hana & Kotaro: 日本超人氣水獺組合
// 吉吉: 神秘隱藏黑貓，解鎖 Kotaro 後出現
// 小北: 動物園來的北極狐，解鎖吉吉後出現
// 小綠: 動物園的小綠繡眼，解鎖小北後出現
// 波波: 企鵝，「只能」闖過「兩步驟應用題」三關後加入（不可金幣購買）
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
    purchasable: false, // 只能靠闖關獲得，不能用金幣買，增加闖關動力
    unlockHint: '闖過「兩步驟應用題」三關就能帶牠回家！',
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
  // 豆豆：推理事件簿「恐龍樂園」破案帶回的小恐龍（事件限定，不可金幣購買）
  dino: {
    id: 'dino',
    name: '豆豆',
    breed: '小恐龍',
    personality: '好奇、把恐龍蛋當家人、走到哪跟到哪',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '破解推理事件簿「不見的恐龍蛋」就能帶牠回家！',
    stages: [
      null,
      { emoji: '🦕', label: '恐龍寶寶',   size: '5rem', bg: '#EAFBE4', border: '#7CC96B' },
      { emoji: '🦕', label: '嫩葉小龍',   size: '5rem', bg: '#DFF6D6', border: '#5EA84F' },
      { emoji: '🦕', label: '翡翠幼龍',   size: '5rem', bg: '#D6F5EC', border: '#3E9870' },
      { emoji: '🦕', label: '傳說小恐龍', size: '5rem', bg: '#CFF7F0', border: '#2E9E8A' },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
  // 皮皮：推理事件簿「馬戲團」破案帶回的小猴子（事件限定）
  monkey: {
    id: 'monkey',
    name: '皮皮',
    breed: '小猴子',
    personality: '愛雜耍、調皮、看到亮亮的東西就想玩',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '破解推理事件簿「消失的魔術道具」就能帶牠回家！',
    stages: [
      null,
      { emoji: '🐵', label: '猴寶寶',   size: '5rem', bg: '#F5E6D0', border: '#B07A4E' },
      { emoji: '🐵', label: '頑皮小猴', size: '5rem', bg: '#EFDCC0', border: '#A66E42' },
      { emoji: '🐒', label: '雜耍高手', size: '5rem', bg: '#E8CFA8', border: '#9A5E34' },
      { emoji: '🐒', label: '傳說金猴', size: '5rem', bg: '#F5E0B0', border: '#C98A2E' },
    ],
    happyEmoji: '🤩',
    sadEmoji: '🙈',
  },
  // 麻吉：推理事件簿「午夜列車」破案帶回的小浣熊（事件限定）
  raccoon: {
    id: 'raccoon',
    name: '麻吉',
    breed: '小浣熊',
    personality: '夜貓子、好奇、愛收集亮晶晶的小東西',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '破解推理事件簿「午夜列車的失物」就能帶牠回家！',
    stages: [
      null,
      { emoji: '🦝', label: '浣熊寶寶',   size: '5rem', bg: '#EDF0F2', border: '#9AA6B0' },
      { emoji: '🦝', label: '夜行小浣熊', size: '5rem', bg: '#E4E8EB', border: '#8A97A2' },
      { emoji: '🦝', label: '尋寶浣熊',   size: '5rem', bg: '#DAE0E4', border: '#78868F' },
      { emoji: '🦝', label: '傳說夜浣熊', size: '5rem', bg: '#EAE4FA', border: '#8A7EC8' },
    ],
    happyEmoji: '🤩',
    sadEmoji: '🥺',
  },
  // 小星：連載劇《七色星願》終章送回家的走失星星精靈（事件限定，不可金幣購買）
  twinkle: {
    id: 'twinkle',
    name: '小星',
    breed: '星星精靈',
    personality: '害羞、想家、夜裡會發出溫暖的光',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《七色星願之謎》終章，送小星回家就能永遠當好朋友！',
    stages: [
      null,
      { emoji: '🌟', label: '迷路小星',   size: '5rem', bg: '#FFF6D0', border: '#F0C24E' },
      { emoji: '🌟', label: '微光小星',   size: '5rem', bg: '#FFF2C0', border: '#EBB43A' },
      { emoji: '🌟', label: '閃亮小星',   size: '5rem', bg: '#FFEEA8', border: '#E6A828' },
      { emoji: '🌟', label: '傳說星願精靈', size: '5rem', bg: '#FFF6C0', border: '#FFD54A', glow: true },
    ],
    happyEmoji: '🤩',
    sadEmoji: '🥺',
  },
}

export const PET_ORDER = ['lulu', 'hana', 'kotaro', 'jiji', 'kitsune', 'mejiro', 'penguin', 'owl', 'seal', 'beaver', 'hamster', 'dino', 'monkey', 'raccoon', 'twinkle']

// ── 寵物專屬技能 & 能量系統 ─────────────────────────────────────────────
// 能量靠答題回復（每題 +5，答對答錯都給），手動按技能鈕發動、消耗 20 能量。
// 一次發動只作用在「當下這一題」，換題就失效。滿能量 100 = 可連用 5 次。
// LULU 是最強寵物：所有題型 +10 秒（成本跟大家一樣，靠效果取勝）。
export const ENERGY_MAX = 100
export const ENERGY_START = 20            // 初次遊玩就有一次技能可用
export const ENERGY_PER_QUESTION = 5      // 每答一題回復
export const SKILL_COST = 20              // 每次發動消耗（統一）

// effect.type: 'time'(當題加秒) | 'coin'(當題答對金幣加碼 mult/add) | 'shield'(當題答錯不斷連段)
export const PET_SKILLS = {
  lulu:    { name: '勇氣時光', icon: '⏳', effect: { type: 'time',  value: 10 }, desc: '這一題 +10 秒（最強！）' },
  hana:    { name: '歡樂加倍', icon: '💞', effect: { type: 'coin',  mult: 2 },   desc: '這一題答對金幣 ×2' },
  kotaro:  { name: '沉穩加時', icon: '🍃', effect: { type: 'time',  value: 6 },  desc: '這一題 +6 秒' },
  jiji:    { name: '魔法護盾', icon: '🛡️', effect: { type: 'shield' },           desc: '這一題答錯不斷連段' },
  kitsune: { name: '冰霜凝結', icon: '❄️', effect: { type: 'time',  value: 7 },  desc: '這一題 +7 秒' },
  mejiro:  { name: '花蜜金幣', icon: '🌼', effect: { type: 'coin',  add: 15 },   desc: '這一題答對 +15 金幣' },
  penguin: { name: '滑冰加速', icon: '⛸️', effect: { type: 'time',  value: 5 },  desc: '這一題 +5 秒' },
  owl:     { name: '智慧之光', icon: '✨', effect: { type: 'coin',  mult: 2 },   desc: '這一題答對金幣 ×2' },
  seal:    { name: '陽光護盾', icon: '🌞', effect: { type: 'shield' },           desc: '這一題答錯不斷連段' },
  beaver:  { name: '築壩加時', icon: '🪵', effect: { type: 'time',  value: 6 },  desc: '這一題 +6 秒' },
  hamster: { name: '囤積金幣', icon: '🌰', effect: { type: 'coin',  add: 12 },   desc: '這一題答對 +12 金幣' },
  dino:    { name: '恐龍護盾', icon: '🥚', effect: { type: 'shield' },           desc: '這一題答錯不斷連段' },
  monkey:  { name: '雜耍金幣', icon: '🎪', effect: { type: 'coin',  mult: 2 },   desc: '這一題答對金幣 ×2' },
  raccoon: { name: '夜行加時', icon: '🌙', effect: { type: 'time',  value: 7 },  desc: '這一題 +7 秒' },
  twinkle: { name: '星願之光', icon: '🌠', effect: { type: 'coin',  add: 20 },   desc: '這一題答對 +20 金幣' },
}
