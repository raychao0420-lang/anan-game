// 當日限定挑戰：挑一個安安冷落的關卡，當天去打就金幣加倍＋保證掉獎勵。
//
// ⚠️ 決定性亂數（用日期當種子）是必要的，不能用 Math.random()：
//    安安的存檔會同步到雲端、也可能重新整理或換裝置，
//    同一天算出來的結果必須一模一樣，否則挑戰會跳來跳去。
//    做法沿用 dailyTasks.js 的 getTodayTasks() 慣例。
import { ALL_STAGE_IDS, isStageUnlocked, chapterOf } from './stages'

export const CHALLENGE_COIN_MULT = 2      // 金幣倍率
const APPEAR_RATE = 0.6                   // 約六成的日子才出現（保留「不定時」的驚喜感）
// 兩桶各取幾名 → 也決定了兩類的出現比例（4:2 ≈ 沒破關佔三分之二）
// 「一直沒破關」是最強的迴避訊號，所以給它比較多名額
const POOL_UNDONE = 4
const POOL_DONE = 2
const STALE_CAP = 30                      // 「多久沒玩」最多算到 30 天

// FNV-1a：同一組 (日期, 用途) 一定得到同一個 0~1 的數
function hash01(dateStr, salt) {
  const s = `${dateStr}|${salt}`
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

function daysSince(dateStr, today) {
  if (!dateStr) return STALE_CAP                    // 從來沒玩過＝當作最冷落
  const diff = (new Date(today) - new Date(dateStr)) / 86400000
  return Number.isFinite(diff) ? Math.max(0, diff) : STALE_CAP
}

// 冷落分數：越高代表越該被推出來
export function coldScore(id, s, today) {
  const st = s.stages?.[id] || {}
  let score
  if (!st.completed) score = 100                    // 已解鎖卻一直沒破關＝最明顯的迴避
  else if (st.stars >= 3) score = 10                // 三星已精熟，只有很久沒碰才有機會被選
  else score = 40 + (3 - (st.stars || 0)) * 10      // 破關但只有 1~2 星＝打過但不熟
  if (!(s.stagePlays?.[id] > 0)) score += 20        // 一次都沒玩過
  score += Math.min(daysSince(s.stageLastPlay?.[id], today), STALE_CAP) * 2
  return score
}

/**
 * 算出今天的挑戰關卡。沒有挑戰的日子回 null。
 * @param today  'YYYY-MM-DD'
 * @param s      { stages, stagePlays, stageLastPlay }
 */
export function pickDailyChallenge(today, s) {
  if (hash01(today, 'appear') >= APPEAR_RATE) return null

  const unlocked = ALL_STAGE_IDS
    .filter(id => isStageUnlocked(s.stages, id))     // 只挑打得到的，不然是製造挫折不是誘因
    .map(id => ({ id, score: coldScore(id, s, today), done: !!s.stages?.[id]?.completed }))

  // ⚠️ 兩桶分開取，不能只用總分排序：
  //    「沒破關」基礎分 100、「破關但低星」最高只有 60，
  //    只要還有任何一關沒破（安安永遠有，因為每條支線都有進度前緣），
  //    低星的關卡就永遠擠不進前幾名 —— 等於「低星」這個條件形同虛設。
  const top = (list, n) => list
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, n)

  const pool = [
    ...top(unlocked.filter(x => !x.done), POOL_UNDONE),   // 沒破關過
    ...top(unlocked.filter(x => x.done), POOL_DONE),      // 破關但不熟（低星／很久沒碰）
  ]
  if (!pool.length) return null
  return pool[Math.floor(hash01(today, 'pick') * pool.length)].id
}

// 給畫面用的一句話說明，讓安安知道為什麼是這一關
export function challengeReason(id, s) {
  const st = s.stages?.[id] || {}
  const ch = chapterOf(id)
  const where = ch ? `${ch.icon} ${ch.label}` : '這一關'
  if (!st.completed) return `${where} 還沒破關過`
  if (st.stars < 3) return `${where} 目前只有 ${st.stars} 顆星`
  return `${where} 好久沒回來玩了`
}
