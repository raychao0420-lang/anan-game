// SVG art for home decoration items — matches the flat, layered style of PetAvatar.
// viewBox 0 0 100 100, objects rest on the floor around y≈90.
// Any id without art here falls back to its shop emoji (see DecoArt below).
import { SHOP_ITEMS } from '../data/shop'

// ── Furniture art ───────────────────────────────────────────────────────────
const ART = {
  sofa: (
    <g>
      <ellipse cx="50" cy="90" rx="40" ry="7" fill="rgba(0,0,0,0.12)" />
      <rect x="12" y="56" width="76" height="24" rx="10" fill="#FF9EBB" />
      <rect x="10" y="46" width="18" height="34" rx="9" fill="#FF86A9" />
      <rect x="72" y="46" width="18" height="34" rx="9" fill="#FF86A9" />
      <rect x="26" y="50" width="48" height="18" rx="8" fill="#FFC0D4" />
      <rect x="30" y="52" width="18" height="12" rx="5" fill="#FFDCE7" />
      <rect x="52" y="52" width="18" height="12" rx="5" fill="#FFDCE7" />
      <rect x="18" y="78" width="6" height="8" rx="2" fill="#C96A86" />
      <rect x="76" y="78" width="6" height="8" rx="2" fill="#C96A86" />
    </g>
  ),
  plant: (
    <g>
      <ellipse cx="50" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.12)" />
      <path d="M50,60 C40,40 30,34 34,20 C44,26 48,40 50,52 Z" fill="#7CC26A" />
      <path d="M50,58 C60,38 70,32 66,18 C56,24 52,38 50,52 Z" fill="#8BD17C" />
      <path d="M50,62 C48,44 46,30 50,22 C54,30 52,46 50,60 Z" fill="#6FB85C" />
      <path d="M36,70 L64,70 L60,90 L40,90 Z" fill="#E88B4E" />
      <rect x="34" y="66" width="32" height="8" rx="3" fill="#F5A063" />
      <ellipse cx="50" cy="70" rx="15" ry="3" fill="#5A3A22" opacity="0.4" />
    </g>
  ),
  tent: (
    <g>
      <ellipse cx="50" cy="90" rx="36" ry="6" fill="rgba(0,0,0,0.12)" />
      <path d="M50,22 L86,86 L14,86 Z" fill="#6EC6FF" />
      <path d="M50,22 L68,86 L14,86 Z" fill="#8AD3FF" />
      <path d="M50,22 L50,86 L30,86 Q40,50 50,22 Z" fill="#FFE08A" />
      <path d="M50,30 Q60,60 66,86 L50,86 Z" fill="#4FA9E8" />
      <circle cx="50" cy="20" r="4" fill="#FFD166" />
      <path d="M50,86 L50,50 Q42,66 40,86 Z" fill="#2C2038" opacity="0.5" />
    </g>
  ),
  pet_bed: (
    <g>
      <ellipse cx="50" cy="88" rx="38" ry="10" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="80" rx="36" ry="14" fill="#B79CE0" />
      <ellipse cx="50" cy="76" rx="28" ry="10" fill="#8E6FD0" />
      <ellipse cx="50" cy="74" rx="22" ry="7" fill="#EDE3FF" />
      <ellipse cx="42" cy="73" rx="7" ry="4" fill="#FFF" opacity="0.7" />
    </g>
  ),
  painting: (
    <g>
      <rect x="20" y="24" width="60" height="50" rx="4" fill="#C98A4E" />
      <rect x="26" y="30" width="48" height="38" rx="2" fill="#FDF6E3" />
      <path d="M26,58 L44,42 L56,54 L66,44 L74,52 L74,68 L26,68 Z" fill="#8BD17C" />
      <circle cx="62" cy="38" r="6" fill="#FFD166" />
      <path d="M26,68 L40,58 L52,66 L74,54 L74,68 Z" fill="#5AA85C" />
    </g>
  ),
  rainbow: (
    <g>
      <path d="M18,86 A32,32 0 0 1 82,86" fill="none" stroke="#FF6B6B" strokeWidth="7" />
      <path d="M25,86 A25,25 0 0 1 75,86" fill="none" stroke="#FFD166" strokeWidth="7" />
      <path d="M32,86 A18,18 0 0 1 68,86" fill="none" stroke="#8BD17C" strokeWidth="7" />
      <path d="M39,86 A11,11 0 0 1 61,86" fill="none" stroke="#6EC6FF" strokeWidth="7" />
      <circle cx="20" cy="84" r="7" fill="#FFF" opacity="0.9" />
      <circle cx="80" cy="84" r="7" fill="#FFF" opacity="0.9" />
    </g>
  ),
  disco: (
    <g>
      <line x1="50" y1="10" x2="50" y2="30" stroke="#999" strokeWidth="3" />
      <circle cx="50" cy="50" r="22" fill="#C9D6E8" />
      <circle cx="50" cy="50" r="22" fill="url(#discoGrad)" />
      <g stroke="#8FA8C8" strokeWidth="1" opacity="0.7">
        <line x1="28" y1="50" x2="72" y2="50" /><line x1="50" y1="28" x2="50" y2="72" />
        <line x1="34" y1="34" x2="66" y2="66" /><line x1="66" y1="34" x2="34" y2="66" />
      </g>
      <rect x="40" y="70" width="6" height="6" fill="#FF6B6B" opacity="0.8" />
      <rect x="56" y="74" width="6" height="6" fill="#6EC6FF" opacity="0.8" />
      <rect x="30" y="72" width="5" height="5" fill="#FFD166" opacity="0.8" />
      <circle cx="43" cy="43" r="6" fill="#FFF" opacity="0.6" />
      <defs>
        <radialGradient id="discoGrad" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8FA8C8" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  ),
  fish_tank: (
    <g>
      <ellipse cx="50" cy="90" rx="34" ry="6" fill="rgba(0,0,0,0.12)" />
      <rect x="20" y="34" width="60" height="50" rx="8" fill="#BFE9FF" opacity="0.75" />
      <rect x="20" y="34" width="60" height="50" rx="8" fill="none" stroke="#7FB8D8" strokeWidth="3" />
      <rect x="24" y="60" width="52" height="20" rx="4" fill="#6EC6FF" opacity="0.6" />
      <path d="M24,78 Q35,66 44,78 T64,78 T76,78 L76,80 L24,80 Z" fill="#E8C88A" />
      <path d="M40,52 l10,-5 l0,10 Z" fill="#FF8C42" />
      <circle cx="46" cy="52" r="1.5" fill="#333" />
      <path d="M52,52 q6,-3 10,0" stroke="#FF8C42" strokeWidth="3" fill="none" />
      <path d="M62,66 C58,62 66,60 64,66 Z" fill="#8BD17C" />
      <circle cx="34" cy="46" r="2" fill="#FFF" opacity="0.8" />
      <circle cx="38" cy="42" r="1.4" fill="#FFF" opacity="0.7" />
    </g>
  ),
  pool: (
    <g>
      <ellipse cx="50" cy="70" rx="40" ry="22" fill="#4FA9E8" />
      <ellipse cx="50" cy="66" rx="34" ry="17" fill="#6EC6FF" />
      <path d="M22,64 Q30,58 38,64 T54,64 T70,64" stroke="#BFE9FF" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M30,74 Q38,68 46,74 T62,74" stroke="#BFE9FF" strokeWidth="2" fill="none" opacity="0.6" />
      <ellipse cx="62" cy="60" rx="5" ry="2.5" fill="#FFF" opacity="0.5" />
    </g>
  ),
  mushroom_lamp: (
    <g>
      <ellipse cx="50" cy="90" rx="24" ry="6" fill="rgba(0,0,0,0.12)" />
      <rect x="44" y="60" width="12" height="28" rx="4" fill="#FBEFE0" />
      <path d="M22,58 Q50,20 78,58 Q50,70 22,58 Z" fill="#FF6B6B" />
      <circle cx="38" cy="46" r="5" fill="#FFF" opacity="0.9" />
      <circle cx="58" cy="42" r="6" fill="#FFF" opacity="0.9" />
      <circle cx="50" cy="54" r="4" fill="#FFF" opacity="0.9" />
      <ellipse cx="50" cy="58" rx="28" ry="6" fill="#E85555" opacity="0.5" />
      <ellipse cx="50" cy="60" rx="34" ry="10" fill="#FFD166" opacity="0.25" />
    </g>
  ),
  bamboo: (
    <g>
      <ellipse cx="50" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.12)" />
      {[38, 50, 62].map((x, i) => (
        <g key={x}>
          <rect x={x - 4} y={24 + i * 4} width="8" height={64 - i * 4} rx="4" fill={i === 1 ? '#8BD17C' : '#7CC26A'} />
          {[0, 1, 2, 3].map(j => <line key={j} x1={x - 4} y1={38 + j * 14} x2={x + 4} y2={38 + j * 14} stroke="#5A9E4C" strokeWidth="1.5" />)}
        </g>
      ))}
      <path d="M42,26 Q30,18 24,24 Q34,28 42,30 Z" fill="#9BDB8C" />
      <path d="M58,22 Q70,14 76,20 Q66,24 58,26 Z" fill="#9BDB8C" />
      <path d="M50,20 Q50,10 58,8 Q56,18 52,24 Z" fill="#8BD17C" />
    </g>
  ),
  bird_perch: (
    <g>
      <ellipse cx="50" cy="90" rx="24" ry="6" fill="rgba(0,0,0,0.12)" />
      <rect x="46" y="30" width="8" height="58" rx="3" fill="#B98A5E" />
      <rect x="34" y="88" width="32" height="6" rx="3" fill="#A0764C" />
      <rect x="26" y="38" width="48" height="7" rx="3.5" fill="#C99A6E" />
      <line x1="50" y1="45" x2="50" y2="56" stroke="#A0764C" strokeWidth="4" />
      <circle cx="34" cy="52" r="5" fill="#FFD166" />
      <ellipse cx="66" cy="34" rx="6" ry="7" fill="#8BD17C" />
      <circle cx="68" cy="32" r="1.4" fill="#333" />
      <path d="M72,33 l5,1 l-5,2 Z" fill="#F5A063" />
    </g>
  ),
  fairy_light: (
    <g>
      <path d="M8,26 Q50,44 92,26" fill="none" stroke="#6B5A4A" strokeWidth="2" />
      {[[16, 30], [30, 36], [44, 39], [58, 39], [72, 36], [86, 30]].map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y - 4} x2={x} y2={y} stroke="#6B5A4A" strokeWidth="1" />
          <circle cx={x} cy={y + 3} r="4.5" fill={['#FF6B6B', '#FFD166', '#8BD17C', '#6EC6FF', '#B39DDB', '#FF8FB1'][i]} />
          <circle cx={x} cy={y + 3} r="7" fill={['#FF6B6B', '#FFD166', '#8BD17C', '#6EC6FF', '#B39DDB', '#FF8FB1'][i]} opacity="0.3" />
          <circle cx={x - 1.4} cy={y + 1.5} r="1.4" fill="#FFF" opacity="0.8" />
        </g>
      ))}
    </g>
  ),
  snow_globe: (
    <g>
      <ellipse cx="50" cy="90" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />
      <circle cx="50" cy="50" r="30" fill="#DDF0FF" opacity="0.7" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#A8CFE8" strokeWidth="2.5" />
      <path d="M32,66 Q50,58 68,66 L68,72 L32,72 Z" fill="#FFF" />
      <path d="M50,34 L58,52 L42,52 Z" fill="#8BD17C" />
      <path d="M50,44 L60,64 L40,64 Z" fill="#7CC26A" />
      <rect x="47" y="64" width="6" height="6" fill="#B98A5E" />
      {[[38, 40], [62, 44], [44, 58], [58, 60], [50, 36]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#FFF" />)}
      <path d="M30,74 Q50,68 70,74 L74,84 L26,84 Z" fill="#C98A4E" />
      <rect x="24" y="82" width="52" height="6" rx="3" fill="#A0764C" />
    </g>
  ),
  igloo: (
    <g>
      <ellipse cx="50" cy="88" rx="40" ry="7" fill="rgba(0,0,0,0.12)" />
      <path d="M14,84 A36,32 0 0 1 86,84 Z" fill="#EAF4FF" />
      <path d="M14,84 A36,32 0 0 1 86,84" fill="none" stroke="#BcdCF0" strokeWidth="1.5" />
      {[[30, 60], [50, 52], [70, 60]].map(([x, y], i) => <path key={i} d={`M${x - 12},${y} A12,10 0 0 1 ${x + 12},${y}`} fill="none" stroke="#C8E0F4" strokeWidth="1.5" />)}
      <line x1="14" y1="72" x2="86" y2="72" stroke="#C8E0F4" strokeWidth="1.5" />
      <path d="M38,84 A12,16 0 0 1 62,84 Z" fill="#9DBFDC" />
      <path d="M42,84 A8,11 0 0 1 58,84 Z" fill="#5A7A98" />
    </g>
  ),
  castle: (
    <g>
      <ellipse cx="50" cy="92" rx="38" ry="6" fill="rgba(0,0,0,0.12)" />
      <rect x="26" y="46" width="48" height="42" fill="#EBD9F0" />
      <rect x="16" y="34" width="16" height="54" fill="#E0C8E8" />
      <rect x="68" y="34" width="16" height="54" fill="#E0C8E8" />
      <path d="M12,34 L24,18 L36,34 Z" fill="#B36AC9" />
      <path d="M64,34 L76,18 L88,34 Z" fill="#B36AC9" />
      <path d="M34,46 L50,28 L66,46 Z" fill="#9B4FB5" />
      <path d="M42,88 L42,66 A8,8 0 0 1 58,66 L58,88 Z" fill="#7A3A92" />
      <rect x="20" y="44" width="6" height="8" fill="#7A3A92" /><rect x="74" y="44" width="6" height="8" fill="#7A3A92" />
      <circle cx="24" cy="16" r="2.5" fill="#FFD166" /><circle cx="76" cy="16" r="2.5" fill="#FFD166" />
      <circle cx="50" cy="26" r="2.5" fill="#FF8FB1" />
    </g>
  ),
  hot_spring: (
    <g>
      <ellipse cx="50" cy="74" rx="40" ry="20" fill="#8A6A5A" />
      <ellipse cx="50" cy="72" rx="36" ry="17" fill="#6E5244" />
      <ellipse cx="50" cy="70" rx="30" ry="14" fill="#7FD4E8" />
      <ellipse cx="50" cy="68" rx="24" ry="10" fill="#A8E4F0" opacity="0.7" />
      <path d="M40,54 q-4,-8 2,-14 q-4,8 2,12" stroke="#FFF" strokeWidth="2.5" fill="none" opacity="0.7" />
      <path d="M56,52 q-4,-8 2,-14 q-4,8 2,12" stroke="#FFF" strokeWidth="2.5" fill="none" opacity="0.6" />
      {[28, 44, 60, 72].map((x, i) => <ellipse key={i} cx={x} cy={64 + (i % 2) * 4} rx="4" ry="3" fill="#8A6A5A" />)}
    </g>
  ),
  piano: (
    <g>
      <ellipse cx="50" cy="90" rx="36" ry="6" fill="rgba(0,0,0,0.12)" />
      <path d="M24,44 L76,44 L82,54 L18,54 Z" fill="#2C2038" />
      <rect x="22" y="54" width="56" height="30" rx="3" fill="#1E1626" />
      <rect x="26" y="58" width="48" height="10" rx="2" fill="#FDF6E3" />
      {[32, 38, 44, 50, 56, 62, 68].map(x => <rect key={x} x={x} y="58" width="3" height="8" fill="#2C2038" />)}
      <path d="M76,44 Q88,36 84,50 L82,54 L76,44 Z" fill="#3E2E4E" />
      <rect x="26" y="82" width="6" height="8" fill="#1E1626" /><rect x="68" y="82" width="6" height="8" fill="#1E1626" />
      <ellipse cx="42" cy="47" rx="8" ry="1.6" fill="#FFF" opacity="0.2" />
    </g>
  ),
  fireplace: (
    <g>
      <rect x="18" y="40" width="64" height="48" rx="4" fill="#C98A5E" />
      <rect x="18" y="36" width="64" height="8" rx="3" fill="#B0764A" />
      {[[24, 48], [40, 48], [56, 48], [24, 60], [40, 60], [56, 60], [24, 72], [40, 72], [56, 72]].map(([x, y], i) => <rect key={i} x={x} y={y} width="14" height="10" rx="1.5" fill="#D89A6E" stroke="#B0764A" strokeWidth="0.8" />)}
      <rect x="34" y="56" width="32" height="30" rx="3" fill="#2C1A14" />
      <path d="M50,84 C42,74 48,70 46,62 C54,66 52,72 56,66 C60,74 58,80 50,84 Z" fill="#FF8C42" />
      <path d="M50,84 C46,78 49,74 48,68 C53,72 52,76 54,72 C57,78 55,82 50,84 Z" fill="#FFD166" />
      <ellipse cx="50" cy="86" rx="18" ry="4" fill="#FF8C42" opacity="0.4" />
    </g>
  ),
  telescope: (
    <g>
      <ellipse cx="50" cy="90" rx="26" ry="6" fill="rgba(0,0,0,0.12)" />
      <rect x="30" y="30" width="42" height="14" rx="7" fill="#42506E" transform="rotate(-28,50,40)" />
      <rect x="30" y="30" width="10" height="14" rx="5" fill="#5A6A8E" transform="rotate(-28,50,40)" />
      <circle cx="66" cy="26" r="8" fill="#8AD3FF" />
      <circle cx="66" cy="26" r="8" fill="none" stroke="#5A6A8E" strokeWidth="2" />
      <line x1="50" y1="50" x2="38" y2="86" stroke="#6B5A4A" strokeWidth="4" />
      <line x1="50" y1="50" x2="62" y2="86" stroke="#6B5A4A" strokeWidth="4" />
      <line x1="50" y1="52" x2="50" y2="80" stroke="#6B5A4A" strokeWidth="4" />
      <path d="M74,14 l1.5,3 l3,0.5 l-2.2,2 l0.6,3 l-2.9,-1.5 l-2.9,1.5 l0.6,-3 l-2.2,-2 l3,-0.5 Z" fill="#FFD166" />
    </g>
  ),
  art_studio: (
    <g>
      <ellipse cx="50" cy="90" rx="28" ry="6" fill="rgba(0,0,0,0.12)" />
      <line x1="34" y1="30" x2="26" y2="88" stroke="#B98A5E" strokeWidth="5" strokeLinecap="round" />
      <line x1="66" y1="30" x2="74" y2="88" stroke="#B98A5E" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="50" y2="86" stroke="#A0764C" strokeWidth="4" />
      <rect x="30" y="30" width="40" height="34" rx="2" fill="#FDF6E3" stroke="#B98A5E" strokeWidth="3" />
      <path d="M36,58 Q46,40 54,52 Q60,42 66,58 Z" fill="#8BD17C" />
      <circle cx="42" cy="42" r="4" fill="#FFD166" />
      <ellipse cx="72" cy="78" rx="8" ry="5" fill="#E8C88A" />
      <circle cx="68" cy="76" r="2" fill="#FF6B6B" /><circle cx="74" cy="76" r="2" fill="#6EC6FF" /><circle cx="71" cy="80" r="2" fill="#FFD166" />
    </g>
  ),
  library: (
    <g>
      <ellipse cx="50" cy="90" rx="34" ry="6" fill="rgba(0,0,0,0.12)" />
      <rect x="20" y="24" width="60" height="64" rx="4" fill="#B98A5E" />
      <rect x="24" y="28" width="52" height="16" fill="#E8D8C4" />
      <rect x="24" y="48" width="52" height="16" fill="#E8D8C4" />
      <rect x="24" y="68" width="52" height="16" fill="#E8D8C4" />
      {[[26, 28], [46, 48], [30, 68]].map(([bx, by], r) => [0, 1, 2, 3, 4].map(i => (
        <rect key={`${r}-${i}`} x={bx + i * 9.4} y={by + 1} width="8" height="14" rx="1" fill={['#FF6B6B', '#FFD166', '#8BD17C', '#6EC6FF', '#B39DDB'][(i + r) % 5]} />
      )))}
    </g>
  ),
  trampoline: (
    <g>
      <ellipse cx="50" cy="92" rx="38" ry="6" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="58" rx="36" ry="14" fill="#3E4A6E" />
      <ellipse cx="50" cy="54" rx="32" ry="11" fill="#5A6A8E" />
      <ellipse cx="50" cy="53" rx="26" ry="8" fill="#6EC6FF" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <line key={i} x1={50 + Math.cos(a) * 26} y1={53 + Math.sin(a) * 8} x2={50 + Math.cos(a) * 32} y2={54 + Math.sin(a) * 11} stroke="#FFD166" strokeWidth="1.5" />
      })}
      <line x1="18" y1="60" x2="16" y2="88" stroke="#3E4A6E" strokeWidth="4" />
      <line x1="82" y1="60" x2="84" y2="88" stroke="#3E4A6E" strokeWidth="4" />
      <line x1="34" y1="66" x2="30" y2="90" stroke="#3E4A6E" strokeWidth="4" />
      <line x1="66" y1="66" x2="70" y2="90" stroke="#3E4A6E" strokeWidth="4" />
    </g>
  ),
}

// Renders furniture art as SVG, or falls back to the item's emoji.
export default function DecoArt({ id, size = 64, emojiFallback }) {
  const art = ART[id]
  if (!art) {
    const emoji = emojiFallback ?? SHOP_ITEMS.find(i => i.id === id)?.emoji ?? '📦'
    return <span style={{ fontSize: size * 0.62, lineHeight: 1 }}>{emoji}</span>
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      {art}
    </svg>
  )
}
