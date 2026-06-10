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
}

// Fill missing stages with similar difficulty
for (let i = 16; i <= 20; i++) generators[i] = generators[15]
for (let i = 26; i <= 30; i++) generators[i] = generators[25]
for (let i = 36; i <= 40; i++) generators[i] = generators[35]

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
}

for (let i = 16; i <= 20; i++) STAGE_NAMES[i] = `挑戰 ${i}`
for (let i = 26; i <= 30; i++) STAGE_NAMES[i] = `乘法 ${i}`
for (let i = 36; i <= 40; i++) STAGE_NAMES[i] = `除法 ${i}`
