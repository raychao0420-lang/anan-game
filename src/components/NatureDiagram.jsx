// 自然科圖解庫（S7 起）：把抽象的自然概念畫成 inline SVG，孩子看圖就懂。
// 用法：scene.diagram = 'sun-shadow'（圖解 id），SeriesScreen 於現場故事下方渲染 <NatureDiagram id=… />。
// 設計原則：
//   1) 完全比照 DecoArt——用 id 對照畫圖，找不到就退回 emoji（emojiFallback）。
//   2) 每張圖自帶底色面板與明確配色，亮/暗主題下都看得清楚（不吃頁面主題色）。
//   3) 題目要用到的數字／箭頭／方位「直接標在圖上」，圖會說話。
// 新增圖解：在 DIAGRAMS 加一個 key 即可（社會/數學共用的 map-compass 等也放這）。

const C = {
  ink: '#33404a', sub: '#6b7a86', line: '#9aa7b2',
  sun: '#ffb020', sunEdge: '#e08a00', sky: '#eaf4ff',
  ground: '#d8c39a', shadow: '#5b6b78',
  red: '#e0574f', redLight: '#f7c9c4', paper: '#fbfbf7',
  green: '#5aa469', water: '#6db6d8', card: '#f4f7f9', cardEdge: '#dfe7ec',
}

// 每張圖 viewBox 統一 0 0 160 104，最外層一律有一塊圓角底板
const panel = <rect x="1" y="1" width="158" height="102" rx="10" fill={C.card} stroke={C.cardEdge} strokeWidth="1.5" />

const DIAGRAMS = {
  // 太陽越高、影子越短：上午(低太陽·長影) vs 正午(高太陽·短影)
  'sun-shadow': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <rect x="8" y="8" width="144" height="70" rx="6" fill={C.sky} />
      {/* 地面 */}
      <rect x="8" y="70" width="144" height="8" fill={C.ground} />
      {/* 竿子（中間） */}
      <rect x="78" y="44" width="4" height="26" rx="1.5" fill={C.ink} />
      {/* 上午：低太陽（左）＋長影（往右） */}
      <circle cx="26" cy="56" r="7" fill={C.sun} stroke={C.sunEdge} strokeWidth="1.5" />
      <line x1="82" y1="70" x2="120" y2="70" stroke={C.shadow} strokeWidth="4" strokeLinecap="round" />
      <text x="101" y="66" fontSize="7" fill={C.shadow} textAnchor="middle">長 long</text>
      {/* 正午：高太陽（中上）＋短影 */}
      <circle cx="80" cy="18" r="8" fill={C.sun} stroke={C.sunEdge} strokeWidth="1.5" />
      <line x1="78" y1="70" x2="68" y2="70" stroke={C.shadow} strokeWidth="4" strokeLinecap="round" />
      {/* 標籤 */}
      <text x="26" y="44" fontSize="7.5" fill={C.sub} textAnchor="middle">上午 太陽低</text>
      <text x="80" y="34" fontSize="7.5" fill={C.sub} textAnchor="middle">正午 太陽高</text>
      <text x="80" y="94" fontSize="8.5" fill={C.ink} textAnchor="middle" fontWeight="bold">太陽越高，影子越短｜正午影最短、指北↑</text>
    </g>
  ),

  // 紅燈籠的光照在白紙上，白紙看起來偏紅（光的顏色）
  'light-color': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 燈籠 */}
      <ellipse cx="42" cy="30" rx="17" ry="20" fill={C.red} stroke={C.sunEdge} strokeWidth="1.2" />
      <rect x="38" y="8" width="8" height="4" rx="1" fill={C.ink} />
      <rect x="34" y="49" width="16" height="4" rx="1" fill={C.ink} />
      {/* 紅光射向白紙 */}
      {[0, 1, 2].map((k) => (
        <line key={k} x1="56" y1={30} x2="104" y2={40 + k * 12} stroke={C.red} strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      ))}
      {/* 白紙（被紅光染成偏紅） */}
      <rect x="104" y="26" width="44" height="40" rx="3" fill={C.paper} stroke={C.cardEdge} strokeWidth="1.2" />
      <rect x="104" y="26" width="44" height="40" rx="3" fill={C.redLight} opacity="0.6" />
      <text x="126" y="49" fontSize="7.5" fill={C.red} textAnchor="middle">白紙→偏紅</text>
      <text x="80" y="90" fontSize="8.5" fill={C.ink} textAnchor="middle" fontWeight="bold">紅燈籠的光，讓白紙看起來偏紅</text>
    </g>
  ),

  // 老街地圖＋羅盤：牌樓在西、廟在正東 3 個路口
  'map-compass': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 街道格線 */}
      {[0, 1, 2, 3].map((k) => (
        <line key={`v${k}`} x1={22 + k * 30} y1="24" x2={22 + k * 30} y2="78" stroke={C.line} strokeWidth="1.2" />
      ))}
      {[0, 1].map((k) => (
        <line key={`h${k}`} x1="16" y1={40 + k * 24} x2="118" y2={40 + k * 24} stroke={C.line} strokeWidth="1.2" />
      ))}
      {/* 牌樓（西/左） */}
      <text x="22" y="55" fontSize="14" textAnchor="middle">⛩️</text>
      {/* 廟（東/右，第 3 個路口） */}
      <text x="112" y="55" fontSize="14" textAnchor="middle">🏯</text>
      {/* 往東箭頭 */}
      <line x1="34" y1="66" x2="104" y2="66" stroke={C.red} strokeWidth="2" markerEnd="" />
      <path d="M104,66 l-6,-3 v6 z" fill={C.red} />
      <text x="68" y="76" fontSize="7.5" fill={C.red} textAnchor="middle">東 3 個路口 · 每格 40m</text>
      {/* 羅盤（右上） */}
      <g transform="translate(140,26)">
        <circle r="12" fill="#fff" stroke={C.line} strokeWidth="1.2" />
        <path d="M0,-10 l3,8 h-6 z" fill={C.red} />
        <path d="M0,10 l3,-8 h-6 z" fill={C.sub} />
        <text x="0" y="-13.5" fontSize="6.5" fill={C.red} textAnchor="middle">北N</text>
      </g>
      <text x="80" y="94" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">看地圖找方位：廟在牌樓的正東方</text>
    </g>
  ),

  // 比例尺：圖上 1 公分 = 實際 50 公尺（1:5000）
  'scale-bar': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <text x="80" y="26" fontSize="9" fill={C.ink} textAnchor="middle" fontWeight="bold">比例尺 1 : 5000</text>
      {/* 尺 */}
      <rect x="24" y="40" width="112" height="14" rx="2" fill="#fff" stroke={C.ink} strokeWidth="1.2" />
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k}>
          <rect x={24 + k * 28} y="40" width="28" height="14" fill={k % 2 ? C.ink : '#fff'} opacity={k % 2 ? 0.85 : 1} />
          <line x1={24 + k * 28} y1="40" x2={24 + k * 28} y2="58" stroke={C.ink} strokeWidth="1" />
          <text x={24 + k * 28} y="66" fontSize="6.5" fill={C.sub} textAnchor="middle">{k}cm</text>
        </g>
      ))}
      <line x1="136" y1="40" x2="136" y2="58" stroke={C.ink} strokeWidth="1" />
      <text x="80" y="88" fontSize="8.5" fill={C.green} textAnchor="middle" fontWeight="bold">圖上 1 公分 = 實際 50 公尺</text>
    </g>
  ),

  // 長方形匾額標邊長：長 90 公分、寬 30 公分
  'rect-dim': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <rect x="30" y="34" width="100" height="34" rx="3" fill="#c98a4b" stroke="#7a4e22" strokeWidth="2" />
      <text x="80" y="56" fontSize="11" fill="#fdf6e3" textAnchor="middle" fontWeight="bold">協盛號</text>
      {/* 長 90（下） */}
      <line x1="30" y1="76" x2="130" y2="76" stroke={C.ink} strokeWidth="1" />
      <path d="M30,76 l5,-3 v6 z M130,76 l-5,-3 v6 z" fill={C.ink} />
      <text x="80" y="86" fontSize="8" fill={C.ink} textAnchor="middle">長 90 公分</text>
      {/* 寬 30（右） */}
      <line x1="140" y1="34" x2="140" y2="68" stroke={C.ink} strokeWidth="1" />
      <path d="M140,34 l-3,5 h6 z M140,68 l-3,-5 h6 z" fill={C.ink} />
      <text x="150" y="54" fontSize="8" fill={C.ink} textAnchor="middle" transform="rotate(90,150,54)">寬 30 公分</text>
      <text x="80" y="26" fontSize="8" fill={C.sub} textAnchor="middle">量一量匾額的邊長</text>
    </g>
  ),
}

export default function NatureDiagram({ id, emojiFallback = '🔬', size = 200 }) {
  const art = DIAGRAMS[id]
  if (!art) {
    return <div className="srs-diagram srs-diagram-fallback" style={{ fontSize: 40, textAlign: 'center' }}>{emojiFallback}</div>
  }
  return (
    <div className="srs-diagram">
      <svg viewBox="0 0 160 104" width={size} height={size * 104 / 160} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {art}
      </svg>
    </div>
  )
}
