// 長篇連續劇 第二季《安安偵探社 · 星空亂了套》
// The An-An Detective Agency — Season 2: The Tangled Sky
//
// 承接第一季《七色星願》：小星回到夜空後，發現星座全亂了位，回來邀安安當「星際小偵探」。
// 結構同 S1（資料驅動、中英雙語、每集 8 現場、破案指認）。差異：
//   每集收集一枚「星座徽章」badge（取代 S1 的 shard），集滿 12 星座解終章。
//   難度混合：主線集升級小四新題型、EP1/EP6 等喘息集複習小三。
//   裏層主線：搞亂星座的是迷路又孤單的月亮精靈「小月」（終章化敵為友＝新寵物）。
//
// 每集結構同 S1，但用 badge 取代 shard：
//   badge: { id, emoji, name{zh,en} }   破案收集的星座徽章
//   其餘 id/no/title/emoji/accent/difficulty/intro/scenes/suspects/culprit/
//   accuse/wrongAccuse/solve/arcClue/nextPreview/reward 皆同 S1。
//   ⚠️ episode id 用 's2ep*' 前綴，避免和 S1 的 seriesSolved 撞鍵。

export const SEASON2 = {
  id: 'season2',
  title: { zh: '星空亂了套', en: 'The Tangled Sky' },
  emoji: '🌌',
  // 整季只在第一集開場顯示一次
  seasonIntro: [
    { zh: '小星回家以後，夜空本來又亮又整齊。可是這天晚上，小星急急忙忙飛回安安的窗前——牠帶來一個壞消息。',
      en: 'After Twinkle went home, the night sky was bright and neat. But tonight Twinkle rushes back to An-An’s window — with bad news.' },
    { zh: '「安安！星座……星座全亂了位！星星們找不到自己回家的位子，整片天空歪歪扭扭的。」',
      en: '“An-An! The constellations… they’re all tangled up! The stars can’t find their places, and the whole sky is crooked.”' },
    { zh: '小星拉起安安的手：「你是最厲害的偵探！可以再幫我一次嗎？我們一顆一顆，把星座拼回去！」安安戴上偵探帽——星際偵探社，開張！',
      en: 'Twinkle takes An-An’s hand: “You’re the best detective! Will you help me once more? Star by star, let’s put the sky back together!” An-An puts on her detective hat — the Interstellar Agency is open!' },
  ],

  episodes: [
    // ─────────────────────────────────────── S2 EP1 ───────────────────────────────────────
    {
      id: 's2ep1',
      no: 1,
      title: { zh: '牡羊座的星星牧場', en: 'The Star Ranch of Aries' },
      emoji: '🐏',
      accent: '#ff8a5c',
      difficulty: { zh: '暖身複習', en: 'Warm-up review' },
      badge: { id: 'aries', emoji: '🐏', name: { zh: '牡羊徽章', en: 'Aries Badge' } },
      intro: [
        { zh: '第一站，是離小鎮最近、最好認的牡羊座。可是牡羊座上，一群「星星羊」全跑散了，牧場亂成一團。',
          en: 'First stop: Aries, the nearest and easiest constellation to spot. But its flock of “star-sheep” has scattered, and the ranch is in chaos.' },
        { zh: '而且草地上，還留著一道亮亮的、淡淡的彗星尾光……小星看著那道光，歪著頭，好像想起了什麼，卻又說不上來。',
          en: 'And across the grass lingers a faint, glowing comet-tail trail… Twinkle tilts its head at it, as if remembering something it can’t quite name.' },
      ],
      scenes: [
        {
          place: { zh: '牧場門口', en: 'The Ranch Gate' },
          emoji: '🚪',
          story: { zh: '牧場門口，星星羊們慌慌張張地往回跑。安安先數數看，圍欄裡到底有幾隻。',
                   en: 'At the gate, star-sheep hurry back in a panic. An-An counts how many are in the pen.' },
          puzzle: {
            text: { zh: '圍欄裡本來有 {8} 隻星星羊，又跑回來 {6} 隻，現在一共有幾隻？',
                    en: 'The pen held {8} star-sheep; {6} more ran back. How many are there now?' },
            answer: 14, unit: { zh: '隻', en: 'sheep' },
            hint: { zh: '把本來的 8 隻和跑回來的 6 隻加起來。', en: 'Add the 8 sheep and the 6 that ran back.' },
            reward: { zh: '🐑 一共 14 隻！可是還有好多隻散在山坡上，安安順著咩咩叫聲往上走。',
                      en: '🐑 14 sheep! But many are still scattered on the slope. An-An follows the bleating uphill.' },
          },
        },
        {
          place: { zh: '青草坡', en: 'The Grassy Slope' },
          emoji: '🌱',
          story: { zh: '青草坡上，有些羊看見流星就興奮地追了出去，越跑越遠。',
                   en: 'On the slope, some sheep spot shooting stars and chase off, farther and farther.' },
          puzzle: {
            text: { zh: '草坡上有 {15} 隻羊，跑走了 {6} 隻去追流星，還剩幾隻？',
                    en: 'The slope had {15} sheep; {6} ran off chasing shooting stars. How many are [left]?' },
            answer: 9, unit: { zh: '隻', en: 'sheep' },
            hint: { zh: '用 15 隻減掉跑走的 6 隻。', en: 'Take the 6 that ran off from 15.' },
            reward: { zh: '🌠 還剩 9 隻！安安把追星星的小羊一隻隻牽回來，往山上的羊圈走去。',
                      en: '🌠 9 left! An-An leads the star-chasers back and heads for the pen up the hill.' },
          },
        },
        {
          place: { zh: '星星羊圈', en: 'The Star Pen' },
          emoji: '🐑',
          story: { zh: '羊圈裡，小羊們排排站，卻站得亂七八糟。安安幫牠們排整齊。',
                   en: 'In the pen, the little sheep line up — but all in a muddle. An-An helps them stand neat.' },
          puzzle: {
            text: { zh: '安安把羊排成 {3} 排，每排 {5} 隻，一共排了幾隻羊？',
                    en: 'An-An lines them into {3} rows of {5} sheep each. How many sheep in all?' },
            answer: 15, unit: { zh: '隻', en: 'sheep' },
            hint: { zh: '3 排、每排 5 隻，就是 3 × 5。', en: '3 rows × 5 sheep each = 3 × 5.' },
            reward: { zh: '🐑 一共 15 隻排好了！小羊們身上的星星毛，在月光下亮晶晶的。',
                      en: '🐑 15 lined up! Their starry wool sparkles in the moonlight.' },
          },
        },
        {
          place: { zh: '剪星星毛', en: 'Shearing Star-Wool' },
          emoji: '🧶',
          story: { zh: '牧場的爺爺說，星星羊的毛可以捲成一球球「星星毛線」，拿去補破掉的星座。',
                   en: 'The old rancher says star-wool rolls into balls of “star-yarn” to mend broken constellations.' },
          puzzle: {
            text: { zh: '有 {4} 隻羊，每隻剪下 {6} 球星星毛線，一共有幾球？',
                    en: 'From {4} sheep, each gives {6} balls of star-yarn. How many balls in all?' },
            answer: 24, unit: { zh: '球', en: 'balls' },
            hint: { zh: '4 隻、每隻 6 球，就是 4 × 6。', en: '4 sheep × 6 balls each = 4 × 6.' },
            reward: { zh: '🧶 一共 24 球！亮閃閃的星星毛線，剛好可以拿來把歪掉的星星綁回原位。',
                      en: '🧶 24 balls! The glittering star-yarn is perfect for tying crooked stars back in place.' },
          },
        },
        {
          place: { zh: '餵星星草', en: 'Feeding Star-Grass' },
          emoji: '🌾',
          story: { zh: '忙了一陣，小羊們餓了。安安把星星草平分給大家。',
                   en: 'After all the work, the sheep are hungry. An-An shares the star-grass equally.' },
          puzzle: {
            text: { zh: '安安把 {18} 把星星草，[平分]給 {6} 隻羊，每隻分到幾把？',
                    en: 'An-An [shares] {18} bundles of star-grass among {6} sheep. How many each?' },
            answer: 3, unit: { zh: '把', en: 'bundles' },
            hint: { zh: '18 把平分給 6 隻，就是 18 ÷ 6。', en: '18 bundles ÷ 6 sheep = 18 ÷ 6.' },
            reward: { zh: '🌾 每隻 3 把！小羊們吃得好開心。這時，一隻掛著鈴鐺的大羊慢慢走了過來。',
                      en: '🌾 3 each! The sheep munch happily. Just then, a big ram with a bell ambles over.' },
          },
        },
        {
          place: { zh: '領頭羊的鈴鐺', en: 'The Lead Ram’s Bells' },
          emoji: '🔔',
          story: { zh: '那是領頭羊咩咩，項圈上掛滿了星星鈴鐺，走起路來叮叮噹噹。',
                   en: 'It’s Baa the lead ram, its collar hung with star-bells that jingle as it walks.' },
          puzzle: {
            text: { zh: '咩咩的項圈本來有 {24} 顆星星鈴鐺，又掛上 {8} 顆，現在一共有幾顆？',
                    en: 'Baa’s collar had {24} star-bells; {8} more were added. How many bells now?' },
            answer: 32, unit: { zh: '顆', en: 'bells' },
            hint: { zh: '把本來的 24 顆和新掛的 8 顆加起來。', en: 'Add the 24 bells and the 8 new ones.' },
            reward: { zh: '🔔 一共 32 顆！鈴鐺一響，小羊們都豎起耳朵——原來牠們一直乖乖跟著咩咩的鈴聲走。',
                      en: '🔔 32 bells! At the jingle, the sheep prick their ears — they’ve been following Baa’s bells all along.' },
          },
        },
        {
          place: { zh: '彗星尾光', en: 'The Comet Trail' },
          emoji: '☄️',
          story: { zh: '安安順著草地上那道淡淡的彗星尾光走，發現沿路散落著好多顆掉下來的小星星。',
                   en: 'An-An follows the faint comet trail and finds many fallen little stars along the way.' },
          puzzle: {
            text: { zh: '彗星尾光旁散落了 {30} 顆小星，安安撿回了 {17} 顆，還剩幾顆沒撿？',
                    en: 'Beside the trail lay {30} little stars; An-An gathered {17}. How many are still [uncollected]?' },
            answer: 13, unit: { zh: '顆', en: 'stars' },
            hint: { zh: '用 30 顆減掉撿回的 17 顆。', en: 'Take the 17 gathered from 30.' },
            reward: { zh: '⭐ 還剩 13 顆！這道彗星尾光……小星看著它，輕輕發抖，好像認得，卻又不敢說。',
                      en: '⭐ 13 left! This comet trail… Twinkle stares at it, trembling — as if it knows it, but dares not say.' },
          },
        },
        {
          place: { zh: '找到領頭羊', en: 'Finding the Lead Ram' },
          emoji: '🐏',
          story: { zh: '安安終於看懂了：咩咩不是在搗亂，是急著把嚇散的小羊，一群一群趕回正確的位子。',
                   en: 'At last An-An understands: Baa wasn’t making trouble — it was rushing the frightened sheep back to their right places, group by group.' },
          puzzle: {
            text: { zh: '咩咩要把 {5} 群小羊、每群 {4} 隻趕回羊圈，已經回了 {12} 隻，還有幾隻在外面？',
                    en: 'Baa must herd {5} groups of {4} sheep back; {12} are already in. How many are still outside?' },
            answer: 8, unit: { zh: '隻', en: 'sheep' },
            hint: { zh: '先算全部：5 群 × 4 隻 = 20 隻，再減掉回來的 12 隻。', en: 'First 5 × 4 = 20 sheep, then take away the 12 back inside.' },
            reward: { zh: '🎉 還有 8 隻在外面！安安和小星幫忙把最後 8 隻牽回羊圈，牡羊座的星星，一顆顆亮回原位！',
                      en: '🎉 8 still outside! An-An and Twinkle bring the last 8 home, and Aries’ stars light back into place one by one!' },
          },
        },
      ],
      suspects: [
        { id: 'ram',   name: { zh: '領頭羊咩咩', en: 'Baa the Lead Ram' }, emoji: '🐏' },
        { id: 'moon',  name: { zh: '月亮爺爺', en: 'Grandpa Moon' }, emoji: '🌙' },
        { id: 'comet', name: { zh: '彗星郵差', en: 'the Comet Postman' }, emoji: '☄️' },
      ],
      culprit: 'ram',
      accuse: { zh: '牧場被弄亂、星星羊全跑散，可是仔細看——是誰一直努力想把小羊們趕回正確的位子，急得滿頭大汗？（提示：牠不是搗蛋，是想幫忙喔！）',
                en: 'The ranch is a mess and the sheep scattered — but look closely: who has been frantically herding them back to their right places? (Hint: not a troublemaker — a helper!)' },
      wrongAccuse: { zh: '這位平常不會在牧場裡趕羊耶。再想想，誰的哨聲（鈴聲）一響，小羊們就乖乖跟著走？🐏',
                     en: 'This one doesn’t herd sheep on the ranch. Think again: whose bell, when it rings, the sheep obediently follow? 🐏' },
      solve: [
        { zh: '原來，是牧場的領頭羊咩咩！🐏',
          en: 'It was Baa, the ranch’s lead ram! 🐏' },
        { zh: '星座突然亂位的那一刻，小羊們嚇得四處亂竄。咩咩不忍心看牠們迷路，就自己扛起責任，一隻一隻往牠記得的位子趕——可是牠一隻羊怎麼趕得動整片星空？越趕越亂，才被大家誤會成「弄亂牧場的兇手」。',
          en: 'When the constellations lurched, the sheep bolted in fright. Baa couldn’t bear to see them lost, so it took charge, herding each toward the spot it remembered — but how could one ram move a whole sky? The more it herded, the messier it got, and everyone mistook it for the culprit.' },
        { zh: '至於那道彗星尾光呢？咩咩說，亂位之前，牠看見一個「圓圓的、亮亮的、好像在哭」的身影，從牧場邊悄悄飄過，星座就是從那時候開始歪的……小星聽了，心裡揪了一下。',
          en: 'And the comet trail? Baa says that just before the chaos, it saw a “round, glowing, seemingly crying” figure drift quietly past the ranch — and that’s when the sky began to tilt… Hearing this, Twinkle’s heart tightens.' },
        { zh: '安安摸摸咩咩的頭：「辛苦你了。剩下的交給我們——我們會把整片星空，一個一個拼回去。」',
          en: 'An-An pats Baa’s head: “Well done. Leave the rest to us — we’ll put the whole sky back, one piece at a time.”' },
      ],
      arcClue: { zh: '牡羊座拼回去了！可是安安發現，星座亂位不是意外——牧場上那道彗星尾光、還有咩咩看見的「圓圓、亮亮、好像在哭的身影」，都指向同一個祕密：有人把星星「借走」了。那會是誰？為什麼要這麼做？小星望著那道光，欲言又止，只是把安安的手，握得更緊了。',
                 en: 'Aries is whole again! But An-An realizes the tangling was no accident — the comet trail and Baa’s “round, glowing, crying figure” point to one secret: someone is “borrowing” the stars. Who? And why? Twinkle stares at the trail, words caught in its throat, and only holds An-An’s hand a little tighter.' },
      nextPreview: { zh: '下集：金牛座！牛奶星河的牧場主人算不清今晚的產量，帳全對不上——因為數字變得好大好大。安安要用「兩位數乘法」幫忙算清楚！那道彗星尾光，也一路延伸到了金牛座……',
                     en: 'Next: Taurus! The keeper of the Milk-Star River can’t total tonight’s output — the numbers have grown huge. An-An must use two-digit multiplication to sort it out! And the comet trail stretches on toward Taurus…' },
      reward: 320,
    },
  ],
}

// 星座徽章牆（依十二星座順序），collected 由 store 的 seriesBadges 決定
export const BADGE_BOARD = [
  { id: 'aries',       emoji: '🐏', name: { zh: '牡羊', en: 'Aries' } },
  { id: 'taurus',      emoji: '🐂', name: { zh: '金牛', en: 'Taurus' } },
  { id: 'gemini',      emoji: '👯', name: { zh: '雙子', en: 'Gemini' } },
  { id: 'cancer',      emoji: '🦀', name: { zh: '巨蟹', en: 'Cancer' } },
  { id: 'leo',         emoji: '🦁', name: { zh: '獅子', en: 'Leo' } },
  { id: 'virgo',       emoji: '🌾', name: { zh: '處女', en: 'Virgo' } },
  { id: 'libra',       emoji: '⚖️', name: { zh: '天秤', en: 'Libra' } },
  { id: 'scorpio',     emoji: '🦂', name: { zh: '天蠍', en: 'Scorpio' } },
  { id: 'sagittarius', emoji: '🏹', name: { zh: '射手', en: 'Sagittarius' } },
  { id: 'capricorn',   emoji: '🐐', name: { zh: '摩羯', en: 'Capricorn' } },
  { id: 'aquarius',    emoji: '🏺', name: { zh: '水瓶', en: 'Aquarius' } },
  { id: 'pisces',      emoji: '🐟', name: { zh: '雙魚', en: 'Pisces' } },
]
