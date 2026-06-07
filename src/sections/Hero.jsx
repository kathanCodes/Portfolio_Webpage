import React, { useEffect, useRef } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Link } from 'react-router-dom'
import './Hero.css'

import profilePhoto from '../assets/images/profile.jpg'
const PROFILE_PHOTO = profilePhoto

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.0 + 1.0, 
        opacity: Math.random() * 0.4 + 0.6,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const isLightMode = 
        document.documentElement.getAttribute('data-theme') === 'light' || 
        document.body.getAttribute('data-theme') === 'light' ||
        (document.querySelector('[data-theme]')?.getAttribute('data-theme') === 'light');

      const particleColorRGB = isLightMode ? '255, 215, 0' : '0, 255, 136';

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleColorRGB}, ${p.opacity})`
        ctx.fill()
      })

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${particleColorRGB}, ${0.4 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            <span>Available for Internships & Projects</span>
          </div>

          <h1 className="hero-name">
            <span className="hero-name-line">Kathan</span>
            <span className="hero-name-line hero-name-accent">Zula</span>
          </h1>

          <div className="hero-role">
            <span className="hero-role-prefix">&gt;</span>
            <TypeAnimation
              sequence={[
                'AI & Data Science Engineer',
                2000,
                'RAG Systems Builder',
                2000,
                'Deep Learning Researcher',
                2000,
                'Full Stack Developer',
                2000,
                'IIT Jodhpur Student',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="hero-role-text"
            />
            <span className="hero-cursor-blink">_</span>
          </div>

          <p className="hero-desc">
            Building intelligent systems at the intersection of{' '}
            <span className="highlight">Generative AI</span>,{' '}
            <span className="highlight">RAG pipelines</span>, and{' '}
            <span className="highlight">scalable APIs</span>. B.Tech @ IIT Jodhpur.
          </p>

          <div className="hero-cta">
            {/* Replaced standard action with strict React Router Link and updated text */}
            <Link to="/projects" className="btn-primary">
              All Projects
            </Link>
            <a href="#contact" className="btn-outline" onClick={e => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Get in Touch
            </a>
          </div>

          <div className="hero-socials">
            <a href="https://linkedin.com/in/kathan-zula-858a97254" target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a href="https://github.com/kathanCodes" target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              GitHub
            </a>
            <a href="mailto:zulakathan06@gmail.com" target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-wrap animate-float">
            {PROFILE_PHOTO ? (
              <img src={PROFILE_PHOTO} alt="Kathan Zula" className="hero-photo" />
            ) : (
              <div className="hero-photo-placeholder">
                <div className="hero-photo-initials">KZ</div>
                <div className="hero-photo-hint">Add your photo to<br/>src/assets/images/profile.jpg</div>
              </div>
            )}
            <div className="hero-photo-ring" />
            <div className="hero-photo-ring hero-photo-ring-2" />

            <div className="hero-badge hero-badge-1">
              <span className="hero-badge-icon">🎓</span>
              <div>
                <div className="hero-badge-title">IIT Jodhpur</div>
                <div className="hero-badge-sub">AI & DS | CGPA 8.19</div>
              </div>
            </div>
            <div className="hero-badge hero-badge-2">
              <span className="hero-badge-icon">⚡</span>
              <div>
                <div className="hero-badge-title">99.09 percentile</div>
                <div className="hero-badge-sub">JEE Mains 2022</div>
              </div>
            </div>
            <div className="hero-badge hero-badge-3">
              <span className="hero-badge-icon">🏆</span>
              <div>
                <div className="hero-badge-title">LeetCode 1563</div>
                <div className="hero-badge-sub">Peak Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}