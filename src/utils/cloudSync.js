// 安安存檔雲端自動備份（Supabase）。
// 安全設計：game_saves 表開 RLS 且無 policy，前端只能呼叫 save_game / load_game /
// set_game_pin / game_pin_status 四支 SECURITY DEFINER 函式，且需帶「存檔碼」才能存取。
// anon key 放前端在此設計下是安全的。
// PIN（選用）只保護「讀取」——要花掉別人的金幣得先把存檔載進自己裝置，鎖住讀取即可擋下；
// 好處是自動存檔不必帶 PIN，於是 PIN 完全不用留在裝置上，翻遍 localStorage 也找不到。
// 資料表與函式定義見 docs/cloud-save.sql。
import { useGameStore } from '../store/gameStore'

const SUPABASE_URL = 'https://wfeajrchjrtyatvzspnx.supabase.co'
const SUPABASE_ANON = 'sb_publishable_XvN4ZF8UUHmZQLfmFFd97w_x_HWTlyV' // publishable key（前端安全，表已鎖死）
const SAVE_KEY = 'anan-game-v2'
const CODE_KEY = 'anan-save-code'
const PROFILES_KEY = 'anan-profiles'    // [{ name, emoji, code }] 同一台平板的玩家清單
const PENDING_KEY = 'anan-pending-code' // 掃 QR 進來但還要輸 PIN 時暫放（分頁關掉就沒了）

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

// 掃 QR 用的網址：新平板用相機掃一下就會帶著存檔碼開啟遊戲，不必手打 32 個字
export const codeToUrl = (code) => `${location.origin}${location.pathname}?code=${code}`

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

// 這組存檔碼有沒有設 PIN、是不是被鎖住、還剩幾次機會
export const pinStatus = (code) => rpc('game_pin_status', { p_code: code.trim() })

// 設定／變更／清除 PIN（newPin 傳空字串＝清除）。回傳 { ok, error? }
export const setPin = (code, newPin, oldPin) =>
  rpc('set_game_pin', { p_code: code.trim(), p_new_pin: newPin, p_old_pin: oldPin || null })

// 用存檔碼（＋必要時 PIN）從雲端拉回並套用。失敗會丟出 NO_DATA / BAD_PIN / LOCKED
export async function pullSaveByCode(code, pin) {
  const c = code.trim()
  const data = await rpc('load_game', { p_code: c, p_pin: pin || null })
  if (!data) {
    const st = await pinStatus(c).catch(() => null)
    if (!st?.exists) throw new Error('NO_DATA')
    throw new Error(st.locked ? 'LOCKED' : 'BAD_PIN')
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  localStorage.setItem(CODE_KEY, c)
}

// ── 本機玩家清單（同一台平板給同學玩用）──────────────────────────────────
export function getProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || [] } catch { return [] }
}
const putProfiles = (list) => localStorage.setItem(PROFILES_KEY, JSON.stringify(list))

export function addProfile(name, emoji = '🙂') {
  const code = crypto.randomUUID().replace(/-/g, '')
  putProfiles([...getProfiles(), { name: name.trim() || '新玩家', emoji, code }])
  return code
}
export function renameProfile(code, name, emoji) {
  putProfiles(getProfiles().map(p => p.code === code
    ? { ...p, name: name.trim() || p.name, emoji: emoji || p.emoji } : p))
}
// 只從這台裝置的清單移除，不會刪掉雲端存檔（存檔碼還在就救得回來）
export const removeProfile = (code) => putProfiles(getProfiles().filter(p => p.code !== code))

// 把目前這台裝置原本的存檔收進清單，讓它在「切換玩家」裡看得到
export function seedProfiles(name = '我') {
  const code = getSaveCode()
  if (!code) return
  if (!getProfiles().some(p => p.code === code)) {
    putProfiles([{ name, emoji: '🌟', code }, ...getProfiles()])
  }
}

// 切換到別的玩家：先把現在的進度存上雲端，再把對方的拉下來
export async function switchProfile(code, pin) {
  if (code === getSaveCode()) return
  await pushSave().catch(() => {}) // 存不上去也要讓人切，避免卡住
  await pullSaveByCode(code, pin)
  location.reload()
}

// 開新玩家：本機清空成全新遊戲（舊進度已存雲端，靠存檔碼救回）
export async function startFresh(code) {
  await pushSave().catch(() => {})
  localStorage.removeItem(SAVE_KEY)
  localStorage.setItem(CODE_KEY, code)
  location.reload()
}

// ── 掃 QR 進來（網址帶 ?code=）────────────────────────────────────────────
export const pendingCode = () => sessionStorage.getItem(PENDING_KEY)
export const clearPending = () => sessionStorage.removeItem(PENDING_KEY)

// 把 ?code= 從網址與瀏覽歷史抹掉，免得存檔碼被旁邊的人看到
function takeUrlCode() {
  const url = new URL(location.href)
  const code = url.searchParams.get('code')
  if (!code) return null
  url.searchParams.delete('code')
  history.replaceState(null, '', url)
  return code.trim()
}

let timer
export function startAutoSave() {
  navigator.storage?.persist?.().catch(() => {}) // 第1層：請求瀏覽器別清掉本機資料
  if (!SUPABASE_ANON) return

  const scanned = takeUrlCode()
  if (scanned && scanned !== getSaveCode()) {
    sessionStorage.setItem(PENDING_KEY, scanned) // 一律交給 LoginGate（它會判斷要不要問 PIN）
  } else if (isEmpty(localRaw()) && getSaveCode()) {
    // 開機自動還原：本機空的但有存檔碼（例如被清過但碼還在）→ 拉回雲端。
    // ⚠️ 若該存檔設了 PIN，這裡沒帶 PIN 一定被擋，絕不能靜靜失敗——否則使用者
    //    會以為進度不見了。改成轉交 LoginGate 問 PIN。
    const code = getSaveCode()
    pullSaveByCode(code)
      .then(() => location.reload())
      .catch(e => { if (e.message !== 'NO_DATA') sessionStorage.setItem(PENDING_KEY, code) })
  }

  // 任何狀態變動 → 停 3 秒沒新動作才上傳（debounce）
  useGameStore.subscribe(() => { clearTimeout(timer); timer = setTimeout(() => pushSave(), 3000) })

  // 切到背景 / 關分頁時用 keepalive 再補存一次
  const flush = () => pushSave(true).catch(() => {})
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush() })
  window.addEventListener('pagehide', flush)
}
