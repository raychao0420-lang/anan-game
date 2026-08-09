// ── 秘密庭園：花苗種類與成長規則 ──────────────────────────────────────────
// 成長靠「澆水次數」推進（溫和版）：每天可澆一次，澆滿 need 次就開花／長成大樹。
// 沒澆水只是暫停成長，不會枯死。肥料可立刻多長一次，不必等隔天。
// love：這種花開花時，會讓這幾隻寵物（若已解鎖）心情變好 → 呼應寵物適性。
export const PLANT_KINDS = {
  flower: {
    seedName: '普通花苗', bagEmoji: '🌷', price: 20, need: 2, reward: 15,
    grow: '🌿', blooms: ['🌷', '🌻', '🌸', '🌼', '🌺'],
    love: ['mejiro', 'twinkle', 'hana'],
    desc: '種下後每天澆水，2 天就開出漂亮小花',
  },
  rare: {
    seedName: '稀有花苗', bagEmoji: '🌟', price: 60, need: 3, reward: 35,
    grow: '🌿', bud: '🌸', blooms: ['🌹', '🪷', '💐', '🏵️'],
    love: ['luna', 'kitsune', 'pluto'],
    desc: '照顧 3 天，開出稀有又美麗的花',
  },
  tree: {
    seedName: '樹苗', bagEmoji: '🌰', price: 80, need: 3, reward: 55,
    grow: ['🌿', '🌲'], blooms: ['🌳', '🌴'],
    love: ['beaver', 'hamster', 'monkey', 'dino', 'xiaohu'],
    desc: '照顧 3 天長成大樹，金幣獎勵最多',
  },
  // 魔法花：照顧到最後一步會冒問號🔮，要答對一題數學才會盛開，金幣最多！
  magic: {
    seedName: '魔法花苗', bagEmoji: '🔮', price: 100, need: 2, reward: 90,
    grow: '🌿', ready: '🔮', blooms: ['🌈', '✨', '🌟'], magic: true,
    love: ['owl', 'xiaoq', 'jiji', 'twinkle', 'luna'],
    desc: '澆到最後要答對一題數學才盛開，金幣最多！',
  },
}

export const SEED_KINDS = ['flower', 'rare', 'tree', 'magic']

export const FERTILIZER = {
  name: '魔法肥料', emoji: '💩', price: 30,
  desc: '撒一次立刻多長一天，不用等到明天！',
}

// 花園圖鑑：集滿所有花種／樹的花色就完成（給一次性大獎）
export const ALL_BLOOMS = [...new Set(SEED_KINDS.flatMap((k) => PLANT_KINDS[k].blooms))]

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
