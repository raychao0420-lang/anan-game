// 連載劇「偵探教學」集中檔：S1 全 12 集＋S2 EP1 的分步驟 teach。
// （S2 EP2 起的 teach 直接寫在 series2.js 各集內。）
// 由 seasons.js 於載入時合併進各 scene.puzzle.teach，供兩處使用：
//   1. 求救家教（寵物老師分步驟教方法，不給答案）
//   2. 答對後的「偵探筆記」解說（同步驟＋自動加上最終答案）
// 每題 3 步：①看懂題目/教概念 ②列式＋計算小技巧 ③帶到最後一步讓孩子自己算。
// 小三複習題也要教「方法」：九九口訣、湊十法、先加整十、借位訣竅、找錢、倍、兩步驟先算全部。

export const SERIES_TEACH = {
  // ── S1 EP1 午夜鐘樓 ── 答案 20/5/48/15/28/43/24/23
  ep1: [
    [
      { zh: '每一面牆的窗戶都「一樣多」——一樣多的東西重複好幾次，用乘法算最快！', en: 'Every wall has the same number of windows — when equal groups repeat, multiplication is fastest!' },
      { zh: '4 面牆、每面 5 扇窗，算式就是 4 × 5。', en: '4 walls with 5 windows each — the equation is 4 × 5.' },
      { zh: '唸唸看九九乘法：「四五」是多少……換你算出一共幾扇窗！', en: 'Say the times table: four fives make… you find the total windows!' },
    ],
    [
      { zh: '「還沒走到的」＝從全部裡面拿掉走過的，拿掉就用減法。', en: '“Not yet reached” means taking the passed ones away from the total — that’s subtraction.' },
      { zh: '全部 12 個數字，走過了 7 個：12 − 7。', en: '12 numbers in all, 7 passed: 12 − 7.' },
      { zh: '小訣竅：算完用加法檢查，答案加 7 要變回 12 喔……換你算！', en: 'Tip: check with addition — your answer plus 7 should make 12… now solve it!' },
    ],
    [
      { zh: '每一層的樓梯都一樣是 8 階，一層一層一樣多，用乘法。', en: 'Every floor has the same 8 steps — equal groups, so multiply.' },
      { zh: '6 層 × 每層 8 階：6 × 8。', en: '6 floors × 8 steps each: 6 × 8.' },
      { zh: '口訣「六八」是多少……換你算出一共幾階！', en: 'Times table: six eights make… you find the total steps!' },
    ],
    [
      { zh: '新知識：1 小時＝60 分鐘！所以「9 點整」就是分針走到 60 分的地方。', en: 'New fact: 1 hour = 60 minutes! So “9 o’clock sharp” is when the minute hand reaches 60.' },
      { zh: '現在走到 45 分，離 60 分還差：60 − 45。', en: 'It’s at 45 minutes now; the gap to 60 is: 60 − 45.' },
      { zh: '60 − 45……換你算出還差幾分鐘！', en: '60 − 45… you find how many minutes are left!' },
    ],
    [
      { zh: '齒輪一排一排、每排一樣多——這正是乘法的形狀！', en: 'Gears in rows, each row equal — that’s exactly the shape of multiplication!' },
      { zh: '7 排 × 每排 4 個：7 × 4。', en: '7 rows × 4 gears each: 7 × 4.' },
      { zh: '口訣「四七」是多少……換你算出一共幾個齒輪！', en: 'Times table: four sevens make… you find the total gears!' },
    ],
    [
      { zh: '「又找到」＝把兩堆合起來，合起來用加法。', en: '“Found more” means joining two piles — joining is addition.' },
      { zh: '加法小技巧：26 先加 10 變 36，再加剩下的 7，比較不容易錯。', en: 'Addition trick: 26 + 10 = 36 first, then add the leftover 7 — fewer mistakes!' },
      { zh: '36 再加 7……換你算出一共幾個零件！', en: '36 plus 7… you find the total parts!' },
    ],
    [
      { zh: '每個整點都敲「一樣多」的 8 下，次數一樣多，用乘法。', en: 'Each hour strikes the same 8 chimes — equal counts, so multiply.' },
      { zh: '3 個整點 × 每次 8 下：3 × 8。', en: '3 hours × 8 chimes each: 3 × 8.' },
      { zh: '口訣「三八」是多少……換你算出一共敲幾下！', en: 'Times table: three eights make… you find the total chimes!' },
    ],
    [
      { zh: '星星「又亮了」幾顆＝合起來，用加法。', en: 'More stars “lit up” — join them together with addition.' },
      { zh: '湊十法：9 只差 1 就滿 10！從 14 借 1 給 9，變成 13 + 10。', en: 'Make-ten trick: 9 needs just 1 to reach 10! Borrow 1 from 14 — it becomes 13 + 10.' },
      { zh: '13 + 10……換你算出天上現在幾顆星！', en: '13 + 10… you find how many stars shine now!' },
    ],
  ],

  // ── S1 EP2 黃昏市集 ── 答案 32/15/30/60/6/12/35/22
  ep2: [
    [
      { zh: '攤子一排一排、每排一樣多，一樣多的分組用乘法最快。', en: 'Stalls in rows, each row equal — equal groups call for multiplication.' },
      { zh: '8 排 × 每排 4 個攤位：8 × 4。', en: '8 rows × 4 stalls each: 8 × 4.' },
      { zh: '口訣「四八」是多少……換你算出一共幾個攤位！', en: 'Times table: four eights make… you find the total stalls!' },
    ],
    [
      { zh: '新知識：買東西的「找錢」＝付的錢 − 商品的價錢。', en: 'New fact: “change” when shopping = money paid − the price.' },
      { zh: '付了 50 元、蘋果 35 元：50 − 35。技巧：先減 30 到 20，再減 5。', en: 'Paid 50, apples cost 35: 50 − 35. Trick: subtract 30 first (→20), then 5.' },
      { zh: '20 再減 5……換你算出要找回多少錢！', en: '20 minus 5… you find the change!' },
    ],
    [
      { zh: '新知識：總價＝數量 × 單價！幾支糖葫蘆乘上一支的價錢。', en: 'New fact: total price = amount × unit price! Sticks times the price of one.' },
      { zh: '6 支 × 每支 5 元：6 × 5。', en: '6 sticks × 5 dollars each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出一共要多少錢！', en: 'Times table: five sixes make… you find the total cost!' },
    ],
    [
      { zh: '賣出的和新烤的「合起來」才是今天全部做的，用加法。', en: 'Sold plus freshly baked together make today’s total — addition.' },
      { zh: '好運技巧：看個位！2 + 8 剛好湊成 10，所以 42 + 18 會是整整齊齊的整十數。', en: 'Lucky trick: check the ones — 2 + 8 makes exactly 10, so 42 + 18 lands on a neat ten!' },
      { zh: '42 + 18……換你算出今天一共做了幾個麵包！', en: '42 + 18… you find today’s total bread!' },
    ],
    [
      { zh: '「平分」就是每份一樣多——平分的題目用除法。', en: '“Sharing equally” means every share the same — that’s division.' },
      { zh: '24 朵花平分成 4 束：24 ÷ 4。', en: '24 flowers into 4 equal bunches: 24 ÷ 4.' },
      { zh: '用口訣反推：「四幾二十四」……換你算出每束幾朵！', en: 'Reverse the times table: four times what makes 24… you find each bunch!' },
    ],
    [
      { zh: '又是找錢！找回的錢＝付的錢 − 陀螺的價錢。', en: 'Change again! Change = paid − the top’s price.' },
      { zh: '40 − 28 有技巧：先減 20 變 20，再減 8。', en: '40 − 28 with a trick: subtract 20 first (→20), then 8.' },
      { zh: '20 再減 8……換你算出要找回多少錢！', en: '20 minus 8… you find the change!' },
    ],
    [
      { zh: '燈籠一排一排、每排一樣多，用乘法。', en: 'Lanterns in equal rows — multiply.' },
      { zh: '5 排 × 每排 7 個：5 × 7。', en: '5 rows × 7 lanterns each: 5 × 7.' },
      { zh: '口訣「五七」是多少……換你算出一共幾個燈籠！', en: 'Times table: five sevens make… you find the total lanterns!' },
    ],
    [
      { zh: '「又放上」＝合起來，用加法。', en: '“Added more” means joining — addition.' },
      { zh: '湊十法：9 差 1 就滿 10，從 13 借 1 給 9，變成 12 + 10。', en: 'Make-ten: 9 needs 1 to reach 10 — borrow 1 from 13, making 12 + 10.' },
      { zh: '12 + 10……換你算出現在一共幾顆橘子！', en: '12 + 10… you find the total oranges!' },
    ],
  ],

  // ── S1 EP3 母校教室 ── 答案 20/45/6/27/33/28/7/38
  ep3: [
    [
      { zh: '每個年級的班級數都一樣多，一樣多的分組用乘法。', en: 'Every grade has the same number of classes — equal groups, multiply.' },
      { zh: '5 個年級 × 每個 4 班：5 × 4。', en: '5 grades × 4 classes each: 5 × 4.' },
      { zh: '口訣「四五」是多少……換你算出全校幾個班！', en: 'Times table: four fives make… you find the school’s classes!' },
    ],
    [
      { zh: '上學期的加這學期的，「合起來」用加法。', en: 'Last term’s plus this term’s — join with addition.' },
      { zh: '技巧：28 先加 10 變 38，再加剩下的 7。', en: 'Trick: 28 + 10 = 38 first, then the leftover 7.' },
      { zh: '38 再加 7……換你算出一共幾張榮譽卡！', en: '38 plus 7… you find the total merit cards!' },
    ],
    [
      { zh: '「平分」給每一組＝每組一樣多，用除法。', en: 'Sharing equally among groups means division.' },
      { zh: '24 支直笛平分成 4 組：24 ÷ 4。', en: '24 recorders into 4 groups: 24 ÷ 4.' },
      { zh: '口訣反推「四幾二十四」……換你算出每組幾支！', en: 'Reverse: four times what makes 24… you find each group’s share!' },
    ],
    [
      { zh: '請假的人「不在」，從全班拿掉，用減法。', en: 'Absent kids are taken away from the class — subtraction.' },
      { zh: '借位訣竅：32 − 5，先減 2 到整十的 30，再減剩下的 3。', en: 'Borrowing trick: 32 − 5 — subtract 2 to reach 30, then the leftover 3.' },
      { zh: '30 再減 3……換你算出今天來上學幾人！', en: '30 minus 3… you find today’s attendance!' },
    ],
    [
      { zh: '這題有兩步！新知識：先算「原本全部」，再處理變化。', en: 'Two steps! New skill: find the original total first, then handle the change.' },
      { zh: '第一步：5 組 × 每組 6 人 ＝ 30 人。第二步：加上 3 個轉學生。', en: 'Step 1: 5 groups × 6 = 30 kids. Step 2: add the 3 transfer students.' },
      { zh: '30 + 3……換你算出現在一共幾人！', en: '30 + 3… you find the new total!' },
    ],
    [
      { zh: '兩步驟：先算全部的彩球，再減掉用掉的。', en: 'Two steps: total balls first, then subtract the used ones.' },
      { zh: '第一步：5 箱 × 每箱 8 顆 ＝ 40 顆。第二步：40 − 12。', en: 'Step 1: 5 boxes × 8 = 40 balls. Step 2: 40 − 12.' },
      { zh: '40 − 12……換你算出還剩幾顆！', en: '40 − 12… you find what remains!' },
    ],
    [
      { zh: '「平分」給小朋友，用除法。', en: 'Sharing equally among kids — division.' },
      { zh: '35 張貼紙平分給 5 人：35 ÷ 5。', en: '35 stickers among 5 kids: 35 ÷ 5.' },
      { zh: '口訣反推「五幾三十五」……換你算出每人幾張！', en: 'Reverse: five times what makes 35… you find each child’s share!' },
    ],
    [
      { zh: '兩步驟：先算排好的星星，再加老師新貼的。', en: 'Two steps: the arranged stars first, then add the teacher’s new ones.' },
      { zh: '第一步：6 排 × 每排 5 顆 ＝ 30 顆。第二步：30 + 8。', en: 'Step 1: 6 rows × 5 = 30 stars. Step 2: 30 + 8.' },
      { zh: '30 + 8……換你算出一共幾顆星星！', en: '30 + 8… you find the total stars!' },
    ],
  ],

  // ── S1 EP4 雨夜追蹤 ── 答案 20/18/17/24/9/18/19/30
  ep4: [
    [
      { zh: '雨傘一排一排、每排一樣多，用乘法。', en: 'Umbrellas in equal rows — multiply.' },
      { zh: '5 排 × 每排 4 把：5 × 4。', en: '5 rows × 4 umbrellas each: 5 × 4.' },
      { zh: '口訣「四五」是多少……換你算出一共幾把傘！', en: 'Times table: four fives make… you find the total umbrellas!' },
    ],
    [
      { zh: '「沒積水的」＝全部拿掉積水的，用減法。', en: '“Dry slabs” = all slabs minus the wet ones — subtraction.' },
      { zh: '技巧：32 − 14，先減 10 變 22，再減剩下的 4。', en: 'Trick: 32 − 14 — subtract 10 first (→22), then the leftover 4.' },
      { zh: '22 再減 4……換你算出沒積水的石板幾塊！', en: '22 minus 4… you find the dry slabs!' },
    ],
    [
      { zh: '兩步驟：先算全部的路燈，再減掉壞掉的。', en: 'Two steps: total lamps first, then subtract the broken.' },
      { zh: '第一步：4 排 × 每排 5 盞 ＝ 20 盞。第二步：20 − 3。', en: 'Step 1: 4 rows × 5 = 20 lamps. Step 2: 20 − 3.' },
      { zh: '20 − 3……換你算出還有幾盞亮著！', en: '20 − 3… you find how many still shine!' },
    ],
    [
      { zh: '「又跑來」＝合起來，用加法。', en: 'More came running — join with addition.' },
      { zh: '湊十法：9 差 1 就滿 10，從 15 借 1，變成 14 + 10。', en: 'Make-ten: borrow 1 from 15 to fill 9 up to 10 — it becomes 14 + 10.' },
      { zh: '14 + 10……換你算出現在一共幾隻小動物！', en: '14 + 10… you find the animals sheltering now!' },
    ],
    [
      { zh: '「平分」成一段一段，用除法。', en: 'Split equally into stretches — division.' },
      { zh: '36 個腳印平分成 4 段：36 ÷ 4。', en: '36 footprints into 4 stretches: 36 ÷ 4.' },
      { zh: '口訣反推「四九三十六」……換你算出每段幾個腳印！', en: 'Reverse: four nines make 36… you find each stretch!' },
    ],
    [
      { zh: '兩步驟：先算全部的湯麵，再減掉送出去的。', en: 'Two steps: total bowls first, then subtract the delivered.' },
      { zh: '第一步：5 鍋 × 每鍋 6 碗 ＝ 30 碗。第二步：30 − 12。', en: 'Step 1: 5 pots × 6 = 30 bowls. Step 2: 30 − 12.' },
      { zh: '30 − 12……換你算出還剩幾碗！', en: '30 − 12… you find the bowls left!' },
    ],
    [
      { zh: '吹熄的燈籠要拿掉，用減法。', en: 'Blown-out lanterns are taken away — subtraction.' },
      { zh: '減 9 的妙招：先減 10 再加回 1！28 − 10 ＝ 18。', en: 'Neat trick for −9: subtract 10 then add 1 back! 28 − 10 = 18.' },
      { zh: '18 再加回 1……換你算出還亮著幾個！', en: '18 plus 1 back… you find the lanterns still lit!' },
    ],
    [
      { zh: '一串一串的星星燈、每串一樣多，用乘法。', en: 'Strings of star-lights, each string equal — multiply.' },
      { zh: '6 串 × 每串 5 顆：6 × 5。', en: '6 strings × 5 lights each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出幾顆星星燈！', en: 'Times table: five sixes make… you find the star-lights!' },
    ],
  ],

  // ── S1 EP5 大植物園 ── 答案 30/44/22/7/56/21/18/38
  ep5: [
    [
      { zh: '每一區種的植物一樣多，一樣多的分組用乘法。', en: 'Each zone grows the same number of plants — equal groups, multiply.' },
      { zh: '6 區 × 每區 5 種：6 × 5。', en: '6 zones × 5 kinds each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出一共幾種植物！', en: 'Times table: five sixes make… you find the total kinds!' },
    ],
    [
      { zh: '本來的加新開的，「合起來」用加法。', en: 'Original blooms plus new ones — join with addition.' },
      { zh: '妙招：18 差 2 就是 20！先加 20 變 46，再退回多加的 2。', en: 'Trick: 18 is just 2 short of 20! Add 20 (→46), then give back the extra 2.' },
      { zh: '46 退 2……換你算出現在幾朵花！', en: '46 minus 2… you find the flowers now!' },
    ],
    [
      { zh: '兩步驟：先算全部盆栽，再減搬走的。', en: 'Two steps: total pots first, then subtract the moved.' },
      { zh: '第一步：5 排 × 每排 6 盆 ＝ 30 盆。第二步：30 − 8。', en: 'Step 1: 5 rows × 6 = 30 pots. Step 2: 30 − 8.' },
      { zh: '30 − 8……換你算出還剩幾盆！', en: '30 − 8… you find the pots left!' },
    ],
    [
      { zh: '「平分」裝進籃子，用除法。', en: 'Share equally into baskets — division.' },
      { zh: '42 顆蘋果平分成 6 籃：42 ÷ 6。', en: '42 apples into 6 baskets: 42 ÷ 6.' },
      { zh: '口訣反推「六幾四十二」……換你算出每籃幾顆！', en: 'Reverse: six times what makes 42… you find each basket!' },
    ],
    [
      { zh: '一叢一叢的竹子、每叢一樣多，用乘法。', en: 'Clumps of bamboo, each clump equal — multiply.' },
      { zh: '7 叢 × 每叢 8 根：7 × 8。', en: '7 clumps × 8 stalks each: 7 × 8.' },
      { zh: '口訣「七八」是多少……換你算出長出幾根竹子！', en: 'Times table: seven eights make… you find the new stalks!' },
    ],
    [
      { zh: '兩步驟：先算全部青蛙，再減跳走的。', en: 'Two steps: total frogs first, then subtract the jumpers.' },
      { zh: '第一步：6 片 × 每片 5 隻 ＝ 30 隻。第二步：30 − 9。', en: 'Step 1: 6 pads × 5 = 30 frogs. Step 2: 30 − 9.' },
      { zh: '減 9 妙招：先減 10 再加回 1……換你算出還有幾隻！', en: 'Trick for −9: subtract 10, add 1 back… you find the frogs left!' },
    ],
    [
      { zh: '送出去的要拿掉，用減法。', en: 'Given-away pots are taken off — subtraction.' },
      { zh: '技巧：35 − 17，先減 10 變 25，再減剩下的 7。', en: 'Trick: 35 − 17 — subtract 10 first (→25), then the leftover 7.' },
      { zh: '25 再減 7……換你算出還剩幾盆香草！', en: '25 minus 7… you find the herb pots left!' },
    ],
    [
      { zh: '兩步驟：先算綁好的祈願卡，再加今天新綁的。', en: 'Two steps: the tied cards first, then add today’s new ones.' },
      { zh: '第一步：6 排 × 每排 5 張 ＝ 30 張。第二步：30 + 8。', en: 'Step 1: 6 rows × 5 = 30 cards. Step 2: 30 + 8.' },
      { zh: '30 + 8……換你算出一共幾張祈願卡！', en: '30 + 8… you find the total wish cards!' },
    ],
  ],

  // ── S1 EP6 大水閘 ── 答案 20/28/17/7/22/43/56/38
  ep6: [
    [
      { zh: '水管一排一排、每排一樣多，用乘法。', en: 'Pipes in equal rows — multiply.' },
      { zh: '4 排 × 每排 5 根：4 × 5。', en: '4 rows × 5 pipes each: 4 × 5.' },
      { zh: '口訣「四五」是多少……換你算出一共幾根水管！', en: 'Times table: four fives make… you find the total pipes!' },
    ],
    [
      { zh: '兩步驟：先算全部的水，再減用掉的。', en: 'Two steps: total water first, then subtract what’s used.' },
      { zh: '第一步：8 桶 × 每桶 5 公升 ＝ 40 公升。第二步：40 − 12。', en: 'Step 1: 8 buckets × 5 L = 40 L. Step 2: 40 − 12.' },
      { zh: '40 − 12……換你算出還剩幾公升！', en: '40 − 12… you find the liters left!' },
    ],
    [
      { zh: '水位「退了」＝變少，用減法。', en: 'The water level “fell” — it got smaller, so subtract.' },
      { zh: '妙招：18 差 2 就是 20！35 先減 20 變 15，再把多減的 2 加回來。', en: 'Trick: 18 is 2 short of 20! 35 − 20 = 15, then add the extra 2 back.' },
      { zh: '15 加回 2……換你算出中午的水位幾公分！', en: '15 plus 2 back… you find the noon level!' },
    ],
    [
      { zh: '「平分」裝進水桶，用除法。', en: 'Share equally into buckets — division.' },
      { zh: '42 公升平分成 6 桶：42 ÷ 6。', en: '42 liters into 6 buckets: 42 ÷ 6.' },
      { zh: '口訣反推「六幾四十二」……換你算出每桶幾公升！', en: 'Reverse: six times what makes 42… you find each bucket!' },
    ],
    [
      { zh: '兩步驟：先算舀起來的水，再減漏掉的。', en: 'Two steps: the scooped water first, then subtract the leak.' },
      { zh: '第一步：5 個水斗 × 每個 6 公升 ＝ 30 公升。第二步：30 − 8。', en: 'Step 1: 5 scoops × 6 L = 30 L. Step 2: 30 − 8.' },
      { zh: '30 − 8……換你算出實際舀上來幾公升！', en: '30 − 8… you find the water actually lifted!' },
    ],
    [
      { zh: '本來的魚加游進來的，「合起來」用加法。', en: 'Fish already there plus fish swimming in — addition.' },
      { zh: '技巧：26 先加 10 變 36，再加剩下的 7。', en: 'Trick: 26 + 10 = 36 first, then the leftover 7.' },
      { zh: '36 再加 7……換你算出現在幾條魚！', en: '36 plus 7… you find the fish now!' },
    ],
    [
      { zh: '每個轉盤都要轉一樣多下，用乘法。', en: 'Every dial needs the same number of turns — multiply.' },
      { zh: '7 個轉盤 × 每個 8 下：7 × 8。', en: '7 dials × 8 turns each: 7 × 8.' },
      { zh: '口訣「七八」是多少……換你算出一共轉幾下！', en: 'Times table: seven eights make… you find the total turns!' },
    ],
    [
      { zh: '兩步驟：先算水槽裡的水，再加倒進去的。', en: 'Two steps: water in the troughs first, then add what’s poured in.' },
      { zh: '第一步：6 格 × 每格 5 公升 ＝ 30 公升。第二步：30 + 8。', en: 'Step 1: 6 troughs × 5 L = 30 L. Step 2: 30 + 8.' },
      { zh: '30 + 8……換你算出現在一共幾公升！', en: '30 + 8… you find the total liters now!' },
    ],
  ],

  // ── S1 EP7 圖書館 ── 答案 30/32/22/9/43/26/32/38
  ep7: [
    [
      { zh: '每座書架的層數一樣多，用乘法。', en: 'Every bookcase has the same shelves — multiply.' },
      { zh: '6 座 × 每座 5 層：6 × 5。', en: '6 cases × 5 shelves each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出一共幾層！', en: 'Times table: five sixes make… you find the total shelves!' },
    ],
    [
      { zh: '被借走的書「不在架上」，用減法拿掉。', en: 'Borrowed books are off the shelf — subtract them.' },
      { zh: '妙招：18 差 2 就是 20！50 先減 20 變 30，再加回多減的 2。', en: 'Trick: 18 is 2 short of 20! 50 − 20 = 30, then add the extra 2 back.' },
      { zh: '30 加回 2……換你算出架上還剩幾本！', en: '30 plus 2 back… you find the books left!' },
    ],
    [
      { zh: '兩步驟：先算全部繪本，再減拿走的。', en: 'Two steps: total picture books first, then subtract the taken.' },
      { zh: '第一步：5 排 × 每排 6 本 ＝ 30 本。第二步：30 − 8。', en: 'Step 1: 5 rows × 6 = 30 books. Step 2: 30 − 8.' },
      { zh: '30 − 8……換你算出架上還剩幾本！', en: '30 − 8… you find what remains on the shelf!' },
    ],
    [
      { zh: '「平分」放回每一層，用除法。', en: 'Share equally back onto each level — division.' },
      { zh: '36 本平分成 4 層：36 ÷ 4。', en: '36 books onto 4 levels: 36 ÷ 4.' },
      { zh: '口訣反推「四九三十六」……換你算出每層放幾本！', en: 'Reverse: four nines make 36… you find each level’s share!' },
    ],
    [
      { zh: '本來的加新到的，「合起來」用加法。', en: 'Existing plus newly arrived — join with addition.' },
      { zh: '技巧：27 先加 10 變 37，再加剩下的 6。個位 7 + 6 會滿十，要進位喔！', en: 'Trick: 27 + 10 = 37, then the leftover 6. Note 7 + 6 passes ten — carry!' },
      { zh: '37 再加 6……換你算出現在一共幾本雜誌！', en: '37 plus 6… you find the magazines now!' },
    ],
    [
      { zh: '兩步驟：先算全部舊書，再挑掉破掉的。', en: 'Two steps: total old books first, then remove the torn ones.' },
      { zh: '第一步：7 箱 × 每箱 5 本 ＝ 35 本。第二步：35 − 9。', en: 'Step 1: 7 boxes × 5 = 35 books. Step 2: 35 − 9.' },
      { zh: '減 9 妙招：先減 10 再加回 1……換你算出還剩幾本好書！', en: 'Trick for −9: subtract 10, add 1 back… you find the good books!' },
    ],
    [
      { zh: '每張長桌坐一樣多人，用乘法。', en: 'Each table seats the same number — multiply.' },
      { zh: '8 張 × 每張 4 人：8 × 4。', en: '8 tables × 4 people each: 8 × 4.' },
      { zh: '口訣「四八」是多少……換你算出坐滿幾個人！', en: 'Times table: four eights make… you find the full seating!' },
    ],
    [
      { zh: '兩步驟：先算夾好的書籤，再加新夾上的。', en: 'Two steps: the placed bookmarks first, then add the new ones.' },
      { zh: '第一步：6 排 × 每排 5 張 ＝ 30 張。第二步：30 + 8。', en: 'Step 1: 6 rows × 5 = 30 bookmarks. Step 2: 30 + 8.' },
      { zh: '30 + 8……換你算出一共幾張書籤！', en: '30 + 8… you find the total bookmarks!' },
    ],
  ],

  // ── S1 EP8 天文台 ── 答案 30/18/30/7/22/43/56/38
  ep8: [
    [
      { zh: '星星燈一圈一圈、每圈一樣多，用乘法。', en: 'Rings of star-lights, each ring equal — multiply.' },
      { zh: '6 圈 × 每圈 5 顆：6 × 5。', en: '6 rings × 5 lights each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出一共幾顆星星燈！', en: 'Times table: five sixes make… you find the star-lights!' },
    ],
    [
      { zh: '新知識：「3 倍」的意思是「3 個一樣多合起來」，所以用乘法！', en: 'New idea: “3 times” means 3 equal groups joined — that’s multiplication!' },
      { zh: '小星圖 6 張的 3 倍：6 × 3。', en: '3 times the 6 small charts: 6 × 3.' },
      { zh: '6 × 3……換你算出大星圖有幾張！', en: '6 × 3… you find the big charts!' },
    ],
    [
      { zh: '兩步驟：先用「倍」算出大望遠鏡能看幾顆，再減被雲遮住的。', en: 'Two steps: use “times” for the big scope’s stars, then subtract the cloud-hidden.' },
      { zh: '第一步：9 顆的 4 倍 ＝ 9 × 4 ＝ 36 顆。第二步：36 − 6。', en: 'Step 1: 4 times 9 = 9 × 4 = 36 stars. Step 2: 36 − 6.' },
      { zh: '36 − 6……換你算出今晚能看到幾顆！', en: '36 − 6… you find tonight’s visible stars!' },
    ],
    [
      { zh: '新知識：問「是幾倍」要反過來用除法！大的 ÷ 小的。', en: 'New idea: to find “how many times,” divide! Big number ÷ small number.' },
      { zh: '大星圖 42 顆、小星圖 6 顆：42 ÷ 6。', en: 'Big chart 42, small chart 6: 42 ÷ 6.' },
      { zh: '口訣反推「六幾四十二」……換你算出是幾倍！', en: 'Reverse: six times what makes 42… you find the multiple!' },
    ],
    [
      { zh: '兩步驟：先算全部隕石，再減借走的。', en: 'Two steps: total meteorites first, then subtract the lent.' },
      { zh: '第一步：5 層 × 每層 6 顆 ＝ 30 顆。第二步：30 − 8。', en: 'Step 1: 5 shelves × 6 = 30 stones. Step 2: 30 − 8.' },
      { zh: '30 − 8……換你算出還剩幾顆！', en: '30 − 8… you find what remains!' },
    ],
    [
      { zh: '本來的加新搬來的，「合起來」用加法。', en: 'Existing plus newly brought — addition.' },
      { zh: '技巧：26 先加 10 變 36，再加剩下的 7。', en: 'Trick: 26 + 10 = 36 first, then the leftover 7.' },
      { zh: '36 再加 7……換你算出現在幾台望遠鏡！', en: '36 plus 7… you find the telescopes now!' },
    ],
    [
      { zh: '每個刻度盤要調一樣多格，用乘法。', en: 'Every dial needs the same clicks — multiply.' },
      { zh: '7 個 × 每個 8 格：7 × 8。', en: '7 dials × 8 clicks each: 7 × 8.' },
      { zh: '口訣「七八」是多少……換你算出一共調幾格！', en: 'Times table: seven eights make… you find the total clicks!' },
    ],
    [
      { zh: '兩步驟：先算排好的玻璃，再加技師補上的。', en: 'Two steps: the fitted panes first, then add the technician’s new ones.' },
      { zh: '第一步：6 排 × 每排 5 片 ＝ 30 片。第二步：30 + 8。', en: 'Step 1: 6 rows × 5 = 30 panes. Step 2: 30 + 8.' },
      { zh: '30 + 8……換你算出一共幾片星形玻璃！', en: '30 + 8… you find the star panes in all!' },
    ],
  ],

  // ── S1 EP9 老戲院 ── 答案 30/32/32/22/7/26/56/38
  ep9: [
    [
      { zh: '海報一排一排、每排一樣多，用乘法。', en: 'Posters in equal rows — multiply.' },
      { zh: '6 排 × 每排 5 張：6 × 5。', en: '6 rows × 5 posters each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出一共幾張海報！', en: 'Times table: five sixes make… you find the total posters!' },
    ],
    [
      { zh: '退掉的票要拿掉，用減法。', en: 'Refunded tickets come off the count — subtraction.' },
      { zh: '妙招：18 差 2 就是 20！50 先減 20 變 30，再加回多減的 2。', en: 'Trick: 18 is 2 short of 20! 50 − 20 = 30, then add 2 back.' },
      { zh: '30 加回 2……換你算出實際賣掉幾張！', en: '30 plus 2 back… you find the tickets truly sold!' },
    ],
    [
      { zh: '座位一排一排、每排一樣多，用乘法。', en: 'Seats in equal rows — multiply.' },
      { zh: '8 排 × 每排 4 個：8 × 4。', en: '8 rows × 4 seats each: 8 × 4.' },
      { zh: '口訣「四八」是多少……換你算出一樓幾個座位！', en: 'Times table: four eights make… you find the ground-floor seats!' },
    ],
    [
      { zh: '兩步驟：先算包廂全部座位，再減坐了人的。', en: 'Two steps: all box seats first, then subtract the occupied.' },
      { zh: '第一步：5 個包廂 × 每個 6 位 ＝ 30 位。第二步：30 − 8。', en: 'Step 1: 5 boxes × 6 = 30 seats. Step 2: 30 − 8.' },
      { zh: '30 − 8……換你算出還空著幾個位子！', en: '30 − 8… you find the empty seats!' },
    ],
    [
      { zh: '「平分」裝在走道上，用除法。', en: 'Split equally along the aisles — division.' },
      { zh: '42 盞小燈平分給 6 條走道：42 ÷ 6。', en: '42 lamps along 6 aisles: 42 ÷ 6.' },
      { zh: '口訣反推「六幾四十二」……換你算出每條走道幾盞！', en: 'Reverse: six times what makes 42… you find each aisle’s lamps!' },
    ],
    [
      { zh: '兩步驟：先算全部戲服，再減拿走的。', en: 'Two steps: total costumes first, then subtract the taken.' },
      { zh: '第一步：7 排 × 每排 5 件 ＝ 35 件。第二步：35 − 9。', en: 'Step 1: 7 racks × 5 = 35 costumes. Step 2: 35 − 9.' },
      { zh: '減 9 妙招：先減 10 再加回 1……換你算出還剩幾件！', en: 'Trick for −9: subtract 10, add 1 back… you find what’s left!' },
    ],
    [
      { zh: '每卷底片放一樣多分鐘，用乘法。', en: 'Each reel plays the same minutes — multiply.' },
      { zh: '7 卷 × 每卷 8 分鐘：7 × 8。', en: '7 reels × 8 minutes each: 7 × 8.' },
      { zh: '口訣「七八」是多少……換你算出一共放幾分鐘！', en: 'Times table: seven eights make… you find the total minutes!' },
    ],
    [
      { zh: '兩步驟：先算排好的貴賓席，再加新加的。', en: 'Two steps: the VIP rows first, then add the extra seats.' },
      { zh: '第一步：6 排 × 每排 5 個 ＝ 30 個。第二步：30 + 8。', en: 'Step 1: 6 rows × 5 = 30 seats. Step 2: 30 + 8.' },
      { zh: '30 + 8……換你算出一共幾個貴賓座位！', en: '30 + 8… you find the VIP seats in all!' },
    ],
  ],

  // ── S1 EP10 月光屋頂 ── 答案 12/13/9/16/14/3/8/15
  ep10: [
    [
      { zh: '小旗一排一排、每排一樣多，用乘法。', en: 'Little flags in equal rows — multiply.' },
      { zh: '3 排 × 每排 4 面：3 × 4。', en: '3 rows × 4 flags each: 3 × 4.' },
      { zh: '口訣「三四」是多少……換你算出一共幾面小旗！', en: 'Times table: three fours make… you find the total flags!' },
    ],
    [
      { zh: '「又走來」＝合起來，用加法。', en: 'More cats wandered over — join with addition.' },
      { zh: '湊十法：8 差 2 就滿 10！從 5 分 2 給 8，變成 10 + 3。', en: 'Make-ten: 8 needs 2 to reach 10! Give 2 from the 5 — it becomes 10 + 3.' },
      { zh: '10 + 3……換你算出一共幾隻貓！', en: '10 + 3… you find the cats in all!' },
    ],
    [
      { zh: '收走的衣服要拿掉，用減法。', en: 'Collected clothes come off the line — subtraction.' },
      { zh: '訣竅：16 − 7，先減 6 到整十的 10，再減剩下的 1。', en: 'Trick: 16 − 7 — subtract 6 to reach 10, then the last 1.' },
      { zh: '10 再減 1……換你算出還剩幾件！', en: '10 minus 1… you find the clothes left!' },
    ],
    [
      { zh: '盆栽一排一排、每排一樣多，用乘法。', en: 'Potted plants in equal rows — multiply.' },
      { zh: '4 排 × 每排 4 盆：4 × 4。', en: '4 rows × 4 pots each: 4 × 4.' },
      { zh: '口訣「四四」是多少……換你算出一共幾盆！', en: 'Times table: four fours make… you find the total pots!' },
    ],
    [
      { zh: '「悄悄放進」＝合起來，用加法。', en: 'Quietly added bread — join with addition.' },
      { zh: '湊十法：8 差 2 就滿 10！從 6 分 2 給 8，變成 10 + 4。', en: 'Make-ten: give 2 from the 6 to fill 8 up to 10 — it becomes 10 + 4.' },
      { zh: '10 + 4……換你算出一共幾個小麵包！', en: '10 + 4… you find the rolls in all!' },
    ],
    [
      { zh: '「平分」插進小瓶，用除法。', en: 'Share equally into little vases — division.' },
      { zh: '12 朵花平分成 4 瓶：12 ÷ 4。', en: '12 flowers into 4 vases: 12 ÷ 4.' },
      { zh: '口訣反推「四幾十二」……換你算出每瓶插幾朵！', en: 'Reverse: four times what makes 12… you find each vase!' },
    ],
    [
      { zh: '飛走的鴿子要拿掉，用減法。', en: 'Flown pigeons come off the count — subtraction.' },
      { zh: '訣竅：13 − 5，先減 3 到整十的 10，再減剩下的 2。', en: 'Trick: 13 − 5 — subtract 3 to reach 10, then the last 2.' },
      { zh: '10 再減 2……換你算出還剩幾隻！', en: '10 minus 2… you find the pigeons left!' },
    ],
    [
      { zh: '先亮的加後亮的，「合起來」用加法。', en: 'Stars lit first plus stars lit after — addition.' },
      { zh: '湊十法：9 差 1 就滿 10！從 6 分 1 給 9，變成 10 + 5。', en: 'Make-ten: give 1 from the 6 to fill 9 up to 10 — it becomes 10 + 5.' },
      { zh: '10 + 5……換你算出天上現在幾顆星！', en: '10 + 5… you find the stars shining now!' },
    ],
  ],

  // ── S1 EP11 星願祭前夜 ── 答案 3/15/5/30/6/12/12/15
  ep11: [
    [
      { zh: '新知識：問「還要等多久」＝晚的時間減早的時間！', en: 'New idea: “how long to wait” = the later time minus the earlier time!' },
      { zh: '鐘聲在 11 點、現在 8 點：11 − 8。', en: 'Bells at 11, now it’s 8: 11 − 8.' },
      { zh: '11 − 8……換你算出還要等幾個小時！', en: '11 − 8… you find the hours to wait!' },
    ],
    [
      { zh: '花掉的錢要拿掉，剩下的用減法算。', en: 'Money spent is taken away — subtract to find what’s left.' },
      { zh: '技巧：50 − 35，先減 30 變 20，再減 5。', en: 'Trick: 50 − 35 — subtract 30 first (→20), then 5.' },
      { zh: '20 再減 5……換你算出還剩幾元！', en: '20 minus 5… you find the money left!' },
    ],
    [
      { zh: '兩步驟：先「留下」再「平分」！留下用減法，平分用除法。', en: 'Two steps: “keep some” then “share equally” — subtract, then divide.' },
      { zh: '第一步：24 − 4 ＝ 20 顆。第二步：20 顆平分給 4 位夥伴：20 ÷ 4。', en: 'Step 1: 24 − 4 = 20 lamps. Step 2: share 20 among 4 friends: 20 ÷ 4.' },
      { zh: '20 ÷ 4……換你算出每人分到幾顆！', en: '20 ÷ 4… you find each friend’s share!' },
    ],
    [
      { zh: '每個花圈用一樣多的花，用乘法。', en: 'Each wreath uses the same flowers — multiply.' },
      { zh: '6 個 × 每個 5 朵：6 × 5。', en: '6 wreaths × 5 flowers each: 6 × 5.' },
      { zh: '口訣「五六」是多少……換你算出一共用幾朵花！', en: 'Times table: five sixes make… you find the flowers used!' },
    ],
    [
      { zh: '每瓶裝一樣多公升，一樣多的東西用乘法——連公升也可以乘喔！', en: 'Each bottle holds the same liters — equal amounts multiply, even liters!' },
      { zh: '3 瓶 × 每瓶 2 公升：3 × 2。', en: '3 bottles × 2 liters each: 3 × 2.' },
      { zh: '3 × 2……換你算出一共幾公升！', en: '3 × 2… you find the total liters!' },
    ],
    [
      { zh: '「3 倍」就是 3 個一樣多合起來，用乘法。', en: '“3 times” means 3 equal groups joined — multiplication.' },
      { zh: '4 顆的 3 倍：4 × 3。', en: '3 times the 4 stars: 4 × 3.' },
      { zh: '4 × 3……換你算出要點亮幾顆星！', en: '4 × 3… you find the stars to light!' },
    ],
    [
      { zh: '兩步驟：先算全部椅子，再減坐了人的。', en: 'Two steps: total chairs first, then subtract the taken seats.' },
      { zh: '第一步：5 排 × 每排 6 張 ＝ 30 張。第二步：30 − 18。', en: 'Step 1: 5 rows × 6 = 30 chairs. Step 2: 30 − 18.' },
      { zh: '30 − 18……換你算出還剩幾張空位！', en: '30 − 18… you find the empty seats!' },
    ],
    [
      { zh: '兩步驟：先算碎片射出的光，再加墜子那 1 道。', en: 'Two steps: the shards’ beams first, then add the pendant’s 1.' },
      { zh: '第一步：7 片 × 每片 2 道 ＝ 14 道。第二步：14 + 1。', en: 'Step 1: 7 shards × 2 beams = 14. Step 2: 14 + 1.' },
      { zh: '14 + 1……換你算出一共幾道光指向天空！', en: '14 + 1… you find the beams pointing skyward!' },
    ],
  ],

  // ── S1 EP12 終章 ── 答案 48/18/14/17/15/14/3/13
  ep12: [
    [
      { zh: '長椅一排一排、每排坐一樣多人，用乘法。', en: 'Benches in rows, each seating the same — multiply.' },
      { zh: '6 排 × 每排 8 人：6 × 8。', en: '6 rows × 8 people each: 6 × 8.' },
      { zh: '口訣「六八」是多少……換你算出一共幾個人！', en: 'Times table: six eights make… you find the crowd!' },
    ],
    [
      { zh: '過去的時間要拿掉，剩下的用減法。', en: 'Time gone by is taken away — subtract for what remains.' },
      { zh: '技巧：30 − 12，先減 10 變 20，再減 2。', en: 'Trick: 30 − 12 — subtract 10 first (→20), then 2.' },
      { zh: '20 再減 2……換你算出光還能撐幾分鐘！', en: '20 minus 2… you find the minutes of light left!' },
    ],
    [
      { zh: '每片碎片對準一樣多顆星，用乘法。', en: 'Each shard aims at the same number of stars — multiply.' },
      { zh: '7 片 × 每片 2 顆：7 × 2。', en: '7 shards × 2 stars each: 7 × 2.' },
      { zh: '口訣「二七」是多少……換你算出一共對準幾顆星！', en: 'Times table: two sevens make… you find the stars to align!' },
    ],
    [
      { zh: '兩步驟：先算全部蠟燭，再減吹熄的。', en: 'Two steps: total candles first, then subtract the blown-out.' },
      { zh: '第一步：4 排 × 每排 5 根 ＝ 20 根。第二步：20 − 3。', en: 'Step 1: 4 rows × 5 = 20 candles. Step 2: 20 − 3.' },
      { zh: '20 − 3……換你算出還亮著幾根！', en: '20 − 3… you find the candles still burning!' },
    ],
    [
      { zh: '一組一組的光、每組一樣多道，用乘法。', en: 'Groups of light, each group equal — multiply.' },
      { zh: '3 組 × 每組 5 道：3 × 5。', en: '3 groups × 5 beams each: 3 × 5.' },
      { zh: '口訣「三五」是多少……快幫他算出一共幾道光！', en: 'Times table: three fives make… quick, find the beams!' },
    ],
    [
      { zh: '先亮的加後亮的，「合起來」用加法。', en: 'Steps lit first plus steps lit after — addition.' },
      { zh: '湊十法：8 差 2 就滿 10！從 6 分 2 給 8，變成 10 + 4。', en: 'Make-ten: give 2 from the 6 to fill 8 up to 10 — it becomes 10 + 4.' },
      { zh: '10 + 4……換你算出光橋一共亮了幾階！', en: '10 + 4… you find the glowing steps!' },
    ],
    [
      { zh: '「平分」送給每一群朋友，用除法。', en: 'Share equally among the groups of friends — division.' },
      { zh: '12 顆小星星平分給 4 群：12 ÷ 4。', en: '12 little stars among 4 groups: 12 ÷ 4.' },
      { zh: '口訣反推「四幾十二」……換你算出每群分到幾顆！', en: 'Reverse: four times what makes 12… you find each group’s share!' },
    ],
    [
      { zh: '兩步驟：先算站起來揮手的，再加安安自己。', en: 'Two steps: those standing to wave first, then add An-An herself.' },
      { zh: '第一步：6 排 × 每排 2 個 ＝ 12 個。第二步：12 + 1。', en: 'Step 1: 6 rows × 2 = 12 friends. Step 2: 12 + 1.' },
      { zh: '12 + 1……換你算出幾個朋友在揮手！', en: '12 + 1… you find the friends waving goodbye!' },
    ],
  ],

  // ── S2 EP1 牡羊座 ── 答案 14/9/15/24/3/32/13/8
  s2ep1: [
    [
      { zh: '「又跑回來」＝把兩群羊合起來，用加法。', en: 'Sheep “ran back” — join the two flocks with addition.' },
      { zh: '湊十法：8 差 2 就滿 10！從 6 分 2 給 8，變成 10 + 4。', en: 'Make-ten: 8 needs 2 to reach 10! Give 2 from the 6 — it becomes 10 + 4.' },
      { zh: '10 + 4……換你算出圍欄裡現在幾隻羊！', en: '10 + 4… you find the sheep in the pen now!' },
    ],
    [
      { zh: '跑走的羊「不在」草坡上了，用減法拿掉。', en: 'The sheep that ran off are gone — subtract them.' },
      { zh: '訣竅：15 − 6，先減 5 到整十的 10，再減剩下的 1。', en: 'Trick: 15 − 6 — subtract 5 to reach 10, then the last 1.' },
      { zh: '10 再減 1……換你算出草坡上還剩幾隻！', en: '10 minus 1… you find the sheep still on the slope!' },
    ],
    [
      { zh: '排隊排得整整齊齊、每排一樣多——這就是乘法！', en: 'Neat equal rows — that’s multiplication!' },
      { zh: '3 排 × 每排 5 隻：3 × 5。', en: '3 rows × 5 sheep each: 3 × 5.' },
      { zh: '口訣「三五」是多少……換你算出一共排了幾隻羊！', en: 'Times table: three fives make… you find the sheep lined up!' },
    ],
    [
      { zh: '每隻羊剪下一樣多球毛線，一樣多的分組用乘法。', en: 'Each sheep gives the same balls of yarn — equal groups, multiply.' },
      { zh: '4 隻 × 每隻 6 球：4 × 6。', en: '4 sheep × 6 balls each: 4 × 6.' },
      { zh: '口訣「四六」是多少……換你算出一共幾球毛線！', en: 'Times table: four sixes make… you find the yarn balls!' },
    ],
    [
      { zh: '「平分」給每隻羊＝每隻一樣多，用除法。', en: 'Sharing equally among the sheep — division.' },
      { zh: '18 把星星草平分給 6 隻：18 ÷ 6。', en: '18 bundles among 6 sheep: 18 ÷ 6.' },
      { zh: '口訣反推「六幾十八」……換你算出每隻分到幾把！', en: 'Reverse: six times what makes 18… you find each sheep’s share!' },
    ],
    [
      { zh: '「又掛上」＝合起來，用加法。', en: 'More bells were hung — join with addition.' },
      { zh: '湊整十：24 差 6 就是 30！先加 6 變 30，再加剩下的 2。', en: 'Round-ten trick: 24 needs 6 to reach 30! Add 6 first (→30), then the leftover 2.' },
      { zh: '30 + 2……換你算出項圈上現在幾顆鈴鐺！', en: '30 + 2… you find the bells on the collar now!' },
    ],
    [
      { zh: '撿回去的星星要從散落的裡面拿掉，用減法。', en: 'Gathered stars come off the scattered pile — subtraction.' },
      { zh: '技巧：30 − 17，先減 10 變 20，再減剩下的 7。', en: 'Trick: 30 − 17 — subtract 10 first (→20), then the leftover 7.' },
      { zh: '20 再減 7……換你算出還剩幾顆沒撿！', en: '20 minus 7… you find the stars still lying there!' },
    ],
    [
      { zh: '兩步驟：先算「全部要趕回來的羊」，再減已經回來的。', en: 'Two steps: the full flock to herd first, then subtract those already back.' },
      { zh: '第一步：5 群 × 每群 4 隻 ＝ 20 隻。第二步：20 − 12。', en: 'Step 1: 5 groups × 4 = 20 sheep. Step 2: 20 − 12.' },
      { zh: '20 − 12……換你算出還有幾隻在外面！', en: '20 − 12… you find the sheep still outside!' },
    ],
  ],
}
