import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTodayTasks } from '../data/dailyTasks'
import './DailyScreen.css'

export default function DailyScreen({ onNavigate }) {
  const { coins, dailyDate, dailyProgress, dailyTasksDone, completeDailyTask } = useGameStore()

  const today = new Date().toISOString().slice(0, 10)
  const tasks = getTodayTasks(today)

  // Auto-complete tasks when progress meets target
  useEffect(() => {
    tasks.forEach((task) => {
      if (dailyTasksDone.includes(task.id)) return
      const prog = dailyProgress[task.type] || 0
      if (prog >= task.target) {
        completeDailyTask(task.id, task.type, task.reward)
      }
    })
  }, [dailyProgress, dailyTasksDone]) // eslint-disable-line react-hooks/exhaustive-deps

  const allDone = dailyTasksDone.length >= 3
  const doneTodayCount = tasks.filter(t => dailyTasksDone.includes(t.id)).length

  return (
    <div className="daily-screen">
      <div className="daily-header">
        <motion.button className="btn-back" whileTap={{ scale: 0.9 }} onClick={() => onNavigate('home')}>
          ← 返回
        </motion.button>
        <span className="daily-title">📋 每日任務</span>
        <span className="daily-coins">💰 {coins}</span>
      </div>

      <div className="daily-date">{today} 的任務</div>

      {allDone && (
        <motion.div
          className="daily-all-done"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          🎉 今日全部完成！獲得額外 50 金幣！
        </motion.div>
      )}

      <div className="daily-tasks">
        {tasks.map((task, i) => {
          const prog = dailyProgress[task.type] || 0
          const done = dailyTasksDone.includes(task.id)
          const pct = Math.min(100, (prog / task.target) * 100)

          return (
            <motion.div
              key={task.id}
              className={`daily-task ${done ? 'done' : ''}`}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="daily-task-left">
                <span className="daily-task-icon">{task.icon}</span>
                <div className="daily-task-info">
                  <div className="daily-task-label">{task.label}</div>
                  <div className="daily-task-progress-row">
                    <div className="daily-progress-bar">
                      <motion.div
                        className="daily-progress-fill"
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="daily-progress-text">
                      {done ? '✓' : `${Math.min(prog, task.target)} / ${task.target}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`daily-reward ${done ? 'claimed' : ''}`}>
                {done ? '✅' : `+${task.reward}💰`}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="daily-tip">
        <div className="daily-tip-title">💡 進度提示</div>
        <div className="daily-tip-row">✅ 正確答題 → 答對題目</div>
        <div className="daily-tip-row">💰 金幣任務 → 關卡賺幣</div>
        <div className="daily-tip-row">🎮 關卡任務 → 完成關卡</div>
        <div className="daily-tip-row">⭐ 三星通關 → 答對9題以上</div>
        <div className="daily-tip-row">🔥 連答任務 → 連續答對5題</div>
      </div>

      <div className="daily-bonus-hint">
        全部完成可額外獲得 <strong>50 💰</strong>！（已完成 {doneTodayCount}/3）
      </div>
    </div>
  )
}
