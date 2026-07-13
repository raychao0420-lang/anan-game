// E2E：S5 EP6《郵輪上的環球小案簿》全流程（喘息集：真相=海豚樂隊借躺椅開音樂會）
// 預埋 EP1~5 已破存檔解鎖 EP6 → 8 現場（含分支）→ 先錯指阿波→指認海豚樂隊 → 驗證航海章+金幣
// 執行：先 `npm run dev`，複製本檔到裝有 playwright-core 的目錄跑 `node e2e-s5ep6.js`
const { chromium } = require('playwright-core')

const EXE = process.env.USERPROFILE + '\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe'
const URL = 'http://localhost:5173/anan-game/'
const ANSWERS = [96, 84, 7, null, 135, 3200, 5, 6]
const BRANCH = { pick: 0, answer: 15 } // 左：救生圈 3×5=15（右：信號旗 45÷3=15 同答案）

async function clickText(page, selector, text) {
  await page.locator(selector, { hasText: text }).first().click()
}

async function typeAnswer(page, num) {
  for (const d of String(num)) {
    await page.locator('.numpad-btn', { hasText: new RegExp(`^${d === '.' ? '\\.' : d}$`) }).first().dispatchEvent('pointerdown')
  }
  await page.locator('.numpad-confirm').dispatchEvent('pointerdown')
}

;(async () => {
  const browser = await chromium.launch({ executablePath: EXE })
  const page = await browser.newPage({ viewport: { width: 820, height: 1180 } })
  page.setDefaultTimeout(8000)
  const fail = (msg) => { console.error('❌ ' + msg); process.exitCode = 1 }

  // 預埋：EP1~5 已破＋5枚紀念章已收（zustand persist 淺合併，其餘用預設值）
  await page.addInitScript(() => {
    localStorage.setItem('anan-game-v2', JSON.stringify({
      state: { seriesSolved: { s5ep1: true, s5ep2: true, s5ep3: true, s5ep4: true, s5ep5: true }, seriesStamps: ['tokyo', 'india', 'egypt', 'italy', 'kenya'] }, version: 0,
    }))
  })

  await page.goto(URL)
  await page.waitForSelector('.home-buttons')
  const gift = page.locator('.btn-secondary', { hasText: '收下' })
  if (await gift.count()) await gift.click()

  const coinsBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state.coins)

  await clickText(page, '.btn-hero-series', '連載劇場')
  await page.waitForSelector('.srs-season-list')
  await clickText(page, '.srs-season-card', '第 5 季')

  // EP6 應已解鎖（EP1~5 預埋已破）
  await page.waitForSelector('.srs-ep-list')
  const ep6 = page.locator('.srs-ep-card', { hasText: '第 6 集' })
  if ((await ep6.innerText()).includes('🔒')) fail('EP6 應解鎖卻是鎖住的')
  await ep6.click()

  // 喘息集開場是船長歡迎（沒有巡巡電報），改驗成果展
  await page.waitForSelector('text=開始查案')
  const introText = await page.locator('.dtv-panel', { hasText: '開始查案' }).innerText()
  if (!introText.includes('成果展')) fail('EP6 開場沒有成果展開場白')
  await clickText(page, '.dtv-btn', '開始查案')

  for (let i = 0; i < 8; i++) {
    await page.waitForSelector(`text=現場 Scene ${i + 1} / 8`)
    let ans = ANSWERS[i]
    if (ans === null) {
      await page.waitForSelector('.srs-choice-btn')
      await page.locator('.srs-choice-btn').nth(BRANCH.pick).click()
      ans = BRANCH.answer
    }
    await page.waitForSelector('.dtv-numpad-dock')
    await typeAnswer(page, ans)
    await page.waitForSelector('.dtv-reward', { timeout: 4000 }).catch(() => fail(`現場${i + 1} 答案 ${ans} 沒有過關`))
    await page.locator('.dtv-btn').click()
  }

  // 指認（喘息集：找出躺椅去哪了）：證據板 8 條 → 故意指錯（阿波）→ 指認海豚樂隊
  await page.waitForSelector('.dtv-suspects')
  const notes = await page.locator('.srs-case-notes .srs-tutor-step').count()
  if (notes !== 8) fail(`證據板應有 8 條，實際 ${notes}`)
  await clickText(page, '.dtv-suspect', '阿波')
  await page.waitForSelector('.dtv-hint')
  await clickText(page, '.dtv-suspect', '海豚')

  await page.waitForSelector('.srs-got-shard')
  const got = await page.locator('.srs-got-shard').innerText()
  if (!got.includes('航海章')) fail('沒拿到航海章：' + got)

  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state)
  if (!st.seriesStamps?.includes('voyage')) fail('seriesStamps 沒收到 voyage：' + JSON.stringify(st.seriesStamps))
  if (!st.seriesSolved?.s5ep6) fail('seriesSolved.s5ep6 沒標記')
  if (st.coins !== coinsBefore + 640) fail(`金幣應 +640（${coinsBefore}→${coinsBefore + 640}），實際 ${st.coins}`)

  // 回列表：護照 6/12＋感謝卡線索含 EP6
  await page.locator('.dtv-btn', { hasText: '回' }).first().click().catch(() => page.locator('.dtv-back').click())
  await page.waitForSelector('.srs-wall')
  const wall = await page.locator('.srs-wall').first().innerText()
  if (!wall.includes('6/12')) fail('護照應顯示 6/12：' + wall)
  const clue = await page.locator('.srs-wall').nth(1).innerText().catch(() => '')
  if (!clue.includes('EP6')) fail('感謝卡線索牆沒有 EP6')

  console.log(process.exitCode ? 'E2E 有失敗項目' : '✅ E2E 全部通過：S5 EP6 流程＋航海章＋金幣＋感謝卡線索都正常')
  await browser.close()
})().catch((e) => { console.error('❌ E2E 例外：', e.message); process.exit(1) })
