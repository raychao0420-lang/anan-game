// 開機時如果有「待載入的存檔碼」（掃 QR 進來，或本機被清空要從雲端救回），
// 就在這裡問 PIN。載入成功會重新整理，整個遊戲以該存檔重新開始。
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { pendingCode, clearPending, pinStatus, pullSaveByCode, getProfiles } from '../utils/cloudSync'
import './SaveModal.css'

export default function LoginGate() {
  const [code] = useState(pendingCode())
  const [phase, setPhase] = useState('checking') // checking | pin | notfound | loading | error
  const [pin, setPin] = useState('')
  const [msg, setMsg] = useState('')

  // 這組碼在本機玩家清單裡的暱稱（有的話顯示，比一串亂碼親切）
  const who = getProfiles().find(p => p.code === code)

  useEffect(() => {
    if (!code) return
    let alive = true
    ;(async () => {
      try {
        const st = await pinStatus(code)
        if (!alive) return
        if (!st?.exists) { setPhase('notfound'); return }
        if (st.has_pin) {
          setPhase('pin')
          if (st.locked) setMsg('⏳ 密碼錯太多次，請等 15 分鐘再試')
          return
        }
        setPhase('loading')            // 沒設密碼 → 直接載入
        await pullSaveByCode(code)
        clearPending()
        location.reload()
      } catch {
        if (alive) { setPhase('error'); setMsg('❌ 連線失敗，請檢查網路後重新整理') }
      }
    })()
    return () => { alive = false }
  }, [code])

  if (!code) return null

  const submit = async () => {
    if (pin.length < 4) { setMsg('請輸入 4 位數密碼'); return }
    setPhase('loading'); setMsg('')
    try {
      await pullSaveByCode(code, pin)
      clearPending()
      location.reload()
    } catch (e) {
      setPhase('pin')
      setPin('')
      if (e.message === 'LOCKED') { setMsg('⏳ 密碼錯太多次，請等 15 分鐘再試'); return }
      if (e.message === 'NO_DATA') { setPhase('notfound'); return }
      const st = await pinStatus(code).catch(() => null)
      setMsg(st?.locked
        ? '⏳ 密碼錯太多次，請等 15 分鐘再試'
        : `❌ 密碼不對${st ? `，還可以試 ${st.tries_left} 次` : ''}`)
    }
  }

  const dismiss = () => { clearPending(); location.reload() }

  return (
    <div className="save-overlay" style={{ zIndex: 9999 }}>
      <motion.div
        className="save-modal"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="save-title">🔐 載入存檔</div>

        {phase === 'checking' && <div className="save-msg">⏳ 檢查存檔中…</div>}
        {phase === 'loading' && <div className="save-msg">⏳ 載入中，馬上就好…</div>}

        {phase === 'notfound' && (
          <>
            <div className="save-msg">❌ 找不到這組存檔碼，可能是抄錯或還沒存過雲端。</div>
            <button className="btn-primary" onClick={dismiss}>知道了</button>
          </>
        )}

        {phase === 'error' && (
          <>
            <div className="save-msg">{msg}</div>
            <button className="btn-primary" onClick={dismiss}>知道了</button>
          </>
        )}

        {phase === 'pin' && (
          <>
            <div className="save-howto">
              <div className="save-howto-row">
                <span className="save-howto-num">{who?.emoji || '🔒'}</span>
                <div>
                  {who ? <><b>{who.name}</b> 的存檔<br /></> : <><b>這個存檔有設密碼</b><br /></>}
                  請輸入 4 位數密碼才能載入進度。
                </div>
              </div>
            </div>
            <input
              className="save-input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              placeholder="● ● ● ●"
              style={{ textAlign: 'center', fontSize: 28, letterSpacing: 8 }}
              value={pin}
              maxLength={4}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            {msg && <div className="save-msg">{msg}</div>}
            <motion.button className="btn-primary" whileTap={{ scale: 0.94 }} onClick={submit}>
              ✅ 載入我的進度
            </motion.button>
            <button className="btn-secondary" onClick={dismiss}>取消，先玩這台的存檔</button>
          </>
        )}
      </motion.div>
    </div>
  )
}
