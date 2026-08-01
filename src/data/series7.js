// 長篇連續劇 第七季《安安偵探社 · 家鄉時光大冒險》
// The An-An Detective Agency — Season 7: Hometown Through Time
//
// 品牌六部曲收官後開新篇，主題＝「傳承」（把家鄉的故事交棒給孩子）。
// 銜接 S6：短毛黑臘腸小虎🐕 立志「想分享家鄉」，這回帶全隊回牠（也是安安）的家鄉
//   ——桃園・大溪／八德，一站一站把家鄉重新看一遍。
//
// ★ 最大升級＝跨領域統整（108 課綱）：把「社會🏛️（家鄉）＋自然🔬（科學）＋數學🔢（推理）」
//   綁進同一樁案子。三科合一、一集破一案；數學重心＝四上總複習＋四下前導「混合」。
// ★ 引擎不用改的關鍵：每個現場骨子裡仍是數學題（puzzle.answer 是數字，沿用 S1~S6
//   scene/clueNote/choice 結構）。自然／社會只當「情境外衣＋線索來源」，答案永遠由數學算出。
//   每個 scene 標一個主科 emoji（🏛️/🔬/🔢）。
// ★ 自然圖解鐵則：🔬 自然現場都掛 scene.diagram（圖解 id），SeriesScreen 於故事下方
//   渲染 <NatureDiagram>（比照 DecoArt 的 inline SVG）；社會/數學的地圖、比例尺、圖形也可共用。
// ★ 每集收集「家鄉故事書的一頁」page（STORYBOOK_BOARD），集滿 12 頁＝信物《家鄉故事書》。
// ★ 裏層主線：大溪老街廟口旁百年老榕樹靈「阿榕」🌳（怕新時代沒人記得老故事，選中安安交棒），
//   每集悄悄補完故事書一頁（落葉浮字／風中耳語）；終章「家鄉故事書大會」現身入隊。
// ★ 真推理鐵則（同 S3 EP2 起）：scene.clueNote＝該現場關鍵數字（證據板）、
//   suspects[].say＝說詞藏數字；accuse 不爆雷，孩子自己抓矛盾。episode id 用 's7ep*' 前綴。
//
// 完整劇本與 12 集三科對照表見 docs/season7-劇本.md。

export const SEASON7 = {
  id: 'season7',
  title: { zh: '家鄉時光大冒險', en: 'Hometown Through Time' },
  emoji: '🏡',
  seasonIntro: [
    { zh: '環島回來的隔天，小虎🐕 興奮得繞著大家轉圈圈：「你們看過全世界、全台灣了——換我帶你們去一個地方！就是……就是我長大的家鄉！」阿基教授笑著攤開一本封面舊舊的故事書，裡面卻一頁都沒有：「這是我年輕時在大溪老街的一棵老榕樹下撿到的。它只剩封面——故事，要你們自己一頁一頁找回來。」',
      en: 'The day after the island tour, Little Tiger 🐕 spins in excited circles: “You’ve seen the whole world and all of Taiwan — now let ME take you somewhere! It’s… it’s the hometown where I grew up!” Professor Archie smiles and opens a storybook with a worn old cover — but every page inside is blank. “I found this under an old banyan tree on Daxi Old Street in my youth. Only the cover is left — the story, you must find back one page at a time.”' },
    { zh: '「這一趟，我不派你去救誰。」教授把故事書交到安安手上，「我只想請你，去認識一個地方——它就在桃園，大溪與八德一帶。那裡有老街、有大漢溪、有豆干香、有大拜拜……也有一些，快要被人忘記的老故事。」小虎把鼻子湊過來，眼睛亮亮的：「跟我走！我知道每一條巷子！」',
      en: '“This time I send you to rescue no one,” the Professor places the book in An-An’s hands. “I only ask you to get to know a place — it’s in Taoyuan, around Daxi and Bade. There are old streets, the Dahan River, the smell of tofu jerky, the grand temple parade… and some old stories that are almost forgotten.” Little Tiger presses his nose in, eyes shining: “Follow me! I know every single alley!”' },
    { zh: '火車緩緩駛進大溪。全體寵物排排站：LULU 硬要跟、小星小月小冥擠在窗邊、飛飛在天上領航、小Q穩穩站上安安肩膀。而在老街盡頭那棵百年老榕樹下，一片葉子悄悄飄落，葉面上，好像有幾個字正慢慢浮現……家鄉，就從這裡，一頁一頁翻開。',
      en: 'The train pulls slowly into Daxi. The whole pet family lines up: LULU insists on coming, Twinkle, Luna and Little Pluto crowd the window, Feifei guides from the sky, and Little Q stands steady on An-An’s shoulder. And under the century-old banyan tree at the end of the old street, a single leaf drifts quietly down — and on its surface, a few words seem to be slowly appearing… The hometown opens now, one page at a time.' },
  ],

  episodes: [
    // ─────────────────────────────────────── S7 EP1 ───────────────────────────────────────
    {
      id: 's7ep1',
      no: 1,
      title: { zh: '老街消失的匾額', en: 'The Missing Plaque of the Old Street' },
      emoji: '🏮',
      accent: '#c98a4b',
      difficulty: { zh: '方位·比例尺·乘除（複習）＋公分↔公尺（前導）', en: 'Directions · scale · times/division (review) + cm↔m (preview)' },
      page: { id: 'daxi-oldstreet', emoji: '📖', name: { zh: '故事書第 1 頁 · 大溪老街', en: 'Storybook Page 1 · Daxi Old Street' } },
      intro: [
        { zh: '家鄉第一站——大溪老街！一整排巴洛克式的紅磚牌樓氣派又漂亮，可是「協盛號」的頭家台灣土狗阿盛急得團團轉：「偵探！我家掛了一百年的鎮店匾額『協盛號』，昨天晚上不見了！明天就是大溪大拜拜的遶境，牌樓上空空一塊，這……這怎麼見人啊！」',
          en: 'First stop of the hometown — Daxi Old Street! A whole row of grand Baroque brick façades, beautiful as ever. But Ah-Sheng the Formosan dog, owner of the “Xie-Sheng Store,” is spinning in panic: “Detective! Our shop’s century-old signboard plaque — ‘Xie-Sheng Store’ — vanished last night! Tomorrow is the great Daxi temple parade, and the façade sits empty. How can I face everyone?!”' },
        { zh: '小虎搶著在前頭帶路，尾巴甩得飛快：「這條街我熟！跟我來！」小Q清清喉嚨，穩穩地說：「別急。匾額不會憑空消失——它留下的線索，藏在『地圖的方位』『太陽的影子』還有『尺寸的數字』裡。安安，我們一條一條查回去！」查案兼找匾，開始！',
          en: 'Little Tiger dashes ahead to lead the way, tail wagging like mad: “I know this street! Follow me!” Little Q clears his throat, steady and calm: “Don’t panic. A plaque doesn’t vanish into thin air — its clues hide in the map’s directions, the sun’s shadow, and the numbers of its size. An-An, let’s trace them one by one!” Case and search, begin!' },
      ],
      scenes: [
        // 1 🏛️社會：地圖方位＋乘法
        {
          place: { zh: '🏛️ 老街牌樓下', en: '🏛️ Beneath the Old-Street Façade' },
          emoji: '⛩️',
          diagram: 'map-compass',
          story: { zh: '阿盛攤開一張老街的手繪地圖：「昨晚遶境的預演隊伍從我這牌樓出發，一路往『正東方』的廟走。看地圖——廟在牌樓的正東方，隊伍向東走了 3 個路口，每個路口 40 公尺。說不定搬匾額的人，就混在隊伍裡！」小虎用鼻子在地圖上點點：「往東！這個方向我最熟！」',
                   en: 'Ah-Sheng unrolls a hand-drawn map of the old street: “Last night the parade rehearsal set off from my façade and headed due EAST toward the temple. On the map, the temple sits due east of the façade; the procession walked 3 blocks east, each block 40 metres. Maybe whoever took the plaque was hidden in the crowd!” Little Tiger taps the map with his nose: “East! That’s the way I know best!”' },
          clueNote: { zh: '隊伍向正東走 3 個路口、每路口 40 公尺＝120 公尺（我自己算的）', en: 'Procession went 3 blocks due east, 40 m each = 120 m (I worked it out myself)' },
          puzzle: {
            text: { zh: '看地圖：廟在牌樓的[正東方]。隊伍向東走 {3} 個路口，每個路口 {40} 公尺，一共走了幾公尺？',
                    en: 'On the map: the temple is due [east] of the façade. The procession walked {3} blocks east, {40} m each — how many metres in all?' },
            answer: 120, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '先看懂方位（往東），距離就是「每路口 40 公尺 × 3 個路口」！', en: 'Read the direction first (east); the distance is “40 m per block × 3 blocks”!' },
            teach: [
              { zh: '社會小絕招：看地圖先找「方位」——上北下南、左西右東。廟在牌樓的正東方，所以隊伍是往「東」走的。',
                en: 'Map trick: find the direction first — north up, south down, west left, east right. The temple is due east, so the procession heads EAST.' },
              { zh: '方位確定了，就算距離：走了 3 個路口，每個路口 40 公尺，就是 40 × 3。',
                en: 'Direction set — now the distance: 3 blocks, 40 m each, so 40 × 3.' },
              { zh: '40 × 3……換你算出隊伍一共走了幾公尺（記得單位是公尺）！',
                en: '40 × 3… you find how many metres the procession walked (in metres)!' },
            ],
            reward: { zh: '🧭 120 公尺！沿著正東方 120 公尺的路，果然在盡頭發現一排舊倉庫。阿盛眼睛一亮：「匾額會不會被搬進那邊？」小Q點頭：「先記進證據板——正東 120 公尺。下一條線索！」',
                      en: '🧭 120 metres! Following 120 m due east, sure enough a row of old storerooms waits at the end. Ah-Sheng’s eyes light up: “Could the plaque be in there?” Little Q nods: “Note it down — 120 m due east. Next clue!”' },
          },
        },
        // 2 🏛️社會：比例尺
        {
          place: { zh: '🏛️ 地圖比例尺', en: '🏛️ The Map’s Scale Bar' },
          emoji: '📏',
          diagram: 'scale-bar',
          story: { zh: '要確定倉庫多遠，得看地圖角落的「比例尺」。阿盛指著說：「這張圖的比例尺是 1:5000——圖上 1 公分，代表實際 50 公尺。你看，從牌樓到那排倉庫，圖上量起來剛好 8 公分。」小Q瞇眼：「比例尺就是地圖的『縮小魔法』，把它放大回去就知道真的多遠了！」',
                   en: 'To pin down the distance, read the scale bar in the map’s corner. Ah-Sheng points: “This map’s scale is 1:5000 — 1 cm on the map means 50 m in real life. See, from the façade to those storerooms measures exactly 8 cm on the map.” Little Q squints: “A scale bar is the map’s ‘shrinking magic’ — enlarge it back and you’ll know the real distance!”' },
          clueNote: { zh: '倉庫距離：圖上 8 公分 × 每公分 50 公尺＝400 公尺', en: 'Storeroom distance: 8 cm on map × 50 m per cm = 400 m' },
          puzzle: {
            text: { zh: '[比例尺] 1:5000，圖上 {1} 公分＝實際 {50} 公尺。圖上量得 {8} 公分，實際是幾公尺？',
                    en: '[Scale] 1:5000, {1} cm on map = {50} m real. Measured {8} cm on the map — how many metres in real life?' },
            answer: 400, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '每 1 公分換 50 公尺，8 公分就是 50 × 8！', en: 'Each 1 cm becomes 50 m, so 8 cm is 50 × 8!' },
            teach: [
              { zh: '比例尺 1:5000 的意思：地圖被縮小了 5000 倍。它幫你換算——圖上 1 公分，就是實際 50 公尺。',
                en: 'Scale 1:5000 means the map is shrunk 5000 times. It converts for you — 1 cm on the map is 50 m in reality.' },
              { zh: '圖上量到 8 公分，就是 8 個「50 公尺」：50 × 8。',
                en: 'You measured 8 cm — that’s eight lots of 50 m: 50 × 8.' },
              { zh: '50 × 8……換你把地圖上的距離「放大」回真實的公尺！',
                en: '50 × 8… you “enlarge” the map distance back to real metres!' },
            ],
            reward: { zh: '📏 400 公尺！倉庫離牌樓正東方 400 公尺，跟腳程完全對得上。阿盛佩服：「原來地圖藏著這麼多祕密！」證據板再記一筆——只是這排倉庫黑漆漆的，得先想辦法看清楚裡面。',
                      en: '📏 400 metres! The storeroom sits 400 m due east of the façade — matching the walk perfectly. Ah-Sheng is impressed: “So a map hides this many secrets!” Another note down — but the storerooms are pitch dark; they’ll need a way to see inside first.' },
          },
        },
        // 3 🔬自然：光與影（影子隨太陽升高變短）
        {
          place: { zh: '🔬 倉庫外的影子', en: '🔬 The Shadow Outside the Storeroom' },
          emoji: '🌤️',
          diagram: 'sun-shadow',
          story: { zh: '倉庫外立著一根旗竿。小Q指著監視器畫面：「昨晚沒拍到人，但拍到旗竿的『影子』！自然課教過——太陽越升越高，影子就越來越短，正午最短。畫面顯示：早上 9:00 影子長 {80} 公分，之後每過 1 小時，太陽升高、影子縮短 12 公分。」安安眼睛一亮：「那算到正午，就知道影子剩多短、也知道那時有沒有人來過！」',
                   en: 'A flagpole stands outside the storeroom. Little Q points at the CCTV: “No people caught last night — but the pole’s SHADOW was! Science class taught us: the higher the sun climbs, the shorter the shadow, shortest at noon. The footage shows: at 9:00 a.m. the shadow was {80} cm long, and every hour after, as the sun rises, it shrinks by 12 cm.” An-An lights up: “Then working to noon tells us how short it gets — and whether anyone came by then!”' },
          clueNote: { zh: '正午旗竿影長＝44 公分（9:00 的 80 公分，每小時縮 12，到 12:00 共縮 3 次）', en: 'Noon pole-shadow = 44 cm (80 cm at 9:00, shrinking 12 cm/hr, 3 hrs to 12:00)' },
          puzzle: {
            text: { zh: '9:00 影子長 {80} 公分，太陽升高，每小時[影子縮短] {12} 公分。到中午 {12}:00（過了 3 小時），影子剩幾公分？',
                    en: 'At 9:00 the shadow is {80} cm; as the sun rises the [shadow shrinks] {12} cm each hour. By noon {12}:00 (3 hours later), how many cm is left?' },
            answer: 44, unit: { zh: '公分', en: 'cm' },
            hint: { zh: '9:00 到 12:00 是 3 小時，共縮短 12 × 3；再用 80 減掉！', en: '9:00 to 12:00 is 3 hours, shrinking 12 × 3 total; then subtract from 80!' },
            teach: [
              { zh: '自然重點：一天中太陽越升越高，竿影就越來越短，「正午」太陽最高、影子最短（而且影子指向北方）。',
                en: 'Science point: through the day the sun climbs higher and the pole’s shadow gets shorter — at NOON the sun is highest and the shadow is shortest (and it points north).' },
              { zh: '9:00 到 12:00 過了 3 個小時，每小時縮 12 公分，一共縮短 12 × 3 ＝ 36 公分。',
                en: '9:00 to 12:00 is 3 hours; shrinking 12 cm each hour means 12 × 3 = 36 cm shorter in all.' },
              { zh: '本來 80 公分，縮掉 36 公分：80 − 36……換你算正午的影子剩幾公分！',
                en: 'From 80 cm, take away 36 cm: 80 − 36… you find the noon shadow!' },
            ],
            reward: { zh: '🌤️ 44 公分！正午的影子最短、又指向北方——對照監視器，倉庫的門正好在「正午、影子指北」那一刻被打開過。小Q：「有人挑正中午、大家都在準備遶境時動手！」線索越來越清楚了。',
                      en: '🌤️ 44 cm! The noon shadow is shortest and points north — matching the CCTV, the storeroom door was opened at exactly that “noon, shadow-north” moment. Little Q: “Someone struck at high noon, while everyone was busy preparing the parade!” The trail grows clearer.' },
          },
        },
        // 4 🔀 分支選擇（兩分支同答案 48）
        {
          kind: 'choice',
          place: { zh: '倉庫前的岔路', en: 'The Fork Before the Storeroom' },
          emoji: '🔀',
          story: { zh: '倉庫前有兩條小路：左邊穿過「廟口的燈籠鋪」，右邊繞過「大漢溪邊的碼頭」。小虎左看右看，尾巴搖個不停：「兩條都通到倉庫後門啦！安安，你挑一條喜歡的走！」飛飛在天上盤旋：「不管哪條，路上都要清點一批要搬的匾額配件喔！」',
                   en: 'Two lanes lead on: left through the “temple-gate lantern shop,” right around the “wharf by the Dahan River.” Little Tiger looks left and right, tail wagging nonstop: “Both reach the storeroom’s back door! An-An, pick the one you like!” Feifei wheels overhead: “Either way, you’ll count a batch of plaque fittings on the road!”' },
          question: { zh: '★ 你來決定！要走哪一條路去倉庫後門？（兩條都到得了，選你喜歡的！）',
                      en: '★ You decide! Which lane to the back door? (Both get there — pick your favorite!)' },
          options: [
            {
              id: 'lantern',
              label: { zh: '🏮 穿過廟口燈籠鋪', en: '🏮 Through the Lantern Shop' },
              scene: {
                place: { zh: '廟口燈籠鋪', en: 'The Lantern Shop' },
                emoji: '🏮',
                story: { zh: '燈籠鋪的老闆正在打包遶境要用的配件：「幫我數一數！這裡有 {6} 箱掛勾，每箱 {8} 個，總共幾個？數對了我就讓你們過後門！」',
                         en: 'The lantern-shop owner is packing parade fittings: “Count for me! Here are {6} boxes of hooks, {8} in each box — how many altogether? Count right and I’ll let you through the back door!”' },
                clueNote: { zh: '匾額掛勾＝48 個（6 箱 × 8 個）', en: 'Plaque hooks = 48 (6 boxes × 8)' },
                puzzle: {
                  text: { zh: '{6} 箱掛勾，每箱 {8} 個，[一共]幾個？', en: '{6} boxes of hooks, {8} each — how many [in all]?' },
                  answer: 48, unit: { zh: '個', en: 'hooks' },
                  hint: { zh: '每箱 8 個，有 6 箱：8 × 6！', en: '8 per box, 6 boxes: 8 × 6!' },
                  teach: [
                    { zh: '一箱一箱一樣多，用乘法最快：每箱 8 個，有 6 箱。',
                      en: 'Equal boxes — multiplication is fastest: 8 per box, 6 boxes.' },
                    { zh: '就是 8 × 6（或 6 × 8，答案一樣）。',
                      en: 'That’s 8 × 6 (or 6 × 8 — same answer).' },
                    { zh: '8 × 6……換你數對，讓老闆放行！',
                      en: '8 × 6… you count it right and get waved through!' },
                  ],
                  reward: { zh: '🏮 48 個！老闆笑著開了後門。經過門邊，安安瞄到地上一雙短短、濕濕的小腳印🐾，一溜煙往倉庫裡去了……',
                            en: '🏮 48! The owner grins and opens the back door. By the doorway, An-An spots a pair of short, damp little paw prints 🐾 scurrying off into the storeroom…' },
                },
              },
            },
            {
              id: 'wharf',
              label: { zh: '⚓ 繞過大漢溪碼頭', en: '⚓ Around the River Wharf' },
              scene: {
                place: { zh: '大漢溪碼頭', en: 'The Dahan River Wharf' },
                emoji: '⚓',
                story: { zh: '碼頭邊，搬運工松鼠正在點貨：「大溪從前靠這條大漢溪運貨呢！幫我點一下——這裡 {8} 疊匾額木料，每疊 {6} 塊，總共幾塊？點對了帶你們抄近路！」',
                         en: 'At the wharf, a squirrel porter tallies cargo: “Daxi once shipped goods on this very Dahan River! Help me count — {8} stacks of plaque timber, {6} planks each — how many total? Count right and I’ll show you the shortcut!”' },
                clueNote: { zh: '匾額木料＝48 塊（8 疊 × 6 塊）', en: 'Plaque timber = 48 planks (8 stacks × 6)' },
                puzzle: {
                  text: { zh: '{8} 疊木料，每疊 {6} 塊，[一共]幾塊？', en: '{8} stacks of timber, {6} planks each — how many [in all]?' },
                  answer: 48, unit: { zh: '塊', en: 'planks' },
                  hint: { zh: '每疊 6 塊，有 8 疊：6 × 8！', en: '6 per stack, 8 stacks: 6 × 8!' },
                  teach: [
                    { zh: '一疊一疊一樣多，用乘法：每疊 6 塊，有 8 疊。',
                      en: 'Equal stacks — use multiplication: 6 per stack, 8 stacks.' },
                    { zh: '就是 6 × 8（或 8 × 6，答案一樣）。',
                      en: 'That’s 6 × 8 (or 8 × 6 — same answer).' },
                    { zh: '6 × 8……換你點對，抄近路去倉庫！',
                      en: '6 × 8… you count it right and take the shortcut!' },
                  ],
                  reward: { zh: '⚓ 48 塊！松鼠帶你們鑽過一條小巷，直達倉庫後門。門邊泥地上，一雙短短、濕濕的小腳印🐾正往裡頭走……',
                            en: '⚓ 48 planks! The squirrel leads you through an alley straight to the back door. In the mud by the door, a pair of short, damp little paw prints 🐾 heads inside…' },
                },
              },
            },
          ],
        },
        // 5 🔬自然：光的顏色（紅燈籠下白紙看起來偏紅）
        {
          place: { zh: '🔬 黑漆漆的倉庫', en: '🔬 The Dark Storeroom' },
          emoji: '🏮',
          diagram: 'light-color',
          story: { zh: '倉庫裡沒開燈，只掛滿了遶境用的紅燈籠，紅通通一片。阿盛忽然大喊：「你們看！牆角那塊紅色的匾額，是不是我家的？」小Q卻搖頭：「等等——自然課說過，『紅光』照在白色的東西上，白色會看起來偏紅。那塊搞不好其實是白的！先數清楚燈籠、找到電燈開關把燈打開再說。牆上 {5} 排燈籠，每排 {12} 個。」',
                   en: 'The storeroom is unlit, hung wall to wall with red parade lanterns — a sea of red. Ah-Sheng suddenly cries: “Look! That RED plaque in the corner — is it mine?” But Little Q shakes his head: “Wait — science class said RED light on a WHITE object makes it look reddish. That one might actually be white! Let’s count the lanterns, find the switch, and turn on the lights first. On the wall: {5} rows of lanterns, {12} in each row.”' },
          clueNote: { zh: '倉庫有 60 個紅燈籠（5 排 × 12）；紅光讓白匾看起來偏紅，不一定是紅的', en: '60 red lanterns (5 rows × 12); red light makes a white plaque look reddish — not necessarily red' },
          puzzle: {
            text: { zh: '牆上 {5} 排紅燈籠，每排 {12} 個，[一共]幾個？', en: '{5} rows of red lanterns, {12} each — how many [in all]?' },
            answer: 60, unit: { zh: '個', en: 'lanterns' },
            hint: { zh: '每排 12 個，有 5 排：12 × 5！', en: '12 per row, 5 rows: 12 × 5!' },
            teach: [
              { zh: '先算數學：一排一排一樣多，用乘法——每排 12 個，有 5 排，就是 12 × 5。',
                en: 'Maths first: equal rows call for multiplication — 12 per row, 5 rows, so 12 × 5.' },
              { zh: '12 × 5 可以拆開：10 × 5 ＝ 50，2 × 5 ＝ 10，合起來 60。',
                en: '12 × 5 splits up: 10 × 5 = 50, 2 × 5 = 10, together 60.' },
              { zh: '算出 60 個燈籠，就能找到總開關；換你算算看！',
                en: 'Find all 60 lanterns and you’ll find the master switch; you work it out!' },
            ],
            reward: { zh: '💡 60 個！找到總開關「喀」地一開，白光灑滿倉庫——牆角那塊「紅」匾額，燈一亮竟然是白底黑字的「協盛號」！阿盛又驚又喜：「真的是我家的！剛剛在紅燈籠下看起來紅紅的，害我認不出來！」小Q得意：「這就是光的顏色在騙眼睛。」',
                      en: '💡 60! The master switch clicks on and white light floods the room — the “red” plaque in the corner turns out to be black-on-white: “Xie-Sheng Store”! Ah-Sheng gasps with joy: “It really is mine! Under the red lanterns it looked red — I couldn’t recognise it!” Little Q, smug: “That’s the colour of light fooling your eyes.”' },
          },
        },
        // 6 🔢數學：長方形周長（複習）
        {
          place: { zh: '🔢 量一量匾額', en: '🔢 Measuring the Plaque' },
          emoji: '📐',
          diagram: 'rect-dim',
          story: { zh: '找到匾額了！可是阿盛要確認是不是真跡：「我家那塊是有登記尺寸的——長 {90} 公分、寬 {30} 公分的長方形。你們幫我量一量它的『周長』，跟登記的一模一樣，就是真的！」小Q提醒：「長方形繞一圈，就是周長。」',
                   en: 'Found it! But Ah-Sheng must confirm it’s genuine: “Mine has a registered size — a rectangle {90} cm long and {30} cm wide. Measure its PERIMETER; if it matches the record, it’s real!” Little Q reminds: “Once around the rectangle — that’s the perimeter.”' },
          clueNote: { zh: '匾額周長＝240 公分（長 90、寬 30 的長方形，(90+30)×2）', en: 'Plaque perimeter = 240 cm (90 × 30 rectangle, (90+30)×2)' },
          puzzle: {
            text: { zh: '長方形匾額，長 {90} 公分、寬 {30} 公分。它的[周長]是幾公分？', en: 'Rectangular plaque, {90} cm long, {30} cm wide. What is its [perimeter] in cm?' },
            answer: 240, unit: { zh: '公分', en: 'cm' },
            hint: { zh: '周長＝（長＋寬）×2＝(90＋30)×2！', en: 'Perimeter = (length + width) × 2 = (90 + 30) × 2!' },
            teach: [
              { zh: '長方形有兩條長、兩條寬。周長就是繞一圈的總長：長＋寬＋長＋寬。',
                en: 'A rectangle has two lengths and two widths. Perimeter is the whole way round: length + width + length + width.' },
              { zh: '算得快一點：先把一組長＋寬加起來（90＋30＝120），再乘 2。',
                en: 'Faster: add one length + one width first (90 + 30 = 120), then times 2.' },
              { zh: '120 × 2……換你量出匾額的周長（公分）！',
                en: '120 × 2… you find the plaque’s perimeter (cm)!' },
            ],
            reward: { zh: '📐 240 公分！跟登記的分毫不差——是真跡沒錯！阿盛感動得眼眶紅紅：「就是它！掛了一百年的老匾額……」小Q卻多想一步：「等等，要掛回牌樓、登記進故事書，得用『公尺』寫才行喔。」',
                      en: '📐 240 cm! Exactly matching the record — genuine! Ah-Sheng’s eyes brim: “That’s the one! A hundred years on our façade…” But Little Q thinks ahead: “Wait — to hang it back and log it in the storybook, we should write it in METRES.”' },
          },
        },
        // 7 🔢數學（前導）：公分↔公尺、小數
        {
          place: { zh: '🔢 換算成公尺', en: '🔢 Converting to Metres' },
          emoji: '🔁',
          diagram: 'rect-dim',
          story: { zh: '小Q攤開故事書的空白頁：「登記要用公尺。記住——{100} 公分＝1 公尺。匾額最長的那一邊是 {90}……不對，是量過的那一邊。我們把它最長邊 {240}÷… 呃，先換簡單的：匾額長 90 公分，等於幾公尺？」安安想了想：「90 公分不到 1 公尺，會是『小數』耶！」小Q點頭：「沒錯，這就是四年級下學期的新招——小數！」',
                   en: 'Little Q opens the storybook’s blank page: “The record needs metres. Remember — {100} cm = 1 m. Let’s start simple: the plaque is {90} cm long — how many metres is that?” An-An thinks: “90 cm is less than 1 metre — it’ll be a DECIMAL!” Little Q nods: “Exactly — that’s next term’s new trick: decimals!”' },
          clueNote: { zh: '匾額長 90 公分＝0.9 公尺（90÷100）；換算公尺要用小數', en: 'Plaque length 90 cm = 0.9 m (90÷100); metres need decimals' },
          puzzle: {
            text: { zh: '{100} 公分＝1 公尺。匾額長 {90} 公分，是幾公尺？（用[小數]寫）', en: '{100} cm = 1 m. The plaque is {90} cm long — how many metres? (write as a [decimal])' },
            answer: 0.9, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '公分換公尺，除以 100：90 ÷ 100，小數點往左移兩位！', en: 'cm to m, divide by 100: 90 ÷ 100 — move the decimal point two places left!' },
            teach: [
              { zh: '前導新招（四下）：1 公尺切成 100 等份，每份就是 1 公分。所以「公分 → 公尺」要除以 100。',
                en: 'Preview (next term): 1 metre splits into 100 equal parts, each 1 cm. So “cm → m” means divide by 100.' },
              { zh: '90 ÷ 100：把 90 想成 90.0，小數點往左移兩位，變成 0.90。',
                en: '90 ÷ 100: think of 90 as 90.0, move the decimal point two places left to 0.90.' },
              { zh: '0.90 就是 0.9 公尺（比 1 公尺短一點點）；換你寫進故事書！',
                en: '0.90 is 0.9 m (a touch under 1 metre); you write it into the storybook!' },
            ],
            reward: { zh: '🔁 0.9 公尺！安安工工整整寫進故事書。小Q欣慰：「公分換公尺，就是把數字除以 100——這一招，你們明年下學期還會常常用到。」阿盛把匾額抱起來：「走！掛回牌樓去！」',
                      en: '🔁 0.9 m! An-An writes it neatly into the storybook. Little Q, pleased: “cm to m is just dividing by 100 — a trick you’ll use often next term.” Ah-Sheng lifts the plaque: “Come — let’s hang it back!”' },
          },
        },
        // 8 🏛️社會·綜合破案前：把證據兜起來（除法）
        {
          place: { zh: '🏛️ 兜線索·掛回匾額', en: '🏛️ Tying the Clues · Hanging It Back' },
          emoji: '🧩',
          diagram: 'map-compass',
          story: { zh: '回到牌樓下，小Q把證據板一條一條唸出來：「匾額被搬到『正東方 120 公尺』的舊倉庫，那條路走了『3 個路口』。安安，反過來算：120 公尺分成 3 個路口，每個路口幾公尺？跟第一條線索『每路口 40 公尺』對得上，就證明搬匾額的人，走的正是這條路——現在，只差指認是誰了。」',
                   en: 'Back at the façade, Little Q reads the evidence aloud: “The plaque went to a storeroom ‘120 m due east,’ down a road of ‘3 blocks.’ An-An, work backwards: 120 m split into 3 blocks — how many metres per block? If it matches clue one (‘40 m per block’), it proves the taker walked exactly this route — now we just need to name who.”' },
          clueNote: { zh: '120 公尺 ÷ 3 個路口＝每路口 40 公尺，與第 1 條線索完全吻合＝搬匾者走的就是這條正東路', en: '120 m ÷ 3 blocks = 40 m per block, exactly matching clue 1 = the taker walked this due-east route' },
          puzzle: {
            text: { zh: '匾額搬到正東 {120} 公尺處，共 {3} 個路口。[平均]每個路口幾公尺？', en: 'The plaque went 120 m due east over 3 blocks. How many metres per block on [average]?' },
            answer: 40, unit: { zh: '公尺', en: 'm' },
            hint: { zh: '總長度平分給每個路口，用除法：120 ÷ 3！', en: 'Share the total length across the blocks — divide: 120 ÷ 3!' },
            teach: [
              { zh: '要「平分」就用除法：全長 120 公尺，平分成 3 個路口。',
                en: 'To share equally, divide: 120 m total, split across 3 blocks.' },
              { zh: '120 ÷ 3：想 12 ÷ 3 ＝ 4，再補一個 0，就是 40。',
                en: '120 ÷ 3: think 12 ÷ 3 = 4, add a zero back — 40.' },
              { zh: '每路口 40 公尺，剛好對上第一條線索！換你算出來，證據就全兜上了！',
                en: '40 m per block — matching clue one exactly! You compute it and the evidence all connects!' },
            ],
            reward: { zh: '🧩 每路口 40 公尺！跟第一條線索一模一樣——證據板全兜上了：正東 120 公尺、正午影指北、匾額 0.9 公尺長。小Q把老花眼鏡一推：「路線、時間、尺寸全對齊了。安安，是時候指認——昨晚把匾額搬走的，到底是誰？」',
                      en: '🧩 40 m per block! Identical to clue one — the whole board connects: 120 m due east, noon shadow pointing north, plaque 0.9 m long. Little Q pushes up his glasses: “Route, time, size — all aligned. An-An, time to name who took the plaque last night!”' },
          },
        },
      ],
      suspects: [
        { id: 'popo', name: { zh: '賣麻糬阿嬤波波', en: 'Popo the Mochi Granny' }, emoji: '🍡',
          say: { zh: '「我天沒亮就在牌樓下擺攤囉，只曉得一早匾額就不見了，別的我可什麼都沒看到哇。」',
                 en: '“I set up my stall under the façade before dawn — I only know the plaque was gone by morning; I saw nothing else at all.”' } },
        { id: 'miao', name: { zh: '廟公阿廟', en: 'Keeper Miao' }, emoji: '⛩️',
          say: { zh: '「我一整個上午都在正東邊的廟裡準備遶境，忙得團團轉，沒空看誰在搬東西啦。」',
                 en: '“I spent all morning in the temple to the east, run off my feet preparing the parade — no time to watch who moved anything.”' } },
        { id: 'chen', name: { zh: '老木匠阿陳', en: 'Old Carpenter Chen' }, emoji: '🪚',
          say: { zh: '「匾額？沒事沒事——它好端端放在正東 120 公尺、第 3 個路口那間舊倉庫裡呢，就那塊 0.9 公尺長的，我看得可清楚了。」',
                 en: '“The plaque? It’s fine, fine — sitting safe in that old storeroom 120 m due east, at the 3rd block, that 0.9-metre-long one. I saw it clear as day.”' } },
      ],
      culprit: 'chen',
      accuse: { zh: '匾額一夜消失，三位街坊都說了自己知道的事。翻開證據板一條一條對——匾額被搬到「正東 120 公尺、3 個路口」的舊倉庫，長「0.9 公尺」，這些是你一路親手查、親手算出來的，而且倉庫黑漆漆、匾額還被紅燈籠照得認不出。可是有一個人，卻一口說出了那間倉庫的確切位置和 0.9 公尺的長度……沒去過現場的人，怎麼會知道得這麼清楚？是誰？',
                en: 'The plaque vanished overnight, and all three neighbours told what they know. Check the evidence line by line — the plaque went to a storeroom “120 m due east, 3 blocks,” and is “0.9 m long,” all of which YOU traced and calculated yourself; the storeroom was pitch dark and the plaque unrecognisable under red lanterns. Yet one person casually named the storeroom’s exact spot and its 0.9-metre length… how could someone who was never there know it so precisely? Who?' },
      wrongAccuse: { zh: '這位說的都對得上、也沒露餡喔——波波阿嬤只知道「一早不見了」，阿廟廟公整個上午在東邊廟裡忙。再聽一次三個人的話：倉庫又黑、匾額又被紅光照得像紅的，位置和「0.9 公尺」是你自己一路查、一路算出來、還沒公布的。誰能不去現場就說出「正東 120 公尺、第 3 個路口、0.9 公尺長」呢？🪚',
                     en: 'This one matches and gives nothing away — Granny Popo only knows it was “gone by morning,” and Keeper Miao was busy in the east temple all morning. Listen again: the storeroom was dark, the plaque reddened by lantern light, and the location and “0.9 m” were traced and computed by YOU, unannounced. Who could name “120 m due east, 3rd block, 0.9 m long” without ever going there? 🪚' },
      solve: [
        { zh: '搬走匾額的，是隔壁的老木匠阿陳！🪚 他說「沒去過」，卻說得出倉庫的確切位置和「0.9 公尺」的長度——那間倉庫又黑、匾額還被紅燈籠照得認不出，這些數字是安安一路親手查、親手算出來、根本還沒說出口的。只有真的搬過、量過的人，才會知道得這麼清楚。',
          en: 'The one who took the plaque was Old Carpenter Chen next door! 🪚 He claimed he “was never there,” yet named the storeroom’s exact spot and the “0.9 m” length — but that room was dark and the plaque unrecognisable under red lanterns, and those numbers were traced and calculated by An-An, still unspoken. Only someone who truly moved and measured it could know so precisely.' },
        { zh: '阿陳紅著臉低下頭：他前幾天路過，看見這塊百年老匾被雨淋、被蟲蛀，邊角都快裂了。他捨不得，半夜偷偷把它搬進乾燥的倉庫，想趕在明天大拜拜前，親手把它修好、上漆，給阿盛一個驚喜——卻忘了先跟人家說一聲，害大家急了一整天。',
          en: 'Chen lowers his reddening face: days ago he passed by and saw the century-old plaque rain-soaked and worm-eaten, its corners near splitting. He couldn’t bear it — at midnight he quietly moved it into a dry storeroom, meaning to repair and repaint it himself before tomorrow’s parade, a surprise for Ah-Sheng — but forgot to say a word first, leaving everyone frantic all day.' },
        { zh: '阿盛聽完，不但沒生氣，還緊緊握住阿陳的手：「你這老頭子……嚇死我了，也……謝謝你。」兩個老鄰居一起把匾額抬回牌樓，阿陳補好的邊角、上了新漆的「協盛號」在夕陽下亮晶晶。安安幫忙扶正，量了掛匾的高度：離地 3 公尺——300 公分，正正好好。',
          en: 'Hearing this, Ah-Sheng isn’t angry at all — he grips Chen’s hand tight: “You old fool… you scared me half to death, and… thank you.” The two old neighbours carry the plaque back together; the mended corners and freshly painted “Xie-Sheng Store” gleam in the sunset. An-An helps straighten it and measures the hanging height: 3 m off the ground — 300 cm, just right.' },
        { zh: '匾額掛回去了，遶境有救了。小Q對著鏡頭挺起胸膛：「破案靠的不只是算術——是把方位、影子、尺寸一條一條兜起來。」大溪小知識：大溪老街的巴洛克牌樓有一百多年歷史，是家鄉最驕傲的老臉孔呢！家鄉第一站，破案！',
          en: 'The plaque is back, the parade saved. Little Q puffs up at the lens: “Solving it took more than arithmetic — it was tying together direction, shadow and size, clue by clue.” Daxi fact: the Baroque façades of Daxi Old Street are over a century old — the hometown’s proudest old faces! Hometown stop one — case closed!' },
      ],
      arcClue: { zh: '故事書的第 1 頁，浮出了字跡——是「大溪老街」的故事，工工整整，像有人替安安寫好的。回頭望向牌樓邊那棵百年老榕樹，一片葉子正巧飄落掌心，葉面上三個淡淡的字慢慢清晰：「你來了。」樹下，一雙短短的小腳印🐾停在那裡，小虎不知何時蹲在樹根旁，安安靜靜地，像在跟老朋友打招呼。',
                 en: 'Page 1 of the storybook fills with writing — the tale of “Daxi Old Street,” neat and careful, as if someone wrote it ready for An-An. Turning to the century-old banyan by the façade, a leaf drifts right into her palm, and three faint words slowly sharpen: “You came.” Beneath the tree, a pair of short little paw prints 🐾 rests there; Little Tiger, somehow, is crouched by the roots, quiet and still — as if greeting an old friend.' },
      nextPreview: { zh: '下一站——大漢溪畔！小虎最愛在這裡打滾的河邊，出現了怪事：一整排高低不同的「河階」地形，是大自然幾千年切出來的樓梯，可是農地的面積怎麼算都對不上。這一回，要用「面積」，還要認識大漢溪如何雕刻出家鄉的土地。而那棵老榕樹的葉子，好像順著河水，又飄向了下一頁……',
                     en: 'Next stop — the banks of the Dahan River! By the riverside where Little Tiger loves to roll, something odd appears: a staircase of “river terraces” at different heights, carved by nature over thousands of years — yet the farmland’s area just won’t add up. This time, we use AREA, and learn how the Dahan River sculpted the hometown’s land. And the old banyan’s leaves seem to drift downstream, toward the next page…' },
      reward: 500,
    },
  ],
}

// 家鄉故事書 12 頁（集滿＝信物《家鄉故事書》完成）。id 對應各集 ep.page.id。
export const STORYBOOK_BOARD = [
  { id: 'daxi-oldstreet', emoji: '🏮', name: { zh: '大溪老街', en: 'Daxi Old Street' } },
  { id: 'dahan-river',    emoji: '🌊', name: { zh: '大漢溪河階', en: 'Dahan River Terraces' } },
  { id: 'yuemei-wetland', emoji: '🦆', name: { zh: '月眉溼地', en: 'Yuemei Wetland' } },
  { id: 'cihu-moon',      emoji: '🌙', name: { zh: '慈湖月色', en: 'Cihu Moonlight' } },
  { id: 'wood-museum',    emoji: '🪵', name: { zh: '木藝博物館', en: 'Woodcraft Museum' } },
  { id: 'tofu-factory',   emoji: '🟫', name: { zh: '豆干工廠', en: 'Tofu-Jerky Works' } },
  { id: 'thousand-ponds', emoji: '💧', name: { zh: '千塘埤圳', en: 'Land of Ponds' } },
  { id: 'shimen-dam',     emoji: '🏞️', name: { zh: '石門水庫', en: 'Shimen Reservoir' } },
  { id: 'temple-parade',  emoji: '🏮', name: { zh: '普濟堂遶境', en: 'Temple Parade' } },
  { id: 'tea-flower',     emoji: '🌸', name: { zh: '茶園花海', en: 'Tea & Flower Fields' } },
  { id: 'light-rail',     emoji: '🚋', name: { zh: '輕便鐵道', en: 'Old Light Railway' } },
  { id: 'bade-fair',      emoji: '🏡', name: { zh: '家鄉大會', en: 'Hometown Fair' } },
]
