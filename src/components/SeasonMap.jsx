// 連載劇場的「真實地圖選關」：S5 環遊世界（Natural Earth 輪廓）、S6 台灣環島（縣市界）。
// 點站點開集數；S6 破案會點亮該縣市（呼應台灣拼圖）。地圖資料見 data/mapShapes.js。
import { WORLD_VB, WORLD_PATH, TW_VB, TW_COUNTIES, S5_STATIONS, S6_STATIONS } from '../data/mapShapes'
import './SeasonMap.css'

// 站點顯示資訊：label 偏移(lx,ly)避開重疊；badge 偏移(bx,by)＝徽章離錨點的散開位置（歐洲三站太擠）
const S5_META = {
  1: { zh: '東京', emoji: '🗾' },
  2: { zh: '印度', emoji: '🕌' },
  3: { zh: '埃及', emoji: '🐪' },
  4: { zh: '義大利', emoji: '🍕', ly: 4 },
  5: { zh: '肯亞', emoji: '🦁' },
  6: { zh: '大海', emoji: '🚢' },
  7: { zh: '比利時', emoji: '🍫', bx: -58, by: -38 },
  8: { zh: '法國', emoji: '🗼', bx: -62, by: 4 },
  9: { zh: '瑞士', emoji: '⌚', bx: -56, by: 44 },
  10: { zh: '紐約', emoji: '🗽' },
  11: { zh: '巴西', emoji: '🦜' },
  12: { zh: '台灣', emoji: '🧋' },
}
const S6_META = {
  1: { zh: '台北', emoji: '🏙️', lx: 30, ly: -14 },
  2: { zh: '桃園大溪', emoji: '🌀', lx: -44, ly: -8 },
  3: { zh: '苗栗淺山', emoji: '🐆', lx: -46 },
  4: { zh: '台中', emoji: '🌞', lx: 36, ly: -6 },
  5: { zh: '彰化鹿港', emoji: '🍥', lx: -46 },
  6: { zh: '澎湖', emoji: '🐚', ly: 26 },
  7: { zh: '嘉義阿里山', emoji: '🍗', lx: 52, ly: -8 },
  8: { zh: '台南府城', emoji: '🏯', lx: -44 },
  9: { zh: '高雄', emoji: '🚢', lx: -36, ly: 4 },
  10: { zh: '屏東東港', emoji: '🐟', ly: 28 },
  11: { zh: '台東鹿野', emoji: '🎈', lx: 44, ly: 10 },
  12: { zh: '宜蘭', emoji: '🍜', lx: 30, ly: 8 },
}

// S6 點亮縣市的拼圖色（未破＝紙色）
const PIECE_FILL = {
  taipei: '#ffd6a5', taoyuan: '#c9f2c7', miaoli: '#f9e29c', taichung: '#ffe08a',
  changhua: '#f7c8dd', penghu: '#bfe3f7', chiayi: '#d9c8f5', tainan: '#f5b8a9',
  kaohsiung: '#b8dcf5', pingtung: '#a9def0', taitung: '#c7ead9', yilan: '#e4f0b5',
}

function Station({ st, meta, state, onOpen, r }) {
  const { x, y } = st
  const bx = x + (meta.bx || 0), by = y + (meta.by || 0)   // 徽章中心（可能被散開）
  const lx = bx + (meta.lx || 0), ly = by + r + 11 + (meta.ly || 0)
  return (
    <g className={`smap-st smap-${state}`} onClick={() => state !== 'coming' && onOpen(st.epId)}>
      {(meta.bx || meta.by) && <>
        <line className="smap-leader" x1={x} y1={y} x2={bx} y2={by} />
        <circle className="smap-anchor" cx={x} cy={y} r={3.5} />
      </>}
      {state === 'now' && <circle className="smap-pulse" cx={bx} cy={by} r={r} />}
      <circle className="smap-badge" cx={bx} cy={by} r={r} />
      <text className="smap-emoji" x={bx} y={by + 1} fontSize={r * 1.15}>
        {state === 'locked' ? '🔒' : meta.emoji}
      </text>
      <text className="smap-no" x={bx + r * 0.78} y={by - r * 0.72} fontSize={r * 0.66}>{st.ep}</text>
      {state === 'done' && <text className="smap-check" x={bx - r * 0.82} y={by - r * 0.62} fontSize={r * 0.72}>✅</text>}
      <text className="smap-label" x={lx} y={ly} fontSize={r * 0.78}>
        {state === 'coming' ? '敬請期待' : meta.zh}
      </text>
    </g>
  )
}

export default function SeasonMap({ season, seriesSolved, isLocked, onOpen }) {
  const isTw = season.key === 'season6'
  if (!isTw && season.key !== 'season5') return null

  const stations = (isTw ? S6_STATIONS : S5_STATIONS).map((s) => {
    const ep = season.episodes.find((e) => e.no === s.ep)
    return { ...s, epId: ep?.id, state: !ep ? 'coming' : seriesSolved?.[ep.id] ? 'done' : isLocked(ep.id) ? 'locked' : 'now' }
  })
  const meta = isTw ? S6_META : S5_META
  const r = isTw ? 17 : 15
  // S6 環島是一個圈：宜蘭之後接回台北（回家）
  const route = [...stations, ...(isTw ? [stations[0]] : [])].map((s) => `${s.x},${s.y}`).join(' ')
  const done = stations.filter((s) => s.state === 'done').length

  return (
    <div className={`smap ${isTw ? 'smap-tw' : 'smap-world'}`}>
      <div className="smap-head">
        <span>{isTw ? '🧩 環島地圖 Taiwan Map' : '🗺️ 環遊世界地圖 World Map'}</span>
        <span className="smap-prog">⭐ {done}/12</span>
      </div>
      <svg viewBox={isTw ? TW_VB : WORLD_VB} role="img" aria-label={isTw ? '台灣環島地圖' : '世界地圖'}>
        <defs>
          <linearGradient id="smap-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8eccec" /><stop offset="100%" stopColor="#5aa7d8" />
          </linearGradient>
          <linearGradient id="smap-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfe6a8" /><stop offset="100%" stopColor="#a8d08d" />
          </linearGradient>
        </defs>
        <rect className="smap-bg" width="100%" height="100%" />
        {isTw
          ? Object.entries(TW_COUNTIES).map(([id, d]) => {
              const lit = stations.some((s) => s.id === id && s.state === 'done')
              return <path key={id} className={`smap-county ${lit ? 'lit' : ''}`} d={d}
                style={lit ? { fill: PIECE_FILL[id] } : undefined} />
            })
          : <path className="smap-landmass" d={WORLD_PATH} />}
        <polyline className="smap-route" points={route} />
        {stations.map((s) => (
          <Station key={s.ep} st={s} meta={meta[s.ep]} state={s.state} onOpen={onOpen} r={r} />
        ))}
      </svg>
    </div>
  )
}
