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
    breed: '副櫛龍',
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
  // 小月：連載劇《星空亂了套》終章陪回家的月亮精靈（事件限定，不可金幣購買）
  luna: {
    id: 'luna',
    name: '小月',
    breed: '月亮精靈',
    personality: '愛哭又勇敢、怕孤單、夜裡會發出溫柔的月光',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《星空亂了套》終章，陪小月回家就能永遠當好朋友！',
    stages: [
      null,
      { emoji: '🌙', label: '迷路小月',   size: '5rem', bg: '#EFF4FF', border: '#9FB4DC' },
      { emoji: '🌙', label: '安心小月',   size: '5rem', bg: '#E8EFFF', border: '#8DA6D6' },
      { emoji: '🌙', label: '亮亮小月',   size: '5rem', bg: '#E0EAFF', border: '#7B98D0' },
      { emoji: '🌙', label: '傳說月光精靈', size: '5rem', bg: '#EAF1FF', border: '#8FA8E8', glow: true },
    ],
    happyEmoji: '🤩',
    sadEmoji: '🥺',
  },
  // 小冥：連載劇《太陽系大冒險》終章接回家的冥王星矮行星精靈（事件限定，不可金幣購買）
  pluto: {
    id: 'pluto',
    name: '小冥',
    breed: '矮行星精靈',
    personality: '怕被忘記、想家、胸口有一片心形冰原，被接住後會發出暖暖的光',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《太陽系大冒險》終章，把小冥接回家就能永遠當一家人！',
    stages: [
      null,
      { emoji: '🌑', label: '迷路小冥',   size: '5rem', bg: '#EEF0F6', border: '#9AA6BE' },
      { emoji: '🌑', label: '微光小冥',   size: '5rem', bg: '#EDEFF7', border: '#8E9AC0' },
      { emoji: '🌑', label: '暖暖小冥',   size: '5rem', bg: '#F0ECF7', border: '#A98FD0' },
      { emoji: '🌑', label: '傳說冥王星精靈', size: '5rem', bg: '#F2ECFA', border: '#B49AE0', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
  // 小Q：連載劇《邏輯偵探學院》終章畢業大考後成為安安搭檔的邏輯貓頭鷹精靈（事件限定，不可金幣購買）
  xiaoq: {
    id: 'xiaoq',
    name: '小Q',
    breed: '邏輯貓頭鷹精靈',
    personality: '傲嬌又聰明、口頭禪「尤里卡！」、胸前有一撮問號形羽毛，等了四十年終於找到新搭檔',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《邏輯偵探學院》終章畢業大考，小Q 就會站上你的肩膀，成為永遠的搭檔！',
    stages: [
      null,
      { emoji: '🦉', label: '問號雛鳥',     size: '5rem', bg: '#F0F1F5', border: '#A9B0BE' },
      { emoji: '🦉', label: '見習貓頭鷹',   size: '5rem', bg: '#EDEFF4', border: '#93A0B4' },
      { emoji: '🦉', label: '驚嘆號貓頭鷹', size: '5rem', bg: '#F2F0EA', border: '#B49A54' },
      { emoji: '🦉', label: '名偵探貓頭鷹', size: '5rem', bg: '#F7F3E4', border: '#D4AF37', glow: true },
    ],
    happyEmoji: '🤩',
    sadEmoji: '🥺',
  },
  // 飛飛：連載劇《環遊世界大冒險》終章加入的信天翁郵差（事件限定，不可金幣購買）
  feifei: {
    id: 'feifei',
    name: '飛飛',
    breed: '信天翁郵差',
    personality: '溫柔、方向感超好、翅膀展開像一整片雲，背著裝了四十年謝謝的小信袋',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《環遊世界大冒險》終章世界同學會，飛飛就會收起信袋，永遠陪你一起飛！',
    stages: [
      null,
      { emoji: '🕊️', label: '迷糊雛鳥',     size: '5rem', bg: '#F4F7FA', border: '#AEBFCC' },
      { emoji: '🕊️', label: '順風少年',     size: '5rem', bg: '#EFF6FB', border: '#8FB4D0' },
      { emoji: '🕊️', label: '環球飛行家',   size: '5rem', bg: '#EAF4FC', border: '#6FA8D4' },
      { emoji: '🕊️', label: '傳說信天翁',   size: '5rem', bg: '#F0F7FF', border: '#7FB0E8', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
  // 小虎：連載劇《漫遊台灣大冒險》終章加入的黑臘腸（事件限定，不可金幣購買）
  xiaohu: {
    id: 'xiaohu',
    name: '小虎',
    breed: '短毛黑臘腸',
    personality: '短短的腿、長長的身體、黑亮的短毛，鼻子超靈；跟著環島一圈後，最愛跟大家分享家鄉桃園大溪的美',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《漫遊台灣大冒險》終章台灣真美分享會，小虎就會翹起尾巴，永遠跟你一起回家！',
    stages: [
      null,
      { emoji: '🐕', label: '庄腳小臘腸',   size: '5rem', bg: '#F2EFEA', border: '#A89880' },
      { emoji: '🐕', label: '漫遊少年犬',   size: '5rem', bg: '#F5EFE6', border: '#C08A50' },
      { emoji: '🐕', label: '環島小勇士',   size: '5rem', bg: '#F7F0E2', border: '#C89040' },
      { emoji: '🐕', label: '傳說黑臘腸',   size: '5rem', bg: '#FAF3E0', border: '#D4AF37', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
  arong: {
    id: 'arong',
    name: '阿榕',
    breed: '百年老樹靈',
    personality: '大溪老街廟口那棵百年老榕樹的樹靈，看遍家鄉一百年的變化；沉穩溫柔，最愛聽人說故事，也最會把老故事一頁一頁傳給下一代',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《家鄉時光大冒險》終章八德家鄉大會，把家鄉故事書拼滿十二頁，阿榕就會化作一株小樹苗，跟你一起回家！',
    stages: [
      null,
      { emoji: '🌱', label: '家鄉小樹苗',   size: '5rem', bg: '#EEF5E6', border: '#9CBB7A' },
      { emoji: '🌿', label: '老街小榕樹',   size: '5rem', bg: '#E9F3E0', border: '#7FA85C' },
      { emoji: '🌳', label: '廟口老榕樹',   size: '5rem', bg: '#E6F1DC', border: '#5E9440' },
      { emoji: '🌳', label: '家鄉守護神榕', size: '5rem', bg: '#EAF5DE', border: '#3E7D2A', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
  // 小圓：連載劇《羅馬與極光》終章加入的萬神殿老貓（事件限定，不可金幣購買）
  // 主題「想看看外面」：牠在萬神殿的光圈裡坐了七千三百天，望著陽光永遠不會來的北方，
  // 只因為二十年前聽過一位北方旅人說「我們的天空，整片都會亮起來」。
  yuanyuan: {
    id: 'yuanyuan',
    name: '小圓',
    breed: '萬神殿老橘貓',
    personality: '在羅馬萬神殿的圓洞光圈裡坐了二十年的老橘貓，安靜、慢吞吞、金黃色的眼睛什麼都看在眼裡；跟著安安走到北極圈，終於看見了牠等一輩子的那片會發光的天空',
    unlockCost: 0,
    purchasable: false,
    unlockHint: '完成《羅馬與極光》終章極光之夜，把旅行手帳貼滿十二張貼紙，小圓就會跳進你的行李箱，跟你一起回家！',
    stages: [
      null,
      { emoji: '🐈', label: '光圈裡的貓',   size: '5rem', bg: '#FBF1E4', border: '#D9A96A' },
      { emoji: '🐈', label: '跨過門檻的貓', size: '5rem', bg: '#F7EEE6', border: '#C98F4E' },
      { emoji: '🐈', label: '看過雪的貓',   size: '5rem', bg: '#EFF2F8', border: '#8FA6C4' },
      { emoji: '🐈', label: '極光下的小圓', size: '5rem', bg: '#EDF4F4', border: '#4FB39A', glow: true },
    ],
    happyEmoji: '🥰',
    sadEmoji: '🥺',
  },
}

export const PET_ORDER = ['lulu', 'hana', 'kotaro', 'jiji', 'kitsune', 'mejiro', 'penguin', 'owl', 'seal', 'beaver', 'hamster', 'dino', 'monkey', 'raccoon', 'twinkle', 'luna', 'pluto', 'xiaoq', 'feifei', 'xiaohu', 'arong', 'yuanyuan']

// ── 寵物專屬技能 & 能量系統 ─────────────────────────────────────────────
// 能量靠答題回復（每題 +5，答對答錯都給），手動按技能鈕發動、消耗 20 能量。
// 一次發動只作用在「當下這一題」，換題就失效。滿能量 100 = 可連用 5 次。
// LULU 是最強寵物：所有題型 +10 秒（成本跟大家一樣，靠效果取勝）。
export const ENERGY_MAX = 100
export const ENERGY_START = 20            // 初次遊玩就有一次技能可用
export const ENERGY_PER_QUESTION = 5      // 每答一題回復
export const SKILL_COST = 20              // 每次發動消耗（統一）

// ── 連載劇場「家教求救」──────────────────────────────────────────────
// 智慧型寵物可在連載劇場當家教：按求救鈕，用教學方式帶著想（給方法、不給答案）。
// 消耗能量（比技能便宜），每答對一題回復。擁有清單中任一隻即可求救（依序優先）。
export const TUTOR_PETS = ['xiaoq', 'owl', 'jiji', 'beaver', 'arong']  // 小Q🦉(名偵探前輩,優先) / 嚕嚕🦉 / 吉吉🐈‍⬛ / 阿丁🦫 / 阿榕🌳(百年老樹靈,家鄉記憶)
export const SOS_COST = 15                // 求救一次消耗能量
export const SOS_REGEN = 10               // 連載劇場每答對一題，家教回復能量

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
  luna:    { name: '月光搖籃', icon: '🌙', effect: { type: 'time',  value: 8 },  desc: '這一題 +8 秒' },
  pluto:   { name: '團圓之心', icon: '💗', effect: { type: 'coin',  add: 25 },   desc: '這一題答對 +25 金幣（全家福的祝福！）' },
  xiaoq:   { name: '靈光一閃', icon: '💡', effect: { type: 'time',  value: 8 },  desc: '這一題 +8 秒（尤里卡的瞬間！）' },
  feifei:  { name: '順風翅膀', icon: '🪽', effect: { type: 'time',  value: 8 },  desc: '這一題 +8 秒（乘著環遊世界的風！）' },
  xiaohu:  { name: '靈敏鼻子', icon: '🐽', effect: { type: 'coin',  add: 22 },   desc: '這一題答對 +22 金幣（聞得出寶藏藏在哪！）' },
  arong:   { name: '家鄉記憶', icon: '🍃', effect: { type: 'shield' },           desc: '這一題答錯不斷連段（老樹記得你努力過）' },
  // 小圓等了七千三百天才等到牠想看的東西 → 技能就是「等」：把時間拉到全場最長
  yuanyuan:{ name: '等一下下', icon: '🌌', effect: { type: 'time',  value: 9 },  desc: '這一題 +9 秒（等了七千三百天的貓，很會等）' },
}

// 動物小知識：每隻寵物兩則真實的特徵，讓安安一邊養寵物一邊認識牠。
// 寫作原則：①一則講一個具體、記得住的特徵，不要籠統的形容
//          ②盡量對得上遊戲裡看得到的造型（浣熊的眼罩、河狸的扁尾、貓頭鷹的轉頭都對得上）
//          ③小三看得懂的句子，全部使用台灣慣用詞
export const PET_TRAITS = {
  lulu: [
    '鼻子裡有兩億多個嗅覺細胞，是人類的四十倍以上，所以機場常常請米格魯幫忙檢查行李。',
    '長長的垂耳走路時會晃動，剛好把地面的氣味搧到鼻子前面。',
  ],
  hana: [
    '毛非常密，一小塊指甲大的皮膚上就長了好幾萬根，把空氣鎖在裡面保暖，泡在冷水裡也不怕。',
    '潛水時會把鼻孔和耳朵關起來，可以憋氣好幾分鐘。',
  ],
  kotaro: [
    '水獺很愛玩，會自己溜滑坡、把石頭拋來拋去，是少數會「玩耍」的野生動物。',
    '鬍鬚非常敏感，在混濁的水裡靠鬍鬚感覺水流，就知道附近有沒有魚。',
  ],
  jiji: [
    '鬍鬚的寬度差不多等於身體的寬度，可以用來判斷這個洞鑽不鑽得過去。',
    '眼睛後面有一層會反光的膜，所以很暗也看得見，拍照時貓眼才會發亮。',
  ],
  kitsune: [
    '毛色會換季：冬天雪白、夏天變成灰褐色，一年四季都不容易被發現。',
    '耳朵和鼻子都比別種狐狸短小 —— 突出來的地方越少，體溫就越不容易散掉。',
  ],
  mejiro: [
    '眼睛周圍有一圈白色細毛，「繡眼」這個名字就是從這圈白眼圈來的。',
    '舌頭前端像刷子一樣分岔，方便捲起花蜜來吃。',
  ],
  penguin: [
    '翅膀已經變成硬硬的鰭，不能飛，但在水裡游得比人跑步還快。',
    '肚子白、背部黑：從上面看像海、從下面看像天空，兩邊都不容易被發現。',
  ],
  owl: [
    '眼睛不能轉動，所以要靠轉頭來看四周，脖子最多可以轉到 270 度。',
    '翅膀邊緣有像梳子的細羽毛，可以把風切聲消掉，飛起來幾乎沒有聲音。',
  ],
  seal: [
    '皮膚下面有一層厚厚的脂肪，在冰冷的海裡也能維持體溫。',
    '潛水前會先把肺裡的空氣吐掉，改用血液儲存氧氣，所以能待在水下很久。',
  ],
  beaver: [
    '門牙一輩子都在長，所以要一直啃樹來磨牙；牙齒含有鐵質，所以是橘色的。',
    '扁扁的尾巴可以當船槳，遇到危險時還會用力拍打水面警告同伴。',
  ],
  hamster: [
    '臉頰兩邊有可以伸縮的頰囊，能把食物塞到跟頭一樣大，再帶回家藏起來。',
    '是夜行性動物，白天睡覺、晚上才起來活動。',
  ],
  dino: [
    '頭上那根長冠是中空的，像一支彎彎的喇叭 —— 科學家推測牠可以用來發出低沉的聲音呼叫同伴。',
    '是吃植物的恐龍，寬扁的嘴巴像鴨子，方便一口咬下一大把樹葉。',
  ],
  monkey: [
    '手指和腳趾都能抓握，有些猴子的尾巴還能勾住樹枝，像多了一隻手。',
    '會用石頭敲開堅果，而且這個本領是跟長輩學來的，不是天生就會。',
  ],
  raccoon: [
    '前腳非常敏感，會把食物放進水裡搓一搓 —— 其實牠是在用「摸」的確認那是什麼東西。',
    '眼睛周圍的黑色眼罩可以減少反光，讓牠在夜裡看得更清楚。',
  ],
  twinkle: [
    '星星看起來一閃一閃，其實是星光穿過流動的空氣被晃動；在太空看就不會閃了。',
    '我們看到的星光是很久以前發出的，有些走了好幾百年才到地球。',
  ],
  luna: [
    '月亮永遠只用同一面對著地球，所以在地球上看不到月球的背面。',
    '月亮自己不會發光，我們看到的是它反射的太陽光。',
  ],
  pluto: [
    '冥王星本來是第九大行星，2006 年因為軌道附近還有很多其他天體，被改列為「矮行星」。',
    '它離太陽非常遠，繞太陽一圈要花 248 年。',
  ],
  xiaoq: [
    '貓頭鷹的兩隻耳朵一高一低，靠聲音傳到兩耳的時間差，就能判斷獵物在哪個方向。',
    '牠的眼睛是圓筒形的、不是圓球，所以看得很遠，但也因此轉不動。',
  ],
  feifei: [
    '翅膀展開超過三公尺，是世界上翼展最長的鳥，可以幾乎不拍翅膀就滑翔好幾個小時。',
    '一生大部分時間都在海上度過，有的信天翁可以活到六十歲以上。',
  ],
  xiaohu: [
    '身體長、腿短是為了鑽進地洞抓獾，臘腸狗的德文名字意思就是「獾狗」。',
    '因為背特別長，要少讓牠爬樓梯或從沙發往下跳，免得傷到脊椎。',
  ],
  arong: [
    '榕樹會從樹枝垂下「氣根」，碰到地面後會變粗、長成新的樹幹，一棵樹就能長成一片樹林。',
    '葉子摘下來會流出白白的汁液，那是它用來保護傷口的乳汁。',
  ],
  yuanyuan: [
    '貓在暗暗的地方瞳孔會放到又大又圓，是為了讓更多光線進到眼睛裡，所以牠們在微光中看得比人清楚。',
    '橘貓大約每四隻才有一隻是母的，因為決定橘色的基因在 X 染色體上，母貓要兩個 X 都帶橘色才會是橘貓——小圓正好就是少見的那一種。',
  ],
}
