import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import {
  ensureSaveCode, pushSave, pullSaveByCode, codeToUrl,
  pinStatus, setPin as setCloudPin,
  getProfiles, addProfile, renameProfile, removeProfile, seedProfiles,
  switchProfile, startFresh,
} from '../utils/cloudSync'
import './SaveModal.css'

const EMOJIS = ['🌟', '🐶', '🦦', '🐰', '🐱', '🦉', '🐢', '🦕', '🐼', '🦄']

export default function SaveModal({ onClose }) {
  // ⚠️ 必須排在 profiles 的 useState 之前：seedProfiles 要靠存檔碼才收得到本機存檔，
  //    而全新裝置這時還沒有碼（否則同學的新平板會看到空的玩家清單）。
  const savedCode = ensureSaveCode()

  const [tab, setTab] = useState('device')   // device（換裝置）| players（切換玩家）| pin（密碼）
  const [status, setStatus] = useState('idle')
  const [msg, setMsg] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [qr, setQr] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [hasPin, setHasPin] = useState(null)
  // seedProfiles 會把這台裝置原有的存檔收進清單（可重複呼叫，已在清單就不動）
  const [profiles, setProfiles] = useState(() => { seedProfiles(); return getProfiles() })
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('🙂')
  const [editing, setEditing] = useState(null)   // 正在改名的存檔碼
  const [editName, setEditName] = useState('')
  const [askPinFor, setAskPinFor] = useState(null) // 切換到有密碼的玩家時要輸入的對象
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [localText, setLocalText] = useState('')

  const myCode = savedCode

  useEffect(() => {
    QRCode.toDataURL(codeToUrl(savedCode), { width: 320, margin: 2 })
      .then(setQr).catch(() => {})
    pinStatus(savedCode).then(st => setHasPin(!!st?.has_pin)).catch(() => setHasPin(null))
  }, [savedCode])

  const loading = status === 'uploading' || status === 'downloading'
  const refresh = () => setProfiles(getProfiles())

  const handleUpload = async () => {
    setStatus('uploading'); setMsg('')
    try { await pushSave(); setStatus('done'); setMsg('✅ 已同步到雲端！') }
    catch (e) { setStatus('error'); setMsg(`❌ 上傳失敗：${e.message}`) }
  }

  const explain = async (err, code) => {
    if (err === 'NO_DATA') return '❌ 找不到這組存檔碼'
    if (err === 'LOCKED') return '⏳ 密碼錯太多次，請等 15 分鐘再試'
    const st = await pinStatus(code).catch(() => null)
    if (st?.has_pin) return `🔐 這個存檔有密碼${st.tries_left < 5 ? `，還可以試 ${st.tries_left} 次` : ''}`
    return '❌ 載入失敗'
  }

  // 手動輸入存檔碼還原（沒有 QR 可掃時的備案）
  const handleDownload = async () => {
    const id = codeInput.trim() || savedCode
    if (!id) { setMsg('❌ 請輸入存檔碼'); return }
    setStatus('downloading'); setMsg('')
    try {
      await pullSaveByCode(id, pinInput)
      setStatus('done'); setMsg('✅ 載入成功！即將重新整理…')
      setTimeout(() => location.reload(), 1200)
    } catch (e) {
      setStatus('error'); setMsg(await explain(e.message, id))
    }
  }

  const handleAdd = async () => {
    if (!newName.trim()) { setMsg('❌ 請先輸入名字'); return }
    const code = addProfile(newName, newEmoji)
    refresh(); setNewName('')
    setMsg('✅ 已建立！正在切換到新玩家…')
    await startFresh(code)
  }

  const handleSwitch = async (p) => {
    setMsg('')
    try {
      const st = await pinStatus(p.code)
      if (st?.has_pin) { setAskPinFor(p); return } // 有密碼 → 問完再切
      setStatus('downloading'); setMsg(`⏳ 切換到 ${p.name}…`)
      await switchProfile(p.code, null)
    } catch {
      setStatus('error'); setMsg('❌ 切換失敗，請檢查網路')
    }
  }

  const confirmSwitch = async () => {
    setStatus('downloading'); setMsg('')
    try { await switchProfile(askPinFor.code, pinInput) }
    catch (e) {
      setStatus('error'); setMsg(await explain(e.message, askPinFor.code)); setPinInput('')
    }
  }

  // ── 本機備援（免網路、免 token）：原有功能，緊急救援用，不要拿掉 ──
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

  const handleSetPin = async () => {
    if (newPin && newPin.length !== 4) { setMsg('❌ 密碼請設 4 位數字'); return }
    setMsg('')
    try {
      const r = await setCloudPin(savedCode, newPin, oldPin)
      if (r?.ok) {
        setHasPin(!!newPin); setOldPin(''); setNewPin('')
        setMsg(newPin ? '✅ 密碼設定完成！換裝置載入時要用它' : '✅ 已取消密碼保護')
      } else if (r?.error === 'LOCKED') setMsg('⏳ 密碼錯太多次，請等 15 分鐘再試')
      else if (r?.error === 'NO_DATA') setMsg('❌ 請先按「立即同步到雲端」存一次再設密碼')
      else setMsg('❌ 舊密碼不對')
    } catch { setMsg('❌ 連線失敗，請檢查網路') }
  }

  return (
    <motion.div
      className="save-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="save-modal"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="save-title">☁️ 雲端存檔</div>

        <div className="save-tabs">
          {[['device', '📱 換裝置'], ['players', '👥 切換玩家'], ['pin', '🔐 密碼'], ['backup', '🔧 備援']].map(([k, label]) => (
            <button key={k} className={`save-tab ${tab === k ? 'is-on' : ''}`} onClick={() => { setTab(k); setMsg('') }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── 換裝置：掃 QR 就好，不用打 32 個字 ── */}
        {tab === 'device' && (
          <>
            <div className="save-howto">
              <div className="save-howto-row">
                <span className="save-howto-num">1</span>
                <div><b>自動存檔</b><br />金幣或道具一變動就會自動存到雲端，平常不用手動按。</div>
              </div>
              <div className="save-howto-row">
                <span className="save-howto-num">2</span>
                <div><b>新平板掃這個 QR</b><br />用新平板的相機掃下面的 QR code，就會直接帶著進度打開遊戲，一個字都不用打。</div>
              </div>
            </div>

            {qr && <div className="save-qr"><img src={qr} alt="存檔 QR code" /></div>}

            <button className="btn-secondary" onClick={() => setShowCode(v => !v)}>
              {showCode ? '🙈 隱藏存檔碼' : '🔢 沒辦法掃？顯示存檔碼'}
            </button>

            {showCode && (
              <div className="save-code-box">
                <div className="save-code-label">我的存檔碼（請保管好）</div>
                <div className="save-code" style={{ fontSize: 14, wordBreak: 'break-all', letterSpacing: 0 }}>{savedCode}</div>
                <div className="save-code-hint">在新裝置輸入此碼也可還原進度</div>
              </div>
            )}

            <motion.button className="btn-primary" whileTap={{ scale: 0.94 }} onClick={handleUpload} disabled={loading}>
              {status === 'uploading' ? '⏳ 上傳中…' : '⬆️ 立即同步到雲端'}
            </motion.button>

            <div className="save-divider">── 用存檔碼還原 ──</div>
            <input
              className="save-input" placeholder="貼上存檔碼"
              value={codeInput} onChange={e => setCodeInput(e.target.value)} maxLength={40}
            />
            <input
              className="save-input" type="password" inputMode="numeric" placeholder="密碼（沒設就留空）"
              value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))} maxLength={4}
            />
            <motion.button className="btn-secondary" whileTap={{ scale: 0.94 }} onClick={handleDownload} disabled={loading}>
              {status === 'downloading' ? '⏳ 載入中…' : '⬇️ 載入'}
            </motion.button>
          </>
        )}

        {/* ── 切換玩家：同一台平板給同學玩 ── */}
        {tab === 'players' && (
          <>
            {askPinFor ? (
              <>
                <div className="save-howto">
                  <div className="save-howto-row">
                    <span className="save-howto-num">{askPinFor.emoji}</span>
                    <div><b>{askPinFor.name}</b> 的存檔有密碼<br />請輸入 4 位數密碼才能切換。</div>
                  </div>
                </div>
                <input
                  className="save-input" type="password" inputMode="numeric" placeholder="● ● ● ●"
                  style={{ textAlign: 'center', fontSize: 28, letterSpacing: 8 }}
                  value={pinInput} maxLength={4}
                  onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && confirmSwitch()}
                />
                {msg && <div className="save-msg">{msg}</div>}
                <motion.button className="btn-primary" whileTap={{ scale: 0.94 }} onClick={confirmSwitch} disabled={loading}>
                  ✅ 切換
                </motion.button>
                <button className="btn-secondary" onClick={() => { setAskPinFor(null); setPinInput(''); setMsg('') }}>
                  取消
                </button>
              </>
            ) : (
              <>
                <div className="save-hint-line">點名字就切換到那個人的存檔。切換前會先把現在的進度存好，不會弄丟。</div>

                <div className="save-players">
                  {profiles.map(p => (
                    <div key={p.code} className={`save-player ${p.code === myCode ? 'is-me' : ''}`}>
                      {editing === p.code ? (
                        <>
                          <input
                            className="save-input" style={{ flex: 1 }} value={editName} maxLength={8} autoFocus
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key !== 'Enter') return
                              renameProfile(p.code, editName); setEditing(null); refresh()
                            }}
                          />
                          <button
                            className="save-player-del" style={{ borderColor: '#D6F5F1', background: '#E8F9F7', color: '#2A9D94' }}
                            onClick={() => { renameProfile(p.code, editName); setEditing(null); refresh() }}
                          >✓</button>
                        </>
                      ) : (
                        <>
                          <button className="save-player-main" onClick={() => p.code !== myCode && handleSwitch(p)} disabled={loading}>
                            <span className="save-player-emoji">{p.emoji}</span>
                            <span className="save-player-name">{p.name}</span>
                            {p.code === myCode && <span className="save-player-tag">現在</span>}
                          </button>
                          <button
                            className="save-player-del" style={{ borderColor: '#EEE', background: '#FAFAFA', color: '#999' }}
                            title="改名字" onClick={() => { setEditing(p.code); setEditName(p.name) }}
                          >✏️</button>
                          {p.code !== myCode && (
                            <button
                              className="save-player-del"
                              title="從這台平板移除（雲端存檔還在，存檔碼可救回）"
                              onClick={() => { removeProfile(p.code); refresh() }}
                            >✕</button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="save-divider">── 加新玩家 ──</div>
                <div className="save-emoji-row">
                  {EMOJIS.map(e => (
                    <button key={e} className={`save-emoji ${newEmoji === e ? 'is-on' : ''}`} onClick={() => setNewEmoji(e)}>{e}</button>
                  ))}
                </div>
                <input
                  className="save-input" placeholder="同學的綽號（不要用真名喔）"
                  value={newName} onChange={e => setNewName(e.target.value)} maxLength={8}
                />
                <motion.button className="btn-primary" whileTap={{ scale: 0.94 }} onClick={handleAdd} disabled={loading}>
                  ➕ 建立並開始新遊戲
                </motion.button>
                {msg && <div className="save-msg">{msg}</div>}
              </>
            )}
          </>
        )}

        {/* ── 密碼：保護自己的存檔不被別人載走 ── */}
        {tab === 'pin' && (
          <>
            <div className="save-howto">
              <div className="save-howto-row">
                <span className="save-howto-num">🔐</span>
                <div>
                  <b>{hasPin === null ? '密碼保護' : hasPin ? '已設定密碼' : '還沒設密碼'}</b><br />
                  設了密碼之後，別人就算拿到你的存檔碼或 QR，也沒辦法把你的進度載走亂花金幣。
                </div>
              </div>
            </div>

            {hasPin && (
              <input
                className="save-input" type="password" inputMode="numeric" placeholder="舊密碼"
                value={oldPin} onChange={e => setOldPin(e.target.value.replace(/\D/g, ''))} maxLength={4}
              />
            )}
            <input
              className="save-input" type="password" inputMode="numeric"
              placeholder={hasPin ? '新密碼（留空＝取消密碼）' : '設 4 位數密碼'}
              value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))} maxLength={4}
            />
            {msg && <div className="save-msg">{msg}</div>}
            <motion.button className="btn-primary" whileTap={{ scale: 0.94 }} onClick={handleSetPin}>
              {hasPin ? '🔄 更新密碼' : '🔐 設定密碼'}
            </motion.button>
            <div className="save-hint-line">
              密碼只有 4 位數，所以連續猜錯 5 次就會鎖 15 分鐘。忘記密碼的話爸爸可以幫你查。
            </div>
          </>
        )}

        {/* ── 本機備援：沒網路也能用的救命後路 ── */}
        {tab === 'backup' && (
          <>
            <div className="save-hint-line">雲端連不上時的後路，不需要網路也能用。</div>
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
          </>
        )}

        {(tab === 'device' || tab === 'backup') && msg &&
          <div className={`save-msg ${status === 'error' ? 'err' : ''}`}>{msg}</div>}

        <button className="save-close" onClick={onClose}>✕ 關閉</button>
      </motion.div>
    </motion.div>
  )
}
