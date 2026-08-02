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

  // 河階：大漢溪千百年往下切，河邊留下一階一階的平台（剖面圖）
  'river-terrace': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <rect x="8" y="8" width="144" height="66" rx="6" fill={C.sky} />
      {/* 階梯狀地形：左高右低，一階一階往河面下降 */}
      <path d="M8,30 H44 V44 H80 V58 H112 V70 H152 V74 H8 Z" fill={C.ground} stroke="#b9a06f" strokeWidth="1.2" />
      {/* 每階的小田（綠） */}
      <rect x="12" y="26" width="28" height="4" rx="1.5" fill={C.green} />
      <rect x="48" y="40" width="28" height="4" rx="1.5" fill={C.green} />
      <rect x="84" y="54" width="24" height="4" rx="1.5" fill={C.green} />
      {/* 河（右下） */}
      <path d="M112,70 H152 V74 H112 Z" fill={C.water} />
      <path d="M112,74 Q132,71 152,74" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
      {/* 下切箭頭 */}
      <line x1="128" y1="20" x2="128" y2="66" stroke={C.red} strokeWidth="1.6" strokeDasharray="3 2" />
      <path d="M128,66 l-3,-6 h6 z" fill={C.red} />
      <text x="140" y="40" fontSize="7" fill={C.red}>下切</text>
      {/* 落差標示 */}
      <text x="26" y="22" fontSize="7" fill={C.sub} textAnchor="middle">高階</text>
      <text x="132" y="88" fontSize="7.5" fill={C.water} textAnchor="middle" fontWeight="bold">大漢溪</text>
      <text x="70" y="98" fontSize="8.5" fill={C.ink} textAnchor="middle" fontWeight="bold">河流下切，切出一階一階的「河階」</text>
    </g>
  ),

  // 面積方格：長方形田分成 1 平方公尺的小格，面積＝長×寬
  'area-grid': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 8×5 方格 */}
      <g>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <rect key={`${r}-${c}`} x={30 + c * 12} y={22 + r * 10} width="12" height="10"
              fill={(r + c) % 2 ? '#dff0e3' : '#eef8f0'} stroke={C.green} strokeWidth="0.6" />
          ))
        )}
      </g>
      {/* 長（下） */}
      <line x1="30" y1="78" x2="126" y2="78" stroke={C.ink} strokeWidth="1" />
      <path d="M30,78 l5,-3 v6 z M126,78 l-5,-3 v6 z" fill={C.ink} />
      <text x="78" y="88" fontSize="8" fill={C.ink} textAnchor="middle">長</text>
      {/* 寬（左） */}
      <line x1="24" y1="22" x2="24" y2="72" stroke={C.ink} strokeWidth="1" />
      <path d="M24,22 l-3,5 h6 z M24,72 l-3,-5 h6 z" fill={C.ink} />
      <text x="14" y="49" fontSize="8" fill={C.ink} textAnchor="middle" transform="rotate(-90,14,49)">寬</text>
      <text x="128" y="16" fontSize="7" fill={C.sub} textAnchor="end">1 格 = 1 平方公尺</text>
      <text x="82" y="99" fontSize="8.5" fill={C.green} textAnchor="middle" fontWeight="bold">面積 = 長 × 寬（數格子）</text>
    </g>
  ),

  // 長條圖：月眉溼地生物調查（水鳥20·魚35·青蛙25·蜻蜓10）
  'bar-chart': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <text x="82" y="15" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">月眉溼地生物調查（隻）</text>
      {/* 座標軸 */}
      <line x1="30" y1="22" x2="30" y2="80" stroke={C.ink} strokeWidth="1.2" />
      <line x1="30" y1="80" x2="150" y2="80" stroke={C.ink} strokeWidth="1.2" />
      {/* 長條（value×1.5 為高度） */}
      {[
        { x: 40,  v: 20, h: 30, c: '#6db6d8', n: '水鳥' },
        { x: 68,  v: 35, h: 52, c: '#3fa39a', n: '魚' },
        { x: 96,  v: 25, h: 38, c: '#5aa469', n: '青蛙' },
        { x: 124, v: 10, h: 15, c: '#e0a24f', n: '蜻蜓' },
      ].map((b) => (
        <g key={b.n}>
          <rect x={b.x} y={80 - b.h} width="18" height={b.h} rx="1.5" fill={b.c} />
          <text x={b.x + 9} y={78 - b.h} fontSize="7.5" fill={C.ink} textAnchor="middle" fontWeight="bold">{b.v}</text>
          <text x={b.x + 9} y="90" fontSize="7" fill={C.sub} textAnchor="middle">{b.n}</text>
        </g>
      ))}
      <text x="82" y="101" fontSize="7.5" fill={C.sub} textAnchor="middle">長條越高＝數量越多</text>
    </g>
  ),

  // 折線圖：蜻蜓一週數量（週一 6 → 週五 14，往上升）
  'line-chart': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <text x="82" y="15" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">蜻蜓一週數量（折線圖·隻）</text>
      <line x1="26" y1="22" x2="26" y2="78" stroke={C.ink} strokeWidth="1.2" />
      <line x1="26" y1="78" x2="152" y2="78" stroke={C.ink} strokeWidth="1.2" />
      {/* 5 個點：6,8,10,12,14 → y = 78 - v*3.2 */}
      {(() => {
        const pts = [6, 8, 10, 12, 14].map((v, i) => ({ x: 40 + i * 26, y: 78 - v * 3.2, v }))
        const d = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ')
        const days = ['一', '二', '三', '四', '五']
        return (
          <g>
            <path d={d} stroke="#e0a24f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="2.6" fill="#e0574f" />
                <text x={p.x} y={p.y - 5} fontSize="7" fill={C.ink} textAnchor="middle" fontWeight="bold">{p.v}</text>
                <text x={p.x} y="88" fontSize="7" fill={C.sub} textAnchor="middle">週{days[i]}</text>
              </g>
            ))}
          </g>
        )
      })()}
      <text x="90" y="100" fontSize="7.5" fill={C.sub} textAnchor="middle">折線往上＝數量越來越多</text>
    </g>
  ),

  // 月相：新月→上弦→滿月→下弦（約 30 天一輪）
  'moon-phase': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <rect x="8" y="20" width="144" height="44" rx="6" fill="#26344a" />
      <text x="82" y="15" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">月相變化（約 30 天一輪）</text>
      {[
        { cx: 30,  n: '新月', dark: 'full' },
        { cx: 68,  n: '上弦月', dark: 'left' },
        { cx: 106, n: '滿月', dark: 'none' },
        { cx: 144, n: '下弦月', dark: 'right' },
      ].map((m) => (
        <g key={m.n}>
          <circle cx={m.cx} cy="42" r="12" fill="#f6efc9" stroke="#d9cf9a" strokeWidth="0.8" />
          {m.dark === 'full' && <circle cx={m.cx} cy="42" r="12" fill="#31425c" />}
          {m.dark === 'left' && <path d={`M${m.cx},30 A12 12 0 0 0 ${m.cx},54 Z`} fill="#31425c" />}
          {m.dark === 'right' && <path d={`M${m.cx},30 A12 12 0 0 1 ${m.cx},54 Z`} fill="#31425c" />}
          <text x={m.cx} y="74" fontSize="6.6" fill={C.sub} textAnchor="middle">{m.n}</text>
        </g>
      ))}
      <text x="82" y="92" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">月亮每天晚升約 50 分鐘</text>
    </g>
  ),

  // 月亮東升西落：半圓弧，東 0°→正南 90°→西 180°
  'moonrise': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <rect x="8" y="8" width="144" height="60" rx="6" fill="#20304a" />
      {/* 弧線 東→頂→西 */}
      <path d="M22,64 A58 44 0 0 1 138,64" fill="none" stroke="#8fa6c4" strokeWidth="1.4" strokeDasharray="3 3" />
      {/* 地平線 */}
      <line x1="14" y1="64" x2="146" y2="64" stroke="#c9b48a" strokeWidth="2" />
      {/* 月亮在東邊升起 */}
      <circle cx="28" cy="60" r="6" fill="#f6efc9" />
      {/* 正南最高 */}
      <circle cx="80" cy="22" r="5" fill="#f6efc9" opacity="0.5" />
      {/* 角度標示 */}
      <text x="20" y="76" fontSize="7.5" fill="#f6b73c" textAnchor="middle">東 0°</text>
      <text x="80" y="16" fontSize="7.5" fill="#f6b73c" textAnchor="middle">正南 90°</text>
      <text x="140" y="76" fontSize="7.5" fill="#f6b73c" textAnchor="middle">西 180°</text>
      <text x="82" y="92" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">月亮和太陽一樣：東邊升、西邊落</text>
    </g>
  ),

  // 時鐘角度：6 點整，時針分針成一直線＝180°（每格 30°）
  'clock-angle': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <circle cx="80" cy="50" r="34" fill="#fff" stroke={C.ink} strokeWidth="2" />
      {/* 12 格刻度 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180
        return <line key={i} x1={80 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30}
          x2={80 + Math.cos(a) * 34} y2={50 + Math.sin(a) * 34} stroke={C.sub} strokeWidth="1" />
      })}
      <text x="80" y="26" fontSize="7" fill={C.ink} textAnchor="middle">12</text>
      <text x="80" y="80" fontSize="7" fill={C.ink} textAnchor="middle">6</text>
      <text x="106" y="53" fontSize="7" fill={C.ink} textAnchor="middle">3</text>
      <text x="55" y="53" fontSize="7" fill={C.ink} textAnchor="middle">9</text>
      {/* 6 點：分針指 12、時針指 6，成一直線 */}
      <line x1="80" y1="50" x2="80" y2="22" stroke="#e0574f" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="80" y1="50" x2="80" y2="74" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="50" r="2.5" fill={C.ink} />
      <text x="118" y="50" fontSize="9" fill="#e0574f" fontWeight="bold">180°</text>
      <text x="82" y="98" fontSize="7.8" fill={C.sub} textAnchor="middle">時鐘每一大格＝30°；6 點成一直線＝180°</text>
    </g>
  ),

  // 槓桿：支點近重物，施力臂長→省力（抬厚重神桌）
  'lever': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 橫桿 */}
      <rect x="18" y="52" width="124" height="5" rx="2.5" fill="#a9764a" transform="rotate(-6 80 54)" />
      {/* 支點三角形（靠右，近重物） */}
      <path d="M108,70 l8,-14 l8,14 z" fill={C.ink} />
      {/* 重物：神桌（右短臂） */}
      <rect x="120" y="30" width="22" height="16" rx="2" fill="#8a5a30" stroke="#5f3c1e" strokeWidth="1.2" />
      <text x="131" y="41" fontSize="6.5" fill="#fdf6e3" textAnchor="middle">神桌</text>
      <line x1="131" y1="46" x2="131" y2="60" stroke={C.red} strokeWidth="1.4" />
      <path d="M131,60 l-3,-6 h6 z" fill={C.red} />
      {/* 施力（左長臂，往下壓） */}
      <line x1="34" y1="42" x2="34" y2="60" stroke={C.green} strokeWidth="2" />
      <path d="M34,62 l-3,-6 h6 z" fill={C.green} />
      <text x="34" y="38" fontSize="7" fill={C.green} textAnchor="middle">施力 20kg</text>
      <text x="131" y="26" fontSize="7" fill={C.red} textAnchor="middle">重 60kg</text>
      <text x="82" y="90" fontSize="8.3" fill={C.ink} textAnchor="middle" fontWeight="bold">槓桿：施力臂越長，越省力</text>
    </g>
  ),

  // 摩擦力：砂紙磨木頭，摩擦力方向與運動相反
  'friction': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 木頭桌面（粗糙面） */}
      <rect x="20" y="58" width="120" height="16" rx="2" fill="#c98a4b" stroke="#7a4e22" strokeWidth="1.2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={24 + i * 10} y1="58" x2={28 + i * 10} y2="54" stroke="#7a4e22" strokeWidth="0.8" />
      ))}
      {/* 砂紙木塊 */}
      <rect x="66" y="42" width="30" height="14" rx="2" fill="#8fa6c4" stroke={C.ink} strokeWidth="1.2" />
      <text x="81" y="52" fontSize="6.5" fill="#fff" textAnchor="middle">砂紙</text>
      {/* 運動方向 → */}
      <line x1="98" y1="38" x2="122" y2="38" stroke={C.green} strokeWidth="2" />
      <path d="M122,38 l-6,-3 v6 z" fill={C.green} />
      <text x="110" y="34" fontSize="6.8" fill={C.green} textAnchor="middle">推 →</text>
      {/* 摩擦力 ← */}
      <line x1="64" y1="50" x2="44" y2="50" stroke={C.red} strokeWidth="2" />
      <path d="M44,50 l6,-3 v6 z" fill={C.red} />
      <text x="52" y="46" fontSize="6.8" fill={C.red} textAnchor="middle">← 摩擦力</text>
      <text x="82" y="90" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">摩擦力：方向和運動相反</text>
    </g>
  ),

  // 對稱軸：沿虛線對摺，左右完全一樣（線對稱）
  'symmetry': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 對稱軸（虛線） */}
      <line x1="80" y1="16" x2="80" y2="80" stroke={C.red} strokeWidth="1.4" strokeDasharray="4 3" />
      <text x="80" y="12" fontSize="7" fill={C.red} textAnchor="middle">對稱軸</text>
      {/* 左右鏡射的花紋（牡丹雕花意象） */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(80,48) scale(${s},1)`}>
          <path d="M6,14 C6,2 26,2 26,14 C34,10 34,26 24,26 C24,34 10,34 10,26 C2,26 2,10 6,14 Z"
            fill="#5aa469" stroke="#2f6b45" strokeWidth="1.2" transform="translate(4,-16)" />
          <circle cx="18" cy="6" r="3" fill="#e0574f" />
          <rect x="4" y="18" width="22" height="4" rx="2" fill="#a9764a" />
        </g>
      ))}
      <text x="82" y="92" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">沿對稱軸對摺，左右完全一樣</text>
    </g>
  ),

  // 位值表：讀大數一格一位（以 258000＝二十五萬八千 為例，萬位＝5）
  'place-value': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <text x="80" y="18" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">位值表：一格站一位</text>
      {[
        { n: '十萬', d: '2' }, { n: '萬', d: '5', hi: true }, { n: '千', d: '8' },
        { n: '百', d: '0' }, { n: '十', d: '0' }, { n: '個', d: '0' },
      ].map((c, i) => {
        const x = 16 + i * 21
        return (
          <g key={i}>
            <rect x={x} y="28" width="21" height="14" fill={c.hi ? '#ffe8a3' : '#eef2f5'} stroke={C.sub} strokeWidth="0.8" />
            <text x={x + 10.5} y="38" fontSize="7" fill={C.sub} textAnchor="middle">{c.n}</text>
            <rect x={x} y="42" width="21" height="22" fill={c.hi ? '#fff2cc' : '#fff'} stroke={C.sub} strokeWidth="0.8" />
            <text x={x + 10.5} y="58" fontSize="13" fill={c.hi ? '#d98a00' : C.ink} textAnchor="middle" fontWeight="bold">{c.d}</text>
          </g>
        )
      })}
      <text x="80" y="80" fontSize="8" fill={C.ink} textAnchor="middle">258000 ＝ 二十五萬八千</text>
      <text x="80" y="95" fontSize="8" fill="#d98a00" textAnchor="middle" fontWeight="bold">「萬位」的數字是 5</text>
    </g>
  ),

  // 蒸發：滷鍋加熱，水受熱變水蒸氣往上跑（水的變化）
  'evaporation': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 鍋 */}
      <path d="M46,54 h68 l-6,20 h-56 z" fill="#8a949c" stroke={C.ink} strokeWidth="1.4" />
      <rect x="42" y="50" width="76" height="6" rx="2" fill="#6b7a86" />
      {/* 滷汁 */}
      <path d="M52,58 h56 l-3,10 h-50 z" fill="#7a4a24" />
      {/* 豆干 */}
      <rect x="62" y="60" width="10" height="6" rx="1" fill="#c98a4b" />
      <rect x="86" y="61" width="10" height="6" rx="1" fill="#c98a4b" />
      {/* 火 */}
      <path d="M64,80 q4,-8 8,0 q4,-8 8,0 q4,-8 8,0 q4,-8 8,0" fill="none" stroke="#e0574f" strokeWidth="2" />
      {/* 蒸發：水蒸氣往上（波浪箭頭） */}
      {[58, 80, 102].map((x, i) => (
        <g key={i}>
          <path d={`M${x},48 q4,-6 0,-12 q-4,-6 0,-12`} fill="none" stroke="#6db6d8" strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M${x},24 l-3,4 h6 z`} fill="#6db6d8" />
        </g>
      ))}
      <text x="126" y="30" fontSize="7" fill="#6db6d8" textAnchor="middle">水蒸氣</text>
      <text x="80" y="94" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">水受熱→蒸發，變成水蒸氣跑掉</text>
    </g>
  ),

  // 水循環：埤塘水蒸發→凝結成雲→下雨→回到埤塘
  'water-cycle': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <rect x="8" y="8" width="144" height="66" rx="6" fill="#dcefff" />
      {/* 太陽 */}
      <circle cx="26" cy="24" r="9" fill={C.sun} stroke={C.sunEdge} strokeWidth="1.2" />
      {/* 雲 */}
      <g fill="#f4f7fb" stroke="#b9c6d6" strokeWidth="1">
        <ellipse cx="104" cy="26" rx="16" ry="9" />
        <ellipse cx="118" cy="24" rx="11" ry="8" />
        <ellipse cx="92" cy="24" rx="10" ry="7" />
      </g>
      {/* 埤塘 */}
      <rect x="18" y="62" width="124" height="12" rx="2" fill="#6db6d8" />
      <path d="M18,64 Q80,60 142,64" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
      {/* 蒸發 ↑（左） */}
      <path d="M50,60 q4,-10 0,-18 q-4,-8 0,-14" fill="none" stroke="#3fa39a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50,28 l-3,5 h6 z" fill="#3fa39a" />
      <text x="44" y="46" fontSize="6.6" fill="#3fa39a" textAnchor="end">蒸發↑</text>
      {/* 下雨 ↓（右） */}
      {[98, 106, 114].map((x, i) => (
        <line key={i} x1={x} y1="36" x2={x - 2} y2="56" stroke="#4f8fd6" strokeWidth="1.4" strokeLinecap="round" />
      ))}
      <text x="122" y="50" fontSize="6.6" fill="#4f8fd6">下雨↓</text>
      {/* 頂部箭頭：水氣飄向雲 */}
      <path d="M58,20 q16,-6 30,4" fill="none" stroke="#3fa39a" strokeWidth="1.2" strokeDasharray="3 2" />
      <text x="82" y="88" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">水循環：蒸發→成雲→下雨→回埤塘</text>
    </g>
  ),

  // 蓄水量：埤塘剖面，水面面積 × 水深 ＝ 蓄水量（體積）
  'capacity': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 埤塘剖面（梯形土堤＋水） */}
      <path d="M24,34 h96 l10,40 h-116 z" fill="#c9b48a" stroke="#8a7648" strokeWidth="1.2" />
      <rect x="30" y="38" width="84" height="30" fill="#6db6d8" />
      <path d="M30,40 Q72,37 114,40" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
      {/* 水面面積（上緣） */}
      <line x1="30" y1="34" x2="114" y2="34" stroke="#e0574f" strokeWidth="1.4" />
      <text x="72" y="30" fontSize="7" fill="#e0574f" textAnchor="middle">水面面積</text>
      {/* 水深（左） */}
      <line x1="24" y1="38" x2="24" y2="68" stroke={C.ink} strokeWidth="1" />
      <path d="M24,38 l-3,5 h6 z M24,68 l-3,-5 h6 z" fill={C.ink} />
      <text x="14" y="55" fontSize="7" fill={C.ink} textAnchor="middle" transform="rotate(-90,14,55)">水深</text>
      {/* 1 立方公尺小方塊 */}
      <g transform="translate(128,50)">
        <path d="M0,6 l6,-4 l6,4 l-6,4 z" fill="#8fd0c6" stroke="#3fa39a" strokeWidth="0.7" />
        <path d="M0,6 v7 l6,4 v-7 z" fill="#6bbdb0" stroke="#3fa39a" strokeWidth="0.7" />
        <path d="M12,6 v7 l-6,4 v-7 z" fill="#57a99c" stroke="#3fa39a" strokeWidth="0.7" />
        <text x="6" y="26" fontSize="5.6" fill={C.sub} textAnchor="middle">1立方公尺</text>
      </g>
      <text x="70" y="90" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">蓄水量 = 水面面積 × 水深</text>
    </g>
  ),

  // 水的三態：固態（冰）⇄ 液態（水）⇄ 氣態（水蒸氣）
  'water-states': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      <text x="80" y="15" fontSize="8" fill={C.ink} textAnchor="middle" fontWeight="bold">水的三態</text>
      {/* 固態：冰塊 */}
      <g transform="translate(20,34)">
        <path d="M0,8 l10,-6 l10,6 l-10,6 z" fill="#bfe3f2" stroke="#6db6d8" strokeWidth="0.8" />
        <path d="M0,8 v12 l10,6 v-12 z" fill="#9cd2ea" stroke="#6db6d8" strokeWidth="0.8" />
        <path d="M20,8 v12 l-10,6 v-12 z" fill="#7cc0dd" stroke="#6db6d8" strokeWidth="0.8" />
        <text x="10" y="38" fontSize="6.6" fill={C.sub} textAnchor="middle">固態·冰</text>
      </g>
      {/* 液態：水 */}
      <g transform="translate(66,40)">
        <path d="M0,14 q14,-6 28,0 v6 q-14,5 -28,0 z" fill="#6db6d8" />
        <path d="M14,-2 q6,8 0,12 q-6,-4 0,-12 z" fill="#4f8fd6" />
        <text x="14" y="32" fontSize="6.6" fill={C.sub} textAnchor="middle">液態·水</text>
      </g>
      {/* 氣態：水蒸氣 */}
      <g transform="translate(116,32)">
        {[0, 8, 16].map((x, i) => (
          <path key={i} d={`M${x},22 q5,-6 0,-12 q-5,-6 0,-12`} fill="none" stroke="#b9c6d6" strokeWidth="1.6" strokeLinecap="round" />
        ))}
        <text x="8" y="40" fontSize="6.6" fill={C.sub} textAnchor="middle">氣態·水蒸氣</text>
      </g>
      {/* 轉換箭頭 */}
      <text x="46" y="46" fontSize="6.4" fill="#e0574f" textAnchor="middle">融化→</text>
      <text x="104" y="42" fontSize="6.4" fill="#e0574f" textAnchor="middle">蒸發→</text>
      <text x="80" y="94" fontSize="7.6" fill={C.ink} textAnchor="middle" fontWeight="bold">受熱：冰→水→水蒸氣；遇冷則相反</text>
    </g>
  ),

  // 水力發電：水往下沖，推動渦輪，帶動發電機發電
  'hydro-power': (
    <g fontFamily="system-ui, sans-serif">
      {panel}
      {/* 壩體＋上游水 */}
      <rect x="12" y="24" width="30" height="52" fill="#9aa7b2" stroke={C.ink} strokeWidth="1.2" />
      <rect x="12" y="24" width="16" height="52" fill="#6db6d8" />
      {/* 水往下沖 */}
      <path d="M42,40 q14,4 18,22" fill="none" stroke="#4f8fd6" strokeWidth="4" strokeLinecap="round" />
      <text x="52" y="38" fontSize="6.4" fill="#4f8fd6">水沖下</text>
      {/* 渦輪（水車） */}
      <g transform="translate(66,66)">
        <circle r="14" fill="#e8edf1" stroke={C.ink} strokeWidth="1.4" />
        {[0, 60, 120, 180, 240, 300].map((d) => {
          const a = d * Math.PI / 180
          return <line key={d} x1="0" y1="0" x2={Math.cos(a) * 13} y2={Math.sin(a) * 13} stroke={C.sub} strokeWidth="1.4" />
        })}
        <circle r="3" fill={C.ink} />
      </g>
      <text x="66" y="90" fontSize="6.4" fill={C.sub} textAnchor="middle">渦輪</text>
      {/* 發電機＋電 */}
      <rect x="96" y="52" width="30" height="24" rx="3" fill="#f2c14e" stroke="#b8892b" strokeWidth="1.2" />
      <text x="111" y="67" fontSize="12" fill="#7a5b13" textAnchor="middle" fontWeight="bold">⚡</text>
      <path d="M80,66 h14" stroke={C.ink} strokeWidth="1.4" />
      <path d="M126,58 q10,0 10,8 q0,8 -8,8" fill="none" stroke="#f2c14e" strokeWidth="1.6" />
      <text x="136" y="52" fontSize="9" fill="#e0a24f" textAnchor="middle">💡</text>
      <text x="80" y="99" fontSize="7.6" fill={C.ink} textAnchor="middle" fontWeight="bold">水沖下→轉動渦輪→發電機發電</text>
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
