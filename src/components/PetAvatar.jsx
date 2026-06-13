// SVG-based full-body pet avatar with layered accessories
// viewBox 0 0 100 130 — head ~y44, body ~y92, hat above y14

// ── Evolution color palettes ──────────────────────────────────────────────────
const EVO = {
  lulu: [
    null,
    // Stage 1: Classic Beagle tri-color (tan face, dark saddle, white muzzle)
    { body:'#C8844A', belly:'#FFF0E0', ear:'#9A5F28', earInner:'#E8A878',
      saddle:'#2E1808', muzzle:'#FFF8EE', nose:'#1A0808' },
    // Stage 2: Warmer peachy tones
    { body:'#D49050', belly:'#FFF5E8', ear:'#AA6F38', earInner:'#F0B898',
      saddle:'#3C2010', muzzle:'#FFFAF5', nose:'#1A0808' },
    // Stage 3: Honey golden pup
    { body:'#E8B040', belly:'#FFFCE8', ear:'#C08820', earInner:'#F8D898',
      saddle:'#4A2808', muzzle:'#FFFFF5', nose:'#1A0808' },
    // Stage 4: Legendary gold + glow
    { body:'#FFD060', belly:'#FFFFFF', ear:'#E0A820', earInner:'#FFE898',
      saddle:'#604010', muzzle:'#FFFFFF', nose:'#2A1200', glow:'#FFD700' },
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
  // 黑貓：深紫黑色調，stage 4 魔法紫光
  jiji: [
    null,
    { body:'#1E0E30', belly:'#2E1A48', ear:'#160A24', nose:'#080010' },
    { body:'#160822', belly:'#26143A', ear:'#100618', nose:'#050008' },
    { body:'#0E0618', belly:'#1C0E2E', ear:'#0A0410', nose:'#030006' },
    { body:'#0A0412', belly:'#180A28', ear:'#060208', nose:'#020004', glow:'#C084FC' },
  ],
  // 北極狐：白冰藍色調，stage 4 冰藍光暈
  kitsune: [
    null,
    { body:'#EEF4FF', belly:'#FFFFFF', ear:'#D0E8FF', nose:'#5080A8' },
    { body:'#E0EEFF', belly:'#F8FCFF', ear:'#B8D8F8', nose:'#406898' },
    { body:'#D0E4FF', belly:'#F0F8FF', ear:'#A0C8F0', nose:'#305888' },
    { body:'#C0D8FF', belly:'#E8F4FF', ear:'#88B8E8', nose:'#204878', glow:'#A8D8FF' },
  ],
  // 繡眼鳥：亮綠色調，stage 4 翠綠光暈
  mejiro: [
    null,
    { body:'#6ABE78', belly:'#E0FFE8', ear:'#58A868', nose:'#2A5A30' },
    { body:'#5AAE68', belly:'#D8FFE0', ear:'#489858', nose:'#1A4A20' },
    { body:'#4A9E58', belly:'#D0FFD8', ear:'#388848', nose:'#0E3A18' },
    { body:'#3A8E48', belly:'#C8FFD0', ear:'#288038', nose:'#082A10', glow:'#90FF90' },
  ],
}

// ── Pet bases ─────────────────────────────────────────────────────────────────

function LuluBase({ c }) {
  return (
    <g>
      {/* ── Body ── */}
      <ellipse cx="50" cy="95" rx="25" ry="18" fill={c.body} />
      {/* Dark saddle on back */}
      <ellipse cx="50" cy="84" rx="18" ry="10" fill={c.saddle} opacity="0.55" />
      {/* White belly */}
      <ellipse cx="50" cy="97" rx="15" ry="11" fill={c.belly} />

      {/* ── Floppy ears (classic Beagle — hang down past the chin) ── */}
      {/* Right ear behind head */}
      <path d="M74,30 C88,36 92,58 88,70 Q82,82 74,78 C66,70 66,48 70,30 Z" fill={c.ear} />
      <path d="M74,34 C84,40 86,60 82,70 Q78,78 74,74 C70,68 70,52 72,36 Z" fill={c.earInner} opacity="0.5" />
      {/* Left ear behind head */}
      <path d="M26,30 C12,36 8,58 12,70 Q18,82 26,78 C34,70 34,48 30,30 Z" fill={c.ear} />
      <path d="M26,34 C16,40 14,60 18,70 Q22,78 26,74 C30,68 30,52 28,36 Z" fill={c.earInner} opacity="0.5" />

      {/* ── Head circle ── */}
      <circle cx="50" cy="44" r="26" fill={c.body} />

      {/* Dark saddle on top of head — classic Beagle black cap */}
      <ellipse cx="50" cy="25" rx="22" ry="16" fill={c.saddle} />

      {/* Tan eye-brow patches */}
      <ellipse cx="38" cy="40" rx="9.5" ry="7.5" fill={c.body} opacity="0.9" />
      <ellipse cx="62" cy="40" rx="9.5" ry="7.5" fill={c.body} opacity="0.9" />

      {/* White forehead blaze */}
      <ellipse cx="50" cy="33" rx="5" ry="9" fill={c.belly} opacity="0.8" />

      {/* Muzzle — lighter box area */}
      <ellipse cx="50" cy="56" rx="15" ry="11" fill={c.muzzle} />

      {/* Eyes */}
      <circle cx="38" cy="42" r="6.5" fill="#2D1200" />
      <circle cx="62" cy="42" r="6.5" fill="#2D1200" />
      <circle cx="40" cy="39" r="2.2" fill="white" />
      <circle cx="64" cy="39" r="2.2" fill="white" />
      <circle cx="39" cy="43" r="1.8" fill="#0e0800" />
      <circle cx="63" cy="43" r="1.8" fill="#0e0800" />

      {/* Nose — wide & square, classic Beagle */}
      <rect x="43" y="50" width="14" height="9" rx="4" fill={c.nose} />
      <ellipse cx="47" cy="51.5" rx="2" ry="1.2" fill="rgba(255,255,255,0.4)" />
      {/* Nose line */}
      <line x1="50" y1="59" x2="50" y2="63" stroke={c.nose} strokeWidth="1.4" />

      {/* Mouth */}
      <path d="M44,63 Q50,70 56,63" fill="none" stroke={c.nose} strokeWidth="1.8" strokeLinecap="round" />

      {/* Cheek blush */}
      <ellipse cx="29" cy="54" rx="6.5" ry="4.5" fill="rgba(255,160,140,0.28)" />
      <ellipse cx="71" cy="54" rx="6.5" ry="4.5" fill="rgba(255,160,140,0.28)" />

      {/* ── Paws ── */}
      <ellipse cx="34" cy="107" rx="11" ry="7" fill={c.body} />
      <ellipse cx="66" cy="107" rx="11" ry="7" fill={c.body} />
      {[29,34,39].map(x => <ellipse key={x} cx={x} cy="106" rx="3.2" ry="2.5" fill={c.saddle} opacity="0.3" />)}
      {[61,66,71].map(x => <ellipse key={x} cx={x} cy="106" rx="3.2" ry="2.5" fill={c.saddle} opacity="0.3" />)}

      {/* ── Tail — upright Beagle tail with white tip ── */}
      <path d="M73,90 C86,78 88,64 78,60 C72,58 68,64 71,70"
        fill="none" stroke={c.body} strokeWidth="9" strokeLinecap="round" />
      <path d="M73,90 C86,78 88,64 78,60 C72,58 68,64 71,70"
        fill="none" stroke={c.belly} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      {/* White tip */}
      <circle cx="78" cy="60" r="5" fill={c.belly} />
    </g>
  )
}

function MejiroBase({ c }) {
  return (
    <g>
      {/* ── Tail feathers ── */}
      <path d="M42,104 Q44,116 50,120 Q56,116 58,104 Q54,108 50,109 Q46,108 42,104 Z" fill={c.ear} />
      <path d="M44,107 Q46,114 50,117 Q54,114 56,107 Z" fill={c.body} opacity="0.55" />

      {/* ── Left wing ── */}
      <path d="M29,76 C14,80 12,98 20,108 Q30,113 37,103 Q27,94 29,76 Z" fill={c.ear} />
      <path d="M31,83 C21,88 21,101 27,108 Q33,110 35,102 Z" fill={c.body} opacity="0.48" />
      <path d="M24,89 Q27,97 25,106" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <path d="M20,95 Q23,101 21,108" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

      {/* ── Right wing ── */}
      <path d="M71,76 C86,80 88,98 80,108 Q70,113 63,103 Q73,94 71,76 Z" fill={c.ear} />
      <path d="M69,83 C79,88 79,101 73,108 Q67,110 65,102 Z" fill={c.body} opacity="0.48" />
      <path d="M76,89 Q73,97 75,106" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <path d="M80,95 Q77,101 79,108" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

      {/* ── Body ── */}
      <ellipse cx="50" cy="90" rx="21" ry="18" fill={c.body} />
      <ellipse cx="50" cy="93" rx="13" ry="11" fill={c.belly} />

      {/* ── Neck (fills gap between head & body) ── */}
      <ellipse cx="50" cy="67" rx="11" ry="8" fill={c.body} />

      {/* ── Head ── */}
      <circle cx="50" cy="42" r="23" fill={c.body} />
      {/* Crown cap — slightly darker patch on top */}
      <ellipse cx="50" cy="22" rx="18" ry="12" fill={c.ear} opacity="0.5" />

      {/* ── White eye rings — 繡眼鳥最招牌的特徵！ ── */}
      <circle cx="37" cy="40" r="10.5" fill="white" />
      <circle cx="63" cy="40" r="10.5" fill="white" />
      <circle cx="37" cy="40" r="8.5" fill="#F4FFF6" />
      <circle cx="63" cy="40" r="8.5" fill="#F4FFF6" />

      {/* ── Eyes ── */}
      <circle cx="37" cy="40" r="6.2" fill="#181818" />
      <circle cx="63" cy="40" r="6.2" fill="#181818" />
      {/* Main highlight */}
      <circle cx="39.5" cy="37.2" r="2.4" fill="white" />
      <circle cx="65.5" cy="37.2" r="2.4" fill="white" />
      {/* Pupil depth */}
      <circle cx="37.8" cy="41" r="1.6" fill="#060606" />
      <circle cx="63.8" cy="41" r="1.6" fill="#060606" />
      {/* Tiny sparkle */}
      <circle cx="35.8" cy="38.2" r="0.9" fill="rgba(255,255,255,0.75)" />
      <circle cx="61.8" cy="38.2" r="0.9" fill="rgba(255,255,255,0.75)" />

      {/* ── Beak ── */}
      {/* Upper mandible */}
      <path d="M44,51 Q50,47.5 56,51 L53,58.5 L47,58.5 Z" fill="#D4A418" />
      {/* Lower mandible */}
      <path d="M47,58.5 L53,58.5 Q51,63 50,64 Q49,63 47,58.5 Z" fill="#B88A10" />
      {/* Beak shine */}
      <ellipse cx="48.5" cy="52.2" rx="2.2" ry="1.3" fill="rgba(255,255,255,0.38)" />

      {/* ── Throat patch (黃綠色喉部，真實繡眼鳥特徵) ── */}
      <ellipse cx="50" cy="63" rx="7" ry="4.5" fill={c.belly} opacity="0.8" />

      {/* ── Cheek blush ── */}
      <ellipse cx="23" cy="46" rx="5.5" ry="4" fill="rgba(255,160,140,0.28)" />
      <ellipse cx="77" cy="46" rx="5.5" ry="4" fill="rgba(255,160,140,0.28)" />

      {/* ── Legs ── */}
      <line x1="43" y1="108" x2="38" y2="120" stroke="#B88A10" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="57" y1="108" x2="62" y2="120" stroke="#B88A10" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left foot */}
      <line x1="38" y1="120" x2="30" y2="121" stroke="#B88A10" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="120" x2="35" y2="126" stroke="#B88A10" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="38" y1="120" x2="41" y2="126" stroke="#B88A10" strokeWidth="1.8" strokeLinecap="round" />
      {/* Right foot */}
      <line x1="62" y1="120" x2="70" y2="121" stroke="#B88A10" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="120" x2="59" y2="126" stroke="#B88A10" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="62" y1="120" x2="65" y2="126" stroke="#B88A10" strokeWidth="1.8" strokeLinecap="round" />
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

// ── Extra clothes ─────────────────────────────────────────────────────────────

function ClothesKimono() {
  return (
    <g transform="translate(50,82)">
      <path d="M-22,-10 Q-34,0 -32,18 Q-26,26 -18,20 Q-20,8 -18,-6 Z" fill="#C0006B" />
      <path d="M22,-10 Q34,0 32,18 Q26,26 18,20 Q20,8 18,-6 Z" fill="#C0006B" />
      <path d="M-20,-8 Q-22,14 -18,26 Q0,32 18,26 Q22,14 20,-8 Z" fill="#C0006B" />
      <path d="M-6,-20 Q2,-4 -2,26 L-14,26 Q-16,12 -16,-8 Z" fill="#E0007B" />
      <path d="M-6,-20 Q0,-24 6,-20" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="-20" y="4" width="40" height="10" rx="2" fill="#FFD700" />
      <rect x="-16" y="6" width="32" height="6" rx="1" fill="#FFC400" />
      <ellipse cx="0" cy="9" rx="6" ry="5" fill="#FF8C00" />
      <circle cx="-10" cy="-2" r="3.5" fill="rgba(255,192,203,0.7)" />
      <circle cx="10" cy="18" r="3" fill="rgba(255,192,203,0.6)" />
      <circle cx="-4" cy="20" r="2.5" fill="rgba(255,192,203,0.5)" />
    </g>
  )
}

function ClothesRaincoat() {
  return (
    <g transform="translate(50,86)">
      <ellipse cx="-31" cy="0" rx="7" ry="13" fill="#FF6B35" transform="rotate(-8,-31,0)" />
      <rect x="-37" y="10" width="13" height="5" rx="2.5" fill="#E05528" />
      <ellipse cx="31" cy="0" rx="7" ry="13" fill="#FF6B35" transform="rotate(8,31,0)" />
      <rect x="24" y="10" width="13" height="5" rx="2.5" fill="#E05528" />
      <ellipse cx="0" cy="6" rx="26" ry="21" fill="#FF6B35" />
      <path d="M-18,-16 Q-20,-28 0,-30 Q20,-28 18,-16 Q0,-20 -18,-16 Z" fill="#E05528" />
      <path d="M-10,-16 Q0,-20 10,-16 Q7,-12 0,-10 Q-7,-12 -10,-16 Z" fill="#CC4820" />
      <circle cx="-12" cy="0" r="3.5" fill="#FFD700" />
      <circle cx="2" cy="3" r="3" fill="#87CEEB" />
      <circle cx="12" cy="-2" r="3.5" fill="#98FB98" />
      <circle cx="-4" cy="12" r="3" fill="#FF69B4" />
      <circle cx="8" cy="10" r="2.5" fill="#DDA0DD" />
      <circle cx="0" cy="-4" r="2" fill="white" opacity="0.9" />
      <circle cx="0" cy="5" r="2" fill="white" opacity="0.9" />
    </g>
  )
}

function ClothesAstronaut() {
  return (
    <g transform="translate(50,80)">
      <ellipse cx="-31" cy="0" rx="8" ry="14" fill="#E0E8F8" transform="rotate(-8,-31,0)" />
      <rect x="-37" y="10" width="14" height="6" rx="3" fill="#B8C8D8" />
      <ellipse cx="31" cy="0" rx="8" ry="14" fill="#E0E8F8" transform="rotate(8,31,0)" />
      <rect x="23" y="10" width="14" height="6" rx="3" fill="#B8C8D8" />
      <ellipse cx="0" cy="6" rx="27" ry="22" fill="#E0E8F8" />
      <rect x="-14" y="-8" width="28" height="20" rx="5" fill="#C0C8D8" />
      <rect x="-10" y="-6" width="20" height="6" rx="3" fill="#5088AA" />
      <circle cx="-6" cy="8" r="3" fill="#FF6B6B" />
      <circle cx="2" cy="8" r="3" fill="#6BCB77" />
      <circle cx="10" cy="8" r="3" fill="#FFD700" />
      <circle cx="0" cy="-18" r="14" fill="none" stroke="#B8C8D8" strokeWidth="4" />
      <circle cx="0" cy="-18" r="10" fill="rgba(100,180,255,0.3)" />
      <circle cx="0" cy="-18" r="10" fill="none" stroke="#90B8D8" strokeWidth="1.5" />
      <rect x="-21" y="-4" width="10" height="7" rx="1.5" fill="#CC2222" />
      <line x1="-21" y1="-1" x2="-11" y2="-1" stroke="white" strokeWidth="1" />
    </g>
  )
}

// ── Extra accessories ─────────────────────────────────────────────────────────

function AccWings() {
  return (
    <g>
      <path d="M22,80 C6,62 0,44 12,36 C18,32 22,46 24,62 Z" fill="white" stroke="#E0E0FF" strokeWidth="1.2" />
      <path d="M22,80 C8,66 4,52 14,44 C18,40 22,52 24,66 Z" fill="rgba(220,220,255,0.55)" />
      <line x1="12" y1="38" x2="22" y2="74" stroke="rgba(180,180,230,0.4)" strokeWidth="1" />
      <line x1="18" y1="36" x2="24" y2="70" stroke="rgba(180,180,230,0.4)" strokeWidth="1" />
      <path d="M78,80 C94,62 100,44 88,36 C82,32 78,46 76,62 Z" fill="white" stroke="#E0E0FF" strokeWidth="1.2" />
      <path d="M78,80 C92,66 96,52 86,44 C82,40 78,52 76,66 Z" fill="rgba(220,220,255,0.55)" />
      <line x1="88" y1="38" x2="78" y2="74" stroke="rgba(180,180,230,0.4)" strokeWidth="1" />
      <line x1="82" y1="36" x2="76" y2="70" stroke="rgba(180,180,230,0.4)" strokeWidth="1" />
    </g>
  )
}

function AccSunglasses() {
  return (
    <g transform="translate(50,44)">
      <ellipse cx="-12" cy="0" rx="10" ry="8" fill="rgba(0,0,0,0.78)" stroke="#444" strokeWidth="1.5" />
      <ellipse cx="12" cy="0" rx="10" ry="8" fill="rgba(0,0,0,0.78)" stroke="#444" strokeWidth="1.5" />
      <ellipse cx="-9" cy="-2" rx="3" ry="2" fill="rgba(255,255,255,0.14)" />
      <ellipse cx="15" cy="-2" rx="3" ry="2" fill="rgba(255,255,255,0.14)" />
      <line x1="-2" y1="0" x2="2" y2="0" stroke="#444" strokeWidth="2" />
      <line x1="-22" y1="-2" x2="-28" y2="-4" stroke="#444" strokeWidth="2" />
      <line x1="22" y1="-2" x2="28" y2="-4" stroke="#444" strokeWidth="2" />
    </g>
  )
}

function AccMedal() {
  return (
    <g transform="translate(50,74)">
      <path d="M-5,-18 L-7,-4 L0,-6 L7,-4 L5,-18 Z" fill="#4169E1" />
      <path d="M-5,-18 L-2,-8 L0,-14 L2,-8 L5,-18 Z" fill="#2D55CC" />
      <circle cx="0" cy="4" r="12" fill="#FFD700" />
      <circle cx="0" cy="4" r="9" fill="#FFDF00" stroke="#DAA520" strokeWidth="0.5" />
      <text x="0" y="8.5" fontSize="10" fontWeight="900" textAnchor="middle" fill="#8B6914" fontFamily="sans-serif">1</text>
    </g>
  )
}

function AccMagicWand() {
  return (
    <g>
      <line x1="74" y1="110" x2="56" y2="78" stroke="#6B3A1A" strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="56,62 58.2,68 64.8,68 59.4,72 61.6,78 56,74 50.4,78 52.6,72 47.2,68 53.8,68" fill="#FFD700" />
      <circle cx="68" cy="72" r="2.5" fill="#FFD700" opacity="0.9" />
      <circle cx="46" cy="68" r="2" fill="#FF69B4" opacity="0.8" />
      <circle cx="64" cy="84" r="1.5" fill="#87CEEB" opacity="0.8" />
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

function HatWizard() {
  return (
    <g transform="translate(50,18)">
      <ellipse cx="0" cy="0" rx="24" ry="6" fill="#2D1B69" />
      <path d="M-16,0 Q-6,-18 0,-36 Q6,-18 16,0 Z" fill="#4A1AA0" />
      <polygon points="0,-28 1.8,-24 6,-24 2.8,-21 4,-17 0,-19.5 -4,-17 -2.8,-21 -6,-24 -1.8,-24" fill="#FFD700" />
      <path d="M-16,-1 Q0,-5 16,-1" fill="none" stroke="#9B59B6" strokeWidth="3" />
      <circle cx="-7" cy="-12" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="10" cy="-8" r="1.2" fill="#FFD700" opacity="0.7" />
    </g>
  )
}

function HatSanta() {
  return (
    <g transform="translate(50,18)">
      <ellipse cx="0" cy="0" rx="22" ry="6" fill="white" />
      <path d="M-14,0 Q-8,-14 4,-28 Q10,-20 12,-8 Q8,-14 0,-2 Z" fill="#CC0000" />
      <circle cx="5" cy="-28" r="6" fill="white" />
      <path d="M-14,0 Q-8,-12 2,-24 Q-2,-16 -2,-6 Z" fill="rgba(0,0,0,0.07)" />
    </g>
  )
}

function HatHelmet() {
  return (
    <g transform="translate(50,20)">
      <path d="M-22,4 Q-24,-16 0,-22 Q24,-16 22,4 Z" fill="#5A7040" />
      <rect x="-25" y="1" width="50" height="7" rx="3.5" fill="#4A5C30" />
      <ellipse cx="-10" cy="-8" rx="5" ry="4" fill="#3A5020" opacity="0.5" />
      <ellipse cx="8" cy="-14" rx="4" ry="3" fill="#3A5020" opacity="0.5" />
      <ellipse cx="0" cy="-6" rx="3.5" ry="3" fill="#3A5020" opacity="0.4" />
      <polygon points="0,-18 1.5,-14 5,-14 2.5,-11.5 3.5,-8 0,-10 -3.5,-8 -2.5,-11.5 -5,-14 -1.5,-14" fill="#FFD700" />
    </g>
  )
}

// ── Exam subject crowns ───────────────────────────────────────────────────────

function CrownSubject({ mainColor, gemColor, symbol }) {
  return (
    <g transform="translate(50,10)">
      <polygon points="-22,-2 -15,-22 -7,-2" fill={mainColor} />
      <polygon points="-7,-2  0,-26  7,-2" fill={mainColor} />
      <polygon points="7,-2  15,-22 22,-2" fill={mainColor} />
      <polygon points="-22,-2 -15,-22 -7,-2" fill="rgba(255,255,255,0.18)" />
      <polygon points="-7,-2  0,-26  7,-2" fill="rgba(255,255,255,0.18)" />
      <rect x="-22" y="-2" width="44" height="14" rx="3" fill={mainColor} />
      <rect x="-22" y="-2" width="44" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
      {/* Side gems */}
      <circle cx="-15" cy="-14" r="4.5" fill={gemColor} />
      <circle cx="15"  cy="-14" r="4.5" fill={gemColor} />
      <circle cx="-13" cy="-16" r="1.6" fill="rgba(255,255,255,0.75)" />
      <circle cx="13"  cy="-16" r="1.6" fill="rgba(255,255,255,0.75)" />
      {/* Center gem with subject symbol */}
      <circle cx="0" cy="-19" r="7.5" fill={gemColor} />
      <circle cx="0" cy="-19" r="7.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <circle cx="-2.5" cy="-22" r="2.5" fill="rgba(255,255,255,0.55)" />
      <text x="0" y="-19" fontSize="9" fontWeight="900" textAnchor="middle"
        dominantBaseline="central" fill="white" fontFamily="sans-serif">{symbol}</text>
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

  const hat        = equipped.find(i => i?.category === 'hat')
  const clothes    = equipped.find(i => i?.category === 'clothes')
  const glasses    = equipped.some(i => i?.id === 'glasses')
  const scarf      = equipped.some(i => i?.id === 'scarf')
  const necklace   = equipped.some(i => i?.id === 'necklace')
  const backpack   = equipped.some(i => i?.id === 'backpack')
  const wings      = equipped.some(i => i?.id === 'wings')
  const sunglasses = equipped.some(i => i?.id === 'sunglasses')
  const medal      = equipped.some(i => i?.id === 'medal')
  const magicWand  = equipped.some(i => i?.id === 'magic_wand')
  const examCrown  = equipped.find(i => ['crown_math','crown_social','crown_nature','crown_chinese'].includes(i?.id))
  const foodItem   = equipped.find(i => i?.category === 'food')
  const toyItem    = equipped.find(i => i?.category === 'toy')

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
      {wings   && <AccWings />}
      {backpack && <AccBackpack />}

      {/* Pet base */}
      {petId === 'lulu'
        ? <LuluBase c={colors} />
        : petId === 'mejiro'
          ? <MejiroBase c={colors} />
          : <OtterBase c={colors} isKotaro={petId === 'kotaro'} />
      }

      {/* LULU stage markings */}
      {petId === 'lulu' && stage === 2 && (
        /* Stage 2: pink heart on forehead blaze */
        <g transform="translate(50,31)">
          <path
            d="M0,-3 C-1.5,-6 -6,-4.5 -6,-1.5 C-6,1.5 -3,4.5 0,7.5 C3,4.5 6,1.5 6,-1.5 C6,-4.5 1.5,-6 0,-3 Z"
            fill="#FF69B4" opacity="0.9"
          />
        </g>
      )}
      {petId === 'lulu' && stage === 3 && (
        /* Stage 3: gold stars on cheeks */
        <g>
          <polygon
            points="29,50 30.2,52.4 32.8,52.8 30.9,54.6 31.4,57.2 29,56 26.6,57.2 27.1,54.6 25.2,52.8 27.8,52.4"
            fill="#FFD700" opacity="0.92"
          />
          <polygon
            points="71,50 72.2,52.4 74.8,52.8 72.9,54.6 73.4,57.2 71,56 68.6,57.2 69.1,54.6 67.2,52.8 69.8,52.4"
            fill="#FFD700" opacity="0.92"
          />
        </g>
      )}

      {/* Mejiro stage markings */}
      {petId === 'mejiro' && stage === 2 && (
        /* Stage 2: 喉部出現亮黃條紋 */
        <ellipse cx="50" cy="63" rx="5" ry="5.5" fill="#FFE040" opacity="0.75" />
      )}
      {petId === 'mejiro' && stage === 3 && (
        /* Stage 3: 翅膀末端閃金點 */
        <g>
          <circle cx="20" cy="101" r="3" fill="#FFD700" opacity="0.85" />
          <circle cx="80" cy="101" r="3" fill="#FFD700" opacity="0.85" />
          <circle cx="16" cy="95"  r="1.8" fill="#FFD700" opacity="0.55" />
          <circle cx="84" cy="95"  r="1.8" fill="#FFD700" opacity="0.55" />
        </g>
      )}

      {/* Clothes (over body) */}
      {clothes?.id === 'sweater'   && <ClothesSweater />}
      {clothes?.id === 'apron'     && <ClothesApron />}
      {clothes?.id === 'hoodie'    && <ClothesHoodie />}
      {clothes?.id === 'dress'     && <ClothesDress />}
      {clothes?.id === 'kimono'    && <ClothesKimono />}
      {clothes?.id === 'raincoat'  && <ClothesRaincoat />}
      {clothes?.id === 'astronaut' && <ClothesAstronaut />}

      {/* Neck accessories */}
      {medal    && <AccMedal />}
      {scarf    && <AccScarf />}
      {necklace && <AccNecklace />}

      {/* Face accessories */}
      {glasses    && <AccGlasses />}
      {sunglasses && <AccSunglasses />}

      {/* Head accessories */}
      {hat?.id === 'bow'        && <HatBow />}
      {hat?.id === 'cap'        && <HatCap />}
      {hat?.id === 'crown'      && <HatCrown />}
      {hat?.id === 'flower'     && <HatFlower />}
      {hat?.id === 'wizard_hat' && <HatWizard />}
      {hat?.id === 'santa_hat'  && <HatSanta />}
      {hat?.id === 'helmet'     && <HatHelmet />}
      {examCrown?.id === 'crown_math'    && <CrownSubject mainColor="#1B7FE0" gemColor="#A8D4FF" symbol="π" />}
      {examCrown?.id === 'crown_social'  && <CrownSubject mainColor="#2E9E44" gemColor="#98FB98" symbol="地" />}
      {examCrown?.id === 'crown_nature'  && <CrownSubject mainColor="#7048E8" gemColor="#C8A8FF" symbol="理" />}
      {examCrown?.id === 'crown_chinese' && <CrownSubject mainColor="#E03030" gemColor="#FFB0B0" symbol="文" />}

      {/* Food held in left paw */}
      {foodItem && (
        <text x="20" y="112" fontSize="14" textAnchor="middle">{foodItem.emoji}</text>
      )}

      {/* Toy or wand held in right paw */}
      {magicWand
        ? <AccMagicWand />
        : toyItem && <text x="80" y="112" fontSize="14" textAnchor="middle">{toyItem.emoji}</text>
      }

      {/* Stage 4 sparkles */}
      {stage === 4 && <LegendarySparkles />}
    </svg>
  )
}
