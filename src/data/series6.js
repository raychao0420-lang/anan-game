// 長篇連續劇 第六季《安安偵探社 · 漫遊台灣大冒險》
// The An-An Detective Agency — Season 6: Roaming Taiwan
//
// 環遊世界回來後的新篇章：阿基教授交付一張手繪的台灣環島路線圖，
// 安安帶著全體寵物（飛飛領航、小Q家教）逆時針環島十二站，每站一樁數學案件。
// 定位＝四年級上學期十大單元「總複習·在地應用強化」（翰林版）：
//   1~6 關課本複習紮實、第 7、8 關挑戰星題★。
// 結構同 S1~S5（資料驅動、中英雙語、每集 8 現場、破案指認），差異：
//   每集拼上一片「台灣拼圖」piece（PUZZLE_BOARD 拼台灣地圖），集滿 12 片＝漫遊台灣名偵探。
//   每集彩蛋＝台灣地理／小吃／人文 × 數學小知識。
//   裏層主線：短毛黑臘腸小虎🐕（在桃園大溪／八德庄腳長大、覺得家鄉沒什麼的小狗），
//   偷偷跟著安安環島，每集留同一痕跡：一雙短短的小腳印🐾＋悄悄放下的家鄉土產。
//   從自卑到驕傲、想分享家鄉之美——終章「台灣真美分享會」現身入隊。
//   巡巡教官＝台灣觀光偵探聯盟聯絡官（延續 S5 正面幫手），每站發來委託電報。
//
// 完整劇本見 docs/season6-劇本.md（12 集案名、答案、裏層節拍全定稿）。
// ★ 真推理鐵則（S3 EP2 起）：scene.clueNote{zh,en}＝該現場的關鍵數字（證據板）、
//   suspects[].say{zh,en}＝說詞藏數字；accuse 不爆雷，孩子自己抓矛盾。
// ★ choice 節點：每集一個，兩分支同答案。episode id 用 's6ep*' 前綴。

export const SEASON6 = {
  id: 'season6',
  title: { zh: '漫遊台灣大冒險', en: 'Roaming Taiwan' },
  emoji: '🇹🇼',
  seasonIntro: [
    { zh: '環遊世界回來的隔天早晨，阿基教授把一張捲起來的舊地圖攤在樹屋桌上——這回不是世界地圖，是一張手繪的台灣環島路線圖，上面畫滿了小吃、廟口、山海與火車。「你帶著小Q和飛飛把整個世界都看過了。可是安安啊——你有沒有好好看過，自己出生的這座島？」',
      en: 'The morning after the world tour, Professor Archie unrolls an old map on the treehouse table — not a world map this time, but a hand-drawn route around Taiwan, covered in street food, temple gates, mountains, seas and trains. “You took Little Q and Feifei to see the whole world. But An-An — have you ever really looked at the island where you were born?”' },
    { zh: '「我年輕時走過一圈，才發現：我們一直住在一個寶藏裡，卻常常忘了它有多美。這一趟，我不派你去救誰、送誰——我只想請你，替我把台灣重新看一遍。」出發那天，全體寵物排排站：LULU 硬要跟、小星小月小冥擠在窗邊、飛飛在天上盤旋領航，小Q穩穩站上安安肩膀。',
      en: '“In my youth I once went around it, and only then did I realise: we live inside a treasure, yet so often forget how beautiful it is. This time I send you to rescue no one — I only ask you to see Taiwan again, for me.” On departure day the whole pet family lines up: LULU insists on coming, Twinkle, Luna and Little Pluto crowd the window, Feifei wheels overhead to guide the way, and Little Q stands steady on An-An’s shoulder.' },
    { zh: '巡巡教官遞來一封蓋著火漆印的電報：「台灣觀光偵探聯盟，任命安安為漫遊台灣特派偵探。十二站，十二片拼圖——拼滿整張台灣地圖，你就是漫遊台灣名偵探。第一站的委託已經到了：台北，出發！」火車汽笛長鳴，家，就在腳下這座島上。',
      en: 'Officer Prowl hands over a wax-sealed telegram: “The Taiwan Tourism Detective League hereby appoints An-An as Roaming Detective of Taiwan. Twelve stops, twelve puzzle pieces — complete the map of Taiwan and you shall be the Great Roaming Detective. The first commission is in: Taipei. Depart!” The train horn sounds long — home is right here, on this very island.' },
  ],

  episodes: [
    // ─────────────────────────────────────── S6 EP1 ───────────────────────────────────────
    {
      id: 's6ep1',
      no: 1,
      title: { zh: '台北車站的大數看板', en: 'The Big-Number Board of Taipei Station' },
      emoji: '🏙️',
      accent: '#4f7fd6',
      difficulty: { zh: '大數複習（一億以內）', en: 'Large numbers review (within 100 million)' },
      piece: { id: 'taipei', emoji: '🏙️', name: { zh: '台北片', en: 'Taipei Piece' } },
      intro: [
        { zh: '環島第一站——台北！才走出捷運閘門，台北車站就亂成一鍋粥：大廳正中央的「即時運量看板」整面變成閃爍的亂碼，廣播一遍一遍道歉，通勤族在月台上塞成人山人海。巡巡教官的電報追了過來：「委託電報第 1 號：台北車站大數看板故障，位值錯亂，速修！——巡巡」',
          en: 'First stop of the island tour — Taipei! The moment they step out of the MRT gates, Taipei Station is in chaos: the giant live-ridership board in the main hall has dissolved into flickering garbage, apologies loop on the speakers, and commuters pile up on every platform. Officer Prowl’s telegram catches up: “Commission No. 1: Taipei Station’s big-number board is down — place values scrambled. Fix it, fast! — Prowl”' },
        { zh: '站長台灣犬阿北迎上來：「偵探！這面看板吃的是『大數』——千萬、百萬、十萬、萬，一格一位，錯一格就全面亂碼。」小Q清清喉嚨，用穩穩的前輩口氣說：「大數就交給我們！安安，位值一格一格對回去——先看清楚每個數字站在哪一位！」查案兼修看板，開始！',
          en: 'Stationmaster Ah-Bei the Formosan dog comes over: “Detective! This board eats BIG numbers — ten-millions, millions, hundred-thousands, ten-thousands. One digit per slot, and one wrong slot scrambles everything.” Little Q clears his throat, steady as a seasoned senior now: “Leave big numbers to us! An-An, match each digit back to its place — first see WHERE each digit stands!” Case and repair, begin!' },
      ],
      scenes: [
        {
          place: { zh: '月台跑馬燈', en: 'The Platform Ticker' },
          emoji: '🚈',
          story: { zh: '第一塊要修的是月台跑馬燈。阿北站長翻出手冊：「台北捷運一天大約載運 200 萬人次——跑馬燈要顯示『一週的總運量』，單位是萬人次。」小Q歪著頭：「一週七天，就是 200 萬跑七趟嘛！」',
                   en: 'First repair: the platform ticker. Stationmaster Ah-Bei flips his manual: “The Taipei MRT carries about 2,000,000 riders a day — the ticker shows the WEEK’S total, in units of ten-thousand.” Little Q tilts his head: “Seven days — that’s 2 million, seven times over!”' },
          clueNote: { zh: '捷運一週運量＝1400 萬人次（200 萬×7，我自己算的）', en: 'MRT weekly ridership = 14,000,000 (2,000,000 × 7 — I worked it out myself)' },
          puzzle: {
            text: { zh: '台北捷運一天約 {200} 萬人次，[一週（7 天）]共幾萬人次？',
                    en: 'The Taipei MRT carries about {2,000,000} (= {200} ten-thousands) riders a day. In [one week (7 days)], how many ten-thousands in total?' },
            answer: 1400, unit: { zh: '萬人次', en: 'ten-thousand riders' },
            hint: { zh: '把「萬」當作一個單位：200 萬×7，就跟 200×7 一樣算！', en: 'Treat “ten-thousand” as one unit: 2 million × 7 works just like 200 × 7!' },
            teach: [
              { zh: '大數的計算絕招：用「萬」當單位！200 萬人次就是「200 個萬」，數字瞬間變小、變好算。',
                en: 'Big-number trick: use “ten-thousand” as your unit! 2,000,000 riders is just “200 ten-thousands” — suddenly the number is small and friendly.' },
              { zh: '一週是 7 天，所以是 200 萬 × 7——用萬當單位，就是 200 × 7。',
                en: 'A week is 7 days, so it’s 200 ten-thousands × 7 — with our unit, that’s just 200 × 7.' },
              { zh: '200 × 7……換你把跑馬燈的數字算出來（記得單位是「萬人次」）！',
                en: '200 × 7… you light up the ticker (in ten-thousands)!' },
            ],
            reward: { zh: '🚈 1400 萬人次！跑馬燈唰地亮回來，整條月台歡呼。阿北站長狂搖尾巴：「不愧是聯盟派來的偵探！下一塊在大廳！」',
                      en: '🚈 14,000,000 riders! The ticker blazes back to life and the whole platform cheers. Ah-Bei’s tail goes wild: “The League sent the right detective! Next one’s in the hall!”' },
          },
        },
        {
          place: { zh: '中央運量看板', en: 'The Grand Central Board' },
          emoji: '📟',
          story: { zh: '大廳正中央就是那面出事的大看板。維修口的銘牌寫著：「本板顯示台北市人口：2,340,000。」阿北嘆氣：「昨晚有人更新數字之後，它就亂碼了。要重新輸入，得先讀對位值——2,340,000 的十萬位是多少？」',
                   en: 'Centre of the hall: the broken board itself. The service plate reads: “Displays Taipei City’s population: 2,340,000.” Ah-Bei sighs: “Someone updated it last night, and it scrambled. To re-enter it, read the place values right — what digit sits in the hundred-thousands place of 2,340,000?”' },
          clueNote: { zh: '看板正確人口＝2,340,000（234 萬），十萬位是 3', en: 'Correct population = 2,340,000 (2.34 million); hundred-thousands digit = 3' },
          puzzle: {
            text: { zh: '看板的正確數字是 {2,340,000}。它的[十萬位]是多少？',
                    en: 'The board’s correct number is {2,340,000}. What digit is in its [hundred-thousands place]?' },
            answer: 3, unit: { zh: '', en: '' },
            hint: { zh: '從個位往左數：個、十、百、千、萬、十萬——第 6 位！', en: 'Count from the ones place leftwards: ones, tens, hundreds, thousands, ten-thousands, hundred-thousands — the 6th place!' },
            teach: [
              { zh: '讀大數先畫「位值表」：從右邊個位開始，每往左一格大 10 倍——個、十、百、千、萬、十萬、百萬。',
                en: 'For big numbers, draw a place-value chart: start at the ones on the right; each step left is 10 times bigger — ones, tens, hundreds, thousands, ten-thousands, hundred-thousands, millions.' },
              { zh: '把 2,340,000 一格一格放進去：0、0、0、0、4、3、2——從右邊數第 6 格那個 3，站的就是十萬位。',
                en: 'Slot 2,340,000 in digit by digit: 0, 0, 0, 0, 4, 3, 2 — the 3 in the 6th slot from the right stands in the hundred-thousands place.' },
              { zh: '所以十萬位的數字是……換你告訴看板！',
                en: 'So the hundred-thousands digit is… you tell the board!' },
            ],
            reward: { zh: '📟 十萬位是 3！看板閃了兩下，吐出一行小字：「位值校正中……」有進展！可是阿北皺眉：「奇怪，昨晚到底是誰更新的？系統紀錄一片空白。」',
                      en: '📟 Hundred-thousands digit: 3! The board blinks twice and prints: “Recalibrating place values…” Progress! But Ah-Bei frowns: “Strange — WHO updated it last night? The system log is blank.”' },
          },
        },
        {
          place: { zh: '售票閘門', en: 'The Ticket Gates' },
          emoji: '🎫',
          story: { zh: '售票閘門也罷工了，螢幕卡在一道驗證題：「本站開業以來累計售票約一千八百萬張。請以數字輸入：一千八百萬寫成數字，一共有幾個 0？」排隊的通勤族全在抓頭。',
                   en: 'The ticket gates are on strike too, stuck on a checksum: “Tickets sold since opening: eighteen million. Enter: written as digits, how many zeros does eighteen million have?” The whole queue is scratching heads.' },
          clueNote: { zh: '一千八百萬＝18,000,000，一共 6 個 0', en: 'Eighteen million = 18,000,000 — six zeros in all' },
          puzzle: {
            text: { zh: '「一千八百萬」寫成數字是 18,000,000——一共有[幾個] {0}？',
                    en: '“Eighteen million” written as digits is 18,000,000 — [how many] {0}s does it have?' },
            answer: 6, unit: { zh: '個', en: 'zeros' },
            hint: { zh: '「萬」後面跟著 4 個 0；一千八百萬＝1800 個萬，1800 自己還帶 2 個 0！', en: '“Ten-thousand” carries 4 zeros; 18 million = 1,800 ten-thousands, and 1,800 brings 2 zeros of its own!' },
            teach: [
              { zh: '中文的「萬」是大數的好幫手：寫成數字時，「萬」的後面要補 4 個 0。',
                en: 'The unit “ten-thousand (萬)” is your helper: written as digits, it adds 4 zeros after itself.' },
              { zh: '一千八百萬＝1800 萬 → 先寫 1800，再補 4 個 0：18,000,000。數數看：1800 裡有 2 個 0，後面再加 4 個。',
                en: 'Eighteen million = 1,800 ten-thousands → write 1800, then attach 4 zeros: 18,000,000. Count: 1800 holds 2 zeros, plus the 4 attached.' },
              { zh: '2 個＋4 個……換你輸入答案，打開閘門！',
                en: '2 + 4… you enter it and open the gates!' },
            ],
            reward: { zh: '🎫 6 個 0！閘門叮咚放行，通勤族拍手叫好。有位掃地的松鼠清潔員抱著掃把小聲說：「偵探，通往控制室的路……在前面分岔喔。」',
                      en: '🎫 Six zeros! The gates chime open to applause. A squirrel cleaner hugs her broom and whispers: “Detective… the way to the control room forks up ahead.”' },
          },
        },
        {
          kind: 'choice',
          place: { zh: '車站岔路口', en: 'The Station Fork' },
          emoji: '🔀',
          story: { zh: '通往控制室的路在這裡分成兩條：左邊經過觀光服務台，右邊經過跨年電子看板。飛飛從挑高天花板下俯衝喊：「兩條路都到得了控制室！安安，挑一條你喜歡的！」',
                   en: 'The way to the control room splits: left past the tourist desk, right past the New Year’s countdown board. Feifei swoops beneath the high ceiling: “Both reach the control room! An-An, pick the one you like!”' },
          question: { zh: '★ 你來決定！要走哪一邊去控制室？（兩條路都到得了，選你喜歡的！）',
                      en: '★ You decide! Which way to the control room? (Both get there — pick your favorite!)' },
          options: [
            {
              id: 'tourist',
              label: { zh: '🧳 經過觀光服務台', en: '🧳 Past the Tourist Desk' },
              scene: {
                place: { zh: '觀光服務台', en: 'The Tourist Desk' },
                emoji: '🧳',
                story: { zh: '觀光服務台的統計板也亂了。板上寫著：「今年三天連假，台北每天湧入 300 萬人次。」要解鎖通道門，得回答：三天連假總共幾萬人次？',
                         en: 'The tourist desk’s board is scrambled too. It reads: “This year’s three-day holiday: 3,000,000 visitors a day in Taipei.” To unlock the corridor: how many ten-thousands over the three days?' },
                clueNote: { zh: '三天連假＝900 萬人次（300 萬×3）', en: 'Three-day holiday = 9,000,000 visitors (3,000,000 × 3)' },
                puzzle: {
                  text: { zh: '三天連假每天 {300} 萬人次，[三天總共]幾萬人次？',
                          en: 'A three-day holiday, {3,000,000} visitors a day — how many [ten-thousands] over the three days?' },
                  answer: 900, unit: { zh: '萬人次', en: 'ten-thousand visitors' },
                  hint: { zh: '用萬當單位：300 萬×3，就跟 300×3 一樣算！', en: 'In ten-thousand units: 3 million × 3 works just like 300 × 3!' },
                  teach: [
                    { zh: '一樣用「萬」當單位：300 萬就是「300 個萬」。',
                      en: 'Same trick — use ten-thousand as your unit: 3,000,000 is “300 ten-thousands.”' },
                    { zh: '三天的總人次＝一天的 3 倍，所以是 300 萬 × 3——用萬當單位，就是 300 × 3。',
                      en: 'Three days = one day × 3, so it’s 300 ten-thousands × 3 — that’s just 300 × 3.' },
                    { zh: '300 × 3……換你打開通道門！',
                      en: '300 × 3… you open the corridor!' },
                  ],
                  reward: { zh: '🧳 900 萬人次！通道門喀啦打開。經過服務台角落時，安安瞄到地上……一雙短短的小腳印，濕濕的，好像剛有誰急急忙忙跑過去。',
                            en: '🧳 9,000,000 visitors! The corridor clicks open. Passing the corner of the desk, An-An spots something on the floor… a pair of short little paw prints, still damp, as if someone had just scurried past.' },
                },
              },
            },
            {
              id: 'newyear',
              label: { zh: '🎆 經過跨年電子看板', en: '🎆 Past the Countdown Board' },
              scene: {
                place: { zh: '跨年電子看板', en: 'The Countdown Board' },
                emoji: '🎆',
                story: { zh: '跨年電子看板驕傲地閃著：「觀光局年度目標 9000 萬人次！」下一行卻壞了。要讓看板走下去，得答出：目前已達成 8100 萬人次，還差幾萬才達標？',
                         en: 'The countdown board flashes proudly: “Tourism Bureau yearly target: 90,000,000 visitors!” But the next line is broken. To keep it running: 81,000,000 reached so far — how many ten-thousands short of the target?' },
                clueNote: { zh: '距目標還差 900 萬人次（9000 萬−8100 萬）', en: 'Still 9,000,000 short of target (90,000,000 − 81,000,000)' },
                puzzle: {
                  text: { zh: '年度目標 {9000} 萬人次，已達成 {8100} 萬——[還差]幾萬達標？',
                          en: 'Yearly target {90,000,000}, reached {81,000,000} — how many [ten-thousands] short?' },
                  answer: 900, unit: { zh: '萬人次', en: 'ten-thousand visitors' },
                  hint: { zh: '用萬當單位：9000−8100。從 9000 先減 8000，再減 100！', en: 'In ten-thousand units: 9,000 − 8,100. Take 8,000 first, then 100!' },
                  teach: [
                    { zh: '大數減法一樣用「萬」當單位：9000 萬−8100 萬＝(9000−8100) 萬。',
                      en: 'Big-number subtraction, same trick: 90 million − 81 million = (9,000 − 8,100) ten-thousands.' },
                    { zh: '分兩步減比較穩：9000−8000＝1000，再 1000−100＝900。',
                      en: 'Two steady steps: 9,000 − 8,000 = 1,000, then 1,000 − 100 = 900.' },
                    { zh: '所以還差……換你點亮看板！',
                      en: 'So it’s short by… you light the board!' },
                  ],
                  reward: { zh: '🎆 還差 900 萬人次！看板噹地亮起，倒數重新開始。安安眼角餘光瞥見看板下方閃過一個矮矮的、耳朵垂垂的小影子，一溜煙不見了。',
                            en: '🎆 9,000,000 to go! The board lights with a chime and the countdown restarts. From the corner of her eye, An-An catches a low, floppy-eared little shadow darting past below the board, gone in a blink.' },
                },
              },
            },
          ],
        },
        {
          place: { zh: '轉乘大廳', en: 'The Transfer Hall' },
          emoji: '🌉',
          story: { zh: '控制室前的轉乘大廳裡，兩塊路線牌都黑了。阿北唸出資料：「內湖科技園區一年通勤 2700 萬人次，南港軟體園區 1300 萬人次——牌子要顯示兩區合計。」小Q搶答：「用萬當單位，加起來就好！」',
                   en: 'In the transfer hall before the control room, both line signs are dark. Ah-Bei reads the data: “Neihu Tech Park: 27,000,000 commuters a year. Nangang Software Park: 13,000,000. The sign shows both COMBINED.” Little Q jumps in: “Ten-thousand units — just add them!”' },
          clueNote: { zh: '兩區合計＝4000 萬人次（2700 萬＋1300 萬）', en: 'Two parks combined = 40,000,000 (27,000,000 + 13,000,000)' },
          puzzle: {
            text: { zh: '內科 {2700} 萬人次＋南港 {1300} 萬人次——[兩區合計]幾萬人次？',
                    en: 'Neihu {27,000,000} + Nangang {13,000,000} — how many [ten-thousands] combined?' },
            answer: 4000, unit: { zh: '萬人次', en: 'ten-thousand commuters' },
            hint: { zh: '用萬當單位：2700＋1300，跟平常的加法一樣！', en: 'In ten-thousand units it’s just 2,700 + 1,300 — ordinary addition!' },
            teach: [
              { zh: '大數加法別怕：只要單位一樣（都是「萬」），就跟普通加法一模一樣。',
                en: 'Adding big numbers isn’t scary: with matching units (both in ten-thousands), it’s ordinary addition.' },
              { zh: '2700 萬＋1300 萬＝(2700＋1300) 萬。先加千位：2000＋1000＝3000；再加百位：700＋300＝1000。',
                en: '27 million + 13 million = (2,700 + 1,300) ten-thousands. Thousands first: 2,000 + 1,000 = 3,000; then hundreds: 700 + 300 = 1,000.' },
              { zh: '3000＋1000……換你點亮路線牌！',
                en: '3,000 + 1,000… you light the sign!' },
            ],
            reward: { zh: '🌉 4000 萬人次！兩塊路線牌同時亮起，大廳裡的通勤族發出「哇——」的讚嘆。控制室就在眼前了。',
                      en: '🌉 40,000,000 commuters! Both signs flare on together and the crowd goes “Whoa—!” The control room is just ahead.' },
          },
        },
        {
          place: { zh: '悠遊卡服務中心', en: 'The EasyCard Center' },
          emoji: '📮',
          story: { zh: '控制室隔壁是悠遊卡服務中心。熊店長攔住安安：「偵探幫幫忙！今年悠遊卡發行了 8000 萬張，回收了 650 萬張，庫存牌卻壞了——還剩幾萬張在外面流通？」小Q盯著牆上的限定卡樣，眼睛發亮：「好可愛的卡……咦，這張圖案怎麼是一隻腿短短的小黑狗？」',
                   en: 'Next to the control room sits the EasyCard Center. Chief Bear stops An-An: “Detective, help! We issued 80,000,000 EasyCards this year and recovered 6,500,000 — but the stock sign broke. How many ten-thousands are still in circulation?” Little Q stares at the limited-edition card wall, eyes shining: “So cute… wait, why is this one a short-legged little black dog?”' },
          clueNote: { zh: '悠遊卡流通＝7350 萬張（8000 萬−650 萬）', en: 'Cards in circulation = 73,500,000 (80,000,000 − 6,500,000)' },
          puzzle: {
            text: { zh: '悠遊卡發行 {8000} 萬張，回收 {650} 萬張——[還剩]幾萬張流通？',
                    en: 'Issued {80,000,000} cards, recovered {6,500,000} — how many [ten-thousands] still circulate?' },
            answer: 7350, unit: { zh: '萬張', en: 'ten-thousand cards' },
            hint: { zh: '用萬當單位：8000−650。從 8000 先減 600，再減 50！', en: 'In ten-thousand units: 8,000 − 650. Take 600 first, then 50!' },
            teach: [
              { zh: '大數減法一樣用「萬」當單位：8000 萬−650 萬＝(8000−650) 萬。',
                en: 'Big-number subtraction, same trick: 80 million − 6.5 million = (8,000 − 650) ten-thousands.' },
              { zh: '分兩步減比較穩：8000−600＝7400，再 7400−50＝7350。',
                en: 'Two steady steps: 8,000 − 600 = 7,400, then 7,400 − 50 = 7,350.' },
              { zh: '所以還剩……換你把庫存牌修好！',
                en: 'So the stock is… you fix the sign!' },
            ],
            reward: { zh: '📮 7350 萬張！熊店長鞠躬道謝，送了安安一張限定悠遊卡：「這是今年的神祕款喔，設計師只說『畫的是一隻很想家的小狗』。」小Q把卡收得好好的，總覺得那雙短短的腿好眼熟。',
                      en: '📮 73,500,000 cards! Chief Bear bows deep and gifts An-An a limited EasyCard: “This year’s mystery design — the artist only said it’s ‘a little dog who misses home.’” Little Q tucks it away carefully, somehow sure those short legs look familiar.' },
          },
        },
        {
          place: { zh: '控制室的一億挑戰 ★', en: 'The Control Room’s 100-Million Challenge ★' },
          emoji: '🖥️',
          story: { zh: '控制室到了！主機重啟需要最高權限密語。螢幕浮出挑戰星題：「本系統最大可顯示『一億』。請問：一億是幾個一百萬？」阿北倒抽一口氣：「這是站長級的題目啊……」小Q握拳：「安安，星題★！用位值想！」',
                   en: 'The control room! Rebooting needs the master passphrase. The screen floats a star challenge: “This system displays up to ONE HUNDRED MILLION. Question: how many millions make one hundred million?” Ah-Bei gasps: “That’s a stationmaster-level question…” Little Q clenches a wing: “An-An, star problem ★! Think in place values!”' },
          clueNote: { zh: '一億＝100 個一百萬', en: 'One hundred million = 100 millions' },
          puzzle: {
            text: { zh: '★ 挑戰星題：{一億}（100,000,000）是[幾個]一百萬？',
                    en: '★ Star challenge: {100,000,000} is how many [millions]?' },
            answer: 100, unit: { zh: '個', en: 'millions' },
            hint: { zh: '一億是 1 後面 8 個 0，一百萬是 1 後面 6 個 0——差 2 個 0，就是差 100 倍！', en: 'A hundred million is 1 with 8 zeros; a million is 1 with 6 zeros — 2 zeros apart means 100 times!' },
            teach: [
              { zh: '先把兩個數寫出來：一億＝100,000,000（8 個 0）；一百萬＝1,000,000（6 個 0）。',
                en: 'Write both out: one hundred million = 100,000,000 (8 zeros); one million = 1,000,000 (6 zeros).' },
              { zh: '「幾個一百萬」＝一億 ÷ 一百萬。0 的個數相減：8−6＝2 個 0，也就是 1 後面 2 個 0。',
                en: '“How many millions” = 100,000,000 ÷ 1,000,000. Subtract the zero counts: 8 − 6 = 2 zeros left — that’s 1 followed by 2 zeros.' },
              { zh: '1 後面 2 個 0 是多少……換你輸入最高權限密語！',
                en: '1 with 2 zeros is… you enter the master passphrase!' },
            ],
            reward: { zh: '🖥️ 100 個一百萬！主機嗡——地重啟，風扇轉了起來。螢幕卻跳出最後一道防線：「請插入備用主機板（存放於行李置物櫃）」。最後一站！',
                      en: '🖥️ 100 millions! The mainframe hums awake, fans spinning. Then one last gate appears: “Insert backup mainboard (stored in the luggage lockers).” Final stop!' },
          },
        },
        {
          place: { zh: '置物櫃的密碼行李箱 ★', en: 'The Locker Suitcase ★' },
          emoji: '📦',
          story: { zh: '行李置物櫃裡，備用主機板鎖在一只老行李箱中。掛牌寫著站長設的謎題密碼：「用 6、0、3、8 這四張數字卡，各用一次，排出最大的四位數。」小Q把四張卡攤在地上排來排去：「最大的要當老大，站最前面……」',
                   en: 'In the luggage lockers, the backup mainboard sits locked in an old suitcase. The tag holds the stationmaster’s riddle code: “Using the four digit cards 6, 0, 3, 8 — each exactly once — arrange the LARGEST four-digit number.” Little Q shuffles the cards on the floor: “The biggest one leads the way…”' },
          clueNote: { zh: '置物櫃密碼＝8630（6、0、3、8 排出的最大四位數，我自己排出來的）', en: 'Locker code = 8630 (largest four-digit number from 6, 0, 3, 8 — I arranged it myself)' },
          puzzle: {
            text: { zh: '★ 挑戰星題：用 {6}、{0}、{3}、{8} 各一次，排出[最大的四位數]＝置物櫃密碼！',
                    en: '★ Star challenge: use {6}, {0}, {3}, {8} once each — the [largest four-digit number] is the code!' },
            answer: 8630, unit: { zh: '', en: '' },
            hint: { zh: '想拿最大，就把最大的數字放最高位：千位放 8，接著由大到小排下去！', en: 'Want the max? Put the biggest digit in the highest place: 8 in the thousands, then descend!' },
            teach: [
              { zh: '排最大數的訣竅：位值越高影響越大，所以「最大的數字站最高位」。四張卡由大到小：8＞6＞3＞0。',
                en: 'Key idea: higher places matter more, so the biggest digit takes the highest place. Sort the cards: 8 > 6 > 3 > 0.' },
              { zh: '由大到小填進千、百、十、個位：千位 8、百位 6、十位 3、個位 0。（0 千萬不能帶頭，帶頭就變三位數啦！）',
                en: 'Fill thousands, hundreds, tens, ones from big to small: 8, 6, 3, 0. (Zero must never lead — a leading 0 shrinks it to three digits!)' },
              { zh: '8、6、3、0 連起來……換你解開行李箱！',
                en: '8, 6, 3, 0 in a row… you crack the suitcase!' },
            ],
            reward: { zh: '🧳 8630！行李箱彈開，備用主機板閃閃發亮。換上主機板，大看板轟然復活——「2,340,000」端端正正亮在大廳上空，全車站掌聲雷動！可是安安合上偵探筆記：「看板是修好了……但『誰弄亂的』還沒破案。該去會一會關係人了——讓數字說話。」',
                      en: '🧳 8630! The suitcase springs open — the backup mainboard gleams. One swap later, the grand board thunders back: “2,340,000” shines true above the hall to a storm of applause! But An-An snaps the casebook shut: “The board is fixed… but WHO scrambled it is still open. Time to meet the persons of interest — and let the numbers talk.”' },
          },
        },
      ],
      suspects: [
        {
          id: 'dudu', name: { zh: '站務員小田鼠嘟嘟', en: 'Dudu the Vole Clerk' }, emoji: '🐹',
          say: { zh: '「我、我昨晚是有去控制室巡邏，但我什麼都沒碰！人口看板亂碼前顯示的，應該是 23 萬 4 千（234,000）人吧……啊、不對，我是說，大概、大概是我猜的啦！」',
                 en: '“I—I did patrol the control room last night, but I touched NOTHING! Before it scrambled, the population board must have shown 234,000… ah—no, I mean, that’s just, just a guess!”' },
        },
        {
          id: 'ahbei', name: { zh: '站長台灣犬阿北', en: 'Ah-Bei the Formosan Stationmaster' }, emoji: '🐕',
          say: { zh: '「捷運一天約 200 萬人次、一週 1400 萬——這些數字我天天廣播，絕對錯不了。看板亂碼後，我第一時間就把控制室鎖上了，鑰匙只有站務人員有。」',
                 en: '“About 2,000,000 riders a day, 14,000,000 a week — I announce these daily; they’re never wrong. The moment the board scrambled, I locked the control room — only station staff hold keys.”' },
        },
        {
          id: 'saodi', name: { zh: '清潔員松鼠小掃', en: 'Sweep the Squirrel Cleaner' }, emoji: '🐿️',
          say: { zh: '「我凌晨在售票閘門那邊打掃，親眼看到驗證題答案是 6 個 0，一點沒錯！控制室我進不去，我沒有鑰匙呀。」',
                 en: '“I was cleaning by the ticket gates at dawn — the checksum answer was 6 zeros, spot on! I can’t even enter the control room; I hold no key.”' },
        },
      ],
      culprit: 'dudu',
      accuse: { zh: '看板一夜亂碼，三位關係人都說了自己記得的數字。翻開證據板一條一條對——看板該顯示的正確人口，是你親手校正的兩百三十四萬（2,340,000），十萬位是 3。可是有一個人嘴裡說出的，是個「整整少了一位」的數字……亂碼的看板誰都讀不到，會知道那個錯誤數字的，只有把它親手輸進去的人。是誰？',
                en: 'The board scrambled overnight, and all three told the numbers they remember. Open your evidence notes and check line by line — the correct population, which YOU recalibrated, is 2,340,000, hundred-thousands digit 3. Yet someone quoted a number that dropped a whole place… nobody could read the scrambled board, so only the one who TYPED that wrong number could know it. Who?' },
      wrongAccuse: { zh: '這位說的數字跟你的證據板都對得上喔（捷運一週 1400 萬人次、驗證題 6 個 0，你都親自算過是真的）。再聽一次三個人的話——人口看板正確是兩百三十四萬（2,340,000），卻有人說出「23 萬 4 千（234,000）」：整整少了一位、百萬變十萬。這個輸錯的數字，只有誰見過呢？🐹',
                     en: 'This one’s numbers all match your notes (14,000,000 riders a week, 6 zeros on the checksum — you verified both yourself). Listen again — the true population is 2,340,000, yet someone said “234,000”: a whole place dropped, millions turned to hundred-thousands. Who alone could have SEEN that wrong number? 🐹' },
      solve: [
        { zh: '把數字輸錯的，是站務員小田鼠嘟嘟！🐹 牠說「什麼都沒碰」，卻說得出「234,000」——看板一亂碼誰都讀不到，只有親手輸入的人，才會知道那個錯誤的數字。2,340,000 該有的那一位，被牠少打了一格，整面看板當場罷工。',
          en: 'The number-typer was Dudu the vole clerk! 🐹 He claimed he “touched nothing,” yet quoted “234,000” — once the board scrambled nobody could read it, so only the one who typed it could know that wrong number. He dropped a whole place from 2,340,000, and the entire board went on strike.' },
        { zh: '嘟嘟紅著眼睛承認了：牠是這個月才來的實習站務員，位值表還背不太熟。昨晚牠想在大家上班前，偷偷把人口看板更新好、給前輩一個驚喜，結果一緊張，把百萬位的數字少打了一格。怕的不是被罵——是怕大家知道牠「連位值都會搞錯」，以後就不讓牠碰最愛的看板了。',
          en: 'Dudu confessed, eyes red: he’s only this month’s trainee clerk, still shaky on the place-value chart. Last night he wanted to update the population board before everyone clocked in — a surprise for his seniors — but in his nerves he dropped a place from the millions. What scared him wasn’t a scolding — it was that if everyone knew he could muddle place values, they’d never let him touch his beloved board again.' },
        { zh: '安安沒有罵牠，反而蹲下來，用厚紙板做了一把「位值對照尺」：千萬、百萬、十萬、萬……一格一格又大又清楚，輸入前先比一比，位值再也不會迷路。阿北站長更宣布：從今天起，嘟嘟就是台北車站的「位值小老師」，專門教新來的夥伴讀大數。「不會不丟臉，」阿北拍拍牠，「藏起來才會出大錯。」',
          en: 'An-An didn’t scold him. She knelt down and built a cardboard “place-value ruler”: ten-millions, millions, hundred-thousands, ten-thousands… big and clear, one slot at a time — line it up before typing and no digit gets lost again. And Ah-Bei announced: from today, Dudu is Taipei Station’s “place-value tutor,” teaching every new hire to read big numbers. “Not knowing isn’t shameful,” Ah-Bei patted him, “hiding it is what causes the big mistakes.”' },
        { zh: '晚上，山頂樹屋的視訊接通，阿基教授瞇著眼睛笑：「讀大數就像認朋友——先看清楚它站在哪一位。嘟嘟不是不會，只是需要一把好尺。」畫面外傳來院長和典典搶著揮手的聲音。對了，台灣小知識：台北捷運一天真的載運超過 200 萬人次——大數不在課本裡，它天天在月台上跑來跑去呢！小Q對著鏡頭挺起胸膛：「漫遊台灣第一站，破案！」',
          en: 'That night the treehouse video call connects, and Professor Archie beams: “Reading big numbers is like recognising friends — first see where each one stands. Dudu was never unable; he just needed a good ruler.” Off-screen, the Principal and Dean Archive fight over the camera to wave. Taiwan fact of the day: the Taipei MRT really carries over 2,000,000 riders daily — big numbers don’t live in textbooks, they run laps around the platforms! Little Q puffs up at the lens: “Roaming Taiwan, stop one — case closed!”' },
      ],
      arcClue: { zh: '第一片台灣拼圖拼上！隔天清晨，月台盡頭多了一雙短短的小腳印🐾，旁邊放著一小盒還溫著的鐵路便當——是誰？影子矮矮短短、耳朵垂垂的，一溜煙鑽進人群不見了。小Q歪著頭：「那不是貓……貓的腿沒那麼短。」安安撿起便當，笑了：「牠好像……很想讓我們吃飽。」',
                 en: 'The first puzzle piece snaps into place! At dawn, a pair of short little paw prints 🐾 appears at the end of the platform, beside a still-warm railway lunchbox — whose? The shadow was low and floppy-eared, gone into the crowd in a blink. Little Q tilts his head: “That’s no cat… cats aren’t that short-legged.” An-An picks up the lunchbox and smiles: “It’s almost like… it wanted to make sure we ate well.”' },
      nextPreview: { zh: '下一站——桃園大溪！陀螺的故鄉，木藝工坊的雕刻角度全跑掉，大陀螺怎麼打都轉歪。而那雙短短的小腳印，好像在大溪特別多、特別放鬆，還在大漢溪邊的老三合院門口打了個滾……',
                     en: 'Next stop — Daxi, Taoyuan! The hometown of spinning tops, where the woodcraft workshop’s carving angles have all gone askew and the great top wobbles no matter how it’s spun. And those short little paw prints seem especially many here, especially at ease — one even rolled over by an old courtyard house beside the Dahan River…' },
      reward: 500,
    },
  ],
}

// 台灣拼圖：12 片縣市拼圖（終章拼滿＝漫遊台灣名偵探）
export const PUZZLE_BOARD = [
  { id: 'taipei',    emoji: '🏙️', name: { zh: '台北片', en: 'Taipei Piece' } },
  { id: 'taoyuan',   emoji: '🌀', name: { zh: '桃園片', en: 'Taoyuan Piece' } },
  { id: 'miaoli',    emoji: '🐆', name: { zh: '苗栗片', en: 'Miaoli Piece' } },
  { id: 'taichung',  emoji: '🌞', name: { zh: '台中片', en: 'Taichung Piece' } },
  { id: 'changhua',  emoji: '🍥', name: { zh: '彰化片', en: 'Changhua Piece' } },
  { id: 'penghu',    emoji: '🐚', name: { zh: '澎湖片', en: 'Penghu Piece' } },
  { id: 'chiayi',    emoji: '🍗', name: { zh: '嘉義片', en: 'Chiayi Piece' } },
  { id: 'tainan',    emoji: '🏯', name: { zh: '台南片', en: 'Tainan Piece' } },
  { id: 'kaohsiung', emoji: '🚢', name: { zh: '高雄片', en: 'Kaohsiung Piece' } },
  { id: 'pingtung',  emoji: '🐟', name: { zh: '屏東片', en: 'Pingtung Piece' } },
  { id: 'taitung',   emoji: '🎈', name: { zh: '台東片', en: 'Taitung Piece' } },
  { id: 'yilan',     emoji: '🍜', name: { zh: '宜蘭片', en: 'Yilan Piece' } },
]
