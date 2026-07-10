// 長篇連續劇 第四季《安安偵探社 · 邏輯偵探學院》
// The An-An Detective Agency — Season 4: The Logic Detective Academy
//
// 天空三部曲完結後的新篇章：安安收到邏輯偵探學院的入學通知，
// 一級一級考取偵探執照——蓋滿 12 枚「級別金印」，就是名偵探安安！
// 定位＝純邏輯訓練，不綁課本：主打 ①規律與數列 ②真假判斷·條件句。
// 結構同 S1~S3（資料驅動、中英雙語、每集 8 現場、破案指認），差異：
//   每集蓋一枚「級別金印」seal（LICENSE_BOARD 拼偵探執照），集滿 12 枚畢業。
//   每集彩蛋＝邏輯／偵探小知識（比照 S3 行星知識）。
//   裏層主線：貓頭鷹小Q🦉——創辦人阿基教授 40 年前留下「最後一題」與搭檔小Q；
//   小Q 守著鐘樓等教授回來，每集留同一痕跡：灰白色的羽毛🪶＋問號卡❓。
//   貫穿紅鯡魚：🐈‍⬛巡巡教官（神出鬼沒？其實替山上的教授與學院通信）
//   ＋🐢典典管理員（守著禁區書架？其實替老同學保管解謎筆記），終章全洗白。
//
// 完整劇本見 docs/season4-劇本.md（12 集案名、答案、裏層節拍全定稿）。
// ★ 真推理鐵則（S3 EP2 起）：scene.clueNote{zh,en}＝該現場的關鍵數字（證據板）、
//   suspects[].say{zh,en}＝說詞藏數字；accuse 不爆雷，孩子自己抓矛盾。
// ★ choice 節點：每集一個，兩分支同答案。episode id 用 's4ep*' 前綴。

export const SEASON4 = {
  id: 'season4',
  title: { zh: '邏輯偵探學院', en: 'The Logic Detective Academy' },
  emoji: '🦉',
  seasonIntro: [
    { zh: '小冥回家後的某個早晨，一根灰白色的貓頭鷹羽毛夾著一封燙金的信，輕輕落在安安的窗台上：「安安同學：恭喜你偵破十二星座與太陽系連環大案。茲邀請你進入邏輯偵探學院就讀，一級一級考取偵探執照。修滿十二枚金印，即可成為——名偵探安安。——院長 福爾摩熊」',
      en: 'One morning after Little Pluto went home, a grey-white owl feather drifts onto An-An’s windowsill, holding a gold-lettered invitation: “Dear An-An: congratulations on solving the Zodiac and Solar System cases. You are invited to the Logic Detective Academy, to earn your detective license level by level. Collect all twelve golden seals and become — Great Detective An-An. — Principal Holmes Bear”' },
    { zh: '出發那天，全體寵物排排站送行：LULU 叼來偵探帽，小星、小月、小冥擠在窗邊揮手。小星當然又賴上了安安的肩膀：「助手也要上學！這次的案子在學校裡耶！」',
      en: 'On departure day the whole pet family lines up to wave goodbye: LULU fetches the detective hat while Twinkle, Luna and Little Pluto crowd the window. Twinkle, of course, claims An-An’s shoulder again: “Assistants go to school too! This time the cases are AT school!”' },
    { zh: '爬滿常春藤的古堡學院到了！大棕熊院長福爾摩熊叼著蜂蜜棒棒糖，遞給安安一張空白的執照：「這裡什麼都用邏輯說話。每破一案，我就蓋一枚金印——十二枚蓋滿，執照就會發光。」古堡的鐘樓上，好像有一雙圓圓的大眼睛，悄悄眨了一下。',
      en: 'The ivy-covered castle academy! Principal Holmes Bear, honey lollipop in mouth, hands An-An a blank license: “Here, logic does the talking. Solve a case, earn a golden seal — fill all twelve, and the license will shine.” High in the clock tower, a pair of big round eyes seems to blink, just once.' },
  ],

  episodes: [
    // ─────────────────────────────────────── S4 EP1 ───────────────────────────────────────
    {
      id: 's4ep1',
      no: 1,
      title: { zh: '入學考的密碼門', en: 'The Password Doors of the Entrance Exam' },
      emoji: '🚪',
      accent: '#7c5cd6',
      difficulty: { zh: '規律數列入門', en: 'Number patterns intro' },
      seal: { id: 'trainee', emoji: '🔍', name: { zh: '見習偵探印', en: 'Trainee Seal' } },
      intro: [
        { zh: '開學第一天就是入學考！可是通往考場要穿過好幾道密碼門——而掛在門邊的密碼牌，一夜之間全部不見了！新生們擠在第一道門外，急得團團轉。',
          en: 'Day one is the entrance exam! But the way to the exam hall passes through password doors — and overnight, every password tag has vanished! The new students crowd the first door in a panic.' },
        { zh: '福爾摩熊院長卻不慌不忙，舔了一口蜂蜜棒棒糖：「別怕。每道門的密碼都是一條有規律的數列——找出規則，就能自己推出密碼。這正好，就是本學院的第一課！」偵探始祖福爾摩斯說過：排除所有不可能，剩下的就是真相。安安戴好偵探帽——查案兼考試，開始！',
          en: 'Principal Holmes Bear just licks his honey lollipop, unbothered: “No fear. Every door’s code is a number pattern — find the rule, and you can work out the code yourself. Which happens to be this academy’s very first lesson!” As the great Sherlock Holmes said: eliminate the impossible, and what remains is the truth. Detective hat on — exam and investigation, begin!' },
      ],
      scenes: [
        {
          place: { zh: '第一道門 · 單數階梯', en: 'Door One: The Odd Staircase' },
          emoji: '🚪',
          story: { zh: '第一道門上刻著一排數字：1、3、5、7、□。門縫裡傳來喀啦喀啦的聲音，好像在說：把下一個數推出來，我就開。',
                   en: 'Door One is carved with a row of numbers: 1, 3, 5, 7, □. Something clicks behind it, as if to say: work out the next number and I shall open.' },
          clueNote: { zh: '第一道門的密碼＝9（我自己用規律推出來的）', en: 'Door One’s code = 9 (worked out from the pattern myself)' },
          puzzle: {
            text: { zh: '數列 {1}、{3}、{5}、{7}、□——[下一個數]是多少？',
                    en: 'The pattern {1}, {3}, {5}, {7}, □ — what is the [next number]?' },
            answer: 9, unit: { zh: '', en: '' },
            hint: { zh: '找規律先問：每次加多少？1→3 加 2，3→5 也加 2……', en: 'Ask first: how much is added each time? 1→3 adds 2, 3→5 adds 2 too…' },
            teach: [
              { zh: '找規律的第一招：把相鄰兩個數相減，看「每次加多少」。1→3、3→5、5→7，每次都加 2。',
                en: 'Pattern trick one: subtract neighbours to see the jump. 1→3, 3→5, 5→7 — always +2.' },
              { zh: '規則找到了：每次 +2。所以下一個數＝最後的 7 再加 2。',
                en: 'Rule found: +2 each time. So the next number is the last one, 7, plus 2.' },
              { zh: '7 ＋ 2……換你把密碼打出來！',
                en: '7 + 2… you type the code!' },
            ],
            reward: { zh: '🚪 密碼 9，喀啦——第一道門開了！小星得意地轉圈：「原來不用密碼牌也進得來嘛！」',
                      en: '🚪 Code 9 — click! Door One swings open! Twinkle spins proudly: “Who needs password tags anyway!”' },
          },
        },
        {
          place: { zh: '新生布告欄', en: 'The Freshman Notice Board' },
          emoji: '📋',
          story: { zh: '走廊的布告欄貼著新生公告，人數的地方卻被墨水暈開了，只留下一行小字：「今年新生人數＝4、8、12、16、□ 的下一個數。」',
                   en: 'The corridor notice board lists the freshmen, but the headcount is smudged. A small line remains: “This year’s freshman count = the next number in 4, 8, 12, 16, □.”' },
          clueNote: { zh: '今年新生共 20 位', en: 'This year’s freshmen: 20' },
          puzzle: {
            text: { zh: '數列 {4}、{8}、{12}、{16}、□——今年新生有[幾位]？',
                    en: 'The pattern {4}, {8}, {12}, {16}, □ — how many [freshmen] this year?' },
            answer: 20, unit: { zh: '位', en: 'students' },
            hint: { zh: '相鄰兩數一減：4→8 加 4，8→12 也加 4……每次 +4！', en: 'Subtract neighbours: 4→8 adds 4, 8→12 adds 4… +4 each time!' },
            teach: [
              { zh: '老方法：相鄰兩數相減找規則。4→8、8→12、12→16，每次都加 4。',
                en: 'Same trick: subtract neighbours. 4→8, 8→12, 12→16 — always +4.' },
              { zh: '規則是每次 +4，所以下一個數＝16 ＋ 4。',
                en: 'The rule is +4, so the next number is 16 + 4.' },
              { zh: '16 ＋ 4……換你算出新生有幾位！',
                en: '16 + 4… you find the freshman count!' },
            ],
            reward: { zh: '📋 今年新生 20 位！安安把數字抄進偵探筆記。奇怪的是——布告欄旁的座位表上，卻畫了 21 個位子？',
                      en: '📋 Twenty freshmen! An-An copies it into the case notes. Odd, though — the seating chart beside it shows 21 seats?' },
          },
        },
        {
          place: { zh: '第二道門 · 十十樂', en: 'Door Two: Perfect Tens' },
          emoji: '🚪',
          story: { zh: '第二道門的數列大方多了：10、20、30、40、□。可是門把上勾著一小撮灰白色的羽毛——這裡明明不會有鳥飛進來呀？',
                   en: 'Door Two’s pattern is generous: 10, 20, 30, 40, □. But a tuft of grey-white feather clings to the handle — no bird could fly in here… could it?' },
          clueNote: { zh: '第二道門的密碼＝50', en: 'Door Two’s code = 50' },
          puzzle: {
            text: { zh: '數列 {10}、{20}、{30}、{40}、□——[下一個數]是多少？',
                    en: 'The pattern {10}, {20}, {30}, {40}, □ — what is the [next number]?' },
            answer: 50, unit: { zh: '', en: '' },
            hint: { zh: '每次都加 10，跟數十元硬幣一樣：10、20、30、40，再來呢？', en: 'It climbs by 10, like counting coins: 10, 20, 30, 40 — then?' },
            teach: [
              { zh: '相鄰兩數一減：每次都加 10。這就是「數十」的規律，跟乘法表的 10 的倍數一樣。',
                en: 'Subtract neighbours: +10 each time. That’s skip-counting by tens — the 10 times table.' },
              { zh: '規則是每次 +10，下一個數＝40 ＋ 10。',
                en: 'Rule: +10. Next number = 40 + 10.' },
              { zh: '40 ＋ 10……換你把密碼打出來！',
                en: '40 + 10… you type the code!' },
            ],
            reward: { zh: '🚪 密碼 50，第二道門也開了！安安小心地把那撮灰白羽毛收進證物袋。摸起來……暖暖的。',
                      en: '🚪 Code 50 — Door Two opens! An-An tucks the grey-white feather into an evidence bag. It feels… warm.' },
          },
        },
        {
          kind: 'choice',
          place: { zh: '塔樓岔路口', en: 'The Tower Fork' },
          emoji: '🔀',
          story: { zh: '考場在高塔上。眼前有兩條路——一座旋轉的螺旋樓梯，和一部爬滿藤蔓的老電梯。小星興奮地問：「安安，走哪條？」',
                   en: 'The exam hall sits high in the tower. Two ways up — a winding spiral staircase, and an old elevator wrapped in vines. Twinkle bounces: “An-An, which way?”' },
          question: { zh: '★ 你來決定！要走哪條路上塔樓？（兩條路都到得了，選你喜歡的！）',
                      en: '★ You decide! Which way up the tower? (Both get there — pick your favorite!)' },
          options: [
            {
              id: 'stairs',
              label: { zh: '🌀 爬螺旋樓梯', en: '🌀 Climb the Spiral Stairs' },
              scene: {
                place: { zh: '螺旋樓梯', en: 'The Spiral Stairs' },
                emoji: '🌀',
                story: { zh: '樓梯每轉一圈就有一個平台，平台上的號碼是：5、15、25、35、□。塔樓的門要輸入下一個平台的號碼才會開。',
                         en: 'Each full turn of the stairs has a landing, numbered 5, 15, 25, 35, □. The tower door wants the next landing’s number.' },
                clueNote: { zh: '塔樓門的密碼＝45', en: 'The tower door’s code = 45' },
                puzzle: {
                  text: { zh: '平台號碼 {5}、{15}、{25}、{35}、□——[下一個平台]是幾號？',
                          en: 'Landings {5}, {15}, {25}, {35}, □ — what is the [next landing]’s number?' },
                  answer: 45, unit: { zh: '號', en: '' },
                  hint: { zh: '5→15 加 10，15→25 也加 10……每次 +10！', en: '5→15 adds 10, 15→25 adds 10… +10 each time!' },
                  teach: [
                    { zh: '相鄰兩數相減：5→15、15→25、25→35，每次都加 10。',
                      en: 'Subtract neighbours: 5→15, 15→25, 25→35 — always +10.' },
                    { zh: '規則是每次 +10，下一個平台＝35 ＋ 10。',
                      en: 'Rule: +10. Next landing = 35 + 10.' },
                    { zh: '35 ＋ 10……換你算出平台號碼！',
                      en: '35 + 10… you find the landing number!' },
                  ],
                  reward: { zh: '🌀 45 號平台到了！塔樓的門吱呀打開。爬樓梯雖然累，安安卻在扶手上又發現了一根灰白色的羽毛。',
                            en: '🌀 Landing 45! The tower door creaks open. The climb was long — but on the rail, An-An finds another grey-white feather.' },
                },
              },
            },
            {
              id: 'elevator',
              label: { zh: '🌿 搭藤蔓老電梯', en: '🌿 Ride the Vine Elevator' },
              scene: {
                place: { zh: '藤蔓老電梯', en: 'The Vine Elevator' },
                emoji: '🌿',
                story: { zh: '老電梯的按鈕是倒著數的舊式刻度：90、75、60、□。管理電梯的藤蔓沙沙地說：按對下一格，才載你上塔樓。',
                         en: 'The old elevator counts down on antique dials: 90, 75, 60, □. The vines rustle: press the next notch correctly, and up you go.' },
                clueNote: { zh: '塔樓門的密碼＝45', en: 'The tower door’s code = 45' },
                puzzle: {
                  text: { zh: '刻度 {90}、{75}、{60}、□——[下一格]是多少？',
                          en: 'Dials {90}, {75}, {60}, □ — what is the [next notch]?' },
                  answer: 45, unit: { zh: '', en: '' },
                  hint: { zh: '這條是往下走的：90→75 少了 15，75→60 也少 15……', en: 'This one goes down: 90→75 drops 15, 75→60 drops 15…' },
                  teach: [
                    { zh: '數列不一定越來越大！相鄰兩數一減：90→75、75→60，每次都「少 15」。',
                      en: 'Patterns can go down! Subtract neighbours: 90→75, 75→60 — minus 15 each time.' },
                    { zh: '規則是每次 −15，下一格＝60 − 15。',
                      en: 'Rule: −15. Next notch = 60 − 15.' },
                    { zh: '60 − 15……換你按出正確的刻度！',
                      en: '60 − 15… you press the right notch!' },
                  ],
                  reward: { zh: '🌿 刻度 45！藤蔓呼嚕嚕地把電梯捲上塔樓。電梯角落，靜靜躺著一根灰白色的羽毛。',
                            en: '🌿 Notch 45! The vines whirl the elevator up the tower. In the corner lies, quietly, a grey-white feather.' },
                },
              },
            },
          ],
        },
        {
          place: { zh: '第三道門 · 疊疊樂', en: 'Door Three: Double Stack' },
          emoji: '🚪',
          story: { zh: '塔樓裡的第三道門刻著一排漂亮的數字：11、22、33、44、□。每個數的十位和個位都長得一模一樣！',
                   en: 'Door Three inside the tower reads: 11, 22, 33, 44, □. In every number, the tens and ones digits are twins!' },
          clueNote: { zh: '第三道門的密碼＝55', en: 'Door Three’s code = 55' },
          puzzle: {
            text: { zh: '數列 {11}、{22}、{33}、{44}、□——[下一個數]是多少？',
                    en: 'The pattern {11}, {22}, {33}, {44}, □ — what is the [next number]?' },
            answer: 55, unit: { zh: '', en: '' },
            hint: { zh: '兩個看法都通：每次加 11；或是「雙胞胎數字」1122334455 排下去！', en: 'Two ways work: +11 each time — or twin-digit numbers marching on!' },
            teach: [
              { zh: '相鄰兩數相減：11→22、22→33，每次都加 11。',
                en: 'Subtract neighbours: 11→22, 22→33 — always +11.' },
              { zh: '也可以用「長相」找規律：11、22、33、44 都是雙胞胎數字，下一個雙胞胎是誰？兩種方法答案會一樣——這就是檢查的好辦法！',
                en: 'Or spot the look: 11, 22, 33, 44 are twin-digit numbers. Who’s the next twin? Two methods, same answer — a great way to double-check!' },
              { zh: '44 ＋ 11……換你把密碼打出來！',
                en: '44 + 11… you type the code!' },
            ],
            reward: { zh: '🚪 密碼 55！第三道門緩緩打開。門後的走廊安安靜靜，只有牆上的掛鐘滴答、滴答。',
                      en: '🚪 Code 55! Door Three glides open. The corridor beyond is hushed — only the wall clock ticks on.' },
          },
        },
        {
          place: { zh: '倒數走廊', en: 'The Countdown Corridor' },
          emoji: '⏳',
          story: { zh: '考場外的走廊掛著倒數計時牌，一格一格往考試時間逼近：100、90、80、□。下一格亮起來，考場的燈就會全開。',
                   en: 'The corridor to the hall counts down to exam time, panel by panel: 100, 90, 80, □. When the next panel lights, the hall lights follow.' },
          clueNote: { zh: '倒數牌的下一格＝70', en: 'The countdown’s next panel = 70' },
          puzzle: {
            text: { zh: '倒數牌 {100}、{90}、{80}、□——[下一格]是多少？',
                    en: 'The countdown {100}, {90}, {80}, □ — what is the [next panel]?' },
            answer: 70, unit: { zh: '', en: '' },
            hint: { zh: '往下走的規律：100→90 少 10，90→80 也少 10……', en: 'A falling pattern: 100→90 drops 10, 90→80 drops 10…' },
            teach: [
              { zh: '再練一次遞減數列：100→90、90→80，每次都「少 10」。',
                en: 'Falling patterns again: 100→90, 90→80 — minus 10 each time.' },
              { zh: '規則是每次 −10，下一格＝80 − 10。',
                en: 'Rule: −10. Next panel = 80 − 10.' },
              { zh: '80 − 10……換你點亮下一格！',
                en: '80 − 10… you light the next panel!' },
            ],
            reward: { zh: '⏳ 70 亮起，考場的燈唰地全開！可是……考場裡空空的，密碼牌的掛勾架就立在門邊，七個掛勾，全空了。',
                      en: '⏳ 70 lights up — and the hall blazes on! But the hall is empty… and by the door stands the tag rack: seven hooks, all bare.' },
          },
        },
        {
          place: { zh: '掛勾架與備用牌', en: 'The Rack and the Spare Tags' },
          emoji: '🪝',
          story: { zh: '掛勾架的七個掛勾都空了，抽屜裡只剩一疊備用小牌，照編號排隊：3、6、9……信鴿咕咕說第 10 塊是最後一塊。咦——其中一個掛勾上，勾著一根小小的、褐色的刺！',
                   en: 'All seven hooks are bare. In the drawer, spare tags queue by number: 3, 6, 9… Gugu the post-pigeon says the 10th is the last. And look — snagged on one hook, a tiny brown spine!' },
          clueNote: { zh: '備用牌第 10 塊＝編號 30；掛勾架上勾著一根小小的刺', en: 'Spare tag #10 = number 30; a tiny spine snagged on the rack' },
          puzzle: {
            text: { zh: '備用牌編號 {3}、{6}、{9}……照規律排下去，[第 10 塊]是編號幾？',
                    en: 'Spare tags run {3}, {6}, {9}… following the pattern, what number is the [10th tag]?' },
            answer: 30, unit: { zh: '號', en: '' },
            hint: { zh: '每次 +3，就是 3 的乘法表！第 10 塊＝3 × 10。', en: '+3 each time — that’s the 3 times table! Tag 10 = 3 × 10.' },
            teach: [
              { zh: '這次不只找下一個，要找「第 10 個」。一個一個加太慢，先看規則：每次 +3。',
                en: 'This time we need the 10th, not just the next. Adding one by one is slow — the rule is +3.' },
              { zh: '每次 +3 的數列，第幾個就是 3 × 幾：第 1 塊＝3×1、第 2 塊＝3×2……找規律遇上乘法表！',
                en: 'In a +3 pattern, the nth term is 3 × n: tag 1 = 3×1, tag 2 = 3×2… patterns meet the times table!' },
              { zh: '第 10 塊＝3 × 10……換你算出編號！',
                en: 'Tag 10 = 3 × 10… you find the number!' },
            ],
            reward: { zh: '🪝 編號 30，一塊不差！安安把那根小刺夾進證物袋。刺的主人，昨晚一定來過這裡……',
                      en: '🪝 Number 30 — exactly right! An-An bags the tiny spine. Whoever it belongs to was here last night…' },
          },
        },
        {
          place: { zh: '最後的大門', en: 'The Final Door' },
          emoji: '🎓',
          story: { zh: '考場最深處還有一道最後的大門，刻著：2、5、8、11、□。推開它，入學考才算正式開始。安安深吸一口氣——這個密碼，全學院只有推得出規律的人才知道。',
                   en: 'Deepest in the hall stands the final door: 2, 5, 8, 11, □. Beyond it, the exam truly begins. An-An breathes deep — only someone who can crack the pattern could know this code.' },
          clueNote: { zh: '大門密碼＝14（牌不見了一整晚——只有「拿到牌的人」才可能知道這個數）', en: 'The final code = 14 (tags were gone all night — only someone who took them could know it)' },
          puzzle: {
            text: { zh: '數列 {2}、{5}、{8}、{11}、□——[大門的密碼]是多少？',
                    en: 'The pattern {2}, {5}, {8}, {11}, □ — what is the [final code]?' },
            answer: 14, unit: { zh: '', en: '' },
            hint: { zh: '2→5 加 3，5→8 也加 3……每次 +3，最後一個是 11。', en: '2→5 adds 3, 5→8 adds 3… +3 each time, and the last is 11.' },
            teach: [
              { zh: '最後複習一次：相鄰兩數相減。2→5、5→8、8→11，每次都加 3。',
                en: 'One last review: subtract neighbours. 2→5, 5→8, 8→11 — always +3.' },
              { zh: '規則是每次 +3，密碼＝11 ＋ 3。',
                en: 'Rule: +3. The code = 11 + 3.' },
              { zh: '11 ＋ 3……換你推開最後的大門！',
                en: '11 + 3… you open the final door!' },
            ],
            reward: { zh: '🎓 密碼 14！大門緩緩打開——窗邊的桌上，七塊失蹤的密碼牌疊得整整齊齊，旁邊還有半杯冒著煙的熱可可。安安合上偵探筆記：「證據到齊了。該去會一會嫌疑人了——這次，讓數字說話。」',
                      en: '🎓 Code 14! The door swings wide — and on the window desk sit all seven missing tags in a neat stack, beside a half-cup of steaming cocoa. An-An snaps the notebook shut: “Evidence complete. Time to meet the suspects — and let the numbers talk.”' },
          },
        },
      ],
      suspects: [
        {
          id: 'jiji', name: { zh: '刺蝟新生棘棘', en: 'Bristle the Hedgehog Freshman' }, emoji: '🦔',
          say: { zh: '「我、我昨天傍晚就回宿舍了！密碼牌長什麼樣子我都沒看過……我只知道最後那道大門的密碼是 14，因為、因為那是我猜的！」',
                 en: '“I—I went back to the dorm at dusk! I’ve never even SEEN the password tags… I only know the final door’s code is 14, because—because I guessed it!”' },
        },
        {
          id: 'xunxun', name: { zh: '巡巡教官', en: 'Officer Prowl' }, emoji: '🐈‍⬛',
          say: { zh: '「哼。我半夜巡了三圈，布告欄前停了一下——今年新生 20 位，一位都不能少考。其他的，不必多問。」',
                 en: '“Hmph. I patrolled three rounds last night and paused at the notice board — twenty freshmen this year, and not one shall miss the exam. Ask nothing further.”' },
        },
        {
          id: 'gugu', name: { zh: '信鴿管理員咕咕', en: 'Gugu the Post-Pigeon' }, emoji: '🕊️',
          say: { zh: '「我昨天傍晚把 7 塊密碼牌掛上 7 個掛勾，抽屜的備用牌也點過，第 10 塊編號 30，一塊不差咕！然後我就回鴿舍睡了。」',
                 en: '“I hung all 7 tags on all 7 hooks at dusk, and counted the spares too — tag 10 is number 30, not one astray, coo! Then straight to the roost.”' },
        },
      ],
      culprit: 'jiji',
      accuse: { zh: '七塊密碼牌一夜之間全不見了，三位嫌疑人都說了自己昨晚做的事。翻開偵探筆記，把他們說的數字跟你一路推出來的密碼一條一條比對——牌不見了一整晚，有一個人卻說出了「沒拿到牌的人不可能知道」的數字……是誰？',
                en: 'Seven tags vanished overnight, and all three suspects have told their stories. Open your case notes and check every number they said against the codes YOU worked out — the tags were gone all night, yet someone quoted a number that no one WITHOUT the tags could know… who?' },
      wrongAccuse: { zh: '這位說的數字跟你的偵探筆記都對得上喔（新生 20 位、備用牌第 10 塊編號 30，你都親自算過是真的）。再聽一次三個人的話——大門密碼 14 是你自己用規律推出來的；牌不見了一整晚，還有誰能說得出這個數字呢？🦔',
                     en: 'This suspect’s numbers all match your notes (20 freshmen and spare tag #30 — you verified both yourself). Listen again — YOU worked out the final code 14 from the pattern; with the tags gone all night, who else could possibly say that number? 🦔' },
      solve: [
        { zh: '拿走密碼牌的，是刺蝟新生棘棘！🦔 牠說「連密碼牌都沒看過」，卻說得出大門密碼是 14——牌不見了一整晚，只有把牌拿在手裡的人才會知道這個數字。掛勾架上那根小小的刺，也悄悄說出了主人的名字。',
          en: 'The tag-taker was Bristle the hedgehog freshman! 🦔 He claimed he’d “never seen the tags,” yet quoted the final code 14 — with the tags gone all night, only the one holding them could know it. And the tiny spine on the rack quietly named its owner.' },
        { zh: '棘棘來自很遠很遠的刺蝟村，是村裡第一個考偵探學院的孩子。牠太怕考不上了，前一晚溜進考場，只想「先看一眼題目長什麼樣」——拿了牌卻越想越害怕，抱著七塊牌在考場角落練了一整夜，天亮反而不敢掛回去了。',
          en: 'Bristle comes from a far, far away hedgehog village — the first child there ever to try for the academy. Terrified of failing, he slipped in the night before, meaning only to “peek at the questions” — then panicked, hugged all seven tags, practiced in a corner till dawn… and was too scared to hang them back.' },
        { zh: '福爾摩熊院長蹲下來，和棘棘一樣高：「孩子，承認錯誤需要的勇氣，比解開密碼更像偵探。」棘棘紅著眼睛，親手把七塊牌一一掛回架上。入學考重新開始——棘棘靠自己的本事考上了！大家還發現，牠找規律的速度快得驚人。安安多了第一個同學，還是個規律高手。',
          en: 'Principal Holmes Bear knelt down to Bristle’s height: “Child, owning a mistake takes more courage than cracking any code — and courage is what makes a detective.” Eyes red, Bristle hung all seven tags back himself. The exam restarted — and he passed on his own merit! Turns out he spots patterns astonishingly fast. An-An has her first classmate — a pattern whiz, no less.' },
        { zh: '頒獎時，巡巡教官悄悄把一杯新的熱可可放在棘棘桌上，什麼都沒說就走了。圖書館的典典管理員慢——吞——吞地飄過一句：「今年的新生，有意思。」而那半杯考場裡的熱可可，到底是誰泡的，誰也沒有問。',
          en: 'At the ceremony, Officer Prowl silently set a fresh cup of cocoa on Bristle’s desk and left without a word. Dean Archive the tortoise drifted by, ever so slowly: “Interesting… freshmen… this year.” And as for that half-cup of cocoa found in the hall — no one thought to ask who had brewed it.' },
      ],
      arcClue: { zh: '第一枚金印到手！可是考場最後一排有個沒有名字的「第 13 號座位」——20 位新生，21 個位子。桌上放著一份已經寫好的考卷，每題全對，卻沒有署名，只壓著一根灰白色的羽毛🪶，和一張小卡：「歡迎你。我出的題，四十年來還沒有人解開過。❓」小星歪著頭：「學院裡……住著誰呀？」',
                 en: 'The first golden seal is hers! But in the hall’s back row sits a nameless “Seat 13” — twenty freshmen, twenty-one seats. On the desk lies a finished exam paper, every answer correct, unsigned — weighted down by a grey-white feather 🪶 and a small card: “Welcome. No one has solved MY question in forty years. ❓” Twinkle tilts his head: “Who… lives in this school?”' },
      nextPreview: { zh: '下集：真假審訊室！福利社最後一個布丁不見了，三位同學各說三句話——有真有假。安安要學會偵探的新工具「數真話」：用事實一句一句對照。而第 13 號座位的主人，也在悄悄看著……',
                     en: 'Next: the True-or-False Interrogation Room! The tuck shop’s last pudding is gone, and three classmates each tell three tales — some true, some false. An-An learns a new detective tool: counting true statements against the facts. And the owner of Seat 13 is quietly watching…' },
      reward: 450,
    },
  ],
}

// 偵探執照金印板（12 級蓋滿＝名偵探執照生效），collected 由 store 的 seriesSeals 決定
export const LICENSE_BOARD = [
  { id: 'trainee',  emoji: '🔍', name: { zh: '見習偵探印', en: 'Trainee Seal' } },
  { id: 'truth',    emoji: '👁️', name: { zh: '真話之眼印', en: 'Truth-Eye Seal' } },
  { id: 'cycle',    emoji: '🔄', name: { zh: '循環之輪印', en: 'Cycle-Wheel Seal' } },
  { id: 'ear',      emoji: '👂', name: { zh: '辨真之耳印', en: 'Keen-Ear Seal' } },
  { id: 'layers',   emoji: '🔔', name: { zh: '雙層之眼印', en: 'Double-Layer Seal' } },
  { id: 'festival', emoji: '🎡', name: { zh: '同樂之心印', en: 'Merry-Heart Seal' } },
  { id: 'chain',    emoji: '🗝️', name: { zh: '連鎖之鑰印', en: 'Chain-Key Seal' } },
  { id: 'pyramid',  emoji: '🔺', name: { zh: '金字塔之頂印', en: 'Pyramid-Peak Seal' } },
  { id: 'sift',     emoji: '✂️', name: { zh: '消去之刃印', en: 'Elimination Seal' } },
  { id: 'spiral',   emoji: '🪜', name: { zh: '遞迴之梯印', en: 'Recursion Seal' } },
  { id: 'weave',    emoji: '🕸️', name: { zh: '交叉之網印', en: 'Cross-Web Seal' } },
  { id: 'master',   emoji: '🏅', name: { zh: '名偵探金印', en: 'Master Detective Seal' } },
]
