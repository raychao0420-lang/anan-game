// 長篇連續劇 第三季《安安偵探社 · 太陽系大冒險》
// The An-An Detective Agency — Season 3: The Solar System Adventure
//
// 天空三部曲完結篇：小星（走失）→ 小月（迷路）→ 小冥（被遺忘）。
// 承接 S2：小月從月亮捎來緊急信——太陽系軌道亂了、每顆行星都少了一樣小東西。
// 結構同 S1/S2（資料驅動、中英雙語、每集 8 現場、破案指認），差異：
//   每集收集一顆「軌道寶石」gem（拼太陽系全家福圖），集滿 12 顆解終章。
//   難度＝全面複習小四（不教新的，混合 S2 學過的題型加深，前緩後陡）。
//   ★ 新機制「分支選擇」：每集一個 choice 節點（kind:'choice'），二選一走不同
//     小現場（各 1 題、難度相同、殊途同歸不影響破案），重玩有新鮮感。
//   裏層主線：搞怪的是被除名的第九行星「冥王星小冥」——牠繞太陽系收集每顆
//   行星的小紀念品想拼「全家福」，怕大家忘了牠。每集留同一痕跡：冰冰的小腳印❄️。
//   貫穿紅鯡魚：☀️太陽公公（老打瞌睡？其實偷偷調暗光讓大家看得見小冥微弱的光）
//   ＋🛸火箭快遞員（幫小冥送了十幾年沒人收的信），終章全洗白。
//
// choice 節點格式：
//   { kind:'choice', place, emoji, story, question{zh,en},
//     options:[{ id, label{zh,en}, scene:{place,emoji,story,puzzle} }, ...] }
//   ⚠️ episode id 用 's3ep*' 前綴。

export const SEASON3 = {
  id: 'season3',
  title: { zh: '太陽系大冒險', en: 'The Solar System Adventure' },
  emoji: '🚀',
  seasonIntro: [
    { zh: '小月回月亮以後，每天晚上都把月光調得又溫柔又亮。可是這天，一道銀藍色的月光急急忙忙落在安安窗前，捲成一封信——是小月的緊急信！',
      en: 'Since going home, Luna has tuned the moonlight soft and bright every night. But tonight a silver-blue beam darts to An-An’s window and curls into a letter — an urgent letter from Luna!' },
    { zh: '「安安！太陽系出大事了！行星們一顆一顆偏離軌道，而且每顆行星上，都少了一樣小小的東西……大家吵成一團，都說對方是小偷！」',
      en: '“An-An! Something is wrong with the solar system! The planets are drifting off their orbits one by one — and on every planet, one small thing has gone missing… Everyone is blaming everyone!”' },
    { zh: '信的最後畫著一枚小小的火箭票。小星拉著安安的手跳上窗台：「星際火箭要出發了！這次我們要辦的案子，是整個太陽系！」偵探帽戴好——安安偵探社，飛向宇宙！',
      en: 'At the letter’s end is a little rocket ticket. Twinkle pulls An-An onto the sill: “The star-rocket is leaving! This time, our case is the whole solar system!” Detective hats on — the An-An Agency blasts off!' },
  ],

  episodes: [
    // ─────────────────────────────────────── S3 EP1 ───────────────────────────────────────
    {
      id: 's3ep1',
      no: 1,
      title: { zh: '太陽站的陽光快遞', en: 'The Sunshine Express of Sun Station' },
      emoji: '☀️',
      accent: '#f2a33c',
      difficulty: { zh: '大數位值·暖身複習', en: 'Place value warm-up' },
      gem: { id: 'sun', emoji: '☀️', name: { zh: '太陽寶石', en: 'Sun Gem' } },
      intro: [
        { zh: '第一站，太陽站——太陽系的能量發電廠！這裡把陽光裝進一箱一箱的「陽光箱」，送給每一顆行星取暖。可是最近陽光的帳全對不上，行星們冷得直發抖。',
          en: 'First stop: Sun Station, the solar system’s power plant! Here sunshine is packed into crates and delivered to every planet for warmth. But lately the sunshine ledgers don’t add up, and the planets are shivering.' },
        { zh: '教育小彩蛋：太陽超級大——可以裝下 130 萬顆地球！倉庫的箱子動不動就是「幾萬箱」，小星搔搔頭：「幾萬……是多少呀？」安安挽起袖子：「大數字我複習過，交給我！」',
          en: 'Fun fact: the Sun is huge — 1.3 million Earths could fit inside! The warehouse counts crates by the ten-thousands. Twinkle scratches its head: “How much IS a ten-thousand?” An-An rolls up her sleeves: “Big numbers — I’ve reviewed this. Leave it to me!”' },
      ],
      scenes: [
        {
          place: { zh: '陽光倉庫大門', en: 'The Sunshine Warehouse Gate' },
          emoji: '🌞',
          story: { zh: '倉庫大門的牌子寫著：「本季庫存：4 萬箱」。守門的小光點說，要把「4 萬」寫成完整的數字才能進門。',
                   en: 'The gate sign reads: “Stock this season: 4 ten-thousands of crates.” The little light-guard asks for the full number to enter.' },
          puzzle: {
            text: { zh: '{4} [萬]箱寫成完整的數字，是幾箱？',
                    en: 'Written out in full, {4} [ten-thousands] of crates is how many crates?' },
            answer: 40000, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '1 萬＝10000（1 後面 4 個 0），4 萬就是 4 個 10000。', en: '1 ten-thousand = 10000 (a 1 with four 0s); 4 of them make 4 × 10000.' },
            teach: [
              { zh: '複習大數！1 萬＝10000，是 1 的後面跟著 4 個 0。',
                en: 'Big-number review! One ten-thousand = 10000 — a 1 followed by four 0s.' },
              { zh: '4 萬就是 4 個 1 萬：把 4 寫在萬位，後面補 4 個 0。',
                en: '4 ten-thousands means a 4 in the ten-thousands place, followed by four 0s.' },
              { zh: '4 後面跟 4 個 0……換你把完整數字打出來！',
                en: 'A 4 with four 0s… you type the full number!' },
            ],
            reward: { zh: '🌞 40000 箱！大門緩緩打開，暖烘烘的陽光味撲面而來，像剛烤好的麵包。',
                      en: '🌞 40000 crates! The gate swings open to a wave of warm sunshine-smell, like fresh-baked bread.' },
          },
        },
        {
          place: { zh: '點貨區', en: 'The Tally Yard' },
          emoji: '📦',
          story: { zh: '點貨員數完了今天要出貨的箱子：「2 萬箱再加 3 千箱」。出貨單上要寫成一個數字才算數。',
                   en: 'The tally clerk counts today’s shipment: “2 ten-thousands plus 3 thousands.” The docket needs it as one number.' },
          puzzle: {
            text: { zh: '{2} 萬箱加 {3} 千箱，合起來寫成一個數字是幾箱？',
                    en: '{2} ten-thousands plus {3} thousands of crates — written as one number, how many crates?' },
            answer: 23000, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '2 放萬位、3 放千位，其他位補 0：2 萬 3 千。', en: 'Put 2 in the ten-thousands place, 3 in the thousands, fill the rest with 0s.' },
            teach: [
              { zh: '每個數字都有自己的「位子」：萬位、千位、百位、十位、個位。',
                en: 'Every digit has its own seat: ten-thousands, thousands, hundreds, tens, ones.' },
              { zh: '2 萬＝2 坐在萬位，3 千＝3 坐在千位，沒人坐的位子用 0 補。',
                en: 'The 2 sits in the ten-thousands seat, the 3 in the thousands, and empty seats get 0s.' },
              { zh: '2、3、然後補 3 個 0……換你把出貨單的數字打出來！',
                en: '2, 3, then three 0s… you type the docket number!' },
            ],
            reward: { zh: '📦 23000 箱！出貨單蓋上大大的太陽章。點貨員小聲說：「最近……總覺得箱子會自己變少。」',
                      en: '📦 23000 crates! The docket gets a big sun-stamp. The clerk whispers: “Lately… crates seem to vanish on their own.”' },
          },
        },
        {
          place: { zh: '配送單', en: 'The Delivery Slip' },
          emoji: '📋',
          story: { zh: '牆上貼著一張大配送單，用國字寫著「五萬一千四百箱」。要輸入電腦，得改成數字。',
                   en: 'A big slip on the wall reads, in words: “fifty-one thousand four hundred crates.” The computer needs digits.' },
          puzzle: {
            text: { zh: '「[五萬一千四百]」箱寫成數字，是幾箱？',
                    en: '“[Fifty-one thousand four hundred]” crates in digits is how many?' },
            answer: 51400, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '五萬→5 在萬位、一千→1 在千位、四百→4 在百位，十位個位補 0。', en: '5 in ten-thousands, 1 in thousands, 4 in hundreds, 0s in tens and ones.' },
            teach: [
              { zh: '把國字一段一段拆開：五萬、一千、四百。',
                en: 'Break the words apart: five ten-thousands, one thousand, four hundred.' },
              { zh: '五萬＝5 坐萬位、一千＝1 坐千位、四百＝4 坐百位，十位和個位沒有人，補 0。',
                en: '5 in the ten-thousands seat, 1 in thousands, 4 in hundreds — tens and ones are empty, so 0s.' },
              { zh: '5、1、4、0、0……換你把數字打出來！',
                en: '5, 1, 4, 0, 0… you type it in!' },
            ],
            reward: { zh: '📋 51400 箱！電腦「叮」的一聲收單。這麼大批的陽光，是要送去給誰呢？',
                      en: '📋 51400 crates! The computer chirps and accepts. Who could such a big shipment be for?' },
          },
        },
        {
          place: { zh: '兩張訂單', en: 'Two Orders' },
          emoji: '⚖️',
          story: { zh: '櫃檯上有兩張吵架的訂單：火星訂了 41000 箱、金星訂了 38000 箱，都說自己訂得比較多、要先出貨。',
                   en: 'Two orders squabble on the counter: Mars wants 41000 crates, Venus wants 38000 — each claims to be the bigger order.' },
          puzzle: {
            text: { zh: '火星訂 {41000} 箱、金星訂 {38000} 箱，比較多的那張訂了幾箱？',
                    en: 'Mars ordered {41000} crates, Venus {38000}. How many crates are on the bigger order?' },
            answer: 41000, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '比大數先比萬位：4 萬比 3 萬大，萬位大的就贏了。', en: 'Compare the ten-thousands digit first: 4 beats 3, so that number wins.' },
            teach: [
              { zh: '比較大數的訣竅：從最大的位子（萬位）開始比！',
                en: 'Comparing big numbers: start from the biggest place — the ten-thousands!' },
              { zh: '41000 的萬位是 4，38000 的萬位是 3。4 比 3 大，萬位贏了就整個數贏了。',
                en: '41000 has a 4 there, 38000 a 3. Since 4 > 3, the whole number is bigger.' },
              { zh: '比較多的是哪一張……換你把那個數字打出來！',
                en: 'Which order is bigger… you type that number!' },
            ],
            reward: { zh: '⚖️ 火星的 41000 箱比較多！兩張訂單服氣了，乖乖排好隊。',
                      en: '⚖️ Mars’ 41000 wins! Both orders accept it and line up neatly.' },
          },
        },
        {
          kind: 'choice',
          place: { zh: '倉庫岔路口', en: 'The Warehouse Fork' },
          emoji: '🔀',
          story: { zh: '線索指向頂樓的「特別包裹區」。往上有兩條路——閃亮亮的光之電梯，和捲成螺旋的向日葵溜滑梯。小星興奮地問：「安安，走哪條？」',
                   en: 'The clues point to the “Special Parcels” loft. Two ways up — a shimmering light elevator, and a spiraling sunflower slide. Twinkle bounces: “An-An, which way?”' },
          question: { zh: '★ 你來決定！要走哪條路上頂樓？（兩條路都到得了，選你喜歡的！）',
                      en: '★ You decide! Which way to the loft? (Both get there — pick your favorite!)' },
          options: [
            {
              id: 'elevator',
              label: { zh: '⬆️ 搭光之電梯', en: '⬆️ Take the Light Elevator' },
              scene: {
                place: { zh: '光之電梯', en: 'The Light Elevator' },
                emoji: '🛗',
                story: { zh: '光之電梯一邊往上升，一邊順路把陽光箱送到每一層。電梯小姐請安安幫忙算今天的載貨量。',
                         en: 'The elevator delivers crates floor by floor as it rises. The operator asks An-An to tally today’s load.' },
                puzzle: {
                  text: { zh: '電梯每層放下 {2000} 箱，一路升了 {6} 層，一共送了幾箱？',
                          en: 'The elevator drops {2000} crates per floor for {6} floors. How many crates delivered?' },
                  answer: 12000, unit: { zh: '箱', en: 'crates' },
                  hint: { zh: '每層一樣多用乘法：2000 × 6。想成 2 × 6 再補 3 個 0！', en: 'Equal per floor — multiply: 2000 × 6. Think 2 × 6, then add three 0s!' },
                  teach: [
                    { zh: '每層放的箱子一樣多，一樣多的分組用乘法：2000 × 6。',
                      en: 'Equal crates per floor — equal groups multiply: 2000 × 6.' },
                    { zh: '大數乘法小技巧：先算 2 × 6 ＝ 12，再把 2000 的 3 個 0 補回去。',
                      en: 'Big-number trick: do 2 × 6 = 12 first, then give back 2000’s three 0s.' },
                    { zh: '12 後面補 3 個 0……換你算出一共送了幾箱！',
                      en: '12 with three 0s… you find the crates delivered!' },
                  ],
                  reward: { zh: '🛗 一共 12000 箱！「叮——頂樓到了。」電梯門打開，特別包裹區就在眼前。',
                            en: '🛗 12000 crates! “Ding — top floor.” The doors open right onto Special Parcels.' },
                },
              },
            },
            {
              id: 'slide',
              label: { zh: '🌻 滑向日葵溜滑梯', en: '🌻 Ride the Sunflower Slide' },
              scene: {
                place: { zh: '向日葵溜滑梯', en: 'The Sunflower Slide' },
                emoji: '🌻',
                story: { zh: '向日葵溜滑梯其實是運貨滑道！工人們把陽光箱一批一批往上送。滑梯管理員請安安幫忙算今天的運量。',
                         en: 'The sunflower slide is really a cargo chute! Workers send crates up in big batches. The keeper asks An-An to tally today’s haul.' },
                puzzle: {
                  text: { zh: '滑道每一趟運 {4000} 箱，今天運了 {3} 趟，一共運了幾箱？',
                          en: 'The chute carries {4000} crates per trip and made {3} trips today. How many crates in all?' },
                  answer: 12000, unit: { zh: '箱', en: 'crates' },
                  hint: { zh: '每趟一樣多用乘法：4000 × 3。想成 4 × 3 再補 3 個 0！', en: 'Equal per trip — multiply: 4000 × 3. Think 4 × 3, then add three 0s!' },
                  teach: [
                    { zh: '每趟運的一樣多，一樣多的分組用乘法：4000 × 3。',
                      en: 'Equal crates per trip — equal groups multiply: 4000 × 3.' },
                    { zh: '大數乘法小技巧：先算 4 × 3 ＝ 12，再把 4000 的 3 個 0 補回去。',
                      en: 'Big-number trick: 4 × 3 = 12 first, then give back 4000’s three 0s.' },
                    { zh: '12 後面補 3 個 0……換你算出一共運了幾箱！',
                      en: '12 with three 0s… you find the crates hauled!' },
                  ],
                  reward: { zh: '🌻 一共 12000 箱！咻——安安順著花瓣滑到頂樓，正好落在特別包裹區門口。',
                            en: '🌻 12000 crates! Whee — An-An swoops up the petals and lands right at Special Parcels.' },
                },
              },
            },
          ],
        },
        {
          place: { zh: '補貨區', en: 'The Restock Bay' },
          emoji: '🚚',
          story: { zh: '頂樓的補貨區正在進貨。架上已經有 26000 箱，今天又補進 4000 箱。',
                   en: 'The loft’s restock bay is busy: 26000 crates on the racks, and 4000 more arriving today.' },
          puzzle: {
            text: { zh: '架上有 {26000} 箱，又補進 {4000} 箱，現在一共有幾箱？',
                    en: 'The racks hold {26000} crates; {4000} more arrive. How many now?' },
            answer: 30000, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '看千位：6 千＋4 千剛好湊成 1 萬！26000 ＋ 4000 會是整整齊齊的萬。', en: 'Watch the thousands: 6 + 4 makes a full ten-thousand! 26000 + 4000 lands on a round number.' },
            teach: [
              { zh: '「又補進」＝合起來，用加法：26000 ＋ 4000。',
                en: '“More arrive” means joining — addition: 26000 + 4000.' },
              { zh: '湊整技巧：6 千＋4 千＝剛好 1 萬！所以 2 萬 6 千再加 4 千，會進位成整萬。',
                en: 'Round-up trick: 6 thousands + 4 thousands = exactly 1 ten-thousand! So it carries to a round number.' },
              { zh: '2 萬再加上湊出來的 1 萬……換你算出現在幾箱！',
                en: '2 ten-thousands plus the new 1… you find the total crates!' },
            ],
            reward: { zh: '🚚 剛好 30000 箱，好整齊的數字！可是補貨員皺著眉：「奇怪，明明常常補貨，數字卻老是對不上……」',
                      en: '🚚 Exactly 30000 — how tidy! But the stocker frowns: “Strange… we restock and restock, yet the numbers never match.”' },
          },
        },
        {
          place: { zh: '冰冰的小腳印', en: 'The Icy Little Footprints' },
          emoji: '❄️',
          story: { zh: '特別包裹區門口，地板上有一串小小的、冰冰的腳印，踩過的地方結著薄薄的霜。帳本攤開著：本來 50000 箱，現在少了 13000 箱。',
                   en: 'Outside Special Parcels, a trail of tiny icy footprints frosts the floor. The open ledger reads: 50000 crates before — 13000 now missing.' },
          puzzle: {
            text: { zh: '帳上本來有 {50000} 箱，少了 {13000} 箱，現在剩幾箱？',
                    en: 'The ledger had {50000} crates; {13000} are missing. How many remain?' },
            answer: 37000, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '剩下的＝本來的減少掉的：50000 − 13000。先減 1 萬再減 3 千！', en: 'Remaining = original minus missing: 50000 − 13000. Take 10000 first, then 3000!' },
            teach: [
              { zh: '少掉的要拿走，用減法：50000 − 13000。',
                en: 'What’s missing comes off — subtraction: 50000 − 13000.' },
              { zh: '大數減法技巧：把 13000 拆成 1 萬和 3 千。50000 先減 1 萬＝40000。',
                en: 'Big-number trick: split 13000 into 10000 and 3000. First 50000 − 10000 = 40000.' },
              { zh: '40000 再減 3000……換你算出還剩幾箱！',
                en: '40000 minus 3000… you find what remains!' },
            ],
            reward: { zh: '❄️ 剩 37000 箱！腳印的盡頭放著一疊小包裹，收件地址畫著一顆小小的、缺了一角的星球——這是哪裡呀？小星盯著腳印，覺得冰冰的，卻一點也不可怕。',
                      en: '❄️ 37000 left! Where the footprints end sits a stack of little parcels, each addressed with a drawing of a tiny planet with a chipped corner — where IS that? Twinkle studies the icy prints: cold, but somehow not scary at all.' },
          },
        },
        {
          place: { zh: '找到葵葵', en: 'Finding Kui-Kui' },
          emoji: '🌻',
          story: { zh: '包裹堆後面，向日葵管家葵葵抱著打包到一半的陽光箱，嚇得花瓣都豎起來了。安安蹲下來，輕輕問她在做什麼。',
                   en: 'Behind the parcels, Kui-Kui the sunflower keeper clutches a half-packed crate, petals standing on end. An-An kneels and gently asks what she’s doing.' },
          puzzle: {
            text: { zh: '葵葵每月固定打包 {5} 批陽光、每批 {6000} 箱，這個月還多裝了 {2000} 箱「特別的」。她這個月一共打包了幾箱？',
                    en: 'Kui-Kui packs {5} batches of {6000} crates each month, plus {2000} “special” crates this month. How many crates in all?' },
            answer: 32000, unit: { zh: '箱', en: 'crates' },
            hint: { zh: '兩步：先算固定的 5 × 6000 ＝ 30000，再加特別的 2000。', en: 'Two steps: the regular 5 × 6000 = 30000 first, then add the special 2000.' },
            teach: [
              { zh: '這題有兩步。先算固定的：5 批 × 每批 6000 箱。技巧：5 × 6 ＝ 30，補回 3 個 0 ＝ 30000。',
                en: 'Two steps. The regular packing first: 5 × 6000. Trick: 5 × 6 = 30, give back three 0s = 30000.' },
              { zh: '第二步加上多裝的特別包裹：30000 ＋ 2000。',
                en: 'Step 2: add the special extras: 30000 + 2000.' },
              { zh: '30000 ＋ 2000……換你算出葵葵一共打包幾箱！',
                en: '30000 + 2000… you find Kui-Kui’s total!' },
            ],
            reward: { zh: '🎉 一共 32000 箱！帳全對上了——多出來的那 2000 箱，就是寫著神祕地址的小包裹。葵葵低下頭，小小聲說出一個祕密……太陽站的陽光，重新暖呼呼地流向每顆行星！',
                      en: '🎉 32000 crates! The ledger balances at last — the extra 2000 are the little parcels with the mysterious address. Kui-Kui hangs her head and whispers a secret… and Sun Station’s warmth flows out to every planet again!' },
          },
        },
      ],
      suspects: [
        { id: 'sunflower', name: { zh: '向日葵管家葵葵', en: 'Kui-Kui the Sunflower Keeper' }, emoji: '🌻' },
        { id: 'sun',       name: { zh: '太陽公公', en: 'Grandpa Sun' }, emoji: '☀️' },
        { id: 'rocket',    name: { zh: '火箭快遞員', en: 'the Rocket Courier' }, emoji: '🛸' },
      ],
      culprit: 'sunflower',
      accuse: { zh: '陽光的帳一直對不上、箱子悄悄變少，大家都說倉庫裡有內賊。可是仔細看——是誰每個月都偷偷「多裝」一批小包裹，收件地址畫著一顆缺了角的小星球，還細心地在包裹裡多塞了一條小毯子？（她不是偷，是在給誰寄溫暖喔！）',
                en: 'The ledgers never balance and crates keep vanishing — everyone suspects an inside thief. But look closely: who quietly packs an extra batch of parcels each month, addressed with a chip-cornered little planet, each with a small blanket tucked inside? (Not stealing — mailing warmth to someone!)' },
      wrongAccuse: { zh: '這位可沒有整天待在倉庫裡打包喔。再想想，誰的花瓣手最巧、誰每個月都在打包區忙到最晚？🌻',
                     en: 'This one doesn’t spend all day packing in the warehouse. Think again: whose petal-hands are nimblest, who stays latest in the packing bay every month? 🌻' },
      solve: [
        { zh: '原來，「內賊」是向日葵管家葵葵！🌻',
          en: 'The “inside thief” was Kui-Kui, the sunflower keeper! 🌻' },
        { zh: '很多年前，葵葵收到一封信：「太陽站的陽光，可以也寄一點給我嗎？我排隊排在最後面，每次輪到我，陽光都發完了。」地址遠得連配送單都印不下。從那以後，葵葵每個月都偷偷多打包 2000 箱，自己貼郵資寄過去——一寄，就是好多年。',
          en: 'Years ago, Kui-Kui received a letter: “Could Sun Station send a little sunshine to me too? I stand last in line, and it always runs out before my turn.” The address was so far it didn’t fit the slip. Ever since, she has quietly packed 2000 extra crates a month and paid the postage herself — for years and years.' },
        { zh: '「我不知道那是誰，」葵葵絞著花瓣說，「信上只畫了一顆缺角的小星球。可是……可是誰都不應該領不到陽光呀。」安安看著那疊包裹上冰冰的小腳印，心裡輕輕一動：收包裹的那個孩子，最近好像自己來過。',
          en: '“I never learned who it was,” Kui-Kui says, twisting her petals. “The letter only had a drawing of a chip-cornered little planet. But… no one should be left without sunshine.” An-An eyes the icy footprints by the parcels, and something stirs: the child those parcels are for seems to have come here — in person.' },
        { zh: '太陽公公打了個大呵欠，慢吞吞地說：「帳對上就好、對上就好……」說完又瞇起眼睛打盹，誰也沒發現，他把身上的光又悄悄調暗了一小格。',
          en: 'Grandpa Sun gives a great yawn: “As long as the ledger balances…” and dozes off again — and no one notices him quietly dimming his own light by one more notch.' },
      ],
      arcClue: { zh: '太陽寶石到手！可是這個案子留下了更大的謎：那顆「缺了一角的小星球」是誰的家？冰冰的小腳印，為什麼會出現在太陽站？小星翻著星圖，數來數去：「水星、金星、地球、火星……八大行星都在圖上，沒有缺角的呀。」火箭快遞員遠遠看了那疊包裹一眼，欲言又止，最後只是默默把它們搬上了火箭。下一站，水星——聽說那裡的「行星運動會」也出事了。',
                 en: 'The Sun Gem is theirs! But a bigger riddle remains: whose home is the chip-cornered little planet? And why do icy footprints appear at Sun Station? Twinkle pores over the star chart, counting: “Mercury, Venus, Earth, Mars… all eight planets are here — none with a chipped corner.” The Rocket Courier glances at the parcel stack, seems about to speak, then silently loads them aboard. Next stop: Mercury — where the Planet Games are in trouble too.' },
      nextPreview: { zh: '下集：水星！公轉最快的行星要辦「太陽系運動會」，可是選手名單、跑道分組全亂了套——安安要用乘法和除法幫大家排好隊。冰冰的小腳印，也出現在了起跑線旁……',
                     en: 'Next: Mercury! The fastest planet is hosting the Solar Games, but the rosters and lane groupings are in chaos — An-An must sort them out with multiplication and division. And icy little footprints appear beside the starting line…' },
      reward: 400,
    },
  ],
}

// 軌道寶石板（12 站拼太陽系全家福），collected 由 store 的 seriesGems 決定
export const GEM_BOARD = [
  { id: 'sun',      emoji: '☀️', name: { zh: '太陽', en: 'Sun' } },
  { id: 'mercury',  emoji: '⚪', name: { zh: '水星', en: 'Mercury' } },
  { id: 'venus',    emoji: '🟡', name: { zh: '金星', en: 'Venus' } },
  { id: 'mars',     emoji: '🔴', name: { zh: '火星', en: 'Mars' } },
  { id: 'asteroid', emoji: '🪨', name: { zh: '小行星帶', en: 'Asteroids' } },
  { id: 'jupiter',  emoji: '🟠', name: { zh: '木星', en: 'Jupiter' } },
  { id: 'saturn',   emoji: '🪐', name: { zh: '土星', en: 'Saturn' } },
  { id: 'uranus',   emoji: '🔵', name: { zh: '天王星', en: 'Uranus' } },
  { id: 'neptune',  emoji: '🌊', name: { zh: '海王星', en: 'Neptune' } },
  { id: 'comet',    emoji: '☄️', name: { zh: '彗星站', en: 'Comet Stop' } },
  { id: 'earth',    emoji: '🌍', name: { zh: '地球', en: 'Earth' } },
  { id: 'pluto',    emoji: '🌑', name: { zh: '冥王星', en: 'Pluto' } },
]
