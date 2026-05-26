import React, { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + Math.floor(Math.random() * 8) + 3
      })
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loader">
      <div className="loader-content">
        <div className="loader-logo">
          <span className="loader-k">K</span>
          <div className="loader-ring" />
          <div className="loader-ring loader-ring-2" />
        </div>
        <div className="loader-name">KATHAN ZULA</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" style={{ width: `${Math.min(count, 100)}%` }} />
        </div>
        <div className="loader-count">{Math.min(count, 100)}%</div>
      </div>
    </div>
  )
}
