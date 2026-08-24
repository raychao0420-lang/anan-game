// 長篇連續劇 第八季《安安偵探社 · 大溪疑案簿》
// The An-An Detective Agency — Season 8: Daxi, The Missing Pages
//
// 主題＝「想被叫出名字」。接續 S7：安安翻開集滿的《家鄉故事書》，發現有一頁的字是淡的
//   ——不是褪色，是當初就沒被寫下來。阿榕🌳：「我只聽過一半的故事，另外一半，在山的那邊。」
//
// ★ 最大差別（S7 vs S8）：S7 走地面（老街、豆干、神桌＝觀光敘事），S8 往下挖。
//   本季「沒有兇手」——被調查的是「紀錄本身」。每個現場給三份互相矛盾的史料：
//     📘 導覽版（好聽好賣，細節不精確）／📗 官方版（只講功績，不講錢從哪來）／
//     📙 老紀錄（數字很硬，但只寫得下有權力的人）
//   三份都不是壞人、三份都只對了一部分。安安用數學把數字對起來，找出哪一份兜不攏。
// ★ 破案三問（招牌台詞，每集固定出現一次）：💰錢從哪來？🗺️地從哪來？🗣️這故事是誰講的？
// ★ 引擎完全不用改：沿用 S3 起的「真推理」（clueNote 證據板＋suspects[].say 藏數字＋
//   accuse 不爆雷），只是把「嫌疑人」換成「史料版本」。episode id 用 's8ep*' 前綴。
// ★ 數學：翰林版【四上】十單元，本季不做四下前導（2026-08-24 使用者確認）。
// ★ 每集收集一張「史料卡」card（ARCHIVE_BOARD），集滿 12 張＝信物《沒有寫下來的大溪》。
// ★ 裏層主線：台灣藍鵲「阿藍」🐦（俗名長尾山娘，大溪山區在地鳥）＝山那一邊的目擊者。
//   ⚠️ 族群再現鐵則：泰雅族在故事裡就是「人」，好好地當人，絕不做成可愛動物精靈。
//      阿藍只替山說話，不代表任何族群。
// ★ 戰爭尺度（2026-08-24 使用者指示）：輕描淡寫但可提。可寫「那一年山上的路被切斷了」；
//   不寫戰鬥、傷亡、武器、獵首。數字只用在資源（樟腦每日 7 圓、48 甲地），不用在傷亡。
//
// 史料依據：daxi-history/（大溪史料考）。凡該專案標 ⚠️ 未定案者，只能寫成謎題、不可寫成定論。
// 完整劇本與 12 站大綱見 docs/season8-劇本.md。

export const SEASON8 = {
  id: 'season8',
  title: { zh: '大溪疑案簿', en: 'Daxi, The Missing Pages' },
  emoji: '🔍',
  seasonIntro: [
    { zh: '家鄉大會結束的那個晚上，安安把集滿的《家鄉故事書》翻了又翻。十二頁，每一頁都是自己親手找回來的。可是翻到最後，她愣住了——書的最後面，還有一頁。那一頁不是空白的，上面有字，但字很淡很淡，像寫到一半就被人擦掉了。',
      en: 'The night the Hometown Fair ended, An-An leafed through her completed Hometown Storybook again and again. Twelve pages, every one found with her own hands. But at the very back, she froze — there was one more page. Not blank: there WAS writing on it, but so faint, as though someone had erased it halfway.' },
    { zh: '「阿榕，這頁是什麼？」老榕樹靈沉默了好久好久，久到風都停了。「……那一頁，我也不知道該怎麼寫。」阿榕的聲音第一次聽起來這麼小，「我站在街上一百年，看得見老街、看得見河、看得見人來人往。可是安安啊——我看不見山的那邊。我聽過的故事，只有一半。」',
      en: '“Ah-Rong, what is this page?” The old banyan spirit was silent for a long, long time — long enough for the wind to still. “…That page, I never knew how to write.” Ah-Rong’s voice had never sounded so small. “I have stood on this street for a hundred years. I can see the old street, the river, the people coming and going. But An-An — I cannot see the other side of the mountain. The story I know is only half.” ' },
    { zh: '就在這時，一隻長長藍尾巴的大鳥停在窗台上，歪著頭看她。牠叼著一根羽毛，輕輕放在那頁淡字上面。羽毛落下的地方，一個從沒見過的字慢慢浮了出來。阿榕輕聲說：「那是長尾山娘，山上的鳥。安安……牠好像，有話想跟你說。」',
      en: 'Just then, a great bird with a long blue tail landed on the windowsill, tilting its head at her. In its beak was a feather, which it laid gently on the faint writing. Where the feather touched, a character she had never seen slowly surfaced. Ah-Rong said softly: “That is the Long-Tailed Mountain Lady, a bird of the hills. An-An… I think she has something to tell you.”' },
  ],

  episodes: [
    // ─────────────────────────────────────── S8 EP1 ───────────────────────────────────────
    {
      id: 's8ep1',
      comicIntro: [
        { bg: 'oldstreet', cast: ['anan', '🐦'],
          say: { zh: '藍尾巴的大鳥一路帶著安安，停在老街一間文具行前面。',
                 en: 'The blue-tailed bird leads An-An all the way to a stationery shop on the old street.' } },
        { bg: 'oldstreet', cast: ['anan', '🧓'],
          say: { zh: '林阿姨舉著一張泛黃的地契：「偵探！我阿公留的地契上寫『海山堡』，那到底是哪裡啊？」',
                 en: 'Auntie Lin holds up a yellowed land deed: "Detective! My grandfather\'s deed says \'Haishan Bao\' — where on earth is that?"' } },
      ],
      comicSolve: [
        { bg: 'oldstreet', cast: ['anan', '📘'],
          say: { zh: '安安把三份說法排開：「導覽手冊沒有說謊——它只是從一九二〇年才開始算。」',
                 en: 'An-An lays out the three accounts: "The guidebook did not lie — it simply starts counting from 1920."' } },
        { bg: 'banyan', cast: ['anan', 'arong', '🐦'],
          say: { zh: '老榕樹下，藍鵲落下一根羽毛：〈史料卡 1 · 海山堡〉。',
                 en: 'Under the old banyan, the blue magpie drops a feather: Archive Card 1 — Haishan Bao.' } },
      ],
      no: 1,
      title: { zh: '不在地圖上的大溪', en: 'The Daxi That Is Not on the Map' },
      emoji: '🗺️',
      accent: '#4b7fc9',
      difficulty: { zh: '公里·乘法·角度·大數·除法（四上）', en: 'km · times · angles · big numbers · division (Grade 4-1)' },
      card: { id: 'haishan-bao', emoji: '🗺️', name: { zh: '史料卡 1 · 海山堡', en: 'Archive Card 1 · Haishan Bao' } },
      intro: [
        { zh: '大溪老街的文具行裡，林阿姨愁眉苦臉地攤開一張泛黃的紙：「偵探啊，阿姨要印一份老街導覽圖給觀光客。可是我阿公留下來的這張地契，上面寫的地名我完全看不懂——它寫『海山堡』。可是我查了導覽手冊，上面明明寫『大溪自古就是桃園的一部分』。那『海山堡』又是什麼東西？是不是寫錯了？」',
          en: 'In the stationery shop on Daxi Old Street, Auntie Lin spreads out a yellowed sheet, frowning: “Detective, I want to print a walking-tour map for visitors. But this land deed my grandfather left me — I can’t read the place name on it at all. It says ‘Haishan Bao.’ Yet the guidebook clearly says ‘Daxi has been part of Taoyuan since ancient times.’ So what is ‘Haishan Bao’? Is it a mistake?”' },
        { zh: '小Q🦉推了推老花眼鏡，眼睛卻亮了起來：「有意思。這一回，我們要查的不是誰偷了東西——是『誰說的才算數』。」牠在桌上排開三份東西：一本亮晶晶的觀光導覽手冊📘、一份公所印的沿革📗、還有林阿姨那張老地契📙。「三份都在講大溪，三份說的卻不一樣。安安，記住這一季的三個問題——💰錢從哪來？🗺️地從哪來？🗣️這個故事是誰講的？」',
          en: 'Little Q 🦉 pushes up his glasses, but his eyes are bright: “Interesting. This time we’re not hunting who stole something — we’re asking WHOSE ACCOUNT COUNTS.” He lays three things on the table: a glossy tourist guidebook 📘, a township office history sheet 📗, and Auntie Lin’s old deed 📙. “All three talk about Daxi, and all three say different things. An-An, remember this season’s three questions — 💰 Where did the money come from? 🗺️ Where did the land come from? 🗣️ Who is telling this story?”' },
      ],
      scenes: [
        // 1 🏛️社會：比例尺＋公里（四上「公里」單元）
        {
          place: { zh: '🏛️ 文具行·三張地圖', en: '🏛️ The Shop · Three Maps' },
          emoji: '📏',
          diagram: 'scale-bar',
          story: { zh: '小Q把老地圖攤平：「地契上寫『海山堡』——我查到，同一個堡裡還有三峽、鶯歌、樹林。要驗證這件事，先量距離。」牠指著地圖角落：「這張老地圖的比例尺是『圖上 {1} 公分＝實際 {2} 公里』。從大溪量到三峽，圖上剛好 {8} 公分。」林阿姨睜大眼睛：「等等，三峽？那不是新北市嗎？」',
                   en: 'Little Q flattens the old map: “The deed says ‘Haishan Bao’ — and I find that the same bao also held Sanxia, Yingge and Shulin. To test that, start with distance.” He points to the corner: “This old map’s scale is ‘{1} cm on the map = {2} km in reality.’ From Daxi to Sanxia measures exactly {8} cm.” Auntie Lin’s eyes widen: “Wait — Sanxia? Isn’t that in New Taipei?”' },
          clueNote: { zh: '大溪→三峽＝16 公里（圖上 8 公分 × 每公分 2 公里）', en: 'Daxi → Sanxia = 16 km (8 cm × 2 km per cm)' },
          puzzle: {
            text: { zh: '老地圖[比例尺]：圖上 {1} 公分＝實際 {2} 公里。量得 {8} 公分，實際是幾公里？',
                    en: 'Old map [scale]: {1} cm = {2} km. Measured {8} cm — how many km in reality?' },
            answer: 16, unit: { zh: '公里', en: 'km' },
            hint: { zh: '每 1 公分換 2 公里，8 公分就是 2 × 8！', en: 'Each cm becomes 2 km, so 8 cm is 2 × 8!' },
            teach: [
              { zh: '比例尺就是地圖的「縮小魔法」，它告訴你圖上的 1 公分，代表實際多長。這張圖：1 公分＝2 公里。',
                en: 'A scale bar is the map’s “shrinking magic” — it tells you what 1 cm on paper means in reality. Here: 1 cm = 2 km.' },
              { zh: '圖上量到 8 公分，就是 8 個「2 公里」：2 × 8。',
                en: 'You measured 8 cm — that’s eight lots of 2 km: 2 × 8.' },
              { zh: '2 × 8……換你算出大溪到三峽實際有幾公里！',
                en: '2 × 8… you work out the real distance from Daxi to Sanxia in km!' },
            ],
            reward: { zh: '📏 16 公里！小Q在證據板寫下第一條：「大溪→三峽 16 公里」。牠若有所思：「先記著。等一下我們量另一段，你就會看出不對勁的地方了。」',
                      en: '📏 16 km! Little Q writes the first line on the evidence board: “Daxi → Sanxia, 16 km.” He muses: “Hold that thought. When we measure the other leg, you’ll see what doesn’t add up.”' },
          },
        },
        // 2 📙老紀錄：乘法（四上「乘法」單元）
        {
          place: { zh: '📙 泛黃的老地契', en: '📙 The Yellowed Deed' },
          emoji: '📜',
          story: { zh: '林阿姨小心翼翼地把地契攤開，紙脆得像餅乾。上面用毛筆寫著：「海山堡，共 {12} 庄。」小Q：「一個『堡』是清朝時候的地方單位，底下管好幾個『庄』——就像現在的區底下有好幾個里。老帳冊記著，那時候平均每庄約 {35} 戶人家。」安安拿起筆：「那整個海山堡有多少戶，就算得出來了！」',
                   en: 'Auntie Lin unfolds the deed with great care; the paper is brittle as a biscuit. Brushed across it: “Haishan Bao, {12} villages in all.” Little Q: “A ‘bao’ was a Qing-era district that governed several ‘villages’ — like a modern district holding many neighbourhoods. The old ledger notes about {35} households per village then.” An-An picks up her pen: “Then we can work out the whole bao!”' },
          clueNote: { zh: '海山堡 12 庄 × 每庄 35 戶＝420 戶（我自己算的）', en: 'Haishan Bao: 12 villages × 35 households = 420 (I worked it out myself)' },
          puzzle: {
            text: { zh: '海山堡共 {12} 庄，每庄約 {35} 戶。[一共]約幾戶？',
                    en: 'Haishan Bao has {12} villages, about {35} households each. About how many [in all]?' },
            answer: 420, unit: { zh: '戶', en: 'households' },
            hint: { zh: '每庄 35 戶，有 12 庄：35 × 12！', en: '35 per village, 12 villages: 35 × 12!' },
            teach: [
              { zh: '一庄一庄差不多多，用乘法最快：每庄 35 戶，有 12 庄。',
                en: 'Roughly equal villages — multiplication is fastest: 35 households, 12 villages.' },
              { zh: '35 × 12 可以拆開算：35 × 10 ＝ 350，35 × 2 ＝ 70。',
                en: '35 × 12 splits up: 35 × 10 = 350, and 35 × 2 = 70.' },
              { zh: '350 ＋ 70……換你算出海山堡一共約幾戶！',
                en: '350 + 70… you find the total households of Haishan Bao!' },
            ],
            reward: { zh: '📜 420 戶！小Q點點頭：「一個不小的地方。重點是——這張地契從頭到尾，一個『桃園』的字都沒出現過。」林阿姨怔住了：「……真的耶。」',
                      en: '📜 420 households! Little Q nods: “A sizeable place. And the point is — nowhere on this deed, from top to bottom, does the word ‘Taoyuan’ appear.” Auntie Lin stares: “…You’re right.”' },
          },
        },
        // 3 🧭社會：角度（四上「角度」單元）
        {
          place: { zh: '🧭 河邊·對著北方', en: '🧭 By the River · Facing North' },
          emoji: '🧭',
          diagram: 'map-compass',
          story: { zh: '一行人走到大漢溪邊。小Q把羅盤放在石頭上：「清朝的大溪，貨物是靠這條河運出去的。而河，是往北流的。」安安抬頭：「往北……三峽也在北邊。」小Q：「沒錯。來，練習一下方位——你現在面向[正北方]，如果[順時針]轉到[正東方]，一共轉了幾度？」',
                   en: 'They walk to the Dahan River. Little Q sets a compass on a rock: “In Qing times, Daxi shipped its goods out along this river. And the river flows NORTH.” An-An looks up: “North… Sanxia is north too.” Little Q: “Exactly. Now, practise your bearings — you are facing [due north]; turning [clockwise] to [due east], how many degrees do you turn?”' },
          clueNote: { zh: '大漢溪向北流；正北順時針轉到正東＝90 度（直角）', en: 'The Dahan flows north; north → east clockwise = 90° (a right angle)' },
          puzzle: {
            text: { zh: '面向[正北方]，[順時針]轉到[正東方]，轉了幾度？',
                    en: 'Facing [due north], turning [clockwise] to [due east] — how many degrees?' },
            answer: 90, unit: { zh: '度', en: '°' },
            hint: { zh: '北→東→南→西轉一圈是 360 度，分成 4 等份，每一份是……？', en: 'North→east→south→west is 360° in all, split into 4 equal parts — each is…?' },
            teach: [
              { zh: '方位圖上，北、東、南、西平均分成四個方向，繞一整圈是 360 度。',
                en: 'On a compass, north, east, south and west split the turn evenly — all the way round is 360°.' },
              { zh: '360 度分成 4 等份：360 ÷ 4。',
                en: 'Split 360° into 4 equal parts: 360 ÷ 4.' },
              { zh: '這個角度有個特別的名字叫「直角」；換你算算看是幾度！',
                en: 'This angle has a special name — a RIGHT ANGLE. You work out how many degrees!' },
            ],
            reward: { zh: '🧭 90 度，直角！小Q望著河水：「記住這個方向。大溪的河、大溪的路、大溪的生意——全部朝北。可是導覽手冊說牠屬於西南邊的桃園。安安，這裡有點怪，對不對？」',
                      en: '🧭 90° — a right angle! Little Q watches the water: “Remember that direction. Daxi’s river, Daxi’s roads, Daxi’s trade — all point north. Yet the guidebook says it belongs to Taoyuan, to the south-west. An-An, something’s odd here, isn’t it?”' },
          },
        },
        // 4 🔀 分支選擇（兩分支同答案 48）
        {
          kind: 'choice',
          place: { zh: '河邊的岔路', en: 'The Fork by the River' },
          emoji: '🔀',
          story: { zh: '要再找第三份說法，有兩個地方可以去：左邊是廟口那塊被苔蘚蓋住的老石碑，右邊是河岸邊那間快塌了的老船屋。小Q：「兩邊都留著清朝的紀錄，你挑一個。」這時，那隻藍尾巴的鳥又出現了，停在兩條路中間的電線上，歪頭看著安安，好像在等她決定。',
                   en: 'To find a third account, there are two places to go: left, the moss-covered stone stele at the temple gate; right, the half-collapsed old boat shed on the bank. Little Q: “Both keep Qing-era records — take your pick.” Just then the blue-tailed bird appears again, perching on the wire between the two paths, head tilted, as if waiting for her to choose.' },
          question: { zh: '★ 你來決定！要去看哪一份老紀錄？（兩邊都查得到，選你喜歡的！）',
                      en: '★ You decide! Which old record will you read? (Both work — pick your favourite!)' },
          options: [
            {
              id: 'stele',
              label: { zh: '🪨 廟口的老石碑', en: '🪨 The Temple-Gate Stele' },
              scene: {
                place: { zh: '廟口的老石碑', en: 'The Temple-Gate Stele' },
                emoji: '🪨',
                story: { zh: '刮掉苔蘚，石碑上刻著一長串捐錢修廟的人名。廟公瞇著眼數：「這面碑刻了 {6} 直行，每行 {8} 個名字。幫我數數看，一共刻了幾個人？」小Q低聲說：「注意看——這些人，每一個都有名有姓。」',
                         en: 'Scraping off the moss reveals a long list of donors who funded the temple. The keeper squints: “This face has {6} columns, {8} names in each. Count for me — how many people in all?” Little Q murmurs: “Look closely — every single one of these has a full name.”' },
                clueNote: { zh: '石碑刻了 48 個捐款人，每一個都有名有姓', en: 'The stele carries 48 donors — every one with a full name' },
                puzzle: {
                  text: { zh: '石碑 {6} 直行，每行 {8} 個名字，[一共]幾個？', en: '{6} columns, {8} names each — how many [in all]?' },
                  answer: 48, unit: { zh: '個', en: 'names' },
                  hint: { zh: '每行 8 個，有 6 行：8 × 6！', en: '8 per column, 6 columns: 8 × 6!' },
                  teach: [
                    { zh: '一行一行一樣多，用乘法：每行 8 個，有 6 行。',
                      en: 'Equal columns — use multiplication: 8 per column, 6 columns.' },
                    { zh: '就是 8 × 6（或 6 × 8，答案一樣）。',
                      en: 'That’s 8 × 6 (or 6 × 8 — same answer).' },
                    { zh: '8 × 6……換你數出石碑上一共刻了幾個人！',
                      en: '8 × 6… you count how many people are carved on the stele!' },
                  ],
                  reward: { zh: '🪨 48 個名字！廟公摸摸鬍子：「刻上去的，都是出得起錢的人家。」小Q沒說話，只是把這句抄進筆記本。電線上的藍鳥，忽然叫了一聲。',
                            en: '🪨 48 names! The keeper strokes his beard: “Those carved here are the families who could afford it.” Little Q says nothing, only copies that line into his notebook. On the wire, the blue bird suddenly calls out.' },
                },
              },
            },
            {
              id: 'boathouse',
              label: { zh: '⛵ 河岸的老船屋', en: '⛵ The Old Boat Shed' },
              scene: {
                place: { zh: '河岸的老船屋', en: 'The Old Boat Shed' },
                emoji: '⛵',
                story: { zh: '船屋裡堆滿發霉的帳冊。老船夫的曾孫翻開一本：「這是我阿祖記的貨單——{8} 頁，每頁 {6} 筆生意。你算算，這本記了幾筆？」他頓了頓：「每一筆的收貨地，全部都是北邊。」',
                         en: 'The shed is stacked with mildewed ledgers. The old boatman’s great-grandson opens one: “This is my ancestor’s cargo list — {8} pages, {6} entries each. Work out how many entries.” He pauses: “And every single delivery point is to the north.”' },
                clueNote: { zh: '老貨單共 48 筆生意，收貨地全部在北邊', en: 'The old cargo list holds 48 entries — every destination to the north' },
                puzzle: {
                  text: { zh: '貨單 {8} 頁，每頁 {6} 筆，[一共]幾筆？', en: '{8} pages, {6} entries each — how many [in all]?' },
                  answer: 48, unit: { zh: '筆', en: 'entries' },
                  hint: { zh: '每頁 6 筆，有 8 頁：6 × 8！', en: '6 per page, 8 pages: 6 × 8!' },
                  teach: [
                    { zh: '一頁一頁一樣多，用乘法：每頁 6 筆，有 8 頁。',
                      en: 'Equal pages — use multiplication: 6 entries, 8 pages.' },
                    { zh: '就是 6 × 8（或 8 × 6，答案一樣）。',
                      en: 'That’s 6 × 8 (or 8 × 6 — same answer).' },
                    { zh: '6 × 8……換你算出這本貨單記了幾筆生意！',
                      en: '6 × 8… you find how many entries this ledger holds!' },
                  ],
                  reward: { zh: '⛵ 48 筆！曾孫嘆了口氣：「我阿祖那一輩，貨都往北送。往桃園？那要翻過台地，划船划不過去啊。」小Q把這句抄進筆記本。屋樑上的藍鳥，忽然叫了一聲。',
                            en: '⛵ 48 entries! The great-grandson sighs: “In my ancestor’s day, everything went north. To Taoyuan? You’d have to cross the terrace — no boat can row up there.” Little Q copies that line down. On the rafter, the blue bird suddenly calls out.' },
                },
              },
            },
          ],
        },
        // 5 📗官方版：大數（四上「大數」單元）
        {
          place: { zh: '📗 公所的沿革冊', en: '📗 The Township History Sheet' },
          emoji: '🏢',
          story: { zh: '公所的承辦員搬出厚厚一本沿革：「我們有戶口總數的紀錄喔。」小Q翻到那一頁，念出三個數字：「海山堡當年管的三大片，戶口分別是 {12000}、{8500}、{4500}。」承辦員推了推眼鏡：「加起來就是整個海山堡的規模。這個數字，比當時的桃園還大呢。」',
                   en: 'The clerk hauls out a thick history volume: “We do keep household totals.” Little Q finds the page and reads three figures aloud: “The three great sections under Haishan Bao held {12000}, {8500} and {4500} households.” The clerk adjusts his glasses: “Added together, that’s the whole scale of Haishan Bao — bigger than Taoyuan was at the time.”' },
          clueNote: { zh: '海山堡總戶數＝25000 戶（12000＋8500＋4500）', en: 'Haishan Bao total = 25,000 households (12,000 + 8,500 + 4,500)' },
          puzzle: {
            text: { zh: '海山堡三大片戶口：{12000}、{8500}、{4500} 戶。[一共]幾戶？',
                    en: 'Three sections of Haishan Bao: {12000}, {8500}, {4500} households. How many [in all]?' },
            answer: 25000, unit: { zh: '戶', en: 'households' },
            hint: { zh: '大數相加，從個位開始對齊：12000 ＋ 8500 ＋ 4500！', en: 'Add big numbers by lining up from the ones place: 12000 + 8500 + 4500!' },
            teach: [
              { zh: '大數相加不難，重點是「位數要對齊」——個位對個位、十位對十位、百位對百位。',
                en: 'Adding big numbers is easy if you LINE UP the places — ones with ones, tens with tens, hundreds with hundreds.' },
              { zh: '先加好算的兩個：8500 ＋ 4500 ＝ 13000（500 ＋ 500 剛好湊成 1000）。',
                en: 'Add the easy pair first: 8500 + 4500 = 13000 (500 + 500 makes a neat 1000).' },
              { zh: '再加上 12000：13000 ＋ 12000……換你算出海山堡的總戶數！',
                en: 'Then add 12000: 13000 + 12000… you find the total households of Haishan Bao!' },
            ],
            reward: { zh: '🏢 25000 戶！小Q把三份說法並排放好：「📘導覽手冊說大溪自古屬桃園、📗公所沿革說一九二〇年才改制、📙老地契和老貨單說這裡叫海山堡、生意全往北。安安，三份都是真的資料——但它們不可能同時都對。」',
                      en: '🏢 25,000 households! Little Q sets the three accounts side by side: “📘 The guidebook says Daxi was always Taoyuan. 📗 The township sheet says the change came in 1920. 📙 The deed and the cargo list say this place was Haishan Bao, trading north. An-An — all three are genuine sources. But they cannot all be right at once.”' },
          },
        },
        // 6 🌳阿榕的記憶碎片：乘法
        {
          place: { zh: '🌳 阿榕的記憶碎片', en: '🌳 Ah-Rong’s Fragment of Memory' },
          emoji: '🍃',
          story: { zh: '老榕樹沙沙作響，一片葉子飄下來，葉面浮出一格模糊的畫面：碼頭、船、扛貨的人。阿榕的聲音很遠：「我記得……那時候河上熱鬧得很。船一天來回 {3} 趟，一趟載 {24} 擔貨。天還沒亮就開始，一直到掌燈。」安安輕聲問：「阿榕，那些船最後都去哪裡了？」老樹沉默了一下：「……北邊。全部都往北邊。」',
                   en: 'The old banyan rustles and a leaf drifts down, a blurred scene rising on its surface: a wharf, boats, porters shouldering loads. Ah-Rong’s voice comes from far away: “I remember… the river was so busy then. The boats made {3} round trips a day, {24} loads each trip. They began before dawn and went on till the lamps were lit.” An-An asks softly: “Ah-Rong, where did all those boats go in the end?” The old tree pauses: “…North. Every one of them went north.”' },
          clueNote: { zh: '阿榕的記憶：船一天運 72 擔（3 趟 × 24 擔），全部往北', en: 'Ah-Rong’s memory: 72 loads a day (3 trips × 24), all heading north' },
          puzzle: {
            text: { zh: '船一天來回 {3} 趟，一趟載 {24} 擔。一天[一共]運幾擔？',
                    en: 'The boats make {3} round trips a day, {24} loads each. How many loads [in all] per day?' },
            answer: 72, unit: { zh: '擔', en: 'loads' },
            hint: { zh: '一趟 24 擔，跑 3 趟：24 × 3！', en: '24 loads a trip, 3 trips: 24 × 3!' },
            teach: [
              { zh: '每一趟載的一樣多，用乘法：一趟 24 擔，跑了 3 趟。',
                en: 'Each trip carries the same, so multiply: 24 loads per trip, 3 trips.' },
              { zh: '24 × 3 可以拆開：20 × 3 ＝ 60，4 × 3 ＝ 12。',
                en: '24 × 3 splits up: 20 × 3 = 60, and 4 × 3 = 12.' },
              { zh: '60 ＋ 12……換你算出一天運了幾擔！',
                en: '60 + 12… you work out the loads carried in a day!' },
            ],
            reward: { zh: '🍃 72 擔！葉子上的畫面慢慢淡去。阿榕輕輕嘆氣：「我記得的，都是河這邊的事。安安，山那邊呢？山那邊那些人，也在這條河上運東西——可是我從來不知道他們叫什麼名字。」窗外，藍鵲的羽毛落了一根下來。',
                      en: '🍃 72 loads! The picture on the leaf slowly fades. Ah-Rong sighs softly: “All I remember is this side of the river. An-An — and the other side of the mountain? Those people traded on this river too — yet I never once knew their names.” Outside, a single blue-magpie feather drifts down.' },
          },
        },
        // 7 🔢數學：除法（四上「除法」單元）
        {
          place: { zh: '🔢 走一趟看看', en: '🔢 Walking It Yourself' },
          emoji: '👣',
          story: { zh: '小Q合上筆記本：「數字要自己走過一遍才算數。」牠翻出老船夫留下的紀錄：「當年從大溪走到三峽，那段 {16} 公里的路，挑夫要走 {4} 小時。安安，算算看他們一小時走幾公里——然後你就知道，這條路對他們來說有多平常了。」',
                   en: 'Little Q closes his notebook: “A number only counts once you’ve walked it yourself.” He digs out the old boatman’s record: “Back then, that {16} km stretch from Daxi to Sanxia took a porter {4} hours. An-An, work out how far they walked per hour — and you’ll see how ordinary this route was to them.”' },
          clueNote: { zh: '挑夫時速＝4 公里（16 公里 ÷ 4 小時），去三峽是家常便飯', en: 'Porter’s pace = 4 km/h (16 km ÷ 4 h) — Sanxia was an everyday walk' },
          puzzle: {
            text: { zh: '大溪到三峽 {16} 公里，挑夫走了 {4} 小時。[平均]一小時走幾公里？',
                    en: 'Daxi to Sanxia is {16} km, walked in {4} hours. How many km per hour on [average]?' },
            answer: 4, unit: { zh: '公里', en: 'km' },
            hint: { zh: '要「平分」就用除法：16 ÷ 4！', en: 'To share equally, divide: 16 ÷ 4!' },
            teach: [
              { zh: '把總路程平分給每個小時，就是除法：全長 16 公里，走了 4 小時。',
                en: 'Sharing the whole distance across the hours means division: 16 km total, over 4 hours.' },
              { zh: '16 ÷ 4：想想看，4 的幾倍是 16？',
                en: '16 ÷ 4: think — 4 times what makes 16?' },
              { zh: '這大概就是大人走路的速度；換你算算看一小時走幾公里！',
                en: 'That’s about an adult’s walking pace; you work out the km per hour!' },
            ],
            reward: { zh: '👣 一小時 4 公里！小Q：「四個小時，走到三峽。清朝的大溪人要去三峽，跟你今天去隔壁鎮買東西差不多。」林阿姨恍然大悟：「難怪地契寫在一起……他們本來就是鄰居啊。」證據板，全部兜上了。',
                      en: '👣 4 km an hour! Little Q: “Four hours to Sanxia. For a Qing-era Daxi family, going to Sanxia was like you popping to the next town today.” Auntie Lin gasps: “No wonder the deed groups them… they really were neighbours.” The evidence board is complete.' },
          },
        },
        // 8 🔍破案：年代差（四上減法／時間）
        {
          place: { zh: '🔍 三份說法·對質', en: '🔍 Three Accounts · Face to Face' },
          emoji: '⚖️',
          story: { zh: '小Q把三份資料攤在桌上，用爪子點著公所沿革：「這裡寫得清清楚楚——一九二〇年地方制度大改，從那一年起，大溪才和桃園劃在一起。」牠又點點導覽手冊：「可是這裡寫『自古以來』。安安，清朝在 {1895} 年結束，改制是 {1920} 年。這中間有一段空白——算算看，是幾年？」',
                   en: 'Little Q spreads all three on the table and taps the township sheet: “It says plainly — in 1920 the local system was overhauled, and only from that year was Daxi grouped with Taoyuan.” He taps the guidebook: “But this one says ‘since ancient times.’ An-An, the Qing era ended in {1895}, and the change came in {1920}. There’s a gap in between — how many years?”' },
          clueNote: { zh: '1895 清朝結束 → 1920 改制，中間空了 25 年；「自古」兩個字站不住腳', en: 'Qing ends 1895 → reform 1920: a 25-year gap. “Since ancient times” cannot stand' },
          puzzle: {
            text: { zh: '清朝在 {1895} 年結束，地方制度改制在 {1920} 年。中間相差幾年？',
                    en: 'The Qing era ended in {1895}; the local reform came in {1920}. How many years apart?' },
            answer: 25, unit: { zh: '年', en: 'years' },
            hint: { zh: '用減法算年代差：1920 − 1895！', en: 'Subtract to find the gap: 1920 − 1895!' },
            teach: [
              { zh: '算「相差幾年」就用減法：晚的年份減掉早的年份。',
                en: 'To find “how many years apart,” subtract: the later year minus the earlier one.' },
              { zh: '1920 − 1895，可以先算 1920 − 1900 ＝ 20，再加回多減的 5。',
                en: '1920 − 1895: try 1920 − 1900 = 20 first, then add back the extra 5 you took off.' },
              { zh: '20 ＋ 5……換你算出這段被跳過的空白有幾年！',
                en: '20 + 5… you find how many years this skipped gap covers!' },
            ],
            reward: { zh: '⚖️ 25 年！小Q把三份說法排成一列：「證據全在這裡了——大溪的河往北流、地契寫著海山堡、貨單全往北送、走到三峽只要四小時、而『和桃園劃在一起』是一九二〇年以後的事。安安，現在請你指出來：這三份說法裡，哪一份漏掉了最關鍵的一段？」',
                      en: '⚖️ 25 years! Little Q lines the three accounts up: “The evidence is all here — Daxi’s river runs north, the deed says Haishan Bao, the cargo all went north, Sanxia was four hours’ walk, and being ‘grouped with Taoyuan’ came only after 1920. An-An, now point it out: which of these three accounts left out the most important part?”' },
          },
        },
      ],
      suspects: [
        { id: 'guide', name: { zh: '📘 觀光導覽手冊', en: '📘 The Tourist Guidebook' }, emoji: '📘',
          say: { zh: '「大溪自古以來就是桃園的一部分，老街風華、豆干飄香，歡迎來到美麗的桃園大溪！」',
                 en: '“Daxi has been part of Taoyuan since ancient times — historic streets, fragrant tofu jerky. Welcome to beautiful Daxi, Taoyuan!”' } },
        { id: 'office', name: { zh: '📗 公所沿革冊', en: '📗 The Township History Sheet' }, emoji: '📗',
          say: { zh: '「本地於一九二〇年因地方制度改正而改隸，此前隸屬海山堡。戶口總數二萬五千戶。」',
                 en: '“This locality was re-assigned in 1920 under the local system reform; before that it belonged to Haishan Bao. Total households: 25,000.”' } },
        { id: 'deed', name: { zh: '📙 阿公的老地契', en: '📙 Grandfather’s Old Deed' }, emoji: '📙',
          say: { zh: '「海山堡，共一十二庄。此地水路通北，往三峽、鶯歌、樹林。」',
                 en: '“Haishan Bao, twelve villages in all. Waterways lead north from here — to Sanxia, Yingge and Shulin.”' } },
      ],
      culprit: 'guide',
      accuse: { zh: '這一回沒有小偷，也沒有壞人——三份資料都是真的。可是有一份，用了「自古以來」四個字，把一九二〇年以前那段整個蓋過去了。你自己量過：河往北流、走到三峽只要四小時、地契上寫的是海山堡、貨單全往北送。哪一份說法，漏掉了這一段？',
                en: 'This time there is no thief and no villain — all three sources are genuine. But one of them used the words “since ancient times,” painting over everything before 1920. You measured it yourself: the river runs north, Sanxia is four hours’ walk, the deed says Haishan Bao, the cargo all went north. Which account left that part out?' },
      wrongAccuse: { zh: '這一份其實沒有漏掉喔——你再讀一次它說的話：📗公所沿革老老實實寫出「一九二〇年改隸，此前隸屬海山堡」，📙老地契更是直接寫著海山堡通北。它們都把「以前」交代了。再看一次，哪一份從頭到尾都沒提過一九二〇年以前的大溪？📘',
                     en: 'This one didn’t actually leave it out — read its words again: 📗 the township sheet plainly states “re-assigned in 1920; before that, Haishan Bao,” and 📙 the deed says outright that the waterways lead north. Both account for the “before.” Look again: which one never mentions pre-1920 Daxi at all? 📘' },
      solve: [
        { zh: '漏掉最關鍵那一段的，是📘觀光導覽手冊！它說「大溪自古以來就是桃園的一部分」——可是公所自己的沿革寫著一九二〇年才改隸，而清朝在一八九五年就結束了，中間整整二十五年，還有更早的一百多年，全被那四個字「自古以來」蓋了過去。',
          en: 'The account that left out the crucial part is 📘 the tourist guidebook! It says “Daxi has been part of Taoyuan since ancient times” — yet the township’s own history records the change came in 1920, and the Qing era ended in 1895. Twenty-five years in between, and more than a century before that, were all painted over by those four words: “since ancient times.”' },
        { zh: '小Q合上筆記本：「但是安安，注意聽——導覽手冊沒有說謊。」牠說得很慢，「它只是『從一九二〇年開始算』。寫手冊的人想讓大家覺得『我們一直都是一家人』，那不是壞事。可是——」牠抬起頭，「那不是全部的故事。」',
          en: 'Little Q closes his notebook: “But An-An, listen closely — the guidebook did not lie.” He speaks slowly. “It merely starts counting from 1920. Whoever wrote it wanted everyone to feel ‘we have always been one family.’ That is not a wicked thing. But—” he looks up, “—it is not the whole story.”' },
        { zh: '🗣️這個故事是誰講的？林阿姨把地契小心摺好，決定在她的導覽圖上多印一行小字：「大溪，舊名海山堡——這裡的河、路與生意，曾經全部朝北。」她笑了：「阿公的字，總算有地方放了。」',
          en: '🗣️ Who is telling this story? Auntie Lin folds the deed away carefully and decides to add one extra line to her map: “Daxi, formerly Haishan Bao — its river, roads and trade once all ran north.” She smiles: “Grandpa’s handwriting finally has somewhere to live.”' },
        { zh: '大溪小知識：清代的大溪叫「大嵙崁」，屬海山堡，同堡的是三峽、鶯歌、樹林——整個清代，大溪的行政歸屬與生意往來都沿著淡水河水系往北走。第一張史料卡，到手！',
          en: 'Daxi fact: in Qing times Daxi was called “Toa-kho-kham” and belonged to Haishan Bao, together with Sanxia, Yingge and Shulin — throughout the Qing era its administration and trade followed the Tamsui river system northward. Archive Card one — acquired!' },
      ],
      arcClue: { zh: '回到老榕樹下，那隻長尾巴的藍鳥就停在最低的枝椏上，安安靜靜地看著安安。牠放下一根羽毛，羽毛落在故事書那頁淡淡的字上——這一次，浮出來的不是中文，是一個安安完全沒見過的字。阿榕在頭頂輕輕說：「那是山上的話。牠在告訴你一個名字……可是安安，我不會念。一百年了，我從來沒學會怎麼念。」',
                 en: 'Back beneath the old banyan, the long-tailed blue bird waits on the lowest branch, watching An-An quietly. It sets down a feather, and the feather lands on the faint writing of that page — and this time what surfaces is not Chinese at all, but a character An-An has never seen. Ah-Rong says softly overhead: “That is the language of the mountains. She is telling you a name… but An-An, I cannot read it. A hundred years, and I never learned how.”' },
      nextPreview: { zh: '下一站——消失的河港！老照片上，大漢溪裡的船又高又大，帆撐得滿滿的；可是今天走到同一個地方，河水淺得連小孩都站得起來。船到哪裡去了？河又是怎麼變淺的？這一回要用「公里與長度換算」，把一條河的深度算出來。而那隻藍鳥，好像一直往上游飛……',
                     en: 'Next stop — the vanished river port! In the old photographs, the boats on the Dahan River stand tall with full sails; yet walk to the very same spot today and the water is shallow enough for a child to stand in. Where did the boats go? And how did the river grow so shallow? This time we use length and unit conversion to work out how deep a river must be. And that blue bird keeps flying upstream…' },
      reward: 500,
    },
  ],
}

// 史料卡收集板（12 張＝12 個被對出來的矛盾）；集滿＝信物《沒有寫下來的大溪》
export const ARCHIVE_BOARD = [
  { id: 'haishan-bao',   emoji: '🗺️', name: { zh: '海山堡',     en: 'Haishan Bao' } },
  { id: 'lost-port',     emoji: '⛵', name: { zh: '消失的河港', en: 'The Lost River Port' } },
  { id: 'great-canal',   emoji: '💧', name: { zh: '桃園大圳',   en: 'The Taoyuan Canal' } },
  { id: 'fortress-city', emoji: '🏯', name: { zh: '通議第',     en: 'The Tongyi Mansion' } },
  { id: 'three-houses',  emoji: '🏘️', name: { zh: '新南三棟',   en: 'Three Shophouses' } },
  { id: 'coal-mines',    emoji: '⛏️', name: { zh: '十七礦坑',   en: 'Seventeen Mines' } },
  { id: 'facade-style',  emoji: '🏛️', name: { zh: '牌樓式樣',   en: 'The Façade Style' } },
  { id: 'camphor-yen',   emoji: '🌿', name: { zh: '每天七圓',   en: 'Seven Yen a Day' } },
  { id: 'school-land',   emoji: '🌾', name: { zh: '四十八甲',   en: 'Forty-Eight Jia' } },
  { id: 'year-1907',     emoji: '📅', name: { zh: '一九〇七',   en: 'The Year 1907' } },
  { id: 'no-names',      emoji: '🪶', name: { zh: '沒有名字',   en: 'Without Names' } },
  { id: 'other-half',    emoji: '🐦', name: { zh: '另一半',     en: 'The Other Half' } },
]
