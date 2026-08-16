import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENTS } from '../data/achievements'
import { EVOLVE_EXP, ENERGY_MAX, ENERGY_START } from '../data/pets'
import { pullLuckyEgg } from '../data/gacha'
import { rollSeedDrop, todayKey, yesterdayKey, PLANT_KINDS, ALL_BLOOMS, MAX_PLANTS, MAX_FLOWER_DECOS, bloomKind, FLOWER_GIFT } from '../data/garden'
import { habitatOfPet, MAX_PETS_PER_SCENE } from '../data/roomRules'
import { pickDailyChallenge } from '../data/dailyChallenge'

const makeStages = () => {
  const s = {}
  for (let i = 1; i <= 70; i++) s[i] = { completed: false, stars: 0 }
  return s
}

function checkAllAchievements(s) {
  const unlocked = []
  const a = s.achievements
  const completedCount = Object.values(s.stages).filter(st => st.completed).length

  if (!a.first_stage  && completedCount >= 1)  unlocked.push('first_stage')
  if (!a.stage_10     && completedCount >= 10) unlocked.push('stage_10')
  if (!a.stage_all    && completedCount >= 55) unlocked.push('stage_all')
  if (!a.perfect      && s.perfectStages > 0)  unlocked.push('perfect')
  if (!a.combo10      && s.maxCombo >= 10)      unlocked.push('combo10')
  if (!a.evolve1      && Object.values(s.pets).some(p => p.evolutionStage >= 2)) unlocked.push('evolve1')
  if (!a.evolve_max   && Object.values(s.pets).some(p => p.evolutionStage >= 4)) unlocked.push('evolve_max')
  if (!a.all_pets     && Object.values(s.pets).every(p => p.unlocked)) unlocked.push('all_pets')
  if (!a.boss1        && Object.values(s.bossCleared).some(v => v)) unlocked.push('boss1')
  if (!a.boss_all     && Object.values(s.bossCleared).filter(v => v).length >= 4) unlocked.push('boss_all')
  if (!a.exam_boss    && s.examBossCleared) unlocked.push('exam_boss')
  if (!a.daily3       && s.dailyDaysCompleted >= 3) unlocked.push('daily3')
  if (!a.coins_500    && s.totalCoinsEarned >= 500) unlocked.push('coins_500')
  if (!a.shop3        && s.ownedItems.filter(id => !id.startsWith('boss_')).length >= 3) unlocked.push('shop3')

  return unlocked
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      coins: 0,
      activePet: 'lulu',
      pets: {
        lulu:    { unlocked: true,  evolutionStage: 1, foodExp: 0, accessories: [] },
        hana:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        kotaro:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        jiji:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        kitsune: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        mejiro:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        penguin: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        owl:     { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        seal:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        beaver:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        hamster: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        dino:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        monkey:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        raccoon: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        twinkle: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        luna:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        pluto:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        xiaoq:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        feifei:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        xiaohu:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        arong:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
      },
      stages: makeStages(),
      ownedItems:        [],
      petEquipment:      { lulu: [], hana: [], kotaro: [], jiji: [], kitsune: [], mejiro: [], penguin: [], owl: [], seal: [], beaver: [], hamster: [], dino: [], monkey: [], raccoon: [] },
      equippedHomeItems: [],
      homeDecoPositions: {},
      garden: [],   // 戶外花園：{ key, kind:'flower'|'rare'|'tree', x, y, v, waterCount, lastWater } 每天澆水成長
      seedlings: { flower: 3, rare: 0, tree: 1, magic: 0 },  // 花苗庫存：過關掉落或商店購買，種花時消耗
      fertilizer: 1,                               // 魔法肥料數量：撒一次立刻多長一天
      lastSeedDrop: null,                          // 最近一次過關掉的花苗種類（給結算畫面顯示）
      flowers: {},                                 // 採收下來的花：{ '🌷': 3, ... }，可以送給寵物
      flowerDecos: [],                             // 擺出來當裝飾的花：{ key, emoji, x, y, sc }，收回來會還進 flowers
      gardenDex: [],                               // 花園圖鑑：採收過的花色（集滿給一次大獎）
      gardenDexDone: false,                        // 圖鑑全收集獎勵是否已發
      waterStreak: 0,                              // 連續澆水天數（溫和版：斷了只是重數，不處罰）
      waterStreakBest: 0,
      lastWaterDay: null,                          // 最近一次澆水的日期（判斷連續）
      petHabitat: {},                              // 寵物搬家：{ petId: 'indoor'|'outdoor'|'magic' }，覆蓋預設歸屬
      petNests: {},                                // 寵物的窩：{ petId: {x,y,sc} }，拖曳定位，之後在窩附近活動
      gardenKeeper: null,                          // 指派的花園小幫手寵物 id
      keeperHelpedDay: null,                       // 小幫手今天是否已幫忙過

      // M10: 關卡冷落追蹤（給「當日限定挑戰」挑關用；舊存檔沒有就當 0／從沒玩過）
      stagePlays: {},        // { [stageId]: 玩過幾次 }
      stageLastPlay: {},     // { [stageId]: 'YYYY-MM-DD' }

      // M10: 當日限定挑戰
      challengeDate: null,   // 這筆挑戰算給哪一天的
      challengeStage: null,  // 今天的挑戰關卡 id（null＝今天沒有挑戰）
      challengeDone: false,  // 今天的加倍是否已經領過

      // M3: daily tasks
      dailyDate: null,
      dailyProgress: {},
      dailyTasksDone: [],
      dailyDaysCompleted: 0,

      // M3: boss
      bossCleared: { 10: false, 20: false, 30: false, 40: false },

      // M5: exam boss
      examBossCleared: false,
      makeTenCleared: false,
      makeTwentyCleared: false,
      makeHundredCleared: false,
      crossEqualsCleared: false,
      wordProblemCleared: false,
      multiplyCleared: false,
      subjectPerfects: { math: 0, social: 0, nature: 0, chinese: 0 },
      subjectQueues:   { math: [], social: [], nature: [], chinese: [] },
      subjectStreaks:  { math: 0, social: 0, nature: 0, chinese: 0 },

      // M3: achievements
      achievements: {},
      pendingAchievement: null,

      // M3: stats for achievements
      totalCoinsEarned: 0,
      maxCombo: 0,
      perfectStages: 0,

      // M4: pet moods
      petMoods: { lulu: 80, hana: 80, kotaro: 80, jiji: 80, kitsune: 80, mejiro: 80, penguin: 80, owl: 80, seal: 80, beaver: 80, hamster: 80, dino: 80, monkey: 80, raccoon: 80 },
      lastPlayedAt: null,

      // M9: 寵物技能能量（每隻獨立，答題 +5 回復、發動 -20）
      petEnergy: { lulu: ENERGY_START, hana: ENERGY_START, kotaro: ENERGY_START, jiji: ENERGY_START, kitsune: ENERGY_START, mejiro: ENERGY_START, penguin: ENERGY_START, owl: ENERGY_START, seal: ENERGY_START, beaver: ENERGY_START, hamster: ENERGY_START, dino: ENERGY_START, monkey: ENERGY_START, raccoon: ENERGY_START },

      // M6: 幸運蛋 + 每日登入禮物
      luckyEggs: 0,
      lastGiftDate: null,
      loginStreak: 0,
      loginStreakBest: 0,
      pendingLoginGift: null,   // 今天的登入禮物內容，領到後給 HomeScreen 顯示

      // M7: 推理事件簿 — 每個章節破案後標記 true
      mysterySolved: {},

      // M8: 長篇連續劇 — 破案集數（seriesSolved 跨季共用，episode id 不重複）
      // S1《七色星願》收碎片顏色；S2《星空亂了套》收星座徽章 id
      seriesSolved: {},
      seriesShards: [],
      seriesBadges: [],
      seriesGems: [],
      seriesSeals: [],
      seriesStamps: [],
      seriesPieces: [],
      seriesPages: [],

      // ── Core actions ──
      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

      completeStage: (stageId, stars, coinsEarned) => {
        set((s) => {
          const isPerfect = stars === 3 && coinsEarned >= 100
          // 花園：過關有機率掉花苗（三星機率高、稀有花苗更容易）
          const dropChance = stars >= 3 ? 0.75 : stars >= 1 ? 0.5 : 0.3
          const drop = Math.random() < dropChance ? rollSeedDrop(stars) : null
          const seedlings = drop
            ? { ...s.seedlings, [drop]: (s.seedlings?.[drop] || 0) + 1 }
            : s.seedlings
          return {
            coins: s.coins + coinsEarned,
            totalCoinsEarned: s.totalCoinsEarned + coinsEarned,
            perfectStages: s.perfectStages + (isPerfect ? 1 : 0),
            seedlings,
            lastSeedDrop: drop,
            // 記錄遊玩次數與日期，讓「當日限定挑戰」抓得到哪些關卡被冷落
            stagePlays: { ...s.stagePlays, [stageId]: (s.stagePlays?.[stageId] || 0) + 1 },
            stageLastPlay: { ...s.stageLastPlay, [stageId]: todayKey() },
            stages: {
              ...s.stages,
              [stageId]: {
                completed: true,
                stars: Math.max(s.stages[stageId]?.stars || 0, stars),
              },
            },
          }
        })
        get().checkAchievements()
      },

      feedPet: (petId, cost, expGain) => {
        set((s) => {
          if (s.coins < cost) return s
          const pet = s.pets[petId]
          const currentMood = s.petMoods?.[petId] ?? 80
          return {
            coins: s.coins - cost,
            pets: { ...s.pets, [petId]: { ...pet, foodExp: (pet.foodExp || 0) + expGain } },
            petMoods: { ...s.petMoods, [petId]: Math.min(100, currentMood + 10) },
          }
        })
      },

      evolvePetFood: (petId) => {
        set((s) => {
          const pet = s.pets[petId]
          if (pet.evolutionStage >= 4) return s
          const threshold = EVOLVE_EXP[pet.evolutionStage]
          if ((pet.foodExp || 0) < threshold) return s
          return {
            pets: {
              ...s.pets,
              [petId]: {
                ...pet,
                evolutionStage: pet.evolutionStage + 1,
                foodExp: (pet.foodExp || 0) - threshold,
              },
            },
          }
        })
        get().checkAchievements()
      },

      unlockPet: (petId, cost) => {
        set((s) => {
          if (s.coins < cost) return s
          return {
            coins: s.coins - cost,
            pets: { ...s.pets, [petId]: { ...s.pets[petId], unlocked: true } },
          }
        })
        get().checkAchievements()
      },

      // 免費直接解鎖寵物（闖關／扭蛋／遊樂場獎勵用）。已擁有則不變動。
      grantPet: (petId) => {
        const already = get().pets[petId]?.unlocked
        if (already) return false
        set((s) => ({
          pets: { ...s.pets, [petId]: { ...s.pets[petId], unlocked: true } },
        }))
        get().checkAchievements()
        return true
      },

      // 免費直接贈送道具／裝飾（闖關／破案獎勵用）。已擁有則不變動，回傳是否為首次獲得。
      grantItem: (itemId) => {
        if (!itemId || get().ownedItems.includes(itemId)) return false
        set((s) => ({ ownedItems: [...s.ownedItems, itemId] }))
        get().checkAchievements()
        return true
      },

      setActivePet: (petId) => set({ activePet: petId }),

      buyItem: (itemId, price, moodBoost = 0) => {
        set((s) => {
          if (s.coins < price || s.ownedItems.includes(itemId)) return s
          if (moodBoost > 0) {
            const petId = s.activePet
            const currentMood = s.petMoods?.[petId] ?? 80
            return {
              coins: s.coins - price,
              ownedItems: [...s.ownedItems, itemId],
              petMoods: { ...s.petMoods, [petId]: Math.min(100, currentMood + moodBoost) },
            }
          }
          return { coins: s.coins - price, ownedItems: [...s.ownedItems, itemId] }
        })
        get().checkAchievements()
      },

      equipToPet: (petId, itemId) =>
        set((s) => {
          const current = s.petEquipment[petId] || []
          if (current.includes(itemId)) {
            return { petEquipment: { ...s.petEquipment, [petId]: current.filter(id => id !== itemId) } }
          }
          const next = current.length >= 3 ? [...current.slice(1), itemId] : [...current, itemId]
          return { petEquipment: { ...s.petEquipment, [petId]: next } }
        }),

      toggleHomeItem: (itemId) =>
        set((s) => {
          if (s.equippedHomeItems.includes(itemId)) {
            return { equippedHomeItems: s.equippedHomeItems.filter((id) => id !== itemId) }
          }
          // 主題壁紙一次只能貼一款：貼新的自動收起舊的
          const base = itemId.startsWith('theme_')
            ? s.equippedHomeItems.filter((id) => !id.startsWith('theme_'))
            : s.equippedHomeItems
          return { equippedHomeItems: [...base, itemId] }
        }),

      moveHomeDeco: (itemId, x, y, scale) =>
        set((s) => ({
          homeDecoPositions: {
            ...s.homeDecoPositions,
            [itemId]: { x, y, scale: scale ?? s.homeDecoPositions[itemId]?.scale ?? 1 },
          },
        })),

      // 秘密庭園：種下一株（花/樹），消耗一顆對應花苗；之後每天澆水成長；最多留 24 株
      // sc＝種在哪個庭園場景（'outdoor' 秘密庭園／'magic' 魔法花園）。
      // 舊存檔的植物沒有 sc 欄位，一律當作秘密庭園（見 plantsOf）。
      plantSeed: (kind, x, y, sc = 'outdoor') =>
        set((s) => {
          if ((s.seedlings?.[kind] || 0) <= 0) return s
          // ⚠️ 滿了就不種（花苗也不扣）。原本是 slice(-24)，會默默把最舊的一株擠掉 ——
          // 安安養了好幾天的花會無聲消失，畫面上零提示。改由呼叫端先擋並給訊息。
          // 上限是「每個庭園各自」24 株，不是全部加起來。
          if ((s.garden || []).filter((p) => (p.sc || 'outdoor') === sc).length >= MAX_PLANTS) return s
          return {
            seedlings: { ...s.seedlings, [kind]: s.seedlings[kind] - 1 },
            garden: [...(s.garden || []),
              { key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, x, y, sc, v: Math.floor(Math.random() * 6), waterCount: 0, lastWater: null }
            ],
          }
        }),
      collectPlant: (key) =>
        set((s) => ({ garden: (s.garden || []).filter((p) => p.key !== key) })),

      // 澆水：每株每天可澆一次，澆一次成長一階；沒澆只是暫停（溫和版，不會枯死）
      waterPlant: (key) =>
        set((s) => {
          const today = todayKey()
          let watered = false
          const garden = (s.garden || []).map((p) => {
            if (p.key !== key || p.lastWater === today || (p.waterCount || 0) >= 99) return p
            watered = true
            return { ...p, waterCount: (p.waterCount || 0) + 1, lastWater: today }
          })
          return watered ? { garden } : s
        }),
      // 一鍵把所有「今天還沒澆、尚未開花」的植物澆一遍
      waterAll: () =>
        set((s) => {
          const today = todayKey()
          let count = 0
          const garden = (s.garden || []).map((p) => {
            const need = PLANT_KINDS[p.kind]?.need ?? 2
            if (p.lastWater === today || (p.waterCount || 0) >= need) return p
            count++
            return { ...p, waterCount: (p.waterCount || 0) + 1, lastWater: today }
          })
          return count > 0 ? { garden } : s
        }),
      // 撒肥料：立刻多長一天（跳過每日限制），消耗一包
      useFertilizer: (key) =>
        set((s) => {
          if ((s.fertilizer || 0) <= 0) return s
          let used = false
          const garden = (s.garden || []).map((p) => {
            if (p.key !== key || (p.waterCount || 0) >= 99) return p
            used = true
            return { ...p, waterCount: (p.waterCount || 0) + 1 }
          })
          return used ? { garden, fertilizer: s.fertilizer - 1 } : s
        }),

      addSeedling: (kind, n = 1) =>
        set((s) => ({ seedlings: { ...s.seedlings, [kind]: (s.seedlings?.[kind] || 0) + n } })),
      buySeedling: (kind, price) =>
        set((s) => (s.coins < price ? s : {
          coins: s.coins - price,
          seedlings: { ...s.seedlings, [kind]: (s.seedlings?.[kind] || 0) + 1 },
        })),
      buyFertilizer: (price) =>
        set((s) => (s.coins < price ? s : { coins: s.coins - price, fertilizer: (s.fertilizer || 0) + 1 })),

      // 魔法花答對題目 → 標記這株可以盛開
      solveMagicPlant: (key) =>
        set((s) => ({ garden: (s.garden || []).map((p) => (p.key === key ? { ...p, solved: true } : p)) })),

      // 採收到一朵新花色 → 記進圖鑑；集滿所有花色首次給 200 金幣大獎。回傳 {complete,reward}。
      // 採收的花進背包（可堆疊）。原本採收只換金幣，那朵花什麼都沒留下。
      addFlower: (emoji) =>
        set((s) => (emoji ? { flowers: { ...(s.flowers || {}), [emoji]: ((s.flowers || {})[emoji] || 0) + 1 } } : s)),

      // 花擺進場景當裝飾（花回饋線的第三段：採收 → 送寵物 → 擺起來看）。
      // 花從背包扣一朵變成場景裡的裝飾，收回來就還一朵，總數不會憑空多也不會憑空少。
      // 每個場景各自算上限（同寵物與植物的作法），滿了由呼叫端擋下並說明。
      placeFlower: (emoji, x, y, sc) =>
        set((s) => {
          const have = (s.flowers || {})[emoji] || 0
          if (have <= 0) return s
          if ((s.flowerDecos || []).filter((f) => f.sc === sc).length >= MAX_FLOWER_DECOS) return s
          const flowers = { ...s.flowers }
          if (have > 1) flowers[emoji] = have - 1; else delete flowers[emoji]
          return {
            flowers,
            flowerDecos: [...(s.flowerDecos || []),
              { key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, emoji, x, y, sc }],
          }
        }),

      // 收回擺出來的花：花回到背包，可以改擺別的地方或改送寵物
      takeFlowerBack: (key) =>
        set((s) => {
          const f = (s.flowerDecos || []).find((d) => d.key === key)
          if (!f) return s
          return {
            flowerDecos: (s.flowerDecos || []).filter((d) => d.key !== key),
            flowers: { ...(s.flowers || {}), [f.emoji]: ((s.flowers || {})[f.emoji] || 0) + 1 },
          }
        }),

      // 送花給寵物：喜歡這種花的收到會特別開心（love 名單沿用 PLANT_KINDS）。
      // 回傳 { loved, exp, mood } 給畫面做反應；沒花或寵物沒解鎖回 null。
      giveFlower: (emoji, petId) => {
        const s = get()
        if (!emoji || !petId) return null
        if (((s.flowers || {})[emoji] || 0) <= 0) return null
        if (!s.pets[petId]?.unlocked) return null
        const kind = bloomKind(emoji)
        const loved = !!(kind && (PLANT_KINDS[kind].love || []).includes(petId))
        const gain = loved ? FLOWER_GIFT.loved : FLOWER_GIFT.plain
        set((prev) => {
          const left = (prev.flowers[emoji] || 0) - 1
          const flowers = { ...prev.flowers }
          if (left > 0) flowers[emoji] = left; else delete flowers[emoji]
          const pet = prev.pets[petId]
          return {
            flowers,
            pets: { ...prev.pets, [petId]: { ...pet, foodExp: (pet.foodExp || 0) + gain.exp } },
            petMoods: { ...prev.petMoods, [petId]: Math.min(100, (prev.petMoods?.[petId] ?? 80) + gain.mood) },
          }
        })
        return { loved, ...gain }
      },

      recordBloom: (emoji) => {
        const s = get()
        if (!emoji || (s.gardenDex || []).includes(emoji)) return null
        const dex = [...(s.gardenDex || []), emoji]
        const complete = !s.gardenDexDone && ALL_BLOOMS.every((e) => dex.includes(e))
        set((prev) => ({
          gardenDex: dex,
          ...(complete ? { gardenDexDone: true, coins: prev.coins + 200, totalCoinsEarned: prev.totalCoinsEarned + 200 } : {}),
        }))
        return { complete, reward: complete ? 200 : 0 }
      },

      // 今天有澆水就登記一次：連續澆水累積 streak（斷了重數、不處罰），每 3 天小獎、每 7 天大獎。
      // 回傳 {streak,reward}；今天已登記過回傳 null。
      registerWaterDay: () => {
        const s = get()
        const today = todayKey()
        if (s.lastWaterDay === today) return null
        const streak = s.lastWaterDay === yesterdayKey() ? (s.waterStreak || 0) + 1 : 1
        const reward = streak % 7 === 0 ? 60 : streak % 3 === 0 ? 25 : 0
        set((prev) => ({
          lastWaterDay: today,
          waterStreak: streak,
          waterStreakBest: Math.max(prev.waterStreakBest || 0, streak),
          ...(reward ? { coins: prev.coins + reward, totalCoinsEarned: prev.totalCoinsEarned + reward } : {}),
        }))
        return { streak, reward }
      },

      // 寵物搬家：把牠改成住室內或戶外。每個場景有 MAX_PETS_PER_SCENE 的上限
      // （效能考量，見 roomRules.js 的說明），滿了就不搬並回報原因給畫面顯示。
      // 回傳 'ok' | 'full' | 'same'
      setPetHabitat: (petId, scene) => {
        const s = get()
        if (habitatOfPet(petId, s.petHabitat) === scene) return 'same'
        const count = Object.keys(s.pets).filter(
          (id) => s.pets[id]?.unlocked && habitatOfPet(id, s.petHabitat) === scene
        ).length
        if (count >= MAX_PETS_PER_SCENE) return 'full'
        set((prev) => ({ petHabitat: { ...prev.petHabitat, [petId]: scene } }))
        return 'ok'
      },

      // 寵物的窩：把牠拖到某個位置放開，那裡就成為牠的窩（牠仍會在附近走動）。
      // 記 sc 是因為同一隻寵物搬家之後，舊場景的窩就不該再套用。
      // 再拖一次就換位置；拖回原本的窩附近等於沒變，安安不會被卡住。
      setPetNest: (petId, x, y, sc) =>
        set((s) => ({ petNests: { ...s.petNests, [petId]: { x, y, sc } } })),
      clearPetNest: (petId) =>
        set((s) => {
          const next = { ...s.petNests }
          delete next[petId]
          return { petNests: next }
        }),

      // 指派花園小幫手（喜歡某些花的寵物幫忙顧）
      setGardenKeeper: (petId) =>
        set((s) => ({ gardenKeeper: s.gardenKeeper === petId ? null : petId })),

      // 進花園時呼叫：小幫手趁你不在，幫「牠喜歡的」植物澆水（每天最多 2 株）。
      // 回傳 {petId,count}；今天已幫過或沒事可做回傳 null。
      keeperTend: () => {
        const s = get()
        const keeper = s.gardenKeeper
        const today = todayKey()
        if (!keeper || !s.pets[keeper]?.unlocked || s.keeperHelpedDay === today) return null
        const loved = new Set(
          Object.entries(PLANT_KINDS).filter(([, c]) => (c.love || []).includes(keeper)).map(([k]) => k)
        )
        let helped = 0
        const garden = (s.garden || []).map((p) => {
          const need = PLANT_KINDS[p.kind]?.need ?? 2
          if (helped < 2 && p.lastWater !== today && (p.waterCount || 0) < need && loved.has(p.kind)) {
            helped++
            return { ...p, waterCount: (p.waterCount || 0) + 1, lastWater: today }
          }
          return p
        })
        set({ garden, keeperHelpedDay: today })
        return helped > 0 ? { petId: keeper, count: helped } : null
      },

      // ── M10: 當日限定挑戰 ──
      // 每天算一次就存起來：候選關卡的狀態會在一天之內變動，
      // 每次重算會讓挑戰在玩到一半時換掉，所以只在跨日時重算。
      initDailyChallenge: (today) => {
        const s = get()
        if (s.challengeDate === today) return
        set({
          challengeDate: today,
          challengeStage: pickDailyChallenge(today, s),
          challengeDone: false,
        })
      },

      // 領取加倍獎勵：回傳加碼掉落物給結算畫面顯示，沒領到回 null
      claimDailyChallenge: (stageId) => {
        const s = get()
        if (s.challengeStage !== stageId || s.challengeDone) return null
        // 保證掉一個：八成花苗、兩成幸運蛋
        const egg = Math.random() < 0.2
        const seed = egg ? null : rollSeedDrop(3)
        set({
          challengeDone: true,
          luckyEggs: s.luckyEggs + (egg ? 1 : 0),
          seedlings: seed ? { ...s.seedlings, [seed]: (s.seedlings?.[seed] || 0) + 1 } : s.seedlings,
        })
        return egg ? { egg: true } : { seed }
      },

      // ── M3: Daily tasks ──
      initDaily: (today) => {
        const s = get()
        if (s.dailyDate !== today) {
          const allDone = s.dailyTasksDone.length >= 3
          set({
            dailyDate: today,
            dailyProgress: {},
            dailyTasksDone: [],
            dailyDaysCompleted: s.dailyDaysCompleted + (allDone ? 1 : 0),
          })
        }
      },

      updateDailyProgress: (type, amount) => {
        set((s) => {
          const updated = { ...s.dailyProgress }
          updated[type] = (updated[type] || 0) + amount
          return { dailyProgress: updated }
        })
      },

      completeDailyTask: (taskId, type, reward) => {
        const s = get()
        if (s.dailyTasksDone.includes(taskId)) return
        set((prev) => ({
          coins: prev.coins + reward,
          totalCoinsEarned: prev.totalCoinsEarned + reward,
          dailyTasksDone: [...prev.dailyTasksDone, taskId],
          pendingAchievement: null,
        }))
        // check if all 3 done → bonus
        const newDone = [...s.dailyTasksDone, taskId]
        if (newDone.length >= 3) {
          set((prev) => ({
            coins: prev.coins + 50,
            totalCoinsEarned: prev.totalCoinsEarned + 50,
          }))
        }
        get().checkAchievements()
      },

      // ── M3: Boss ──
      clearBoss: (chapterId, rewardItemId) => {
        set((s) => ({
          bossCleared: { ...s.bossCleared, [chapterId]: true },
          ownedItems: s.ownedItems.includes(rewardItemId)
            ? s.ownedItems
            : [...s.ownedItems, rewardItemId],
        }))
        get().checkAchievements()
      },

      // ── M3: Achievements ──
      checkAchievements: () => {
        const s = get()
        const newIds = checkAllAchievements(s)
        if (newIds.length === 0) return
        const newAchievements = { ...s.achievements }
        newIds.forEach((id) => { newAchievements[id] = true })
        set({ achievements: newAchievements, pendingAchievement: newIds[0] })
      },

      // ── M5: Exam Boss ──
      recordSubjectResult: (subjectId, passed, rewardItemId, streakNeeded) => {
        set((s) => {
          const prev      = s.subjectStreaks?.[subjectId] ?? 0
          const newStreak = passed ? prev + 1 : 0
          const threshold = streakNeeded ?? 5
          const shouldAward = passed && newStreak >= threshold && !s.ownedItems.includes(rewardItemId)
          return {
            subjectStreaks: { ...(s.subjectStreaks ?? {}), [subjectId]: newStreak },
            ...(shouldAward ? { ownedItems: [...s.ownedItems, rewardItemId] } : {}),
          }
        })
      },

      popSubjectQuestions: (subjectId, allIds, n) => {
        let picked = []
        set((s) => {
          let queue = [...(s.subjectQueues?.[subjectId] ?? [])]
          while (picked.length < n) {
            if (queue.length === 0) {
              queue = [...allIds].sort(() => Math.random() - 0.5)
            }
            picked.push(queue.shift())
          }
          return { subjectQueues: { ...(s.subjectQueues ?? {}), [subjectId]: queue } }
        })
        return picked
      },

      recordSubjectPerfect: (subjectId, rewardItemId) => {
        set((s) => {
          const prev = s.subjectPerfects?.[subjectId] ?? 0
          const newCount = prev + 1
          const shouldAward = prev < 3 && newCount >= 3 && !s.ownedItems.includes(rewardItemId)
          return {
            subjectPerfects: { ...(s.subjectPerfects ?? {}), [subjectId]: newCount },
            ...(shouldAward ? { ownedItems: [...s.ownedItems, rewardItemId] } : {}),
          }
        })
      },

      clearExamBoss: (coinsReward, rewardItemId) => {
        set((s) => ({
          examBossCleared: true,
          coins: s.coins + coinsReward,
          totalCoinsEarned: s.totalCoinsEarned + coinsReward,
          ownedItems: s.ownedItems.includes(rewardItemId)
            ? s.ownedItems
            : [...s.ownedItems, rewardItemId],
        }))
        get().checkAchievements()
      },

      clearMakeTen: () => {
        set((s) => {
          const first = !s.makeTenCleared
          return {
            makeTenCleared: true,
            ...(first ? { coins: s.coins + 300, totalCoinsEarned: s.totalCoinsEarned + 300 } : {}),
            ownedItems: s.ownedItems.includes('golden_finger')
              ? s.ownedItems
              : [...s.ownedItems, 'golden_finger'],
          }
        })
        get().checkAchievements()
      },

      clearMakeTwenty: () => {
        set((s) => {
          const first = !s.makeTwentyCleared
          return {
            makeTwentyCleared: true,
            ...(first ? { coins: s.coins + 500, totalCoinsEarned: s.totalCoinsEarned + 500 } : {}),
            ownedItems: s.ownedItems.includes('double_v')
              ? s.ownedItems
              : [...s.ownedItems, 'double_v'],
          }
        })
        get().checkAchievements()
      },

      clearMakeHundred: () => {
        set((s) => {
          const first = !s.makeHundredCleared
          return {
            makeHundredCleared: true,
            ...(first ? { coins: s.coins + 800, totalCoinsEarned: s.totalCoinsEarned + 800 } : {}),
            ownedItems: s.ownedItems.includes('century_crown')
              ? s.ownedItems
              : [...s.ownedItems, 'century_crown'],
          }
        })
        get().checkAchievements()
      },

      clearCrossEquals: () => {
        set((s) => {
          const first = !s.crossEqualsCleared
          return {
            crossEqualsCleared: true,
            ...(first ? { coins: s.coins + 600, totalCoinsEarned: s.totalCoinsEarned + 600 } : {}),
            ownedItems: s.ownedItems.includes('equation_scale')
              ? s.ownedItems
              : [...s.ownedItems, 'equation_scale'],
          }
        })
        get().checkAchievements()
      },

      clearWordProblem: () => {
        set((s) => {
          const first = !s.wordProblemCleared
          return {
            wordProblemCleared: true,
            ...(first ? { coins: s.coins + 700, totalCoinsEarned: s.totalCoinsEarned + 700 } : {}),
            ownedItems: s.ownedItems.includes('reading_glasses')
              ? s.ownedItems
              : [...s.ownedItems, 'reading_glasses'],
            // 過關即贈送企鵝寶寶「波波」
            pets: s.pets.penguin?.unlocked
              ? s.pets
              : { ...s.pets, penguin: { ...s.pets.penguin, unlocked: true } },
          }
        })
        get().checkAchievements()
      },

      clearMultiply: () => {
        set((s) => {
          const first = !s.multiplyCleared
          return {
            multiplyCleared: true,
            ...(first ? { coins: s.coins + 500, totalCoinsEarned: s.totalCoinsEarned + 500 } : {}),
            ownedItems: s.ownedItems.includes('abacus_master')
              ? s.ownedItems
              : [...s.ownedItems, 'abacus_master'],
          }
        })
        get().checkAchievements()
      },

      // ── M7: 推理事件簿 ──
      // 破案：首次破案給金幣獎勵，重玩不重複發。
      solveMystery: (chapterId, coinsReward) => {
        set((s) => {
          if (s.mysterySolved?.[chapterId]) return s
          return {
            mysterySolved: { ...s.mysterySolved, [chapterId]: true },
            coins: s.coins + coinsReward,
            totalCoinsEarned: s.totalCoinsEarned + coinsReward,
          }
        })
        get().checkAchievements()
      },

      // ── M8: 長篇連續劇 ──
      // 破案一集：首次破案給金幣＋收集碎片(S1)/星座徽章(S2)，重玩不重複發。
      // 終章的寵物／擺飾另由畫面呼叫 grantPet/grantItem。shard=S1碎片色、badge=S2星座id、gem=S3寶石id、seal=S4金印id、stamp=S5紀念章id、piece=S6台灣拼圖id、page=S7家鄉故事書頁id。
      solveEpisode: (episodeId, coinsReward, shard, badge, gem, seal, stamp, piece, page) => {
        set((s) => {
          if (s.seriesSolved?.[episodeId]) return s
          const badges = s.seriesBadges || []
          const gems = s.seriesGems || []
          const seals = s.seriesSeals || []
          const stamps = s.seriesStamps || []
          const pieces = s.seriesPieces || []
          const pages = s.seriesPages || []
          return {
            seriesSolved: { ...s.seriesSolved, [episodeId]: true },
            seriesShards: (shard && !s.seriesShards.includes(shard)) ? [...s.seriesShards, shard] : s.seriesShards,
            seriesBadges: (badge && !badges.includes(badge)) ? [...badges, badge] : badges,
            seriesGems: (gem && !gems.includes(gem)) ? [...gems, gem] : gems,
            seriesSeals: (seal && !seals.includes(seal)) ? [...seals, seal] : seals,
            seriesStamps: (stamp && !stamps.includes(stamp)) ? [...stamps, stamp] : stamps,
            seriesPieces: (piece && !pieces.includes(piece)) ? [...pieces, piece] : pieces,
            seriesPages: (page && !pages.includes(page)) ? [...pages, page] : pages,
            coins: s.coins + coinsReward,
            totalCoinsEarned: s.totalCoinsEarned + coinsReward,
          }
        })
        get().checkAchievements()
      },

      clearPendingAchievement: () => set({ pendingAchievement: null }),

      updateMaxCombo: (combo) =>
        set((s) => combo > s.maxCombo ? { maxCombo: combo } : s),

      updateTotalCoins: (amount) =>
        set((s) => ({ totalCoinsEarned: s.totalCoinsEarned + amount })),

      // M4: mood actions
      updatePetMood: (petId, delta) =>
        set((s) => {
          const current = s.petMoods?.[petId] ?? 80
          return { petMoods: { ...s.petMoods, [petId]: Math.min(100, Math.max(0, current + delta)) } }
        }),

      // ── M9: 寵物技能能量 ──
      // 答一題回復能量（答對答錯都給），上限 100。
      gainEnergy: (petId, amount) =>
        set((s) => {
          const cur = s.petEnergy?.[petId] ?? ENERGY_START
          return { petEnergy: { ...s.petEnergy, [petId]: Math.min(ENERGY_MAX, cur + amount) } }
        }),

      // 發動技能：能量足夠才扣除並回傳 true，不夠回傳 false（畫面據此判斷可否發動）。
      spendEnergy: (petId, cost) => {
        const cur = get().petEnergy?.[petId] ?? 0
        if (cur < cost) return false
        set((s) => ({ petEnergy: { ...s.petEnergy, [petId]: cur - cost } }))
        return true
      },

      stampPlayTime: () => set({ lastPlayedAt: Date.now() }),

      checkMoodDecay: () => {
        const s = get()
        if (!s.lastPlayedAt) return
        const daysSince = (Date.now() - s.lastPlayedAt) / (1000 * 60 * 60 * 24)
        const decay = Math.floor(daysSince) * 8
        if (decay <= 0) return
        const newMoods = {}
        Object.keys(s.petMoods || {}).forEach((id) => {
          newMoods[id] = Math.max(5, (s.petMoods[id] ?? 80) - decay)
        })
        set({ petMoods: newMoods })
      },

      // ── M6: 每日登入禮物 ──
      // 每天第一次進遊戲領禮物：金幣 + 幸運蛋。連續登入（昨天有領）累積 streak，
      // 每 3 天小獎、每 7 天大獎。已在今天領過則不重複。
      claimDailyGift: (today, yesterday) => {
        const s = get()
        if (s.lastGiftDate === today) return
        const streak = s.lastGiftDate === yesterday ? s.loginStreak + 1 : 1
        const milestone = streak % 7 === 0 ? 7 : streak % 3 === 0 ? 3 : 0
        const eggs = 1 + (milestone === 7 ? 3 : milestone === 3 ? 1 : 0)
        const coins = 20 + milestone * 10
        set((prev) => ({
          lastGiftDate: today,
          loginStreak: streak,
          loginStreakBest: Math.max(prev.loginStreakBest, streak),
          luckyEggs: prev.luckyEggs + eggs,
          coins: prev.coins + coins,
          totalCoinsEarned: prev.totalCoinsEarned + coins,
          pendingLoginGift: { coins, eggs, streak, milestone },
        }))
      },

      clearLoginGift: () => set({ pendingLoginGift: null }),

      // 敲開一顆幸運蛋，抽一件可收集道具（重複換金幣）。回傳抽獎結果給 UI 播動畫。
      openLuckyEgg: () => {
        const s = get()
        if (s.luckyEggs <= 0) return null
        const result = pullLuckyEgg(s.ownedItems)
        set((prev) => ({
          luckyEggs: prev.luckyEggs - 1,
          ownedItems: result.isDup ? prev.ownedItems : [...prev.ownedItems, result.item.id],
          ...(result.isDup
            ? { coins: prev.coins + result.dupBonus, totalCoinsEarned: prev.totalCoinsEarned + result.dupBonus }
            : {}),
        }))
        get().checkAchievements()
        return result
      },

      resetGame: () =>
        set({
          coins: 0,
          activePet: 'lulu',
          pets: {
            lulu:    { unlocked: true,  evolutionStage: 1, foodExp: 0, accessories: [] },
            hana:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            kotaro:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            jiji:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            kitsune: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            mejiro:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            penguin: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            owl:     { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            seal:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            beaver:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            hamster: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            dino:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            monkey:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            raccoon: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            twinkle: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            luna:    { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            pluto:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            xiaoq:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            feifei:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            xiaohu:  { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
          },
          stages: makeStages(),
          stagePlays: {},
          stageLastPlay: {},
          challengeDate: null,
          challengeStage: null,
          challengeDone: false,
          ownedItems:        [],
          petEquipment:      { lulu: [], hana: [], kotaro: [], jiji: [], kitsune: [], mejiro: [], penguin: [], owl: [], seal: [], beaver: [], hamster: [], dino: [], monkey: [], raccoon: [] },
          equippedHomeItems: [],
          homeDecoPositions: {},
          garden: [],
          seedlings: { flower: 3, rare: 0, tree: 1, magic: 0 },
          fertilizer: 1,
          lastSeedDrop: null,
          gardenDex: [],
          gardenDexDone: false,
          waterStreak: 0,
          waterStreakBest: 0,
          lastWaterDay: null,
          gardenKeeper: null,
          keeperHelpedDay: null,
          dailyDate: null,
          dailyProgress: {},
          dailyTasksDone: [],
          dailyDaysCompleted: 0,
          bossCleared: { 10: false, 20: false, 30: false, 40: false },
          examBossCleared: false,
          makeTenCleared: false,
          makeTwentyCleared: false,
          makeHundredCleared: false,
          crossEqualsCleared: false,
          wordProblemCleared: false,
          multiplyCleared: false,
          subjectPerfects: { math: 0, social: 0, nature: 0, chinese: 0 },
          subjectQueues:   { math: [], social: [], nature: [], chinese: [] },
          subjectStreaks:  { math: 0, social: 0, nature: 0, chinese: 0 },
          achievements: {},
          pendingAchievement: null,
          totalCoinsEarned: 0,
          maxCombo: 0,
          perfectStages: 0,
          petMoods: { lulu: 80, hana: 80, kotaro: 80, jiji: 80, kitsune: 80, mejiro: 80, penguin: 80, owl: 80, seal: 80, beaver: 80, hamster: 80, dino: 80, monkey: 80, raccoon: 80 },
          petEnergy: { lulu: ENERGY_START, hana: ENERGY_START, kotaro: ENERGY_START, jiji: ENERGY_START, kitsune: ENERGY_START, mejiro: ENERGY_START, penguin: ENERGY_START, owl: ENERGY_START, seal: ENERGY_START, beaver: ENERGY_START, hamster: ENERGY_START, dino: ENERGY_START, monkey: ENERGY_START, raccoon: ENERGY_START },
          lastPlayedAt: null,
          luckyEggs: 0,
          lastGiftDate: null,
          loginStreak: 0,
          loginStreakBest: 0,
          pendingLoginGift: null,
          mysterySolved: {},
          seriesSolved: {},
          seriesShards: [],
          seriesBadges: [],
          seriesGems: [],
          seriesSeals: [],
          seriesStamps: [],
          seriesPieces: [],
          seriesPages: [],
        }),
    }),
    {
      name: 'anan-game-v2',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const allPets = ['lulu', 'hana', 'kotaro', 'jiji', 'kitsune', 'mejiro', 'penguin', 'owl', 'seal', 'beaver', 'hamster', 'dino', 'monkey', 'raccoon', 'twinkle', 'luna', 'pluto', 'xiaoq', 'feifei', 'xiaohu', 'arong']
        allPets.forEach((id) => {
          const p = state.pets[id]
          if (!p) {
            state.pets[id] = { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] }
          } else {
            // 補齊殘缺欄位：grantPet 曾對未在 pets 初始化的寵物（如阿榕）展開 undefined，
            // 造成 { unlocked:true } 缺 evolutionStage → 寵物頁讀 stages[undefined] 直接崩潰
            if (p.evolutionStage === undefined) p.evolutionStage = 1
            if (p.foodExp === undefined) p.foodExp = 0
            if (!p.accessories) p.accessories = []
          }
          if (!state.petEquipment[id])
            state.petEquipment[id] = []
        })
        if (state.examBossCleared === undefined) state.examBossCleared = false
        if (!state.subjectPerfects) {
          state.subjectPerfects = { math: 0, social: 0, nature: 0, chinese: 0 }
        } else {
          const subs = ['math', 'social', 'nature', 'chinese']
          subs.forEach(id => { if (state.subjectPerfects[id] === undefined) state.subjectPerfects[id] = 0 })
        }
        if (!state.subjectQueues) {
          state.subjectQueues = { math: [], social: [], nature: [], chinese: [] }
        }
        if (!state.subjectStreaks) {
          state.subjectStreaks = { math: 0, social: 0, nature: 0, chinese: 0 }
        }
        // Add stages 56-70 if missing (added in v2.1)
        for (let i = 56; i <= 70; i++) {
          if (!state.stages[i]) state.stages[i] = { completed: false, stars: 0 }
        }
        if (!state.petMoods) {
          state.petMoods = { lulu: 80, hana: 80, kotaro: 80, jiji: 80, kitsune: 80, mejiro: 80 }
        } else {
          allPets.forEach((id) => {
            if (state.petMoods[id] === undefined) state.petMoods[id] = 80
          })
        }
        // M9: 寵物技能能量
        if (!state.petEnergy) state.petEnergy = {}
        allPets.forEach((id) => {
          if (state.petEnergy[id] === undefined) state.petEnergy[id] = ENERGY_START
        })
        // M6: 幸運蛋 + 登入禮物
        if (state.luckyEggs === undefined) state.luckyEggs = 0
        if (state.lastGiftDate === undefined) state.lastGiftDate = null
        if (state.loginStreak === undefined) state.loginStreak = 0
        if (state.loginStreakBest === undefined) state.loginStreakBest = 0
        state.pendingLoginGift = null
        // 花園升級：花苗庫存／肥料，並補齊舊植物的澆水欄位
        if (!state.seedlings) state.seedlings = { flower: 3, rare: 0, tree: 1, magic: 0 }
        if (state.seedlings.magic === undefined) state.seedlings.magic = 0
        if (state.fertilizer === undefined) state.fertilizer = 1
        if (state.lastSeedDrop === undefined) state.lastSeedDrop = null
        // 花園第二彈：圖鑑／連續澆水／小幫手
        if (!state.gardenDex) state.gardenDex = []
        if (state.gardenDexDone === undefined) state.gardenDexDone = false
        if (state.waterStreak === undefined) state.waterStreak = 0
        if (state.waterStreakBest === undefined) state.waterStreakBest = 0
        if (state.lastWaterDay === undefined) state.lastWaterDay = null
        if (state.gardenKeeper === undefined) state.gardenKeeper = null
        if (state.keeperHelpedDay === undefined) state.keeperHelpedDay = null
        if (Array.isArray(state.garden)) {
          state.garden = state.garden.map((p) => (
            p.waterCount === undefined ? { ...p, kind: p.kind === 'tree' ? 'tree' : 'flower', waterCount: 1, lastWater: null } : p
          ))
        }
        // M7: 推理事件簿
        if (!state.mysterySolved) state.mysterySolved = {}
        // M8: 長篇連續劇
        if (!state.seriesSolved) state.seriesSolved = {}
        if (!state.seriesShards) state.seriesShards = []
        if (!state.seriesBadges) state.seriesBadges = []
        if (!state.seriesGems) state.seriesGems = []
        if (!state.seriesSeals) state.seriesSeals = []
        if (!state.seriesStamps) state.seriesStamps = []
        if (!state.seriesPieces) state.seriesPieces = []
        if (!state.seriesPages) state.seriesPages = []
        // 秘密庭園
        if (!state.garden) state.garden = []
      },
    }
  )
)
