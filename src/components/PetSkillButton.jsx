import { motion, AnimatePresence } from 'framer-motion'
import { PET_SKILLS, SKILL_COST, ENERGY_MAX } from '../data/pets'
import './PetSkillButton.css'

// 一行接好技能鈕＋發動提示：把 usePetSkill() 回傳整包丟進來即可。
export function SkillBar({ skill, disabled = false }) {
  return (
    <>
      <div className="skill-row">
        <PetSkillButton
          petId={skill.activePet}
          energy={skill.energy}
          used={skill.usedThisQ}
          disabled={disabled}
          onActivate={skill.activate}
        />
      </div>
      <AnimatePresence>
        {skill.flash && (
          <motion.div
            className="skill-toast"
            initial={{ scale: 0.6, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ type: 'spring', stiffness: 320 }}
          >
            {skill.flash}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// 寵物技能發動鈕（各答題畫面共用）。
// props:
//   petId    – 目前出戰寵物
//   energy   – 該寵物目前能量
//   used     – 這一題是否已用過技能（一題只能發動一次）
//   disabled – 額外停用條件（例：暫停、答題回饋動畫中）
//   onActivate(skill) – 能量足夠且可發動時呼叫，由畫面套用效果並扣能量
export default function PetSkillButton({ petId, energy, used = false, disabled = false, onActivate }) {
  const skill = PET_SKILLS[petId]
  if (!skill) return null

  const ready = energy >= SKILL_COST && !used && !disabled
  const pct = Math.min(100, (energy / ENERGY_MAX) * 100)

  return (
    <motion.button
      className={`skill-btn ${ready ? 'ready' : ''} ${used ? 'used' : ''}`}
      whileTap={ready ? { scale: 0.93 } : {}}
      disabled={!ready}
      onClick={() => ready && onActivate(skill)}
    >
      <div className="skill-energy-fill" style={{ width: `${pct}%` }} />
      <div className="skill-btn-inner">
        <span className="skill-icon">{skill.icon}</span>
        <span className="skill-text">
          <span className="skill-name">{used ? '本題已用' : skill.name}</span>
          <span className="skill-energy-num">⚡ {Math.round(energy)}/{ENERGY_MAX}</span>
        </span>
      </div>
    </motion.button>
  )
}
