// 長篇連續劇 第九季《安安偵探社 · 羅馬與極光》
// The An-An Detective Agency — Season 9: Rome and the Northern Lights
//
// ★ 前八季安安去的地方都是想像的。這一季不一樣——【終點是真的】。
//   2026/11/7，安安真的會去羅馬（3 天）與芬蘭（追極光），全程約兩週。
//   所以這一季的定位是「行前導覽＋期中考後的功課銜接」，終章不是打魔王，是「你真的要出發了」。
//
// ★ 兩幕結構（一季分兩半，不拆成兩季）：
//   第一幕 EP1~EP6 羅馬篇＝人文／歷史／建築（跟 S8 的史料腦同一路，但輕鬆版）
//   第二幕 EP7~EP12 芬蘭篇＝自然／科學／光（極光＝太陽風＋地球磁場＋大氣）
//   兩幕的接縫＝「光」：萬神殿圓洞那一圈會走路的陽光 → 北方整片會發光的天空。
//
// ★ 裏層角色：羅馬萬神殿的老貓「圓圓」🐈（主題＝【想看看外面】）。
//   牠一輩子住在萬神殿裡，每天追著圓洞灑下來的那一圈光跑。牠看遍羅馬兩千年，
//   卻沒看過雪、沒看過整片會發光的天空。心願：「我一輩子只追過這一個光圈。
//   聽說北方的天空，整片都會亮起來。」→ 終章跟著安安一起去芬蘭，看見極光，入隊。
//   品牌情感第九章：走失→迷路→被遺忘→等待→想說謝謝→想分享→傳承→想被叫出名字→【想看看外面】
//
// ★ 數學：翰林版【四上】。11/3、11/4 期中考後出發，所以本季＝
//   「期中考範圍複習」＋「考後單元前導」混合，讓安安兩週不上學也接得上。
//   ⚠️ 實際期中考範圍待使用者取得學校進度表後校正（改單元標籤即可，題目數字不用動）。
//
// ★ 每集收集一張「手帳貼紙」sticker（TRAVEL_BOARD），集滿 12 張＝信物《安安的旅行手帳》。
//   ⭐ 手帳的設計重點：遊戲裡集到的東西，【到現場可以真的核對】。
//      例：遊戲教他萬神殿圓頂中央有個洞、雨會直接落進來 → 11 月站在那裡抬頭，真的有。
//
// ★ 引擎完全不用改：沿用 S3 起的真推理（clueNote 證據板＋suspects[].say 藏線索＋accuse 不爆雷）。
//   本季 suspects＝三種「說法／解釋」，只有一個講得通（同 S8 手法）。episode id 用 's9ep*' 前綴。
//
// ⚠️ 待辦：過場漫畫（comicIntro/comicSolve）本季暫缺——ComicStrip 現有 13 張背景全是大溪場景，
//    羅馬／芬蘭要另外畫。欄位是選填的（S1~S6 都沒有），先上線，背景畫好再補。
//
// 實地數字查證（2026-08-24）：萬神殿圓頂內部直徑 43 公尺，且【等於】地板到圓洞的高度；
//   圓洞直徑約 9 公尺（各家測量 8.2~9.2 略有出入，故遊戲內一律寫「約 9 公尺」）；
//   現存建築約西元 126 年完成。羅馬緯度約北緯 42 度，正午太陽高度角夏至約 70 度、11 月初約 32 度。

export const SEASON9 = {
  id: 'season9',
  title: { zh: '羅馬與極光', en: 'Rome and the Northern Lights' },
  emoji: '✈️',
  seasonIntro: [
    { zh: '期中考考完的那個下午，安安背著書包回到家，桌上放著一個牛皮紙袋。裡面是兩張機票、一本空白的手帳，還有阿基教授的字條：「這一次的委託，跟前面八次都不一樣——因為這一次，你不是用想像的。安安，你真的要出發了。」',
      en: 'The afternoon the midterms ended, An-An came home to find a brown paper envelope on the desk. Inside: two plane tickets, a blank travel notebook, and a note from Professor Archie. “This assignment is unlike the other eight — because this time, you are not imagining it. An-An, you are really going.”' },
    { zh: '「第一站，羅馬。」教授在地圖上畫了一個圈，「一座活了兩千多年的城市，地底下疊著地底下，故事疊著故事。第二站——」他的手指一路往北，越過阿爾卑斯山，越過波羅的海，停在地圖最上面那一片白，「芬蘭。北極圈附近。那裡的天空，會整片亮起來。」',
      en: '“First stop, Rome.” The Professor circles it on the map. “A city that has been alive for over two thousand years — ground beneath ground, story beneath story. Second stop—” his finger travels north, over the Alps, over the Baltic, and stops on the white expanse at the top of the map. “Finland. Near the Arctic Circle. Up there, the whole sky lights up.”' },
    { zh: '小Q🦉推了推眼鏡：「兩週。安安，這兩週你不會在教室裡——所以這本手帳，就是你的教室。」牠把手帳翻開第一頁，上面只有一行字：【第 1 站 · 羅馬 · 萬神殿】。窗外，行李箱已經立在門口。飛飛🕊️在天上盤旋了一圈，興奮得不得了：「這條航線我熟！跟我來！」',
      en: 'Little Q 🦉 pushes up his glasses: “Two weeks. An-An, for two weeks you will not be in a classroom — so this notebook IS your classroom.” He opens it to the first page, which bears a single line: Stop 1 · Rome · The Pantheon. Outside, the suitcase already stands by the door. Feifei 🕊️ wheels overhead, beside herself with excitement: “I know this route! Follow me!”' },
  ],

  episodes: [
    // ─────────────────────────────────────── S9 EP1 ───────────────────────────────────────
    {
      id: 's9ep1',
      comicIntro: [
        { bg: 'romestreet', cast: ['anan', 'feifei'],
          say: { zh: '飛機落地羅馬。石板路又窄又舊，十一月的天空卻藍得發亮。',
                 en: 'The plane lands in Rome. The cobbled lanes are narrow and old, yet the November sky is dazzling blue.' } },
        { bg: 'pantheon', cast: ['anan', '🧔', '🐈'],
          say: { zh: '導遊爺爺急著說：「四十年來光圈都落在門口，今天卻跑掉了！」光圈裡蹲著一隻橘貓。',
                 en: 'The old guide frets: "For forty years the light circle fell at the doorway — today it wandered off!" A ginger cat sits inside the light.' } },
      ],
      comicSolve: [
        { bg: 'pantheon', cast: ['anan', '☀️'],
          say: { zh: '安安指著照片牆：「爺爺，你四十年只在夏天拍——十一月的太陽低了 38 度啊。」',
                 en: 'An-An points at the photo wall: "Grandpa, for forty years you only shot in summer — the November sun sits 38 degrees lower."' } },
        { bg: 'pantheon', cast: ['anan', '🐈'],
          say: { zh: '橘貓圓圓走到門檻前停住，望著外面的天空，輕輕喵了一聲。〈手帳貼紙 1 · 萬神殿〉',
                 en: 'Yuan-Yuan stops at the threshold, gazing at the sky outside, and gives the softest mew. Sticker 1 — The Pantheon.' } },
      ],
      no: 1,
      title: { zh: '會走路的光圈', en: 'The Circle of Light That Walks' },
      emoji: '🏛️',
      accent: '#c9a24b',
      difficulty: { zh: '乘法·四則併式·角度·除法·小數（四上）', en: 'Times · combined ops · angles · division · decimals (Grade 4-1)' },
      sticker: { id: 'pantheon', emoji: '🏛️', name: { zh: '手帳貼紙 1 · 萬神殿', en: 'Sticker 1 · The Pantheon' } },
      intro: [
        { zh: '飛機降落羅馬。走出機場的那一刻，空氣是暖的，天空藍得不像十一月。石板路又窄又舊，一路走到一個廣場，抬頭——一棟灰灰的大房子立在那裡，前面十六根巨大的石柱，撐著一個三角形的屋頂。飛飛壓低聲音：「安安，這棟房子，比你阿公的阿公的阿公……還要老一千倍。」',
          en: 'The plane lands in Rome. Stepping out of the airport, the air is warm and the sky far too blue for November. The cobbled lanes are narrow and old, and they open onto a square — and there it stands: a great grey building fronted by sixteen enormous stone columns holding up a triangular roof. Feifei lowers her voice: “An-An, this house is a thousand times older than your grandfather’s grandfather’s grandfather.”' },
        { zh: '門口坐著一位白鬍子導遊爺爺，正拿著一疊老照片發愁。看到安安他們，他眼睛一亮：「小偵探！你們來得正好。我在這裡帶團四十年了，每天中午，屋頂那個圓洞會灑下一圈陽光，剛剛好落在門口。四十年來從沒錯過。可是今天——」他指著地上，「光圈跑到那邊去了！我的老照片明明不是這樣的！是不是這棟房子被人動過手腳？」',
          en: 'By the entrance sits a white-bearded old guide, frowning over a stack of old photographs. He brightens at the sight of them: “Little detectives! You come at the perfect moment. I have guided here forty years. Every day at noon, a circle of sunlight falls through the hole in the roof and lands right at the doorway. Forty years, never once wrong. But today—” he points at the floor, “—the circle has wandered over THERE! My old photos do not look like this at all. Has someone tampered with this building?”' },
      ],
      scenes: [
        // 1 🗺️ 走過去：比例尺＋乘法
        {
          place: { zh: '🗺️ 從飯店走過去', en: '🗺️ Walking from the Hotel' },
          emoji: '🗺️',
          diagram: 'scale-bar',
          story: { zh: '出發前，小Q先教安安看羅馬的街道圖：「這裡的巷子又窄又彎，看地圖比看手機好用。」牠指著比例尺：「圖上 {1} 公分＝實際 {200} 公尺。從我們住的地方走到萬神殿，圖上量起來 {6} 公分。」飛飛在窗外喊：「用走的就到囉！羅馬這種老城，走路最快！」',
                   en: 'Before setting off, Little Q teaches An-An to read a Roman street map: “The lanes here are narrow and crooked — a map beats a phone.” He points to the scale: “{1} cm on the map = {200} m in reality. From where we are staying to the Pantheon measures {6} cm.” Feifei calls from the window: “Walkable! In an old city like Rome, walking is fastest!”' },
          clueNote: { zh: '飯店→萬神殿＝1200 公尺（圖上 6 公分 × 每公分 200 公尺）', en: 'Hotel → Pantheon = 1200 m (6 cm × 200 m per cm)' },
          puzzle: {
            text: { zh: '[比例尺]：圖上 {1} 公分＝實際 {200} 公尺。量得 {6} 公分，實際是幾公尺？',
                    en: '[Scale]: {1} cm = {200} m. Measured {6} cm — how many metres in reality?' },
            answer: 1200, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '每 1 公分換 200 公尺，6 公分就是 200 × 6！', en: 'Each cm becomes 200 m, so 6 cm is 200 × 6!' },
            teach: [
              { zh: '比例尺告訴你：地圖上的 1 公分，代表實際多長。這張羅馬街道圖：1 公分＝200 公尺。',
                en: 'A scale tells you what 1 cm on the map means in reality. On this Rome street map: 1 cm = 200 m.' },
              { zh: '圖上量到 6 公分，就是 6 個「200 公尺」：200 × 6。',
                en: 'You measured 6 cm — six lots of 200 m: 200 × 6.' },
              { zh: '200 × 6：先算 2 × 6 ＝ 12，再補回兩個 0……換你算出實際幾公尺！',
                en: '200 × 6: work out 2 × 6 = 12, then put the two zeros back… you find the metres!' },
            ],
            reward: { zh: '🗺️ 1200 公尺！大約走十五分鐘。小Q把數字寫進手帳第一頁：「安安，記住這個習慣——每到一個地方，先知道自己走了多遠。」（十一月你真的會走這一段喔！）',
                      en: '🗺️ 1200 m — about a fifteen-minute walk. Little Q writes it on the notebook’s first page: “An-An, build this habit — wherever you go, know how far you walked.” (In November, you will really walk this!)' },
          },
        },
        // 2 🏛️ 十六根柱子：四則併式
        {
          place: { zh: '🏛️ 十六根大石柱', en: '🏛️ The Sixteen Columns' },
          emoji: '🏛️',
          story: { zh: '導遊爺爺領著大家走進前廊，仰頭看那些柱子：「這些柱子每一根都是整塊石頭，從埃及運過來的，一根重得像好幾十頭大象。」安安數了數：「前面那排有 {8} 根，後面還有 {2} 排，每排 {4} 根。」爺爺笑了：「數得好！算算看一共幾根——這是進門的第一道題。」',
                   en: 'The old guide leads them into the portico, gazing up at the columns: “Each one is a single block of stone, shipped all the way from Egypt — each as heavy as dozens of elephants.” An-An counts: “The front row has {8}, and behind there are {2} more rows of {4} each.” The guide grins: “Well counted! Work out the total — that is the first riddle at the door.”' },
          clueNote: { zh: '前廊共 16 根石柱（前排 8 ＋ 後面 2 排 × 4）', en: 'Portico has 16 columns (front row 8 + 2 rows × 4)' },
          puzzle: {
            text: { zh: '前排 {8} 根，後面 {2} 排、每排 {4} 根。[一共]幾根柱子？',
                    en: 'Front row {8}, plus {2} rows of {4} behind. How many columns [in all]?' },
            answer: 16, unit: { zh: '根', en: 'columns' },
            hint: { zh: '先算後面：2 排 × 4 根＝8 根，再加前排的 8 根！', en: 'Do the back first: 2 rows × 4 = 8, then add the front 8!' },
            teach: [
              { zh: '這種題要「先乘後加」：後面 2 排、每排 4 根，先乘起來 → 2 × 4 ＝ 8 根。',
                en: 'Multiply before you add: 2 rows of 4 behind → 2 × 4 = 8 columns.' },
              { zh: '再把前排的 8 根加上去：8 ＋ 8。寫成一個算式就是 8 ＋ 2 × 4。',
                en: 'Then add the front row’s 8: 8 + 8. As one expression: 8 + 2 × 4.' },
              { zh: '記住規則：算式裡有乘有加，[先算乘法]；換你算出一共幾根柱子！',
                en: 'Remember the rule: with both × and +, [do the multiplying first]. You find the total!' },
            ],
            reward: { zh: '🏛️ 16 根！爺爺點頭：「兩千年了，一根都沒少。」安安伸手摸了摸柱子，冰冰涼涼的。（十一月你也可以摸摸看——真的可以摸。）',
                      en: '🏛️ 16! The guide nods: “Two thousand years, and not one missing.” An-An reaches out and touches a column — cool to the palm. (In November you can touch it too — you really can.)' },
          },
        },
        // 3 🔬 圓洞的光圈：角度＋除法（圓圓的主場）
        {
          place: { zh: '🔬 屋頂上的圓洞', en: '🔬 The Hole in the Roof' },
          emoji: '☀️',
          diagram: 'sun-shadow',
          story: { zh: '走進大廳，安安整個人愣住——頭頂上是一個巨大的半圓屋頂，正中央開著一個圓洞，一道陽光像柱子一樣直直灑下來，在地板上照出一圈亮亮的光。而光圈裡，蹲著一隻胖胖的橘貓，瞇著眼睛，一動也不動。導遊爺爺笑說：「那是圓圓，牠住在這裡好多年了。每天就跟著這圈光跑，光走到哪，牠就跟到哪。」小Q觀察了一會兒：「安安，太陽從東邊升、西邊落，所以這圈光也會跟著在地板上慢慢『走』。假設它繞完一整圈是 {360} 度，總共花了 {6} 小時——平均一小時，它走幾度？」',
                   en: 'Inside the rotunda, An-An stops dead — overhead is a vast half-dome with a round hole at its very centre, and a shaft of sunlight pours straight down, painting a bright circle on the floor. And sitting in that circle is a plump ginger cat, eyes half shut, utterly still. The guide laughs: “That is Yuan-Yuan. She has lived here for years. Every day she follows that circle of light — wherever it goes, she goes.” Little Q observes a while: “An-An, the sun rises east and sets west, so the light circle ‘walks’ across the floor too. If a full turn is {360} degrees and it takes {6} hours, how many degrees per hour on average?”' },
          clueNote: { zh: '光圈平均一小時移動 60 度（360 度 ÷ 6 小時）；橘貓圓圓整天跟著光圈跑', en: 'The light circle moves 60° per hour (360° ÷ 6 h); the ginger cat Yuan-Yuan follows it all day' },
          puzzle: {
            text: { zh: '光圈繞完一整圈是 {360} 度，花了 {6} 小時。[平均]一小時移動幾度？',
                    en: 'A full turn is {360} degrees, taking {6} hours. How many degrees per hour on [average]?' },
            answer: 60, unit: { zh: '度', en: '°' },
            hint: { zh: '要「平分」就用除法：360 ÷ 6！', en: 'To share equally, divide: 360 ÷ 6!' },
            teach: [
              { zh: '一整圈是 360 度——這個數字要記牢，方位、時鐘、轉彎都會用到。',
                en: 'A full turn is 360° — memorise it; you will use it for bearings, clocks and turns.' },
              { zh: '把 360 度平分給 6 個小時，就是除法：360 ÷ 6。',
                en: 'Sharing 360° across 6 hours means division: 360 ÷ 6.' },
              { zh: '360 ÷ 6：想 36 ÷ 6 ＝ 6，再補回一個 0……換你算出一小時幾度！',
                en: '360 ÷ 6: think 36 ÷ 6 = 6, then put the zero back… you find the degrees per hour!' },
            ],
            reward: { zh: '☀️ 一小時 60 度！橘貓圓圓忽然抬起頭，金黃色的眼睛直直看著安安，像聽懂了一樣。牠站起來，往前走了兩步，剛好又坐回光圈的正中央。爺爺搖頭笑：「牠比我還準時。」',
                      en: '☀️ 60 degrees an hour! Yuan-Yuan the ginger cat suddenly lifts her head, golden eyes fixed on An-An as if she understood. She rises, pads two steps forward, and settles again in the exact centre of the light. The guide chuckles: “She keeps better time than I do.”' },
          },
        },
        // 4 🔀 分支選擇（兩分支同答案 48）
        {
          kind: 'choice',
          place: { zh: '大廳裡的兩條路', en: 'Two Ways Around the Rotunda' },
          emoji: '🔀',
          story: { zh: '要查清楚光圈為什麼跑掉，有兩個地方可以看：左邊是牆上一整排的老照片，右邊是地板上那些排水孔（下雨的時候，雨真的會從圓洞直接落進來！）。圓圓站起來，尾巴一甩，居然往兩條路中間一坐，歪頭看著安安，好像在等她決定。',
                   en: 'To work out why the circle moved, there are two things to examine: on the left, a whole row of old photographs on the wall; on the right, the drainage holes in the floor (when it rains, the rain really does fall straight through the hole!). Yuan-Yuan stands, flicks her tail, and sits down squarely between the two paths, head tilted, as if waiting for An-An to choose.' },
          question: { zh: '★ 你來決定！要先看哪一邊？（兩邊都查得到，選你喜歡的！）',
                      en: '★ You decide! Which side first? (Both work — pick your favourite!)' },
          options: [
            {
              id: 'photos',
              label: { zh: '📷 牆上的老照片', en: '📷 The Old Photographs' },
              scene: {
                place: { zh: '牆上的老照片', en: 'The Old Photographs' },
                emoji: '📷',
                story: { zh: '爺爺四十年來每個月都拍一張光圈的位置，貼成一整面牆。「你數數看，」他指著，「{6} 排，每排 {8} 張。這些照片會告訴你答案。」安安一張一張看過去，忽然發現——照片裡的光圈，位置好像會隨著月份慢慢移動……',
                         en: 'For forty years the guide has photographed the light circle once a month, papering a whole wall. “Count them,” he points, “{6} rows, {8} in each. These photographs hold your answer.” An-An scans them one by one, and suddenly notices — the circle in the photos seems to shift slowly with the months…' },
                clueNote: { zh: '老照片共 48 張；照片裡的光圈位置會隨月份移動', en: '48 photographs; the circle’s position shifts month by month' },
                puzzle: {
                  text: { zh: '照片 {6} 排，每排 {8} 張，[一共]幾張？', en: '{6} rows, {8} photos each — how many [in all]?' },
                  answer: 48, unit: { zh: '張', en: 'photos' },
                  hint: { zh: '每排 8 張，有 6 排：8 × 6！', en: '8 per row, 6 rows: 8 × 6!' },
                  teach: [
                    { zh: '一排一排一樣多，用乘法：每排 8 張，有 6 排。',
                      en: 'Equal rows — multiply: 8 photos, 6 rows.' },
                    { zh: '就是 8 × 6（或 6 × 8，答案一樣）。',
                      en: 'That’s 8 × 6 (or 6 × 8 — same answer).' },
                    { zh: '8 × 6……換你數出爺爺一共拍了幾張！',
                      en: '8 × 6… you count how many photographs he took!' },
                  ],
                  reward: { zh: '📷 48 張！四十年的光圈，整整齊齊貼在牆上。安安盯著看了好久：「爺爺……照片裡的光圈，好像每個月都在慢慢動耶。」爺爺愣住了。',
                            en: '📷 48! Forty years of light circles, arranged neatly on the wall. An-An stares a long while: “Grandpa… the circle in these photos seems to move a little every month.” The old guide freezes.' },
                },
              },
            },
            {
              id: 'drains',
              label: { zh: '💧 地板的排水孔', en: '💧 The Drainage Holes' },
              scene: {
                place: { zh: '地板的排水孔', en: 'The Drainage Holes' },
                emoji: '💧',
                story: { zh: '安安蹲下來看地板，發現上面有一個個小洞。爺爺解釋：「屋頂那個洞是真的洞，沒有玻璃！下雨的時候雨會直接落進來，所以兩千年前的人就在地板做了排水孔。」他指著：「這區有 {8} 行，每行 {6} 個。數數看。」',
                         en: 'An-An crouches to the floor and finds it dotted with small holes. The guide explains: “That hole in the roof is a real hole — no glass! When it rains, the rain falls straight in, so two thousand years ago they built drains into the floor.” He points: “{8} lines here, {6} holes in each. Count them.”' },
                clueNote: { zh: '排水孔共 48 個；屋頂圓洞沒有玻璃，雨會直接落進大廳', en: '48 drainage holes; the roof hole has no glass — rain falls straight in' },
                puzzle: {
                  text: { zh: '排水孔 {8} 行，每行 {6} 個，[一共]幾個？', en: '{8} lines of drains, {6} each — how many [in all]?' },
                  answer: 48, unit: { zh: '個', en: 'holes' },
                  hint: { zh: '每行 6 個，有 8 行：6 × 8！', en: '6 per line, 8 lines: 6 × 8!' },
                  teach: [
                    { zh: '一行一行一樣多，用乘法：每行 6 個，有 8 行。',
                      en: 'Equal lines — multiply: 6 holes, 8 lines.' },
                    { zh: '就是 6 × 8（或 8 × 6，答案一樣）。',
                      en: 'That’s 6 × 8 (or 8 × 6 — same answer).' },
                    { zh: '6 × 8……換你數出一共幾個排水孔！',
                      en: '6 × 8… you count the drainage holes!' },
                  ],
                  reward: { zh: '💧 48 個！安安抬頭看那個大洞：「所以下雨的時候，站在這裡會淋到雨？」爺爺大笑：「會啊！兩千年來都會！」（十一月的羅馬偶爾下雨——你可能真的會看到雨從天上直直落進來。）',
                            en: '💧 48! An-An looks up at the great hole: “So when it rains, you get wet standing here?” The guide roars with laughter: “You do! For two thousand years, you do!” (November in Rome sees some rain — you might really watch it fall straight in.)' },
                },
              },
            },
          ],
        },
        // 5 🏛️ 這棟房子幾歲：大數減法
        {
          place: { zh: '🏛️ 這棟房子幾歲了', en: '🏛️ How Old Is This House' },
          emoji: '📅',
          story: { zh: '爺爺帶大家看門邊一塊石牌：「現在你們看到的這棟，大約在西元 {126} 年完成。」安安算了一下，眼睛越睜越大。小Q：「沒錯，今年是 {2026} 年。安安，算算看這棟房子幾歲——算出來你就會明白，為什麼爺爺說『四十年沒錯過』其實還太短了。」',
                   en: 'The guide shows them a stone plaque by the door: “The building you see was completed around the year {126}.” An-An does a quick sum, and her eyes widen. Little Q: “Correct — this year is {2026}. Work out how old this house is, and you will see why forty years of guiding is really rather short.”' },
          clueNote: { zh: '萬神殿現存建築約 1900 歲（2026 − 126）', en: 'The Pantheon standing today is about 1900 years old (2026 − 126)' },
          puzzle: {
            text: { zh: '這棟房子約在西元 {126} 年完成，今年是 {2026} 年。它幾歲了？',
                    en: 'Completed around the year {126}; this year is {2026}. How old is it?' },
            answer: 1900, unit: { zh: '歲', en: 'years' },
            hint: { zh: '用減法算年代差：2026 − 126！', en: 'Subtract to find the gap: 2026 − 126!' },
            teach: [
              { zh: '算「幾歲」就是算年代差：用今年減掉完成的那一年。',
                en: 'Age is the gap between years: this year minus the year it was finished.' },
              { zh: '2026 − 126：個位 6 − 6 ＝ 0、十位 2 − 2 ＝ 0，剩下 20 − 1……',
                en: '2026 − 126: ones 6 − 6 = 0, tens 2 − 2 = 0, leaving 20 − 1…' },
              { zh: '這是個很整齊的數字喔；換你算出這棟房子幾歲！',
                en: 'It comes out beautifully round; you work out how old it is!' },
            ],
            reward: { zh: '📅 1900 歲！安安倒抽一口氣。爺爺攤攤手：「所以我那四十年的照片，只是它一生的四十分之一都不到。」小Q忽然說：「等一下……爺爺，四十年，會不會根本不夠久？」',
                      en: '📅 1900 years old! An-An gasps. The guide spreads his hands: “So my forty years of photographs are less than a fortieth of its life.” Little Q says suddenly: “Wait… Grandpa. Might forty years simply not be long enough?”' },
          },
        },
        // 6 🔢 圓頂有多高：有餘數的除法
        {
          place: { zh: '🔢 圓頂有多高', en: '🔢 How Tall Is the Dome' },
          emoji: '📐',
          diagram: 'rect-dim',
          story: { zh: '小Q攤開手帳：「這個圓頂藏著一個很酷的祕密——它的直徑是 {43} 公尺，而從地板到圓洞的高度，剛剛好『也是』43 公尺。完全一樣！所以如果放一顆大球進來，會剛剛好卡滿整個空間。」安安抬頭看那個高得嚇人的屋頂：「43 公尺是多高啊？」小Q：「一層樓大約 {3} 公尺。你自己算算看，這相當於幾層樓——算不完整也沒關係，會有餘數喔。」',
                   en: 'Little Q opens the notebook: “This dome hides something wonderful — its diameter is {43} m, and the height from floor to the hole is ALSO exactly 43 m. Identical! So a giant sphere dropped in would fit the space perfectly.” An-An cranes at the dizzying roof: “How tall is 43 metres?” Little Q: “One storey is about {3} m. Work out how many storeys that is — it will not divide evenly, and that is fine; there will be a remainder.”' },
          clueNote: { zh: '圓頂直徑 43 公尺＝地板到圓洞的高度，約 14 層樓高（43÷3＝14 餘 1）', en: 'Dome diameter 43 m = floor-to-hole height; about 14 storeys (43÷3 = 14 r 1)' },
          puzzle: {
            text: { zh: '圓頂高 {43} 公尺，一層樓約 {3} 公尺。相當於幾層樓？（[只寫商]，不用寫餘數）',
                    en: 'The dome is {43} m tall; one storey is about {3} m. How many storeys? ([quotient only], no remainder needed)' },
            answer: 14, unit: { zh: '層', en: 'storeys' },
            hint: { zh: '43 ÷ 3，看 3 的幾倍最接近 43 又不超過：3 × 14 ＝ 42！', en: '43 ÷ 3 — find the largest multiple of 3 not over 43: 3 × 14 = 42!' },
            teach: [
              { zh: '43 沒辦法被 3 整除，這種就是「有餘數的除法」——先找商，剩下的叫餘數。',
                en: '43 will not divide evenly by 3 — this is division WITH A REMAINDER. Find the quotient first; what is left over is the remainder.' },
              { zh: '想想 3 的倍數：3 × 10 ＝ 30、3 × 14 ＝ 42、3 × 15 ＝ 45（超過了）。',
                en: 'Think in threes: 3 × 10 = 30, 3 × 14 = 42, 3 × 15 = 45 (too big).' },
              { zh: '所以商是 14、餘 1（43 ＝ 3 × 14 ＋ 1）；這題[只要填商]，換你算！',
                en: 'So the quotient is 14, remainder 1 (43 = 3 × 14 + 1). Enter the [quotient only] — your turn!' },
            ],
            reward: { zh: '📐 約 14 層樓！而且這是兩千年前蓋的，沒有鋼筋、沒有起重機。安安小小聲說：「他們怎麼辦到的……」圓圓在光圈裡打了個呵欠，好像在說：這問題我聽過一千遍了。',
                      en: '📐 About 14 storeys! And it was built two thousand years ago — no steel, no cranes. An-An whispers: “How did they even…” Yuan-Yuan yawns in her circle of light, as if to say: I have heard that question a thousand times.' },
          },
        },
        // 7 🔢 量光圈：小數減法
        {
          place: { zh: '🔢 量一量那圈光', en: '🔢 Measuring the Circle of Light' },
          emoji: '🔆',
          story: { zh: '小Q掏出捲尺：「來，我們自己量。」屋頂那個圓洞的直徑大約 {9} 公尺；可是陽光是斜斜射進來的，所以照在地板上的光圈會被拉長一點——安安量到的是 {9.6} 公尺。小Q：「光圈比洞口大了多少？這題會用到[小數]。」',
                   en: 'Little Q produces a tape measure: “Come, let us measure it ourselves.” The hole in the roof is about {9} m across; but sunlight enters at a slant, so the circle it casts on the floor is stretched a little — An-An measures {9.6} m. Little Q: “How much bigger is the circle than the hole? This one needs [decimals].”' },
          clueNote: { zh: '地板光圈 9.6 公尺 − 圓洞 9 公尺＝大了 0.6 公尺（因為陽光是斜射進來的）', en: 'Floor circle 9.6 m − roof hole 9 m = 0.6 m larger (because the sunlight slants in)' },
          puzzle: {
            text: { zh: '地板上的光圈 {9.6} 公尺，屋頂圓洞 {9} 公尺。光圈比洞口大幾公尺？（用[小數]寫）',
                    en: 'Floor circle {9.6} m, roof hole {9} m. How many metres bigger? (as a [decimal])' },
            answer: 0.6, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '小數減法：9.6 − 9，整數部分先減，小數部分留著！', en: 'Decimal subtraction: 9.6 − 9 — take the whole parts first, keep the decimal!' },
            teach: [
              { zh: '小數相減，重點是「小數點對齊」：9.6 可以想成 9 ＋ 0.6。',
                en: 'When subtracting decimals, LINE UP THE POINT: 9.6 is 9 + 0.6.' },
              { zh: '9.6 − 9：整數的 9 減掉 9 剩 0，小數的 0.6 沒被減到，留下來。',
                en: '9.6 − 9: the whole 9 minus 9 leaves 0, and the 0.6 is untouched.' },
              { zh: '所以答案是 0.6 公尺（比半公尺多一點）；換你寫進手帳！',
                en: 'So the answer is 0.6 m (a bit over half a metre). Write it in the notebook!' },
            ],
            reward: { zh: '🔆 0.6 公尺！小Q瞇起眼睛：「注意到了嗎——陽光是『斜』射進來的，才會被拉長。而斜的角度會變……安安，你剛剛在照片牆上看到的，是不是就是這件事？」安安猛然抬頭：「我知道光圈為什麼跑掉了！」',
                      en: '🔆 0.6 m! Little Q narrows his eyes: “Notice that — the sunlight comes in at a SLANT, which is why it stretches. And the angle of that slant changes… An-An, is that not exactly what you saw on the photo wall?” An-An’s head snaps up: “I know why the circle moved!”' },
          },
        },
        // 8 🔍 破案：太陽高度隨季節改變（角度減法）
        {
          place: { zh: '🔍 太陽站的位置不一樣', en: '🔍 The Sun Stands Elsewhere' },
          emoji: '🌞',
          diagram: 'sun-shadow',
          story: { zh: '安安把老照片一張張排開：「爺爺，你的照片是夏天拍的最多對不對？」爺爺點頭。小Q接著說：「羅馬的夏天，正午太陽在天空很高，大約 {70} 度；可是十一月，太陽只爬到大約 {32} 度——低了好多。太陽越低，光就射得越斜，光圈當然會跑到旁邊去。」牠轉向安安：「算算看，夏天和十一月的太陽高度差幾度？算出來，這個案子就破了。」',
                   en: 'An-An lays the old photographs out in a row: “Grandpa, most of your photos were taken in summer, weren’t they?” He nods. Little Q continues: “In a Roman summer, the noon sun sits high — about {70} degrees. But in November it climbs only to about {32} degrees — far lower. The lower the sun, the more slanted the light, so of course the circle wanders aside.” He turns to An-An: “Work out the difference between the summer and November sun. Solve that, and the case is closed.”' },
          clueNote: { zh: '羅馬正午太陽高度：夏天約 70 度、十一月約 32 度，相差 38 度→光圈位置本來就會變', en: 'Rome noon sun: ~70° in summer, ~32° in November — a 38° difference, so the circle must move' },
          puzzle: {
            text: { zh: '羅馬正午太陽高度：夏天約 {70} 度、十一月約 {32} 度。相差幾度？',
                    en: 'Rome’s noon sun: about {70}° in summer, about {32}° in November. What is the difference?' },
            answer: 38, unit: { zh: '度', en: '°' },
            hint: { zh: '角度相減：70 − 32！', en: 'Subtract the angles: 70 − 32!' },
            teach: [
              { zh: '自然重點：太陽在天空的高度，一年之中會慢慢改變——夏天高、冬天低。',
                en: 'Science point: the sun’s height in the sky changes through the year — high in summer, low in winter.' },
              { zh: '要算「相差幾度」就用減法：70 − 32。',
                en: 'To find the difference, subtract: 70 − 32.' },
              { zh: '70 − 32：個位不夠減要退位（10 − 2 ＝ 8），十位剩 6 − 3……換你算！',
                en: '70 − 32: the ones need regrouping (10 − 2 = 8), and the tens leave 6 − 3… your turn!' },
            ],
            reward: { zh: '🌞 38 度！差了整整 38 度。小Q把三種說法排開：「爺爺，現在請安安告訴你——這三個解釋裡，只有一個講得通。」圓圓忽然站起來，走到安安腳邊，抬頭看著她。',
                      en: '🌞 38 degrees! A full 38-degree difference. Little Q lines up the three explanations: “Grandpa, let An-An tell you now — only one of these three can be right.” Yuan-Yuan suddenly rises, pads to An-An’s feet, and looks up at her.' },
          },
        },
      ],
      suspects: [
        { id: 'shop', name: { zh: '🖼️ 明信片攤老闆', en: '🖼️ The Postcard Seller' }, emoji: '🖼️',
          say: { zh: '「一定是屋頂那個洞被修小了啦！洞變小，光圈當然跟著變小、位置也跑掉。我在這裡賣了二十年明信片，我最清楚。」',
                 en: '“They must have made the roof hole smaller! Smaller hole, smaller circle, and of course it shifts. I have sold postcards here twenty years — I would know.”' } },
        { id: 'guide', name: { zh: '🧔 白鬍子導遊爺爺', en: '🧔 The White-Bearded Guide' }, emoji: '🧔',
          say: { zh: '「我拍了四十年，每個月一張……說真的，我從來只挑夏天帶團。冬天太冷，觀光客少，我就休息了。」',
                 en: '“Forty years of photographs, one a month… though truthfully, I only ever guide in summer. Winter is cold, tourists are few, so I rest.”' } },
        { id: 'fixer', name: { zh: '🧰 地板修復師', en: '🧰 The Floor Restorer' }, emoji: '🧰',
          say: { zh: '「去年我們重鋪過地板的石磚喔。搞不好是鋪的時候位置歪掉了，所以光圈看起來才不對。」',
                 en: '“We re-laid the floor stones last year. Perhaps they went down slightly askew, and that is why the circle looks wrong.”' } },
      ],
      culprit: 'guide',
      accuse: { zh: '這一回沒有壞人，只有一個誤會——而且解開它的鑰匙，是你自己算出來的那 38 度。三個人各有一套解釋，但只有一個講得通。想想看：屋頂的洞沒被動過（你量過，約 9 公尺）、地板就算重鋪也不會讓太陽變位置。可是有一個人，剛剛不小心說出了一句非常關鍵的話——他四十年來，只在某一個季節拍照。是誰？',
                en: 'No villain this time — only a misunderstanding, and the key to it is the 38 degrees you calculated yourself. Three people each offer an explanation, but only one holds up. Think: the roof hole was never altered (you measured it, about 9 m), and re-laying a floor cannot move the sun. Yet one person just let slip something crucial — for forty years, he only ever photographed in one season. Who?' },
      wrongAccuse: { zh: '再想一次喔——屋頂那個洞你自己量過，還是約 9 公尺，沒有變小；地板就算重鋪歪了，也不可能讓太陽在天空的高度改變 38 度。真正的關鍵是「照片是什麼時候拍的」。誰剛剛說了「我從來只挑夏天帶團」？🧔',
                     en: 'Think again — you measured the roof hole yourself: still about 9 m, not smaller. And a re-laid floor, however askew, cannot change the sun’s height by 38 degrees. The real key is WHEN the photographs were taken. Who just said “I only ever guide in summer”? 🧔' },
      solve: [
        { zh: '答案是白鬍子導遊爺爺自己的話！🧔 他說「我從來只挑夏天帶團」——所以那 48 張照片，幾乎全是夏天拍的。夏天羅馬的正午太陽高高掛在約 70 度，光幾乎垂直落下，光圈就落在門口；而現在是十一月，太陽只有約 32 度，低了整整 38 度，光斜斜地射進來，光圈自然就跑到旁邊去了。',
          en: 'The answer was in the old guide’s own words! 🧔 He said “I only ever guide in summer” — so those 48 photographs are almost all summer photographs. In a Roman summer the noon sun hangs at about 70°, dropping light almost straight down, and the circle lands at the doorway. But it is November now: the sun reaches only about 32°, a full 38° lower, so the light slants in and the circle drifts aside.' },
        { zh: '爺爺呆了好幾秒，然後拍著大腿大笑起來：「四十年！我居然四十年沒發現，是我自己只在夏天來啊！」小Q推推眼鏡：「這不是您的錯——這叫『只看到自己看得到的那一半』。安安，記住這件事，我們上一季才學過。」（沒錯，就是 S8 大溪那本導覽手冊。）',
          en: 'The guide stares for several seconds, then slaps his knee and roars with laughter: “Forty years! For forty years I never realised it was I who only ever came in summer!” Little Q adjusts his glasses: “It is not your fault — it is called ‘seeing only the half you can see.’ An-An, remember this; we learned it just last season.” (Yes — that guidebook back in Daxi.)' },
        { zh: '⭐ 而且這件事對你特別重要：安安，你十一月去的時候，看到的光圈就會在「旁邊」，不在門口——跟網路上大部分的照片都不一樣。到時候記得抬頭看看那個洞，再低頭找找光圈跑到哪裡去了。那是只有十一月去的人才看得到的風景。',
          en: '⭐ And this matters especially to you: An-An, when you go in November, the circle will be off to the SIDE, not at the doorway — unlike most photographs online. Look up at the hole, then look down and hunt for where the circle has wandered. That is a sight only November visitors get to see.' },
        { zh: '羅馬小知識：萬神殿的圓頂直徑 43 公尺，和地板到圓洞的高度一模一樣——等於裡面剛好裝得下一顆巨大的球。這個屋頂用的是兩千年前的混凝土，到今天仍然是全世界最大的「無鋼筋」圓頂。第一張手帳貼紙，到手！',
          en: 'Rome fact: the Pantheon’s dome is 43 m across — exactly matching the floor-to-hole height, so a giant sphere would fit perfectly inside. It was cast in two-thousand-year-old concrete and remains the largest unreinforced dome on Earth. Sticker one — acquired!' },
      ],
      arcClue: { zh: '要離開的時候，橘貓圓圓一路跟到門口，卻在門檻前停住了，怎麼也不肯再往前一步。爺爺說：「牠從來不出去的。生下來就在這裡，二十年了，一步都沒踏出這個門。」安安蹲下來摸摸牠的頭。圓圓抬起臉，金黃色的眼睛望向門外那片藍得發亮的天空，喉嚨裡發出很輕很輕的一聲：「喵。」——像在問，外面的天空，也會發光嗎？',
                 en: 'As they leave, Yuan-Yuan follows all the way to the door — then stops at the threshold and will not take one step more. The guide says: “She never goes out. Born here, twenty years, and never once past that door.” An-An crouches and strokes her head. Yuan-Yuan lifts her face toward the brilliant blue sky beyond the doorway and makes the smallest sound in her throat: “Mew.” — as if asking: does the sky out there light up too?' },
      nextPreview: { zh: '下一站——圓形競技場！一座能坐下九萬人的巨大石頭碗，外牆整整三層、每層 80 個拱門。可是導覽員說：「有一個數字，兩千年來大家都算錯了。」這一回要用乘法和大數，把一座競技場整個數過一遍。而萬神殿那隻橘貓，好像偷偷跟上來了……',
                     en: 'Next stop — the Colosseum! A vast stone bowl that seated ninety thousand, its outer wall rising in three tiers of eighty arches each. But the attendant says: “There is one number everyone has got wrong for two thousand years.” This time we use multiplication and big numbers to count an entire amphitheatre. And that ginger cat from the Pantheon seems to have quietly followed…' },
      reward: 500,
    },
  ],
}

// 旅行手帳貼紙板（12 張＝羅馬 6 站＋芬蘭 6 站）；集滿＝信物《安安的旅行手帳》
// ⭐ 設計原則一：每一張都要能在現場「真的核對到」
// ⭐ 設計原則二（2026-08-24 使用者指示）：芬蘭不能只有雪／馴鹿／極光這種常見主題，
//    要跟羅馬一樣有城市歷史與文化。
//    （雪、馴鹿、桑拿、永夜不獨立成站，融進各站的場景裡。）
//    芬蘭六站：芬蘭堡三度易主＋1917獨立／岩石教堂鑿進岩盤／羅瓦涅米1944燒毀後
//    由 Alvar Aalto 重建成馴鹿角街道／聖誕老人是怎麼搬來的／薩米族把名字拿回來／極光。
//    第 9、10 站連起來＝「一座城市怎麼從灰燼裡靠一個故事活過來」的完整弧線。
export const TRAVEL_BOARD = [
  // ── 第一幕 · 羅馬 ──
  { id: 'pantheon',    emoji: '🏛️', name: { zh: '萬神殿',       en: 'The Pantheon' } },
  { id: 'colosseum',   emoji: '🏟️', name: { zh: '圓形競技場',   en: 'The Colosseum' } },
  { id: 'forum',       emoji: '🏺', name: { zh: '疊起來的廣場', en: 'The Layered Forum' } },
  { id: 'trevi',       emoji: '⛲', name: { zh: '兩千年的水',   en: 'Two-Thousand-Year Water' } },
  { id: 'vatican',     emoji: '⛪', name: { zh: '最小的國家',   en: 'The Smallest Country' } },
  { id: 'romecats',    emoji: '🐈', name: { zh: '羅馬的貓',     en: 'The Cats of Rome' } },
  // ── 第二幕 · 芬蘭 ──
  { id: 'suomenlinna', emoji: '🏰', name: { zh: '換過三次主人', en: 'Three Owners' } },
  { id: 'rockchurch',  emoji: '🪨', name: { zh: '鑿進岩石的教堂', en: 'The Church in the Rock' } },
  { id: 'rovaniemi',   emoji: '🦌', name: { zh: '馴鹿角的城市', en: 'The Reindeer-Antler City' } },
  { id: 'santa',       emoji: '🎅', name: { zh: '聖誕老人是怎麼搬來的', en: 'How Santa Moved In' } },
  { id: 'sami',        emoji: '🪶', name: { zh: '把名字拿回來', en: 'Taking Back the Name' } },
  { id: 'aurora',      emoji: '🌌', name: { zh: '極光',         en: 'The Aurora' } },
]
