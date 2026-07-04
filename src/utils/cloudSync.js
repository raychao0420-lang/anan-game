// 安安存檔雲端自動備份（Supabase）。
// 安全設計：game_saves 表開 RLS 且無 policy，前端只能呼叫 save_game / load_game 兩支
// SECURITY DEFINER 函式，且需帶「存檔碼」才能存取。anon key 放前端在此設計下是安全的。
import { useGameStore } from '../store/gameStore'

const SUPABASE_URL = 'https://wfeajrchjrtyatvzspnx.supabase.co'
const SUPABASE_ANON = 'sb_publishable_XvN4ZF8UUHmZQLfmFFd97w_x_HWTlyV' // publishable key（前端安全，表已鎖死）
const SAVE_KEY = 'anan-game-v2'
const CODE_KEY = 'anan-save-code'

async function rpc(fn, body, keepalive = false) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.status === 204 ? null : res.json()
}

// 取得（沒有則產生）本機存檔碼，換機還原時要用，請抄下來保存
export function ensureSaveCode() {
  let code = localStorage.getItem(CODE_KEY)
  if (!code) {
    code = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(CODE_KEY, code)
  }
  return code
}
export const getSaveCode = () => localStorage.getItem(CODE_KEY)

function localRaw() { return localStorage.getItem(SAVE_KEY) }
function isEmpty(raw) {
  try {
    const s = JSON.parse(raw || '{}').state
    return !s || (s.coins === 0 && !(s.ownedItems?.length) &&
      !Object.values(s.stages || {}).some(x => x.completed))
  } catch { return true }
}

export async function pushSave(keepalive = false) {
  if (!SUPABASE_ANON) return
  const raw = localRaw()
  if (!raw || isEmpty(raw)) return // 不上傳空檔，避免覆蓋雲端
  await rpc('save_game', { p_code: ensureSaveCode(), p_data: JSON.parse(raw) }, keepalive)
}

// 用存檔碼從雲端拉回並套用（換機還原）
export async function pullSaveByCode(code) {
  const data = await rpc('load_game', { p_code: code.trim() })
  if (!data) throw new Error('NO_DATA')
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  localStorage.setItem(CODE_KEY, code.trim())
}

let timer
export function startAutoSave() {
  navigator.storage?.persist?.().catch(() => {}) // 第1層：請求瀏覽器別清掉本機資料
  if (!SUPABASE_ANON) return

  // 開機自動還原：本機空的但有存檔碼（例如被清過但碼還在）→ 拉回雲端
  if (isEmpty(localRaw()) && getSaveCode()) {
    rpc('load_game', { p_code: getSaveCode() }).then(data => {
      if (data) { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); location.reload() }
    }).catch(() => {})
  }

  // 任何狀態變動 → 停 3 秒沒新動作才上傳（debounce）
  useGameStore.subscribe(() => { clearTimeout(timer); timer = setTimeout(() => pushSave(), 3000) })

  // 切到背景 / 關分頁時用 keepalive 再補存一次
  const flush = () => pushSave(true).catch(() => {})
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush() })
  window.addEventListener('pagehide', flush)
}
