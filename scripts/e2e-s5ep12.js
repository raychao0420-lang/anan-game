// E2E：S5 EP12《回家的最後一站·世界同學會》終章全流程（十單元混合＋大結局）
// 預埋 EP1~11 已破存檔解鎖 EP12 → 8 現場（含分支）→ 先錯指巡巡→指認飛飛 →
// 驗證台灣章+金幣2000+新寵物飛飛+信物第481張感謝卡+護照 12/12
// 執行：先 `npm run dev`，複製本檔到裝有 playwright-core 的目錄跑 `node e2e-s5ep12.js`
const { chromium } = require('playwright-core')
const fs = require('fs')

// 自動偵測本機 ms-playwright 的 chromium 版本（換機器也能跑）
const PW_DIR = process.env.USERPROFILE + '\\AppData\\Local\\ms-playwright'
const CHROMIUM = fs.readdirSync(PW_DIR).find((d) => /^chromium-\d+$/.test(d))
const EXE = `${PW_DIR}\\${CHROMIUM}\\chrome-win64\\chrome.exe`
const URL = 'http://localhost:5173/anan-game/'
const ANSWERS = [3, 680, 95, null, 175, 53, 15, 480]
const BRANCH = { pick: 0, answer: 180 } // 左：三角旗內角和 180（右：大鐘平角 180 同答案）

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

  // 預埋：EP1~11 已破＋11枚紀念章已收（zustand persist 淺合併，其餘用預設值）
  await page.addInitScript(() => {
    localStorage.setItem('anan-game-v2', JSON.stringify({
      state: { seriesSolved: { s5ep1: true, s5ep2: true, s5ep3: true, s5ep4: true, s5ep5: true, s5ep6: true, s5ep7: true, s5ep8: true, s5ep9: true, s5ep10: true, s5ep11: true }, seriesStamps: ['tokyo', 'india', 'egypt', 'italy', 'kenya', 'voyage', 'belgium', 'france', 'swiss', 'usa', 'brazil'] }, version: 0,
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

  // EP12 應已解鎖（EP1~11 預埋已破）
  await page.waitForSelector('.srs-ep-list')
  const ep12 = page.locator('.srs-ep-card', { hasText: '第 12 集' })
  if ((await ep12.innerText()).includes('🔒')) fail('EP12 應解鎖卻是鎖住的')
  await ep12.click()

  await page.waitForSelector('text=開始查案')
  const introText = await page.locator('.dtv-panel', { hasText: '開始查案' }).innerText()
  if (!introText.includes('委託電報第 12 號')) fail('EP12 開場沒有巡巡電報')
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

  // 終章指認：證據板 8 條 → 故意指錯（巡巡）→ 指認神祕郵差飛飛
  await page.waitForSelector('.dtv-suspects')
  const notes = await page.locator('.srs-case-notes .srs-tutor-step').count()
  if (notes !== 8) fail(`證據板應有 8 條，實際 ${notes}`)
  await clickText(page, '.dtv-suspect', '巡巡')
  await page.waitForSelector('.dtv-hint')
  await clickText(page, '.dtv-suspect', '飛飛')

  // 台灣章＋新寵物飛飛＋信物第 481 張感謝卡
  await page.waitForSelector('.srs-got-shard')
  const got = await page.locator('.srs-got-shard').innerText()
  if (!got.includes('台灣章')) fail('沒拿到台灣章：' + got)
  const petCard = await page.locator('.dtv-newpet-name').first().innerText().catch(() => '')
  if (!petCard.includes('飛飛')) fail('破案畫面沒出現新寵物飛飛：' + petCard)

  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state)
  if (!st.seriesStamps?.includes('taiwan')) fail('seriesStamps 沒收到 taiwan：' + JSON.stringify(st.seriesStamps))
  if (!st.seriesSolved?.s5ep12) fail('seriesSolved.s5ep12 沒標記')
  if (st.coins !== coinsBefore + 2000) fail(`金幣應 +2000（${coinsBefore}→${coinsBefore + 2000}），實際 ${st.coins}`)
  if (!st.pets?.feifei?.unlocked) fail('pets.feifei 沒解鎖')
  if (!st.ownedItems?.includes('thanks_card_481')) fail('ownedItems 沒有 thanks_card_481：' + JSON.stringify(st.ownedItems))

  // 回列表：護照 12/12 蓋滿＋感謝卡線索含 EP12
  await page.locator('.dtv-btn', { hasText: '回' }).first().click().catch(() => page.locator('.dtv-back').click())
  await page.waitForSelector('.srs-wall')
  const wall = await page.locator('.srs-wall').first().innerText()
  if (!wall.includes('12/12')) fail('護照應顯示 12/12：' + wall)
  const clue = await page.locator('.srs-wall').nth(1).innerText().catch(() => '')
  if (!clue.includes('EP12')) fail('感謝卡線索牆沒有 EP12')

  console.log(process.exitCode ? 'E2E 有失敗項目' : '✅ E2E 全部通過：S5 EP12 終章流程＋台灣章＋2000金幣＋飛飛＋第481張感謝卡都正常')
  await browser.close()
})().catch((e) => { console.error('❌ E2E 例外：', e.message); process.exit(1) })
