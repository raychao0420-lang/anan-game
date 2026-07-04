import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ensureSaveCode, pushSave, pullSaveByCode } from '../utils/cloudSync'
import './SaveModal.css'

export default function SaveModal({ onClose }) {
  const [status, setStatus] = useState('idle') // idle | uploading | downloading | done | error
  const [msg, setMsg] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [localText, setLocalText] = useState('')
  const savedCode = ensureSaveCode()

  const handleExport = () => {
    setLocalText(localStorage.getItem('anan-game-v2') || '')
    setMsg('已匯出目前本機存檔，可全選複製保存')
  }

  const handleRestoreAnan = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}anan_restore.json`)
      const t = (await res.text()).trim()
      JSON.parse(t)
      localStorage.setItem('anan-game-v2', t)
      setMsg('✅ 安安存檔已還原！即將重新整理…')
      setTimeout(() => location.reload(), 1200)
    } catch { setMsg('❌ 還原失敗，請重新整理再試一次') }
  }

  const handleRestore = () => {
    const t = localText.trim()
    if (!t) { setMsg('❌ 請先貼上存檔內容'); return }
    try {
      JSON.parse(t)
      localStorage.setItem('anan-game-v2', t)
      setMsg('✅ 還原成功！即將重新整理…')
      setTimeout(() => location.reload(), 1200)
    } catch { setMsg('❌ 存檔內容格式錯誤') }
  }

  const handleUpload = async () => {
    setStatus('uploading')
    setMsg('')
    try {
      await pushSave()
      setStatus('done')
      setMsg('✅ 已同步到雲端！')
    } catch (e) {
      setStatus('error')
      setMsg(`❌ 上傳失敗：${e.message}`)
    }
  }

  const handleDownload = async () => {
    const id = codeInput.trim() || savedCode
    if (!id) { setMsg('❌ 請輸入存檔碼'); return }
    setStatus('downloading')
    setMsg('')
    try {
      await pullSaveByCode(id)
      setStatus('done')
      setMsg('✅ 載入成功！即將重新整理…')
      setTimeout(() => location.reload(), 1200)
    } catch {
      setStatus('error')
      setMsg('❌ 載入失敗：找不到這組存檔碼')
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
              <b>自動存檔</b><br />
              金幣或道具一變動就會自動存到雲端，平常不用手動按。
            </div>
          </div>
          <div className="save-howto-row">
            <span className="save-howto-num">2</span>
            <div>
              <b>抄下存檔碼</b><br />
              把下面這組存檔碼截圖或抄下來保管，換設備／重灌時靠它救回。
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
            <div className="save-code-label">我的存檔碼（請保管好）</div>
            <div className="save-code" style={{ fontSize: 14, wordBreak: 'break-all', letterSpacing: 0 }}>{savedCode}</div>
            <div className="save-code-hint">換設備／重灌時輸入此碼可還原進度</div>
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
            placeholder="貼上存檔碼後按「載入」"
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

        <div className="save-divider">── 本機備援（免 token）──</div>
        <motion.button className="btn-primary" whileTap={{ scale: 0.94 }} onClick={handleRestoreAnan}>
          🔧 一鍵還原安安存檔
        </motion.button>
        <textarea
          className="save-input"
          style={{ width: '100%', minHeight: 70, resize: 'vertical' }}
          placeholder="貼上存檔內容後按「還原」"
          value={localText}
          onChange={e => setLocalText(e.target.value)}
        />
        <div className="save-input-row">
          <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }} onClick={handleExport}>
            匯出本機存檔
          </motion.button>
          <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }} onClick={handleRestore}>
            貼上還原
          </motion.button>
        </div>

        <button className="save-close" onClick={onClose}>✕ 關閉</button>
      </motion.div>
    </motion.div>
  )
}
