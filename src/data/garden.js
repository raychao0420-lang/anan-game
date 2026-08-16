// ── 秘密庭園：花苗種類與成長規則 ──────────────────────────────────────────
// 成長靠「澆水次數」推進（溫和版）：每天可澆一次，澆滿 need 次就開花／長成大樹。
// 沒澆水只是暫停成長，不會枯死。肥料可立刻多長一次，不必等隔天。
// love：這種花開花時，會讓這幾隻寵物（若已解鎖）心情變好 → 呼應寵物適性。
// ⚠️ reward（採收給的金幣）刻意壓低到大約原本的 1/3（2026-08-16）：
//    花苗過關會免費掉，採收又有 35% 機率把花苗掉回來 →「免費花苗 → 採收領錢 → 又拿回花苗」
//    等於一台永動印鈔機（樹苗那條線期望值原本高達 85 金幣/顆）。
//    採收真正的回饋是「花進背包可以送寵物」＋圖鑑收集，不是金幣。
//    金幣經濟盤點見 [[project_anan_game]]。
export const PLANT_KINDS = {
  flower: {
    seedName: '普通花苗', bagEmoji: '🌷', price: 20, need: 2, reward: 5,
    grow: '🌿', blooms: ['🌷', '🌻', '🌸', '🌼', '🌺'],
    love: ['mejiro', 'twinkle', 'hana'],
    desc: '種下後每天澆水，2 天就開出漂亮小花',
  },
  rare: {
    seedName: '稀有花苗', bagEmoji: '🌟', price: 60, need: 3, reward: 12,
    grow: '🌿', bud: '🌸', blooms: ['🌹', '🪷', '💐', '🏵️'],
    love: ['luna', 'kitsune', 'pluto'],
    desc: '照顧 3 天，開出稀有又美麗的花',
  },
  tree: {
    seedName: '樹苗', bagEmoji: '🌰', price: 80, need: 3, reward: 18,
    grow: ['🌿', '🌲'], blooms: ['🌳', '🌴'],
    love: ['beaver', 'hamster', 'monkey', 'dino', 'xiaohu'],
    desc: '照顧 3 天長成大樹，最多小動物喜歡',
  },
  // 魔法花：照顧到最後一步會冒問號🔮，要答對一題數學才會盛開，金幣最多！
  magic: {
    seedName: '魔法花苗', bagEmoji: '🔮', price: 100, need: 2, reward: 30,
    grow: '🌿', ready: '🔮', blooms: ['🌈', '✨', '🌟'], magic: true,
    love: ['owl', 'xiaoq', 'jiji', 'twinkle', 'luna'],
    desc: '澆到最後要答對一題數學才盛開，開出最稀有的花！',
  },
}

export const SEED_KINDS = ['flower', 'rare', 'tree', 'magic']

// 花園同時最多幾株。⚠️ 滿了要「擋下來並告訴玩家」，
// 絕對不可以像以前那樣用 slice(-24) 默默把最舊的一株擠掉 ——
// 那會讓安安養了好幾天的花無聲消失，畫面上完全沒有提示。
export const MAX_PLANTS = 24

// 擺出來當裝飾的花，每個場景最多幾朵。比照寵物 8 隻／植物 24 株，先給效能留餘裕；
// 一朵裝飾花在 3D 是「花瓶＋六片花瓣」約 9 個 mesh，12 朵約 108 個，還在預算內。
export const MAX_FLOWER_DECOS = 12

// 兩個庭園場景。魔法花園只能種魔法花苗 —— 每一株都要答對一題數學才會盛開，
// 所以它是「答題花園」，把種花跟安安的數學練習綁在一起。
// 舊存檔的植物沒有 sc 欄位，一律視為秘密庭園。
export const GARDEN_SCENES = {
  outdoor: { label: '🌳 秘密庭園', seeds: ['flower', 'rare', 'tree'] },
  magic:   { label: '🔮 魔法花園', seeds: ['magic'] },
}
export const isGardenScene = (sc) => sc === 'outdoor' || sc === 'magic'
export const plantsOf = (garden, sc) => (garden || []).filter((p) => (p.sc || 'outdoor') === sc)

export const FERTILIZER = {
  name: '魔法肥料', emoji: '💩', price: 30,
  desc: '撒一次立刻多長一天，不用等到明天！',
}

// 花園圖鑑：集滿所有花種／樹的花色就完成（給一次性大獎）
// ⚠️ 配種花（CROSS_BLOOMS）刻意**不**放進來：放進去會讓既有存檔的圖鑑
//    突然變成未完成、獎勵拿不到，等於回頭改動已經給過的東西。
export const ALL_BLOOMS = [...new Set(SEED_KINDS.flatMap((k) => PLANT_KINDS[k].blooms))]

// ── 花的配種（2026-08-16）─────────────────────────────────────────────
// 為什麼做：原本種花的循環是「種→澆水→採收→換金幣」，而金幣早就多到沒意義，
// 所以種花沒有目標。配種給花一個新用途：兩朵不同的花可以合出一朵**只能配種取得**的稀有花。
// 順便當金幣出口（每次要花 CROSS_COST）。
export const CROSS_COST = 300

// 配種專屬花色。love＝哪些寵物收到會特別開心（比照 PLANT_KINDS.love）。
// fact 的寫法同 BLOOM_TRAITS：一則講一個具體記得住的事、小三看得懂、台灣慣用詞。
export const CROSS_BLOOMS = {
  '🪻': { name: '風信子', love: ['mejiro', 'hana', 'twinkle'],
    fact: '風信子的香味很濃，一盆放在房間裡整間都聞得到，所以常被拿來當年節的擺飾。' },
  '🌾': { name: '稻穗', love: ['hamster', 'mejiro', 'xiaohu'],
    fact: '我們吃的白米就是稻穗裡的種子，把外面那層殼和米糠磨掉之後剩下的部分。' },
  '💮': { name: '白梅', love: ['jiji', 'kitsune', 'owl'],
    fact: '梅花在最冷的冬天開，還沒長葉子就先開花，所以雪地裡看得到一整棵白花。' },
  '🍀': { name: '四葉幸運草', love: ['lulu', 'monkey', 'raccoon', 'xiaohu'],
    fact: '幸運草通常是三片葉子，第四片是長的時候出錯才多出來的，大約一萬株才有一株。' },
  '🪴': { name: '小盆栽', love: ['beaver', 'dino', 'arong', 'hamster'],
    fact: '盆栽要定期換盆，因為根長滿了整個盆子之後就吸不到養分，會愈長愈小。' },
  '🎋': { name: '七夕竹', love: ['twinkle', 'luna', 'pluto', 'xiaoq'],
    fact: '竹子長得特別快，有些品種一天可以長高將近一公尺，因為它的莖是一節一節同時變長。' },
}

// 配方：兩朵花 → 一朵配種花。左右順序不影響（查表前會先排序）。
const key = (a, b) => [a, b].sort().join('')
export const CROSS_RECIPES = {
  [key('🌷', '🌸')]: '🪻',
  [key('🌻', '🌼')]: '🌾',
  [key('🌹', '🌺')]: '💮',
  [key('🪷', '💐')]: '🍀',
  [key('🌳', '🌴')]: '🪴',
  [key('🌈', '🌟')]: '🎋',
}

/**
 * 配種結果。查不到配方也**一定有東西拿**（隨機一朵普通花）——
 * 對小孩來說「花了金幣又消耗兩朵花卻什麼都沒有」太挫折。
 * 回傳 { emoji, known }；known=false 代表是亂配出來的普通花。
 */
export function crossResult(a, b) {
  const hit = CROSS_RECIPES[key(a, b)]
  if (hit) return { emoji: hit, known: true }
  const commons = PLANT_KINDS.flower.blooms
  return { emoji: commons[Math.floor(Math.random() * commons.length)], known: false }
}

// 花（含配種花）的名字與知識查詢，畫面一律走這裡，不要各自判斷
export const bloomInfo = (emoji) => BLOOM_TRAITS[emoji] || CROSS_BLOOMS[emoji] || null

// 哪些寵物喜歡這朵花：一般花看它屬於哪種花苗，配種花有自己的 love 名單
export const flowerLovers = (emoji) => {
  if (CROSS_BLOOMS[emoji]) return CROSS_BLOOMS[emoji].love || []
  const k = SEED_KINDS.find((s) => PLANT_KINDS[s].blooms.includes(emoji))
  return k ? (PLANT_KINDS[k].love || []) : []
}

// 植物小知識：比照寵物的 PET_TRAITS，讓「收集」變成「認識」——
// 圖鑑裡點一格開出來的花，就看得到它的名字和一則真的知識。
// 寫作原則同 PET_TRAITS：①一則講一個具體記得住的事 ②小三看得懂 ③台灣慣用詞。
// 魔法花（🌈✨🌟）不是真的植物，改講「種花這件事本身」的科學。
export const BLOOM_TRAITS = {
  '🌷': { name: '鬱金香', fact: '花瓣白天張開、晚上合起來，是被溫度變化推開和關上的，不是它想睡覺。' },
  '🌻': { name: '向日葵', fact: '還沒開花的向日葵會跟著太陽轉，等花盤開好以後就固定朝著東邊不動了。' },
  '🌸': { name: '櫻花',   fact: '櫻花大多先開花、葉子後長，所以滿樹只看得到花，看不到綠葉。' },
  '🌼': { name: '雛菊',   fact: '看起來一朵的雛菊，其實是好幾百朵小花擠在一起，中間黃色的每一點都是一朵花。' },
  '🌺': { name: '扶桑花', fact: '一朵扶桑花常常只開一天就謝了，但整棵樹輪流開，看起來才像一直有花。' },
  '🌹': { name: '玫瑰',   fact: '玫瑰身上的不是刺，是表皮長出來的「皮刺」，可以整片剝下來。' },
  '🪷': { name: '蓮花',   fact: '蓮葉表面有很多小突起，水滴滾過去會順便把灰塵帶走，所以葉子永遠是乾淨的。' },
  '💐': { name: '花束',   fact: '插進水裡前把莖斜斜剪一刀，切口變大比較好吸水，花可以撐比較久。' },
  '🏵️': { name: '花飾',   fact: '這種花結是用緞帶折成的裝飾，古時候當作獎章別在身上，表示得過獎。' },
  '🌳': { name: '大樹',   fact: '樹幹每年長出一圈新的木頭，鋸開來數年輪，就知道這棵樹幾歲。' },
  '🌴': { name: '椰子樹', fact: '椰子樹沒有年輪，因為它不是一圈一圈變粗，而是從頂端一直往上長。' },
  '🌈': { name: '彩虹魔法花', fact: '太陽在背後、前面有小水滴時才看得到彩虹，陽光被水滴折射又反射，才分成好多顏色。' },
  '✨': { name: '香氣魔法花', fact: '花香是花瓣揮發出來的油，天氣愈熱飄得愈遠，所以中午的花園最香。' },
  '🌟': { name: '星光魔法花', fact: '種子發芽要有水、空氣和合適的溫度，有些種子還要先過一段冷天才肯醒來。' },
}

// 採收下來的花會進背包，可以送給寵物。花的 emoji 反查它屬於哪一種花苗，
// 才知道哪些寵物喜歡它（沿用 PLANT_KINDS 的 love 名單，不另外再定一份）。
export const bloomKind = (emoji) => SEED_KINDS.find((k) => PLANT_KINDS[k].blooms.includes(emoji)) || null

// 送花的效果。喜歡這種花的寵物收到會特別開心 ——
// 這條「種花→採收→送給牠喜歡的花」原本是隱形的（採收時偷偷加心情），
// 現在讓安安自己選要送誰，這份心意才看得見。
// 數值參考商店食物（exp 5~120、心情 +10）：送對花比餵一般食物有感，但不會誇張到破壞平衡。
export const FLOWER_GIFT = {
  loved: { exp: 40, mood: 15 },
  plain: { exp: 12, mood: 5 },
}

// 本地日期字串（YYYY-MM-DD），庭園用來判斷「今天是否已澆水」
export const todayKey = () => new Date().toLocaleDateString('en-CA')
// 昨天（判斷連續澆水是否接得上）
export const yesterdayKey = () => {
  const d = new Date(); d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA')
}

// 依澆水次數回傳目前外觀：🌱 種子 → 🌿/🌲 長大 →（稀有花先冒花苞）→ 開花
// 魔法花特別：澆滿後要 p.solved 才算盛開，否則停在 🔮（ready）等安安答題。
export function plantView(p) {
  const cfg = PLANT_KINDS[p.kind] || PLANT_KINDS.flower
  const wc = p.waterCount || 0
  if (wc >= cfg.need) {
    if (cfg.magic && !p.solved) return { emoji: cfg.ready, bloomed: false, ready: true, cfg }
    return { emoji: cfg.blooms[p.v % cfg.blooms.length], bloomed: true, reward: cfg.reward, cfg }
  }
  if (cfg.bud && wc === cfg.need - 1) return { emoji: cfg.bud, bloomed: false, cfg }
  if (wc >= 1) {
    const g = Array.isArray(cfg.grow) ? cfg.grow[Math.min(wc - 1, cfg.grow.length - 1)] : cfg.grow
    return { emoji: g, bloomed: false, cfg }
  }
  return { emoji: '🌱', bloomed: false, cfg }
}

// 隨機掉一種花苗（過關掉落／採收回收用）：稀有較少、樹苗其次、普通最多
// rainbow=true（採收時天上有彩虹）機率往稀有／魔法傾斜，當作小驚喜。
export function rollSeedDrop(stars = 0, rainbow = false) {
  const r = Math.random()
  const magicChance = rainbow ? 0.06 : 0.02
  const rareChance = (stars >= 3 ? 0.2 : 0.08) + (rainbow ? 0.12 : 0)
  if (r < magicChance) return 'magic'
  if (r < magicChance + rareChance) return 'rare'
  if (r < magicChance + rareChance + 0.24) return 'tree'
  return 'flower'
}

// 魔法花的數學題（翰林小三～小四：加減與九九乘法），回傳題目字串＋正解＋四個選項
export function makeGardenQuestion() {
  const type = Math.random()
  let a, b, op, ans
  if (type < 0.45) { op = '×'; a = 2 + Math.floor(Math.random() * 8); b = 2 + Math.floor(Math.random() * 8); ans = a * b }
  else if (type < 0.75) { op = '＋'; a = 15 + Math.floor(Math.random() * 60); b = 10 + Math.floor(Math.random() * 40); ans = a + b }
  else { op = '－'; a = 40 + Math.floor(Math.random() * 55); b = 5 + Math.floor(Math.random() * 30); ans = a - b }
  const choices = new Set([ans])
  while (choices.size < 4) {
    const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 9))
    const wrong = ans + delta
    if (wrong >= 0) choices.add(wrong)
  }
  return { q: `${a} ${op} ${b}`, ans, choices: [...choices].sort(() => Math.random() - 0.5) }
}
