export const ACHIEVEMENTS = [
  { id: 'first_stage',  icon: '🌱', label: '初出茅廬',   desc: '完成第1關' },
  { id: 'stage_10',     icon: '🔟', label: '闖關十傑',   desc: '完成10個關卡' },
  { id: 'stage_all',    icon: '🏆', label: '數學大師',   desc: '完成全部40關' },
  { id: 'perfect',      icon: '💯', label: '完美主義',   desc: '某關卡答對全10題' },
  { id: 'combo10',      icon: '🔥', label: '火力全開',   desc: '達成10連答' },
  { id: 'evolve1',      icon: '✨', label: '成長的喜悅', desc: '進化寵物一次' },
  { id: 'evolve_max',   icon: '👑', label: '傳說誕生',   desc: '寵物達到傳說等級' },
  { id: 'all_pets',     icon: '🐾', label: '收藏家',     desc: '解鎖所有寵物' },
  { id: 'boss1',        icon: '⚔️',  label: '英雄誕生',   desc: '打倒第一個Boss' },
  { id: 'boss_all',     icon: '💪', label: 'Boss終結者', desc: '打倒全部4個Boss' },
  { id: 'daily3',       icon: '📅', label: '每日勇士',   desc: '累計完成3天每日任務' },
  { id: 'coins_500',    icon: '💰', label: '小富翁',     desc: '累積獲得500金幣' },
  { id: 'shop3',        icon: '🛍️',  label: '購物達人',   desc: '購買3件商品' },
]

export const BOSS_REWARDS = {
  10: { id: 'boss_medal1', name: '勇者勳章',   emoji: '🎖️', category: 'rare', price: 0, desc: 'Boss獎勵★' },
  20: { id: 'boss_medal2', name: '三位數之印', emoji: '🏅', category: 'rare', price: 0, desc: 'Boss獎勵★' },
  30: { id: 'boss_medal3', name: '乘法魔法戒', emoji: '💍', category: 'rare', price: 0, desc: 'Boss獎勵★' },
  40: { id: 'boss_medal4', name: '傳說盾牌',   emoji: '🛡️', category: 'rare', price: 0, desc: 'Boss獎勵★' },
}

export const BOSS_DEFS = {
  10: { name: '二位數巨獸', emoji: '👾', chapter: '第一章' },
  20: { name: '三位數魔王', emoji: '🤖', chapter: '第二章' },
  30: { name: '乘法惡魔',   emoji: '😈', chapter: '第三章' },
  40: { name: '終極數學神', emoji: '🌟', chapter: '終章' },
}
