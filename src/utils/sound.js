let _ctx = null
let muted = localStorage.getItem('anan-muted') === 'true'

// Audio file player (for real animal sounds)
function playAudioFile(url) {
  if (muted) return
  try {
    const audio = new Audio(url)
    audio.volume = 0.75
    audio.play().catch(() => {})
  } catch(e) {}
}

function ctx() {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)() } catch(e) { return null }
  }
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {})
  return _ctx
}

export function setMuted(v) {
  muted = v
  localStorage.setItem('anan-muted', String(v))
}
export function isMuted() { return muted }

function tone(freq, dur, type = 'sine', vol = 0.25, delay = 0) {
  if (muted) return
  const c = ctx()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime + delay)
    gain.gain.setValueAtTime(vol, c.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur)
    osc.start(c.currentTime + delay)
    osc.stop(c.currentTime + delay + dur + 0.05)
  } catch(e) {}
}

export const sfx = {
  correct:  () => { tone(523, 0.1); tone(784, 0.15, 'sine', 0.2, 0.08); tone(1047, 0.18, 'sine', 0.15, 0.18) },
  wrong:    () => { tone(220, 0.12, 'sawtooth', 0.2); tone(160, 0.22, 'sawtooth', 0.15, 0.1) },
  combo:    (n) => { const f = [784, 880, 988, 1047][Math.min(n - 3, 3)]; tone(f, 0.07, 'square', 0.12); tone(f * 1.25, 0.1, 'square', 0.1, 0.09) },
  coins:    () => { tone(880, 0.06, 'sine', 0.18); tone(1108, 0.1, 'sine', 0.14, 0.07) },
  evolve:   () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.14, 'sine', 0.2, i * 0.1)),
  bossHit:  () => { tone(330, 0.04, 'square', 0.28); tone(220, 0.1, 'square', 0.18, 0.04) },
  bossWin:  () => [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.12, 'sine', 0.22, i * 0.11)),
  bossLose: () => { tone(330, 0.28, 'sawtooth', 0.2); tone(247, 0.32, 'sawtooth', 0.14, 0.26); tone(196, 0.45, 'sawtooth', 0.09, 0.52) },
  click:    () => tone(880, 0.04, 'sine', 0.07),
  unlock:   () => [523, 784, 1047].forEach((f, i) => tone(f, 0.12, 'sine', 0.18, i * 0.1)),
  achieve:  () => { tone(659, 0.1); tone(784, 0.1, 'sine', 0.2, 0.1); tone(1047, 0.2, 'sine', 0.2, 0.22) },
  star:     (n) => tone([523, 659, 784][n - 1] || 523, 0.12, 'sine', 0.2),
  beagle:   () => playAudioFile(new URL('../assets/sounds/beagle-bark.mp3', import.meta.url).href),
  otter:    () => {
    tone(1200, 0.06, 'sine', 0.22)
    tone(1450, 0.05, 'sine', 0.18, 0.1)
    tone(1100, 0.06, 'sine', 0.2,  0.2)
    tone(1350, 0.05, 'sine', 0.15, 0.3)
  },
  cat: () => {
    // meow：頻率從高滑降再微微翹尾，模擬貓叫
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      const osc  = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)
      osc.type = 'sine'
      const t = c.currentTime
      osc.frequency.setValueAtTime(900, t)
      osc.frequency.linearRampToValueAtTime(450, t + 0.18)
      osc.frequency.linearRampToValueAtTime(520, t + 0.32)
      osc.frequency.linearRampToValueAtTime(380, t + 0.55)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.28, t + 0.04)
      gain.gain.setValueAtTime(0.28, t + 0.42)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
      osc.start(t)
      osc.stop(t + 0.65)
    } catch(e) {}
  },
  fox: () => {
    // 北極狐 yip：鋸齒波短促上揚再跌落，帶點沙啞感
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      const osc  = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)
      osc.type = 'sawtooth'
      const t = c.currentTime
      osc.frequency.setValueAtTime(480, t)
      osc.frequency.linearRampToValueAtTime(820, t + 0.07)
      osc.frequency.linearRampToValueAtTime(380, t + 0.22)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.2, t + 0.03)
      gain.gain.setValueAtTime(0.2, t + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      osc.start(t)
      osc.stop(t + 0.32)
    } catch(e) {}
  },
  bird: () => {
    // 繡眼鳥：四聲高頻啁啾，音高交錯上下
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      [[3000, 0, 0.055], [3400, 0.07, 0.05], [2800, 0.14, 0.06], [3200, 0.21, 0.055]].forEach(([freq, delay, dur]) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.type = 'sine'
        const t = c.currentTime + delay
        osc.frequency.setValueAtTime(freq, t)
        osc.frequency.linearRampToValueAtTime(freq * 1.12, t + dur * 0.45)
        osc.frequency.linearRampToValueAtTime(freq * 0.96, t + dur)
        gain.gain.setValueAtTime(0.16, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
        osc.start(t)
        osc.stop(t + dur + 0.01)
      })
    } catch(e) {}
  },
  penguin: () => {
    // 企鵝：兩聲鼻音喇叭般的 honk
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      [[0, 520], [0.22, 560]].forEach(([delay, f1]) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.type = 'sawtooth'
        const t = c.currentTime + delay
        osc.frequency.setValueAtTime(f1, t)
        osc.frequency.linearRampToValueAtTime(f1 * 1.08, t + 0.05)
        osc.frequency.linearRampToValueAtTime(f1 * 0.78, t + 0.16)
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.17, t + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
        osc.start(t)
        osc.stop(t + 0.2)
      })
    } catch(e) {}
  },
  owl: () => {
    // 貓頭鷹：兩聲低沉柔和的 hoo～hoo
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      [0, 0.34].forEach((delay) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.type = 'sine'
        const t = c.currentTime + delay
        osc.frequency.setValueAtTime(400, t)
        osc.frequency.linearRampToValueAtTime(330, t + 0.06)
        osc.frequency.linearRampToValueAtTime(360, t + 0.22)
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.22, t + 0.05)
        gain.gain.setValueAtTime(0.2, t + 0.16)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
        osc.start(t)
        osc.stop(t + 0.3)
      })
    } catch(e) {}
  },
  seal: () => {
    // 海豹：兩聲低沉的「arf」吠叫
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      [0, 0.2].forEach((delay) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.type = 'square'
        const t = c.currentTime + delay
        osc.frequency.setValueAtTime(300, t)
        osc.frequency.linearRampToValueAtTime(175, t + 0.12)
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.2, t + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
        osc.start(t)
        osc.stop(t + 0.17)
      })
    } catch(e) {}
  },
  beaver: () => {
    // 河狸：一連串輕快的吱吱 chitter
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      [0, 0.07, 0.14, 0.21, 0.28].forEach((delay, i) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.type = 'square'
        const t = c.currentTime + delay
        const f = 1500 + (i % 2 === 0 ? 0 : 320)
        osc.frequency.setValueAtTime(f, t)
        osc.frequency.linearRampToValueAtTime(f * 1.15, t + 0.04)
        gain.gain.setValueAtTime(0.11, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
        osc.start(t)
        osc.stop(t + 0.06)
      })
    } catch(e) {}
  },
  hamster: () => {
    // 倉鼠：兩三聲超高細小的吱吱
    if (muted) return
    const c = ctx()
    if (!c) return
    try {
      [[0, 2800], [0.1, 3200], [0.2, 3000]].forEach(([delay, f]) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.type = 'sine'
        const t = c.currentTime + delay
        osc.frequency.setValueAtTime(f, t)
        osc.frequency.linearRampToValueAtTime(f * 1.2, t + 0.03)
        osc.frequency.linearRampToValueAtTime(f * 0.95, t + 0.06)
        gain.gain.setValueAtTime(0.13, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
        osc.start(t)
        osc.stop(t + 0.08)
      })
    } catch(e) {}
  },
  // 依寵物 id 播放專屬叫聲（集中管理，新增寵物只改這裡）
  pet(petId) {
    switch (petId) {
      case 'lulu':    return this.beagle()
      case 'jiji':    return this.cat()
      case 'kitsune': return this.fox()
      case 'mejiro':  return this.bird()
      case 'penguin': return this.penguin()
      case 'owl':     return this.owl()
      case 'seal':    return this.seal()
      case 'beaver':  return this.beaver()
      case 'hamster': return this.hamster()
      default:        return this.otter()  // hana / kotaro
    }
  },
}

// ── 環境音（我的家第4彈）：rain 雨聲 / wind 風雪 / birds 白天鳥叫 / crickets 夜晚蟲鳴 ──
// WebAudio 合成，不用音檔；startAmbient 會自動停掉上一個，離開畫面記得 stopAmbient()
let _amb = null

export function stopAmbient() {
  if (!_amb) return
  _amb.cancelled = true
  clearTimeout(_amb.timer)
  _amb.nodes.forEach((n) => { try { n.stop?.() } catch { /* 已停 */ } try { n.disconnect() } catch { /* 已斷 */ } })
  _amb = null
}

export function startAmbient(kind) {
  stopAmbient()
  if (muted) return
  const c = ctx()
  if (!c) return
  try {
    const g = c.createGain()
    g.gain.value = 0
    g.connect(c.destination)
    const amb = { nodes: [g], timer: null, cancelled: false }

    if (kind === 'rain' || kind === 'wind') {
      // 白噪音 buffer 循環 + 低通濾波：rain 沙沙聲、wind 呼呼低鳴
      const len = c.sampleRate * 2
      const buf = c.createBuffer(1, len, c.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
      const src = c.createBufferSource()
      src.buffer = buf
      src.loop = true
      const filt = c.createBiquadFilter()
      filt.type = 'lowpass'
      filt.frequency.value = kind === 'rain' ? 2200 : 480
      src.connect(filt)
      filt.connect(g)
      src.start()
      g.gain.linearRampToValueAtTime(kind === 'rain' ? 0.045 : 0.035, c.currentTime + 1.2)
      amb.nodes.push(src, filt)
    } else if (kind === 'birds') {
      // 每 5~12 秒一串上滑短鳴
      g.gain.value = 1
      const chirp = () => {
        if (amb.cancelled || muted) return
        const n = 2 + Math.floor(Math.random() * 3)
        for (let i = 0; i < n; i++) {
          const t = c.currentTime + i * 0.18 + Math.random() * 0.05
          const o = c.createOscillator(), og = c.createGain()
          o.connect(og); og.connect(g)
          const f = 2200 + Math.random() * 1200
          o.frequency.setValueAtTime(f, t)
          o.frequency.exponentialRampToValueAtTime(f * 1.4, t + 0.08)
          og.gain.setValueAtTime(0.05, t)
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
          o.start(t); o.stop(t + 0.15)
        }
        amb.timer = setTimeout(chirp, 5000 + Math.random() * 7000)
      }
      amb.timer = setTimeout(chirp, 1500)
    } else if (kind === 'crickets') {
      // 每 2~5 秒三連微弱蟲鳴
      g.gain.value = 1
      const chirp = () => {
        if (amb.cancelled || muted) return
        for (let i = 0; i < 3; i++) {
          const t = c.currentTime + i * 0.09
          const o = c.createOscillator(), og = c.createGain()
          o.type = 'triangle'
          o.connect(og); og.connect(g)
          o.frequency.setValueAtTime(4200, t)
          og.gain.setValueAtTime(0.028, t)
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
          o.start(t); o.stop(t + 0.08)
        }
        amb.timer = setTimeout(chirp, 2200 + Math.random() * 2800)
      }
      amb.timer = setTimeout(chirp, 1000)
    }
    _amb = amb
  } catch { /* WebAudio 不可用就安靜跳過 */ }
}
