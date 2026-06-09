import { useState } from 'react'
import { motion } from 'framer-motion'
import { sfx, setMuted, isMuted } from '../utils/sound'
import './MuteButton.css'

export default function MuteButton({ className = '' }) {
  const [muted, setMutedState] = useState(isMuted)

  const toggle = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) sfx.click()
  }

  return (
    <motion.button
      className={`mute-btn ${className}`}
      whileTap={{ scale: 0.85 }}
      onClick={toggle}
      title={muted ? '開啟音效' : '靜音'}
    >
      {muted ? '🔇' : '🔊'}
    </motion.button>
  )
}
