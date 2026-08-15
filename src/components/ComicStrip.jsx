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
}

// 每張背景 viewBox 0 0 160 90。畫的是「一眼看得出是哪裡」的剪影，不求寫實。
const BG = {
  // 大溪老街：巴洛克紅磚牌樓＋紅燈籠
  oldstreet: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <rect y="62" width="160" height="28" fill={C.stone} />
      {[6, 44, 82, 120].map((x) => (
        <g key={x}>
          <rect x={x} y="18" width="34" height="48" fill={C.brick} />
          <rect x={x} y="18" width="34" height="9" fill={C.brick2} />
          <path d={`M${x + 3},18 Q${x + 17},6 ${x + 31},18 Z`} fill={C.paper} />
          <rect x={x + 6} y="34" width="10" height="14" fill={C.paper} opacity="0.85" />
          <rect x={x + 19} y="34" width="10" height="14" fill={C.paper} opacity="0.85" />
          <rect x={x + 10} y="52" width="14" height="14" fill={C.wood2} />
        </g>
      ))}
      {[24, 62, 100, 138].map((x) => (
        <g key={x}><line x1={x} y1="16" x2={x} y2="22" stroke={C.dark} strokeWidth="1" />
          <ellipse cx={x} cy="27" rx="5" ry="6" fill={C.red} /></g>
      ))}
    </g>
  ),
  // 大漢溪河階：一階一階的台地＋河水
  river: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <path d="M0,34 L160,28 L160,44 L0,50 Z" fill={C.green2} />
      <path d="M0,50 L160,44 L160,58 L0,64 Z" fill={C.green} />
      <path d="M0,64 L160,58 L160,90 L0,90 Z" fill={C.water} />
      <path d="M12,72 q10,-4 20,0 M60,78 q10,-4 20,0 M110,70 q10,-4 20,0" stroke={C.water2} strokeWidth="2" fill="none" />
      <rect x="18" y="38" width="26" height="8" fill="#d9c774" />
      <rect x="96" y="32" width="30" height="8" fill="#d9c774" />
    </g>
  ),
  // 月眉溼地：蘆葦＋水鳥
  wetland: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <rect y="52" width="160" height="38" fill={C.water} />
      <path d="M0,52 h160 v6 h-160 Z" fill={C.green2} />
      {[10, 26, 40, 118, 134, 150].map((x) => (
        <g key={x}>
          <line x1={x} y1="52" x2={x} y2="26" stroke={C.green2} strokeWidth="2" />
          <ellipse cx={x} cy="24" rx="2.5" ry="6" fill="#c9a24a" />
        </g>
      ))}
      <path d="M60,60 q6,-6 12,0 q-6,3 -12,0 Z" fill={C.white} />
      <path d="M88,66 q6,-6 12,0 q-6,3 -12,0 Z" fill={C.white} />
      <circle cx="70" cy="46" r="3" fill={C.white} />
    </g>
  ),
  // 慈湖夜色：靜湖倒映月亮
  lakenight: (
    <g>
      <rect width="160" height="90" fill={C.skyNight} />
      <circle cx="118" cy="22" r="10" fill="#f4f0d8" />
      {[[20, 14], [46, 26], [70, 12], [96, 30], [142, 44]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.4" fill={C.white} opacity="0.85" />
      ))}
      <path d="M0,52 L34,32 L60,52 L92,28 L128,52 L160,38 L160,56 L0,56 Z" fill="#3b4a4a" />
      <rect y="56" width="160" height="34" fill="#20344a" />
      <ellipse cx="118" cy="70" rx="9" ry="4" fill="#f4f0d8" opacity="0.5" />
    </g>
  ),
  // 木藝工坊：神桌＋工具牆
  woodshop: (
    <g>
      <rect width="160" height="90" fill="#e6d6bd" />
      <rect y="66" width="160" height="24" fill={C.wood} />
      <rect x="8" y="12" width="60" height="40" fill={C.wood2} opacity="0.55" />
      {[16, 30, 44, 58].map((x) => <rect key={x} x={x} y="18" width="4" height="18" rx="2" fill={C.dark} />)}
      <rect x="82" y="40" width="66" height="8" fill={C.red} />
      <rect x="86" y="48" width="6" height="18" fill={C.wood2} />
      <rect x="138" y="48" width="6" height="18" fill={C.wood2} />
      <circle cx="115" cy="34" r="7" fill={C.gold} />
      <path d="M108,34 q7,-9 14,0 q-7,9 -14,0 Z" fill={C.paper} />
    </g>
  ),
  // 豆干工廠：大滷鍋＋蒸氣
  factory: (
    <g>
      <rect width="160" height="90" fill="#efe0cb" />
      <rect y="64" width="160" height="26" fill="#c9a97e" />
      <rect x="20" y="44" width="52" height="22" rx="4" fill={C.dark} />
      <ellipse cx="46" cy="44" rx="26" ry="6" fill="#6b4a2a" />
      {[36, 46, 56].map((x, i) => (
        <path key={x} d={`M${x},38 q4,-8 0,-14`} stroke={C.white} strokeWidth="3" fill="none" opacity={0.5 - i * 0.08} strokeLinecap="round" />
      ))}
      {[92, 116, 140].map((x) => (
        <g key={x}>
          <rect x={x} y="48" width="18" height="4" fill={C.wood2} />
          <rect x={x + 1} y="52" width="16" height="10" rx="1" fill="#8b5a2b" />
        </g>
      ))}
    </g>
  ),
  // 千塘之鄉：一口口埤塘
  ponds: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <rect y="40" width="160" height="50" fill={C.green} />
      {[[24, 56, 20, 9], [74, 50, 24, 10], [126, 62, 22, 9], [104, 78, 18, 7], [38, 78, 16, 6]].map(([x, y, rx, ry]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.water} />
          <ellipse cx={x} cy={y - 1.5} rx={rx * 0.6} ry={ry * 0.4} fill={C.white} opacity="0.35" />
        </g>
      ))}
      <path d="M0,40 L160,40 L160,30 Q120,22 80,30 Q40,38 0,30 Z" fill={C.green2} />
    </g>
  ),
  // 石門水庫：大壩＋洩洪
  dam: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <path d="M0,30 L40,14 L74,30 Z" fill="#7a8a72" />
      <path d="M86,30 L124,12 L160,30 Z" fill="#7a8a72" />
      <rect y="30" width="160" height="20" fill={C.water2} />
      <path d="M0,50 L160,50 L150,78 L10,78 Z" fill={C.stone} />
      {[46, 74, 102].map((x) => (
        <g key={x}>
          <rect x={x} y="50" width="14" height="28" fill="#8d8779" />
          <path d={`M${x + 2},60 q3,10 0,18`} stroke={C.white} strokeWidth="3" fill="none" opacity="0.8" />
        </g>
      ))}
      <rect y="78" width="160" height="12" fill={C.water} />
    </g>
  ),
  // 廟口遶境：普濟堂＋燈籠＋鑼鼓
  temple: (
    <g>
      <rect width="160" height="90" fill={C.skyDusk} />
      <rect y="66" width="160" height="24" fill={C.stone} />
      <path d="M28,30 L80,14 L132,30 Z" fill={C.red} />
      <rect x="34" y="30" width="92" height="36" fill="#d9b98c" />
      <rect x="52" y="42" width="14" height="24" fill={C.red} />
      <rect x="94" y="42" width="14" height="24" fill={C.red} />
      <rect x="72" y="38" width="16" height="28" fill={C.wood2} />
      {[16, 40, 120, 144].map((x) => (
        <g key={x}><line x1={x} y1="10" x2={x} y2="18" stroke={C.dark} strokeWidth="1" />
          <ellipse cx={x} cy="24" rx="6" ry="7" fill={C.red} />
          <rect x={x - 6} y="22" width="12" height="2" fill={C.gold} /></g>
      ))}
    </g>
  ),
  // 茶園花海：一畦畦茶壟＋花田
  teafield: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <path d="M0,36 Q40,26 80,34 Q120,42 160,32 L160,90 L0,90 Z" fill={C.green} />
      {[46, 56, 66].map((y, i) => (
        <path key={y} d={`M0,${y} Q40,${y - 8} 80,${y - 2} Q120,${y + 4} 160,${y - 4}`}
          stroke={C.green2} strokeWidth="5" fill="none" opacity={0.9 - i * 0.1} />
      ))}
      {[[14, 78], [34, 82], [54, 76], [76, 84], [98, 78], [120, 84], [142, 78]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" fill={['#e86f9a', '#f2c14e', '#c98ee0'][x % 3]} />
      ))}
      <circle cx="136" cy="18" r="9" fill="#ffd76b" />
    </g>
  ),
  // 輕便鐵道：窄軌＋台車
  railway: (
    <g>
      <rect width="160" height="90" fill={C.sky} />
      <path d="M0,40 Q50,24 100,36 Q130,42 160,34 L160,58 L0,58 Z" fill={C.green2} />
      <rect y="58" width="160" height="32" fill="#c2a887" />
      <line x1="0" y1="70" x2="160" y2="66" stroke={C.dark} strokeWidth="2" />
      <line x1="0" y1="80" x2="160" y2="76" stroke={C.dark} strokeWidth="2" />
      {[10, 34, 58, 82, 106, 130, 152].map((x) => (
        <rect key={x} x={x} y="66" width="5" height="14" fill={C.wood2} />
      ))}
      <g>
        <rect x="56" y="46" width="34" height="14" fill={C.wood} />
        <rect x="60" y="40" width="26" height="7" fill={C.wood2} />
        <circle cx="64" cy="62" r="4" fill={C.dark} />
        <circle cx="84" cy="62" r="4" fill={C.dark} />
      </g>
    </g>
  ),
  // 八德家鄉大會：廣場舞台＋燈串＋老榕樹
  plaza: (
    <g>
      <rect width="160" height="90" fill={C.skyDusk} />
      <rect y="64" width="160" height="26" fill="#d9c6a5" />
      <rect x="46" y="40" width="70" height="24" fill={C.red} opacity="0.85" />
      <rect x="44" y="36" width="74" height="6" fill={C.gold} />
      <path d="M0,20 Q40,32 80,20 Q120,8 160,20" stroke={C.dark} strokeWidth="1" fill="none" />
      {[20, 44, 68, 92, 116, 140].map((x, i) => (
        <circle key={x} cx={x} cy={24 + (i % 2) * 4} r="3" fill={[C.gold, C.red, C.white][i % 3]} />
      ))}
      <g>
        <rect x="16" y="44" width="8" height="22" fill={C.wood2} />
        <circle cx="20" cy="38" r="14" fill={C.green2} />
        <circle cx="8" cy="44" r="8" fill={C.green} />
        <circle cx="32" cy="44" r="9" fill={C.green} />
      </g>
    </g>
  ),
  // 老榕樹下：阿榕留下故事書那一頁的地方（每集破案後共用）
  banyan: (
    <g>
      <rect width="160" height="90" fill="#f3e6c9" />
      <rect y="70" width="160" height="20" fill={C.green} />
      <rect x="72" y="30" width="16" height="42" fill={C.wood2} />
      {[[80, 62, 74], [80, 58, 92]].map(([, y, x]) => (
        <path key={x} d={`M80,${y} q${(x - 80) / 1.2},6 ${x - 80},16`} stroke={C.wood2} strokeWidth="3" fill="none" />
      ))}
      <circle cx="80" cy="26" r="24" fill={C.green2} />
      <circle cx="50" cy="34" r="16" fill={C.green} />
      <circle cx="112" cy="32" r="17" fill={C.green} />
      {[[40, 56], [122, 60], [58, 66]].map(([x, y]) => (
        <path key={x} d={`M${x},${y} q5,-5 10,0 q-5,5 -10,0 Z`} fill="#8fd06a" />
      ))}
      <rect x="96" y="60" width="18" height="12" rx="2" fill={C.paper} stroke={C.wood2} strokeWidth="1.5" />
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
      <svg className="comic-bg" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {BG[bg] || <rect width="160" height="90" fill="#e8e2d4" />}
      </svg>
      <div className="comic-cast">
        {cast.map((id, i) => <Actor key={`${id}-${i}`} id={id} size={cast.length > 3 ? 44 : 54} />)}
      </div>
      {say && (
        <div className="comic-bubble">
          <span className="comic-zh">{say.zh}</span>
          <span className="comic-en">{say.en}</span>
        </div>
      )}
      <span className="comic-no">{n}</span>
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
