// 過場漫畫（第七季起）：每集開場與破案各一段兩格漫畫，把故事「畫」出來。
// 用法：ep.comicIntro / ep.comicSolve = [{ bg, cast, say:{zh,en} }, ...]，
// SeriesScreen 在 intro／solved 兩個階段渲染 <ComicStrip panels={…} />。
//
// 設計原則（比照 [[NatureDiagram]] 與 DecoArt）：
//   1) 背景用 id 對照的 inline SVG，找不到就退回一塊素色板，永遠不會開天窗
//   2) 角色「不重畫」——寵物直接用現成的 PetAvatar（21 隻 × 4 階段都有），
//      配角動物用 emoji 立牌，只有安安自己是這裡新畫的
//   3) 台詞中英雙語並排，跟整季其他文字一致
//   4) 純靜態：不掛常駐 JS 動畫（框進場的淡入交給 CSS）
import PetAvatar from './PetAvatar'
import { PETS } from '../data/pets'
import './ComicStrip.css'

const C = {
  ink: '#3a3026', sky: '#cfe7f7', skyDusk: '#f6cfa0', skyNight: '#2b3556',
  brick: '#b4643f', brick2: '#8e4c30', wood: '#a9793f', wood2: '#7d5528',
  green: '#6ea85a', green2: '#4f8442', water: '#7cbcd8', water2: '#5a9dc0',
  stone: '#b9b2a4', paper: '#f7f1e4', red: '#c8443a', gold: '#e8b84b',
  white: '#ffffff', dark: '#4a4133',
  // S9《羅馬與極光》：羅馬的赭石與大理石、北歐的雪與極光
  travertine: '#d9c9a8', travertine2: '#bfa87f', ochre: '#c98a4b', terracotta: '#b5613c',
  snow: '#eef4f8', snow2: '#cfdfe9', nordNight: '#141d33', seaCold: '#4a7fa8',
  auroraG: '#5ef2a8', auroraV: '#a06ee0', copper: '#6fbfa0',
}

// 每張背景 viewBox 0 0 160 90。畫的是「一眼看得出是哪裡」的剪影，不求寫實。
const BG = {
  // 大溪老街：巴洛克紅磚牌樓（階梯山牆＋渦卷＋勳章飾＋拱心石）＋紅燈籠
  oldstreet: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <path d="M0,14 Q40,4 80,12 Q120,2 160,10 L160,20 L0,20 Z" fill="#dcedf7" opacity="0.7" />
      <ellipse cx="132" cy="12" rx="10" ry="3.4" fill="#fff" opacity="0.8" />
      <ellipse cx="20" cy="9" rx="8" ry="2.6" fill="#fff" opacity="0.7" />
      <rect y="62" width="160" height="28" fill={C.stone} />
      <rect y="62" width="160" height="3" fill="#9a9282" />
      {[[6, C.brick], [44, C.brick2], [82, C.brick], [120, C.brick2]].map(([x, brick]) => (
        <g key={x}>
          {/* 山牆：兩側階梯肩＋渦卷耳＋中央拱頂勳章飾 */}
          <rect x={x + 1} y="14" width="6" height="6" fill={C.paper} stroke={C.wood2} strokeWidth="0.5" />
          <rect x={x + 27} y="14" width="6" height="6" fill={C.paper} stroke={C.wood2} strokeWidth="0.5" />
          <circle cx={x + 4} cy="13" r="1.6" fill={C.gold} />
          <circle cx={x + 30} cy="13" r="1.6" fill={C.gold} />
          <circle cx={x + 8.5} cy="15" r="2.4" fill={C.paper} stroke={C.wood2} strokeWidth="0.5" />
          <circle cx={x + 25.5} cy="15" r="2.4" fill={C.paper} stroke={C.wood2} strokeWidth="0.5" />
          <path d={`M${x + 8},15 Q${x + 17},2 ${x + 26},15 Z`} fill={C.paper} stroke={C.wood2} strokeWidth="0.6" />
          <circle cx={x + 17} cy="9.5" r="3" fill={brick} stroke={C.gold} strokeWidth="0.9" />
          <path d={`M${x + 17},7.2 v4.6 M${x + 14.7},9.5 h4.6`} stroke={C.gold} strokeWidth="0.7" />
          <rect x={x} y="18" width="34" height="2" fill={C.wood2} />
          {/* 牌樓本體＋壁柱 */}
          <rect x={x} y="20" width="34" height="46" fill={brick} />
          <rect x={x + 1.5} y="20" width="3" height="46" fill={C.brick2} opacity="0.55" />
          <rect x={x + 29.5} y="20" width="3" height="46" fill={C.brick2} opacity="0.55" />
          <rect x={x} y="34" width="34" height="1.4" fill={C.wood2} opacity="0.7" />
          {/* 拱窗＋拱心石 */}
          <path d={`M${x + 6},33 v-8 q0,-6 6,-6 q6,0 6,6 v8 Z`} fill={C.paper} opacity="0.9" />
          <path d={`M${x + 19},33 v-8 q0,-6 6,-6 q6,0 6,6 v8 Z`} fill={C.paper} opacity="0.9" />
          <rect x={x + 10.8} y="18.4" width="2.4" height="3.2" fill={C.gold} />
          <rect x={x + 23.8} y="18.4" width="2.4" height="3.2" fill={C.gold} />
          <rect x={x + 10} y="52" width="14" height="14" fill={C.wood2} />
          <rect x={x + 12} y="54" width="4" height="6" fill={C.paper} opacity="0.6" />
          <rect x={x + 18} y="54" width="4" height="6" fill={C.paper} opacity="0.6" />
        </g>
      ))}
      {[24, 62, 100, 138].map((x) => (
        <g key={x}><line x1={x} y1="16" x2={x} y2="22" stroke={C.dark} strokeWidth="1" />
          <ellipse cx={x} cy="28" rx="5" ry="6.5" fill={C.red} />
          <rect x={x - 4.5} y="24.6" width="9" height="1.3" fill={C.gold} />
          <rect x={x - 4.5} y="31.2" width="9" height="1.3" fill={C.gold} />
          <line x1={x} y1="34.5" x2={x} y2="37" stroke={C.gold} strokeWidth="0.8" /></g>
      ))}
    </g>
  ),
  // 大漢溪河階：一階一階的台地＋河水
  river: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <ellipse cx="132" cy="14" rx="9" ry="9" fill="#fff4d2" opacity="0.9" />
      <ellipse cx="26" cy="12" rx="11" ry="3.4" fill="#fff" opacity="0.75" />
      <ellipse cx="46" cy="16" rx="7" ry="2.4" fill="#fff" opacity="0.6" />
      <path d="M0,34 L160,28 L160,44 L0,50 Z" fill={C.green2} />
      <path d="M0,50 L160,44 L160,58 L0,64 Z" fill={C.green} />
      <path d="M0,64 L160,58 L160,90 L0,90 Z" fill={C.water} />
      <path d="M0,64 L160,58 L160,66 L0,72 Z" fill={C.water2} opacity="0.5" />
      <path d="M12,72 q10,-4 20,0 M60,78 q10,-4 20,0 M110,70 q10,-4 20,0 M30,84 q10,-4 20,0 M140,80 q9,-3 18,0" stroke={C.water2} strokeWidth="2" fill="none" />
      <ellipse cx="118" cy="80" rx="10" ry="3" fill="#fff" opacity="0.4" />
      <rect x="18" y="38" width="26" height="8" fill="#d9c774" />
      <path d="M18,38 h26 v2.6 h-26 Z" fill="#e9dd9c" opacity="0.8" />
      <rect x="96" y="32" width="30" height="8" fill="#d9c774" />
      <path d="M96,32 h30 v2.6 h-30 Z" fill="#e9dd9c" opacity="0.8" />
      {/* 白鷺鷥剪影，飛過河面 */}
      <path d="M50,20 q4,-5 8,-1 q-3,-1 -4,2 q3,-1 5,1 q-5,1 -9,-2 Z" fill={C.white} opacity="0.9" />
      <path d="M100,44 q3,-4 6,-1 q-2,-1 -3,1.5 q2,-1 4,0.5 q-4,1 -7,-1 Z" fill={C.white} opacity="0.85" />
    </g>
  ),
  // 月眉溼地：蘆葦＋水鳥
  wetland: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <ellipse cx="30" cy="14" rx="12" ry="3.6" fill="#fff" opacity="0.7" />
      <ellipse cx="128" cy="10" rx="9" ry="3" fill="#fff" opacity="0.6" />
      <rect y="52" width="160" height="38" fill={C.water} />
      <path d="M0,58 q20,4 40,0 t40,0 t40,0 t40,0" stroke={C.water2} strokeWidth="1.6" fill="none" opacity="0.6" />
      <path d="M0,72 q20,4 40,0 t40,0 t40,0 t40,0" stroke={C.water2} strokeWidth="1.6" fill="none" opacity="0.5" />
      <path d="M0,52 h160 v6 h-160 Z" fill={C.green2} />
      {[10, 20, 26, 36, 118, 128, 134, 144, 150].map((x, i) => (
        <g key={x}>
          <path d={`M${x},52 q${(i % 2 ? 2 : -2)},-14 0,-26`} stroke={C.green2} strokeWidth="1.6" fill="none" />
          <ellipse cx={x} cy="24" rx="2.5" ry="6" fill="#c9a24a" transform={`rotate(${i % 2 ? 6 : -6} ${x} 24)`} />
        </g>
      ))}
      {/* 蜻蜓 */}
      <g>
        <ellipse cx="86" cy="34" rx="5" ry="1" fill={C.dark} opacity="0.7" />
        <circle cx="90" cy="34" r="1.3" fill={C.dark} />
        <ellipse cx="84" cy="31" rx="4" ry="1.6" fill="#bfe6f2" opacity="0.7" transform="rotate(-20 84 31)" />
        <ellipse cx="84" cy="37" rx="4" ry="1.6" fill="#bfe6f2" opacity="0.7" transform="rotate(20 84 37)" />
      </g>
      <path d="M58,60 q6,-6 12,0 q-6,3 -12,0 Z" fill={C.white} />
      <path d="M58,60 q6,-6 12,0" stroke="#dfeaf0" strokeWidth="0.8" fill="none" />
      <path d="M86,66 q6,-6 12,0 q-6,3 -12,0 Z" fill={C.white} />
      <path d="M86,66 q6,-6 12,0" stroke="#dfeaf0" strokeWidth="0.8" fill="none" />
      <circle cx="68" cy="46" r="3" fill={C.white} />
      <circle cx="94" cy="52" r="2" fill={C.white} opacity="0.85" />
    </g>
  ),
  // 慈湖夜色：靜湖倒映月亮
  lakenight: (
    <g>
      <rect width="160" height="90" fill={C.skyNight} />
      <circle cx="118" cy="22" r="10" fill="#f4f0d8" />
      <circle cx="121" cy="19" r="1.6" fill="#d8d2b0" opacity="0.6" />
      <circle cx="115" cy="25" r="1" fill="#d8d2b0" opacity="0.5" />
      <circle cx="118" cy="22" r="14" fill="#f4f0d8" opacity="0.12" />
      {[[20, 14], [46, 26], [70, 12], [96, 30], [142, 44], [30, 40], [60, 8], [150, 20], [10, 30], [86, 16]].map(([x, y], i) => (
        <circle key={x} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill={C.white} opacity={0.5 + (i % 4) * 0.13} />
      ))}
      {/* 蝙蝠剪影飛過夜空 */}
      <path d="M40,18 q3,-3 5,0 q2,-3 5,0 q-2,2 -5,1 q-3,1 -5,-1 Z" fill="#1c2540" opacity="0.8" />
      <path d="M132,34 q2,-2.4 4,0 q1.6,-2.4 4,0 q-1.6,1.6 -4,0.8 q-2.4,0.8 -4,-0.8 Z" fill="#1c2540" opacity="0.7" />
      <path d="M0,52 L34,32 L60,52 L92,28 L128,52 L160,38 L160,56 L0,56 Z" fill="#3b4a4a" />
      <rect y="56" width="160" height="34" fill="#20344a" />
      <path d="M0,58 q20,3 40,0 t40,0 t40,0 t40,0" stroke="#2c4256" strokeWidth="1.4" fill="none" opacity="0.6" />
      <ellipse cx="118" cy="70" rx="9" ry="4" fill="#f4f0d8" opacity="0.5" />
      <ellipse cx="118" cy="78" rx="6" ry="2.4" fill="#f4f0d8" opacity="0.25" />
      {/* 螢火蟲 */}
      {[[18, 66], [40, 76], [148, 68]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.1" fill="#d7f27a" opacity="0.85" />
      ))}
    </g>
  ),
  // 木藝工坊：神桌＋工具牆
  woodshop: (
    <g>
      <rect width="160" height="90" fill="#e6d6bd" />
      {/* 從窗戶灑進來的光束，增加空間感 */}
      <path d="M100,0 L140,0 L120,90 L70,90 Z" fill="#fff6de" opacity="0.28" />
      <rect y="66" width="160" height="24" fill={C.wood} />
      <path d="M0,66 h160 v2.4 h-160 Z" fill={C.wood2} opacity="0.5" />
      {[26, 60, 94, 128].map((x) => <rect key={x} x={x} y="70" width="14" height="1.6" fill={C.wood2} opacity="0.4" />)}
      <rect x="8" y="12" width="60" height="40" fill={C.wood2} opacity="0.55" />
      {[16, 30, 44, 58].map((x, i) => (
        <g key={x}>
          <rect x={x} y="18" width="4" height="18" rx="2" fill={C.dark} />
          <circle cx={x + 2} cy="16.4" r="1.6" fill={i % 2 ? C.gold : '#c9c2b4'} />
        </g>
      ))}
      <path d="M8,52 h60" stroke={C.dark} strokeWidth="1" opacity="0.4" />
      <rect x="82" y="40" width="66" height="8" fill={C.red} />
      <rect x="82" y="40" width="66" height="2" fill="#e17a6a" opacity="0.7" />
      <rect x="86" y="48" width="6" height="18" fill={C.wood2} />
      <rect x="138" y="48" width="6" height="18" fill={C.wood2} />
      <circle cx="115" cy="34" r="7" fill={C.gold} />
      <circle cx="115" cy="34" r="7" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <path d="M108,34 q7,-9 14,0 q-7,9 -14,0 Z" fill={C.paper} />
      {/* 刨木花 */}
      <path d="M96,64 q4,-4 2,-8 q4,2 3,-4" stroke="#d9b877" strokeWidth="1.4" fill="none" opacity="0.8" />
      <path d="M108,66 q3,-3 1,-6 q3,1 2,-3" stroke="#d9b877" strokeWidth="1.2" fill="none" opacity="0.7" />
    </g>
  ),
  // 豆干工廠：大滷鍋＋蒸氣
  factory: (
    <g>
      <rect width="160" height="90" fill="#efe0cb" />
      <path d="M0,0 L160,0 L160,20 Q80,32 0,20 Z" fill="#fff3da" opacity="0.4" />
      <rect y="64" width="160" height="26" fill="#c9a97e" />
      <path d="M0,64 h160 v2.4 h-160 Z" fill="#a9885f" opacity="0.6" />
      <rect x="20" y="44" width="52" height="22" rx="4" fill={C.dark} />
      <rect x="20" y="44" width="52" height="4" rx="2" fill="#5a4a38" opacity="0.7" />
      <ellipse cx="46" cy="44" rx="26" ry="6" fill="#6b4a2a" />
      <ellipse cx="46" cy="43" rx="20" ry="3.4" fill="#8a6540" opacity="0.6" />
      {[30, 36, 46, 56, 62].map((x, i) => (
        <path key={x} d={`M${x},38 q4,-8 0,-14 q4,-3 0,-8`} stroke={C.white} strokeWidth="2.6" fill="none" opacity={0.55 - i * 0.07} strokeLinecap="round" />
      ))}
      {[92, 116, 140].map((x, i) => (
        <g key={x}>
          <rect x={x} y="48" width="18" height="4" fill={C.wood2} />
          <rect x={x + 1} y="52" width="16" height="10" rx="1" fill="#8b5a2b" />
          {[x + 4, x + 8, x + 12].map((lx) => <rect key={lx} x={lx} y="53" width="0.8" height="8" fill="#6f451f" opacity="0.5" />)}
          {i === 1 && <ellipse cx={x + 9} cy="47" rx="8" ry="1.6" fill="#fff" opacity="0.5" />}
        </g>
      ))}
      {/* 竹簍疊放，增加生活感 */}
      <ellipse cx="10" cy="76" rx="9" ry="3.4" fill="#c9a05c" />
      <ellipse cx="10" cy="72" rx="8" ry="3" fill="#d9b877" />
    </g>
  ),
  // 千塘之鄉：一口口埤塘
  ponds: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <circle cx="136" cy="16" r="8" fill="#ffe9a8" opacity="0.9" />
      <ellipse cx="28" cy="12" rx="10" ry="3" fill="#fff" opacity="0.7" />
      <rect y="40" width="160" height="50" fill={C.green} />
      {[[24, 56, 20, 9], [74, 50, 24, 10], [126, 62, 22, 9], [104, 78, 18, 7], [38, 78, 16, 6]].map(([x, y, rx, ry]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.water} />
          <ellipse cx={x} cy={y - 1.5} rx={rx * 0.6} ry={ry * 0.4} fill={C.white} opacity="0.35" />
          <ellipse cx={x + rx * 0.3} cy={y + ry * 0.3} rx={rx * 0.25} ry={ry * 0.18} fill="#fff" opacity="0.5" />
        </g>
      ))}
      <path d="M0,40 L160,40 L160,30 Q120,22 80,30 Q40,38 0,30 Z" fill={C.green2} />
      {/* 白鷺鷥站在田埂上 */}
      <g>
        <ellipse cx="60" cy="46" rx="1.6" ry="4" fill={C.dark} opacity="0.6" />
        <path d="M56,42 q4,-5 8,-1 q-3,-1 -3.5,2 q2.5,-0.8 4.5,1 q-4.5,1.4 -9,-2 Z" fill={C.white} />
      </g>
      {/* 蜻蜓 */}
      <ellipse cx="92" cy="64" rx="4" ry="0.9" fill={C.dark} opacity="0.7" />
      <circle cx="95.4" cy="64" r="1" fill={C.dark} />
    </g>
  ),
  // 石門水庫：大壩＋洩洪
  dam: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <path d="M0,30 L40,14 L74,30 Z" fill="#7a8a72" />
      <path d="M4,26 L40,16 L70,27" stroke="#95a58c" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M86,30 L124,12 L160,30 Z" fill="#7a8a72" />
      <path d="M90,27 L124,14 L156,27" stroke="#95a58c" strokeWidth="1.2" fill="none" opacity="0.6" />
      <rect y="30" width="160" height="20" fill={C.water2} />
      <ellipse cx="120" cy="36" rx="22" ry="3" fill="#fff" opacity="0.25" />
      <path d="M0,50 L160,50 L150,78 L10,78 Z" fill={C.stone} />
      <path d="M0,50 L160,50 L157,56 L3,56 Z" fill="#a49d8e" opacity="0.7" />
      {[46, 74, 102].map((x, i) => (
        <g key={x}>
          <rect x={x} y="50" width="14" height="28" fill="#8d8779" />
          <path d={`M${x + 2},60 q3,10 0,18 q3,4 0,10`} stroke={C.white} strokeWidth="3" fill="none" opacity="0.85" />
          <path d={`M${x + 6},58 q3,9 0,16`} stroke={C.white} strokeWidth="2" fill="none" opacity="0.6" />
          {i === 1 && <path d={`M${x - 6},76 q10,6 22,3 q10,-3 18,-10`} stroke="#f2d9b8" strokeWidth="2" fill="none" opacity="0.45" />}
        </g>
      ))}
      <rect y="78" width="160" height="12" fill={C.water} />
      <path d="M0,84 q20,3 40,0 t40,0 t40,0 t40,0" stroke={C.water2} strokeWidth="1.4" fill="none" opacity="0.6" />
      {/* 遠處水鳥盤旋 */}
      <path d="M20,20 q2,-2.6 4,0 q2,-2.6 4,0 q-2,1.8 -4,0.9 q-2,0.9 -4,-0.9 Z" fill={C.dark} opacity="0.55" />
    </g>
  ),
  // 廟口遶境：普濟堂＋燈籠＋鑼鼓
  temple: (
    <g>
      <rect width="160" height="90" fill={C.skyDusk} />
      <circle cx="30" cy="16" r="10" fill="#ffd98a" opacity="0.7" />
      <rect y="66" width="160" height="24" fill={C.stone} />
      <path d="M28,30 L80,14 L132,30 Z" fill={C.red} />
      <path d="M28,30 L80,14 L80,17 L32,30 Z" fill="#e17a6a" opacity="0.5" />
      <rect x="28" y="29" width="104" height="3" fill={C.gold} />
      <rect x="34" y="30" width="92" height="36" fill="#d9b98c" />
      {[42, 62, 98, 118].map((x) => <rect key={x} x={x} y="36" width="6" height="10" fill="#c9a878" opacity="0.6" />)}
      <rect x="52" y="42" width="14" height="24" fill={C.red} />
      <rect x="94" y="42" width="14" height="24" fill={C.red} />
      <rect x="72" y="38" width="16" height="28" fill={C.wood2} />
      <path d="M72,38 h16 v3 h-16 Z" fill={C.gold} opacity="0.8" />
      {/* 香爐輕煙 */}
      <path d="M80,36 q-3,-6 0,-11 q3,-4 -1,-9" stroke="#e8e2d4" strokeWidth="1.6" fill="none" opacity="0.55" strokeLinecap="round" />
      {[16, 40, 120, 144].map((x) => (
        <g key={x}><line x1={x} y1="10" x2={x} y2="18" stroke={C.dark} strokeWidth="1" />
          <ellipse cx={x} cy="24" rx="6" ry="7" fill={C.red} />
          <ellipse cx={x} cy="21" rx="4" ry="2" fill="#e17a6a" opacity="0.6" />
          <rect x={x - 6} y="22" width="12" height="2" fill={C.gold} />
          <rect x={x - 6} y="27" width="12" height="1.4" fill={C.gold} /></g>
      ))}
      {/* 煙火火花，增加遶境的熱鬧感 */}
      {[[48, 8], [104, 12], [140, 6]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="1.2" fill={C.gold} />
          <path d={`M${x - 3},${y} h6 M${x},${y - 3} v6 M${x - 2},${y - 2} l4,4 M${x - 2},${y + 2} l4,-4`} stroke={C.gold} strokeWidth="0.6" opacity="0.8" />
        </g>
      ))}
    </g>
  ),
  // 茶園花海：一畦畦茶壟＋花田
  teafield: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <circle cx="136" cy="18" r="9" fill="#ffd76b" />
      <circle cx="136" cy="18" r="13" fill="#ffd76b" opacity="0.25" />
      <ellipse cx="26" cy="14" rx="10" ry="3" fill="#fff" opacity="0.7" />
      <path d="M0,36 Q40,26 80,34 Q120,42 160,32 L160,90 L0,90 Z" fill={C.green} />
      {[46, 56, 66].map((y, i) => (
        <path key={y} d={`M0,${y} Q40,${y - 8} 80,${y - 2} Q120,${y + 4} 160,${y - 4}`}
          stroke={C.green2} strokeWidth="5" fill="none" opacity={0.9 - i * 0.1} />
      ))}
      {[[14, 78], [34, 82], [54, 76], [76, 84], [98, 78], [120, 84], [142, 78]].map(([x, y], i) => (
        <g key={x}>
          <circle cx={x} cy={y} r="4" fill={['#e86f9a', '#f2c14e', '#c98ee0'][x % 3]} />
          <circle cx={x - 1.2} cy={y - 1.2} r="1.3" fill="#fff" opacity="0.55" />
          {i % 2 === 0 && <circle cx={x + 6} cy={y - 5} r="2.6" fill={['#e86f9a', '#f2c14e', '#c98ee0'][(x + 1) % 3]} opacity="0.85" />}
        </g>
      ))}
      {/* 蝴蝶飛舞 */}
      <g transform="translate(70,58)">
        <path d="M0,0 q-4,-6 -1,-8 q3,1 1,8 Z" fill="#f2c14e" opacity="0.85" />
        <path d="M0,0 q4,-6 1,-8 q-3,1 -1,8 Z" fill="#e86f9a" opacity="0.85" />
        <line x1="0" y1="-8" x2="0" y2="0" stroke={C.dark} strokeWidth="0.6" />
      </g>
      <g transform="translate(112,68) scale(0.8)">
        <path d="M0,0 q-4,-6 -1,-8 q3,1 1,8 Z" fill="#c98ee0" opacity="0.8" />
        <path d="M0,0 q4,-6 1,-8 q-3,1 -1,8 Z" fill="#f2c14e" opacity="0.8" />
        <line x1="0" y1="-8" x2="0" y2="0" stroke={C.dark} strokeWidth="0.6" />
      </g>
    </g>
  ),
  // 輕便鐵道：窄軌＋台車
  railway: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <ellipse cx="140" cy="14" rx="9" ry="3" fill="#fff" opacity="0.7" />
      <ellipse cx="24" cy="10" rx="7" ry="2.4" fill="#fff" opacity="0.6" />
      <path d="M0,40 Q50,24 100,36 Q130,42 160,34 L160,58 L0,58 Z" fill={C.green2} />
      <path d="M0,46 Q50,32 100,42 Q130,47 160,40" stroke={C.green} strokeWidth="2" fill="none" opacity="0.6" />
      <rect y="58" width="160" height="32" fill="#c2a887" />
      <path d="M0,58 h160 v2 h-160 Z" fill="#a98a63" opacity="0.6" />
      <line x1="0" y1="70" x2="160" y2="66" stroke={C.dark} strokeWidth="2" />
      <line x1="0" y1="80" x2="160" y2="76" stroke={C.dark} strokeWidth="2" />
      {[10, 34, 58, 82, 106, 130, 152].map((x) => (
        <rect key={x} x={x} y="66" width="5" height="14" fill={C.wood2} />
      ))}
      <g>
        <rect x="56" y="46" width="34" height="14" fill={C.wood} />
        <rect x="56" y="46" width="34" height="3" fill={C.wood2} opacity="0.6" />
        <rect x="60" y="40" width="26" height="7" fill={C.wood2} />
        <circle cx="64" cy="62" r="4" fill={C.dark} />
        <circle cx="64" cy="62" r="1.4" fill="#c2a887" />
        <circle cx="84" cy="62" r="4" fill={C.dark} />
        <circle cx="84" cy="62" r="1.4" fill="#c2a887" />
        {/* 行進中的動感線 */}
        <path d="M50,50 h-8 M48,56 h-7 M52,44 h-6" stroke={C.dark} strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      </g>
    </g>
  ),
  // 八德家鄉大會：廣場舞台＋燈串＋老榕樹
  plaza: (
    <g>
      <rect width="160" height="90" fill={C.skyDusk} />
      <ellipse cx="150" cy="14" rx="8" ry="8" fill="#ffe0a0" opacity="0.8" />
      <rect y="64" width="160" height="26" fill="#d9c6a5" />
      <path d="M0,64 h160 v2.4 h-160 Z" fill="#c2ab84" opacity="0.7" />
      <rect x="46" y="40" width="70" height="24" fill={C.red} opacity="0.85" />
      <path d="M46,40 h70 v4 h-70 Z" fill="#e17a6a" opacity="0.5" />
      <rect x="44" y="36" width="74" height="6" fill={C.gold} />
      <path d="M56,64 v-20 M96,64 v-20" stroke={C.wood2} strokeWidth="2" opacity="0.6" />
      <path d="M0,20 Q40,32 80,20 Q120,8 160,20" stroke={C.dark} strokeWidth="1" fill="none" />
      {[20, 44, 68, 92, 116, 140].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={24 + (i % 2) * 4} r="3" fill={[C.gold, C.red, C.white][i % 3]} />
          <circle cx={x} cy={24 + (i % 2) * 4} r="5" fill={[C.gold, C.red, C.white][i % 3]} opacity="0.25" />
        </g>
      ))}
      {/* 煙火，呼應大會的熱鬧氣氛 */}
      {[[130, 30], [150, 46]].map(([x, y]) => (
        <g key={x}>
          {[0, 45, 90, 135].map((deg) => (
            <line key={deg} x1={x} y1={y} x2={x} y2={y - 5} stroke={C.gold} strokeWidth="0.8" opacity="0.75" transform={`rotate(${deg} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r="1" fill="#fff" />
        </g>
      ))}
      <g>
        <rect x="16" y="44" width="8" height="22" fill={C.wood2} />
        <circle cx="20" cy="38" r="14" fill={C.green2} />
        <circle cx="8" cy="44" r="8" fill={C.green} />
        <circle cx="32" cy="44" r="9" fill={C.green} />
        <circle cx="14" cy="32" r="6" fill={C.green} opacity="0.9" />
      </g>
    </g>
  ),
  // 老榕樹下：阿榕留下故事書那一頁的地方（每集破案後共用）
  banyan: (
    <g>
      <rect width="160" height="90" fill="#f3e6c9" />
      <circle cx="140" cy="16" r="9" fill="#ffe6a8" opacity="0.85" />
      <rect y="70" width="160" height="20" fill={C.green} />
      <path d="M0,70 h160 v2.2 h-160 Z" fill={C.green2} opacity="0.5" />
      <rect x="72" y="30" width="16" height="42" fill={C.wood2} />
      <rect x="72" y="30" width="4" height="42" fill={C.wood} opacity="0.5" />
      {[[80, 62, 74], [80, 58, 92]].map(([, y, x]) => (
        <path key={x} d={`M80,${y} q${(x - 80) / 1.2},6 ${x - 80},16`} stroke={C.wood2} strokeWidth="3" fill="none" />
      ))}
      <circle cx="80" cy="26" r="24" fill={C.green2} />
      <circle cx="50" cy="34" r="16" fill={C.green} />
      <circle cx="112" cy="32" r="17" fill={C.green} />
      <circle cx="80" cy="16" r="10" fill={C.green} opacity="0.85" />
      {/* 樹冠上的光斑，讓樹葉有層次而不是死板的色塊 */}
      {[[64, 20], [96, 22], [78, 34], [42, 36], [118, 30]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.4" fill="#8fd06a" opacity="0.4" />
      ))}
      {[[40, 56], [122, 60], [58, 66]].map(([x, y]) => (
        <path key={x} d={`M${x},${y} q5,-5 10,0 q-5,5 -10,0 Z`} fill="#8fd06a" />
      ))}
      {/* 灑落的光斑與飄下的落葉，呼應每集結尾「阿榕落葉浮出頁碼」 */}
      {[[30, 44], [128, 50], [92, 46], [46, 30]].map(([x, y], i) => (
        <ellipse key={x} cx={x} cy={y} rx="2.2" ry="2.2" fill="#fff6d8" opacity={0.3 + (i % 2) * 0.15} />
      ))}
      <path d="M100,44 q3,3 0,6 q3,2 0,5" stroke="#c9a24a" strokeWidth="1.6" fill="none" opacity="0.7" />
      <rect x="96" y="60" width="18" height="12" rx="2" fill={C.paper} stroke={C.wood2} strokeWidth="1.5" />
      <path d="M105,60 v12" stroke={C.wood2} strokeWidth="0.8" opacity="0.5" />
    </g>
  ),

  // ───────────── S9 第一幕 · 羅馬 ─────────────
  // 萬神殿內部：半圓頂＋藻井＋正中央的圓洞＋斜射下來的光柱與地板光圈（EP1 核心畫面）
  pantheon: (
    <g>
      <rect width="160" height="90" fill="#8a7a63" />
      <path d="M4,66 A76,60 0 0 1 156,66 Z" fill={C.travertine} />
      {[52, 40, 28].map((ry, i) => (
        <path key={ry} d={`M${80 - ry * 1.27},66 A${ry * 1.27},${ry} 0 0 1 ${80 + ry * 1.27},66`}
          fill="none" stroke={C.travertine2} strokeWidth="0.8" opacity={0.75 - i * 0.12} />
      ))}
      {[-52, -26, 0, 26, 52].map((dx) => (
        <path key={dx} d={`M${80 + dx * 1.3},66 Q${80 + dx * 0.55},22 80,14`}
          fill="none" stroke={C.travertine2} strokeWidth="0.7" opacity="0.5" />
      ))}
      <circle cx="80" cy="14" r="7.5" fill="#fffaea" />
      <circle cx="80" cy="14" r="7.5" fill="none" stroke={C.travertine2} strokeWidth="1.2" />
      <path d="M73,16 L87,16 L114,66 L94,66 Z" fill="#fff8e0" opacity="0.42" />
      <rect y="66" width="160" height="24" fill="#a2937b" />
      <path d="M0,66 h160 M0,74 h160 M0,82 h160" stroke="#8d7f69" strokeWidth="0.6" opacity="0.6" />
      <ellipse cx="104" cy="70" rx="11" ry="3.6" fill="#fff6d8" opacity="0.9" />
      <ellipse cx="104" cy="70" rx="6" ry="2" fill="#fffdf2" />
      {[18, 38, 122, 142].map((x) => (
        <rect key={x} x={x} y="46" width="7" height="20" fill={C.travertine2} opacity="0.7" />
      ))}
    </g>
  ),
  // 羅馬街景：窄石板巷、赭紅色老公寓、百葉窗、曬衣繩
  romestreet: (
    <g>
      <rect width="160" height="90" fill="#bfe0f2" />
      <rect x="0" y="8" width="52" height="62" fill={C.terracotta} />
      <rect x="108" y="4" width="52" height="66" fill={C.ochre} />
      <rect x="52" y="20" width="24" height="50" fill="#cf9a5e" />
      <rect x="84" y="24" width="24" height="46" fill="#c08050" />
      {[[10, 18], [30, 18], [10, 40], [30, 40], [118, 16], [138, 16], [118, 38], [138, 38]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="12" height="15" fill="#5c4a3a" />
          <rect x={x} y={y} width="5.5" height="15" fill="#7fa86e" />
          <rect x={x + 6.5} y={y} width="5.5" height="15" fill="#6e9760" />
        </g>
      ))}
      <path d="M42,26 Q80,34 118,26" stroke="#e8e0cf" strokeWidth="0.8" fill="none" />
      {[56, 70, 84, 98].map((x, i) => (
        <rect key={x} x={x} y={28 + (i % 2)} width="7" height="9" rx="1" fill={i % 2 ? '#f2efe6' : '#dfe9f2'} />
      ))}
      <rect y="70" width="160" height="20" fill="#9a9384" />
      {[0, 16, 32, 48, 64, 80, 96, 112, 128, 144].map((x) => (
        <g key={x}>
          <rect x={x} y="70" width="15" height="9" rx="2" fill="#a8a191" />
          <rect x={x + 8} y="80" width="15" height="9" rx="2" fill="#8f8879" />
        </g>
      ))}
    </g>
  ),
  // 圓形競技場：三層拱門的橢圓外牆，右側崩塌
  colosseum: (
    <g>
      <rect width="160" height="90" fill="#bfe0f2" />
      <ellipse cx="30" cy="14" rx="12" ry="3.6" fill="#fff" opacity="0.7" />
      <rect y="70" width="160" height="20" fill="#a89c80" />
      <path d="M14,70 L14,18 Q80,6 128,20 L128,70 Z" fill={C.travertine} />
      <path d="M128,20 L128,70 L146,70 L146,44 Z" fill={C.travertine2} opacity="0.8" />
      {[24, 40, 56].map((y, row) => (
        <g key={y}>
          {[20, 36, 52, 68, 84, 100, 114].map((x) => (
            <path key={x} d={`M${x},${y + 12} v-6 q0,-4 4,-4 q4,0 4,4 v6 Z`}
              fill={row === 2 ? '#6f6350' : '#7b6e59'} opacity={row === 0 ? 0.65 : 0.85} />
          ))}
          <rect x="14" y={y + 12} width="114" height="1.6" fill={C.travertine2} opacity="0.8" />
        </g>
      ))}
      <path d="M14,70 h132" stroke="#8d8168" strokeWidth="1.4" />
      {[[136, 62], [150, 66]].map(([x, y]) => (
        <rect key={x} x={x} y={y} width="6" height="8" fill={C.travertine2} opacity="0.7" />
      ))}
    </g>
  ),
  // 古羅馬廣場：斷柱與凱旋門的廢墟，草從石縫長出來
  forum: (
    <g>
      <rect width="160" height="90" fill="#cfe7f7" />
      <ellipse cx="128" cy="14" rx="10" ry="3" fill="#fff" opacity="0.7" />
      <rect y="66" width="160" height="24" fill="#b0a487" />
      <path d="M96,66 V30 h36 V66 Z" fill={C.travertine} />
      <path d="M104,66 V44 q10,-10 20,0 V66 Z" fill="#8a7d66" />
      <rect x="94" y="24" width="40" height="7" fill={C.travertine2} />
      {[16, 34, 52, 70].map((x, i) => (
        <g key={x}>
          <rect x={x} y={38 + i * 5} width="9" height={28 - i * 5} fill={C.travertine} />
          <rect x={x - 1.5} y={36 + i * 5} width="12" height="3" fill={C.travertine2} />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={x + 2 + k * 2.5} y1={41 + i * 5} x2={x + 2 + k * 2.5} y2="66"
              stroke={C.travertine2} strokeWidth="0.5" opacity="0.6" />
          ))}
        </g>
      ))}
      {[[8, 64], [88, 63], [140, 64], [60, 65]].map(([x, y]) => (
        <path key={x} d={`M${x},${y} q3,-6 6,0 q-3,3 -6,0 Z`} fill={C.green} opacity="0.8" />
      ))}
      {[[24, 70], [46, 74], [120, 71]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="5" ry="1.6" fill="#9d9179" />
      ))}
    </g>
  ),
  // 許願池：巴洛克噴泉立面＋水池＋池底的硬幣
  trevi: (
    <g>
      <rect width="160" height="90" fill="#cfe7f7" />
      <rect x="18" y="6" width="124" height="52" fill={C.travertine} />
      <path d="M52,6 h56 v-2 h-56 Z" fill={C.travertine2} />
      <path d="M60,58 V22 q20,-14 40,0 V58 Z" fill="#c3b291" />
      <path d="M68,58 V28 q12,-9 24,0 V58 Z" fill="#a4977c" />
      {[26, 38, 118, 130].map((x) => (
        <g key={x}>
          <rect x={x} y="18" width="8" height="40" fill="#c9b998" />
          <rect x={x - 1} y="16" width="10" height="3" fill={C.travertine2} />
        </g>
      ))}
      <rect x="18" y="4" width="124" height="4" fill={C.travertine2} />
      <rect y="58" width="160" height="32" fill={C.water} />
      <path d="M0,58 h160 v5 H0 Z" fill="#a8dcef" opacity="0.8" />
      <path d="M8,68 q10,-4 20,0 M52,74 q10,-4 20,0 M104,70 q10,-4 20,0 M130,80 q10,-4 20,0"
        stroke={C.water2} strokeWidth="1.8" fill="none" />
      {[[40, 82], [72, 85], [96, 80], [118, 86]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.2" fill={C.gold} opacity="0.9" />
      ))}
      <path d="M74,44 q6,-4 12,0 q-6,6 -12,0 Z" fill={C.white} opacity="0.6" />
    </g>
  ),
  // 梵蒂岡：聖伯多祿大殿的大圓頂與環抱的柱廊廣場、方尖碑
  vatican: (
    <g>
      <rect width="160" height="90" fill="#bfe0f2" />
      <ellipse cx="26" cy="12" rx="11" ry="3.2" fill="#fff" opacity="0.7" />
      <rect y="70" width="160" height="20" fill="#c3bba8" />
      <rect x="44" y="46" width="72" height="24" fill={C.travertine} />
      <rect x="44" y="44" width="72" height="4" fill={C.travertine2} />
      {[50, 62, 74, 86, 98, 108].map((x) => (
        <rect key={x} x={x} y="50" width="6" height="20" fill="#c9b998" />
      ))}
      <path d="M60,46 A20,22 0 0 1 100,46 Z" fill="#dcd2ba" />
      <path d="M60,46 A20,22 0 0 1 100,46" fill="none" stroke={C.travertine2} strokeWidth="1" />
      {[70, 80, 90].map((x) => (
        <path key={x} d={`M${x},46 Q${x + (80 - x) * 0.3},30 80,25`} fill="none" stroke={C.travertine2} strokeWidth="0.7" opacity="0.6" />
      ))}
      <rect x="74" y="20" width="12" height="6" rx="1" fill="#cfc4a9" />
      <path d="M80,20 v-5 M77.5,17 h5" stroke={C.gold} strokeWidth="1.4" />
      <rect x="78" y="52" width="4" height="10" fill="#8d8168" />
      {[16, 28, 132, 144].map((x) => (
        <g key={x}>
          <rect x={x} y="56" width="6" height="14" fill="#cfc7b2" />
          <rect x={x - 1} y="54" width="8" height="2.4" fill={C.travertine2} />
        </g>
      ))}
      <path d="M4,70 q76,-8 152,0" fill="none" stroke="#b0a68f" strokeWidth="1.2" />
    </g>
  ),

  // ───────────── S9 第二幕 · 芬蘭 ─────────────
  // 赫爾辛基：白色大教堂＋綠圓頂＋長階梯＋港邊的海
  helsinki: (
    <g>
      <rect width="160" height="90" fill="#c6dced" />
      <ellipse cx="34" cy="12" rx="12" ry="3.4" fill="#fff" opacity="0.75" />
      <rect y="72" width="160" height="18" fill={C.seaCold} />
      <path d="M0,76 q16,-3 32,0 t32,0 t32,0 t32,0" stroke="#3f6f95" strokeWidth="1.2" fill="none" opacity="0.6" />
      <rect x="40" y="42" width="80" height="30" fill="#f4f2ec" />
      <rect x="40" y="40" width="80" height="3.6" fill="#e2ded2" />
      {[46, 58, 70, 82, 94, 108].map((x) => (
        <rect key={x} x={x} y="46" width="6" height="26" fill="#e8e5db" />
      ))}
      <path d="M52,40 L80,26 L108,40 Z" fill="#f7f5ef" />
      <path d="M64,26 A16,17 0 0 1 96,26 Z" fill={C.copper} />
      <rect x="76" y="8" width="8" height="5" rx="1" fill={C.copper} />
      <path d="M80,8 v-4 M78,6 h4" stroke={C.gold} strokeWidth="1.2" />
      {[[46, 30], [114, 30]].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x},${y + 10} A8,9 0 0 1 ${x + 16},${y + 10} Z`} fill={C.copper} opacity="0.9" />
          <rect x={x + 5} y={y + 10} width="6" height="4" fill="#e8e5db" />
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={44 - i * 3} y={72 + i * 0} width={72 + i * 6} height="0" fill="none" />
      ))}
      <path d="M38,72 h84 M36,70 h88" stroke="#dcd8cc" strokeWidth="2" />
    </g>
  ),
  // 芬蘭堡：海上的石造稜堡、城牆與老砲、海鷗
  suomenlinna: (
    <g>
      <rect width="160" height="90" fill="#bcd4e6" />
      <ellipse cx="120" cy="14" rx="12" ry="3.4" fill="#fff" opacity="0.7" />
      <rect y="62" width="160" height="28" fill={C.seaCold} />
      <path d="M0,66 q14,-3 28,0 t28,0 t28,0 t28,0 t28,0" stroke="#3f6f95" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M0,62 L0,44 L34,38 L96,38 L128,46 L160,44 L160,62 Z" fill="#8d8a7e" />
      <path d="M0,44 L34,38 L96,38 L128,46 L160,44" fill="none" stroke="#6f6c62" strokeWidth="1.6" />
      {[6, 20, 34, 48, 62, 76, 90, 104, 118, 132, 146].map((x, i) => (
        <rect key={x} x={x} y={i < 6 ? 36 : 40} width="7" height="5" fill="#9d9a8d" />
      ))}
      <path d="M40,48 h44 v14 h-44 Z" fill="#7d7a6f" />
      <path d="M52,62 V52 q10,-7 20,0 V62 Z" fill="#5f5d55" />
      <g>
        <rect x="98" y="32" width="16" height="4" rx="1.6" fill="#4a4740" transform="rotate(-14 106 34)" />
        <circle cx="98" cy="37" r="3" fill="#39362f" />
      </g>
      <path d="M22,20 q4,-4 8,-1 q-3,-1 -4,2 q3,-1 5,1 q-5,1 -9,-2 Z" fill={C.white} opacity="0.9" />
      <path d="M60,26 q3,-3 6,-1 q-2,-1 -3,1.5 q2,-1 4,0.5 q-4,1 -7,-1 Z" fill={C.white} opacity="0.8" />
    </g>
  ),
  // 岩石教堂：直接鑿進岩盤的圓形石牆＋銅圓頂＋從天窗灑下的光
  rockchurch: (
    <g>
      <rect width="160" height="90" fill="#5d5750" />
      <path d="M0,90 L0,52 Q40,34 80,32 Q120,34 160,52 L160,90 Z" fill="#7a7269" />
      {[[16, 58], [40, 50], [70, 44], [100, 46], [130, 52], [150, 60]].map(([x, y]) => (
        <path key={x} d={`M${x},${y} l7,-5 l7,5 l-4,7 l-7,0 Z`} fill="#8b8378" opacity="0.9" />
      ))}
      <path d="M34,34 A46,30 0 0 1 126,34 Z" fill={C.copper} />
      {[44, 58, 72, 86, 100, 114].map((x) => (
        <line key={x} x1={x} y1="34" x2={80 + (x - 80) * 0.18} y2="14" stroke="#5aa78a" strokeWidth="1.1" />
      ))}
      <ellipse cx="80" cy="13" rx="9" ry="3" fill="#8fd4bb" />
      {[[46, 34], [72, 30], [98, 31], [120, 35]].map(([x, y], i) => (
        <path key={x} d={`M${x},${y} L${x - 10 + i * 4},74 L${x + 4 - i * 2},74 Z`} fill="#fff7dd" opacity="0.22" />
      ))}
      <rect y="74" width="160" height="16" fill="#6a6259" />
      {[20, 60, 108, 140].map((x) => (
        <rect key={x} x={x} y="76" width="14" height="3" rx="1.5" fill="#8a8177" />
      ))}
    </g>
  ),
  // 拉普蘭雪林：積雪的針葉林、雪地、淡淡的極光底色
  snowforest: (
    <g>
      <rect width="160" height="90" fill="#2c3c58" />
      <path d="M0,26 q40,-12 80,-2 t80,-6 v14 q-40,10 -80,2 t-80,6 Z" fill={C.auroraG} opacity="0.2" />
      {[[18, 8], [46, 5], [92, 9], [126, 6], [150, 11], [64, 14], [110, 16]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#fff" opacity="0.85" />
      ))}
      <rect y="62" width="160" height="28" fill={C.snow} />
      <path d="M0,62 q26,-6 52,-1 t54,-2 q28,-3 54,3 v6 H0 Z" fill="#dfeaf3" />
      {[[14, 62, 15], [36, 60, 19], [62, 63, 13], [86, 59, 21], [112, 62, 16], [138, 61, 18]].map(([x, base, h]) => (
        <g key={x}>
          <path d={`M${x},${base} L${x + h * 0.42},${base - h} L${x + h * 0.84},${base} Z`} fill="#22452f" />
          <path d={`M${x + 2},${base - h * 0.42} L${x + h * 0.42},${base - h} L${x + h * 0.84 - 2},${base - h * 0.42} Z`} fill="#2d5a3d" />
          <path d={`M${x + h * 0.2},${base - h * 0.75} L${x + h * 0.42},${base - h} L${x + h * 0.64},${base - h * 0.75} Z`} fill={C.snow} opacity="0.85" />
        </g>
      ))}
      {[[28, 74], [70, 80], [120, 76], [96, 86]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="8" ry="1.8" fill="#d5e3ee" />
      ))}
    </g>
  ),
  // 羅瓦涅米：雪中的北國小城；天空用五條放射狀街道暗示「馴鹿角」都市計畫
  rovaniemi: (
    <g>
      <rect width="160" height="90" fill="#2b3a56" />
      <path d="M0,20 q40,-10 80,0 t80,-4 v10 q-40,8 -80,0 t-80,4 Z" fill={C.auroraG} opacity="0.18" />
      {[-40, -20, 0, 20, 40].map((dx) => (
        <line key={dx} x1="80" y1="58" x2={80 + dx * 1.6} y2={30 - Math.abs(dx) * 0.15}
          stroke="#8fd4bb" strokeWidth="0.8" opacity="0.35" />
      ))}
      <circle cx="80" cy="58" r="2.6" fill="#8fd4bb" opacity="0.5" />
      <rect y="58" width="160" height="32" fill={C.snow} />
      <path d="M0,58 q30,-5 60,0 t50,-2 q26,-2 50,4 v4 H0 Z" fill="#e4eef6" />
      {[[10, 40], [30, 44], [52, 38], [74, 43], [96, 40], [118, 45], [140, 41]].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="15" height={58 - y} fill="#586b8a" />
          <path d={`M${x - 1.5},${y} h18 l-2,-4 h-14 Z`} fill={C.snow} />
          {[0, 1].map((r) => [0, 1].map((c) => (
            <rect key={`${r}-${c}`} x={x + 3 + c * 7} y={y + 5 + r * 7} width="4" height="4" fill={C.gold} opacity="0.85" />
          )))}
        </g>
      ))}
      {[[24, 78], [104, 82]].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x},${y} l3,-5 l4,0 l3,5 Z`} fill="#5a4a3a" />
          <path d={`M${x + 3},${y - 5} l-2,-5 m2,3 l3,-2 M${x + 7},${y - 5} l2,-5 m-2,3 l-3,-2`}
            stroke="#7a6650" strokeWidth="1" fill="none" />
        </g>
      ))}
    </g>
  ),
  // 聖誕老人村：北極圈標線（畫的是 1865 年的位置）＋木屋郵局＋雪
  santa: (
    <g>
      <rect width="160" height="90" fill="#2f4160" />
      <path d="M0,18 q40,-10 80,-1 t80,-5 v9 q-40,8 -80,0 t-80,5 Z" fill={C.auroraG} opacity="0.16" />
      {[[22, 8], [58, 5], [98, 9], [134, 6]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="0.9" fill="#fff" opacity="0.85" />
      ))}
      <rect y="56" width="160" height="34" fill={C.snow} />
      <path d="M0,56 q30,-5 60,0 t50,-2 q26,-2 50,4 v4 H0 Z" fill="#e4eef6" />
      {[[16, 34], [118, 36]].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="26" height={56 - y} fill={C.terracotta} />
          <path d={`M${x - 3},${y} h32 l-16,-10 Z`} fill="#f2f7fb" />
          <rect x={x + 5} y={y + 8} width="7" height="7" fill={C.gold} opacity="0.9" />
          <rect x={x + 15} y={y + 8} width="7" height="7" fill={C.gold} opacity="0.9" />
        </g>
      ))}
      {/* 北極圈標線：白線＋牌子（真正的北極圈其實在它北邊 700 公尺，而且每年會移動） */}
      <path d="M0,70 q40,-4 80,0 t80,-2" stroke="#8fd4bb" strokeWidth="2.4" fill="none" opacity="0.95" />
      <path d="M0,70 q40,-4 80,0 t80,-2" stroke="#fff" strokeWidth="0.9" fill="none" opacity="0.8" />
      <g>
        <rect x="66" y="44" width="28" height="12" rx="1.6" fill="#f4efe2" stroke={C.wood2} strokeWidth="1" />
        <path d="M70,48 h20 M70,52 h14" stroke="#8d8168" strokeWidth="1.2" />
        <rect x="78" y="56" width="3.5" height="14" fill={C.wood2} />
      </g>
      {[[50, 78], [104, 82], [138, 76]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="7" ry="1.7" fill="#d5e3ee" />
      ))}
      {[[8, 56, 13], [148, 55, 14]].map(([x, base, h]) => (
        <g key={x}>
          <path d={`M${x},${base} L${x + h * 0.42},${base - h} L${x + h * 0.84},${base} Z`} fill="#22452f" />
          <path d={`M${x + h * 0.18},${base - h * 0.72} L${x + h * 0.42},${base - h} L${x + h * 0.66},${base - h * 0.72} Z`}
            fill={C.snow} opacity="0.9" />
        </g>
      ))}
    </g>
  ),
  // 極光：北極圈的夜空整片亮起來（終章畫面）
  aurora: (
    <g>
      <rect width="160" height="90" fill={C.nordNight} />
      {[[12, 10], [30, 6], [58, 12], [88, 5], [118, 10], [142, 7], [70, 20], [104, 22], [24, 24], [150, 20]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={y % 3 === 0 ? 1.1 : 0.8} fill="#fff" opacity="0.9" />
      ))}
      <path d="M-6,34 q30,-22 62,-6 q34,17 66,-12 q20,-18 44,-4 l0,16 q-26,-10 -44,8 q-32,30 -68,10 q-30,-16 -60,4 Z"
        fill={C.auroraG} opacity="0.5" />
      <path d="M-6,46 q34,-18 66,0 q32,17 62,-10 q18,-16 40,-2 l0,12 q-24,-8 -40,6 q-30,26 -64,8 q-32,-16 -64,2 Z"
        fill={C.auroraV} opacity="0.32" />
      <path d="M-6,40 q32,-20 64,-3 q33,17 64,-11 q19,-17 42,-3 l0,7 q-25,-9 -42,7 q-31,28 -66,9 q-31,-16 -62,3 Z"
        fill="#9ff9d0" opacity="0.35" />
      <rect y="64" width="160" height="26" fill="#e6eef6" />
      <path d="M0,64 q28,-6 56,-1 t52,-3 q28,-2 52,4 v4 H0 Z" fill="#f4f8fc" />
      {[[16, 64, 14], [42, 62, 17], [116, 63, 15], [142, 61, 18]].map(([x, base, h]) => (
        <g key={x}>
          <path d={`M${x},${base} L${x + h * 0.42},${base - h} L${x + h * 0.84},${base} Z`} fill="#1c3a2a" />
          <path d={`M${x + h * 0.18},${base - h * 0.72} L${x + h * 0.42},${base - h} L${x + h * 0.66},${base - h * 0.72} Z`}
            fill="#dfeaf3" opacity="0.9" />
        </g>
      ))}
      <path d="M56,78 q24,-5 48,0" stroke="#cddcea" strokeWidth="1" fill="none" opacity="0.8" />
    </g>
  ),
}

// 安安：全遊戲唯一需要新畫的角色（其餘都重用寵物或 emoji）。偵探帽＋放大鏡最好認。
function Anan({ size = 54 }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 60 75" style={{ overflow: 'visible', display: 'block' }}>
      <ellipse cx="30" cy="70" rx="15" ry="3.5" fill="rgba(0,0,0,0.16)" />
      <rect x="19" y="42" width="22" height="26" rx="8" fill="#5b8fd6" />
      <rect x="24" y="52" width="12" height="16" rx="4" fill="#7aa8e6" />
      <circle cx="30" cy="28" r="17" fill="#f7d3ae" />
      <path d="M13,24 q17,-14 34,0 q-6,-16 -17,-16 q-11,0 -17,16 Z" fill="#3d2b1d" />
      <path d="M9,22 q21,-9 42,0 q2,-7 -21,-7 q-23,0 -21,7 Z" fill="#b4643f" />
      <ellipse cx="30" cy="12" rx="13" ry="7" fill="#c8734a" />
      <circle cx="24" cy="29" r="2.6" fill="#2c2118" />
      <circle cx="36" cy="29" r="2.6" fill="#2c2118" />
      <circle cx="24.9" cy="28.1" r="0.9" fill="#fff" />
      <circle cx="36.9" cy="28.1" r="0.9" fill="#fff" />
      <path d="M26,36 q4,3.5 8,0" stroke="#8a4a3a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="18.5" cy="34" rx="3" ry="2" fill="rgba(230,120,110,0.3)" />
      <ellipse cx="41.5" cy="34" rx="3" ry="2" fill="rgba(230,120,110,0.3)" />
      <g>
        <circle cx="48" cy="50" r="7" fill="rgba(190,230,255,0.6)" stroke="#7d5528" strokeWidth="2.2" />
        <line x1="52" y1="55" x2="57" y2="61" stroke="#7d5528" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// 一位演員：安安／寵物（用 PetAvatar）／其他動物（emoji 立牌）
function Actor({ id, size = 54 }) {
  if (id === 'anan') return <Anan size={size} />
  if (PETS[id]) return <PetAvatar petId={id} evolutionStage={1} equipped={[]} size={size} mood={100} />
  return <span className="comic-emoji" style={{ fontSize: size * 0.8 }}>{id}</span>
}

function ComicPanel({ bg, cast = [], say, n }) {
  return (
    <div className="comic-panel">
      <div className="comic-art">
        <svg className="comic-bg" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {BG[bg] || <rect width="160" height="90" fill="#e8e2d4" />}
        </svg>
        <div className="comic-cast">
          {cast.map((id, i) => <Actor key={`${id}-${i}`} id={id} size={cast.length > 3 ? 44 : 54} />)}
        </div>
        <span className="comic-no">{n}</span>
      </div>
      {say && (
        <div className="comic-caption">
          <span className="comic-zh">{say.zh}</span>
          <span className="comic-en">{say.en}</span>
        </div>
      )}
    </div>
  )
}

export default function ComicStrip({ panels, label = '📖 過場漫畫 Comic' }) {
  if (!panels?.length) return null
  return (
    <div className="comic-strip">
      <div className="comic-label">{label}</div>
      {panels.map((p, i) => <ComicPanel key={i} {...p} n={i + 1} />)}
    </div>
  )
}
