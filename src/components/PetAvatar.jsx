// SVG-based full-body pet avatar with layered accessories
// viewBox 0 0 100 130 — head ~y44, body ~y92, hat above y14

// ── Evolution color palettes ──────────────────────────────────────────────────
const EVO = {
  lulu: [
    null,
    { body:'#F5DEB3', ear:'#C4A267', mark:'#C4A267', nose:'#2D1B0E' },
    { body:'#F0D0A0', ear:'#C09050', mark:'#B08040', nose:'#2D1B0E' },
    { body:'#EAC090', ear:'#B08040', mark:'#A07030', nose:'#2D1B0E' },
    { body:'#FFE580', ear:'#D4B030', mark:'#C09820', nose:'#3D2B10', glow:'#FFD700' },
  ],
  hana: [
    null,
    { body:'#8B6347', belly:'#D4B896', ear:'#7A5538', nose:'#1a0e07' },
    { body:'#7E5A3E', belly:'#C9A882', ear:'#6E4A2E', nose:'#1a0e07' },
    { body:'#6B4830', belly:'#BC9870', ear:'#5A3820', nose:'#1a0e07' },
    { body:'#3A7A9A', belly:'#A8D4E8', ear:'#2A6A8A', nose:'#0D2230', glow:'#87CEEB' },
  ],
  kotaro: [
    null,
    { body:'#7A5538', belly:'#C8A882', ear:'#6A4528', nose:'#1a0e07' },
    { body:'#6A4828', belly:'#BE9870', ear:'#5A3818', nose:'#1a0e07' },
    { body:'#5A3A1E', belly:'#B0886A', ear:'#4A2A0E', nose:'#1a0e07' },
    { body:'#2A5A32', belly:'#90D4A0', ear:'#1A4A22', nose:'#0D1F0F', glow:'#90EE90' },
  ],
}

// ── Pet bases ─────────────────────────────────────────────────────────────────

function LuluBase({ c }) {
  return (
    <g>
      {/* Right ear (behind head) */}
      <ellipse cx="72" cy="26" rx="12" ry="21" fill={c.ear} transform="rotate(18,72,26)" />
      <ellipse cx="72" cy="26" rx="7" ry="14" fill="#E8A888" opacity="0.6" transform="rotate(18,72,26)" />
      {/* Body */}
      <ellipse cx="50" cy="92" rx="27" ry="20" fill={c.body} />
      <ellipse cx="50" cy="93" rx="17" ry="13" fill="#FFF5E6" opacity="0.75" />
      {/* Head */}
      <circle cx="50" cy="44" r="30" fill={c.body} />
      {/* Forehead patch */}
      <ellipse cx="50" cy="27" rx="9" ry="7" fill={c.mark} />
      {/* Left ear (front) */}
      <ellipse cx="28" cy="26" rx="12" ry="21" fill={c.ear} transform="rotate(-18,28,26)" />
      <ellipse cx="28" cy="26" rx="7" ry="14" fill="#E8A888" opacity="0.6" transform="rotate(-18,28,26)" />
      {/* Eyes */}
      <circle cx="41" cy="44" r="7" fill="#2D1B0E" />
      <circle cx="59" cy="44" r="7" fill="#2D1B0E" />
      <circle cx="43" cy="41" r="2.5" fill="white" />
      <circle cx="61" cy="41" r="2.5" fill="white" />
      <circle cx="42" cy="45" r="2" fill="#0e0805" />
      <circle cx="60" cy="45" r="2" fill="#0e0805" />
      {/* Nose */}
      <ellipse cx="50" cy="55" rx="6" ry="4.5" fill={c.nose} />
      <ellipse cx="48.5" cy="54" rx="1.5" ry="1" fill="rgba(255,255,255,0.45)" />
      {/* Mouth */}
      <path d="M44,60 Q50,67 56,60" fill="none" stroke={c.nose} strokeWidth="1.8" strokeLinecap="round" />
      {/* Cheek blush */}
      <ellipse cx="32" cy="54" rx="7" ry="5" fill="rgba(255,160,140,0.32)" />
      <ellipse cx="68" cy="54" rx="7" ry="5" fill="rgba(255,160,140,0.32)" />
      {/* Paws */}
      <ellipse cx="33" cy="107" rx="10" ry="7" fill={c.body} />
      <ellipse cx="67" cy="107" rx="10" ry="7" fill={c.body} />
      {[28,33,38].map(x => <ellipse key={x} cx={x} cy="106" rx="3" ry="2" fill={c.mark} opacity="0.4" />)}
      {[62,67,72].map(x => <ellipse key={x} cx={x} cy="106" rx="3" ry="2" fill={c.mark} opacity="0.4" />)}
      {/* Tail */}
      <ellipse cx="78" cy="85" rx="9" ry="7" fill={c.ear} transform="rotate(-25,78,85)" />
    </g>
  )
}

function OtterBase({ c, isKotaro }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="50" cy="92" rx="25" ry="19" fill={c.body} />
      <ellipse cx="50" cy="93" rx="15" ry="12" fill={c.belly} />
      {/* Head */}
      <circle cx="50" cy="44" r="28" fill={c.body} />
      {/* Ears */}
      <circle cx="30" cy="21" r="9" fill={c.ear} />
      <circle cx="30" cy="21" r="5" fill={c.belly} opacity="0.55" />
      <circle cx="70" cy="21" r="9" fill={c.ear} />
      <circle cx="70" cy="21" r="5" fill={c.belly} opacity="0.55" />
      {/* Face patch */}
      <ellipse cx="50" cy="52" rx="16" ry="11" fill={c.belly} opacity="0.45" />
      {/* Eyes */}
      <circle cx="41" cy="42" r="7" fill="#1a0e07" />
      <circle cx="59" cy="42" r="7" fill="#1a0e07" />
      <circle cx="43" cy="39" r="2.5" fill="white" />
      <circle cx="61" cy="39" r="2.5" fill="white" />
      <circle cx="42" cy="43" r="2" fill="#0a0603" />
      <circle cx="60" cy="43" r="2" fill="#0a0603" />
      {/* Nose */}
      <ellipse cx="50" cy="52" rx="5" ry="4" fill={c.nose} />
      <ellipse cx="48.5" cy="51" rx="1.2" ry="0.8" fill="rgba(255,255,255,0.45)" />
      {/* Mouth */}
      <path d="M45,57 Q50,63 55,57" fill="none" stroke={c.nose} strokeWidth="1.8" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="22" y1="52" x2="38" y2="54" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      <line x1="22" y1="56" x2="38" y2="57" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      <line x1="62" y1="54" x2="78" y2="52" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      <line x1="62" y1="57" x2="78" y2="56" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      {/* Cheek blush */}
      <ellipse cx="33" cy="52" rx="6" ry="4" fill="rgba(255,160,140,0.28)" />
      <ellipse cx="67" cy="52" rx="6" ry="4" fill="rgba(255,160,140,0.28)" />
      {/* Kotaro chin stripe */}
      {isKotaro && <ellipse cx="50" cy="62" rx="6" ry="4" fill={c.belly} opacity="0.35" />}
      {/* Paws */}
      <ellipse cx="34" cy="106" rx="10" ry="6" fill={c.body} />
      <ellipse cx="66" cy="106" rx="10" ry="6" fill={c.body} />
      {[29,34,39].map(x => <ellipse key={x} cx={x} cy="105" rx="2.5" ry="2" fill={c.belly} opacity="0.55" />)}
      {[61,66,71].map(x => <ellipse key={x} cx={x} cy="105" rx="2.5" ry="2" fill={c.belly} opacity="0.55" />)}
      {/* Tail */}
      <ellipse cx="75" cy="88" rx="10" ry="6" fill={c.body} transform="rotate(-20,75,88)" />
    </g>
  )
}

// ── Hat / head accessories ────────────────────────────────────────────────────

function HatBow() {
  return (
    <g transform="translate(50,14)">
      <ellipse cx="-10" cy="0" rx="11" ry="8" fill="#FF69B4" />
      <ellipse cx="10"  cy="0" rx="11" ry="8" fill="#FF69B4" />
      <ellipse cx="-14" cy="-2" rx="5" ry="4" fill="#FFB6C1" opacity="0.65" />
      <ellipse cx="14"  cy="-2" rx="5" ry="4" fill="#FFB6C1" opacity="0.65" />
      <ellipse cx="0"   cy="0" rx="4.5" ry="4" fill="#FF1493" />
      <ellipse cx="-1"  cy="-1" rx="1.5" ry="1" fill="rgba(255,255,255,0.5)" />
    </g>
  )
}

function HatCap() {
  return (
    <g transform="translate(50,16)">
      <path d="M-23,0 Q-21,-29 0,-31 Q21,-29 23,0 Z" fill="#4169E1" />
      <rect x="-23" y="-8" width="46" height="10" rx="5" fill="#2D4EB0" />
      <path d="M-23,-3 Q-6,10 31,-2" fill="#1E3A8A" />
      <circle cx="0" cy="-29" r="3" fill="#2D4EB0" />
      <path d="M-18,-20 Q-15,-28 -8,-24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    </g>
  )
}

function HatCrown() {
  return (
    <g transform="translate(50,10)">
      <rect x="-21" y="-2" width="42" height="13" rx="2.5" fill="#FFD700" />
      <polygon points="-21,-2 -14,-20 -7,-2" fill="#FFD700" />
      <polygon points="-7,-2  0,-24  7,-2" fill="#FFD700" />
      <polygon points="7,-2  14,-20 21,-2" fill="#FFD700" />
      {/* Outline highlight */}
      <polygon points="-21,-2 -14,-20 -7,-2" fill="rgba(255,255,255,0.18)" />
      <polygon points="-7,-2  0,-24  7,-2" fill="rgba(255,255,255,0.18)" />
      {/* Gems */}
      <circle cx="-14" cy="-13" r="4" fill="#FF1493" />
      <circle cx="0"   cy="-18" r="4" fill="#00BFFF" />
      <circle cx="14"  cy="-13" r="4" fill="#7CFC00" />
      <circle cx="-14" cy="-15" r="1.5" fill="rgba(255,255,255,0.7)" />
      <circle cx="0"   cy="-20" r="1.5" fill="rgba(255,255,255,0.7)" />
      <circle cx="14"  cy="-15" r="1.5" fill="rgba(255,255,255,0.7)" />
    </g>
  )
}

function HatFlower() {
  const petals = [
    { cx:-24, cy:-2,  color:'#FF69B4' },
    { cx:-17, cy:-18, color:'#FF6347' },
    { cx:0,   cy:-24, color:'#FFD700' },
    { cx:17,  cy:-18, color:'#98FB98' },
    { cx:24,  cy:-2,  color:'#87CEEB' },
  ]
  const petalAngles = [0,72,144,216,288]
  return (
    <g transform="translate(50,20)">
      <path d="M-24,-2 Q0,-30 24,-2" fill="none" stroke="#5CB85C" strokeWidth="2.5" />
      {petals.map((f,i) => (
        <g key={i} transform={`translate(${f.cx},${f.cy})`}>
          {petalAngles.map(a => (
            <ellipse key={a}
              cx={+(Math.cos(a*Math.PI/180)*4.5).toFixed(2)}
              cy={+(Math.sin(a*Math.PI/180)*4.5).toFixed(2)}
              rx="3.5" ry="5.5" fill={f.color}
              transform={`rotate(${a})`}
            />
          ))}
          <circle cx="0" cy="0" r="3" fill="#FFD700" />
        </g>
      ))}
    </g>
  )
}

// ── Clothes ───────────────────────────────────────────────────────────────────

function ClothesSweater() {
  return (
    <g transform="translate(50,88)">
      {/* Left sleeve */}
      <ellipse cx="-32" cy="-2" rx="7" ry="13" fill="#FF6B9D" transform="rotate(-10,-32,-2)" />
      <rect x="-38" y="8"  width="13" height="5" rx="2.5" fill="#E8558A" />
      {/* Right sleeve */}
      <ellipse cx="32"  cy="-2" rx="7" ry="13" fill="#FF6B9D" transform="rotate(10,32,-2)" />
      <rect x="25"  y="8"  width="13" height="5" rx="2.5" fill="#E8558A" />
      {/* Body */}
      <ellipse cx="0" cy="2" rx="28" ry="20" fill="#FF6B9D" />
      {/* Stripes */}
      <path d="M-26,-5 Q0,-9 26,-5"  fill="none" stroke="#E8558A" strokeWidth="2.2" />
      <path d="M-27,1  Q0,-3 27,1"   fill="none" stroke="#E8558A" strokeWidth="2.2" />
      <path d="M-26,7  Q0,3  26,7"   fill="none" stroke="#E8558A" strokeWidth="2.2" />
      {/* Collar */}
      <path d="M-11,-16 Q0,-20 11,-16" fill="none" stroke="#FF6B9D" strokeWidth="5" strokeLinecap="round" />
      <path d="M-11,-16 Q0,-20 11,-16" fill="none" stroke="#E8558A" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

function ClothesApron() {
  return (
    <g transform="translate(50,84)">
      {/* Main apron body */}
      <ellipse cx="0" cy="10" rx="22" ry="18" fill="white" opacity="0.95" />
      {/* Bib */}
      <rect x="-10" y="-20" width="20" height="18" rx="4" fill="white" opacity="0.95" />
      {/* Neck strings */}
      <path d="M-10,-18 Q-17,-30 -7,-28" fill="none" stroke="white" strokeWidth="2.5" opacity="0.9" />
      <path d="M10,-18 Q17,-30 7,-28"  fill="none" stroke="white" strokeWidth="2.5" opacity="0.9" />
      {/* Pocket */}
      <rect x="-9" y="2" width="18" height="12" rx="3" fill="#F5F5F5" />
      <line x1="-9" y1="8" x2="9" y2="8" stroke="#EEE" strokeWidth="1" />
      {/* Waist bow */}
      <ellipse cx="-20" cy="-4" rx="7" ry="5" fill="#FFB6C1" />
      <ellipse cx="20"  cy="-4" rx="7" ry="5" fill="#FFB6C1" />
      <circle cx="0" cy="-4" r="4.5" fill="#FF69B4" />
    </g>
  )
}

function ClothesHoodie() {
  return (
    <g transform="translate(50,86)">
      {/* Left sleeve */}
      <ellipse cx="-32" cy="0"  rx="7" ry="13" fill="#7B68EE" transform="rotate(-8,-32,0)" />
      <rect x="-38" y="10" width="13" height="5" rx="2.5" fill="#6A5AE0" />
      {/* Right sleeve */}
      <ellipse cx="32"  cy="0"  rx="7" ry="13" fill="#7B68EE" transform="rotate(8,32,0)" />
      <rect x="25"  y="10" width="13" height="5" rx="2.5" fill="#6A5AE0" />
      {/* Body */}
      <ellipse cx="0" cy="6" rx="27" ry="22" fill="#7B68EE" />
      {/* Hood */}
      <path d="M-19,-14 Q-21,-28 0,-30 Q21,-28 19,-14 Q0,-18 -19,-14 Z" fill="#6A5AE0" />
      <path d="M-11,-14 Q0,-18 11,-14 Q8,-10 0,-8 Q-8,-10 -11,-14 Z" fill="#5A4ACA" />
      {/* Pouch pocket */}
      <path d="M-15,10 Q-16,20 0,22 Q16,20 15,10 Q0,14 -15,10 Z" fill="#6A5AE0" />
      {/* Zipper */}
      <line x1="0" y1="-6" x2="0" y2="16" stroke="#9B8EFF" strokeWidth="1.8" strokeDasharray="3,2" />
      <circle cx="0" cy="-6" r="2" fill="#8B7EEE" />
    </g>
  )
}

function ClothesDress() {
  return (
    <g transform="translate(50,82)">
      {/* Bodice */}
      <path d="M-16,-18 Q-20,-6 -24,12 Q0,18 24,12 Q20,-6 16,-18 Z" fill="#FF8FAB" />
      {/* Straps */}
      <rect x="-13" y="-26" width="7" height="12" rx="3.5" fill="#FF8FAB" />
      <rect x="6"   y="-26" width="7" height="12" rx="3.5" fill="#FF8FAB" />
      {/* Bodice highlight */}
      <path d="M-14,-14 Q0,-18 14,-14" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      {/* Skirt layer 1 */}
      <path d="M-24,12 Q-32,26 -20,30 Q-8,32 0,30 Q8,32 20,30 Q32,26 24,12 Z" fill="#FFB6CB" />
      {/* Skirt layer 2 */}
      <path d="M-22,18 Q-30,30 -18,34 Q-6,36 0,34 Q6,36 18,34 Q30,30 22,18 Z" fill="#FF8FAB" />
      {/* Lace dots */}
      {[-20,-12,-4,4,12,20].map((x,i) => (
        <circle key={i} cx={x} cy="34" r="3" fill="rgba(255,255,255,0.75)" />
      ))}
      {/* Bow on bodice */}
      <ellipse cx="-6" cy="-12" rx="5.5" ry="4" fill="#FF4488" />
      <ellipse cx="6"  cy="-12" rx="5.5" ry="4" fill="#FF4488" />
      <circle cx="0" cy="-12" r="3.5" fill="#CC2266" />
    </g>
  )
}

// ── Accessories (glasses / scarf / backpack / necklace) ───────────────────────

function AccGlasses() {
  return (
    <g transform="translate(50,44)">
      <circle cx="-11" cy="0" r="9" fill="rgba(173,216,230,0.28)" stroke="#5D3A1A" strokeWidth="2" />
      <circle cx="11"  cy="0" r="9" fill="rgba(173,216,230,0.28)" stroke="#5D3A1A" strokeWidth="2" />
      <line x1="-2" y1="0" x2="2" y2="0" stroke="#5D3A1A" strokeWidth="2" />
      <line x1="-20" y1="-1" x2="-28" y2="-3" stroke="#5D3A1A" strokeWidth="2" />
      <line x1="20"  y1="-1" x2="28"  y2="-3" stroke="#5D3A1A" strokeWidth="2" />
      <path d="M-19,-5 Q-15,-9 -12,-6" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
      <path d="M3,-5  Q7,-9  10,-6"  fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
    </g>
  )
}

function AccScarf() {
  return (
    <g transform="translate(50,70)">
      <path d="M-25,-5 Q0,-11 25,-5 Q27,5 0,9 Q-27,5 -25,-5 Z" fill="#FF4500" />
      <path d="M-21,-1 Q0,-7 21,-1" fill="none" stroke="#FFD700" strokeWidth="1.8" />
      <path d="M-23,3  Q0,-3 23,3"  fill="none" stroke="#FFD700" strokeWidth="1.8" />
      {/* Dangling end */}
      <rect x="10" y="7" width="7" height="22" rx="3.5" fill="#FF4500" />
      <rect x="11" y="13" width="5" height="2.5" fill="#FFD700" />
      <rect x="11" y="19" width="5" height="2.5" fill="#FFD700" />
      <path d="M10,28 L13.5,35 L17,28 Z" fill="#FF4500" />
    </g>
  )
}

function AccNecklace() {
  const n = 11
  const r = 23
  const pearls = Array.from({length: n}, (_, i) => {
    const a = (-90 + i * (180 / (n-1))) * Math.PI / 180
    return { x: +(Math.cos(a)*r).toFixed(1), y: +(Math.sin(a)*r).toFixed(1) }
  })
  return (
    <g transform="translate(50,72)">
      <path
        d={`M${pearls[0].x},${pearls[0].y} ${pearls.map(p=>`L${p.x},${p.y}`).join(' ')}`}
        fill="none" stroke="rgba(200,180,150,0.5)" strokeWidth="1"
      />
      {pearls.map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.8" fill="#FFF8F0" stroke="#DDD0C0" strokeWidth="0.5" />
      ))}
      <circle cx={pearls[Math.floor(n/2)].x} cy={pearls[Math.floor(n/2)].y} r="4.5" fill="#D4AF37" />
    </g>
  )
}

function AccBackpack() {
  return (
    <g transform="translate(78,84)">
      <rect x="-10" y="-22" width="21" height="28" rx="5" fill="#6B8CCA" />
      <rect x="-10" y="-22" width="21" height="11" rx="5" fill="#5577BB" />
      <rect x="-6"  y="-8"  width="13" height="11" rx="3" fill="#4466AA" />
      <line x1="-6" y1="-2" x2="7" y2="-2" stroke="#FFD700" strokeWidth="1.5" />
      <circle cx="-6" cy="-2" r="1.8" fill="#FFD700" />
      <path d="M-10,-18 Q-17,-4 -13,14" fill="none" stroke="#5577BB" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

// ── Stage 4 sparkles ──────────────────────────────────────────────────────────
function LegendarySparkles() {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <text x="12" y="22"  fontSize="11" textAnchor="middle">✨</text>
      <text x="82" y="26"  fontSize="9"  textAnchor="middle">⭐</text>
      <text x="10" y="92"  fontSize="9"  textAnchor="middle">✨</text>
      <text x="88" y="86"  fontSize="11" textAnchor="middle">✨</text>
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PetAvatar({ petId = 'lulu', evolutionStage = 1, equipped = [], size = 100 }) {
  const stage  = Math.max(1, Math.min(4, evolutionStage))
  const colors = EVO[petId]?.[stage] ?? EVO.lulu[1]

  const hat      = equipped.find(i => i?.category === 'hat')
  const clothes  = equipped.find(i => i?.category === 'clothes')
  const glasses  = equipped.some(i => i?.id === 'glasses')
  const scarf    = equipped.some(i => i?.id === 'scarf')
  const necklace = equipped.some(i => i?.id === 'necklace')
  const backpack = equipped.some(i => i?.id === 'backpack')
  const foodItem = equipped.find(i => i?.category === 'food')
  const toyItem  = equipped.find(i => i?.category === 'toy')

  const glowFilter = colors.glow
    ? { filter: `drop-shadow(0 0 8px ${colors.glow})` }
    : {}

  return (
    <svg
      width={size}
      height={Math.round(size * 1.3)}
      viewBox="0 0 100 130"
      style={{ overflow: 'visible', display: 'block', ...glowFilter }}
    >
      {/* Stage-4 ambient glow */}
      {colors.glow && (
        <ellipse cx="50" cy="72" rx="42" ry="52" fill={colors.glow} opacity="0.08" />
      )}

      {/* Behind-body items */}
      {backpack && <AccBackpack />}

      {/* Pet base */}
      {petId === 'lulu'
        ? <LuluBase c={colors} />
        : <OtterBase c={colors} isKotaro={petId === 'kotaro'} />
      }

      {/* Clothes (over body) */}
      {clothes?.id === 'sweater' && <ClothesSweater />}
      {clothes?.id === 'apron'   && <ClothesApron />}
      {clothes?.id === 'hoodie'  && <ClothesHoodie />}
      {clothes?.id === 'dress'   && <ClothesDress />}

      {/* Neck accessories */}
      {scarf    && <AccScarf />}
      {necklace && <AccNecklace />}

      {/* Face accessories */}
      {glasses && <AccGlasses />}

      {/* Head accessories */}
      {hat?.id === 'bow'    && <HatBow />}
      {hat?.id === 'cap'    && <HatCap />}
      {hat?.id === 'crown'  && <HatCrown />}
      {hat?.id === 'flower' && <HatFlower />}

      {/* Food held in left paw */}
      {foodItem && (
        <text x="20" y="112" fontSize="14" textAnchor="middle">{foodItem.emoji}</text>
      )}

      {/* Toy held in right paw */}
      {toyItem && (
        <text x="80" y="112" fontSize="14" textAnchor="middle">{toyItem.emoji}</text>
      )}

      {/* Stage 4 sparkles */}
      {stage === 4 && <LegendarySparkles />}
    </svg>
  )
}
