import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENTS } from '../data/achievements'
import { EVOLVE_EXP } from '../data/pets'

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
      },
      stages: makeStages(),
      ownedItems:        [],
      petEquipment:      { lulu: [], hana: [], kotaro: [], jiji: [], kitsune: [], mejiro: [] },
      equippedHomeItems: [],
      homeDecoPositions: {},

      // M3: daily tasks
      dailyDate: null,
      dailyProgress: {},
      dailyTasksDone: [],
      dailyDaysCompleted: 0,

      // M3: boss
      bossCleared: { 10: false, 20: false, 30: false, 40: false },

      // M5: exam boss
      examBossCleared: false,
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
      petMoods: { lulu: 80, hana: 80, kotaro: 80, jiji: 80, kitsune: 80, mejiro: 80 },
      lastPlayedAt: null,

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

      // ── M5: Exam Boss ──
      recordSubjectResult: (subjectId, passed, rewardItemId) => {
        set((s) => {
          const prev     = s.subjectStreaks?.[subjectId] ?? 0
          const newStreak = passed ? prev + 1 : 0
          const shouldAward = passed && newStreak >= 5 && !s.ownedItems.includes(rewardItemId)
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
          },
          stages: makeStages(),
          ownedItems:        [],
          petEquipment:      { lulu: [], hana: [], kotaro: [], jiji: [], kitsune: [], mejiro: [] },
          equippedHomeItems: [],
          homeDecoPositions: {},
          dailyDate: null,
          dailyProgress: {},
          dailyTasksDone: [],
          dailyDaysCompleted: 0,
          bossCleared: { 10: false, 20: false, 30: false, 40: false },
          examBossCleared: false,
          subjectPerfects: { math: 0, social: 0, nature: 0, chinese: 0 },
          subjectQueues:   { math: [], social: [], nature: [], chinese: [] },
          subjectStreaks:  { math: 0, social: 0, nature: 0, chinese: 0 },
          achievements: {},
          pendingAchievement: null,
          totalCoinsEarned: 0,
          maxCombo: 0,
          perfectStages: 0,
          petMoods: { lulu: 80, hana: 80, kotaro: 80, jiji: 80, kitsune: 80, mejiro: 80 },
          lastPlayedAt: null,
        }),
    }),
    {
      name: 'anan-game-v2',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const allPets = ['lulu', 'hana', 'kotaro', 'jiji', 'kitsune', 'mejiro']
        allPets.forEach((id) => {
          if (!state.pets[id])
            state.pets[id] = { unlocked: false, evolutionStage: 1, foodExp: 0, accessories: [] }
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
      },
    }
  )
)
