// 長篇連續劇《安安偵探社 · 七色星願之謎》
// The An-An Detective Agency — Season 1: The Seven-Color Wish
//
// 資料驅動：新增一集只要往 SEASON1.episodes 加一筆即可，畫面全自動。
// 中英雙語：所有文字欄位都是 { zh, en }，畫面同時顯示兩種語言。
// 每集 8 個現場（scenes），越後面的集數兩步驟題越多。
//
// 每集結構：
//   id, no, title{zh,en}, emoji, accent, difficulty{zh,en}
//   shard: { color, emoji, name{zh,en} }   破案收集的碎片（主線集才有）
//   intro:  開場白 [{zh,en}, ...]
//   scenes: 8 關 → { place{zh,en}, emoji, story{zh,en}, puzzle }
//     puzzle: { text{zh,en}, answer, unit{zh,en}, hint{zh,en}, reward{zh,en} }
//       text 用 {數字} 高亮、[關鍵詞] 高亮（中英通用）
//   suspects: [{ id, name{zh,en}, emoji }]
//   culprit, accuse{zh,en}, wrongAccuse{zh,en}, solve[{zh,en}]
//   arcClue{zh,en}     破案後得到的「斗篷客線索」（累積在推理牆）
//   nextPreview{zh,en} 下集預告（終章為 null）
//   reward             首次破案金幣
//   petReward/itemReward （終章專用）免費解鎖的寵物 / 稀有擺飾

export const SEASON1 = {
  id: 'season1',
  title: { zh: '七色星願之謎', en: 'The Seven-Color Wish' },
  emoji: '🌈',
  // 整季只在第一集開場顯示一次
  seasonIntro: [
    { zh: '一百年才一次的「星願祭」到了！傳說中的「七色星願石」，會在最後一晚為全鎮許下願望。',
      en: 'The Wishing Festival comes once every hundred years! The legendary Seven-Color Wishing Stone grants the whole town a wish on the final night.' },
    { zh: '可是前夜「喀啦」一聲，星願石裂成七片彩色碎片，飛散到小鎮各個角落！屋頂上還閃過一個神祕的斗篷身影…',
      en: 'But the night before — crack! — the stone shattered into seven colored shards and scattered across town! A mysterious cloaked figure flashed across the rooftops…' },
    { zh: '星願祭主席星奶奶找上剛開張的「安安偵探社」：「拜託你，在最後一晚之前，把七片碎片找回來！」',
      en: 'Granny Star turns to the new An-An Detective Agency: "Please, bring back all seven shards before the last night!"' },
  ],

  episodes: [
    // ─────────────────────────────────────── EP1 ───────────────────────────────────────
    {
      id: 'ep1',
      no: 1,
      title: { zh: '午夜鐘樓的紅寶碎片', en: 'The Ruby Shard at the Midnight Clock Tower' },
      emoji: '🔴',
      accent: '#e05b5b',
      difficulty: { zh: '單步暖身', en: 'Warm-up' },
      shard: { color: 'red', emoji: '🔴', name: { zh: '紅寶碎片', en: 'Ruby Shard' } },
      intro: [
        { zh: '鎮中心的大鐘突然停了，還透出紅紅的光——第一片碎片，一定在鐘樓！',
          en: 'The town clock suddenly stopped, glowing red — the first shard must be in the clock tower!' },
        { zh: '安安戴上偵探帽，帶著搭檔，走進安靜的鐘樓開始調查。',
          en: 'An-An puts on the detective hat and steps into the quiet tower with a partner.' },
      ],
      scenes: [
        {
          place: { zh: '鐘樓大門', en: 'The Tower Gate' },
          emoji: '🕰️',
          story: { zh: '大門是密碼鎖，提示寫著：密碼等於鐘樓的窗戶總數。',
                   en: 'The gate has a code lock. The hint says: the code is the total number of windows.' },
          puzzle: {
            text: { zh: '鐘樓有 {4} 面牆，每面牆有 {5} 扇窗，一共有幾扇窗？',
                    en: 'The tower has {4} walls, with {5} windows on each. How many windows in all?' },
            answer: 20, unit: { zh: '扇', en: 'windows' },
            hint: { zh: '4 面、每面 5 扇，就是 4 × 5。', en: '4 walls × 5 windows each = 4 × 5.' },
            reward: { zh: '🔓 密碼是 20！門開了，紅光在樓上，地上有一小撮溫溫的、會發亮的星塵。',
                      en: '🔓 The code is 20! Upstairs glows red, and a pinch of warm, glowing stardust rests on the floor.' },
          },
        },
        {
          place: { zh: '大鐘的鐘面', en: 'The Clock Face' },
          emoji: '🕛',
          story: { zh: '巨大的鐘面就在眼前，指針停住不動了。',
                   en: 'The giant clock face is right here, its hands frozen still.' },
          puzzle: {
            text: { zh: '時鐘上有 {12} 個數字，指針已經走過 {7} 個，還沒走到的有幾個？',
                    en: 'A clock has {12} numbers. The hand has passed {7}. How many are [left]?' },
            answer: 5, unit: { zh: '個', en: 'numbers' },
            hint: { zh: '用 12 個減掉走過的 7 個。', en: 'Take away the 7 passed from 12.' },
            reward: { zh: '🕵️ 還有 5 個沒走到！星塵一路灑向通往樓上的旋轉樓梯。',
                      en: '🕵️ 5 left! The stardust trails toward the spiral stairs going up.' },
          },
        },
        {
          place: { zh: '旋轉樓梯', en: 'The Spiral Stairs' },
          emoji: '🪜',
          story: { zh: '一階一階往上爬，星塵越來越亮。先數數看要爬幾階。',
                   en: 'Step by step, the stardust glows brighter. Let’s count the steps.' },
          puzzle: {
            text: { zh: '鐘樓有 {6} 層，每一層有 {8} 階樓梯，一共有幾階？',
                    en: 'The tower has {6} floors, with {8} steps on each. How many steps in all?' },
            answer: 48, unit: { zh: '階', en: 'steps' },
            hint: { zh: '6 層、每層 8 階，就是 6 × 8。', en: '6 floors × 8 steps each = 6 × 8.' },
            reward: { zh: '🌟 48 階！爬到一半，聽見「滴答、滴答」——是鐘擺室的聲音。',
                      en: '🌟 48 steps! Halfway up, a tick-tock sound comes from the pendulum room.' },
          },
        },
        {
          place: { zh: '鐘擺室', en: 'The Pendulum Room' },
          emoji: '⏰',
          story: { zh: '大鐘的指針停在一個奇怪的時間，好像就是它停下來的那一刻。',
                   en: 'The clock hands stopped at an odd time — maybe the very moment it froze.' },
          puzzle: {
            text: { zh: '大鐘停在 8 點 {45} 分，離下一個整點 9 點還[差]幾分鐘？',
                    en: 'The clock stopped at 8:{45}. How many minutes are [left] until 9:00?' },
            answer: 15, unit: { zh: '分鐘', en: 'minutes' },
            hint: { zh: '一小時有 60 分，用 60 減掉 45。', en: 'One hour is 60 minutes. Take 45 from 60.' },
            reward: { zh: '⏳ 還差 15 分鐘！星塵飄進隔壁嗡嗡作響的齒輪室。',
                      en: '⏳ 15 minutes left! The stardust drifts into the humming gear room.' },
          },
        },
        {
          place: { zh: '齒輪室', en: 'The Gear Room' },
          emoji: '⚙️',
          story: { zh: '滿房間的金色齒輪整齊排列著，其中一個好像卡住了。',
                   en: 'Golden gears fill the room in neat rows — but one seems jammed.' },
          puzzle: {
            text: { zh: '齒輪室裡有 {7} 排齒輪，每排 {4} 個，一共有幾個齒輪？',
                    en: 'The room has {7} rows of gears, {4} in each row. How many gears in all?' },
            answer: 28, unit: { zh: '個', en: 'gears' },
            hint: { zh: '7 排、每排 4 個，就是 7 × 4。', en: '7 rows × 4 gears each = 7 × 4.' },
            reward: { zh: '🔧 28 個齒輪！其中一個縫裡卡著紅光的碎屑。旁邊的儲藏室門開著…',
                      en: '🔧 28 gears! Red light glints in one gap. The storage room door stands open…' },
          },
        },
        {
          place: { zh: '儲藏室', en: 'The Storage Room' },
          emoji: '📦',
          story: { zh: '儲藏室堆滿了大鐘的零件，有人最近好像在這裡整理過。',
                   en: 'The storage room is full of clock parts. Someone tidied up here recently.' },
          puzzle: {
            text: { zh: '架上原本有 {26} 個舊零件，又找到 {17} 個，現在一共有幾個？',
                    en: 'The shelf had {26} old parts. {17} more were found. How many now in all?' },
            answer: 43, unit: { zh: '個', en: 'parts' },
            hint: { zh: '把原本的 26 個和找到的 17 個加起來。', en: 'Add the 26 and the 17 together.' },
            reward: { zh: '🧰 43 個零件！有人把一個發著紅光的包袱藏在最上層，還帶著它往樓頂走。',
                      en: '🧰 43 parts! Someone hid a glowing red bundle on the top shelf and carried it up.' },
          },
        },
        {
          place: { zh: '敲鐘室', en: 'The Bell Room' },
          emoji: '🔔',
          story: { zh: '大鐘每到整點就會敲鐘，難怪它壞掉時吵得全鎮睡不著。',
                   en: 'The bell rings on every hour — no wonder it woke the whole town when it broke.' },
          puzzle: {
            text: { zh: '大鐘在 {3} 個整點都敲了鐘，每個整點敲 {8} 下，一共敲了幾下？',
                    en: 'The bell rang at {3} hours, {8} chimes each time. How many chimes in all?' },
            answer: 24, unit: { zh: '下', en: 'chimes' },
            hint: { zh: '3 個整點、每次 8 下，就是 3 × 8。', en: '3 hours × 8 chimes each = 3 × 8.' },
            reward: { zh: '🔊 敲了 24 下！難怪全鎮都醒了。樓頂的門透出溫暖的紅光…',
                      en: '🔊 24 chimes! No wonder everyone woke up. Warm red light leaks from the rooftop door…' },
          },
        },
        {
          place: { zh: '鐘樓頂端', en: 'The Rooftop' },
          emoji: '🌃',
          story: { zh: '推開門，一位老爺爺正抱著發光的紅色包袱，站在滿天星空下。',
                   en: 'The door opens — an old man holds a glowing red bundle beneath a sky full of stars.' },
          puzzle: {
            text: { zh: '從鐘樓頂看夜空，本來有 {14} 顆星，又亮了 {9} 顆，現在天上有幾顆星？',
                    en: 'From the rooftop, {14} stars shone, then {9} more lit up. How many stars now?' },
            answer: 23, unit: { zh: '顆', en: 'stars' },
            hint: { zh: '把本來的 14 顆和新亮的 9 顆加起來。', en: 'Add the 14 stars and the 9 new ones.' },
            reward: { zh: '🎉 紅寶碎片入手！同時，一個小小的斗篷身影從對面屋簷一閃而過，快得像風，只留下一路溫溫的星塵…',
                      en: '🎉 The Ruby Shard is found! Just then a tiny cloaked figure darts across the far roof — fast as the wind — leaving a trail of warm stardust…' },
          },
        },
      ],
      suspects: [
        { id: 'clockkeeper', name: { zh: '鐘爺爺', en: 'Grandpa Clock' }, emoji: '👴' },
        { id: 'clown',       name: { zh: '愛惡作劇小丑', en: 'the Playful Clown' }, emoji: '🤡' },
        { id: 'collector',   name: { zh: '神祕收藏家', en: 'the Collector' }, emoji: '🎩' },
      ],
      culprit: 'clockkeeper',
      accuse: { zh: '停擺的大鐘、被包起來的紅光、樓梯頂的腳步… 是誰把碎片藏起來了呢？',
                en: 'A stopped clock, red light wrapped up, footsteps upstairs… Who hid the shard?' },
      wrongAccuse: { zh: '嗯…線索對不太起來，再看看偵探筆記想一想吧！🔍',
                     en: 'Hmm… the clues don’t match. Check your detective notes again! 🔍' },
      solve: [
        { zh: '原來，是顧了大鐘一輩子的鐘爺爺！👴',
          en: 'It was Grandpa Clock, who has cared for the clock his whole life! 👴' },
        { zh: '紅寶碎片卡進齒輪，害大鐘半夜瘋狂亂敲，全鎮都睡不著。',
          en: 'The Ruby Shard jammed the gears and made the clock chime wildly all night, keeping the whole town awake.' },
        { zh: '他心疼大鐘、也怕吵到大家，就爬上樓把碎片小心包好收著，等人來處理。',
          en: 'Worried for the clock and the townsfolk, he climbed up and gently wrapped the shard away to keep it safe.' },
        { zh: '安安謝謝爺爺，收下了第一片碎片。星願祭有救了！',
          en: 'An-An thanks him and takes the first shard. The festival still has a chance!' },
      ],
      arcClue: { zh: '斗篷客的身影好小、好輕，快得像一陣風，還一直抬頭望著夜空…而且，牠留下的星塵，是溫溫的。',
                 en: 'The cloaked figure is small and light, fast as the wind, always looking up at the sky — and its stardust felt warm.' },
      nextPreview: { zh: '下集：第二片橙光碎片，把黃昏市集攪得亂成一團？那個斗篷身影，好像又出現了…',
                     en: 'Next: The Amber Shard turns the evening market upside down? That cloaked figure appears again…' },
      reward: 300,
    },

    // ─────────────────────────────────────── EP2 ───────────────────────────────────────
    {
      id: 'ep2',
      no: 2,
      title: { zh: '黃昏市集的橙光碎片', en: 'The Amber Shard at the Evening Market' },
      emoji: '🟠',
      accent: '#e8873a',
      difficulty: { zh: '單步暖身', en: 'Warm-up' },
      shard: { color: 'orange', emoji: '🟠', name: { zh: '橙光碎片', en: 'Amber Shard' } },
      intro: [
        { zh: '第二片碎片的橙光，出現在熱鬧的黃昏市集，還把一個攤子的生意攪得亂七八糟！',
          en: 'The second shard’s amber glow appears at the busy evening market — turning one stall’s business into chaos!' },
        { zh: '安安和搭檔跟著暖暖的橙光，鑽進人來人往的市集查案。',
          en: 'An-An and a partner follow the warm amber glow into the bustling market.' },
      ],
      scenes: [
        {
          place: { zh: '市集入口', en: 'The Market Gate' },
          emoji: '🏮',
          story: { zh: '入口的告示牌是密碼鎖，提示：密碼等於市集的攤位總數。',
                   en: 'The gate sign is a code lock. The hint: the code is the total number of stalls.' },
          puzzle: {
            text: { zh: '市集有 {8} 排攤子，每排 {4} 個攤位，一共有幾個攤位？',
                    en: 'The market has {8} rows of stalls, {4} stalls in each. How many stalls in all?' },
            answer: 32, unit: { zh: '個', en: 'stalls' },
            hint: { zh: '8 排、每排 4 個，就是 8 × 4。', en: '8 rows × 4 stalls each = 8 × 4.' },
            reward: { zh: '🔓 密碼是 32！橙光從市集深處透出來，地上又是一撮溫溫的星塵。',
                      en: '🔓 The code is 32! Amber light glows deeper in, with another pinch of warm stardust on the ground.' },
          },
        },
        {
          place: { zh: '水果攤', en: 'The Fruit Stall' },
          emoji: '🍎',
          story: { zh: '水果攤的老闆正忙著找錢給客人，我們幫他算算看。',
                   en: 'The fruit seller is busy making change. Let’s help him out.' },
          puzzle: {
            text: { zh: '一袋蘋果 {35} 元，客人付了 {50} 元，應該找回多少錢？',
                    en: 'A bag of apples costs ${35}. The customer pays ${50}. How much change is [left]?' },
            answer: 15, unit: { zh: '元', en: 'dollars' },
            hint: { zh: '用付的 50 元，減掉蘋果的 35 元。', en: 'Take the $35 apples from the $50 paid.' },
            reward: { zh: '🍎 找回 15 元！橙光的星塵，一路飄向賣糖葫蘆的攤子。',
                      en: '🍎 $15 change! The amber stardust drifts toward the candy-skewer stall.' },
          },
        },
        {
          place: { zh: '糖葫蘆攤', en: 'The Candy-Skewer Stall' },
          emoji: '🍡',
          story: { zh: '紅通通的糖葫蘆一支支插在架上，看起來好好吃。',
                   en: 'Bright candy skewers line the rack — they look delicious!' },
          puzzle: {
            text: { zh: '安安想買 {6} 支糖葫蘆，每支 {5} 元，一共要多少錢？',
                    en: 'An-An wants {6} candy skewers at ${5} each. How much in all?' },
            answer: 30, unit: { zh: '元', en: 'dollars' },
            hint: { zh: '6 支、每支 5 元，就是 6 × 5。', en: '6 skewers × $5 each = 6 × 5.' },
            reward: { zh: '🍡 一共 30 元！攤主說，橙光滾過去的方向，是隔壁的麵包攤。',
                      en: '🍡 $30 in all! The seller says the amber light rolled toward the bakery stall next door.' },
          },
        },
        {
          place: { zh: '麵包攤', en: 'The Bakery Stall' },
          emoji: '🥐',
          story: { zh: '剛出爐的麵包香噴噴，老闆娘正在數今天做了幾個。',
                   en: 'Fresh bread smells wonderful as the baker counts today’s batch.' },
          puzzle: {
            text: { zh: '麵包攤已經賣出 {42} 個麵包，又烤好 {18} 個，今天一共做了幾個？',
                    en: 'The bakery sold {42} loaves and baked {18} more. How many made today in all?' },
            answer: 60, unit: { zh: '個', en: 'loaves' },
            hint: { zh: '把賣出的 42 個和新烤的 18 個加起來。', en: 'Add the 42 sold and the 18 fresh loaves.' },
            reward: { zh: '🥐 一共 60 個！橙光溜進了旁邊五顏六色的花攤。',
                      en: '🥐 60 loaves! The amber light slips into the colorful flower stall.' },
          },
        },
        {
          place: { zh: '花攤', en: 'The Flower Stall' },
          emoji: '💐',
          story: { zh: '花攤阿姨正要把花分成一束一束來賣。',
                   en: 'The florist is bundling flowers to sell.' },
          puzzle: {
            text: { zh: '花攤有 {24} 朵花，要[平分]綁成 {4} 束，每一束有幾朵？',
                    en: 'There are {24} flowers to [share] into {4} bunches. How many in each bunch?' },
            answer: 6, unit: { zh: '朵', en: 'flowers' },
            hint: { zh: '24 朵平分成 4 束，就是 24 ÷ 4。', en: '24 flowers ÷ 4 bunches = 24 ÷ 4.' },
            reward: { zh: '💐 每束 6 朵！橙光的星塵，飄向了賣玩具的小攤。',
                      en: '💐 6 in each bunch! The amber stardust floats to the little toy stall.' },
          },
        },
        {
          place: { zh: '玩具攤', en: 'The Toy Stall' },
          emoji: '🧸',
          story: { zh: '玩具攤上擺滿小玩具，安安挑了一個木頭陀螺。',
                   en: 'The toy stall is full of little toys. An-An picks a wooden top.' },
          puzzle: {
            text: { zh: '一個木頭陀螺 {28} 元，安安付了 {40} 元，要找回多少錢？',
                    en: 'A wooden top costs ${28}. An-An pays ${40}. How much change is [left]?' },
            answer: 12, unit: { zh: '元', en: 'dollars' },
            hint: { zh: '用付的 40 元，減掉陀螺的 28 元。', en: 'Take the $28 top from the $40 paid.' },
            reward: { zh: '🧸 找回 12 元！橙光越來越亮，前面是掛滿燈籠的燈籠攤。',
                      en: '🧸 $12 change! The amber glow brightens toward the lantern stall ahead.' },
          },
        },
        {
          place: { zh: '燈籠攤', en: 'The Lantern Stall' },
          emoji: '🏮',
          story: { zh: '一整排橙色的燈籠亮起來，好像在為星願祭暖場。',
                   en: 'Rows of orange lanterns light up, warming the town for the festival.' },
          puzzle: {
            text: { zh: '燈籠攤掛了 {5} 排橙色燈籠，每排 {7} 個，一共有幾個燈籠？',
                    en: 'The stall hangs {5} rows of orange lanterns, {7} in each. How many lanterns in all?' },
            answer: 35, unit: { zh: '個', en: 'lanterns' },
            hint: { zh: '5 排、每排 7 個，就是 5 × 7。', en: '5 rows × 7 lanterns each = 5 × 7.' },
            reward: { zh: '🏮 35 個燈籠！橙光就藏在攤主阿姨的推車裡，她正緊張地守著。',
                      en: '🏮 35 lanterns! The amber light hides in the seller’s cart — she guards it nervously.' },
          },
        },
        {
          place: { zh: '阿姨的推車', en: 'The Seller’s Cart' },
          emoji: '🛒',
          story: { zh: '推車上蓋著布，掀開一看，橙光碎片就在一堆橘子中間閃著光。',
                   en: 'Under the cart’s cloth, the amber shard glows among a pile of oranges.' },
          puzzle: {
            text: { zh: '推車上原本有 {13} 顆橘子，阿姨又放上 {9} 顆，現在一共有幾顆？',
                    en: 'The cart had {13} oranges. She added {9} more. How many now in all?' },
            answer: 22, unit: { zh: '顆', en: 'oranges' },
            hint: { zh: '把原本的 13 顆和新放的 9 顆加起來。', en: 'Add the 13 oranges and the 9 new ones.' },
            reward: { zh: '🎉 橙光碎片入手！這時，市集最高的燈柱上，那個斗篷身影正望著同一顆星星，又悄悄不見了…',
                      en: '🎉 The Amber Shard is found! On the tallest lamppost, the cloaked figure gazes at one star — then quietly vanishes…' },
          },
        },
      ],
      suspects: [
        { id: 'aunty',     name: { zh: '賣橘子的阿姨', en: 'the Orange Seller' }, emoji: '🍊' },
        { id: 'clown',     name: { zh: '愛惡作劇小丑', en: 'the Playful Clown' }, emoji: '🤡' },
        { id: 'collector', name: { zh: '神祕收藏家', en: 'the Collector' }, emoji: '🎩' },
      ],
      culprit: 'aunty',
      accuse: { zh: '亂掉的生意、藏在推車裡的橙光、緊張的守著… 是誰把碎片藏起來了呢？',
                en: 'A stall in chaos, amber light in the cart, someone guarding nervously… Who hid the shard?' },
      wrongAccuse: { zh: '嗯…線索對不太起來，再看看偵探筆記想一想吧！🔍',
                     en: 'Hmm… the clues don’t match. Check your detective notes again! 🔍' },
      solve: [
        { zh: '原來，是賣橘子的阿姨！🍊',
          en: 'It was the kind orange seller! 🍊' },
        { zh: '橙光碎片掉進她的秤裡，秤變得亂七八糟，客人買東西一直吵架。',
          en: 'The amber shard fell into her scale, making it go crazy — and the customers kept arguing.' },
        { zh: '她怕大家為了錢傷了和氣，就把碎片藏進推車，想等市集打烊再處理。',
          en: 'Afraid people would quarrel over money, she hid the shard in her cart until closing time.' },
        { zh: '安安謝謝阿姨，收下了第二片碎片。市集又熱熱鬧鬧的了！',
          en: 'An-An thanks her and takes the second shard. The market is happy and lively again!' },
      ],
      arcClue: { zh: '有人看到斗篷客站在市集最高的燈柱上，一直望著夜空同一顆星星，好像在想念什麼。',
                 en: 'Someone saw the cloaked figure atop the tallest lamppost, staring at one star in the sky — as if missing something.' },
      nextPreview: { zh: '下集：第三片黃星碎片，出現在安安的母校教室裡，還讓分組大亂？（這集的謎題，要開始算兩步囉！）',
                     en: 'Next: The Yellow-Star Shard appears in An-An’s old classroom and scrambles the groups? (Two-step puzzles begin here!)' },
      reward: 350,
    },
  ],
}

// 集數順序（解鎖用）
export const EPISODE_ORDER = SEASON1.episodes.map((e) => e.id)

// 推理牆上的七色碎片格子（依彩虹順序），collected 由 store 的 seriesShards 決定
export const SHARD_BOARD = [
  { color: 'red',    emoji: '🔴', name: { zh: '紅寶', en: 'Ruby' } },
  { color: 'orange', emoji: '🟠', name: { zh: '橙光', en: 'Amber' } },
  { color: 'yellow', emoji: '🟡', name: { zh: '黃星', en: 'Yellow-Star' } },
  { color: 'green',  emoji: '🟢', name: { zh: '綠葉', en: 'Green-Leaf' } },
  { color: 'blue',   emoji: '🔵', name: { zh: '藍水', en: 'Blue-Water' } },
  { color: 'indigo', emoji: '🟣', name: { zh: '靛夜', en: 'Indigo-Night' } },
  { color: 'purple', emoji: '🟪', name: { zh: '紫幕', en: 'Purple-Curtain' } },
]
