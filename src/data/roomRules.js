// 房間／庭園的共用規則。2D 版（HomeRoomScreen）與 3D 版（three/RoomWorld3D）都讀這裡，
// 免得同一條規則兩邊各寫一份、改了一邊忘另一邊。
// 座標一律沿用百分比系統（x 左右、y 前後），3D 只是換一種畫法。

// 寵物可以走動的範圍
export const BOUNDS = { xMin: 6, xMax: 78, yMin: 42, yMax: 66 }

// 會去追球的寵物（其餘只對零食有興趣）
export const BALL_CHASERS = ['lulu', 'monkey', 'hamster', 'dino', 'kotaro', 'hana', 'kitsune', 'seal', 'xiaohu']
export const chasesToy = (petId, toy) => !!toy && (toy.kind === 'treat' || BALL_CHASERS.includes(petId))

// 距家具多近算「正在使用」
export const ACTIVITY_RADIUS = 24
