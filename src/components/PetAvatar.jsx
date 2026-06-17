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
  // 企鵝：深藍背＋白肚＋橘喙，stage4 冰藍光
  penguin: [
    null,
    { body:'#3A4A6B', belly:'#F5FAFF', ear:'#2E3C5A', nose:'#1A2238' },
    { body:'#34507A', belly:'#F0F8FF', ear:'#283E60', nose:'#16203A' },
    { body:'#2C5C9A', belly:'#EAF4FF', ear:'#20467C', nose:'#122038' },
    { body:'#1E5FB0', belly:'#E6F4FF', ear:'#0A4A98', nose:'#0D2A55', glow:'#4FC3F7' },
  ],
  // 貓頭鷹：紫羽＋大眼盤，stage4 魔法夜紫
  owl: [
    null,
    { body:'#9575CD', belly:'#EDE7F6', ear:'#7E5BB5', nose:'#C8870F' },
    { body:'#7E57C2', belly:'#E2D9F2', ear:'#6A45A8', nose:'#C8870F' },
    { body:'#5E35B1', belly:'#D6C8EE', ear:'#4E2A95', nose:'#C8870F' },
    { body:'#4527A0', belly:'#2A1A4A', ear:'#38207F', nose:'#FFB300', glow:'#B388FF' },
  ],
  // 海豹：藍灰圓滾，stage4 亮藍光
  seal: [
    null,
    { body:'#8FB8D8', belly:'#E8F4FB', ear:'#7AA6C8', nose:'#3A4A55' },
    { body:'#6FA3CC', belly:'#DCEFF9', ear:'#5A8CB8', nose:'#2E3C46' },
    { body:'#4E8AC0', belly:'#CFE8F6', ear:'#3E72A8', nose:'#243038' },
    { body:'#2E72B5', belly:'#BFE0F4', ear:'#1E5C98', nose:'#16242E', glow:'#64B5F6' },
  ],
  // 河狸：暖棕＋板狀尾＋門牙，stage4 金棕光
  beaver: [
    null,
    { body:'#A1887F', belly:'#EFEBE9', ear:'#8A7068', nose:'#4A332A' },
    { body:'#8D6E63', belly:'#E5DAD3', ear:'#74584E', nose:'#3E2A22' },
    { body:'#6D4C41', belly:'#D8C7BC', ear:'#56392F', nose:'#32201A' },
    { body:'#4E342E', belly:'#C9B3A6', ear:'#3A241F', nose:'#241410', glow:'#BCAAA4' },
  ],
  // 倉鼠：金黃＋鼓頰，stage4 金光
  hamster: [
    null,
    { body:'#F5C572', belly:'#FFF6E2', ear:'#E0A84E', nose:'#6B4A2A' },
    { body:'#F0B44E', belly:'#FFF1D2', ear:'#D89636', nose:'#5C3E22' },
    { body:'#E89A2E', belly:'#FFE9BC', ear:'#C67E1C', nose:'#4E331A' },
    { body:'#DE7A18', belly:'#FFDD9C', ear:'#B8650E', nose:'#3E2712', glow:'#FFD54F' },
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

function JijiBase({ c }) {
  return (
    <g>
      {/* ── Tail (elegant curl around right side) ── */}
      <path d="M66,105 C85,96 93,76 80,62 C72,52 60,56 62,70 C64,80 76,84 68,97 Q66,102 62,108 Z"
        fill={c.body} />
      <path d="M68,103 C83,94 88,76 77,65 C71,57 63,61 65,72 C67,80 78,84 70,95 Z"
        fill={c.belly} opacity="0.3" />

      {/* ── Body ── */}
      <ellipse cx="50" cy="92" rx="22" ry="18" fill={c.body} />
      {/* Chest tuft */}
      <ellipse cx="50" cy="87" rx="9" ry="8.5" fill={c.belly} opacity="0.5" />

      {/* ── Ears (pointed triangles) ── */}
      <path d="M27,28 L18,7 L40,22 Z" fill={c.body} />
      <path d="M28,26 L22,12 L37,22 Z" fill="#FF9A9A" opacity="0.65" />
      <path d="M73,28 L82,7 L60,22 Z" fill={c.body} />
      <path d="M72,26 L78,12 L63,22 Z" fill="#FF9A9A" opacity="0.65" />

      {/* ── Head ── */}
      <circle cx="50" cy="44" r="24" fill={c.body} />

      {/* ── Eyes (large amber cat eyes with vertical slit) ── */}
      <ellipse cx="37" cy="42" rx="9" ry="8" fill="#C87820" />
      <ellipse cx="63" cy="42" rx="9" ry="8" fill="#C87820" />
      {/* Slit pupils */}
      <ellipse cx="37" cy="42" rx="3.2" ry="7.5" fill="#0A0010" />
      <ellipse cx="63" cy="42" rx="3.2" ry="7.5" fill="#0A0010" />
      <ellipse cx="37" cy="42" rx="9" ry="8" fill="none" stroke="#603010" strokeWidth="1" />
      <ellipse cx="63" cy="42" rx="9" ry="8" fill="none" stroke="#603010" strokeWidth="1" />
      {/* Highlights */}
      <circle cx="40" cy="38.5" r="2.4" fill="rgba(255,255,255,0.65)" />
      <circle cx="66" cy="38.5" r="2.4" fill="rgba(255,255,255,0.65)" />
      <circle cx="36" cy="44.5" r="1.2" fill="#050005" />
      <circle cx="62" cy="44.5" r="1.2" fill="#050005" />

      {/* ── Nose ── */}
      <path d="M47,52 L50,49.5 L53,52 L50,55.5 Z" fill="#FF8888" />
      <ellipse cx="48.5" cy="51.2" rx="1.3" ry="0.9" fill="rgba(255,255,255,0.5)" />
      <line x1="50" y1="55.5" x2="50" y2="59" stroke="#CC6666" strokeWidth="1.3" />
      <path d="M45.5,59 Q50,63.5 54.5,59" fill="none" stroke="#CC6666" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Whiskers ── */}
      <line x1="16" y1="52" x2="36" y2="53.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      <line x1="16" y1="56" x2="36" y2="56"   stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      <line x1="16" y1="60" x2="36" y2="58.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      <line x1="64" y1="53.5" x2="84" y2="52" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      <line x1="64" y1="56"   x2="84" y2="56" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      <line x1="64" y1="58.5" x2="84" y2="60" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />

      {/* ── Cheek blush ── */}
      <ellipse cx="25" cy="51" rx="6" ry="4" fill="rgba(180,80,180,0.22)" />
      <ellipse cx="75" cy="51" rx="6" ry="4" fill="rgba(180,80,180,0.22)" />

      {/* ── Paws ── */}
      <ellipse cx="34" cy="107" rx="11" ry="6.5" fill={c.body} />
      <ellipse cx="66" cy="107" rx="11" ry="6.5" fill={c.body} />
      {[29,34,39].map(x => <ellipse key={x} cx={x} cy="107" rx="3"   ry="2.2" fill={c.ear} opacity="0.55" />)}
      {[61,66,71].map(x => <ellipse key={x} cx={x} cy="107" rx="3"   ry="2.2" fill={c.ear} opacity="0.55" />)}
    </g>
  )
}

function KitsuneBase({ c }) {
  return (
    <g>
      {/* ── Fluffy tail (curl around right side) ── */}
      <path d="M60,102 C80,94 93,78 86,62 C81,51 69,52 67,62 C65,72 75,78 68,90 Q65,97 58,104 Z"
        fill={c.body} />
      <path d="M62,100 C78,92 88,78 82,65 C78,56 70,57 69,65 C68,74 76,80 70,90 Z"
        fill={c.belly} opacity="0.75" />
      {/* White fluffy tail tip */}
      <ellipse cx="87" cy="62" rx="8" ry="7" fill="white" />
      <ellipse cx="87" cy="62" rx="5.5" ry="5" fill={c.belly} />

      {/* ── Body ── */}
      <ellipse cx="50" cy="92" rx="23" ry="18" fill={c.body} />
      <ellipse cx="50" cy="93" rx="14" ry="11" fill={c.belly} />

      {/* ── Fox ears (tall, pointed) ── */}
      <path d="M24,30 L15,3 L40,20 Z" fill={c.body} />
      <path d="M26,27 L20,9 L37,20 Z" fill={c.ear} />
      <path d="M76,30 L85,3 L60,20 Z" fill={c.body} />
      <path d="M74,27 L80,9 L63,20 Z" fill={c.ear} />

      {/* ── Head ── */}
      <circle cx="50" cy="44" r="24" fill={c.body} />

      {/* ── Muzzle (slightly elongated) ── */}
      <ellipse cx="50" cy="56" rx="13" ry="8.5" fill={c.belly} opacity="0.75" />

      {/* ── Eyes (ice-blue fox eyes) ── */}
      <ellipse cx="37" cy="41" rx="8"   ry="7.5" fill={c.nose} />
      <ellipse cx="63" cy="41" rx="8"   ry="7.5" fill={c.nose} />
      <ellipse cx="37" cy="42" rx="4.5" ry="6"   fill="#1A2840" />
      <ellipse cx="63" cy="42" rx="4.5" ry="6"   fill="#1A2840" />
      <circle cx="39.5" cy="38" r="2.4" fill="white" />
      <circle cx="65.5" cy="38" r="2.4" fill="white" />
      <circle cx="37.5" cy="43.5" r="1.3" fill="#080F1A" />
      <circle cx="63.5" cy="43.5" r="1.3" fill="#080F1A" />

      {/* ── Nose ── */}
      <ellipse cx="50" cy="54" rx="5.5" ry="4" fill={c.nose} />
      <ellipse cx="48.5" cy="52.5" rx="1.5" ry="1" fill="rgba(255,255,255,0.4)" />
      <line x1="50" y1="58" x2="50" y2="61" stroke={c.nose} strokeWidth="1.3" />
      <path d="M45.5,61 Q50,65.5 54.5,61" fill="none" stroke={c.nose} strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Whiskers ── */}
      <line x1="19" y1="54"   x2="37" y2="55.5" stroke="rgba(180,200,230,0.55)" strokeWidth="1.2" />
      <line x1="19" y1="58"   x2="37" y2="58"   stroke="rgba(180,200,230,0.55)" strokeWidth="1.2" />
      <line x1="63" y1="55.5" x2="81" y2="54"   stroke="rgba(180,200,230,0.55)" strokeWidth="1.2" />
      <line x1="63" y1="58"   x2="81" y2="58"   stroke="rgba(180,200,230,0.55)" strokeWidth="1.2" />

      {/* ── Cheek blush ── */}
      <ellipse cx="27" cy="49" rx="6" ry="4" fill="rgba(180,210,255,0.4)" />
      <ellipse cx="73" cy="49" rx="6" ry="4" fill="rgba(180,210,255,0.4)" />

      {/* ── Paws ── */}
      <ellipse cx="34" cy="107" rx="11" ry="6.5" fill={c.body} />
      <ellipse cx="66" cy="107" rx="11" ry="6.5" fill={c.body} />
      {[29,34,39].map(x => <ellipse key={x} cx={x} cy="107" rx="2.8" ry="2.2" fill={c.ear} opacity="0.8" />)}
      {[61,66,71].map(x => <ellipse key={x} cx={x} cy="107" rx="2.8" ry="2.2" fill={c.ear} opacity="0.8" />)}
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

// 波波：企鵝（直立身體、白肚、橘喙橘腳、短翅）
function PenguinBase({ c }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="50" cy="86" rx="26" ry="31" fill={c.body} />
      {/* White front */}
      <ellipse cx="50" cy="90" rx="18" ry="25" fill={c.belly} />
      {/* Flippers */}
      <path d="M25,76 C15,82 15,100 23,105 L28,98 C24,92 26,82 29,78 Z" fill={c.body} />
      <path d="M75,76 C85,82 85,100 77,105 L72,98 C76,92 74,82 71,78 Z" fill={c.body} />
      {/* Feet */}
      <path d="M34,114 q-8,1 -10,6 q9,3 16,-1 Z" fill="#F5A623" />
      <path d="M66,114 q8,1 10,6 q-9,3 -16,-1 Z" fill="#F5A623" />
      {/* Head */}
      <circle cx="50" cy="40" r="25" fill={c.body} />
      {/* White face mask */}
      <path d="M50,18 C35,21 29,36 32,51 C37,61 63,61 68,51 C71,36 65,21 50,18 Z" fill={c.belly} />
      {/* Eyes */}
      <circle cx="40" cy="40" r="5.6" fill="#1A1A1A" />
      <circle cx="60" cy="40" r="5.6" fill="#1A1A1A" />
      <circle cx="42" cy="37.6" r="2" fill="white" />
      <circle cx="62" cy="37.6" r="2" fill="white" />
      <circle cx="38.6" cy="42" r="1.2" fill="#000" />
      <circle cx="58.6" cy="42" r="1.2" fill="#000" />
      {/* Beak */}
      <path d="M43,48 Q50,45.5 57,48 L52,55 Q50,57.5 48,55 Z" fill="#F5A623" />
      <path d="M48,52 L52,52 Q51,55.5 50,55.5 Q49,55.5 48,52 Z" fill="#D8851A" />
      {/* Cheek blush */}
      <ellipse cx="33" cy="47" rx="5" ry="3.4" fill="rgba(255,140,110,0.32)" />
      <ellipse cx="67" cy="47" rx="5" ry="3.4" fill="rgba(255,140,110,0.32)" />
    </g>
  )
}

// 嚕嚕：貓頭鷹（圓身、招牌大眼盤、耳羽、橘喙）
function OwlBase({ c }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="50" cy="90" rx="25" ry="22" fill={c.body} />
      <ellipse cx="50" cy="94" rx="16" ry="15" fill={c.belly} opacity="0.85" />
      {/* Belly feather flecks */}
      {[[44,90],[56,90],[50,98],[44,104],[56,104]].map(([x,y],i) => (
        <path key={i} d={`M${x-3},${y} q3,3.5 6,0`} stroke={c.ear} strokeWidth="1.1" fill="none" opacity="0.4" />
      ))}
      {/* Folded wings */}
      <path d="M27,80 C19,90 21,105 30,109 L33,100 C29,94 30,86 33,82 Z" fill={c.ear} />
      <path d="M73,80 C81,90 79,105 70,109 L67,100 C71,94 70,86 67,82 Z" fill={c.ear} />
      {/* Ear tufts */}
      <path d="M31,21 L25,5 L41,19 Z" fill={c.body} />
      <path d="M69,21 L75,5 L59,19 Z" fill={c.body} />
      {/* Head */}
      <circle cx="50" cy="42" r="26" fill={c.body} />
      {/* Eye discs */}
      <circle cx="38" cy="42" r="13" fill={c.belly} />
      <circle cx="62" cy="42" r="13" fill={c.belly} />
      <circle cx="38" cy="42" r="13" fill="none" stroke={c.ear} strokeWidth="1.4" opacity="0.55" />
      <circle cx="62" cy="42" r="13" fill="none" stroke={c.ear} strokeWidth="1.4" opacity="0.55" />
      {/* Amber eyes */}
      <circle cx="38" cy="42" r="8"   fill="#FFA000" />
      <circle cx="62" cy="42" r="8"   fill="#FFA000" />
      <circle cx="38" cy="42" r="4.6" fill="#1A1008" />
      <circle cx="62" cy="42" r="4.6" fill="#1A1008" />
      <circle cx="40" cy="39.5" r="2" fill="white" />
      <circle cx="64" cy="39.5" r="2" fill="white" />
      {/* Beak */}
      <path d="M50,47 L45.5,51 Q50,58 54.5,51 Z" fill="#F0A020" />
      <path d="M50,47 L45.5,51 Q50,53 54.5,51 Z" fill="#FFC04D" />
      {/* Feet */}
      <g stroke="#F0A020" strokeWidth="1.8" strokeLinecap="round">
        <path d="M42,110 l-3,6 M42,110 l0,6.5 M42,110 l3,6" />
        <path d="M58,110 l-3,6 M58,110 l0,6.5 M58,110 l3,6" />
      </g>
    </g>
  )
}

// 圓圓：海豹（圓滾身體、無耳、大眼、鬍鬚、鰭）
function SealBase({ c }) {
  return (
    <g>
      {/* Tail flippers */}
      <path d="M68,103 q14,1 19,-5 q-4,9 -17,9 Z" fill={c.ear} />
      {/* Front flippers */}
      <ellipse cx="31" cy="103" rx="9" ry="5" fill={c.ear} transform="rotate(22,31,103)" />
      <ellipse cx="69" cy="103" rx="9" ry="5" fill={c.ear} transform="rotate(-22,69,103)" />
      {/* Body */}
      <ellipse cx="50" cy="92" rx="27" ry="19" fill={c.body} />
      <ellipse cx="50" cy="95" rx="17" ry="12" fill={c.belly} opacity="0.7" />
      {/* Head */}
      <circle cx="50" cy="46" r="26" fill={c.body} />
      {/* Muzzle */}
      <ellipse cx="50" cy="55" rx="14" ry="10" fill={c.belly} opacity="0.55" />
      {/* Eyes (big shiny) */}
      <circle cx="40" cy="44" r="7"   fill="#10131A" />
      <circle cx="60" cy="44" r="7"   fill="#10131A" />
      <circle cx="42.6" cy="41" r="2.6" fill="white" />
      <circle cx="62.6" cy="41" r="2.6" fill="white" />
      <circle cx="38.4" cy="46.5" r="1.4" fill="rgba(255,255,255,0.5)" />
      <circle cx="58.4" cy="46.5" r="1.4" fill="rgba(255,255,255,0.5)" />
      {/* Nose */}
      <ellipse cx="50" cy="53" rx="4.6" ry="3.4" fill={c.nose} />
      <line x1="50" y1="56" x2="50" y2="59" stroke={c.nose} strokeWidth="1.3" />
      <path d="M45,60 Q50,64 55,60" fill="none" stroke={c.nose} strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="29" y1="54" x2="44" y2="55" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="29" y1="58" x2="44" y2="58" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="56" y1="55" x2="71" y2="54" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="56" y1="58" x2="71" y2="58" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      {/* Cheek blush */}
      <ellipse cx="33" cy="52" rx="5.5" ry="3.5" fill="rgba(255,150,150,0.25)" />
      <ellipse cx="67" cy="52" rx="5.5" ry="3.5" fill="rgba(255,150,150,0.25)" />
    </g>
  )
}

// 阿丁：河狸（暖棕、板狀大尾、招牌門牙、圓耳）
function BeaverBase({ c }) {
  return (
    <g>
      {/* Paddle tail */}
      <ellipse cx="50" cy="113" rx="15" ry="8" fill={c.ear} />
      <path d="M40,110 h20 M40,114 h20 M50,106 v15" stroke={c.nose} strokeWidth="0.7" opacity="0.4" />
      {/* Body */}
      <ellipse cx="50" cy="92" rx="24" ry="19" fill={c.body} />
      <ellipse cx="50" cy="94" rx="15" ry="12" fill={c.belly} opacity="0.65" />
      {/* Ears */}
      <circle cx="30" cy="27" r="7" fill={c.ear} />
      <circle cx="70" cy="27" r="7" fill={c.ear} />
      <circle cx="30" cy="27" r="3.4" fill={c.nose} opacity="0.4" />
      <circle cx="70" cy="27" r="3.4" fill={c.nose} opacity="0.4" />
      {/* Head */}
      <circle cx="50" cy="44" r="25" fill={c.body} />
      {/* Eyes */}
      <circle cx="40" cy="40" r="5.4" fill="#1a0e07" />
      <circle cx="60" cy="40" r="5.4" fill="#1a0e07" />
      <circle cx="41.8" cy="38" r="1.9" fill="white" />
      <circle cx="61.8" cy="38" r="1.9" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="49" rx="5" ry="3.6" fill={c.nose} />
      <ellipse cx="48.5" cy="48" rx="1.3" ry="0.9" fill="rgba(255,255,255,0.4)" />
      {/* Buck teeth (signature) */}
      <rect x="46.4" y="54" width="7.2" height="9" rx="1.6" fill="#FFFDF5" stroke="#E0D5C0" strokeWidth="0.6" />
      <line x1="50" y1="54" x2="50" y2="63" stroke="#E0D5C0" strokeWidth="0.7" />
      {/* Muzzle line */}
      <path d="M41,52 Q50,56 59,52" fill="none" stroke={c.nose} strokeWidth="1.1" opacity="0.45" />
      {/* Whiskers */}
      <line x1="27" y1="50" x2="42" y2="51" stroke="rgba(120,90,70,0.5)" strokeWidth="1" />
      <line x1="58" y1="51" x2="73" y2="50" stroke="rgba(120,90,70,0.5)" strokeWidth="1" />
      {/* Cheek blush */}
      <ellipse cx="32" cy="48" rx="5" ry="3.4" fill="rgba(255,160,120,0.25)" />
      <ellipse cx="68" cy="48" rx="5" ry="3.4" fill="rgba(255,160,120,0.25)" />
      {/* Paws */}
      <ellipse cx="36" cy="106" rx="8" ry="5" fill={c.ear} />
      <ellipse cx="64" cy="106" rx="8" ry="5" fill={c.ear} />
    </g>
  )
}

// 小麥：倉鼠（金黃、招牌鼓頰、小圓耳、門牙）
function HamsterBase({ c }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="50" cy="95" rx="24" ry="18" fill={c.body} />
      <ellipse cx="50" cy="98" rx="15" ry="11" fill={c.belly} />
      {/* Ears */}
      <circle cx="34" cy="24" r="8" fill={c.body} />
      <circle cx="66" cy="24" r="8" fill={c.body} />
      <circle cx="34" cy="24" r="4.4" fill="#FFC9B0" opacity="0.7" />
      <circle cx="66" cy="24" r="4.4" fill="#FFC9B0" opacity="0.7" />
      {/* Head */}
      <circle cx="50" cy="46" r="26" fill={c.body} />
      {/* Puffy cheeks (signature) */}
      <circle cx="27" cy="55" r="12" fill={c.body} />
      <circle cx="73" cy="55" r="12" fill={c.body} />
      <circle cx="26" cy="57" r="5" fill="rgba(255,150,120,0.3)" />
      <circle cx="74" cy="57" r="5" fill="rgba(255,150,120,0.3)" />
      {/* Face patch */}
      <ellipse cx="50" cy="50" rx="13" ry="11" fill={c.belly} opacity="0.55" />
      {/* Eyes */}
      <circle cx="41" cy="44" r="5.4" fill="#231307" />
      <circle cx="59" cy="44" r="5.4" fill="#231307" />
      <circle cx="42.8" cy="42" r="1.9" fill="white" />
      <circle cx="60.8" cy="42" r="1.9" fill="white" />
      {/* Nose */}
      <path d="M47,51 L50,49 L53,51 L50,54 Z" fill="#E08878" />
      <line x1="50" y1="54" x2="50" y2="57" stroke="#C06858" strokeWidth="1.1" />
      {/* Front teeth + tiny mouth */}
      <rect x="48" y="56.5" width="4" height="4" rx="1" fill="#FFFDF5" stroke="#E8DCC0" strokeWidth="0.5" />
      <path d="M46,57 Q50,60.5 54,57" fill="none" stroke="#C06858" strokeWidth="1.2" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="42" cy="109" rx="6" ry="4" fill={c.belly} />
      <ellipse cx="58" cy="109" rx="6" ry="4" fill={c.belly} />
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

// ── Mood expression overlay ───────────────────────────────────────────────────
// 依心情數值(0-100)在臉上疊一層表情。白色描邊確保各種毛色(含黑貓)都看得到。
//  >=80 開心(不疊)  60-79 沒很開心  40-59 不開心  1-39 很不滿  0 趴地上
function MoodExpression({ mood = 100 }) {
  if (mood >= 80) return null

  const tier = mood <= 0 ? 'collapse'
    : mood < 40 ? 'upset'
    : mood < 60 ? 'unhappy'
    : 'meh'

  const mouthByTier = {
    meh:      'M44,64 Q50,61.5 56,64',                  // 平嘴/微抿
    unhappy:  'M43,66 Q50,59 57,66',                    // 嘴角下垂
    upset:    'M42,67 Q46,61.5 50,64 Q54,61.5 58,67',   // 波浪不滿嘴
    collapse: 'M43,66 Q50,60 57,66',                    // 趴下苦臉
  }
  const mouth = mouthByTier[tier]

  const showBrows = tier !== 'meh'
  const angryBrows = tier === 'upset'        // 不滿：內低外高(皺眉)；其餘：內高外低(擔憂)
  const browL = angryBrows ? 'M32,29 L43,33' : 'M32,32 L43,29'
  const browR = angryBrows ? 'M68,29 L57,33' : 'M68,32 L57,29'

  return (
    <g style={{ pointerEvents: 'none' }} strokeLinecap="round">
      {showBrows && (
        <g>
          <path d={browL} stroke="white" strokeWidth="3.4" fill="none" opacity="0.85" />
          <path d={browR} stroke="white" strokeWidth="3.4" fill="none" opacity="0.85" />
          <path d={browL} stroke="#5A3A22" strokeWidth="2" fill="none" />
          <path d={browR} stroke="#5A3A22" strokeWidth="2" fill="none" />
        </g>
      )}
      <path d={mouth} fill="none" stroke="white"   strokeWidth="3.6" opacity="0.85" />
      <path d={mouth} fill="none" stroke="#7A2E2E" strokeWidth="2.1" />
      {tier === 'upset'    && <text x="76" y="31" fontSize="13" textAnchor="middle">💢</text>}
      {tier === 'collapse' && <text x="79" y="64" fontSize="13" textAnchor="middle">💤</text>}
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PetAvatar({ petId = 'lulu', evolutionStage = 1, equipped = [], size = 100, mood = 100 }) {
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

  // 心情=0：整隻往下壓扁、微微側倒，像趴在地上
  const collapsedStyle = mood <= 0
    ? { transform: 'translateY(10px) scaleY(0.74) rotate(-3deg)', transformOrigin: '50% 100%' }
    : {}

  return (
    <svg
      width={size}
      height={Math.round(size * 1.3)}
      viewBox="0 0 100 130"
      style={{ overflow: 'visible', display: 'block', ...glowFilter, ...collapsedStyle }}
    >
      {/* Stage-4 ambient glow */}
      {colors.glow && (
        <ellipse cx="50" cy="72" rx="42" ry="52" fill={colors.glow} opacity="0.08" />
      )}

      {/* Behind-body items */}
      {wings   && <AccWings />}
      {backpack && <AccBackpack />}

      {/* Pet base */}
      {petId === 'lulu'      ? <LuluBase    c={colors} />
       : petId === 'mejiro'  ? <MejiroBase  c={colors} />
       : petId === 'jiji'    ? <JijiBase    c={colors} />
       : petId === 'kitsune' ? <KitsuneBase c={colors} />
       : petId === 'penguin' ? <PenguinBase c={colors} />
       : petId === 'owl'     ? <OwlBase     c={colors} />
       : petId === 'seal'    ? <SealBase    c={colors} />
       : petId === 'beaver'  ? <BeaverBase  c={colors} />
       : petId === 'hamster' ? <HamsterBase c={colors} />
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

      {/* Hana stage markings */}
      {petId === 'hana' && stage === 2 && (
        /* Stage 2: 額頭小櫻花 */
        <g transform="translate(50,27)">
          {[0,72,144,216,288].map(a => (
            <ellipse key={a}
              cx={+(Math.cos(a*Math.PI/180)*4.2).toFixed(1)}
              cy={+(Math.sin(a*Math.PI/180)*4.2).toFixed(1)}
              rx="2.8" ry="4.8" fill="#FFB6C1"
              transform={`rotate(${a})`}
            />
          ))}
          <circle cx="0" cy="0" r="2.6" fill="#FFD700" />
        </g>
      )}
      {petId === 'hana' && stage === 3 && (
        /* Stage 3: 臉頰水波紋 */
        <g>
          <circle cx="28" cy="52" r="5.5" fill="none" stroke="#20B2AA" strokeWidth="1.6" opacity="0.7" />
          <circle cx="28" cy="52" r="3"   fill="none" stroke="#20B2AA" strokeWidth="1"   opacity="0.45" />
          <circle cx="72" cy="52" r="5.5" fill="none" stroke="#20B2AA" strokeWidth="1.6" opacity="0.7" />
          <circle cx="72" cy="52" r="3"   fill="none" stroke="#20B2AA" strokeWidth="1"   opacity="0.45" />
        </g>
      )}

      {/* Kotaro stage markings */}
      {petId === 'kotaro' && stage === 2 && (
        /* Stage 2: 額頭嫩葉 */
        <g transform="translate(50,27)">
          <path d="M0,-7 C4.5,-4 5,2.5 0,7 C-5,2.5 -4.5,-4 0,-7 Z" fill="#66BB6A" />
          <line x1="0" y1="7" x2="0" y2="-4" stroke="#388E3C" strokeWidth="0.9" />
          <line x1="-3" y1="1" x2="3" y2="-1" stroke="#388E3C" strokeWidth="0.7" />
          <line x1="-2" y1="-2.5" x2="2" y2="-4" stroke="#388E3C" strokeWidth="0.7" />
        </g>
      )}
      {petId === 'kotaro' && stage === 3 && (
        /* Stage 3: 臉頰金星 */
        <g>
          <polygon points="28,47 29.2,50.2 32.8,50.2 30,52.2 31.2,55.4 28,53.4 24.8,55.4 26,52.2 23.2,50.2 26.8,50.2"
            fill="#FFD700" opacity="0.88" />
          <polygon points="72,47 73.2,50.2 76.8,50.2 74,52.2 75.2,55.4 72,53.4 68.8,55.4 70,52.2 67.2,50.2 70.8,50.2"
            fill="#FFD700" opacity="0.88" />
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

      {/* Jiji stage markings */}
      {petId === 'jiji' && stage === 2 && (
        /* Stage 2: 額頭金色月牙（魔法貓印記） */
        <g transform="translate(50,27)">
          <circle cx="0" cy="0" r="7.5" fill="#FFD700" opacity="0.92" />
          <circle cx="3" cy="-2.5" r="6" fill={colors.body} />
        </g>
      )}
      {petId === 'jiji' && stage === 3 && (
        /* Stage 3: 眼睛外圈魔法紫環 */
        <g>
          <ellipse cx="37" cy="42" rx="11.5" ry="10.5" fill="none" stroke="#C084FC" strokeWidth="1.8" opacity="0.65" />
          <ellipse cx="63" cy="42" rx="11.5" ry="10.5" fill="none" stroke="#C084FC" strokeWidth="1.8" opacity="0.65" />
          <ellipse cx="37" cy="42" rx="14"   ry="13"   fill="none" stroke="#C084FC" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="63" cy="42" rx="14"   ry="13"   fill="none" stroke="#C084FC" strokeWidth="0.8" opacity="0.3" />
        </g>
      )}

      {/* Kitsune stage markings */}
      {petId === 'kitsune' && stage === 2 && (
        /* Stage 2: 額頭冰晶菱形 */
        <g transform="translate(50,27)">
          <polygon points="0,-9 6,0 0,9 -6,0" fill="rgba(200,240,255,0.88)" stroke="rgba(130,200,255,0.75)" strokeWidth="0.9" />
          <line x1="0" y1="-9" x2="0" y2="9" stroke="rgba(220,248,255,0.7)" strokeWidth="0.8" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(220,248,255,0.7)" strokeWidth="0.8" />
          <circle cx="-8" cy="-5" r="1.3" fill="rgba(200,235,255,0.8)" />
          <circle cx="8"  cy="5"  r="1.3" fill="rgba(200,235,255,0.8)" />
        </g>
      )}
      {petId === 'kitsune' && stage === 3 && (
        /* Stage 3: 耳尖冰晶雪花 */
        <g opacity="0.82">
          {[24, 76].map(cx => (
            <g key={cx}>
              <line x1={cx}   y1="9"  x2={cx}   y2="19" stroke="rgba(200,240,255,0.9)" strokeWidth="1.3" />
              <line x1={cx-5} y1="14" x2={cx+5} y2="14" stroke="rgba(200,240,255,0.9)" strokeWidth="1.3" />
              <line x1={cx-3.5} y1="10.5" x2={cx+3.5} y2="17.5" stroke="rgba(200,240,255,0.9)" strokeWidth="1.1" />
              <line x1={cx-3.5} y1="17.5" x2={cx+3.5} y2="10.5" stroke="rgba(200,240,255,0.9)" strokeWidth="1.1" />
              <circle cx={cx} cy="14" r="2.2" fill="rgba(200,240,255,0.88)" />
            </g>
          ))}
        </g>
      )}

      {/* Penguin stage markings */}
      {petId === 'penguin' && stage === 2 && (
        /* 額頭小冰晶 */
        <g transform="translate(50,22)">
          <polygon points="0,-6 4,0 0,6 -4,0" fill="rgba(200,240,255,0.9)" stroke="rgba(120,200,255,0.8)" strokeWidth="0.8" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(220,248,255,0.7)" strokeWidth="0.7" />
        </g>
      )}
      {petId === 'penguin' && stage === 3 && (
        /* 臉頰雪花亮點 */
        <g fill="rgba(220,245,255,0.92)">
          <polygon points="29,46 30,48.4 32.4,48.4 30.5,50 31.2,52.4 29,51 26.8,52.4 27.5,50 25.6,48.4 28,48.4" />
          <polygon points="71,46 72,48.4 74.4,48.4 72.5,50 73.2,52.4 71,51 68.8,52.4 69.5,50 67.6,48.4 70,48.4" />
        </g>
      )}

      {/* Owl stage markings */}
      {petId === 'owl' && stage === 2 && (
        /* 額頭金色月牙 */
        <g transform="translate(50,20)">
          <circle cx="0" cy="0" r="6.5" fill="#FFD54F" opacity="0.95" />
          <circle cx="2.5" cy="-2" r="5" fill={colors.body} />
        </g>
      )}
      {petId === 'owl' && stage === 3 && (
        /* 頭頂星塵 */
        <g fill="#FFE082">
          <text x="22" y="18" fontSize="9" textAnchor="middle">✦</text>
          <text x="78" y="18" fontSize="9" textAnchor="middle">✦</text>
          <text x="50" y="9" fontSize="7" textAnchor="middle">✦</text>
        </g>
      )}

      {/* Seal stage markings */}
      {petId === 'seal' && stage === 2 && (
        /* 額頭小水滴 */
        <g transform="translate(50,26)">
          <path d="M0,-6 C3.5,-1 3.5,3 0,4 C-3.5,3 -3.5,-1 0,-6 Z" fill="rgba(120,200,245,0.85)" />
          <ellipse cx="-1" cy="0" rx="1" ry="1.6" fill="rgba(255,255,255,0.6)" />
        </g>
      )}
      {petId === 'seal' && stage === 3 && (
        /* 臉頰水波紋 */
        <g>
          <circle cx="28" cy="52" r="5" fill="none" stroke="#29B6F6" strokeWidth="1.4" opacity="0.65" />
          <circle cx="72" cy="52" r="5" fill="none" stroke="#29B6F6" strokeWidth="1.4" opacity="0.65" />
        </g>
      )}

      {/* Beaver stage markings */}
      {petId === 'beaver' && stage === 2 && (
        /* 額頭小嫩葉 */
        <g transform="translate(50,25)">
          <path d="M0,-6 C4,-3 4.5,2 0,6 C-4.5,2 -4,-3 0,-6 Z" fill="#7CB342" />
          <line x1="0" y1="6" x2="0" y2="-3.5" stroke="#558B2F" strokeWidth="0.8" />
        </g>
      )}
      {petId === 'beaver' && stage === 3 && (
        /* 臉頰金星 */
        <g fill="#FFD700" opacity="0.9">
          <polygon points="29,47 30,49.4 32.4,49.4 30.5,51 31.2,53.4 29,52 26.8,53.4 27.5,51 25.6,49.4 28,49.4" />
          <polygon points="71,47 72,49.4 74.4,49.4 72.5,51 73.2,53.4 71,52 68.8,53.4 69.5,51 67.6,49.4 70,49.4" />
        </g>
      )}

      {/* Hamster stage markings */}
      {petId === 'hamster' && stage === 2 && (
        /* 額頭小麥穗 */
        <g transform="translate(50,26)" stroke="#C68A1C" strokeWidth="0.9" strokeLinecap="round">
          <line x1="0" y1="5" x2="0" y2="-6" />
          <line x1="0" y1="-5" x2="-3" y2="-7" /><line x1="0" y1="-5" x2="3" y2="-7" />
          <line x1="0" y1="-2" x2="-3" y2="-4" /><line x1="0" y1="-2" x2="3" y2="-4" />
          <line x1="0" y1="1" x2="-3" y2="-1" /><line x1="0" y1="1" x2="3" y2="-1" />
        </g>
      )}
      {petId === 'hamster' && stage === 3 && (
        /* 臉頰金星 */
        <g fill="#FFC107" opacity="0.92">
          <polygon points="27,50 28,52.4 30.4,52.4 28.5,54 29.2,56.4 27,55 24.8,56.4 25.5,54 23.6,52.4 26,52.4" />
          <polygon points="73,50 74,52.4 76.4,52.4 74.5,54 75.2,56.4 73,55 70.8,56.4 71.5,54 69.6,52.4 72,52.4" />
        </g>
      )}

      {/* Mood expression overlay (over face, under hats/clothes) */}
      <MoodExpression mood={mood} />

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
