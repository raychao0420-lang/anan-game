// E2E：S5 EP8《鐵塔的三角形密碼》全流程（新單元三角形，從零教）
// 預埋 EP1~7 已破存檔解鎖 EP8 → 8 現場（含分支）→ 先錯指巴斯特→指認咕嚕 → 驗證法國章+金幣
// 執行：先 `npm run dev`，複製本檔到裝有 playwright-core 的目錄跑 `node e2e-s5ep8.js`
const { chromium } = require('playwright-core')

const EXE = process.env.USERPROFILE + '\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe'
const URL = 'http://localhost:5173/anan-game/'
const ANSWERS = [3, 36, 24, null, 55, 180, 70, 16]
const BRANCH = { pick: 0, answer: 60 } // 左：正三角形三角一樣大（右：180÷3 同答案 60）

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

  // 預埋：EP1~7 已破＋7枚紀念章已收（zustand persist 淺合併，其餘用預設值）
  await page.addInitScript(() => {
    localStorage.setItem('anan-game-v2', JSON.stringify({
      state: { seriesSolved: { s5ep1: true, s5ep2: true, s5ep3: true, s5ep4: true, s5ep5: true, s5ep6: true, s5ep7: true }, seriesStamps: ['tokyo', 'india', 'egypt', 'italy', 'kenya', 'voyage', 'belgium'] }, version: 0,
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

  // EP8 應已解鎖（EP1~7 預埋已破）
  await page.waitForSelector('.srs-ep-list')
  const ep8 = page.locator('.srs-ep-card', { hasText: '第 8 集' })
  if ((await ep8.innerText()).includes('🔒')) fail('EP8 應解鎖卻是鎖住的')
  await ep8.click()

  await page.waitForSelector('text=開始查案')
  const introText = await page.locator('.dtv-panel', { hasText: '開始查案' }).innerText()
  if (!introText.includes('委託電報第 8 號')) fail('EP8 開場沒有巡巡電報')
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

  // 指認：證據板 8 條 → 故意指錯（巴斯特）→ 指認咕嚕
  await page.waitForSelector('.dtv-suspects')
  const notes = await page.locator('.srs-case-notes .srs-tutor-step').count()
  if (notes !== 8) fail(`證據板應有 8 條，實際 ${notes}`)
  await clickText(page, '.dtv-suspect', '巴斯特')
  await page.waitForSelector('.dtv-hint')
  await clickText(page, '.dtv-suspect', '咕嚕')

  await page.waitForSelector('.srs-got-shard')
  const got = await page.locator('.srs-got-shard').innerText()
  if (!got.includes('法國章')) fail('沒拿到法國章：' + got)

  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state)
  if (!st.seriesStamps?.includes('france')) fail('seriesStamps 沒收到 france：' + JSON.stringify(st.seriesStamps))
  if (!st.seriesSolved?.s5ep8) fail('seriesSolved.s5ep8 沒標記')
  if (st.coins !== coinsBefore + 740) fail(`金幣應 +740（${coinsBefore}→${coinsBefore + 740}），實際 ${st.coins}`)

  // 回列表：護照 8/12＋感謝卡線索含 EP8
  await page.locator('.dtv-btn', { hasText: '回' }).first().click().catch(() => page.locator('.dtv-back').click())
  await page.waitForSelector('.srs-wall')
  const wall = await page.locator('.srs-wall').first().innerText()
  if (!wall.includes('8/12')) fail('護照應顯示 8/12：' + wall)
  const clue = await page.locator('.srs-wall').nth(1).innerText().catch(() => '')
  if (!clue.includes('EP8')) fail('感謝卡線索牆沒有 EP8')

  console.log(process.exitCode ? 'E2E 有失敗項目' : '✅ E2E 全部通過：S5 EP8 流程＋法國章＋金幣＋感謝卡線索都正常')
  await browser.close()
})().catch((e) => { console.error('❌ E2E 例外：', e.message); process.exit(1) })
