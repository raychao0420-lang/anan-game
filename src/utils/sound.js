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
}
