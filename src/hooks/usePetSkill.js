import { useState, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { PET_SKILLS, SKILL_COST, ENERGY_PER_QUESTION } from '../data/pets'
import { sfx } from '../utils/sound'

// 各答題畫面共用的寵物技能邏輯。畫面只需提供它支援的效果 handler：
//   onTime(seconds)  – 加時（幾乎所有計時模式都支援）
//   onCoin(amount)   – 立即加金幣（沒有逐題金幣的模式用；amount 由技能資料換算）
// 護盾（shield）不透過 handler，改由畫面在「答錯/逾時」時呼叫 consumeShield() 決定要不要免死。
//
// 用法：
//   const skill = usePetSkill({ onTime: sec => setTimeLeft(t => t + sec), onCoin: n => addCoins(n) })
//   <PetSkillButton petId={skill.activePet} energy={skill.energy} used={skill.usedThisQ}
//                   disabled={...} onActivate={skill.activate} />
//   每進到新題目呼叫 skill.nextQuestion()；每答完一題呼叫 skill.gainEnergy()
export function usePetSkill({ onTime, onCoin } = {}) {
  const { activePet, petEnergy, gainEnergy, spendEnergy } = useGameStore()
  const [usedThisQ, setUsedThisQ] = useState(false)
  const [flash, setFlash]         = useState(null)
  const shieldRef = useRef(false)
  const flashRef  = useRef(null)

  const activate = (skill) => {
    if (usedThisQ) return
    if (!spendEnergy(activePet, SKILL_COST)) return
    setUsedThisQ(true)
    const eff = skill.effect
    if (eff.type === 'time') {
      onTime?.(eff.value)
    } else if (eff.type === 'shield') {
      shieldRef.current = true
    } else if (eff.type === 'coin') {
      // 沒有逐題金幣的模式：×2 給固定 20，+N 給 N
      onCoin?.(eff.add ?? 20)
    }
    sfx.pet(activePet)
    clearTimeout(flashRef.current)
    setFlash(`${skill.icon} ${skill.name}！`)
    flashRef.current = setTimeout(() => setFlash(null), 900)
  }

  // 進到下一題：重置「本題已用」與護盾
  const nextQuestion = () => { setUsedThisQ(false); shieldRef.current = false }

  // 答完一題回復能量（答對答錯都給）
  const addEnergy = () => gainEnergy(activePet, ENERGY_PER_QUESTION)

  // 答錯/逾時時呼叫：有護盾就消耗並回傳 true（畫面據此免死）
  const consumeShield = () => {
    if (shieldRef.current) { shieldRef.current = false; return true }
    return false
  }

  return {
    activePet,
    energy: petEnergy?.[activePet] ?? 0,
    skill: PET_SKILLS[activePet],
    usedThisQ,
    flash,
    activate,
    nextQuestion,
    addEnergy,
    consumeShield,
  }
}
