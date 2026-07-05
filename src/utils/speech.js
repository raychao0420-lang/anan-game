// 英語朗讀（雙語連載劇用）。採用瀏覽器內建 Web Speech API：
// 免費、免 API 金鑰、不需後端，符合「前端絕不打包任何金鑰」的原則。
// 品質依裝置而定——iPhone/iPad/Mac 內建英語語音相當自然；部分 Windows 較機械。
// 這裡會自動挑「最自然」的英語語音，並稍微放慢語速，讓它不要太生硬、太像機器人。

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

let _voices = []
function loadVoices() {
  if (!synth) return
  _voices = synth.getVoices() || []
}
if (synth) {
  loadVoices()
  // 有些瀏覽器語音是非同步載入的，載好後再更新一次
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', loadVoices)
  }
}

// 名稱含這些關鍵字的語音通常比較自然，越前面越優先
const PREFER = [
  'natural', 'premium', 'enhanced', 'neural', 'siri',
  'samantha', 'ava', 'allison', 'joanna', 'aria', 'jenny', 'nicky', 'zoe',
  'google us english', 'google uk english female', 'google uk english',
  'karen', 'serena', 'daniel', 'moira', 'tessa',
]

function pickVoice() {
  if (!_voices.length) loadVoices()
  const en = _voices.filter((v) => /^en(-|_|$)/i.test(v.lang))
  if (!en.length) return null
  const score = (v) => {
    const n = (v.name || '').toLowerCase()
    let s = 0
    PREFER.forEach((k, i) => { if (n.includes(k)) s = Math.max(s, PREFER.length - i) })
    if (/^en[-_]?US/i.test(v.lang)) s += 0.5   // 小三學的是美式，優先美式
    if (v.localService === false)   s += 0.3   // 線上語音通常較自然
    return s
  }
  return en.slice().sort((a, b) => score(b) - score(a))[0]
}

// 去掉題目高亮用的 {數字} [關鍵詞] 標記，避免把括號唸出來
function plain(text) {
  return String(text).replace(/[{}[\]]/g, '').replace(/\s+/g, ' ').trim()
}

export function isSpeechSupported() {
  return !!synth && typeof SpeechSynthesisUtterance !== 'undefined'
}

// 朗讀一段英文。onEnd 在唸完（或被打斷）時呼叫，讓按鈕收回「朗讀中」狀態。
export function speakEnglish(text, { onEnd } = {}) {
  if (!isSpeechSupported() || !text) return false
  try {
    synth.cancel() // 先停掉上一句，避免兩句疊在一起
    const u = new SpeechSynthesisUtterance(plain(text))
    const v = pickVoice()
    if (v) u.voice = v
    u.lang = v?.lang || 'en-US'
    u.rate = 0.92  // 稍慢一點，孩子聽得清楚、也比較自然
    u.pitch = 1.0
    u.volume = 1.0
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd }
    synth.speak(u)
    return true
  } catch (e) {
    return false
  }
}

export function stopSpeaking() {
  if (synth) { try { synth.cancel() } catch (e) { /* ignore */ } }
}
