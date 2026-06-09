export const DAILY_TASK_DEFS = [
  { id: 'correct10', label: '答對10題',     icon: '✅', type: 'correct',  target: 10,  reward: 30 },
  { id: 'correct20', label: '答對20題',     icon: '🎯', type: 'correct',  target: 20,  reward: 60 },
  { id: 'earn50',    label: '賺取50金幣',   icon: '💰', type: 'coins',    target: 50,  reward: 20 },
  { id: 'earn100',   label: '賺取100金幣',  icon: '🤑', type: 'coins',    target: 100, reward: 40 },
  { id: 'stage1',    label: '完成1個關卡',  icon: '🎮', type: 'stages',   target: 1,   reward: 25 },
  { id: 'stage3',    label: '完成3個關卡',  icon: '🚀', type: 'stages',   target: 3,   reward: 50 },
  { id: 'stars3',    label: '三星通關一次', icon: '⭐', type: 'stars3',   target: 1,   reward: 50 },
  { id: 'combo5',    label: '達成5連答',    icon: '🔥', type: 'combo5',   target: 1,   reward: 30 },
]

export function getTodayTasks(dateStr) {
  const seed = dateStr.split('-').reduce((acc, n, i) => acc + parseInt(n) * (i + 1), 0)
  const shuffled = [...DAILY_TASK_DEFS].sort((a, b) => {
    const ha = ((seed * 1103515245 + a.id.charCodeAt(0) * 12345) & 0x7fffffff) / 0x7fffffff
    const hb = ((seed * 1103515245 + b.id.charCodeAt(0) * 12345) & 0x7fffffff) / 0x7fffffff
    return ha - hb
  })
  return shuffled.slice(0, 3)
}
