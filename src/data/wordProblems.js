// 兩步驟應用題題庫
// 文字標記語法：
//   {N}    → 數字高亮（級別1+2會著色）
//   [xxx]  → 關鍵詞高亮（只有級別1會著色）
//
// steps 每步可為：
//   { type: 'eq', a, op, b, answer, label }   // 一般算式
//   { type: 'rem', a, b, answer, label }      // 餘數題（顯示 a ÷ b 的餘數）

export const WORD_PROBLEMS = {
  // ── 第1關 熱身：簡單加減 ──
  round1: [
    {
      text: '安安有 {12} 顆糖，[吃掉] {3} 顆，弟弟[又給]他 {5} 顆，現在有幾顆？',
      steps: [
        { type: 'eq', label: '先算吃掉後剩幾顆', a: 12, op: '-', b: 3,    answer: 9 },
        { type: 'eq', label: '再加上弟弟給的',   a: 9,  op: '+', b: 5,    answer: 14 },
      ],
      unit: '顆',
    },
    {
      text: '第一天看 {15} 頁書，第二天看 {12} 頁，全本 {40} 頁，[剩下]幾頁沒看？',
      steps: [
        { type: 'eq', label: '先算兩天共看幾頁', a: 15, op: '+', b: 12, answer: 27 },
        { type: 'eq', label: '再算還剩幾頁',     a: 40, op: '-', b: 27, answer: 13 },
      ],
      unit: '頁',
    },
    {
      text: '公園有 {25} 隻鴿子，[飛走] {8} 隻，[又飛來] {6} 隻，現在有幾隻？',
      steps: [
        { type: 'eq', label: '先算飛走後剩幾隻', a: 25, op: '-', b: 8,  answer: 17 },
        { type: 'eq', label: '再加上飛來的',     a: 17, op: '+', b: 6,  answer: 23 },
      ],
      unit: '隻',
    },
    {
      text: '媽媽買 {30} 顆蛋，做蛋糕[用了] {12} 顆，[又買] {18} 顆，現在有幾顆？',
      steps: [
        { type: 'eq', label: '先算用掉後剩幾顆', a: 30, op: '-', b: 12, answer: 18 },
        { type: 'eq', label: '再加上新買的',     a: 18, op: '+', b: 18, answer: 36 },
      ],
      unit: '顆',
    },
    {
      text: '第一週存 {20} 元，第二週存 {35} 元，買玩具[花了] {40} 元，[剩]多少元？',
      steps: [
        { type: 'eq', label: '先算兩週共存多少', a: 20, op: '+', b: 35, answer: 55 },
        { type: 'eq', label: '再算花完剩多少',   a: 55, op: '-', b: 40, answer: 15 },
      ],
      unit: '元',
    },
  ],

  // ── 第2關 加速：簡單乘除 ──
  round2: [
    {
      text: '一包糖有 {8} 顆，買 {3} 包，[平分]給 {4} 隻寵物，每隻幾顆？',
      steps: [
        { type: 'eq', label: '先算總共幾顆糖',     a: 8,  op: '×', b: 3, answer: 24 },
        { type: 'eq', label: '再平分給寵物',       a: 24, op: '÷', b: 4, answer: 6  },
      ],
      unit: '顆',
    },
    {
      text: '安安每天做 {6} 題數學，做了 {5} 天，[平分]寫進 {3} 本本子，每本幾題？',
      steps: [
        { type: 'eq', label: '先算五天共做幾題',   a: 6,  op: '×', b: 5, answer: 30 },
        { type: 'eq', label: '再平分到本子',       a: 30, op: '÷', b: 3, answer: 10 },
      ],
      unit: '題',
    },
    {
      text: '媽媽做 {4} 排餅乾，每排 {6} 個，[平分]給 {3} 隻寵物，每隻幾個？',
      steps: [
        { type: 'eq', label: '先算總共幾個餅乾',   a: 4,  op: '×', b: 6, answer: 24 },
        { type: 'eq', label: '再平分給寵物',       a: 24, op: '÷', b: 3, answer: 8  },
      ],
      unit: '個',
    },
    {
      text: '動物園 {3} 隻大象，每隻吃 {8} 公斤草，[平分]裝進 {6} 個桶子，每桶幾公斤？',
      steps: [
        { type: 'eq', label: '先算總共幾公斤草',   a: 3,  op: '×', b: 8, answer: 24 },
        { type: 'eq', label: '再平分到桶子',       a: 24, op: '÷', b: 6, answer: 4  },
      ],
      unit: '公斤',
    },
    {
      text: '一排座位 {9} 個位子，[共有] {6} 排，[平分]給 {3} 個班，每班幾個位子？',
      steps: [
        { type: 'eq', label: '先算總共幾個位子',   a: 9,  op: '×', b: 6, answer: 54 },
        { type: 'eq', label: '再平分到班級',       a: 54, op: '÷', b: 3, answer: 18 },
      ],
      unit: '個',
    },
  ],

  // ── 第3關 極速：混合 + 餘數 ──
  round3: [
    {
      text: '安安買 {5} 包糖果，每包 {6} 元，給店員 {50} 元，要[找]多少？',
      steps: [
        { type: 'eq', label: '先算總價', a: 5,  op: '×', b: 6,  answer: 30 },
        { type: 'eq', label: '再算找零', a: 50, op: '-', b: 30, answer: 20 },
      ],
      unit: '元',
    },
    {
      text: '{35} 顆糖[平分]給 {6} 隻寵物，每隻幾顆？還[剩]幾顆？',
      steps: [
        { type: 'eq',  label: '先算每隻分幾顆 (商)', a: 35, op: '÷', b: 6, answer: 5 },
        { type: 'rem', label: '再算剩下幾顆 (餘數)', a: 35, b: 6, answer: 5 },
      ],
      unit: '顆',
    },
    {
      text: 'LULU 跑 {18} 公尺，Hana 跑 {24} 公尺，[平均]每隻跑幾公尺？',
      steps: [
        { type: 'eq', label: '先算兩隻共跑幾公尺', a: 18, op: '+', b: 24, answer: 42 },
        { type: 'eq', label: '再平均分給 2 隻',    a: 42, op: '÷', b: 2,  answer: 21 },
      ],
      unit: '公尺',
    },
    {
      text: '一打鉛筆 {12} 枝賣 {60} 元，[每枝]幾元？媽媽買 {3} 枝要[付]多少？',
      steps: [
        { type: 'eq', label: '先算每枝多少錢', a: 60, op: '÷', b: 12, answer: 5  },
        { type: 'eq', label: '再算買 3 枝多少', a: 5,  op: '×', b: 3,  answer: 15 },
      ],
      unit: '元',
    },
    {
      text: '{50} 顆糖[平分]給 {7} 個人，每人幾顆？還[剩]幾顆？',
      steps: [
        { type: 'eq',  label: '先算每人幾顆 (商)', a: 50, op: '÷', b: 7, answer: 7 },
        { type: 'rem', label: '再算剩下幾顆 (餘數)', a: 50, b: 7, answer: 1 },
      ],
      unit: '顆',
    },
  ],
}

export function parseText(text) {
  const tokens = []
  let buf = ''
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (c === '{') {
      if (buf) { tokens.push({ kind: 'text', value: buf }); buf = '' }
      const end = text.indexOf('}', i)
      tokens.push({ kind: 'num', value: text.slice(i + 1, end) })
      i = end + 1
    } else if (c === '[') {
      if (buf) { tokens.push({ kind: 'text', value: buf }); buf = '' }
      const end = text.indexOf(']', i)
      tokens.push({ kind: 'topic', value: text.slice(i + 1, end) })
      i = end + 1
    } else {
      buf += c
      i++
    }
  }
  if (buf) tokens.push({ kind: 'text', value: buf })
  return tokens
}
