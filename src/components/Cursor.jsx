import React, { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    const moveCursor = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const lerp = (a, b, n) => (1 - n) * a + n * b

    let animId
    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.1)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.1)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    const onHover = () => ringRef.current?.classList.add('hovered')
    const onLeave = () => ringRef.current?.classList.remove('hovered')
    const onDown = () => ringRef.current?.classList.add('clicked')
    const onUp = () => ringRef.current?.classList.remove('clicked')

    document.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onHover)
      el.addEventListener('mouseleave', onLeave)
    })
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
