// 關卡章節與解鎖規則（原本寫死在 StageScreen.jsx，2026-08-16 抽出來共用）
// ⚠️ 「當日限定挑戰」要用同一套解鎖規則挑關卡，複製一份遲早會跟畫面走鐘，所以放這裡單一來源。

export const CHAPTERS = [
  { label: '加減法',       range: [1,  10],   icon: '➕', cat: 'addsub'  },
  { label: '加減進階',     range: [41, 55],   icon: '⚡', cat: 'addsub'  },
  { label: '兩位加減進階', range: [71, 80],   icon: '💪', cat: 'addsub'  },
  { label: '三位數',       range: [11, 20],   icon: '🔢', cat: 'digits3' },
  { label: '乘法',         range: [21, 30],   icon: '✖️',  cat: 'muldiv'  },
  { label: '一位乘兩位',   range: [101, 105], icon: '✳️', cat: 'muldiv'  },
  { label: '一位乘三位',   range: [106, 110], icon: '🔟', cat: 'muldiv'  },
  { label: '除法',         range: [31, 40],   icon: '➗', cat: 'muldiv'  },
  { label: '乘除進階',     range: [86, 95],   icon: '🎯', cat: 'muldiv'  },
  { label: '兩位數乘法',   range: [96, 100],  icon: '🧮', cat: 'muldiv'  },
  { label: '三位數除法',   range: [111, 115], icon: '➗', cat: 'muldiv'  },
  { label: '四位數加減',   range: [116, 120], icon: '🔢', cat: 'digits3' },
  { label: '綜合進階',     range: [56, 70],   icon: '🚀', cat: 'mixed'   },
]

// 章節第一關 → 前置關卡（其餘關卡預設前置是 id - 1）
export const CHAPTER_PREREQS = { 41: 10, 11: 55, 71: 55, 86: 40, 96: 30, 101: 30, 111: 40, 116: 20 }

export const ALL_STAGE_IDS = CHAPTERS.flatMap(({ range: [a, b] }) => {
  const ids = []
  for (let i = a; i <= b; i++) ids.push(i)
  return ids
})

export function isStageUnlocked(stages, id) {
  if (id === 1) return true
  const prereq = CHAPTER_PREREQS[id] ?? id - 1
  return !!stages?.[prereq]?.completed
}

export function chapterOf(id) {
  return CHAPTERS.find(({ range: [a, b] }) => id >= a && id <= b) || null
}
