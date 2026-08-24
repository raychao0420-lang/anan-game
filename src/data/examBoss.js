export const EXAM_BOSS_CONFIG = {
  name: '期末考大魔王',
  emoji: '📚',
  subtitle: '114學年下學期　三年級期末考',
  totalQuestions: 10,
  passScore: 7,
  timePerQuestion: 20,
  mathTimePerQuestion: 120,
  firstClearCoins: 500,
  replayClearCoins: 100,
  rewardItemId: 'exam_trophy',
}

// type: 'number' → 輸入數字  |  type: 'choice' → 四選一選項
//
// ⚠️ 2026-08-24 使用者回報：「期中考被拿來刷金幣了，避免閉著眼睛刷」。
//    原本 52 題全是固定題目，安安整池背起來就能閉眼過關。兩個漏洞一起修：
//    ① 數學題改成「題型工廠」——每題帶 gen()，抽到時現場產生數字，背答案沒用。
//    ② 選擇題的正確答案原本固定在同一個位置，她可能是在背「這題選第 3 個」。
//       改成抽題時打亂選項順序，answer 索引跟著換算。
//    兩者都在抽題階段（materialize）處理完才送出，畫面端完全不用改。

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const D1 = (tenths) => (tenths / 10).toFixed(1)   // 一位小數顯示用

export const EXAM_QUESTIONS = [
  // ── 數學：小數（gen 每次現場出數字）────────────────────────
  { id: 'e01', category: '數學', type: 'number', unit: '',
    gen: () => { const a = R(11, 84), b = R(1, 9)          // 一位小數加法（不進位）
      return { question: `${D1(a)} + ${D1(b)} = ?`, answer: (a + b) / 10 } } },
  { id: 'e02', category: '數學', type: 'number', unit: '',
    gen: () => { const a = R(25, 98), b = R(1, a % 10)     // 一位小數減法（不退位）
      return { question: `${D1(a)} − ${D1(b)} = ?`, answer: (a - b) / 10 } } },
  { id: 'e03', category: '數學', type: 'number', unit: '',
    gen: () => { const a = R(400, 990), b = R(100, 390)    // 兩位數的一位小數減法
      return { question: `${D1(a)} − ${D1(b)} = ?`, answer: (a - b) / 10 } } },
  { id: 'e04', category: '數學', type: 'number', unit: '',
    gen: () => { const a = R(11, 94), b = 10 - (a % 10)    // 湊成整數
      return { question: `${D1(a)} + ${D1(b)} = ?`, answer: (a + b) / 10 } } },
  { id: 'e05', category: '數學', type: 'number', unit: '',
    gen: () => { const a = R(11, 89), b = R(10 - (a % 10) + 1, 9)   // 小數進位加法
      return { question: `${D1(a)} + ${D1(b)} = ?`, answer: (a + b) / 10 } } },
  { id: 'e06', category: '數學', type: 'number', unit: '',
    gen: () => { const a = R(21, 98), b = R((a % 10) + 1, 9)        // 小數退位減法
      return { question: `${D1(a)} − ${D1(b)} = ?`, answer: (a - b) / 10 } } },
  // ── 數學：除法（先定除數與商，再回推被除數，保證整除）──────
  { id: 'e07', category: '數學', type: 'number', unit: '',
    gen: () => { const d = R(3, 9), q = R(4, 9)
      return { question: `${d * q} ÷ ${d} = ?`, answer: q } } },
  { id: 'e08', category: '數學', type: 'number', unit: '',
    gen: () => { const d = R(6, 9), q = R(20, 40)
      return { question: `${d * q} ÷ ${d} = ?`, answer: q } } },
  { id: 'e09', category: '數學', type: 'number', unit: '',
    gen: () => { const d = R(4, 9), q = R(15, 30)
      return { question: `${d * q} ÷ ${d} = ?`, answer: q } } },
  { id: 'e10', category: '數學', type: 'number', unit: '',
    gen: () => { const d = R(6, 9), q = R(15, 25)
      return { question: `${d * q} ÷ ${d} = ?`, answer: q } } },
  { id: 'e11', category: '數學', type: 'number', unit: '',
    gen: () => { const d = R(6, 9), q = R(40, 70)
      return { question: `${d * q} ÷ ${d} = ?`, answer: q } } },
  { id: 'e12', category: '數學', type: 'number', unit: '',
    gen: () => { const d = R(4, 6), q = R(90, 140)
      return { question: `${d * q} ÷ ${d} = ?`, answer: q } } },
  // ── 數學：面積 ──────────────────────────────────────────
  { id: 'e13', category: '數學', type: 'number', unit: '平方公分',
    gen: () => { const s = R(3, 20)
      return { question: `邊長 ${s} 公分的正方形，面積是多少？`, answer: s * s } } },
  { id: 'e14', category: '數學', type: 'number', unit: '平方公分',
    gen: () => { const l = R(5, 15), w = R(2, 9)
      return { question: `長 ${l} 公分、寬 ${w} 公分的長方形，面積是多少？`, answer: l * w } } },
  { id: 'e15', category: '數學', type: 'number', unit: '公分',
    gen: () => { const l = R(4, 14), w = R(2, 9)   // 換個角度問：周長
      return { question: `長 ${l} 公分、寬 ${w} 公分的長方形，周長是多少？`, answer: (l + w) * 2 } } },
  // ── 數學：時間 ──────────────────────────────────────────
  { id: 'e16', category: '數學', type: 'number', unit: '分',
    gen: () => { const h = R(2, 4), m = R(5, 55)
      return { question: `${h * 60 + m} 分鐘 = ${h} 小時又幾分？`, answer: m } } },
  { id: 'e17', category: '數學', type: 'number', unit: '分鐘',
    gen: () => { const h = R(1, 3), m = R(10, 59)
      return { question: `${h} 小時 ${m} 分鐘 = 幾分鐘？`, answer: h * 60 + m } } },
  { id: 'e18', category: '數學', type: 'number', unit: '分',
    gen: () => { const sh = R(6, 8), sm = R(10, 55), dh = R(1, 2), dm = R(10, 55)
      const t = sm + dm, eh = sh + dh + Math.floor(t / 60)
      return { question: `上午 ${sh} 時 ${sm} 分再過 ${dh} 小時 ${dm} 分，是上午 ${eh} 時幾分？`, answer: t % 60 } } },
  // ── 數學：應用題 ────────────────────────────────────────
  { id: 'e19', category: '數學', type: 'number', unit: '袋',
    gen: () => { const per = R(4, 9), bags = R(12, 25)
      return { question: `${per * bags} 顆橘子，每 ${per} 顆一袋，可以裝幾袋？`, answer: bags } } },
  { id: 'e20', category: '數學', type: 'number', unit: '組',
    gen: () => { const kids = R(30, 70), per = R(6, 9)   // 有餘數，只問可分幾組
      return { question: `${kids} 個小朋友分組，每組 ${per} 人，可以分成幾組？`, answer: Math.floor(kids / per) } } },
  { id: 'e21', category: '數學', type: 'number', unit: '個',
    gen: () => { const per = R(12, 35), box = R(4, 9)
      return { question: `每盒放 ${per} 個，共 ${box} 盒，一共幾個？`, answer: per * box } } },
  { id: 'e22', category: '數學', type: 'number', unit: '題',
    gen: () => { const n = R(4, 12), d = R(14, 30)
      return { question: `每天做 ${n} 題，做了 ${d} 天，共做幾題？`, answer: n * d } } },

  // ── 社會 ────────────────────────────────────────────────
  { id: 's01', category: '社會', type: 'choice',
    question: '購物時，哪種做法最節約？',
    options: ['買很多打折品囤積', '看廣告喜歡就買', '先想好是否需要才購買', '跟朋友買一樣的'],
    answer: 3 },
  { id: 's02', category: '社會', type: 'choice',
    question: '下列哪種職業屬於「服務業」？',
    options: ['農夫', '工廠工人', '美容師', '漁夫'],
    answer: 3 },
  { id: 's03', category: '社會', type: 'choice',
    question: '台灣的地形以什麼為主？',
    options: ['沙漠', '草原', '平原', '山地'],
    answer: 4 },
  { id: 's04', category: '社會', type: 'choice',
    question: '台灣西部多平原，東部以哪種地形為主？',
    options: ['平原', '沙漠', '山地', '草原'],
    answer: 3 },
  { id: 's05', category: '社會', type: 'choice',
    question: '下列哪種行為能保護消費者權益？',
    options: ['收到發票就丟', '買東西不問價格', '購買後索取發票', '只相信廣告'],
    answer: 3 },
  { id: 's06', category: '社會', type: 'choice',
    question: '「農業」主要生產哪類產品？',
    options: ['電腦和手機', '蔬菜水果農作物', '玩具和衣服', '飛機和汽車'],
    answer: 2 },
  { id: 's07', category: '社會', type: 'choice',
    question: '社區「公共設施」是指？',
    options: ['私人財產', '大家共同使用的場所', '政府辦公室', '學校內的設備'],
    answer: 2 },
  { id: 's08', category: '社會', type: 'choice',
    question: '下列哪種行為符合環境保護？',
    options: ['隨意丟垃圾在路邊', '自備環保袋購物', '大量購買不需要的東西', '浪費水電'],
    answer: 2 },
  { id: 's09', category: '社會', type: 'choice',
    question: '「市場」的主要功能是？',
    options: ['讓人運動的地方', '買賣商品的場所', '政府辦公的地方', '學生上課的地方'],
    answer: 2 },
  { id: 's10', category: '社會', type: 'choice',
    question: '下列哪項是台灣特有的民俗節慶？',
    options: ['聖誕節', '萬聖節', '媽祖遶境', '感恩節'],
    answer: 3 },

  // ── 自然 ────────────────────────────────────────────────
  { id: 'n01', category: '自然', type: 'choice',
    question: '下列哪種動物是「恆溫動物」？',
    options: ['青蛙', '蜥蜴', '麻雀', '魚'],
    answer: 3 },
  { id: 'n02', category: '自然', type: 'choice',
    question: '植物進行光合作用主要需要什麼？',
    options: ['只需要水', '水、陽光和空氣（二氧化碳）', '只需要土壤', '只需要陽光'],
    answer: 2 },
  { id: 'n03', category: '自然', type: 'choice',
    question: '颱風警報分哪兩種？',
    options: ['大颱風、小颱風', '海上颱風、陸上颱風', '紅色、黃色', '一級、二級'],
    answer: 2 },
  { id: 'n04', category: '自然', type: 'choice',
    question: '下列哪種動物是「變溫動物」？',
    options: ['狗', '蛇', '鳥', '貓'],
    answer: 2 },
  { id: 'n05', category: '自然', type: 'choice',
    question: '溫度計的測量原理是？',
    options: ['水的重量改變', '液體熱脹冷縮', '金屬顏色改變', '空氣流動'],
    answer: 2 },
  { id: 'n06', category: '自然', type: 'choice',
    question: '昆蟲的身體分成幾個部分？',
    options: ['二個', '三個', '四個', '五個'],
    answer: 2 },
  { id: 'n07', category: '自然', type: 'choice',
    question: '下列哪種行為最容易破壞生態環境？',
    options: ['觀察不採集', '垃圾分類回收', '大量砍伐樹木', '搭大眾運輸'],
    answer: 3 },
  { id: 'n08', category: '自然', type: 'choice',
    question: '魚用什麼器官呼吸？',
    options: ['肺', '皮膚', '鰓', '氣孔'],
    answer: 3 },
  { id: 'n09', category: '自然', type: 'choice',
    question: '下列哪種是「可再生能源」？',
    options: ['煤炭', '石油', '天然氣', '太陽能'],
    answer: 4 },
  { id: 'n10', category: '自然', type: 'choice',
    question: '蝴蝶的一生經過哪些階段？',
    options: ['卵→幼蟲→成蟲', '卵→蛹→成蟲', '卵→幼蟲→蛹→成蟲', '幼蟲→蛹→成蟲'],
    answer: 3 },

  // ── 國語 ────────────────────────────────────────────────
  { id: 'c01', category: '國語', type: 'choice',
    question: '「迫不及待」的意思是？',
    options: ['慢慢等待不著急', '急切地等不及', '很多人一起等', '等了很久終於等到'],
    answer: 2 },
  { id: 'c02', category: '國語', type: 'choice',
    question: '「廢寢忘食」形容什麼情形？',
    options: ['生病不想吃飯', '喜歡睡覺', '太專心而忘記睡覺和吃飯', '挑食不吃東西'],
    answer: 3 },
  { id: 'c03', category: '國語', type: 'choice',
    question: '下列哪個字的部首是「氵」（三點水）？',
    options: ['草', '林', '花', '清'],
    answer: 4 },
  { id: 'c04', category: '國語', type: 'choice',
    question: '「千里迢迢」的意思是？',
    options: ['很短的距離', '不知道多遠', '非常遙遠的路途', '整整一千里'],
    answer: 3 },
  { id: 'c05', category: '國語', type: 'choice',
    question: '「爭先恐後」形容什麼情形？',
    options: ['大家慢慢排隊', '你一個我一個輪流', '大家都怕排第一', '大家搶著排第一'],
    answer: 4 },
  { id: 'c06', category: '國語', type: 'choice',
    question: '下列哪組是「近義詞」（意思相近）？',
    options: ['高興—難過', '聰明—愚笨', '喜悅—快樂', '寬廣—狹窄'],
    answer: 3 },
  { id: 'c07', category: '國語', type: 'choice',
    question: '「三心二意」的意思是？',
    options: ['有三個願望', '心思不專一、猶豫', '非常認真專心', '心情很好'],
    answer: 2 },
  { id: 'c08', category: '國語', type: 'choice',
    question: '「如魚得水」比喻什麼？',
    options: ['魚回水中很快樂', '喜歡游泳', '找到最適合自己的環境', '水裡有很多魚'],
    answer: 3 },
  { id: 'c09', category: '國語', type: 'choice',
    question: '下列哪個成語形容「刻苦努力讀書」？',
    options: ['馬到成功', '鑿壁偷光', '一馬當先', '三心二意'],
    answer: 2 },
  { id: 'c10', category: '國語', type: 'choice',
    question: '「春眠不覺曉，處處聞啼鳥」描述哪個季節？',
    options: ['夏天', '秋天', '冬天', '春天'],
    answer: 4 },

  // ── 擴充題（2026-08-24 加，稀釋背題效果）────────────────────
  { id: 's11', category: '社會', type: 'choice',
    question: '地圖上的「比例尺」是用來做什麼的？',
    options: ['標示方向', '把圖上距離換算成實際距離', '標示海拔高低', '標示人口多少'], answer: 2 },
  { id: 's12', category: '社會', type: 'choice',
    question: '在地圖上，一般來說「上方」代表哪個方位？',
    options: ['東方', '南方', '北方', '西方'], answer: 3 },
  { id: 's13', category: '社會', type: 'choice',
    question: '下列哪一項屬於「公共規則」，大家都應該遵守？',
    options: ['自己家裡幾點睡覺', '在圖書館保持安靜', '喜歡吃什麼食物', '假日想去哪裡玩'], answer: 2 },
  { id: 's14', category: '社會', type: 'choice',
    question: '「古蹟」為什麼需要保存？',
    options: ['因為很值錢可以賣', '因為記錄了地方的歷史', '因為蓋新的比較貴', '因為法律規定不能拆'], answer: 2 },
  { id: 's15', category: '社會', type: 'choice',
    question: '家鄉的地名常常和什麼有關？',
    options: ['當地的地形或早期居民', '現任市長的名字', '隨機取的', '外國的城市'], answer: 1 },
  { id: 's16', category: '社會', type: 'choice',
    question: '下列哪一種是「再生」的資源使用方式？',
    options: ['寶特瓶回收做成衣服', '把垃圾丟到河裡', '一次性餐具用完就丟', '長時間開著冷氣'], answer: 1 },

  { id: 'n11', category: '自然', type: 'choice',
    question: '一天當中，什麼時候的竿影最短？',
    options: ['清晨', '正午', '傍晚', '半夜'], answer: 2 },
  { id: 'n12', category: '自然', type: 'choice',
    question: '水變成水蒸氣的現象叫做什麼？',
    options: ['凝結', '蒸發', '凝固', '融化'], answer: 2 },
  { id: 'n13', category: '自然', type: 'choice',
    question: '月亮從哪個方向升起？',
    options: ['西方', '北方', '東方', '南方'], answer: 3 },
  { id: 'n14', category: '自然', type: 'choice',
    question: '下列哪一種材料可以導電？',
    options: ['塑膠尺', '玻璃杯', '木頭筷子', '鐵釘'], answer: 4 },
  { id: 'n15', category: '自然', type: 'choice',
    question: '植物行光合作用會放出什麼氣體？',
    options: ['氧氣', '二氧化碳', '氮氣', '水蒸氣'], answer: 1 },
  { id: 'n16', category: '自然', type: 'choice',
    question: '磁鐵可以吸住下列哪一種東西？',
    options: ['鋁罐', '迴紋針', '橡皮擦', '紙張'], answer: 2 },

  { id: 'c11', category: '國語', type: 'choice',
    question: '「一舉兩得」的意思是？',
    options: ['做兩件事都失敗', '做一件事得到兩種好處', '一次舉起兩樣東西', '兩個人一起做一件事'], answer: 2 },
  { id: 'c12', category: '國語', type: 'choice',
    question: '下列哪個字的部首是「艹」（草字頭）？',
    options: ['清', '茶', '明', '林'], answer: 2 },
  { id: 'c13', category: '國語', type: 'choice',
    question: '「守株待兔」比喻什麼？',
    options: ['很有耐心地等待', '不肯努力只想僥倖', '認真照顧兔子', '守著自己的家'], answer: 2 },
  { id: 'c14', category: '國語', type: 'choice',
    question: '下列哪組是「反義詞」（意思相反）？',
    options: ['美麗—漂亮', '快樂—開心', '寬廣—狹窄', '聰明—伶俐'], answer: 3 },
  { id: 'c15', category: '國語', type: 'choice',
    question: '「絡繹不絕」形容什麼情形？',
    options: ['人來人往不間斷', '完全沒有人', '大家都很安靜', '東西賣完了'], answer: 1 },
  { id: 'c16', category: '國語', type: 'choice',
    question: '「胸有成竹」比喻什麼？',
    options: ['心裡種了竹子', '事前已有把握', '喜歡畫竹子', '個子長得很高'], answer: 2 },
]

// ── 反刷金幣：抽題時「現場長出來」──────────────────────────────
// ① 數學題呼叫 gen() 換一組新數字 ② 選擇題打亂選項順序並換算答案索引
// 全部在這裡處理完才送出，畫面端拿到的仍是原本的 { question, answer, options } 格式。
function materialize(q) {
  const base = q.gen ? { ...q, ...q.gen() } : q
  if (base.type !== 'choice') return base
  const correct = base.options[base.answer - 1]
  const options = [...base.options].sort(() => Math.random() - 0.5)
  return { ...base, options, answer: options.indexOf(correct) + 1 }
}

// 每次抽題：數學4題、社會2題、自然2題、國語2題，共10題
export function pickExamQuestions() {
  const pick = (cat, n) => {
    const pool = EXAM_QUESTIONS.filter(q => q.category === cat)
    return [...pool].sort(() => Math.random() - 0.5).slice(0, n)
  }
  return [
    ...pick('數學', 4),
    ...pick('社會', 2),
    ...pick('自然', 2),
    ...pick('國語', 2),
  ].sort(() => Math.random() - 0.5).map(materialize)
}

// ── 各科單獨挑戰 ──────────────────────────────────────────────
export const SUBJECT_CONFIGS = [
  { id: 'math',    category: '數學', emoji: '🔢', color: '#6C63FF',
    totalQuestions: 5, passScore: 3, timePerQuestion: 120,
    rewardItemId: 'crown_math',    streakNeeded: 5 },
  { id: 'social',  category: '社會', emoji: '🏙️',  color: '#0EA5E9',
    totalQuestions: 5, passScore: 3, timePerQuestion: 20,
    rewardItemId: 'crown_social',  streakNeeded: 2 },
  { id: 'nature',  category: '自然', emoji: '🌿', color: '#22C55E',
    totalQuestions: 5, passScore: 3, timePerQuestion: 20,
    rewardItemId: 'crown_nature',  streakNeeded: 2 },
  { id: 'chinese', category: '國語', emoji: '📖', color: '#EF4444',
    totalQuestions: 5, passScore: 3, timePerQuestion: 20,
    rewardItemId: 'crown_chinese', streakNeeded: 2 },
]

export function pickSubjectQuestions(category, n) {
  const pool = EXAM_QUESTIONS.filter(q => q.category === category)
  return [...pool].sort(() => Math.random() - 0.5).slice(0, n).map(materialize)
}

export function getSubjectQuestionIds(category) {
  return EXAM_QUESTIONS.filter(q => q.category === category).map(q => q.id)
}

export function getQuestionsByIds(ids) {
  return ids.map(id => EXAM_QUESTIONS.find(q => q.id === id)).filter(Boolean).map(materialize)
}
