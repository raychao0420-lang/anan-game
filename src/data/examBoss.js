export const EXAM_BOSS_CONFIG = {
  name: '期末考大魔王',
  emoji: '📚',
  subtitle: '114學年下學期　三年級數學期末',
  totalQuestions: 10,
  passScore: 7,
  timePerQuestion: 60,
  firstClearCoins: 500,
  replayClearCoins: 100,
  rewardItemId: 'exam_trophy',
}

export const EXAM_QUESTIONS = [
  // 小數
  { id: 'e01', category: '小數', question: '8.0 + 0.2 = ?', answer: 8.2, unit: '' },
  { id: 'e02', category: '小數', question: '8.6 − 0.4 = ?', answer: 8.2, unit: '' },
  { id: 'e03', category: '小數', question: '57.4 − 43.4 = ?', answer: 14, unit: '' },
  { id: 'e04', category: '小數', question: '7.5 + 0.5 = ?', answer: 8, unit: '' },
  { id: 'e05', category: '小數', question: '3.7 + 0.5 = ?', answer: 4.2, unit: '' },
  { id: 'e06', category: '小數', question: '9.8 − 1.5 = ?', answer: 8.3, unit: '' },
  // 除法
  { id: 'e07', category: '除法', question: '42 ÷ 6 = ?', answer: 7, unit: '' },
  { id: 'e08', category: '除法', question: '216 ÷ 8 = ?', answer: 27, unit: '' },
  { id: 'e09', category: '除法', question: '120 ÷ 5 = ?', answer: 24, unit: '' },
  { id: 'e10', category: '除法', question: '133 ÷ 7 = ?', answer: 19, unit: '' },
  { id: 'e11', category: '除法', question: '408 ÷ 8 = ?', answer: 51, unit: '' },
  { id: 'e12', category: '除法', question: '565 ÷ 5 = ?', answer: 113, unit: '' },
  // 面積
  { id: 'e13', category: '面積', question: '邊長 4 公分的正方形，面積是多少？', answer: 16, unit: '平方公分' },
  { id: 'e14', category: '面積', question: '長 7 公分、寬 2 公分的長方形，面積是多少？', answer: 14, unit: '平方公分' },
  { id: 'e15', category: '面積', question: '邊長 5 公分的正方形，面積是多少？', answer: 25, unit: '平方公分' },
  // 時間
  { id: 'e16', category: '時間', question: '134 分鐘 = 2 小時又幾分？', answer: 14, unit: '分' },
  { id: 'e17', category: '時間', question: '1 小時 31 分鐘 = 幾分鐘？', answer: 91, unit: '分鐘' },
  { id: 'e18', category: '時間', question: '上午 8 時 50 分再過 1 小時 50 分，是上午 10 時幾分？', answer: 40, unit: '分' },
  // 應用題
  { id: 'e19', category: '應用題', question: '133 顆橘子，每 7 顆一袋，可以裝幾袋？', answer: 19, unit: '袋' },
  { id: 'e20', category: '應用題', question: '43 個小朋友分組，每組 8 人，可以分成幾個完整的組？', answer: 5, unit: '組' },
  { id: 'e21', category: '應用題', question: '每盒放 27 個，共 8 盒，一共幾個？', answer: 216, unit: '個' },
  { id: 'e22', category: '應用題', question: '每天做 5 題，做了 23 天，共做幾題？', answer: 115, unit: '題' },
]

export function pickExamQuestions(n = 10) {
  return [...EXAM_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, n)
}
