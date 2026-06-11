const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function makeAdd(a, b) {
  return { num1: a, num2: b, operator: '+', answer: a + b, display: `${a} + ${b}` }
}
function makeSub(a, b) {
  return { num1: a, num2: b, operator: '-', answer: a - b, display: `${a} - ${b}` }
}
function makeMul(a, b) {
  return { num1: a, num2: b, operator: '×', answer: a * b, display: `${a} × ${b}` }
}
function makeDiv(a, b) {
  return { num1: a * b, num2: b, operator: '÷', answer: a, display: `${a * b} ÷ ${b}` }
}

const generators = {
  // 加法
  1: () => makeAdd(rand(1, 9), rand(1, 9)),
  2: () => { const a = rand(11, 93); const b = rand(1, 9 - (a % 10 > 9 ? 0 : 0)); return makeAdd(a - (a % 10 === 0 ? 1 : 0), rand(1, 9)) },
  3: () => { const a = rand(15, 88); return makeAdd(a, rand(10 - (a % 10), 9)) }, // carrying
  4: () => { const a = rand(10, 49); const b = rand(10, 99 - a); return b % 10 + a % 10 < 10 ? makeAdd(a, b) : makeAdd(a, b - (b % 10)) },
  5: () => { const a = rand(17, 83); const b = rand(10, 99 - a); return makeAdd(a, b) },
  // 減法
  6: () => { const a = rand(20, 99); const b = rand(1, a % 10 || 9); return makeSub(a, b) },
  7: () => { const a = rand(21, 99); return makeSub(a, rand(1, 9)) },
  8: () => { const a = rand(30, 99); const b = rand(10, a - 10); return b % 10 <= a % 10 ? makeSub(a, b) : makeSub(a, b - (b % 10 - a % 10 + rand(1, 5))) },
  9: () => { const a = rand(31, 99); const b = rand(10, a - 1); return makeSub(a, b) },
  10: () => {
    const type = rand(1, 4)
    if (type === 1) return generators[4]()
    if (type === 2) return generators[5]()
    if (type === 3) return generators[7]()
    return generators[9]()
  },
  // 三位數加減
  11: () => { const a = rand(100, 800); const b = rand(10, 999 - a); return makeAdd(a, b) },
  12: () => { const a = rand(101, 899); const b = rand(10, 999 - a); return makeAdd(a, b) },
  13: () => { const a = rand(150, 900); const b = rand(50, a - 50); return makeSub(a, b) },
  14: () => { const a = rand(200, 999); const b = rand(100, a - 1); return makeSub(a, b) },
  15: () => { const ops = [generators[11], generators[12], generators[13], generators[14]]; return ops[rand(0, 3)]() },
  // ... more stages
  // 乘法
  21: () => makeMul(rand(2, 5), rand(1, 9)),
  22: () => makeMul(rand(6, 9), rand(1, 9)),
  23: () => makeMul(rand(2, 9), rand(2, 9)),
  24: () => { const a = rand(2, 9); return makeMul(a, rand(2, 9)) },
  25: () => { const ops = [generators[21], generators[22], generators[23]]; return ops[rand(0, 2)]() },
  // 除法
  31: () => makeDiv(rand(1, 9), rand(2, 5)),
  32: () => makeDiv(rand(1, 9), rand(6, 9)),
  33: () => makeDiv(rand(2, 9), rand(2, 9)),
  34: () => makeDiv(rand(2, 9), rand(2, 9)),
  35: () => { const ops = [generators[31], generators[32]]; return ops[rand(0, 1)]() },
  // 2位數進階
  41: () => { const a = rand(28, 79); const b = rand(10, 99 - a); return makeAdd(a, b) },
  42: () => { const a = rand(43, 98); const b = rand(11, a - 11); return makeSub(a, b) },
  43: () => { const a = rand(16, 74); const b = rand(16, 99 - a); return makeAdd(a, b) },
  44: () => { const a = rand(32, 99); const b = rand(13, a - 1); return makeSub(a, b) },
  45: () => { const ops = [generators[41], generators[42], generators[43], generators[44]]; return ops[rand(0, 3)]() },
  // 必進位加法：個位相加必進位
  46: () => { const aO = rand(2, 9); const bO = rand(10 - aO, 9); const aT = rand(1, 8); const bT = rand(1, Math.min(8, 9 - aT)); return makeAdd(aT * 10 + aO, bT * 10 + bO) },
  // 必退位減法：個位必退位
  47: () => { const aO = rand(0, 8); const bO = rand(aO + 1, 9); const aT = rand(2, 9); const bT = rand(1, aT - 1); return makeSub(aT * 10 + aO, bT * 10 + bO) },
  // 大數相加（兩數都 40+）
  48: () => { const a = rand(41, 79); const b = rand(10, 99 - a); return makeAdd(a, b) },
  // 大數相減（被減數 60+）
  49: () => { const a = rand(61, 99); const b = rand(11, a - 11); return makeSub(a, b) },
  // 混合挑戰 I
  50: () => { const ops = [generators[46], generators[47], generators[48], generators[49]]; return ops[rand(0, 3)]() },
  // 加法衝刺（中等數值）
  51: () => { const a = rand(23, 68); const b = rand(13, 99 - a); return makeAdd(a, b) },
  // 減法衝刺（中等數值）
  52: () => { const a = rand(34, 89); const b = rand(12, a - 12); return makeSub(a, b) },
  // 進位＋大數混合
  53: () => { const ops = [generators[46], generators[48], generators[43]]; return ops[rand(0, 2)]() },
  // 退位＋大數混合
  54: () => { const ops = [generators[47], generators[49], generators[44]]; return ops[rand(0, 2)]() },
  // 加減終極挑戰
  55: () => { const ops = [generators[46], generators[47], generators[48], generators[49], generators[51], generators[52]]; return ops[rand(0, 5)]() },
}

// Fill missing stages with similar difficulty
for (let i = 16; i <= 20; i++) generators[i] = generators[15]

// ── 乘法：兩位數 × 一位數（26-30）──────────────────────────
generators[26] = () => makeMul(rand(11, 19), rand(2, 9))           // 十幾 × 1位
generators[27] = () => makeMul(rand(12, 49), rand(2, 9))           // 中等2位 × 1位
generators[28] = () => makeMul(rand(25, 99), rand(2, 9))           // 大2位 × 1位
generators[29] = () => makeMul(rand(11, 99), rand(2, 9))           // 全範圍2位 × 1位
generators[30] = () => {                                            // 2位乘綜合
  const ops = [generators[26], generators[27], generators[28]]
  return ops[rand(0, 2)]()
}

// ── 除法：兩位數 ÷ 一位數（36-40）──────────────────────────
generators[36] = () => {                                            // 商1位，被除數2位
  const b = rand(2, 9)
  const minA = Math.max(2, Math.ceil(10 / b))
  const maxA = Math.min(9, Math.floor(99 / b))
  return makeDiv(rand(minA, maxA), b)
}
generators[37] = () => {                                            // 商2位，被除數2位
  const b = rand(2, 5)
  const maxA = Math.floor(99 / b)
  return makeDiv(rand(10, maxA), b)
}
generators[38] = () => {                                            // 被除數2位混合
  const b = rand(2, 7)
  const minA = Math.ceil(10 / b)
  const maxA = Math.floor(99 / b)
  return makeDiv(rand(minA, maxA), b)
}
generators[39] = () => {
  const ops = [generators[36], generators[37], generators[38]]
  return ops[rand(0, 2)]()
}
generators[40] = () => {
  const ops = [generators[36], generators[37], generators[38]]
  return ops[rand(0, 2)]()
}

// ── 綜合進階（56-70）── 乘除 × 三位數加減 混合，每題20秒
generators[56] = () => makeMul(rand(11, 39), rand(2, 9))          // 2位數乘 小數
generators[57] = () => makeMul(rand(40, 79), rand(2, 9))          // 2位數乘 大數
generators[58] = () => makeMul(rand(12, 99), rand(2, 9))          // 2位數乘 全範圍
generators[59] = () => { const a = rand(11, 49); const b = rand(2, 9); return makeDiv(a, b) }  // ÷1位 答案≤49
generators[60] = () => { const a = rand(50, 99); const b = rand(2, 9); return makeDiv(a, b) }  // ÷1位 答案≥50
generators[61] = () => { const a = rand(100, 699); const b = rand(100, Math.min(899 - a, 400)); return makeAdd(a, b) } // 3位+3位
generators[62] = () => { const a = rand(300, 999); const b = rand(100, a - 100); return makeSub(a, b) }               // 3位-3位
generators[63] = () => (rand(0, 1) ? generators[61]() : generators[62]())  // 3位加減混合
generators[64] = () => (rand(0, 1) ? generators[56]() : generators[59]())  // 乘÷ I
generators[65] = () => (rand(0, 1) ? generators[57]() : generators[60]())  // 乘÷ II
generators[66] = () => makeMul(rand(13, 79), rand(3, 9))           // 乘法衝刺
generators[67] = () => { const a = rand(13, 99); const b = rand(3, 9); return makeDiv(a, b) }  // 除法衝刺
generators[68] = () => {                                           // 乘除大混合
  const r = rand(0, 3)
  if (r === 0) return generators[58]()
  if (r === 1) return generators[60]()
  if (r === 2) return generators[66]()
  return generators[67]()
}
generators[69] = () => {                                           // 乘除加減混合
  const r = rand(0, 3)
  if (r === 0) return generators[61]()
  if (r === 1) return generators[62]()
  if (r === 2) return generators[58]()
  return generators[60]()
}
generators[70] = () => {                                           // 終極綜合挑戰
  const r = rand(0, 5)
  if (r === 0) return generators[58]()
  if (r === 1) return generators[60]()
  if (r === 2) return generators[61]()
  if (r === 3) return generators[62]()
  if (r === 4) return generators[66]()
  return generators[67]()
}

export function generateStageQuestions(stageId) {
  const gen = generators[stageId] || generators[10]
  const questions = []
  const seen = new Set()
  let attempts = 0
  while (questions.length < 10 && attempts < 100) {
    const q = gen()
    const key = q.display
    if (!seen.has(key) && q.answer > 0) {
      seen.add(key)
      questions.push(q)
    }
    attempts++
  }
  return questions
}

export const STAGE_NAMES = {
  1: '加法入門', 2: '加法進階', 3: '進位加法', 4: '兩位數加', 5: '加法高手',
  6: '減法入門', 7: '退位減法', 8: '兩位數減', 9: '減法高手', 10: '加減混合',
  11: '三位數加', 12: '三位數加+', 13: '三位數減', 14: '三位數減+', 15: '三位混合',
  21: '乘法初探', 22: '乘法進階', 23: '九九全表', 24: '乘法高手', 25: '乘法達人',
  31: '除法初探', 32: '除法進階', 33: '除法全攻', 34: '除法高手', 35: '除法達人',
  41: '進階加法', 42: '進階減法', 43: '大數加法', 44: '大數減法', 45: '加減總挑戰',
  46: '必進位加', 47: '必退位減', 48: '大數加II', 49: '大數減II', 50: '混合挑戰I',
  51: '加法衝刺', 52: '減法衝刺', 53: '進位大數', 54: '退位大數', 55: '加減終極',
}

for (let i = 16; i <= 20; i++) STAGE_NAMES[i] = `挑戰 ${i}`

STAGE_NAMES[26] = '兩位乘一位I'
STAGE_NAMES[27] = '兩位乘一位II'
STAGE_NAMES[28] = '兩位乘一位III'
STAGE_NAMES[29] = '兩位乘一位IV'
STAGE_NAMES[30] = '兩位乘綜合'

STAGE_NAMES[36] = '兩位除一位I'
STAGE_NAMES[37] = '兩位除一位II'
STAGE_NAMES[38] = '兩位除一位III'
STAGE_NAMES[39] = '兩位除一位IV'
STAGE_NAMES[40] = '兩位除綜合'

// 綜合進階
STAGE_NAMES[56] = '兩位數乘 I'
STAGE_NAMES[57] = '兩位數乘 II'
STAGE_NAMES[58] = '乘法全攻'
STAGE_NAMES[59] = '除法進階 I'
STAGE_NAMES[60] = '除法進階 II'
STAGE_NAMES[61] = '三位數加 II'
STAGE_NAMES[62] = '三位數減 II'
STAGE_NAMES[63] = '三位數加減'
STAGE_NAMES[64] = '乘除混合 I'
STAGE_NAMES[65] = '乘除混合 II'
STAGE_NAMES[66] = '乘法衝刺'
STAGE_NAMES[67] = '除法衝刺'
STAGE_NAMES[68] = '乘除大混合'
STAGE_NAMES[69] = '乘除加減'
STAGE_NAMES[70] = '🔥 終極挑戰'
