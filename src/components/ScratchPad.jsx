import { useEffect, useRef, useState } from 'react'
import './ScratchPad.css'

export default function ScratchPad({ height = 140, color = '#37474F' }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      // 保留現有繪圖內容
      const tmp = document.createElement('canvas')
      tmp.width = canvas.width
      tmp.height = canvas.height
      const tmpCtx = tmp.getContext('2d')
      tmpCtx.drawImage(canvas, 0, 0)

      canvas.width = Math.max(1, rect.width * ratio)
      canvas.height = Math.max(1, rect.height * ratio)
      const ctx = canvas.getContext('2d')
      ctx.scale(ratio, ratio)
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // 還原內容
      ctx.drawImage(tmp, 0, 0, rect.width, rect.height)
    }

    setupCanvas()
    const ro = new ResizeObserver(setupCanvas)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [color])

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e) => {
    e.preventDefault()
    try { canvasRef.current.setPointerCapture(e.pointerId) } catch (_) {}
    drawingRef.current = true
    const p = getPoint(e)
    lastPointRef.current = p
    // 點一下就畫個點
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    setHasInk(true)
  }

  const draw = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const p = getPoint(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    lastPointRef.current = p
  }

  const endDraw = (e) => {
    if (e && e.pointerId !== undefined) {
      try { canvasRef.current?.releasePointerCapture(e.pointerId) } catch (_) {}
    }
    drawingRef.current = false
    lastPointRef.current = null
  }

  const clearAll = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
  }

  return (
    <div className="scratch-wrap">
      <div className="scratch-header">
        <span className="scratch-label">📝 草稿區</span>
        <button
          className="scratch-clear-btn"
          onPointerDown={(e) => { e.stopPropagation(); clearAll() }}
          disabled={!hasInk}
        >
          🧽 清除
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        style={{ height: `${height}px`, touchAction: 'none' }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
        onPointerLeave={endDraw}
      />
    </div>
  )
}
