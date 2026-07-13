// 長篇連續劇 第五季《安安偵探社 · 環遊世界大冒險》
// The An-An Detective Agency — Season 5: Around the World
//
// 邏輯偵探學院畢業後的新篇章：阿基教授交付一張畫滿航線的舊世界地圖，
// 安安帶著小Q（第一次當前輩！）環遊世界十二站，每站一樁數學案件。
// 定位＝加強四年級上學期數學（翰林版）：1~6 關課本紮實、第 7、8 關挑戰星題★。
// 結構同 S1~S4（資料驅動、中英雙語、每集 8 現場、破案指認），差異：
//   每集蓋一枚「環遊紀念章」stamp（PASSPORT_BOARD 拼環遊世界護照），集滿 12 枚＝環球名偵探。
//   每集彩蛋＝世界×數學小知識（比照 S4 邏輯知識）。
//   裏層主線：小信天翁飛飛🕊️——四十年來替全世界的孩子保管寄不出的感謝卡，
//   每集留同一痕跡：未署名的感謝卡✉️＋白色大翅膀的影子。
//   巡巡教官＝國際偵探聯盟聯絡官（本季正面幫手），每站發來委託電報。
//
// 完整劇本見 docs/season5-劇本.md（12 集案名、答案、裏層節拍全定稿）。
// ★ 真推理鐵則（S3 EP2 起）：scene.clueNote{zh,en}＝該現場的關鍵數字（證據板）、
//   suspects[].say{zh,en}＝說詞藏數字；accuse 不爆雷，孩子自己抓矛盾。
// ★ choice 節點：每集一個，兩分支同答案。episode id 用 's5ep*' 前綴。

export const SEASON5 = {
  id: 'season5',
  title: { zh: '環遊世界大冒險', en: 'Around the World' },
  emoji: '🗺️',
  seasonIntro: [
    { zh: '畢業典禮後的第一個早晨，阿基教授把兩樣東西放進安安手裡：一張畫滿航線的舊世界地圖，和《我與小Q環遊世界》的手稿原本。「當年我們環遊世界，每一站都欠下了人情。我老了，飛不動了——安安，帶著小Q，替我去看看那些老朋友。對了，路上如果收到『沒有署名的信』……幫我好好收著。」',
      en: 'On the first morning after graduation, Professor Archie places two things in An-An’s hands: an old world map covered in flight routes, and the original manuscript of “Around the World with Little Q”. “Back then, we owed a kindness at every stop. I’m too old to fly now — An-An, take Little Q and visit those old friends for me. Oh, and if any unsigned letters find you on the way… keep them safe for me.”' },
    { zh: '出發那天，全體寵物排排站送行：LULU 叼來旅行帽，小星、小月、小冥擠在窗邊揮手，小Q站在安安肩膀上，胸口的羽毛挺得高高的——這可是牠第一次當前輩！「地、地圖我來看！路我來認！」（翅膀其實在微微發抖。）',
      en: 'On departure day, the whole pet family lines up to wave goodbye: LULU fetches the travel hat, Twinkle, Luna and Little Pluto crowd the window, and Little Q stands tall on An-An’s shoulder, chest feathers puffed — his first time being the senior! “I—I’ll read the map! I’ll find the way!” (His wings are trembling, just a little.)' },
    { zh: '巡巡教官在碼頭等著，遞來一封蓋著火漆印的電報：「國際偵探聯盟，任命安安為環球特派偵探。十二站，十二枚紀念章——蓋滿這本環遊世界護照，你就是環球名偵探。第一站的委託已經到了：東京，出發！」汽笛長鳴，世界在前面等著。',
      en: 'Officer Prowl waits at the pier with a wax-sealed telegram: “The International Detective League hereby appoints An-An as Globetrotting Detective. Twelve stops, twelve stamps — fill this world passport and you shall be the Great Globetrotting Detective. The first commission is already in: Tokyo. Depart!” The ship’s horn sounds long and deep — the world is waiting.' },
  ],

  episodes: [
    // ─────────────────────────────────────── S5 EP1 ───────────────────────────────────────
    {
      id: 's5ep1',
      no: 1,
      title: { zh: '東京車站的大數看板', en: 'The Big-Number Board of Tokyo Station' },
      emoji: '🗾',
      accent: '#d64f4f',
      difficulty: { zh: '大數入門（一億以內）', en: 'Large numbers within 100 million' },
      stamp: { id: 'tokyo', emoji: '🗾', name: { zh: '東京章', en: 'Tokyo Stamp' } },
      intro: [
        { zh: '環球第一站——東京！才踏出新幹線，車站就亂成一鍋粥：挑高大廳正中央的乘客人數電子看板，整面變成閃爍的亂碼，廣播一遍一遍道歉，旅客在月台上塞成人山人海。巡巡教官的電報追了過來：「委託電報第 1 號：東京車站大數看板故障，位值錯亂，速修！——巡巡」',
          en: 'First stop of the world tour — Tokyo! The moment they step off the bullet train, the station is in chaos: the giant passenger-count board above the main hall has dissolved into flickering garbage, apologies loop on the speakers, and travellers pile up on every platform. Officer Prowl’s telegram catches up: “Commission No. 1: Tokyo Station’s big-number board is down — place values scrambled. Fix it, fast! — Prowl”' },
        { zh: '站長柴犬丸丸搖著尾巴迎上來：「偵探！看板吃的是『大數』——千萬、百萬、十萬、萬，一格一位，錯一格就全面亂碼。」小Q清清喉嚨，第一次用前輩的口氣說：「大、大數就交給我們！安安，位值一格一格對回去，就像認朋友——先看清楚它站在哪一位！」查案兼修看板，開始！',
          en: 'Stationmaster Maru-Maru the shiba wags over: “Detective! This board eats BIG numbers — ten-millions, millions, hundred-thousands, ten-thousands. One digit per slot, and one wrong slot scrambles everything.” Little Q clears his throat and tries his best senior voice: “L-leave big numbers to us! An-An, match each digit back to its place — like recognising a friend: first see WHERE it stands!” Case and repair, begin!' },
      ],
      scenes: [
        {
          place: { zh: '月台跑馬燈', en: 'The Platform Ticker' },
          emoji: '🚈',
          story: { zh: '第一塊要修的是月台跑馬燈。丸丸站長翻出手冊：「山手線一天大約載客 400 萬人——跑馬燈要顯示『最近四天總載客量』，單位是萬人。」小Q歪著頭：「四天，就是 400 萬跑四趟嘛！」',
                   en: 'First repair: the platform ticker. Maru-Maru flips his manual: “The Yamanote Line carries about 4,000,000 riders a day — the ticker shows the LAST FOUR DAYS’ total, in units of ten-thousand.” Little Q tilts his head: “Four days — that’s 4 million, four times over!”' },
          clueNote: { zh: '山手線四天載客＝1600 萬人（400 萬×4，我自己算的）', en: 'Yamanote, four days = 16,000,000 riders (4,000,000 × 4 — I worked it out myself)' },
          puzzle: {
            text: { zh: '山手線一天載客 {400} 萬人，[四天總共]載客幾萬人？（用「萬」當單位想）',
                    en: 'The Yamanote Line carries {4,000,000} (= {400} ten-thousands) riders a day. In [four days], how many ten-thousands in total?' },
            answer: 1600, unit: { zh: '萬人', en: 'ten-thousand riders' },
            hint: { zh: '把「萬」當作一個單位：400 萬×4，就跟 400×4 一樣算！', en: 'Treat “ten-thousand” as one unit: 4 million × 4 works just like 400 × 4!' },
            teach: [
              { zh: '大數的計算絕招：用「萬」當單位！400 萬人就是「400 個萬」，數字瞬間變小、變好算。',
                en: 'Big-number trick: use “ten-thousand” as your unit! 4,000,000 riders is just “400 ten-thousands” — suddenly the number is small and friendly.' },
              { zh: '四天的總載客量＝一天的 4 倍，所以是 400 萬 × 4——用萬當單位，就是 400 × 4。',
                en: 'Four days = one day × 4, so it’s 400 ten-thousands × 4 — with our unit, that’s just 400 × 4.' },
              { zh: '400 × 4……換你把跑馬燈的數字算出來（記得單位是「萬人」）！',
                en: '400 × 4… you light up the ticker (in ten-thousands)!' },
            ],
            reward: { zh: '🚈 1600 萬人！跑馬燈唰地亮回來，整條月台歡呼。丸丸站長狂搖尾巴：「不愧是聯盟派來的偵探！下一塊在大廳！」',
                      en: '🚈 16,000,000 riders! The ticker blazes back to life and the whole platform cheers. Maru-Maru’s tail goes wild: “The League sent the right detective! Next one’s in the hall!”' },
          },
        },
        {
          place: { zh: '中央大看板', en: 'The Grand Central Board' },
          emoji: '📟',
          story: { zh: '大廳正中央就是那面出事的大看板。維修口的銘牌寫著：「本板顯示東京都心一年乘客人次：62,500,000。」丸丸嘆氣：「昨晚有人更新數字之後，它就亂碼了。要重新輸入，得先讀對位值——62,500,000 的千萬位是多少？」',
                   en: 'Centre of the hall: the broken board itself. The service plate reads: “Displays downtown Tokyo’s yearly riders: 62,500,000.” Maru-Maru sighs: “Someone updated it last night, and it scrambled. To re-enter it, read the place values right — what digit sits in the ten-millions place of 62,500,000?”' },
          clueNote: { zh: '看板正確人次＝62,500,000（六千二百五十萬），千萬位是 6', en: 'Correct count = 62,500,000 (sixty-two million five hundred thousand); ten-millions digit = 6' },
          puzzle: {
            text: { zh: '看板的正確數字是 {62,500,000}。它的[千萬位]是多少？',
                    en: 'The board’s correct number is {62,500,000}. What digit is in its [ten-millions place]?' },
            answer: 6, unit: { zh: '', en: '' },
            hint: { zh: '從個位往左數：個、十、百、千、萬、十萬、百萬、千萬——第 8 位！', en: 'Count from the ones place leftwards: ones, tens, hundreds, thousands, ten-thousands, hundred-thousands, millions, ten-millions — the 8th place!' },
            teach: [
              { zh: '讀大數先畫「位值表」：從右邊個位開始，每往左一格大 10 倍——個、十、百、千、萬、十萬、百萬、千萬。',
                en: 'For big numbers, draw a place-value chart: start at the ones on the right; each step left is 10 times bigger — ones, tens, hundreds, thousands, ten-thousands, hundred-thousands, millions, ten-millions.' },
              { zh: '把 62,500,000 一格一格放進去：0、0、0、0、0、5、2、6——最左邊那個 6，站的就是千萬位。',
                en: 'Slot 62,500,000 in digit by digit: 0, 0, 0, 0, 0, 5, 2, 6 — that leftmost 6 stands in the ten-millions place.' },
              { zh: '所以千萬位的數字是……換你告訴看板！',
                en: 'So the ten-millions digit is… you tell the board!' },
            ],
            reward: { zh: '📟 千萬位是 6！看板閃了兩下，吐出一行小字：「位值校正中……」有進展！可是丸丸皺眉：「奇怪，昨晚到底是誰更新的？系統紀錄一片空白。」',
                      en: '📟 Ten-millions digit: 6! The board blinks twice and prints: “Recalibrating place values…” Progress! But Maru-Maru frowns: “Strange — WHO updated it last night? The system log is blank.”' },
          },
        },
        {
          place: { zh: '售票大廳', en: 'The Ticket Hall' },
          emoji: '🎫',
          story: { zh: '售票大廳的自動售票機也罷工了，螢幕卡在一道驗證題：「本站開業以來累計售票約三千八百萬張。請以數字輸入：三千八百萬寫成數字，一共有幾個 0？」排隊的旅客全在抓頭。',
                   en: 'The ticket machines are on strike too, stuck on a checksum: “Tickets sold since opening: thirty-eight million. Enter: written as digits, how many zeros does thirty-eight million have?” The whole queue is scratching heads.' },
          clueNote: { zh: '三千八百萬＝38,000,000，一共 6 個 0', en: 'Thirty-eight million = 38,000,000 — six zeros in all' },
          puzzle: {
            text: { zh: '「三千八百萬」寫成數字是 38,000,000——一共有[幾個] {0}？',
                    en: '“Thirty-eight million” written as digits is 38,000,000 — [how many] {0}s does it have?' },
            answer: 6, unit: { zh: '個', en: 'zeros' },
            hint: { zh: '「萬」後面跟著 4 個 0；三千八百萬＝3800 個萬，3800 自己還帶 2 個 0！', en: '“Ten-thousand” carries 4 zeros; 38 million = 3,800 ten-thousands, and 3,800 brings 2 zeros of its own!' },
            teach: [
              { zh: '中文的「萬」是大數的好幫手：寫成數字時，「萬」的後面要補 4 個 0。',
                en: 'The unit “ten-thousand (萬)” is your helper: written as digits, it adds 4 zeros after itself.' },
              { zh: '三千八百萬＝3800 萬 → 先寫 3800，再補 4 個 0：38,000,000。數數看：3800 裡有 2 個 0，後面再加 4 個。',
                en: 'Thirty-eight million = 3,800 ten-thousands → write 3800, then attach 4 zeros: 38,000,000. Count: 3800 holds 2 zeros, plus the 4 attached.' },
              { zh: '2 個＋4 個……換你輸入答案，救救售票機！',
                en: '2 + 4… you enter it and rescue the machines!' },
            ],
            reward: { zh: '🎫 6 個 0！售票機叮咚復活，旅客拍手叫好。有位兔子清潔員抱著掃把小聲說：「偵探，儲物櫃那邊……好像也怪怪的。」',
                      en: '🎫 Six zeros! The machines chime back to life to applause. A rabbit cleaner hugs her broom and whispers: “Detective… the lockers are acting odd too.”' },
          },
        },
        {
          kind: 'choice',
          place: { zh: '車站岔路口', en: 'The Station Fork' },
          emoji: '🔀',
          story: { zh: '通往控制室的路在這裡分成兩條：左邊穿過儲物櫃區，右邊經過百年紀念電子鐘。小Q攤開地圖（拿反了又急忙轉正）：「安、安安，走哪邊？」',
                   en: 'The way to the control room splits: left through the locker hall, right past the centennial clock. Little Q unfolds the map (upside down, hastily flipped): “A-An-An, which way?”' },
          question: { zh: '★ 你來決定！要走哪一邊去控制室？（兩條路都到得了，選你喜歡的！）',
                      en: '★ You decide! Which way to the control room? (Both get there — pick your favorite!)' },
          options: [
            {
              id: 'lockers',
              label: { zh: '🧳 穿過儲物櫃區', en: '🧳 Through the Locker Hall' },
              scene: {
                place: { zh: '儲物櫃區', en: 'The Locker Hall' },
                emoji: '🧳',
                story: { zh: '儲物櫃區的總表也亂了。管理板寫著：「全區儲物櫃一年租金收入共 7500 萬元。」要解鎖通道門，得回答：7500 萬元等於幾個一百萬元？',
                         en: 'The locker ledger is scrambled too. The board reads: “Yearly locker rental income: 75,000,000 yen.” To unlock the corridor: how many millions make 75,000,000?' },
                clueNote: { zh: '7500 萬＝75 個一百萬', en: '75,000,000 = 75 millions' },
                puzzle: {
                  text: { zh: '儲物櫃一年租金 {7500} 萬元——等於[幾個]一百萬元？',
                          en: 'Locker rentals: {75,000,000} yen a year — how many [millions] is that?' },
                  answer: 75, unit: { zh: '個', en: 'millions' },
                  hint: { zh: '100 萬、200 萬、300 萬……數到 7500 萬要數幾個「百萬」？7500÷100！', en: '1 million, 2 million, 3 million… how many millions to reach 75 million? 7,500 ÷ 100!' },
                  teach: [
                    { zh: '「幾個一百萬」就是問：7500 萬裡面裝了幾包「100 萬」。這是大數的「化聚」！',
                      en: '“How many millions” asks: how many bags of 1,000,000 fit inside 75,000,000? That’s regrouping big numbers!' },
                    { zh: '用萬當單位：7500 萬 ÷ 100 萬＝7500 ÷ 100。除以 100，就是把尾巴的兩個 0 拿掉。',
                      en: 'In ten-thousand units: 7,500 ÷ 100. Dividing by 100 just removes two trailing zeros.' },
                    { zh: '7500 ÷ 100……換你打開通道門！',
                      en: '7,500 ÷ 100… you open the corridor!' },
                  ],
                  reward: { zh: '🧳 75 個一百萬！通道門喀啦打開。經過最角落的儲物櫃時，安安瞄到門縫裡露出一角……白色的羽毛？比小Q的大好多。',
                            en: '🧳 75 millions! The corridor clicks open. Passing the corner locker, An-An glimpses something through the gap… a white feather? Far bigger than Little Q’s.' },
                },
              },
            },
            {
              id: 'clock',
              label: { zh: '🕐 經過百年電子鐘', en: '🕐 Past the Centennial Clock' },
              scene: {
                place: { zh: '百年紀念電子鐘', en: 'The Centennial Clock' },
                emoji: '🕐',
                story: { zh: '百年紀念電子鐘的跑馬燈驕傲地閃著：「本站開業以來，已服務旅客 75 個一百萬人次！」可是下一行的總數卻壞了。要讓鐘走下去，得答出：75 個一百萬，總共是幾萬？',
                         en: 'The centennial clock ticker flashes proudly: “Since opening, this station has served 75 millions of travellers!” But the total on the next line is broken. To keep the clock running: 75 millions is how many ten-thousands?' },
                clueNote: { zh: '75 個一百萬＝7500 萬', en: '75 millions = 75,000,000 (7,500 ten-thousands)' },
                puzzle: {
                  text: { zh: '{75} 個一百萬人次——總共是[幾萬]人次？',
                          en: '{75} millions of travellers — how many [ten-thousands] in total?' },
                  answer: 7500, unit: { zh: '萬人次', en: 'ten-thousands' },
                  hint: { zh: '1 個一百萬＝100 萬，75 個就是 75×100 萬！', en: 'One million = 100 ten-thousands, so 75 of them = 75 × 100!' },
                  teach: [
                    { zh: '先換算：1 個一百萬＝100 個萬。所以「幾個一百萬」變「幾萬」，就是 ×100。',
                      en: 'Convert first: one million = 100 ten-thousands. So millions → ten-thousands is just ×100.' },
                    { zh: '75 個一百萬＝75 × 100 萬。乘以 100，就是在尾巴加兩個 0。',
                      en: '75 millions = 75 × 100 ten-thousands. Multiplying by 100 adds two zeros.' },
                    { zh: '75 × 100……換你讓百年鐘繼續走！',
                      en: '75 × 100… you keep the clock ticking!' },
                  ],
                  reward: { zh: '🕐 7500 萬人次！百年鐘噹——地響了一聲，繼續滴答。鐘頂上，好像有一道很大的白影子剛剛飛走，帶起一陣風。',
                            en: '🕐 75,000,000 travellers! The clock strikes once — DONG — and ticks on. Above it, a great white shadow seems to have just taken off, leaving a gust behind.' },
                },
              },
            },
          ],
        },
        {
          place: { zh: '轉乘天橋', en: 'The Transfer Bridge' },
          emoji: '🌉',
          story: { zh: '控制室前的轉乘天橋上，兩塊路線牌都黑了。丸丸唸出資料：「山手線今年載客 2700 萬人次，中央線 1300 萬人次——天橋的牌子要顯示兩線合計。」小Q搶答：「用萬當單位，加起來就好！」',
                   en: 'On the transfer bridge before the control room, both line signs are dark. Maru-Maru reads the data: “Yamanote this year: 27,000,000 rides. Chuo Line: 13,000,000. The sign shows both lines COMBINED.” Little Q jumps in: “Ten-thousand units — just add them!”' },
          clueNote: { zh: '兩線合計＝4000 萬人次（2700 萬＋1300 萬）', en: 'Two lines combined = 40,000,000 (27,000,000 + 13,000,000)' },
          puzzle: {
            text: { zh: '山手線 {2700} 萬人次＋中央線 {1300} 萬人次——[兩線合計]幾萬人次？',
                    en: 'Yamanote {27,000,000} + Chuo {13,000,000} — how many [ten-thousands] combined?' },
            answer: 4000, unit: { zh: '萬人次', en: 'ten-thousand rides' },
            hint: { zh: '用萬當單位：2700＋1300，跟平常的加法一樣！', en: 'In ten-thousand units it’s just 2,700 + 1,300 — ordinary addition!' },
            teach: [
              { zh: '大數加法別怕：只要單位一樣（都是「萬」），就跟普通加法一模一樣。',
                en: 'Adding big numbers isn’t scary: with matching units (both in ten-thousands), it’s ordinary addition.' },
              { zh: '2700 萬＋1300 萬＝(2700＋1300) 萬。先加千位：2000＋1000＝3000；再加百位：700＋300＝1000。',
                en: '27 million + 13 million = (2,700 + 1,300) ten-thousands. Thousands first: 2,000 + 1,000 = 3,000; then hundreds: 700 + 300 = 1,000.' },
              { zh: '3000＋1000……換你點亮天橋的路線牌！',
                en: '3,000 + 1,000… you light the bridge sign!' },
            ],
            reward: { zh: '🌉 4000 萬人次！兩塊路線牌同時亮起，橋下的旅客發出「哇——」的讚嘆。控制室就在眼前了。',
                      en: '🌉 40,000,000 rides! Both signs flare on together and the crowd below goes “Whoa—!” The control room is just ahead.' },
          },
        },
        {
          place: { zh: '車站郵局', en: 'The Station Post Office' },
          emoji: '📮',
          story: { zh: '控制室隔壁是小小的車站郵局。郵局熊局長攔住安安：「偵探幫幫忙！百年紀念郵票印了 8000 萬張，賣出 650 萬張，庫存牌卻壞了——還剩幾萬張？」小Q盯著滿牆的郵票，眼睛發亮：「好漂亮的郵票……咦，這張圖案怎麼是一隻大白鳥？」',
                   en: 'Next to the control room sits a tiny post office. Chief Bear stops An-An: “Detective, help! We printed 80,000,000 centennial stamps and sold 6,500,000 — but the stock sign broke. How many ten-thousands remain?” Little Q stares at the stamp wall, eyes shining: “So pretty… wait, why is this one a big white bird?”' },
          clueNote: { zh: '紀念郵票庫存＝7350 萬張（8000 萬−650 萬）', en: 'Stamp stock = 73,500,000 (80,000,000 − 6,500,000)' },
          puzzle: {
            text: { zh: '紀念郵票印了 {8000} 萬張，賣出 {650} 萬張——[還剩]幾萬張？',
                    en: 'Printed {80,000,000} stamps, sold {6,500,000} — how many [ten-thousands] remain?' },
            answer: 7350, unit: { zh: '萬張', en: 'ten-thousand stamps' },
            hint: { zh: '用萬當單位：8000−650。從 8000 先減 600，再減 50！', en: 'In ten-thousand units: 8,000 − 650. Take 600 first, then 50!' },
            teach: [
              { zh: '大數減法一樣用「萬」當單位：8000 萬−650 萬＝(8000−650) 萬。',
                en: 'Big-number subtraction, same trick: 80 million − 6.5 million = (8,000 − 650) ten-thousands.' },
              { zh: '分兩步減比較穩：8000−600＝7400，再 7400−50＝7350。',
                en: 'Two steady steps: 8,000 − 600 = 7,400, then 7,400 − 50 = 7,350.' },
              { zh: '所以還剩……換你把庫存牌修好！',
                en: 'So the stock is… you fix the sign!' },
            ],
            reward: { zh: '📮 7350 萬張！熊局長鞠躬道謝，送了安安一張大白鳥郵票：「這是信天翁喔，全世界飛最遠的鳥——牠們可是郵差的守護神。」小Q把郵票收得好好的。',
                      en: '📮 73,500,000 stamps! Chief Bear bows deep and gifts An-An the white-bird stamp: “An albatross — the farthest-flying bird in the world. Postmen call them their guardian.” Little Q tucks it away with great care.' },
          },
        },
        {
          place: { zh: '控制室的一億挑戰 ★', en: 'The Control Room’s 100-Million Challenge ★' },
          emoji: '🖥️',
          story: { zh: '控制室到了！主機重啟需要最高權限密語。螢幕浮出挑戰星題：「本系統最大可顯示『一億』。請問：一億是幾個一百萬？」丸丸倒抽一口氣：「這是站長級的題目啊……」小Q握拳：「安安，星題★！用位值想！」',
                   en: 'The control room! Rebooting needs the master passphrase. The screen floats a star challenge: “This system displays up to ONE HUNDRED MILLION. Question: how many millions make one hundred million?” Maru-Maru gasps: “That’s a stationmaster-level question…” Little Q clenches a wing: “An-An, star problem ★! Think in place values!”' },
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
            reward: { zh: '🖥️ 100 個一百萬！主機嗡——地重啟，風扇轉了起來。螢幕卻跳出最後一道防線：「請插入備用主機板（存放於遺失物保管室）」。最後一站！',
                      en: '🖥️ 100 millions! The mainframe hums awake, fans spinning. Then one last gate appears: “Insert backup mainboard (stored in Lost & Found).” Final stop!' },
          },
        },
        {
          place: { zh: '遺失物保管室的行李箱 ★', en: 'The Lost & Found Suitcase ★' },
          emoji: '📦',
          story: { zh: '遺失物保管室裡，備用主機板鎖在一只老行李箱中。掛牌寫著站長設的謎題密碼：「用 5、0、8、3 這四張數字卡，各用一次，排出最大的四位數。」小Q把四張卡攤在地上排來排去：「最大的要當老大，站最前面……」',
                   en: 'In Lost & Found, the backup mainboard sits locked in an old suitcase. The tag holds the stationmaster’s riddle code: “Using the four digit cards 5, 0, 8, 3 — each exactly once — arrange the LARGEST four-digit number.” Little Q shuffles the cards on the floor: “The biggest one leads the way…”' },
          clueNote: { zh: '行李箱密碼＝8530（5、0、8、3 排出的最大四位數，我自己排出來的）', en: 'Suitcase code = 8530 (largest four-digit number from 5, 0, 8, 3 — I arranged it myself)' },
          puzzle: {
            text: { zh: '★ 挑戰星題：用 {5}、{0}、{8}、{3} 各一次，排出[最大的四位數]＝行李箱密碼！',
                    en: '★ Star challenge: use {5}, {0}, {8}, {3} once each — the [largest four-digit number] is the code!' },
            answer: 8530, unit: { zh: '', en: '' },
            hint: { zh: '想拿最大，就把最大的數字放最高位：千位放 8，接著由大到小排下去！', en: 'Want the max? Put the biggest digit in the highest place: 8 in the thousands, then descend!' },
            teach: [
              { zh: '排最大數的訣竅：位值越高影響越大，所以「最大的數字站最高位」。四張卡由大到小：8＞5＞3＞0。',
                en: 'Key idea: higher places matter more, so the biggest digit takes the highest place. Sort the cards: 8 > 5 > 3 > 0.' },
              { zh: '由大到小填進千、百、十、個位：千位 8、百位 5、十位 3、個位 0。（0 千萬不能帶頭，帶頭就變三位數啦！）',
                en: 'Fill thousands, hundreds, tens, ones from big to small: 8, 5, 3, 0. (Zero must never lead — a leading 0 shrinks it to three digits!)' },
              { zh: '8、5、3、0 連起來……換你解開行李箱！',
                en: '8, 5, 3, 0 in a row… you crack the suitcase!' },
            ],
            reward: { zh: '🧳 8530！行李箱彈開，備用主機板閃閃發亮。換上主機板，大看板轟然復活——「62,500,000」端端正正亮在大廳上空，全車站掌聲雷動！可是安安合上偵探筆記：「看板是修好了……但『誰弄亂的』還沒破案。該去會一會關係人了——讓數字說話。」',
                      en: '🧳 8530! The suitcase springs open — the backup mainboard gleams. One swap later, the grand board thunders back: “62,500,000” shines true above the hall to a storm of applause! But An-An snaps the casebook shut: “The board is fixed… but WHO scrambled it is still open. Time to meet the persons of interest — and let the numbers talk.”' },
          },
        },
      ],
      suspects: [
        {
          id: 'momo', name: { zh: '站務員小鼴鼠摩摩', en: 'Momo the Mole Station Clerk' }, emoji: '🐹',
          say: { zh: '「我、我昨晚是有巡到控制室，但我什麼都沒碰！看板亂碼前顯示的應該是 625 萬吧……啊、不是，我是說，大概、大概是我猜的啦！」',
                 en: '“I—I did pass the control room last night, but I touched NOTHING! Before it scrambled, the board must have shown 6,250,000… ah—no, I mean, that’s just, just a guess!”' },
        },
        {
          id: 'maru', name: { zh: '站長柴犬丸丸', en: 'Stationmaster Maru-Maru the Shiba' }, emoji: '🐕',
          say: { zh: '「山手線一天約 400 萬人、四天 1600 萬——這些數字我天天廣播，絕對錯不了。看板亂碼後，我第一時間就把控制室鎖上了，鑰匙只有站務人員有。」',
                 en: '“About 4,000,000 riders a day on the Yamanote — 16,000,000 in four days. I announce these numbers daily; they’re never wrong. The moment the board scrambled, I locked the control room — only station staff hold keys.”' },
        },
        {
          id: 'sao', name: { zh: '清潔員兔子小掃', en: 'Sweep the Rabbit Cleaner' }, emoji: '🐰',
          say: { zh: '「我凌晨在儲物櫃區打掃，親眼看到租金總表寫 7500 萬，剛好是 75 個一百萬，一毛不差！控制室我進不去，我沒有鑰匙呀。」',
                 en: '“I was cleaning the locker hall at dawn — the rental ledger read 75,000,000, exactly 75 millions, not a yen astray! I can’t even enter the control room; I hold no key.”' },
        },
      ],
      culprit: 'momo',
      accuse: { zh: '看板一夜亂碼，三位關係人都說了自己記得的數字。翻開證據板一條一條對——看板該顯示的正確人次，是你親手校正的六千二百五十萬（62,500,000）。可是有一個人嘴裡說出的，是個「千萬位掉到百萬位」的數字……亂碼的看板誰都讀不到，會知道那個錯誤數字的，只有把它親手輸進去的人。是誰？',
                en: 'The board scrambled overnight, and all three told the numbers they remember. Open your evidence notes and check line by line — the correct count, which YOU recalibrated, is 62,500,000. Yet someone quoted a number whose ten-millions digit slid down to the millions place… nobody could read the scrambled board, so only the one who TYPED that wrong number could know it. Who?' },
      wrongAccuse: { zh: '這位說的數字跟你的證據板都對得上喔（四天 1600 萬人、7500 萬＝75 個一百萬，你都親自算過是真的）。再聽一次三個人的話——看板正確是六千二百五十萬，卻有人說出「六百二十五萬」：少了一個 0、千萬變百萬。這個輸錯的數字，只有誰見過呢？🐹',
                     en: 'This one’s numbers all match your notes (16,000,000 in four days, and 75,000,000 = 75 millions — you verified both yourself). Listen again — the true count is 62,500,000, yet someone said “6,250,000”: one zero short, ten-millions turned millions. Who alone could have SEEN that wrong number? 🐹' },
      solve: [
        { zh: '把數字輸錯的，是站務員小鼴鼠摩摩！🐹 牠說「什麼都沒碰」，卻說得出「625 萬」——看板一亂碼誰都讀不到，只有親手輸入的人，才會知道那個錯誤的數字。62,500,000 的千萬位 6，被牠輸到了百萬位，少了一個 0，整面看板當場罷工。',
          en: 'The number-typer was Momo the mole clerk! 🐹 He claimed he “touched nothing,” yet quoted “6,250,000” — once the board scrambled nobody could read it, so only the one who typed it could know that wrong number. The 6 of 62,500,000 slid from ten-millions to millions, one zero short — and the whole board went on strike.' },
        { zh: '摩摩紅著眼睛承認了：鼴鼠的視力本來就不好，位值表上密密麻麻的格子，牠常常要瞇很久。昨晚更新數字時看錯一格，怕的不是被罵——是怕大家知道牠「看不清楚」以後，就不讓牠碰最愛的看板了。牠可是全站每天最早到的站務員啊。',
          en: 'Momo confessed, eyes red: moles never see well, and the crowded place-value grid makes him squint forever. Last night he misread one slot. What scared him wasn’t a scolding — it was that if everyone knew he couldn’t see clearly, they’d never let him touch his beloved board again. He’s the first clerk at the station every single morning.' },
        { zh: '安安沒有罵牠，反而蹲下來，用厚紙板做了一把「位值對照尺」：千萬、百萬、十萬、萬……一格一格又大又清楚，輸入前先比一比，位值再也不會迷路。丸丸站長則宣布：車站送摩摩一副新眼鏡——鏡片圓圓亮亮的，跟學院送噹噹爺爺的那副，是同一家店做的呢。',
          en: 'An-An didn’t scold him. She knelt down and built a cardboard “place-value ruler”: ten-millions, millions, hundred-thousands, ten-thousands… big, clear, one slot at a time — line it up before typing and no digit gets lost again. And Maru-Maru announced the station’s gift: new glasses for Momo — round, bright lenses from the very same shop that made Grandpa Ding-Dong’s pair back at the academy.' },
        { zh: '晚上，山頂樹屋的視訊接通，阿基教授瞇著眼睛笑：「讀大數就像認朋友——先看清楚它站在哪一位。摩摩不是不會，只是需要一把好尺。」畫面外傳來院長和典典搶著揮手的聲音。對了，世界小知識：山手線一天真的載客約 400 萬人——大數不在課本裡，它天天在月台上跑來跑去呢！小Q對著鏡頭挺起胸膛：「第一站，破案！」',
          en: 'That night the treehouse video call connects, and Professor Archie beams: “Reading big numbers is like recognising friends — first see where each one stands. Momo was never unable; he just needed a good ruler.” Off-screen, the Principal and Dean Archive fight over the camera to wave. World fact of the day: the Yamanote Line really does carry about 4,000,000 riders daily — big numbers don’t live in textbooks, they run laps around the platforms! Little Q puffs up at the lens: “Stop one — case closed!”' },
      ],
      arcClue: { zh: '第一枚紀念章蓋進護照！隔天清晨，安安的背包側袋裡多了一張沒有署名的感謝卡✉️：「四十年前，有位山羊偵探幫我找回走失的妹妹。謝謝他。——東京 一位大哥哥」。抬頭——一道白色大翅膀的影子掠過月台上空，快得像一陣風。小Q瞇起眼睛：「那不是鴿子……鴿子沒有那麼大。」',
                 en: 'The first stamp is pressed into the passport! At dawn, an unsigned thank-you card ✉️ appears in An-An’s side pocket: “Forty years ago, a goat detective found my lost little sister. Thank him for me. — A big brother, Tokyo.” Overhead — the shadow of great white wings sweeps the platform, quick as wind. Little Q narrows his eyes: “That’s no pigeon… pigeons are never that big.”' },
      nextPreview: { zh: '下一站——印度！香料市集的百年帳本被打翻，訂單全亂，乘法直式就是救命稻草。而市集帳篷的頂上，那道白色的影子，好像又停了一下……',
                     en: 'Next stop — India! The spice market’s century-old ledger is knocked flying and every order scrambled — long multiplication to the rescue. And atop the market tents, that white shadow seems to pause again…' },
      reward: 500,
    },
  ],
}

// 環遊世界護照：12 枚紀念章（終章蓋滿＝環球名偵探）
export const PASSPORT_BOARD = [
  { id: 'tokyo',   emoji: '🗾', name: { zh: '東京章', en: 'Tokyo Stamp' } },
  { id: 'india',   emoji: '🕌', name: { zh: '印度章', en: 'India Stamp' } },
  { id: 'egypt',   emoji: '🐪', name: { zh: '埃及章', en: 'Egypt Stamp' } },
  { id: 'italy',   emoji: '🍕', name: { zh: '義大利章', en: 'Italy Stamp' } },
  { id: 'kenya',   emoji: '🦁', name: { zh: '肯亞章', en: 'Kenya Stamp' } },
  { id: 'voyage',  emoji: '🚢', name: { zh: '航海章', en: 'Voyage Stamp' } },
  { id: 'belgium', emoji: '🍫', name: { zh: '比利時章', en: 'Belgium Stamp' } },
  { id: 'france',  emoji: '🗼', name: { zh: '法國章', en: 'France Stamp' } },
  { id: 'swiss',   emoji: '⌚', name: { zh: '瑞士章', en: 'Switzerland Stamp' } },
  { id: 'usa',     emoji: '🗽', name: { zh: '美國章', en: 'USA Stamp' } },
  { id: 'brazil',  emoji: '🦜', name: { zh: '巴西章', en: 'Brazil Stamp' } },
  { id: 'taiwan',  emoji: '🧋', name: { zh: '台灣章', en: 'Taiwan Stamp' } },
]
