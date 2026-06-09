import { motion } from 'framer-motion'
import './NumberPad.css'

export default function NumberPad({ value, onChange, onConfirm }) {
  const handleKey = (key) => {
    if (key === '←') {
      onChange(value.slice(0, -1))
    } else if (key === '✓') {
      if (value) onConfirm()
    } else {
      if (value.length < 4) onChange(value + key)
    }
  }

  const keys = ['7','8','9','4','5','6','1','2','3','←','0','✓']

  return (
    <div className="numpad-wrap">
      <div className="numpad-display">
        {value || <span className="numpad-placeholder">?</span>}
      </div>
      <div className="numpad-grid">
        {keys.map((k) => (
          <motion.button
            key={k}
            className={`numpad-btn ${k === '✓' ? 'confirm' : ''} ${k === '←' ? 'delete' : ''}`}
            onPointerDown={() => handleKey(k)}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.08 }}
          >
            {k}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
