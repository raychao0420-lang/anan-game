// 房間／庭園的共用規則。2D 版（HomeRoomScreen）與 3D 版（three/RoomWorld3D）都讀這裡，
// 免得同一條規則兩邊各寫一份、改了一邊忘另一邊。
// 座標一律沿用百分比系統（x 左右、y 前後），3D 只是換一種畫法。

// 寵物可以走動的範圍
// 寵物走動的範圍（不是種花範圍，兩者不同，別搞混）
export const BOUNDS = { xMin: 6, xMax: 78, yMin: 42, yMax: 66 }

// 秘密庭園可以種花的範圍。原本是寫死在 HomeRoomScreen 裡的魔術數字
// （x 8~90、y 46~82），安安反映「花園太小」所以往四周各放寬一些。
// ⚠️ y 不能再往上拉太多：getDepthScale(y) 用 y 算近大遠小，
// y 太小的花會縮到看不見，而且會種到天空去。
export const PLANT_BOUNDS = { xMin: 5, xMax: 93, yMin: 44, yMax: 86 }

// 會去追球的寵物（其餘只對零食有興趣）
export const BALL_CHASERS = ['lulu', 'monkey', 'hamster', 'dino', 'kotaro', 'hana', 'kitsune', 'seal', 'xiaohu']
export const chasesToy = (petId, toy) => !!toy && (toy.kind === 'treat' || BALL_CHASERS.includes(petId))

// 距家具多近算「正在使用」
export const ACTIVITY_RADIUS = 24
