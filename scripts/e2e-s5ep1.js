// E2E：S5 EP1《東京車站的大數看板》全流程（後續集數複製本檔改 ANSWERS/BRANCH/文案即可）
// 首頁 → 連載劇場 → 第五季 → EP1 → 8 現場（含分支）→ 指認摩摩 → 驗證紀念章+金幣
// 執行：先 `npm run dev`，再 `node scripts/e2e-s5ep1.js`
//（需 playwright-core：在任一目錄 `npm i playwright-core` 後複製本檔過去跑；
//  瀏覽器直接用 ms-playwright 快取的 chromium-1217，不必重新下載）
const { chromium } = require('playwright-core')

const EXE = process.env.USERPROFILE + '\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe'
const URL = 'http://localhost:5173/anan-game/'
// 各現場答案（現場4=分支，兩邊都驗：左儲物櫃75 / 右電子鐘7500）
const ANSWERS = [1600, 6, 6, null, 4000, 7350, 100, 8530]
const BRANCH = { pick: 0, answer: 75 } // 走左邊儲物櫃

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

  await page.goto(URL)
  await page.waitForSelector('.home-buttons')

  // 若有登入禮物彈窗先收下
  const gift = page.locator('.btn-secondary', { hasText: '收下' })
  if (await gift.count()) await gift.click()

  const coinsBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state.coins)

  // 進入連載劇場 → 第五季
  await clickText(page, '.btn-hero-series', '連載劇場')
  await page.waitForSelector('.srs-season-list')
  const s5card = page.locator('.srs-season-card', { hasText: '第 5 季' })
  if (!(await s5card.count())) fail('季選單沒有第五季')
  if (!(await s5card.innerText()).includes('環遊世界大冒險')) fail('第五季標題不對')
  await s5card.click()

  // 收集牆：12 格護照
  await page.waitForSelector('.srs-wall')
  const slots = await page.locator('.srs-shard').count()
  if (slots !== 12) fail(`護照格數應為 12，實際 ${slots}`)

  // 開 EP1
  await clickText(page, '.srs-ep-card', '第 1 集')
  await page.waitForSelector('text=開始查案')
  const introText = await page.locator('.dtv-panel', { hasText: '開始查案' }).innerText()
  if (!introText.includes('環遊世界護照')) fail('EP1 開場沒帶出季開場白')
  await clickText(page, '.dtv-btn', '開始查案')

  // 8 個現場
  for (let i = 0; i < 8; i++) {
    await page.waitForSelector(`text=現場 Scene ${i + 1} / 8`)
    let ans = ANSWERS[i]
    if (ans === null) { // 分支現場：選一條路再作答
      await page.waitForSelector('.srs-choice-btn')
      await page.locator('.srs-choice-btn').nth(BRANCH.pick).click()
      ans = BRANCH.answer
    }
    await page.waitForSelector('.dtv-numpad-dock')
    await typeAnswer(page, ans)
    await page.waitForSelector('.dtv-reward', { timeout: 4000 }).catch(() => fail(`現場${i + 1} 答案 ${ans} 沒有過關`))
    await page.locator('.dtv-btn').click() // 下一個現場 / 指認
  }

  // 指認：先驗證據板有 8 條筆記，錯指認→提示，再指認摩摩
  await page.waitForSelector('.dtv-suspects')
  const notes = await page.locator('.srs-case-notes .srs-tutor-step').count()
  if (notes !== 8) fail(`證據板應有 8 條，實際 ${notes}`)
  await clickText(page, '.dtv-suspect', '丸丸') // 故意指錯
  await page.waitForSelector('.dtv-hint')
  await clickText(page, '.dtv-suspect', '摩摩')

  // 破案畫面：紀念章＋感謝卡
  await page.waitForSelector('.srs-got-shard')
  const got = await page.locator('.srs-got-shard').innerText()
  if (!got.includes('東京章')) fail('沒拿到東京章：' + got)

  // store 驗證：seriesStamps / seriesSolved / 金幣 +500
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('anan-game-v2')).state)
  if (!st.seriesStamps?.includes('tokyo')) fail('seriesStamps 沒收到 tokyo：' + JSON.stringify(st.seriesStamps))
  if (!st.seriesSolved?.s5ep1) fail('seriesSolved.s5ep1 沒標記')
  if (st.coins !== coinsBefore + 500) fail(`金幣應 +500（${coinsBefore}→${coinsBefore + 500}），實際 ${st.coins}`)

  // 回到集數列表：收集牆亮 1 枚＋感謝卡線索出現
  await page.locator('.dtv-btn', { hasText: '回' }).first().click().catch(() => page.locator('.dtv-back').click())
  await page.waitForSelector('.srs-wall')
  const wall = await page.locator('.srs-wall').first().innerText()
  if (!wall.includes('1/12')) fail('收集牆應顯示 1/12：' + wall)
  const clue = await page.locator('.srs-wall').nth(1).innerText().catch(() => '')
  if (!clue.includes('感謝卡')) fail('感謝卡線索牆沒出現')

  console.log(process.exitCode ? 'E2E 有失敗項目' : '✅ E2E 全部通過：S5 EP1 流程＋東京章＋金幣＋感謝卡線索都正常')
  await browser.close()
})().catch((e) => { console.error('❌ E2E 例外：', e.message); process.exit(1) })
