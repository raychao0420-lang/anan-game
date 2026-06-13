import { motion } from 'framer-motion'
import './NumberPad.css'

export default function NumberPad({ value, onChange, onConfirm, onInput }) {
  const handleKey = (key) => {
    if (onInput) {
      if (key === '←') { onInput('del'); return }
      onInput(key)
      return
    }
    if (key === '←') {
      onChange(value.slice(0, -1))
    } else if (key === '.') {
      if (!value.includes('.') && value.length < 6) onChange((value || '0') + '.')
    } else {
      if (value.length < 6) onChange(value + key)
    }
  }

  const handleConfirm = () => {
    if (onInput) { onInput('ok'); return }
    if (value) onConfirm()
  }

  const keys = ['7','8','9','4','5','6','1','2','3','.','0','←']

  return (
    <div className="numpad-wrap">
      <div className="numpad-display">
        {value || <span className="numpad-placeholder">?</span>}
      </div>
      <div className="numpad-grid">
        {keys.map((k) => (
          <motion.button
            key={k}
            className={`numpad-btn ${k === '←' ? 'delete' : ''} ${k === '.' ? 'dot' : ''}`}
            onPointerDown={() => handleKey(k)}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.08 }}
          >
            {k}
          </motion.button>
        ))}
      </div>
      <motion.button
        className="numpad-btn numpad-confirm"
        onPointerDown={handleConfirm}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.08 }}
        style={{ opacity: value ? 1 : 0.4 }}
      >
        ✓
      </motion.button>
    </div>
  )
}
