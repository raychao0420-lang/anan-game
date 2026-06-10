import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENTS } from '../data/achievements'
import { EVOLVE_EXP } from '../data/pets'

const makeStages = () => {
  const s = {}
  for (let i = 1; i <= 45; i++) s[i] = { completed: false, stars: 0 }
  return s
}

function checkAllAchievements(s) {
  const unlocked = []
  const a = s.achievements
  const completedCount = Object.values(s.stages).filter(st => st.completed).length

  if (!a.first_stage  && completedCount >= 1)  unlocked.push('first_stage')
  if (!a.stage_10     && completedCount >= 10) unlocked.push('stage_10')
  if (!a.stage_all    && completedCount >= 45) unlocked.push('stage_all')
  if (!a.perfect      && s.perfectStages > 0)  unlocked.push('perfect')
  if (!a.combo10      && s.maxCombo >= 10)      unlocked.push('combo10')
  if (!a.evolve1      && Object.values(s.pets).some(p => p.evolutionStage >= 2)) unlocked.push('evolve1')
  if (!a.evolve_max   && Object.values(s.pets).some(p => p.evolutionStage >= 4)) unlocked.push('evolve_max')
  if (!a.all_pets     && Object.values(s.pets).every(p => p.unlocked)) unlocked.push('all_pets')
  if (!a.boss1        && Object.values(s.bossCleared).some(v => v)) unlocked.push('boss1')
  if (!a.boss_all     && Object.values(s.bossCleared).filter(v => v).length >= 4) unlocked.push('boss_all')
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
        lulu:   { unlocked: true,  evolutionStage: 1, foodExp: 0, accessories: [] },
        hana:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        kotaro: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
        jiji:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
      },
      stages: makeStages(),
      ownedItems:        [],
      petEquipment:      { lulu: [], hana: [], kotaro: [], jiji: [] },
      equippedHomeItems: [],
      homeDecoPositions: {},

      // M3: daily tasks
      dailyDate: null,
      dailyProgress: {},
      dailyTasksDone: [],
      dailyDaysCompleted: 0,

      // M3: boss
      bossCleared: { 10: false, 20: false, 30: false, 40: false },

      // M3: achievements
      achievements: {},
      pendingAchievement: null,

      // M3: stats for achievements
      totalCoinsEarned: 0,
      maxCombo: 0,
      perfectStages: 0,

      // ── Core actions ──
      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

      completeStage: (stageId, stars, coinsEarned) => {
        set((s) => {
          const isPerfect = stars === 3 && coinsEarned >= 100
          return {
            coins: s.coins + coinsEarned,
            totalCoinsEarned: s.totalCoinsEarned + coinsEarned,
            perfectStages: s.perfectStages + (isPerfect ? 1 : 0),
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
          return {
            coins: s.coins - cost,
            pets: { ...s.pets, [petId]: { ...pet, foodExp: (pet.foodExp || 0) + expGain } },
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

      setActivePet: (petId) => set({ activePet: petId }),

      buyItem: (itemId, price) => {
        set((s) => {
          if (s.coins < price || s.ownedItems.includes(itemId)) return s
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
          return { equippedHomeItems: [...s.equippedHomeItems, itemId] }
        }),

      moveHomeDeco: (itemId, x, y, scale) =>
        set((s) => ({
          homeDecoPositions: {
            ...s.homeDecoPositions,
            [itemId]: { x, y, scale: scale ?? s.homeDecoPositions[itemId]?.scale ?? 1 },
          },
        })),

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

      clearPendingAchievement: () => set({ pendingAchievement: null }),

      updateMaxCombo: (combo) =>
        set((s) => combo > s.maxCombo ? { maxCombo: combo } : s),

      updateTotalCoins: (amount) =>
        set((s) => ({ totalCoinsEarned: s.totalCoinsEarned + amount })),

      resetGame: () =>
        set({
          coins: 0,
          activePet: 'lulu',
          pets: {
            lulu:   { unlocked: true,  evolutionStage: 1, foodExp: 0, accessories: [] },
            hana:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            kotaro: { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
            jiji:   { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] },
          },
          stages: makeStages(),
          ownedItems:        [],
          petEquipment:      { lulu: [], hana: [], kotaro: [], jiji: [] },
          equippedHomeItems: [],
          homeDecoPositions: {},
          dailyDate: null,
          dailyProgress: {},
          dailyTasksDone: [],
          dailyDaysCompleted: 0,
          bossCleared: { 10: false, 20: false, 30: false, 40: false },
          achievements: {},
          pendingAchievement: null,
          totalCoinsEarned: 0,
          maxCombo: 0,
          perfectStages: 0,
        }),
    }),
    { name: 'anan-game-v2' }
  )
)
