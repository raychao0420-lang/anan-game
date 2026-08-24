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

    // ─────────────────────────────────────── S9 EP2 ───────────────────────────────────────
    {
      id: 's9ep2',
      comicIntro: [
        { bg: 'colosseum', cast: ['anan', '🐈'],
          say: { zh: '橘貓圓圓居然一路跟來了，鑽進競技場的石縫裡不見蹤影。',
                 en: 'Yuan-Yuan has followed them all the way, slipping into a crack in the Colosseum stones.' } },
        { bg: 'colosseum', cast: ['anan', '🎫'],
          say: { zh: '老導覽員壓低聲音：「有一個數字，兩千年來大家都念錯了。你敢查嗎？」',
                 en: 'The old attendant lowers his voice: "There is one number everyone has recited wrongly for two thousand years. Dare you check it?"' } },
      ],
      comicSolve: [
        { bg: 'colosseum', cast: ['anan', '📘'],
          say: { zh: '安安抬頭數編號：「手冊說八十個拱門都有號碼——可是有四個沒有。」',
                 en: 'An-An counts the numerals above her: "The booklet says all eighty arches are numbered — but four of them are not."' } },
        { bg: 'colosseum', cast: ['anan', '🐈'],
          say: { zh: '石縫裡探出一顆橘色的頭，尾巴輕輕掃過安安的腳邊。〈手帳貼紙 2 · 圓形競技場〉',
                 en: 'A ginger head peeks from the crack, tail brushing An-An\'s ankle. Sticker 2 — The Colosseum.' } },
      ],
      no: 2,
      title: { zh: '兩千年來都算錯的數字', en: 'The Number Everyone Got Wrong' },
      emoji: '🏟️',
      accent: '#b5834b',
      difficulty: { zh: '乘法·減法·角度·除法·大數（四上）', en: 'Times · minus · angles · division · big numbers (Grade 4-1)' },
      sticker: { id: 'colosseum', emoji: '🏟️', name: { zh: '手帳貼紙 2 · 圓形競技場', en: 'Sticker 2 · The Colosseum' } },
      intro: [
        { zh: '第二天早上，安安走出旅館，遠遠就看見那個巨大的石頭圈——圓形競技場。它比照片上還要大得多，外牆一層疊一層，全是拱門，右半邊還缺了一大塊。而且很奇怪，昨天萬神殿那隻橘貓圓圓，居然出現在競技場的石階上，尾巴一甩就鑽進石縫裡了。',
          en: 'The next morning An-An steps out of the hotel and sees it from far off — that vast ring of stone: the Colosseum. It is far bigger than any photograph, its outer wall rising tier upon tier of arches, with a great bite missing from the right side. And strangely, Yuan-Yuan — the ginger cat from the Pantheon — is sitting on the steps, and with a flick of her tail vanishes into a crack in the stones.' },
        { zh: '入口處，一位頭髮花白的老導覽員正在發導覽手冊。看到安安手上的手帳，他挑了挑眉：「哦？自己記數字的小孩？」他忽然壓低聲音：「那我告訴你一件事——這本手冊上，有一個數字，兩千年來大家都跟著念、跟著寫，可是它是錯的。你敢自己數一遍嗎？」小Q眼睛一亮：「安安，這正是我們的專長。」',
          en: 'At the entrance, a grey-haired attendant is handing out guide booklets. Seeing the notebook in An-An’s hand, he raises an eyebrow: “Oh? A child who records her own numbers?” Then he lowers his voice: “Then let me tell you something — there is a number in this booklet that everyone has recited and copied for two thousand years. And it is wrong. Do you dare count it yourself?” Little Q’s eyes gleam: “An-An, this is exactly our speciality.”' },
      ],
      scenes: [
        // 1 🏟️ 乘法：三層拱門
        {
          place: { zh: '🏟️ 外牆的拱門', en: '🏟️ The Arches of the Outer Wall' },
          emoji: '🏟️',
          story: { zh: '老導覽員領著大家站到外牆下，仰頭往上看：「你看，外牆一共 {3} 層，每一層都是 {80} 個拱門，整整齊齊繞一圈。」安安脖子都仰痠了：「好多……」小Q：「先算總數。這種一層一層一樣多的，用什麼？」',
                   en: 'The attendant leads them beneath the outer wall and looks up: “See — {3} tiers in all, and each tier has {80} arches, ringing the whole building.” An-An’s neck aches from craning: “So many…” Little Q: “Total first. Equal tiers like this call for what?”' },
          clueNote: { zh: '外牆拱門總數＝240 個（3 層 × 每層 80 個）', en: 'Outer-wall arches = 240 (3 tiers × 80)' },
          puzzle: {
            text: { zh: '外牆 {3} 層，每層 {80} 個拱門。[一共]幾個？',
                    en: '{3} tiers, {80} arches each. How many [in all]?' },
            answer: 240, unit: { zh: '個', en: 'arches' },
            hint: { zh: '每層 80 個，有 3 層：80 × 3！', en: '80 per tier, 3 tiers: 80 × 3!' },
            teach: [
              { zh: '一層一層一樣多，用乘法：每層 80 個，有 3 層。',
                en: 'Equal tiers — multiply: 80 arches, 3 tiers.' },
              { zh: '80 × 3：先算 8 × 3 ＝ 24，再把 0 補回去。',
                en: '80 × 3: work out 8 × 3 = 24, then put the zero back.' },
              { zh: '換你算出外牆一共幾個拱門！',
                en: 'You find the total number of arches!' },
            ],
            reward: { zh: '🏟️ 240 個！老導覽員點點頭：「數字對。不過——這還不是那個錯的數字。」他神祕地笑了笑：「繼續。」',
                      en: '🏟️ 240! The attendant nods: “Correct. But — that is not the wrong number yet.” He smiles mysteriously: “Carry on.”' },
          },
        },
        // 2 📏 減法：橢圓形的長與寬
        {
          place: { zh: '📏 它不是圓的', en: '📏 It Is Not a Circle' },
          emoji: '📐',
          diagram: 'rect-dim',
          story: { zh: '繞著走了一圈，安安發現一件事：「它不是圓的耶，是橢圓形的！」老導覽員讚許地說：「答對了。長的那一邊 {188} 公尺，短的那一邊 {156} 公尺。」小Q補一句：「橢圓形才能讓四面八方的觀眾都看得清楚中間。算算看，長邊比短邊長多少？」',
                   en: 'Walking the full circuit, An-An notices something: “It is not a circle — it is an oval!” The attendant approves: “Well spotted. The long axis is {188} m, the short one {156} m.” Little Q adds: “An oval lets the crowd on every side see the middle clearly. Work out how much longer the long side is.”' },
          clueNote: { zh: '競技場 188 公尺 × 156 公尺的橢圓，長邊比短邊長 32 公尺', en: 'An oval 188 m × 156 m — the long axis exceeds the short by 32 m' },
          puzzle: {
            text: { zh: '競技場長 {188} 公尺、寬 {156} 公尺。長邊比短邊長幾公尺？',
                    en: 'The arena is {188} m long and {156} m wide. How many metres longer is the long side?' },
            answer: 32, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '相差就用減法：188 − 156！', en: 'Difference means subtract: 188 − 156!' },
            teach: [
              { zh: '要算「長多少」就是算相差，用減法：188 − 156。',
                en: 'To find “how much longer,” subtract: 188 − 156.' },
              { zh: '個位 8 − 6 ＝ 2；十位 8 − 5 ＝ 3；百位 1 − 1 ＝ 0。',
                en: 'Ones: 8 − 6 = 2. Tens: 8 − 5 = 3. Hundreds: 1 − 1 = 0.' },
              { zh: '換你算出長邊比短邊長幾公尺！',
                en: 'You find how many metres longer the long side is!' },
            ],
            reward: { zh: '📐 32 公尺！差不多是一個游泳池的長度。安安在手帳上畫了一個扁扁的橢圓，旁邊標上 188 和 156。（十一月你可以自己繞一圈走走看喔。）',
                      en: '📐 32 m — about the length of a swimming pool. An-An sketches a flattened oval in her notebook, marking 188 and 156 beside it. (In November you can walk the circuit yourself!)' },
          },
        },
        // 3 🧭 角度：拱門分區
        {
          place: { zh: '🧭 分成幾區', en: '🧭 Dividing the Ring' },
          emoji: '🧭',
          diagram: 'map-compass',
          story: { zh: '老導覽員指著地上的舊平面圖：「古羅馬人很聰明，他們把這一圈拱門平均分成 {8} 大區，每一區負責一群觀眾。」小Q轉頭問：「安安，繞一整圈是幾度？」安安馬上答：「360 度！昨天在萬神殿算過！」小Q滿意地點頭：「很好。那平均分成 8 區，每一區佔幾度？」',
                   en: 'The attendant points to an old floor plan: “The Romans were clever — they split this ring of arches evenly into {8} great sectors, each serving one group of spectators.” Little Q turns: “An-An, how many degrees in a full turn?” She answers at once: “360! We worked it out at the Pantheon yesterday!” Little Q nods, pleased: “Good. So split evenly into 8 sectors — how many degrees each?”' },
          clueNote: { zh: '一圈 360 度平均分成 8 區，每區 45 度', en: '360° split into 8 sectors = 45° each' },
          puzzle: {
            text: { zh: '繞一圈是 {360} 度，平均分成 {8} 區。每一區佔幾度？',
                    en: 'A full turn is {360}°, split evenly into {8} sectors. How many degrees each?' },
            answer: 45, unit: { zh: '度', en: '°' },
            hint: { zh: '平分就用除法：360 ÷ 8！', en: 'Equal shares means divide: 360 ÷ 8!' },
            teach: [
              { zh: '一整圈 360 度，要平均分給 8 區，用除法：360 ÷ 8。',
                en: 'A full 360°, shared evenly among 8 sectors: 360 ÷ 8.' },
              { zh: '想想看：8 × 40 ＝ 320，還差 40；8 × 5 ＝ 40。所以是 40 ＋ 5。',
                en: 'Think: 8 × 40 = 320, leaving 40; and 8 × 5 = 40. So it is 40 + 5.' },
              { zh: '45 度剛好是直角的一半喔；換你算算看！',
                en: '45° is exactly half a right angle. Your turn!' },
            ],
            reward: { zh: '🧭 45 度！剛好是直角的一半。老導覽員瞇起眼睛：「這些數字都對。可是那個錯的數字，還躲在上面呢。」他伸手往拱門上方一指。',
                      en: '🧭 45° — exactly half a right angle. The attendant narrows his eyes: “All these numbers are right. But the wrong one is still hiding up there.” He points above the arches.' },
          },
        },
        // 4 🔀 分支選擇（兩分支同答案 48）
        {
          kind: 'choice',
          place: { zh: '競技場裡的兩條路', en: 'Two Ways Inside the Arena' },
          emoji: '🔀',
          story: { zh: '要看清楚拱門上方的東西，有兩條路可以上去：左邊是通往二樓看台的石階，右邊是繞到地底下的「地下層」——那是古代關野獸和放機關的地方。橘貓圓圓從石縫探出頭來，看看左邊，又看看右邊。',
                   en: 'To get a proper look above the arches, there are two ways up: on the left, the stone stairs to the second tier; on the right, a route down into the hypogeum — the underground level where beasts and machinery were once kept. Yuan-Yuan pokes her head from the crack, looks left, then right.' },
          question: { zh: '★ 你來決定！要走哪一條？（兩條都上得去，選你喜歡的！）',
                      en: '★ You decide! Which way? (Both work — pick your favourite!)' },
          options: [
            {
              id: 'tier',
              label: { zh: '🪜 二樓看台的石階', en: '🪜 Stairs to the Second Tier' },
              scene: {
                place: { zh: '二樓看台的石階', en: 'Stairs to the Second Tier' },
                emoji: '🪜',
                story: { zh: '石階又陡又寬。老導覽員說：「古羅馬人設計得很好，觀眾散場不會擠。這一段石階有 {6} 段，每段 {8} 階。你數數看一共幾階——邊爬邊數，才記得住。」',
                         en: 'The steps are steep and broad. The attendant says: “The Romans designed it well — the crowd never crushed on the way out. This flight has {6} sections of {8} steps. Count the total — count as you climb, and you will remember it.”' },
                clueNote: { zh: '石階共 48 階（6 段 × 8 階）', en: 'The flight has 48 steps (6 sections × 8)' },
                puzzle: {
                  text: { zh: '石階 {6} 段，每段 {8} 階，[一共]幾階？', en: '{6} sections, {8} steps each — how many [in all]?' },
                  answer: 48, unit: { zh: '階', en: 'steps' },
                  hint: { zh: '每段 8 階，有 6 段：8 × 6！', en: '8 per section, 6 sections: 8 × 6!' },
                  teach: [
                    { zh: '一段一段一樣多，用乘法：每段 8 階，有 6 段。',
                      en: 'Equal sections — multiply: 8 steps, 6 sections.' },
                    { zh: '就是 8 × 6（或 6 × 8，答案一樣）。',
                      en: 'That’s 8 × 6 (or 6 × 8 — same answer).' },
                    { zh: '8 × 6……換你邊爬邊數，數到二樓！',
                      en: '8 × 6… count as you climb, all the way to the second tier!' },
                  ],
                  reward: { zh: '🪜 48 階！站上二樓，整個競技場一覽無遺。安安終於看清楚了拱門上方——那裡刻著一個一個的羅馬數字。',
                            en: '🪜 48 steps! From the second tier the whole arena spreads out below. And now An-An can see clearly above the arches — Roman numerals, carved one after another.' },
                },
              },
            },
            {
              id: 'hypogeum',
              label: { zh: '🕳️ 地底下的地下層', en: '🕳️ Down into the Hypogeum' },
              scene: {
                place: { zh: '地底下的地下層', en: 'The Hypogeum' },
                emoji: '🕳️',
                story: { zh: '走下地下層，涼颼颼的。老導覽員說：「兩千年前這裡是機關房，用升降梯把東西送上場。你看這些石造的小房間——{8} 排，每排 {6} 間。數數看一共幾間。」',
                         en: 'Down in the hypogeum the air turns cool. The attendant says: “Two thousand years ago this was the machine floor — lifts hoisted things up to the arena. Look at these stone chambers: {8} rows of {6}. Count them.”' },
                clueNote: { zh: '地下層石室共 48 間（8 排 × 6 間）', en: 'The hypogeum has 48 chambers (8 rows × 6)' },
                puzzle: {
                  text: { zh: '石室 {8} 排，每排 {6} 間，[一共]幾間？', en: '{8} rows, {6} chambers each — how many [in all]?' },
                  answer: 48, unit: { zh: '間', en: 'chambers' },
                  hint: { zh: '每排 6 間，有 8 排：6 × 8！', en: '6 per row, 8 rows: 6 × 8!' },
                  teach: [
                    { zh: '一排一排一樣多，用乘法：每排 6 間，有 8 排。',
                      en: 'Equal rows — multiply: 6 chambers, 8 rows.' },
                    { zh: '就是 6 × 8（或 8 × 6，答案一樣）。',
                      en: 'That’s 6 × 8 (or 8 × 6 — same answer).' },
                    { zh: '6 × 8……換你數出地下層一共幾間石室！',
                      en: '6 × 8… you count the chambers of the hypogeum!' },
                  ],
                  reward: { zh: '🕳️ 48 間！從地下層爬回地面時，陽光刺得眼睛睜不開。安安抬頭一看——拱門上方，刻著一個一個的羅馬數字。',
                            en: '🕳️ 48! Climbing back up, the sunlight is blinding. An-An looks up — and there, above the arches, are Roman numerals carved one after another.' },
                },
              },
            },
          ],
        },
        // 5 🔢 除法：出口疏散
        {
          place: { zh: '🔢 五萬人怎麼走出去', en: '🔢 How Fifty Thousand People Leave' },
          emoji: '🚪',
          story: { zh: '老導覽員說：「這裡最多可以坐 {50000} 人。你猜散場要多久？答案是幾分鐘就走光了——因為底層那 {80} 個拱門，每一個都是出口。」小Q：「安安，如果 5 萬人平均分給 80 個出口，每個出口要走幾個人？」',
                   en: 'The attendant says: “It seated up to {50000}. Guess how long emptying took? Only minutes — because all {80} arches on the ground tier are exits.” Little Q: “An-An, if fifty thousand people split evenly among 80 exits, how many per exit?”' },
          clueNote: { zh: '可容 50000 人 ÷ 底層 80 個出口＝每個出口 625 人', en: '50,000 people ÷ 80 ground-tier exits = 625 per exit' },
          puzzle: {
            text: { zh: '{50000} 人平均分給 {80} 個出口，每個出口幾個人？',
                    en: '{50000} people split evenly among {80} exits — how many per exit?' },
            answer: 625, unit: { zh: '人', en: 'people' },
            hint: { zh: '平分用除法：50000 ÷ 80。先把兩邊各去掉一個 0 → 5000 ÷ 8！', en: 'Divide: 50000 ÷ 80. Drop a zero from each → 5000 ÷ 8!' },
            teach: [
              { zh: '被除數和除數同時去掉一個 0，答案不變：50000 ÷ 80 ＝ 5000 ÷ 8。',
                en: 'Drop one zero from both numbers and the answer is unchanged: 50000 ÷ 80 = 5000 ÷ 8.' },
              { zh: '5000 ÷ 8：8 × 600 ＝ 4800，還剩 200；8 × 25 ＝ 200。',
                en: '5000 ÷ 8: 8 × 600 = 4800, leaving 200; and 8 × 25 = 200.' },
              { zh: '600 ＋ 25……換你算出每個出口幾個人！',
                en: '600 + 25… you find how many people per exit!' },
            ],
            reward: { zh: '🚪 625 人！小Q佩服：「兩千年前就想到疏散設計了。」老導覽員終於忍不住了：「好啦，你們已經很接近了。現在，抬頭數數拱門上面那些號碼。」',
                      en: '🚪 625! Little Q is impressed: “Crowd-flow design, two thousand years ago.” The attendant can hold back no longer: “Very well — you are close now. Look up, and count the numbers above the arches.”' },
          },
        },
        // 6 📅 大數減法：競技場幾歲
        {
          place: { zh: '📅 它幾歲了', en: '📅 How Old Is It' },
          emoji: '📅',
          story: { zh: '安安翻開手帳，昨天那一頁還寫著「萬神殿 1900 歲」。老導覽員說：「競技場更老一點——大約在西元 {80} 年完工。」小Q：「今年 {2026} 年。算算看，它幾歲？算完你再跟昨天那個數字比一比。」',
                   en: 'An-An turns back a page — yesterday’s entry still reads “Pantheon, 1900 years old.” The attendant says: “The Colosseum is older still — completed around the year {80}.” Little Q: “This year is {2026}. Work out its age, then compare it with yesterday’s number.”' },
          clueNote: { zh: '競技場約 1946 歲（2026 − 80），比萬神殿還老 46 年', en: 'The Colosseum is about 1946 years old (2026 − 80) — 46 years older than the Pantheon' },
          puzzle: {
            text: { zh: '競技場約在西元 {80} 年完工，今年是 {2026} 年。它幾歲了？',
                    en: 'Completed around the year {80}; this year is {2026}. How old is it?' },
            answer: 1946, unit: { zh: '歲', en: 'years' },
            hint: { zh: '年代差用減法：2026 − 80！', en: 'Subtract for the gap: 2026 − 80!' },
            teach: [
              { zh: '一樣是算年代差：今年減掉完工那一年。',
                en: 'Again the gap between years: this year minus the year of completion.' },
              { zh: '2026 − 80：可以先減 100 變成 1926，再加回多減的 20。',
                en: '2026 − 80: subtract 100 to get 1926, then add back the extra 20.' },
              { zh: '1926 ＋ 20……換你算出競技場幾歲！',
                en: '1926 + 20… you find the Colosseum’s age!' },
            ],
            reward: { zh: '📅 1946 歲！比萬神殿還老 46 年。安安在手帳上把兩個數字並排寫好，忽然覺得「兩千年」這件事，好像沒那麼抽象了。',
                      en: '📅 1946 years! Forty-six years older than the Pantheon. An-An writes the two numbers side by side in her notebook, and suddenly “two thousand years” feels far less abstract.' },
          },
        },
        // 7 📐 有餘數的除法：競技場多高
        {
          place: { zh: '📐 它有多高', en: '📐 How Tall Is It' },
          emoji: '🏗️',
          diagram: 'rect-dim',
          story: { zh: '從二樓往上看，外牆還有一大截。老導覽員說：「最高的地方 {48} 公尺。」安安想起昨天小Q教的：「一層樓大約 {3} 公尺對不對？」小Q笑了：「你學會了。自己算。」',
                   en: 'From the second tier the wall still rises far above. The attendant says: “At its highest, {48} metres.” An-An recalls yesterday’s lesson: “One storey is about {3} metres, right?” Little Q smiles: “You have got it. Work it out yourself.”' },
          clueNote: { zh: '競技場高 48 公尺＝約 16 層樓（48÷3）', en: 'The Colosseum is 48 m tall — about 16 storeys (48÷3)' },
          puzzle: {
            text: { zh: '競技場高 {48} 公尺，一層樓約 {3} 公尺。相當於幾層樓？',
                    en: 'The Colosseum is {48} m tall; one storey is about {3} m. How many storeys?' },
            answer: 16, unit: { zh: '層', en: 'storeys' },
            hint: { zh: '48 ÷ 3：先想 30 ÷ 3 ＝ 10，剩下 18 ÷ 3 ＝ 6！', en: '48 ÷ 3: think 30 ÷ 3 = 10, then 18 ÷ 3 = 6!' },
            teach: [
              { zh: '48 ÷ 3 這次剛好除得盡，沒有餘數。',
                en: '48 ÷ 3 divides evenly this time — no remainder.' },
              { zh: '拆開比較好算：48 ＝ 30 ＋ 18。30 ÷ 3 ＝ 10，18 ÷ 3 ＝ 6。',
                en: 'Split it: 48 = 30 + 18. Then 30 ÷ 3 = 10 and 18 ÷ 3 = 6.' },
              { zh: '10 ＋ 6……換你算出競技場相當於幾層樓！',
                en: '10 + 6… you find how many storeys tall it is!' },
            ],
            reward: { zh: '🏗️ 16 層樓！比昨天的萬神殿還高一點。安安終於抬起頭，仔細看向拱門上方那一排羅馬數字——I、II、III、IV……一個一個刻得清清楚楚。她開始數了。',
                      en: '🏗️ 16 storeys — a little taller than yesterday’s Pantheon. At last An-An looks up and studies the row of Roman numerals above the arches: I, II, III, IV… each one clearly carved. She begins to count.' },
          },
        },
        // 8 🔍 破案：80 個拱門，只有 76 個有編號
        {
          place: { zh: '🔍 少掉的那幾個號碼', en: '🔍 The Missing Numbers' },
          emoji: '🔢',
          story: { zh: '安安一個一個數過去，臉色越來越怪：「小Q……底層明明有 {80} 個拱門，可是有編號的只有 {76} 個。」老導覽員雙手一拍：「答對了！」小Q瞇起眼：「那沒編號的那幾個，是做什麼用的？先算出來——差幾個？」',
                   en: 'An-An counts them one by one, her face growing puzzled: “Little Q… there are {80} arches on the ground tier, but only {76} carry numbers.” The attendant claps his hands: “Exactly!” Little Q narrows his eyes: “Then what were the unnumbered ones for? Work out the difference first — how many?”' },
          clueNote: { zh: '底層 80 個拱門，只有 76 個刻了羅馬數字，4 個沒有編號', en: '80 ground-tier arches, only 76 carry Roman numerals — 4 are unnumbered' },
          puzzle: {
            text: { zh: '底層 {80} 個拱門，有編號的只有 {76} 個。沒編號的有幾個？',
                    en: '{80} ground-tier arches, but only {76} are numbered. How many are unnumbered?' },
            answer: 4, unit: { zh: '個', en: 'arches' },
            hint: { zh: '相差用減法：80 − 76！', en: 'Difference means subtract: 80 − 76!' },
            teach: [
              { zh: '「有幾個沒編號」＝總數減掉有編號的：80 − 76。',
                en: '“How many unnumbered” = the total minus the numbered ones: 80 − 76.' },
              { zh: '80 − 76：從 76 往上數到 80，數幾步就是答案。',
                en: '80 − 76: count up from 76 to 80 — the number of steps is your answer.' },
              { zh: '換你算出沒編號的拱門有幾個！',
                en: 'You find how many arches have no number!' },
            ],
            reward: { zh: '🔢 4 個！老導覽員滿意地點頭：「兩千年前，古羅馬人買票入場，票上寫著拱門的號碼，照號碼進去就找得到座位——跟現在看球賽一模一樣。可是那 4 個沒號碼的，是留給誰的呢？」小Q把三份說法排開：「安安，指出來吧——手冊上錯的那一句，是哪一句？」',
                      en: '🔢 Four! The attendant nods with satisfaction: “Two thousand years ago Romans bought tickets marked with an arch number, walked through it, and found their seat — exactly like a stadium today. But those four without numbers — who were they for?” Little Q lays out the three claims: “An-An, point it out — which line in the booklet is the wrong one?”' },
          },
        },
      ],
      suspects: [
        { id: 'booklet', name: { zh: '📘 導覽手冊', en: '📘 The Guide Booklet' }, emoji: '📘',
          say: { zh: '「底層八十個拱門，每一個都刻有編號，古羅馬觀眾就是靠這些號碼對號入座的。」',
                 en: '“All eighty ground-tier arches bear a number; Roman spectators found their seats by these numerals.”' } },
        { id: 'ticket', name: { zh: '🎫 售票口的告示', en: '🎫 The Ticket-Window Notice' }, emoji: '🎫',
          say: { zh: '「本競技場最多可容納五萬名觀眾，散場時由底層各拱門疏散。」',
                 en: '“This amphitheatre held up to fifty thousand spectators, who dispersed through the ground-tier arches.”' } },
        { id: 'plaque', name: { zh: '🪧 牆上的石牌', en: '🪧 The Stone Plaque' }, emoji: '🪧',
          say: { zh: '「本建築約於西元八十年完工，外牆共三層，高四十八公尺。」',
                 en: '“This building was completed around the year 80. The outer wall has three tiers and stands forty-eight metres tall.”' } },
      ],
      culprit: 'booklet',
      accuse: { zh: '你自己一個一個數過了：底層有 80 個拱門，可是刻著羅馬數字的只有 76 個，有 4 個從頭到尾沒有號碼。三份說法裡，其他兩份的數字你也都親手驗過——五萬人、四十八公尺、三層、西元八十年，全都對得上。只有一份，把「八十個」和「每一個都有編號」硬湊成同一句話。是哪一份？',
                en: 'You counted them yourself: 80 arches on the ground tier, but only 76 carry Roman numerals — four have no number at all. Of the three claims, you verified the other two by hand: fifty thousand people, forty-eight metres, three tiers, the year 80 — all check out. Only one welds “eighty arches” and “every one is numbered” into a single sentence. Which one?' },
      wrongAccuse: { zh: '這一份的數字你自己都驗過喔——五萬人除以八十個出口是 625 人（你算的）、三層每層八十個拱門是 240 個（你算的）、高 48 公尺約 16 層樓（你算的）、西元 80 年到今年 1946 歲（你算的）。全部對得上。真正兜不攏的，是那句「每一個都有編號」——因為你數出來只有 76 個。是哪一份這樣寫的？📘',
                     en: 'You checked this one’s figures yourself — 50,000 ÷ 80 exits = 625 (you did that), 3 tiers × 80 = 240 arches (you did that), 48 m ≈ 16 storeys (you did that), year 80 to now = 1946 years (you did that). All consistent. The one that does not add up is “every one is numbered” — because you counted only 76. Which claim says that? 📘' },
      solve: [
        { zh: '錯的是📘導覽手冊那一句「每一個都刻有編號」！底層確實有 80 個拱門，但刻著羅馬數字的只有 76 個——另外 4 個沒有號碼。而且它們的位置很特別：正好在橢圓形的四個端點上，東西南北各一個。',
          en: 'The error is the booklet’s line, “all bear a number”! There really are 80 arches on the ground tier, but only 76 carry Roman numerals — the other four have none. And their positions are telling: they sit at the four ends of the oval, one at each of north, south, east and west.' },
        { zh: '老導覽員說：「那 4 個是貴賓入口——皇帝和重要人物專用的，不必對號入座，所以不需要號碼。」小Q把老花眼鏡一推：「所以手冊沒有說謊，它只是把『大部分』寫成了『每一個』。安安，還記得我們在大溪學過的嗎？」安安點點頭：「一個字不一樣，故事就不一樣了。」',
          en: 'The attendant explains: “Those four were the honour entrances — for the emperor and dignitaries, who needed no assigned seat and therefore no number.” Little Q pushes up his glasses: “So the booklet did not lie; it merely wrote ‘every one’ where it meant ‘most.’ An-An, remember what we learned back in Daxi?” She nods: “Change one word, and the story changes.”' },
        { zh: '⭐ 而且這件事你到現場真的可以自己驗證：十一月你站在競技場外牆下，抬頭看拱門上方——有些地方的羅馬數字到今天還看得見（I、II、III、IV⋯⋯）。找找看哪幾個拱門上面是空的。那就是留給皇帝走的門。',
          en: '⭐ And you can verify this yourself on the spot: in November, stand beneath the outer wall and look up above the arches — in places the Roman numerals are still visible today (I, II, III, IV…). Hunt for the arches with nothing above them. Those are the doors the emperor walked through.' },
        { zh: '羅馬小知識：圓形競技場是橢圓形的，長 188 公尺、寬 156 公尺、高 48 公尺，外牆三層、每層 80 個拱門，最多能坐五萬人。散場時觀眾從底層拱門散開，幾分鐘就能走光——這種疏散設計，現代體育場到今天還在用。第二張手帳貼紙，到手！',
          en: 'Rome fact: the Colosseum is an oval 188 m by 156 m and 48 m tall, its outer wall rising in three tiers of eighty arches, seating up to fifty thousand. The crowd poured out through the ground-tier arches in minutes — a crowd-flow design modern stadiums still use. Sticker two — acquired!' },
      ],
      arcClue: { zh: '離開的時候，安安在外牆的石縫邊又看到了圓圓。牠不知道從哪裡跟來的，就蹲在一個「沒有編號」的拱門底下，尾巴捲在腳邊。老導覽員遠遠瞧見，笑了：「這座城市的貓，都住在廢墟裡。牠們比我們任何人都熟這些石頭。」安安蹲下來：「圓圓，你也是從沒有號碼的那個門進來的嗎？」橘貓抬起頭，望向北方。',
                 en: 'On the way out, An-An spots Yuan-Yuan again by a crack in the outer wall. Somehow she has followed, and now sits beneath one of the unnumbered arches, tail curled at her feet. The attendant sees her from afar and laughs: “The cats of this city live in the ruins. They know these stones better than any of us.” An-An crouches: “Yuan-Yuan, did you come in through the door with no number too?” The ginger cat lifts her head, and looks north.' },
      nextPreview: { zh: '下一站——古羅馬廣場！這裡看起來只是一片斷掉的柱子和石頭，可是考古學家說：這裡的地底下，是一層疊著一層的。最上面那層是中世紀的，再下去是古羅馬的，最底下還有更早的。也就是說——地層本身，就是一張年表。這一回要用面積和大數，把一座城市「疊起來的時間」算出來。',
                     en: 'Next stop — the Roman Forum! It looks like nothing but broken columns and stones, yet archaeologists say the ground beneath is layer upon layer: medieval on top, ancient Roman below, and older still beneath that. Which means the strata themselves are a timeline. This time we use area and big numbers to calculate a city’s stacked-up time.' },
      reward: 500,
    },

    // ─────────────────────────────────────── S9 EP3 ───────────────────────────────────────
    // ⭐ 羅馬篇的思想核心：地層就是年表。1898 年 Giacomo Boni 首創「一層一層讀」的地層考古法，
    //    跟 daxi-history 在做的事是同一件——不是直接把有名的東西挖出來，是讀土。
    //    本集刻意變化破案節奏：EP1、EP2 都是「有一份說錯了」，EP3 是「三份都對，只是不同層」。
    {
      id: 's9ep3',
      comicIntro: [
        { bg: 'forum', cast: ['anan', '⛏️'],
          say: { zh: '一整片斷掉的柱子和石頭。安安：「這裡……本來是什麼？」',
                 en: 'A whole field of broken columns and stones. An-An: "What was this place… before?"' } },
        { bg: 'forum', cast: ['anan', '🎨', '📘'],
          say: { zh: '手冊說這是古羅馬的政治中心，可是老畫家的畫裡，這裡是一片牧牛的草地。',
                 en: 'The booklet calls it the political heart of ancient Rome — yet in the old painter\'s picture, it is a cow pasture.' } },
      ],
      comicSolve: [
        { bg: 'forum', cast: ['anan', '⛏️'],
          say: { zh: '安安蹲下來摸土：「兩個都對——只是你們講的不是同一層。」',
                 en: 'An-An crouches and touches the soil: "You are both right — you are simply not talking about the same layer."' } },
        { bg: 'forum', cast: ['anan', '🐈'],
          say: { zh: '圓圓在斷柱上伸了個大懶腰，尾巴掃過一千五百年。〈手帳貼紙 3 · 疊起來的廣場〉',
                 en: 'Yuan-Yuan stretches on a broken column, her tail sweeping across fifteen centuries. Sticker 3 — The Layered Forum.' } },
      ],
      no: 3,
      title: { zh: '疊起來的廣場', en: 'The Layered Forum' },
      emoji: '🏺',
      accent: '#9c8a6b',
      difficulty: { zh: '乘法·減法·大數·四則併式·除法（四上）', en: 'Times · minus · big numbers · combined ops · division (Grade 4-1)' },
      sticker: { id: 'forum', emoji: '🏺', name: { zh: '手帳貼紙 3 · 疊起來的廣場', en: 'Sticker 3 · The Layered Forum' } },
      intro: [
        { zh: '從競技場走過去只要幾分鐘，眼前忽然開闊起來——可是安安愣住了。這裡沒有完整的建築，只有一整片斷掉的柱子、倒下的石塊、長著草的地基，像被誰砸爛了以後就沒再收拾。「這裡……本來是什麼？」安安小小聲問。小Q輕聲說：「這裡曾經是全世界最重要的一塊地。」',
          en: 'It is only a few minutes’ walk from the Colosseum, and then the view opens out — and An-An stops short. There are no whole buildings here, only broken columns, fallen blocks and grass-covered foundations, as though someone smashed it and never tidied up. “What… was this place before?” she asks quietly. Little Q says softly: “This was once the most important piece of ground in the world.”' },
        { zh: '入口的告示牌上有兩張圖並排。左邊是導覽手冊的復原圖：神廟、大會堂、凱旋門，金碧輝煌。右邊是一張十六世紀的老油畫，同一個角度，畫的卻是——一片草地，幾頭牛在吃草，遠處只露出幾根柱子的頭。畫的標題寫著：**Campo Vaccino（牛的田野）**。安安看看左邊，又看看右邊：「小Q，這……這是同一個地方嗎？」',
          en: 'At the entrance, two pictures hang side by side. On the left, the guidebook’s reconstruction: temples, basilicas, triumphal arches, all gleaming. On the right, a sixteenth-century oil painting of the very same view — showing a meadow, a few cows grazing, and only the tops of some columns poking out of the ground. Its title reads: **Campo Vaccino — the Cow Field.** An-An looks left, then right: “Little Q… is this the same place?”' },
      ],
      scenes: [
        // 1 ⛏️ 乘法：土是怎麼堆起來的
        {
          place: { zh: '⛏️ 土會慢慢長高', en: '⛏️ The Ground Grows Taller' },
          emoji: '⛏️',
          story: { zh: '一位戴著草帽的考古志工蹲在坑邊：「小朋友，你知道嗎？地面會慢慢『長高』。房子倒了、灰塵落了、洪水淹了，一層一層蓋上去，土就越來越厚。」他豎起手指：「我們用一個好算的估計：假設每 {100} 年堆高 {30} 公分。從西元 400 年到 1800 年，一共 {14} 個一百年——你算算看，堆了幾公分？」',
                   en: 'An archaeology volunteer in a straw hat crouches at the edge of a pit: “Do you know, young lady, that the ground slowly GROWS TALLER? Buildings fall, dust settles, floods deposit silt — layer after layer, and the earth thickens.” He raises a finger: “Take an easy estimate: suppose it rises {30} cm every {100} years. From the year 400 to 1800 is {14} such centuries — how many centimetres in all?”' },
          clueNote: { zh: '（估算）14 個世紀 × 每世紀 30 公分＝堆高 420 公分，也就是 4 公尺多', en: '(Estimate) 14 centuries × 30 cm = 420 cm of build-up — over four metres' },
          puzzle: {
            text: { zh: '（估算）每 {100} 年堆高 {30} 公分，一共 {14} 個一百年。堆了幾公分？',
                    en: '(Estimate) {30} cm every {100} years, over {14} centuries. How many centimetres?' },
            answer: 420, unit: { zh: '公分', en: 'cm' },
            hint: { zh: '每個一百年 30 公分，有 14 個：30 × 14！', en: '30 cm per century, 14 of them: 30 × 14!' },
            teach: [
              { zh: '一個世紀一個世紀差不多多，用乘法：每次 30 公分，有 14 次。',
                en: 'Each century adds about the same, so multiply: 30 cm each, 14 times.' },
              { zh: '30 × 14 拆開算：30 × 10 ＝ 300，30 × 4 ＝ 120。',
                en: '30 × 14 splits up: 30 × 10 = 300, and 30 × 4 = 120.' },
              { zh: '300 ＋ 120……換你算出土堆高了幾公分！',
                en: '300 + 120… you find how many centimetres the ground rose!' },
            ],
            reward: { zh: '⛏️ 420 公分！也就是四公尺多——比一層樓還高。志工笑著說：「所以那些柱子不是變矮了，是地面長高了。整座古羅馬廣場，被自己的時間埋起來了。」安安倒抽一口氣。',
                      en: '⛏️ 420 cm — over four metres, taller than a storey. The volunteer grins: “So the columns did not shrink; the ground rose. The whole Roman Forum was buried by its own time.” An-An catches her breath.' },
          },
        },
        // 2 📅 減法：兩種挖法之間差幾年
        {
          place: { zh: '📅 兩種挖法', en: '📅 Two Ways to Dig' },
          emoji: '📅',
          story: { zh: '志工指著坑壁上一條一條顏色不同的線：「挖法也是有分好壞的。{1803} 年，費亞先生開始清理凱旋門旁的土——那時候大家只想把有名的東西挖出來，土直接倒掉。」他語氣一變：「{1898} 年，波尼先生來了，他做了一件從來沒人做過的事：**一層一層挖，而且把每一層記下來**。」小Q：「安安，算算這兩種挖法差了幾年。」',
                   en: 'The volunteer points at bands of different colours in the pit wall: “There are better and worse ways to dig. In {1803}, Signor Fea began clearing the earth by the arch — back then people only wanted the famous objects out, and the soil was simply dumped.” His tone shifts: “Then in {1898}, Signor Boni did what nobody had done before: **he dug layer by layer, and recorded every layer.**” Little Q: “An-An, how many years between the two methods?”' },
          clueNote: { zh: '1803 只挖名勝 → 1898 波尼首創「一層一層讀」，相隔 95 年', en: '1803 hauling out monuments → 1898 Boni reads layer by layer: 95 years apart' },
          puzzle: {
            text: { zh: '{1803} 年開始清理，{1898} 年才開始一層一層挖。相差幾年？',
                    en: 'Clearing began in {1803}; layer-by-layer digging only in {1898}. How many years apart?' },
            answer: 95, unit: { zh: '年', en: 'years' },
            hint: { zh: '年代差用減法：1898 − 1803！', en: 'Subtract for the gap: 1898 − 1803!' },
            teach: [
              { zh: '相差幾年就用減法：晚的年份減早的年份。',
                en: 'Years apart means subtract: the later year minus the earlier.' },
              { zh: '1898 − 1803：個位 8 − 3 ＝ 5，十位 9 − 0 ＝ 9，百位 8 − 8 ＝ 0。',
                en: '1898 − 1803: ones 8 − 3 = 5, tens 9 − 0 = 9, hundreds 8 − 8 = 0.' },
              { zh: '換你算出這兩種挖法差了幾年！',
                en: 'You find how many years separate the two methods!' },
            ],
            reward: { zh: '📅 95 年！小Q忽然轉頭看安安：「你發現了嗎？波尼做的事，跟我們在大溪做的事一模一樣——**不是直接抓最有名的那個東西，是把每一層都讀過一遍**。」安安用力點頭。',
                      en: '📅 95 years! Little Q turns to An-An: “Do you see it? What Boni did is exactly what we did back in Daxi — **not grabbing the most famous thing, but reading every single layer.**” An-An nods hard.' },
          },
        },
        // 3 🏛️ 大數減法：凱旋門幾歲
        {
          place: { zh: '🏛️ 賽維魯凱旋門', en: '🏛️ The Arch of Septimius Severus' },
          emoji: '🏛️',
          story: { zh: '廣場一端立著一座保存得相當完整的大理石凱旋門，高高的，上面滿是雕刻。志工說：「這座凱旋門建於西元 {203} 年。當年費亞先生開始清土的時候，它有一半還埋在地下呢。」小Q：「今年 {2026} 年，算算它幾歲。」',
                   en: 'At one end of the Forum stands a remarkably intact marble triumphal arch, tall and covered with carvings. The volunteer says: “This arch was built in the year {203}. When Signor Fea began clearing, half of it was still underground.” Little Q: “This year is {2026} — work out its age.”' },
          clueNote: { zh: '賽維魯凱旋門建於西元 203 年，約 1823 歲', en: 'The Arch of Septimius Severus, built in 203 — about 1823 years old' },
          puzzle: {
            text: { zh: '凱旋門建於西元 {203} 年，今年是 {2026} 年。它幾歲了？',
                    en: 'The arch was built in the year {203}; this year is {2026}. How old is it?' },
            answer: 1823, unit: { zh: '歲', en: 'years' },
            hint: { zh: '年代差用減法：2026 − 203！', en: 'Subtract: 2026 − 203!' },
            teach: [
              { zh: '又是算年代差：今年減掉建成那一年。',
                en: 'Another year-gap: this year minus the year it was built.' },
              { zh: '2026 − 203：個位 6 − 3 ＝ 3，十位 2 − 0 ＝ 2，百位 0 − 2 不夠減，要跟千位借。',
                en: '2026 − 203: ones 6 − 3 = 3, tens 2 − 0 = 2, then hundreds 0 − 2 needs a regroup from the thousands.' },
              { zh: '借一個千變成 10 個百：10 − 2 ＝ 8，千位剩 1……換你算出它幾歲！',
                en: 'Borrow a thousand as ten hundreds: 10 − 2 = 8, leaving 1 thousand… you finish it!' },
            ],
            reward: { zh: '🏛️ 1823 歲！安安在手帳上又添一筆。她翻回前兩頁——萬神殿 1900、競技場 1946、凱旋門 1823。三個數字排在一起，時間好像忽然變成看得見的東西了。',
                      en: '🏛️ 1823 years! Another entry in the notebook. She flips back two pages — Pantheon 1900, Colosseum 1946, Arch 1823. Three numbers in a row, and suddenly time feels like something you can see.' },
          },
        },
        // 4 🔀 分支選擇（兩分支同答案 48）
        {
          kind: 'choice',
          place: { zh: '廣場上的兩條路', en: 'Two Paths Across the Forum' },
          emoji: '🔀',
          story: { zh: '志工指指兩邊：「想更懂這塊地，有兩條路。左邊走『聖道』——古羅馬人凱旋遊行走的那條石板路，兩千年來一直在那裡。右邊到考古工作站，看波尼留下來的那些一層一層的紀錄卡。」圓圓不知何時已經蹲在聖道的石板上曬太陽了。',
                   en: 'The volunteer gestures both ways: “Two paths to understand this ground. Left, walk the Via Sacra — the paving stones the triumphs marched along, still here after two thousand years. Right, the field station, to see Boni’s layer-by-layer record cards.” Yuan-Yuan is already sunning herself on the Via Sacra’s stones.' },
          question: { zh: '★ 你來決定！要走哪一條？（兩條都通，選你喜歡的！）',
                      en: '★ You decide! Which path? (Both work — pick your favourite!)' },
          options: [
            {
              id: 'viasacra',
              label: { zh: '🛤️ 走一趟聖道', en: '🛤️ Walk the Via Sacra' },
              scene: {
                place: { zh: '聖道的石板', en: 'The Stones of the Via Sacra' },
                emoji: '🛤️',
                story: { zh: '腳下的石板被兩千年的腳步磨得發亮。志工說：「你數數看這一段——{6} 排石板，每排 {8} 塊。走在上面的時候想想看：凱撒走過、皇帝走過、然後是牛走過，最後是你。」',
                         en: 'The paving underfoot gleams, polished by two thousand years of feet. The volunteer says: “Count this stretch — {6} rows of {8} slabs. And as you walk, consider: Caesar walked here, emperors walked here, then cows walked here — and now you.”' },
                clueNote: { zh: '聖道這一段共 48 塊石板（6 排 × 8 塊）', en: 'This stretch of the Via Sacra has 48 slabs (6 rows × 8)' },
                puzzle: {
                  text: { zh: '石板 {6} 排，每排 {8} 塊，[一共]幾塊？', en: '{6} rows, {8} slabs each — how many [in all]?' },
                  answer: 48, unit: { zh: '塊', en: 'slabs' },
                  hint: { zh: '每排 8 塊，有 6 排：8 × 6！', en: '8 per row, 6 rows: 8 × 6!' },
                  teach: [
                    { zh: '一排一排一樣多，用乘法：每排 8 塊，有 6 排。',
                      en: 'Equal rows — multiply: 8 slabs, 6 rows.' },
                    { zh: '就是 8 × 6（或 6 × 8，答案一樣）。',
                      en: 'That’s 8 × 6 (or 6 × 8 — same answer).' },
                    { zh: '8 × 6……換你數出這一段有幾塊石板！',
                      en: '8 × 6… you count the slabs in this stretch!' },
                  ],
                  reward: { zh: '🛤️ 48 塊！安安慢慢走過去，忽然明白一件事：這條路本身，就是最上面那一層。（十一月你真的可以走在上面喔。）',
                            en: '🛤️ 48 slabs! An-An walks it slowly and suddenly understands: this road IS the topmost layer. (In November you can really walk on it.)' },
                },
              },
            },
            {
              id: 'station',
              label: { zh: '🗂️ 看波尼的紀錄卡', en: '🗂️ Boni’s Record Cards' },
              scene: {
                place: { zh: '考古工作站', en: 'The Field Station' },
                emoji: '🗂️',
                story: { zh: '工作站裡一整面牆都是抽屜。志工拉開幾個給安安看：「波尼每挖一層，就填一張卡：深度、顏色、撿到什麼。這一櫃有 {8} 層抽屜，每層 {6} 格。」安安睜大眼：「他把土都記下來了？」',
                         en: 'One whole wall of the station is drawers. The volunteer pulls a few open: “For every layer Boni dug, he filled out a card — depth, colour, what was found. This cabinet has {8} tiers of drawers, {6} slots each.” An-An’s eyes widen: “He wrote down the SOIL?”' },
                clueNote: { zh: '波尼的紀錄卡櫃共 48 格（8 層 × 6 格）', en: 'Boni’s record cabinet has 48 slots (8 tiers × 6)' },
                puzzle: {
                  text: { zh: '抽屜 {8} 層，每層 {6} 格，[一共]幾格？', en: '{8} tiers, {6} slots each — how many [in all]?' },
                  answer: 48, unit: { zh: '格', en: 'slots' },
                  hint: { zh: '每層 6 格，有 8 層：6 × 8！', en: '6 per tier, 8 tiers: 6 × 8!' },
                  teach: [
                    { zh: '一層一層一樣多，用乘法：每層 6 格，有 8 層。',
                      en: 'Equal tiers — multiply: 6 slots, 8 tiers.' },
                    { zh: '就是 6 × 8（或 8 × 6，答案一樣）。',
                      en: 'That’s 6 × 8 (or 8 × 6 — same answer).' },
                    { zh: '6 × 8……換你數出一共幾格紀錄卡！',
                      en: '6 × 8… you count the record slots!' },
                  ],
                  reward: { zh: '🗂️ 48 格！志工說：「土本身就是證據。丟掉土，就等於把年表撕掉。」安安在手帳上抄下這句話。',
                            en: '🗂️ 48! The volunteer says: “The soil itself is evidence. Throw away the soil and you tear up the timeline.” An-An copies the line into her notebook.' },
                },
              },
            },
          ],
        },
        // 5 🏛️ 四則併式：全盛時期有多少建築
        {
          place: { zh: '🏛️ 全盛的時候', en: '🏛️ At Its Height' },
          emoji: '🏺',
          story: { zh: '志工攤開復原圖：「西元四世紀，這裡最熱鬧的時候有 {9} 座神廟、{3} 座大會堂、{3} 座凱旋門。」安安看著眼前這片碎石頭，很難想像。小Q：「先算總數——三種加起來，一共幾座大建築？」',
                   en: 'The volunteer unrolls the reconstruction: “In the fourth century, at its busiest, there were {9} temples, {3} basilicas and {3} triumphal arches.” An-An looks at the rubble before her and can hardly picture it. Little Q: “Total first — how many great buildings altogether?”' },
          clueNote: { zh: '全盛期：神廟 9 ＋ 大會堂 3 ＋ 凱旋門 3 ＝ 15 座大建築', en: 'At its height: 9 temples + 3 basilicas + 3 arches = 15 great buildings' },
          puzzle: {
            text: { zh: '{9} 座神廟、{3} 座大會堂、{3} 座凱旋門。[一共]幾座？',
                    en: '{9} temples, {3} basilicas, {3} arches. How many [in all]?' },
            answer: 15, unit: { zh: '座', en: 'buildings' },
            hint: { zh: '三種加起來：9 ＋ 3 ＋ 3！', en: 'Add the three kinds: 9 + 3 + 3!' },
            teach: [
              { zh: '三種東西相加，可以先把好加的湊在一起：3 ＋ 3 ＝ 6。',
                en: 'Adding three groups — pair the easy ones first: 3 + 3 = 6.' },
              { zh: '再加上神廟：9 ＋ 6。',
                en: 'Then add the temples: 9 + 6.' },
              { zh: '換你算出全盛時期一共幾座大建築！',
                en: 'You find how many great buildings stood here at its height!' },
            ],
            reward: { zh: '🏺 15 座！志工指著空地：「現在你看得到的，一座完整的都沒有。」他頓了頓：「可是它們都還在——在地底下。」',
                      en: '🏺 Fifteen! The volunteer gestures at the empty ground: “Of those, not one stands whole today.” He pauses: “And yet they are all still here — underneath.”' },
          },
        },
        // 6 🔢 大數加法：西元前與西元之間
        {
          place: { zh: '🔢 農神廟的八根柱子', en: '🔢 The Eight Columns of Saturn' },
          emoji: '🏛️',
          story: { zh: '廣場邊立著八根高大的柱子，孤零零地撐著一塊石樑。志工說：「那是農神廟，這裡最老的建築之一，大約在**西元前 {498} 年**。」安安皺眉：「西元前？」小Q解釋：「時間軸上有一個『西元 1 年』當分界，之前叫西元前，往回數；之後叫西元，往前數。所以要算農神廟到凱旋門（西元 {203} 年）中間隔多久，兩段要**加起來**。」',
                   en: 'Eight tall columns stand at the Forum’s edge, alone, holding a single stone beam. The volunteer says: “The Temple of Saturn — among the oldest here, from about **498 BC**.” An-An frowns: “BC?” Little Q explains: “The timeline has a dividing point, the year 1. Before it we count backwards and call it BC; after it we count forwards. So to find the gap between the temple and the arch (AD {203}), you must **add** the two stretches.”' },
          clueNote: { zh: '農神廟（西元前 498）到凱旋門（西元 203）＝498 ＋ 203 ＝ 701 年', en: 'Temple of Saturn (498 BC) to the Arch (AD 203) = 498 + 203 = 701 years' },
          puzzle: {
            text: { zh: '農神廟約在西元前 {498} 年，凱旋門在西元 {203} 年。中間隔了幾年？',
                    en: 'The temple is from about {498} BC, the arch from AD {203}. How many years between?' },
            answer: 701, unit: { zh: '年', en: 'years' },
            hint: { zh: '跨過西元 1 年，兩段要相加：498 ＋ 203！', en: 'Crossing the year 1, add the two stretches: 498 + 203!' },
            teach: [
              { zh: '重點觀念：跨過「西元前 → 西元」時，兩段時間要**相加**，不是相減。',
                en: 'Key idea: when crossing from BC to AD, you **add** the two stretches, not subtract.' },
              { zh: '498 ＋ 203：個位 8 ＋ 3 ＝ 11，寫 1 進 1；十位 9 ＋ 0 ＋ 1 ＝ 10，寫 0 進 1。',
                en: '498 + 203: ones 8 + 3 = 11, write 1 carry 1; tens 9 + 0 + 1 = 10, write 0 carry 1.' },
              { zh: '百位 4 ＋ 2 ＋ 1……換你算出中間隔了幾年！',
                en: 'Hundreds: 4 + 2 + 1… you finish and find the gap!' },
            ],
            reward: { zh: '🔢 701 年！小Q：「所以光是這個廣場上，最老和比較新的建築就差了七百年——比台灣有文字紀錄的歷史還長。」安安看著那八根柱子，好久沒說話。',
                      en: '🔢 701 years! Little Q: “So within this one square, the oldest and the newer buildings are seven centuries apart — longer than Taiwan’s written history.” An-An gazes at the eight columns and says nothing for a long while.' },
          },
        },
        // 7 🔢 除法：每一層有多厚
        {
          place: { zh: '🔢 每一層有多厚', en: '🔢 How Thick Is Each Layer' },
          emoji: '📏',
          story: { zh: '志工帶安安到一個切開的坑邊，坑壁上清清楚楚看得出顏色不同的橫紋。「波尼在這裡數出了 {7} 層。」他用手比了比整段深度：「總共 {420} 公分——就是你剛剛算出來的那個數字。」小Q：「那平均每一層有多厚？」',
                   en: 'The volunteer leads her to a cut pit where bands of different colour show plainly in the wall. “Boni counted {7} layers here.” He measures the full depth with his hand: “{420} cm in total — the very number you worked out earlier.” Little Q: “So how thick is each layer on average?”' },
          clueNote: { zh: '420 公分 ÷ 7 層＝平均每層 60 公分', en: '420 cm ÷ 7 layers = 60 cm per layer on average' },
          puzzle: {
            text: { zh: '總深 {420} 公分，一共 {7} 層。[平均]每層幾公分？',
                    en: 'Total depth {420} cm across {7} layers. How many cm per layer on [average]?' },
            answer: 60, unit: { zh: '公分', en: 'cm' },
            hint: { zh: '平分用除法：420 ÷ 7！', en: 'Equal shares means divide: 420 ÷ 7!' },
            teach: [
              { zh: '要「平分」就用除法：420 公分平分給 7 層。',
                en: 'To share equally, divide: 420 cm across 7 layers.' },
              { zh: '420 ÷ 7：想 42 ÷ 7 ＝ 6，再把 0 補回去。',
                en: '420 ÷ 7: think 42 ÷ 7 = 6, then put the zero back.' },
              { zh: '換你算出平均每一層有多厚！',
                en: 'You find the average thickness of each layer!' },
            ],
            reward: { zh: '📏 60 公分！差不多到安安的腰。志工說：「每一層，都是一段沒有人寫下來的日子。」小Q把三份說法排開：「安安，現在回答那個問題吧——導覽手冊說這裡是政治中心，老油畫說這裡是牧牛的草地。到底哪一份說錯了？」',
                      en: '📏 60 cm — about waist-high on An-An. The volunteer says: “Each layer is a stretch of days nobody wrote down.” Little Q lays out the three accounts: “An-An, answer the question now — the booklet says political heart, the old painting says cow pasture. Which one is wrong?”' },
          },
        },
        // 8 🔍 破案：兩個都對，只是差了 1500 年
        {
          place: { zh: '🔍 差了一千五百年', en: '🔍 Fifteen Hundred Years Apart' },
          emoji: '⚖️',
          story: { zh: '安安蹲下來，把手放在土上，忽然抬起頭：「小Q……他們講的不是同一層。」她指著復原圖：「手冊畫的是大概西元 {100} 年那一層。」再指老油畫：「這幅畫的是西元 {1600} 年那一層。」小Q眼睛亮了起來：「算算看——這兩層之間差了幾年？」',
                   en: 'An-An crouches, lays her palm on the soil, then looks up sharply: “Little Q… they are not talking about the same layer.” She points at the reconstruction: “The booklet draws roughly the layer of AD {100}.” Then at the painting: “And this paints the layer of AD {1600}.” Little Q’s eyes light up: “Work it out — how many years between those two layers?”' },
          clueNote: { zh: '手冊畫西元 100 年那層、老畫畫西元 1600 年那層，相差 1500 年、隔著四公尺多的土', en: 'The booklet shows the AD 100 layer, the painting the AD 1600 layer — 1500 years and four metres of earth apart' },
          puzzle: {
            text: { zh: '手冊畫的是西元 {100} 年那一層，老油畫畫的是西元 {1600} 年那一層。相差幾年？',
                    en: 'The booklet shows the AD {100} layer; the painting shows the AD {1600} layer. How many years apart?' },
            answer: 1500, unit: { zh: '年', en: 'years' },
            hint: { zh: '兩層的年代差用減法：1600 − 100！', en: 'Subtract the two layers’ years: 1600 − 100!' },
            teach: [
              { zh: '兩層之間差幾年，就是兩個年份相減：1600 − 100。',
                en: 'The gap between two layers is one year minus the other: 1600 − 100.' },
              { zh: '整百的數相減很好算：16 個百減掉 1 個百，剩 15 個百。',
                en: 'Round hundreds are easy: sixteen hundreds minus one hundred leaves fifteen hundreds.' },
              { zh: '換你算出這兩層之間差了幾年！',
                en: 'You find how many years lie between the two layers!' },
            ],
            reward: { zh: '⚖️ 1500 年！整整十五個世紀，還隔著四公尺多的土。安安站起來，拍拍手上的泥：「小Q，我知道答案了——這一次，沒有人說錯。」小Q欣慰地笑了：「說出來給大家聽。」',
                      en: '⚖️ 1500 years! Fifteen full centuries, with four metres of earth between them. An-An stands and dusts off her hands: “Little Q, I have it — this time, nobody was wrong.” Little Q smiles warmly: “Then say it aloud.”' },
          },
        },
      ],
      suspects: [
        { id: 'booklet', name: { zh: '📘 導覽手冊的復原圖', en: '📘 The Booklet’s Reconstruction' }, emoji: '📘',
          say: { zh: '「此處為古羅馬的政治中心，九座神廟、三座大會堂、三座凱旋門，金碧輝煌。」',
                 en: '“This was the political heart of ancient Rome — nine temples, three basilicas, three triumphal arches, all resplendent.”' } },
        { id: 'painting', name: { zh: '🎨 十六世紀的老油畫', en: '🎨 The Sixteenth-Century Painting' }, emoji: '🎨',
          say: { zh: '「Campo Vaccino——牛的田野。一片草地，幾頭牛，遠處只露出幾根柱子的頭。」',
                 en: '“Campo Vaccino — the Cow Field. A meadow, a few cows, and only the tops of some columns showing.”' } },
        { id: 'boni', name: { zh: '⛏️ 波尼的地層紀錄', en: '⛏️ Boni’s Stratigraphic Record' }, emoji: '⛏️',
          say: { zh: '「本坑計七層，總深四百二十公分。每一層各屬不同年代，逐層記錄，不得混同。」',
                 en: '“This pit holds seven layers, 420 cm deep in all. Each layer belongs to a different age; record them one by one, never mixed.”' } },
      ],
      culprit: 'boni',
      accuse: { zh: '⚠️ 這一次不一樣——**沒有人說錯**。導覽手冊畫的是西元 100 年那一層，老油畫畫的是西元 1600 年那一層，中間差了 1500 年、隔著四公尺多的土。兩幅畫都是真的，只是不在同一層。那麼問題來了：三份說法裡，只有一份**能同時解釋另外兩份為什麼都對**。是哪一份？',
                en: '⚠️ This time is different — **nobody is wrong.** The booklet draws the layer of AD 100; the painting shows the layer of AD 1600. Fifteen hundred years and four metres of earth lie between them. Both pictures are true; they simply belong to different layers. So here is the question: only one of the three accounts **can explain why the other two are both right.** Which one?' },
      wrongAccuse: { zh: '這一份沒有說錯喔——它畫的那一層是真的存在過的。再想一次：我們要找的不是「誰錯了」，而是「誰能解釋另外兩個為什麼都對」。誰把這塊地分成一層一層、每層各屬不同年代？⛏️',
                     en: 'This one is not wrong — the layer it depicts really did exist. Think again: we are not asking who is mistaken, but who can EXPLAIN why the other two are both right. Who divided this ground into layers, each belonging to a different age? ⛏️' },
      solve: [
        { zh: '答案是⛏️波尼的地層紀錄——因為只有它同時解釋了另外兩份。這塊地不是「一個地方」，是**一疊地方**：最上面是牛吃草的草地，往下是中世紀的房子，再往下才是導覽手冊畫的那座金碧輝煌的廣場。導覽手冊和老油畫都沒有說謊，它們只是站在不同的高度看同一塊地。',
          en: 'The answer is ⛏️ Boni’s stratigraphic record — because only it explains the other two. This ground is not one place but a **stack of places**: on top, the meadow where cows grazed; below that, medieval houses; and deeper still, the resplendent forum the booklet draws. Neither the booklet nor the painting lied — they simply stood at different heights above the same ground.' },
        { zh: '志工說：「一八九八年以前，大家挖古蹟的方式是——看到有名的東西就挖出來，土全部倒掉。波尼是第一個說『不行，土也是證據』的人。他一層一層挖、一層一層記，才讓我們知道這裡不只有一個故事，有七個。」',
          en: 'The volunteer says: “Before 1898, excavation meant hauling out anything famous and dumping the soil. Boni was the first to say, ‘No — the soil is evidence too.’ He dug layer by layer and recorded layer by layer, and only then did we learn that this place holds not one story, but seven.”' },
        { zh: '小Q輕輕說：「安安，還記得我們在大溪嗎？那時候我們說：不要只抓最有名的那個說法，要把每一層都讀過。」安安點點頭，在手帳上寫下一行字：**「同一塊地，可以同時是廣場，也是牧場——只要你問對『什麼時候』。」**',
          en: 'Little Q says quietly: “An-An, remember Daxi? We said then: do not seize only the most famous account — read every layer.” She nods and writes a line in her notebook: **“The same ground can be a forum and a pasture at once — so long as you ask the right ‘when.’”**' },
        { zh: '⭐ 現場可以自己驗證：十一月你站在古羅馬廣場，會發現要**往下走**才到得了古羅馬的地面——因為現在的路面比兩千年前高了好幾公尺。走下去的每一階，都是在往回走時間。羅馬小知識：這裡從十六世紀起被叫做 Campo Vaccino（牛的田野），因為整座廣場被埋在土裡，上面真的在放牛。第三張手帳貼紙，到手！',
          en: '⭐ Verify it yourself on the spot: in November, standing at the Roman Forum, you will find you must walk **downwards** to reach the ancient ground — today’s street level sits metres higher than it did two thousand years ago. Every step down is a step back through time. Rome fact: from the sixteenth century this place was called Campo Vaccino, the Cow Field — because the whole forum lay buried, and cattle really did graze on top of it. Sticker three — acquired!' },
      ],
      arcClue: { zh: '夕陽把斷柱的影子拉得好長。圓圓蹲在一根倒下的大理石柱上，正好在陽光和陰影的交界處，尾巴一擺一擺的。安安看著牠：「圓圓，你住的萬神殿沒有被埋起來耶。」橘貓歪了歪頭。志工在旁邊接話：「萬神殿是羅馬唯一從蓋好那天起、一直有人在用、從來沒被廢棄過的建築。所以它沒有被時間埋掉。」圓圓忽然站起來，又望向北方，喉嚨裡那聲「喵」比昨天更長一點。',
                 en: 'The low sun stretches the broken columns’ shadows long. Yuan-Yuan perches on a fallen marble shaft, right at the border of light and shade, tail swaying. An-An looks at her: “Yuan-Yuan, your Pantheon never got buried.” The cat tilts her head. The volunteer chimes in: “The Pantheon is the only building in Rome that has been in continuous use from the day it was finished — never abandoned. So time never buried it.” Yuan-Yuan rises abruptly, looks north again, and the “mew” in her throat lasts a little longer than yesterday’s.' },
      nextPreview: { zh: '下一站——許願池！觀光客把硬幣往後一丟，許個願。可是小Q對硬幣沒興趣，他盯著的是水：「安安，你有沒有想過，這麼大一座噴泉，水是從哪裡來的？」答案會嚇你一跳——那些水，走的是兩千年前古羅馬人挖的水道。這一回要用公里和除法，追一條水走了多遠。',
                     en: 'Next stop — the Trevi Fountain! Tourists toss a coin over the shoulder and make a wish. But Little Q cares nothing for coins; he is staring at the water: “An-An, have you wondered where the water for a fountain this size comes from?” The answer will startle you — it still travels an aqueduct the Romans dug two thousand years ago. This time we use kilometres and division to trace how far water walks.' },
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
