export const SHOP_CATEGORIES = [
  { id: 'food',      label: '食物', icon: '🍖' },
  { id: 'hat',       label: '帽子', icon: '🎩' },
  { id: 'clothes',   label: '衣著', icon: '👗' },
  { id: 'accessory', label: '配件', icon: '👓' },
  { id: 'toy',       label: '玩具', icon: '🎮' },
  { id: 'home',      label: '家居', icon: '🏠' },
  { id: 'rare',      label: '稀有', icon: '⭐' },
]

export const SHOP_ITEMS = [
  // ── 食物（餵食用，直接給 exp，不佔道具欄）──
  { id: 'bone',   name: '大骨頭',   emoji: '🦴', category: 'food', price: 50,  desc: 'LULU 超愛！水獺普通',         exp: { lulu: 100, hana: 50,  kotaro: 50,  jiji: 20,  kitsune: 80,  mejiro: 5   } },
  { id: 'fish',   name: '小魚乾',   emoji: '🐟', category: 'food', price: 50,  desc: '水獺超愛！',                 exp: { lulu: 50,  hana: 100, kotaro: 100, jiji: 120, kitsune: 60,  mejiro: 40  } },
  { id: 'meat',   name: '烤肉串',   emoji: '🍖', category: 'food', price: 80,  desc: '大家都愛！',                 exp: { lulu: 80,  hana: 80,  kotaro: 80,  jiji: 80,  kitsune: 90,  mejiro: 10  } },
  { id: 'apple',  name: '蘋果',     emoji: '🍎', category: 'food', price: 40,  desc: '健康零食',                   exp: { lulu: 30,  hana: 30,  kotaro: 30,  jiji: 10,  kitsune: 40,  mejiro: 60  } },
  { id: 'berry',  name: '莓果',     emoji: '🫐', category: 'food', price: 60,  desc: '北極狐超愛！繡眼鳥也喜歡',   exp: { lulu: 40,  hana: 40,  kotaro: 40,  jiji: 30,  kitsune: 100, mejiro: 80  } },
  { id: 'nectar', name: '花蜜',     emoji: '🌺', category: 'food', price: 70,  desc: '繡眼鳥的最愛！香甜花蜜',     exp: { lulu: 10,  hana: 20,  kotaro: 20,  jiji: 10,  kitsune: 30,  mejiro: 120 } },
  { id: 'sushi',  name: '壽司拼盤', emoji: '🍣', category: 'food', price: 120, desc: '高級美食！吉吉超愛魚料理',   exp: { lulu: 60,  hana: 90,  kotaro: 90,  jiji: 150, kitsune: 70,  mejiro: 50  } },
  { id: 'cake',   name: '生日蛋糕', emoji: '🎂', category: 'food', price: 100, desc: '甜甜的慶生蛋糕，大家都開心', exp: { lulu: 70,  hana: 70,  kotaro: 70,  jiji: 70,  kitsune: 70,  mejiro: 70  } },
  { id: 'shrimp', name: '大明蝦',   emoji: '🦐', category: 'food', price: 90,  desc: '水獺跟水獺最喜歡了！',       exp: { lulu: 20,  hana: 130, kotaro: 130, jiji: 40,  kitsune: 30,  mejiro: 20  } },
  { id: 'stardust_candy', name: '星星糖', emoji: '🍬', category: 'food', price: 110, desc: '會在嘴裡閃一下的甜甜糖果，小星的最愛！', exp: { lulu: 30, hana: 35, kotaro: 35, jiji: 25, kitsune: 45, mejiro: 70 } },
  { id: 'moon_mochi',     name: '月光麻糬', emoji: '🍡', category: 'food', price: 110, desc: '像月亮一樣圓潤軟Q的麻糬，小月的最愛！', exp: { lulu: 30, hana: 35, kotaro: 35, jiji: 25, kitsune: 45, mejiro: 65 } },
  { id: 'reunion_candy',  name: '團圓糖', emoji: '🍭', category: 'food', price: 120, desc: '圓圓一顆、暖暖甜甜的團圓糖，小冥的最愛！大家一起吃更甜～', exp: { lulu: 35, hana: 35, kotaro: 35, jiji: 25, kitsune: 45, mejiro: 65 } },
  { id: 'wisdom_cookie',  name: '智慧餅乾', emoji: '🍪', category: 'food', price: 120, desc: '烤成問號形狀的酥脆餅乾，小Q的最愛！吃一口，靈光一閃「尤里卡！」', exp: { lulu: 40, hana: 35, kotaro: 35, jiji: 60, kitsune: 40, mejiro: 45 } },
  { id: 'stamp_gummy',    name: '郵票軟糖', emoji: '💌', category: 'food', price: 120, desc: '做成小郵票形狀、包裝像迷你信封的軟糖，飛飛的最愛！每一顆都是不同國家的口味～', exp: { lulu: 35, hana: 35, kotaro: 35, jiji: 25, kitsune: 40, mejiro: 70 } },
  { id: 'pineapple_cake', name: '鳳梨酥',   emoji: '🍍', category: 'food', price: 120, desc: '金黃酥香的台灣經典伴手禮，小虎的最愛！咬一口，就想起環島十二站的家鄉味～', exp: { lulu: 70, hana: 40, kotaro: 40, jiji: 30, kitsune: 45, mejiro: 55 } },
  // ── 帽子 ──
  { id: 'bow',        name: '蝴蝶結',   emoji: '🎀', category: 'hat',  price: 100, desc: '可愛滿分' },
  { id: 'cap',        name: '棒球帽',   emoji: '🧢', category: 'hat',  price: 120, desc: '運動風' },
  { id: 'crown',      name: '皇冠',     emoji: '👑', category: 'hat',  price: 300, desc: '王者之選' },
  { id: 'flower',     name: '花圈',     emoji: '🌸', category: 'hat',  price: 150, desc: '春天氣息' },
  { id: 'wizard_hat', name: '魔法帽',   emoji: '🎩', category: 'hat',  price: 220, desc: '神秘魔法師' },
  { id: 'santa_hat',  name: '聖誕帽',   emoji: '🎅', category: 'hat',  price: 180, desc: '節慶歡樂' },
  { id: 'helmet',     name: '太空頭盔', emoji: '🪖', category: 'hat',  price: 250, desc: '探索宇宙！' },
  // ── 衣著 ──
  { id: 'sweater',   name: '毛衣',       emoji: '🧶', category: 'clothes', price: 150, desc: '柔軟暖心' },
  { id: 'apron',     name: '廚師圍裙',   emoji: '🍳', category: 'clothes', price: 120, desc: '小廚師登場' },
  { id: 'hoodie',    name: '帽T',        emoji: '🫧', category: 'clothes', price: 180, desc: '酷帥休閒風' },
  { id: 'dress',     name: '小洋裝',     emoji: '👗', category: 'clothes', price: 200, desc: '超美麗！' },
  { id: 'kimono',    name: '和服',       emoji: '👘', category: 'clothes', price: 280, desc: '日式典雅' },
  { id: 'astronaut', name: '太空裝',     emoji: '🧑‍🚀', category: 'clothes', price: 350, desc: '準備出發去宇宙！' },
  { id: 'raincoat',  name: '彩色雨衣',   emoji: '🌂', category: 'clothes', price: 160, desc: '雨天也開心' },
  // ── 配件 ──
  { id: 'glasses',   name: '眼鏡',     emoji: '👓', category: 'accessory', price: 100, desc: '知識感滿滿' },
  { id: 'scarf',     name: '圍巾',     emoji: '🧣', category: 'accessory', price: 80,  desc: '暖暖的' },
  { id: 'backpack',  name: '小背包',   emoji: '🎒', category: 'accessory', price: 120, desc: '探險必備' },
  { id: 'necklace',  name: '珍珠項鍊', emoji: '💎', category: 'accessory', price: 150, desc: '閃亮亮！' },
  { id: 'medal',     name: '金牌',     emoji: '🥇', category: 'accessory', price: 200, desc: '數學冠軍！' },
  { id: 'wings',     name: '天使翅膀', emoji: '🪽', category: 'accessory', price: 280, desc: '天上飛的感覺～' },
  { id: 'magic_wand',name: '魔法棒',   emoji: '🪄', category: 'accessory', price: 240, desc: '揮一揮變魔法！' },
  { id: 'sunglasses',name: '墨鏡',     emoji: '🕶️', category: 'accessory', price: 160, desc: '酷到爆！' },
  // ── 玩具 ──
  { id: 'ball',     name: '網球',     emoji: '🎾', category: 'toy', price: 80,  desc: 'LULU 愛追' },
  { id: 'teddy',    name: '玩偶',     emoji: '🧸', category: 'toy', price: 120, desc: '軟綿綿' },
  { id: 'balloon',  name: '彩色氣球', emoji: '🎈', category: 'toy', price: 60,  desc: '繽紛可愛' },
  { id: 'star',     name: '閃亮星星', emoji: '⭐',  category: 'toy', price: 200, desc: '閃閃發光' },
  { id: 'rocket',   name: '玩具火箭', emoji: '🚀', category: 'toy', price: 300, desc: '3、2、1 發射！' },
  { id: 'drum',     name: '小鼓',     emoji: '🥁', category: 'toy', price: 180, desc: '咚咚咚！熱鬧！' },
  { id: 'frisbee',  name: '飛盤',     emoji: '🥏', category: 'toy', price: 100, desc: 'LULU 最愛接飛盤' },
  { id: 'yo_yo',    name: '溜溜球',   emoji: '🪀', category: 'toy', price: 150, desc: '上上下下超好玩' },
  // ── 家居裝飾 ──
  { id: 'sofa',         name: '粉紅沙發',  emoji: '🛋️', category: 'home', price: 150, desc: '舒適柔軟' },
  { id: 'plant',        name: '盆栽',      emoji: '🪴', category: 'home', price: 80,  desc: '生機勃勃' },
  { id: 'tent',         name: '小帳篷',    emoji: '⛺', category: 'home', price: 200, desc: '寵物秘密基地' },
  { id: 'pet_bed',      name: '寵物床',    emoji: '🛏️', category: 'home', price: 120, desc: '香甜好夢' },
  { id: 'painting',     name: '掛畫',      emoji: '🖼️', category: 'home', price: 100, desc: '藝術感十足' },
  { id: 'rainbow',      name: '彩虹窗',    emoji: '🌈', category: 'home', price: 90,  desc: '光線美麗' },
  { id: 'disco',        name: '旋轉燈',    emoji: '🪩', category: 'home', price: 180, desc: '派對時間！' },
  { id: 'fish_tank',    name: '小魚缸',    emoji: '🐠', category: 'home', price: 160, desc: '水獺最愛盯著看' },
  { id: 'pool',         name: '大水池',    emoji: '🌊', category: 'home', price: 280, desc: '水獺最愛！LULU有點怕…' },
  { id: 'mushroom_lamp',name: '蘑菇燈',    emoji: '🍄', category: 'home', price: 120, desc: '夜晚森林的魔法小燈' },
  { id: 'bamboo',       name: '竹林角落',  emoji: '🎋', category: 'home', price: 90,  desc: '清新自然、超療癒' },
  { id: 'bird_perch',   name: '棲木架',    emoji: '🪵', category: 'home', price: 110, desc: '繡眼鳥最愛停的地方' },
  { id: 'fairy_light',  name: '星光燈串',  emoji: '✨', category: 'home', price: 150, desc: '夢幻閃爍、超浪漫' },
  { id: 'snow_globe',   name: '雪景水晶球', emoji: '🔮', category: 'home', price: 180, desc: 'Yuki 的最愛' },
  { id: 'igloo',        name: '冰屋',       emoji: '🛖', category: 'home', price: 220, desc: 'Yuki 的秘密冬日基地' },
  { id: 'castle',       name: '迷你城堡',   emoji: '🏰', category: 'home', price: 500, desc: '夢幻公主城堡！超豪華' },
  { id: 'hot_spring',   name: '溫泉池',     emoji: '♨️', category: 'home', price: 350, desc: '泡湯放鬆，水獺超愛' },
  { id: 'piano',        name: '鋼琴',       emoji: '🎹', category: 'home', price: 320, desc: '優雅的音樂角落' },
  { id: 'fireplace',    name: '壁爐',       emoji: '🔥', category: 'home', price: 240, desc: '冬天超溫暖，吉吉愛趴著' },
  { id: 'telescope',    name: '天文望遠鏡', emoji: '🔭', category: 'home', price: 280, desc: '看看星星！繡眼鳥最愛' },
  { id: 'art_studio',   name: '畫板架',     emoji: '🎨', category: 'home', price: 190, desc: '小藝術家的創作角' },
  { id: 'library',      name: '小書架',     emoji: '📚', category: 'home', price: 260, desc: '充滿智慧的角落' },
  { id: 'trampoline',   name: '彈跳床',     emoji: '🎪', category: 'home', price: 380, desc: 'LULU 跳跳停不下來！' },
  { id: 'star_swing',   name: '星願鞦韆',   emoji: '🌠', category: 'home', price: 240, desc: '掛在星空下的鞦韆，小星最愛盪上去，盪得越高離星星越近～' },
  { id: 'moon_hammock', name: '月光吊床',   emoji: '🌛', category: 'home', price: 240, desc: '月牙形的柔軟吊床，小月窩進去輕輕搖，像被月光抱著入睡。' },
  { id: 'reunion_lamp', name: '團圓星燈',   emoji: '💗', category: 'home', price: 260, desc: '心形的暖暖星燈，小冥最愛窩在旁邊；燈一亮，大家就會湊過來擠成一團，誰都不孤單。' },
  { id: 'puzzle_board', name: '解謎小黑板', emoji: '🖍️', category: 'home', price: 260, desc: '掛在牆上的迷你黑板，畫滿數列跟問號。小Q最愛站在前面出題考大家，聰明的孩子們都搶著來解！' },
  { id: 'world_route_map', name: '環遊世界航線圖', emoji: '🗺️', category: 'home', price: 280, desc: '掛在牆上的大航線圖，十二枚郵票沿著航線一路貼回台灣。飛飛最愛停在前面，跟大家講每一站的故事～' },
  { id: 'taiwan_puzzle_wall', name: '台灣地圖拼圖牆', emoji: '🧩', category: 'home', price: 280, desc: '掛在牆上的十二片台灣拼圖，每一片都貼著那一站的名產小貼紙。小虎最愛站在前面，一站一站介紹家鄉的美～' },
  // ── 主題壁紙（整個房間換裝，一次只能貼一款；擺放後生效） ──
  { id: 'theme_forest', name: '森林小屋壁紙', emoji: '🌲', category: 'home', price: 600,  desc: '整個家變成森林小屋！LULU、雪狐、河狸、倉鼠都覺得像回到大自然' },
  { id: 'theme_ocean',  name: '海底世界壁紙', emoji: '🐚', category: 'home', price: 800,  desc: '整個家潛進海底！水獺、海豹、企鵝樂翻天，泡泡咕嚕咕嚕' },
  { id: 'theme_space',  name: '太空艙壁紙',   emoji: '🚀', category: 'home', price: 1000, desc: '整個家飛上太空！小星、小月、小冥、小Q的星際基地' },
  // ── 稀有（Boss 獎勵，不可購買） ──
  { id: 'golden_finger',  name: '金手指',  emoji: '🤞', category: 'rare', price: 0, desc: '湊10特訓三連勝！神速心算達人的象徵', boss: true },
  { id: 'double_v',       name: '雙指勝利', emoji: '✌️', category: 'rare', price: 0, desc: '湊20特訓三連勝！進位心算高手的象徵',  boss: true },
  { id: 'century_crown',  name: '百分皇冠', emoji: '💯', category: 'rare', price: 0, desc: '湊100特訓三連勝！湊百心算大師的象徵',  boss: true },
  { id: 'equation_scale', name: '等號天秤', emoji: '⚖️', category: 'rare', price: 0, desc: '等號搬家三連勝！乘除互換邏輯大師',    boss: true },
  { id: 'reading_glasses',name: '智慧眼鏡', emoji: '🤓', category: 'rare', price: 0, desc: '兩步應用題三連勝！讀題理解小天才',    boss: true },
  { id: 'abacus_master', name: '算盤大師', emoji: '🧮', category: 'rare', price: 0, desc: '九九大作戰三連勝！乘除法天才的象徵',  boss: true },
  { id: 'boss_medal1', name: '勇者勳章',   emoji: '🎖️', category: 'rare', price: 0, desc: '打倒第一章Boss', boss: true },
  { id: 'boss_medal2', name: '三位數之印', emoji: '🏅', category: 'rare', price: 0, desc: '打倒第二章Boss', boss: true },
  { id: 'boss_medal3', name: '乘法魔法戒', emoji: '💍', category: 'rare', price: 0, desc: '打倒第三章Boss', boss: true },
  { id: 'boss_medal4', name: '傳說盾牌',   emoji: '🛡️', category: 'rare', price: 0, desc: '打倒終章Boss',   boss: true },
  { id: 'exam_trophy', name: '狀元獎盃',   emoji: '🏆', category: 'rare', price: 0, desc: '期末考大魔王首次過關獎勵', boss: true },
  { id: 'crown_math',    name: '數學皇冠', emoji: '📐', category: 'rare', price: 0, desc: '數學科三次滿分獎勵', boss: true },
  { id: 'crown_social',  name: '社會皇冠', emoji: '🌏', category: 'rare', price: 0, desc: '社會科三次滿分獎勵', boss: true },
  { id: 'crown_nature',  name: '自然皇冠', emoji: '🔬', category: 'rare', price: 0, desc: '自然科三次滿分獎勵', boss: true },
  { id: 'crown_chinese', name: '國語皇冠', emoji: '🖊️', category: 'rare', price: 0, desc: '國語科三次滿分獎勵', boss: true },
  // ── 連載劇《七色星願》信物（劇情獎勵，不可購買）──
  { id: 'star_pendant', name: '星形墜子', emoji: '🌟', category: 'rare', price: 0, desc: '雨夜裡斗篷客掉下的星形墜子，刻著滿滿小星星，冰冰的卻會在手心慢慢變暖…', boss: true },
  { id: 'star_wish_stone', name: '星願石', emoji: '💫', category: 'rare', price: 0, desc: '《七色星願》終章，七色碎片重新拼成的星願石。安安沒有用它許願，而是把它變成永遠的紀念——聽說對著它輕輕說願望，小星會在夜裡眨眨眼。', boss: true },
  // ── 連載劇《星空亂了套》信物（劇情獎勵，不可購買）──
  { id: 'moonlight_stone', name: '月光石', emoji: '🌕', category: 'rare', price: 0, desc: '《星空亂了套》終章，小月回家前留下的一小塊月光，凝成了溫潤的月光石。十二星座的圖案繞著它慢慢轉——夜裡放在枕邊，會做見得到月亮的夢。', boss: true },
  // ── 連載劇《太陽系大冒險》信物（劇情獎勵，不可購買）──
  { id: 'family_star_map', name: '全家福星圖', emoji: '🗺️', category: 'rare', price: 0, desc: '《太陽系大冒險》終章，小冥親手拼好的全家福星圖。上面每一顆星星，都是一路陪牠回家的人——太陽、八大行星、彗星，還有安安、小星、小月。星圖正中央，是一片小小的、暖暖發亮的心形冰原。它輕輕告訴你：是不是行星不重要，你一直都是這一家的。', boss: true },
  // ── 連載劇《邏輯偵探學院》信物（劇情獎勵，不可購買）──
  { id: 'master_license', name: '名偵探執照', emoji: '📜', category: 'rare', price: 0, desc: '《邏輯偵探學院》終章，阿基教授親手頒發的名偵探執照，十二枚級別金印在陽光下閃閃發亮。最下面一行是教授的親筆：「執照不是證明你多聰明，是提醒你——把想不通的事想通，把難過的人變笑。」旁邊還有一個小小的爪印，是副署人：名偵探貓頭鷹，小Q。', boss: true },
  // ── 連載劇《環遊世界大冒險》信物（劇情獎勵，不可購買）──
  { id: 'thanks_card_481', name: '第 481 張感謝卡', emoji: '✉️', category: 'rare', price: 0, desc: '《環遊世界大冒險》終章，謝謝牆掛滿了四十年、四百八十張感謝卡。散場後，安安在背包裡發現了第 481 張——十二站的老朋友、教授、小Q和飛飛，每個人都簽了名。上面寫著：「謝謝妳，讓謝謝找到回家的路。——全世界」', boss: true },
  // ── 連載劇《漫遊台灣大冒險》信物（劇情獎勵，不可購買）──
  { id: 'taiwan_beauty_map', name: '台灣真美地圖', emoji: '🇹🇼', category: 'rare', price: 0, desc: '《漫遊台灣大冒險》終章，小虎在分享會上那張拼滿十二片的台灣地圖。每一片拼圖旁都貼著那一站的土產小貼紙，右下角是一個小小的黑爪印簽名。教授在地圖背面寫著：「家鄉的美，從來不是因為它大——是因為，它是你的。」', boss: true },
]

// 新寵物（波波/嚕嚕/圓圓/阿丁/小麥）的食物偏好。原本食物 exp 只列了 6 隻，
// 在此補上，避免餵食得到 undefined（會讓進化經驗變 NaN）。
const NEW_PET_FOOD_EXP = {
  penguin: { bone: 20, fish: 120, meat: 60,  apple: 30,  berry: 40,  nectar: 10, sushi: 100, cake: 70, shrimp: 110, stardust_candy: 40, moon_mochi: 40, reunion_candy: 40 }, // 企鵝愛魚
  owl:     { bone: 60, fish: 90,  meat: 100, apple: 30,  berry: 50,  nectar: 15, sushi: 80,  cake: 60, shrimp: 70,  stardust_candy: 35, moon_mochi: 35, reunion_candy: 35, wisdom_cookie: 110 }, // 貓頭鷹愛肉，博學的嚕嚕也愛智慧餅乾
  seal:    { bone: 25, fish: 130, meat: 50,  apple: 30,  berry: 30,  nectar: 10, sushi: 90,  cake: 60, shrimp: 120, stardust_candy: 40, moon_mochi: 40, reunion_candy: 40 }, // 海豹愛魚蝦
  beaver:  { bone: 40, fish: 20,  meat: 20,  apple: 110, berry: 90,  nectar: 70, sushi: 30,  cake: 70, shrimp: 20,  stardust_candy: 60, moon_mochi: 55, reunion_candy: 60 }, // 河狸吃素
  hamster: { bone: 30, fish: 30,  meat: 40,  apple: 100, berry: 100, nectar: 50, sushi: 30,  cake: 90, shrimp: 30,  stardust_candy: 90, moon_mochi: 85, reunion_candy: 90 }, // 倉鼠愛果子甜食
  dino:    { bone: 20, fish: 30,  meat: 20,  apple: 110, berry: 100, nectar: 90, sushi: 30,  cake: 80, shrimp: 20,  stardust_candy: 70, moon_mochi: 65, reunion_candy: 70 }, // 小恐龍吃素愛嫩葉果子
  monkey:  { bone: 20, fish: 40,  meat: 40,  apple: 120, berry: 110, nectar: 80, sushi: 40,  cake: 90, shrimp: 30,  stardust_candy: 80, moon_mochi: 75, reunion_candy: 80 }, // 猴子愛水果甜食
  raccoon: { bone: 40, fish: 110, meat: 70,  apple: 60,  berry: 60,  nectar: 30, sushi: 100, cake: 70, shrimp: 90,  stardust_candy: 55, moon_mochi: 55, reunion_candy: 55 }, // 浣熊雜食愛魚
  twinkle: { bone: 20, fish: 30,  meat: 20,  apple: 60,  berry: 100, nectar: 120,sushi: 30,  cake: 110,shrimp: 20,  stardust_candy: 150,moon_mochi: 100, reunion_candy: 100 }, // 星星精靈：星星糖是專屬最愛，也愛花蜜蛋糕與團圓糖
  luna:    { bone: 20, fish: 30,  meat: 20,  apple: 50,  berry: 120, nectar: 100,sushi: 30,  cake: 110,shrimp: 20,  stardust_candy: 100,moon_mochi: 150, reunion_candy: 100 }, // 月亮精靈：月光麻糬是專屬最愛，也愛莓果蛋糕與團圓糖
  pluto:   { bone: 20, fish: 30,  meat: 20,  apple: 60,  berry: 90,  nectar: 80, sushi: 30,  cake: 110,shrimp: 20,  stardust_candy: 100,moon_mochi: 100, reunion_candy: 150 }, // 冥王星精靈：團圓糖是專屬最愛，也愛蛋糕與姊妹的星星糖月光麻糬
  xiaoq:   { bone: 30, fish: 80,  meat: 90,  apple: 40,  berry: 50,  nectar: 20, sushi: 70,  cake: 90, shrimp: 60,  stardust_candy: 60, moon_mochi: 60,  reunion_candy: 60, wisdom_cookie: 150 }, // 邏輯貓頭鷹精靈：智慧餅乾是專屬最愛，貓頭鷹本色也愛肉跟魚
  feifei:  { bone: 20, fish: 110, meat: 50,  apple: 40,  berry: 60,  nectar: 40, sushi: 90,  cake: 80, shrimp: 100, stardust_candy: 60, moon_mochi: 60,  reunion_candy: 70, wisdom_cookie: 60, stamp_gummy: 150 }, // 信天翁郵差：郵票軟糖是專屬最愛，海鳥本色也愛魚蝦壽司
  xiaohu:  { bone: 100, fish: 40, meat: 90,  apple: 40,  berry: 40,  nectar: 20, sushi: 50,  cake: 80, shrimp: 40,  stardust_candy: 55, moon_mochi: 60,  reunion_candy: 60, wisdom_cookie: 55, stamp_gummy: 50, pineapple_cake: 150 }, // 黑臘腸：鳳梨酥是專屬最愛，狗狗本色也愛大骨頭烤肉串
}
SHOP_ITEMS.forEach((item) => {
  if (item.category !== 'food') return
  Object.keys(NEW_PET_FOOD_EXP).forEach((petId) => {
    if (item.exp[petId] === undefined) item.exp[petId] = NEW_PET_FOOD_EXP[petId][item.id] ?? 50
  })
})
