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
}

export const SEED_KINDS = ['flower', 'rare', 'tree']

export const FERTILIZER = {
  name: '魔法肥料', emoji: '💩', price: 30,
  desc: '撒一次立刻多長一天，不用等到明天！',
}

// 本地日期字串（YYYY-MM-DD），庭園用來判斷「今天是否已澆水」
export const todayKey = () => new Date().toLocaleDateString('en-CA')

// 依澆水次數回傳目前外觀：🌱 種子 → 🌿/🌲 長大 →（稀有花先冒花苞）→ 開花
export function plantView(p) {
  const cfg = PLANT_KINDS[p.kind] || PLANT_KINDS.flower
  const wc = p.waterCount || 0
  if (wc >= cfg.need) return { emoji: cfg.blooms[p.v % cfg.blooms.length], bloomed: true, reward: cfg.reward, cfg }
  if (cfg.bud && wc === cfg.need - 1) return { emoji: cfg.bud, bloomed: false, cfg }
  if (wc >= 1) {
    const g = Array.isArray(cfg.grow) ? cfg.grow[Math.min(wc - 1, cfg.grow.length - 1)] : cfg.grow
    return { emoji: g, bloomed: false, cfg }
  }
  return { emoji: '🌱', bloomed: false, cfg }
}

// 隨機掉一種花苗（過關掉落／採收回收用）：稀有較少、樹苗其次、普通最多
export function rollSeedDrop(stars = 0) {
  const r = Math.random()
  const rareChance = stars >= 3 ? 0.2 : 0.08
  if (r < rareChance) return 'rare'
  if (r < 0.32) return 'tree'
  return 'flower'
}
