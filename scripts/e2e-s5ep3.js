// E2E：S5 EP3《金字塔的角度之謎》全流程
// 預埋 EP1+EP2 已破存檔解鎖 EP3 → 8 現場（含分支）→ 指認沙沙 → 驗證埃及章+金幣
// 執行：先 `npm run dev`，複製本檔到裝有 playwright-core 的目錄跑 `node e2e-s5ep3.js`
const { chromium } = require('playwright-core')

const EXE = process.env.USERPROFILE + '\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe'
const URL = 'http://localhost:5173/anan-game/'
const ANSWERS = [90, 52, 30, null, 360, 115, 120, 180]
const BRANCH = { pick: 0, answer: 45 } // 左：日晷影子轉 45（右：扇形門開 45 同答案）

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

  // 預埋：EP1+EP2 已破＋東京章/印度章已收（zustand persist 淺合併，其餘用預設值）
  await page.addInitScript(() => {
    localStorage.setItem('anan-game-v2', JSON.stringify({
      state: { seriesSolved: { s5ep1: true, s5ep2: true }, seriesStamps: ['tokyo', 'india'] }, version: 0,
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

  // EP3 應已解鎖（EP1+EP2 預埋已破）
  await page.waitForSelector('.srs-ep-list')
  const ep3 = page.locator('.srs-ep-card', { hasText: '第 3 集' })
  if ((await ep3.innerText()).includes('🔒')) fail('EP3 應解鎖卻是鎖住的')
  await ep3.click()

  await page.waitForSelector('text=開始查案')
  const introText = await page.locator('.dtv-panel', { hasText: '開始查案' }).innerText()
  if (!introText.includes('委託電報第 3 號')) fail('EP3 開場沒有巡巡電報')
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

  // 指認：證據板 8 條 → 故意指錯（甲甲）→ 指認沙沙
  await page.waitForSelector('.dtv-suspects')
  const notes = await page.locator('.srs-case-notes .srs-tutor-step').count()
  if (notes !== 8) fail(`證據板應有 8 條，實際 ${notes}`)
  await clickText(page, '.dtv-suspect', '甲甲')
  await page.waitForSelector('.dtv-hint')
  await clickText(page, '.dtv-suspect', '沙沙')

  await page.waitForSelector('.srs-got-shard')
  const got = await page.locator('.srs-got-shard').innerText()
  if (!got.includes('埃及章')) fail('沒拿到埃及章：' + got)

  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state)
  if (!st.seriesStamps?.includes('egypt')) fail('seriesStamps 沒收到 egypt：' + JSON.stringify(st.seriesStamps))
  if (!st.seriesSolved?.s5ep3) fail('seriesSolved.s5ep3 沒標記')
  if (st.coins !== coinsBefore + 580) fail(`金幣應 +580（${coinsBefore}→${coinsBefore + 580}），實際 ${st.coins}`)

  // 回列表：護照 3/12＋感謝卡線索含 EP3
  await page.locator('.dtv-btn', { hasText: '回' }).first().click().catch(() => page.locator('.dtv-back').click())
  await page.waitForSelector('.srs-wall')
  const wall = await page.locator('.srs-wall').first().innerText()
  if (!wall.includes('3/12')) fail('護照應顯示 3/12：' + wall)
  const clue = await page.locator('.srs-wall').nth(1).innerText().catch(() => '')
  if (!clue.includes('EP3')) fail('感謝卡線索牆沒有 EP3')

  console.log(process.exitCode ? 'E2E 有失敗項目' : '✅ E2E 全部通過：S5 EP3 流程＋埃及章＋金幣＋感謝卡線索都正常')
  await browser.close()
})().catch((e) => { console.error('❌ E2E 例外：', e.message); process.exit(1) })
