// 房間／庭園的共用規則。2D 版（HomeRoomScreen）與 3D 版（three/RoomWorld3D）都讀這裡，
// 免得同一條規則兩邊各寫一份、改了一邊忘另一邊。
// 座標一律沿用百分比系統（x 左右、y 前後），3D 只是換一種畫法。

// 寵物可以走動的範圍
// ── 室內外雙場景：寵物各自歸屬，一次只渲染一個場景 ──────────────────────
// 戶外＝水生／星空／野外的孩子；沒列到的都算室內。這是「預設住哪」，
// 安安可以在寵物圖鑑裡自己搬家（存在 store 的 petHabitat，覆蓋這份預設）。
export const OUTDOOR_PETS = new Set(['hana', 'kotaro', 'seal', 'penguin', 'beaver', 'feifei', 'dino', 'monkey', 'twinkle', 'luna', 'pluto', 'mejiro'])
export const defaultHabitat = (id) => (OUTDOOR_PETS.has(id) ? 'outdoor' : 'indoor')
export const habitatOfPet = (id, overrides) => overrides?.[id] || defaultHabitat(id)

// 每個場景最多住幾隻寵物 —— 這是效能上限，不是玩法限制。
// 依據：實測每隻寵物平均 33.6 個 mesh（最多的浣熊 52、最少的小星 10），
// 8 隻＝平均 269／最壞 416 個 draw call；再加上場景本身（草地色塊、遠景樹、
// 最多 24 株植物、家具，粗估 150~250），總計約 420~520，是平板還撐得住的區間。
// 兩個場景一次只渲染一個，所以是「每場景」而不是全域。
// ⚠️ 真的卡的時候，第一個該砍的是「描邊」而不是這個數字 ——
// 描邊佔了將近一半的 mesh（LULU 16→33 就是加描邊造成的）。
export const MAX_PETS_PER_SCENE = 8

// 寵物走動的範圍（不是種花範圍，兩者不同，別搞混）
export const BOUNDS = { xMin: 6, xMax: 78, yMin: 42, yMax: 66 }

// 秘密庭園可以種花的範圍。原本是寫死在 HomeRoomScreen 裡的魔術數字
// （x 8~90、y 46~82），安安反映「花園太小」所以往四周各放寬一些。
// ⚠️ y 不能再往上拉太多：getDepthScale(y) 用 y 算近大遠小，
// y 太小的花會縮到看不見，而且會種到天空去。
export const PLANT_BOUNDS = { xMin: 5, xMax: 93, yMin: 44, yMax: 86 }

// 採收的花擺出來當裝飾時，可以放在哪。庭園沿用種花範圍；
// 室內窄一些，免得擺到牆上或門外（房間的地板比庭園的草地小一圈）。
export const flowerDecoBounds = (scene) =>
  (scene === 'indoor' ? { xMin: 8, xMax: 88, yMin: 46, yMax: 76 } : PLANT_BOUNDS)

// 會去追球的寵物（其餘只對零食有興趣）
export const BALL_CHASERS = ['lulu', 'monkey', 'hamster', 'dino', 'kotaro', 'hana', 'kitsune', 'seal', 'xiaohu']
export const chasesToy = (petId, toy) => !!toy && (toy.kind === 'treat' || BALL_CHASERS.includes(petId))

// 距家具多近算「正在使用」
export const ACTIVITY_RADIUS = 24
