// 寵物進化配色表：每隻 4 個進化階段的顏色。
// 從 PetAvatar.jsx 抽出來成純資料檔，讓 2D 的 SVG（PetAvatar）與 3D 的程式化建模
// （three/petMesh）共用同一份顏色 —— 改一次兩邊同步，也讓這份資料能被 node 直接載入測試。
// ── Evolution color palettes ──────────────────────────────────────────────────
export const EVO = {
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
  // 豆豆：小恐龍（嫩綠→翡翠→青碧，stage4 藍綠光暈），ear=背板色
  dino: [
    null,
    { body:'#7CC96B', belly:'#EAFBE4', ear:'#5EA84F', nose:'#2E5E24' },
    { body:'#6BBF5A', belly:'#E2F8D9', ear:'#4E9840', nose:'#245018' },
    { body:'#57B58A', belly:'#DAF6EC', ear:'#3E9870', nose:'#154838' },
    { body:'#48C4B0', belly:'#DFFCF6', ear:'#2E9E8A', nose:'#0D4A40', glow:'#7CF0DA' },
  ],
  // 皮皮：小猴子（暖棕＋奶油臉，stage4 金光），ear=手腳/深色
  monkey: [
    null,
    { body:'#B07A4E', belly:'#F0D8B8', ear:'#8A5E38', nose:'#4E301A' },
    { body:'#A66E42', belly:'#EDD0AC', ear:'#7C5230', nose:'#452A16' },
    { body:'#9A5E34', belly:'#E8C8A0', ear:'#6C4426', nose:'#3A2212' },
    { body:'#C98A2E', belly:'#F5E0B0', ear:'#A06C18', nose:'#3E2410', glow:'#FFD86B' },
  ],
  // 麻吉：小浣熊（灰＋白臉＋黑眼罩，stage4 夜紫光），nose=眼罩/深色
  raccoon: [
    null,
    { body:'#9AA6B0', belly:'#EDF0F2', ear:'#6E7A86', nose:'#2A2E33' },
    { body:'#8A97A2', belly:'#E4E8EB', ear:'#5E6A76', nose:'#22262B' },
    { body:'#78868F', belly:'#DAE0E4', ear:'#4E5A66', nose:'#1A1E22' },
    { body:'#8A7EC8', belly:'#EAE4FA', ear:'#5E52A0', nose:'#1A1428', glow:'#B0A0FF' },
  ],
  // 小星：星星精靈（暖金五角星，stage4 星願金光），belly=內層亮光、ear=星角描邊、nose=五官
  twinkle: [
    null,
    { body:'#FFE08A', belly:'#FFF6D0', ear:'#F0C24E', nose:'#7A5A12' },
    { body:'#FFD86B', belly:'#FFF2C0', ear:'#EBB43A', nose:'#6E5010' },
    { body:'#FFCE4A', belly:'#FFEEA8', ear:'#E6A828', nose:'#5E440E' },
    { body:'#FFD54A', belly:'#FFF6C0', ear:'#F0B020', nose:'#5A400C', glow:'#FFE87A' },
  ],
  // 小月：月亮精靈（銀藍圓月，stage4 月光銀暈），belly=內層亮光、ear=描邊/月紋、nose=五官
  luna: [
    null,
    { body:'#D8E2F5', belly:'#F2F6FF', ear:'#9FB4DC', nose:'#4A5578' },
    { body:'#CBD9F2', belly:'#ECF2FF', ear:'#8DA6D6', nose:'#3F4A6E' },
    { body:'#BFCFEF', belly:'#E6EEFF', ear:'#7B98D0', nose:'#354064' },
    { body:'#CFDCFA', belly:'#F0F5FF', ear:'#8FA8E8', nose:'#303A60', glow:'#AFC4FF' },
  ],
  // 小冥：冥王星矮行星精靈（冰藍圓球＋胸口心形冰原），heart=心形冰原色，隨進化由冷轉暖、stage4 團圓紫光
  pluto: [
    null,
    { body:'#C7D0E2', belly:'#EEF2FA', ear:'#9AA6BE', nose:'#4A5468', heart:'#AEB8CE' },
    { body:'#C9CEE6', belly:'#EEF0FA', ear:'#9691C4', nose:'#45496A', heart:'#CDB6D6' },
    { body:'#CDC6E8', belly:'#F0ECF8', ear:'#A98FD0', nose:'#443A66', heart:'#F0B0C6' },
    { body:'#D2C6F0', belly:'#F3ECFC', ear:'#B49AE0', nose:'#40386A', heart:'#FFB6C1', glow:'#C9A8F0' },
  ],
  // 小Q：灰白邏輯貓頭鷹精靈（胸前問號羽毛 mark，stage4 問號翻成驚嘆號 excl＋迷你偵探帽 hat＋金光）
  xiaoq: [
    null,
    { body:'#C9CFD8', belly:'#F2F4F7', ear:'#A9B0BE', nose:'#4A505E', mark:'#8A93A6' },
    { body:'#C2CAD6', belly:'#EFF2F6', ear:'#93A0B4', nose:'#454C5C', mark:'#6E7A92' },
    { body:'#CFCDC2', belly:'#F5F3EA', ear:'#B49A54', nose:'#4E4838', mark:'#A8863A', excl:true },
    { body:'#D8D4C4', belly:'#FAF7EA', ear:'#C4A94E', nose:'#4A4430', mark:'#D4AF37', excl:true, hat:true, glow:'#F0D878' },
  ],
  // 飛飛：雪白信天翁郵差（ear=翅尖/描邊、mark=信袋色；stage3 起翅膀張開 soar、stage4 背小信袋 pouch＋天光）
  feifei: [
    null,
    { body:'#F2F5F8', belly:'#FFFFFF', ear:'#AEBFCC', nose:'#4E5A66', mark:'#C9A86A' },
    { body:'#EFF4F9', belly:'#FFFFFF', ear:'#8FB4D0', nose:'#46525E', mark:'#C9A86A' },
    { body:'#EDF3FA', belly:'#FFFFFF', ear:'#6FA8D4', nose:'#3E4A58', mark:'#B8934E', soar:true },
    { body:'#F4F8FF', belly:'#FFFFFF', ear:'#7FB0E8', nose:'#3A4656', mark:'#D4AF37', soar:true, pouch:true, glow:'#BFDCFF' },
  ],
  // 小虎：短毛黑臘腸（黑亮短毛＋棕紅眉斑/肚子，belly=棕紅斑、ear=垂耳深黑、mark=領巾/配件色；
  // stage2 起紅領巾 scarf、stage3 背小土產包 pack、stage4 分享會小徽章 badge＋金光）
  xiaohu: [
    null,
    { body:'#3A3A44', belly:'#C68A4E', ear:'#26262E', nose:'#15151C', mark:'#B84A3A' },
    { body:'#34343E', belly:'#CE9254', ear:'#222229', nose:'#13131A', mark:'#C4402E', scarf:true },
    { body:'#2E2E38', belly:'#D69A58', ear:'#1E1E26', nose:'#111118', mark:'#C4402E', scarf:true, pack:true },
    { body:'#2A2A34', belly:'#DDA25E', ear:'#1B1B24', nose:'#101018', mark:'#C4402E', scarf:true, pack:true, badge:true, glow:'#F0C878' },
  ],
}

