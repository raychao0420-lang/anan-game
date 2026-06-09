import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadSave, downloadSave, getSaveCode } from '../utils/cloudSave'
import './SaveModal.css'

export default function SaveModal({ onClose }) {
  const [status, setStatus] = useState('idle') // idle | uploading | downloading | done | error
  const [msg, setMsg] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const savedCode = getSaveCode()

  const handleUpload = async () => {
    setStatus('uploading')
    setMsg('')
    try {
      await uploadSave()
      setStatus('done')
      setMsg('✅ 存檔成功！')
    } catch (e) {
      setStatus('error')
      setMsg(e.message === 'NO_TOKEN' ? '❌ 尚未設定 VITE_GIST_TOKEN' : `❌ 上傳失敗：${e.message}`)
    }
  }

  const handleDownload = async () => {
    const id = codeInput.trim() || savedCode
    if (!id) { setMsg('❌ 請輸入存檔碼'); return }
    setStatus('downloading')
    setMsg('')
    try {
      await downloadSave(id)
      setStatus('done')
      setMsg('✅ 載入成功！即將重新整理…')
      setTimeout(() => location.reload(), 1200)
    } catch (e) {
      setStatus('error')
      setMsg(e.message === 'NO_TOKEN' ? '❌ 尚未設定 VITE_GIST_TOKEN' : `❌ 載入失敗：找不到存檔碼`)
    }
  }

  const loading = status === 'uploading' || status === 'downloading'

  return (
    <motion.div
      className="save-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="save-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="save-title">☁️ 雲端存檔</div>

        <div className="save-howto">
          <div className="save-howto-row">
            <span className="save-howto-num">1</span>
            <div>
              <b>第一次存檔</b><br />
              按「⬆️ 立即同步到雲端」，系統會產生一組<b>存檔碼</b>。
            </div>
          </div>
          <div className="save-howto-row">
            <span className="save-howto-num">2</span>
            <div>
              <b>記下存檔碼</b><br />
              截圖或抄下那 8 個字母數字，換設備時會用到。
            </div>
          </div>
          <div className="save-howto-row">
            <span className="save-howto-num">3</span>
            <div>
              <b>換設備讀取</b><br />
              在下方輸入存檔碼，按「載入」就能還原所有進度！
            </div>
          </div>
        </div>

        {savedCode && (
          <div className="save-code-box">
            <div className="save-code-label">我的存檔碼</div>
            <div className="save-code">{savedCode.slice(-8).toUpperCase()}</div>
            <div className="save-code-hint">換設備時輸入此碼可還原進度</div>
          </div>
        )}

        <motion.button
          className="btn-primary"
          whileTap={{ scale: 0.94 }}
          onClick={handleUpload}
          disabled={loading}
        >
          {status === 'uploading' ? '⏳ 上傳中…' : '⬆️ 立即同步到雲端'}
        </motion.button>

        <div className="save-divider">── 換設備還原 ──</div>

        <div className="save-input-row">
          <input
            className="save-input"
            placeholder="輸入存檔碼（8碼）"
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            maxLength={40}
          />
          <motion.button
            className="btn-secondary"
            whileTap={{ scale: 0.94 }}
            onClick={handleDownload}
            disabled={loading}
          >
            {status === 'downloading' ? '⏳…' : '載入'}
          </motion.button>
        </div>

        {msg && <div className={`save-msg ${status === 'error' ? 'err' : ''}`}>{msg}</div>}

        <button className="save-close" onClick={onClose}>✕ 關閉</button>
      </motion.div>
    </motion.div>
  )
}
