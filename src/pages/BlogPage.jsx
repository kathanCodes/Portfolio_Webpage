import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import './BlogPage.css'

const POSTS = [
  {
    id: 1,
    title: 'Building Production-Grade RAG Pipelines',
    excerpt: 'A deep dive into architecting retrieval-augmented generation systems that actually work in production — covering chunking strategies, vector stores, and evaluation.',
    date: 'May 2026',
    readTime: '8 min read',
    tags: ['RAG', 'LangChain', 'Production AI'],
    icon: '🧠',
    color: '#00ff88',
  },
  {
    id: 2,
    title: 'Bias in Deep Learning: Lessons from ResNet',
    excerpt: 'What I learned building a bias-resilient image classifier — why knowledge distillation works, and how KL divergence loss can help you train fairer models.',
    date: 'Apr 2026',
    readTime: '6 min read',
    tags: ['Deep Learning', 'Bias', 'PyTorch'],
    icon: '👁️',
    color: '#8b5cf6',
  },
  {
    id: 3,
    title: 'From IIT to Internships: My AI Job Search',
    excerpt: "An honest look at the AI internship hunt as a third-year student — what worked, what didn't, and how to stand out with a portfolio that actually demonstrates ability.",
    date: 'Mar 2026',
    readTime: '5 min read',
    tags: ['Career', 'AI', 'Students'],
    icon: '🎓',
    color: '#00d4ff',
  },
]

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.0 + 1.0,
      opacity: Math.random() * 0.4 + 0.6,
    }))

    const isLight = () =>
      document.documentElement.getAttribute('data-theme') === 'light' ||
      document.body.getAttribute('data-theme') === 'light' ||
      document.querySelector('[data-theme]')?.getAttribute('data-theme') === 'light'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const rgb = isLight() ? '255, 215, 0' : '0, 255, 136'

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, ${p.opacity})`
        ctx.fill()
      })

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${rgb}, ${0.4 * (1 - d / 120)})`
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

  return <canvas ref={canvasRef} className="blog-canvas" />
}

function PostCard({ post, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <article
      ref={ref}
      className={`blog-card glass-card ${inView ? 'visible' : ''}`}
      style={{ '--post-color': post.color, transitionDelay: `${index * 0.1}s` }}
    >
      <div className="blog-card-top">
        <span className="blog-icon">{post.icon}</span>
        <div className="blog-meta">
          <span className="blog-date">{post.date}</span>
          <span className="blog-dot">·</span>
          <span className="blog-read">{post.readTime}</span>
        </div>
      </div>

      <h2 className="blog-title">{post.title}</h2>
      <p className="blog-excerpt">{post.excerpt}</p>

      <div className="blog-footer">
        <div className="blog-tags">
          {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <span className="blog-coming">Coming soon →</span>
      </div>

      <div className="blog-glow" />
    </article>
  )
}

export default function BlogPage() {
  return (
    <div className="blog-page">
      <ParticleCanvas />
      <div className="blog-glow-bg blog-glow-bg-1" />
      <div className="blog-glow-bg blog-glow-bg-2" />

      <div className="container blog-container">
        <header className="blog-header">
          <div className="section-label">Writing</div>
          <h1 className="section-title">
            Blog &amp; <span className="highlight">Thoughts</span>
          </h1>
          <p className="blog-header-desc">
            Writing about AI, engineering, and the occasional life lesson from building things that break.
          </p>
        </header>

        <div className="blog-notice glass-card">
          <span className="blog-notice-icon">✍️</span>
          <div>
            <p className="blog-notice-title">Posts coming soon</p>
            <p className="blog-notice-sub">These articles are in draft. Subscribe below to get notified when they publish.</p>
          </div>
        </div>

        <div className="blog-grid">
          {POSTS.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>

        <section className="blog-subscribe glass-card">
          <div className="blog-sub-icon">📬</div>
          <h2 className="blog-sub-title">Get notified when I publish</h2>
          <p className="blog-sub-desc">No spam — just new posts about AI, engineering, and things I find interesting.</p>
          <a href="mailto:zulakathan06@gmail.com?subject=Blog%20Subscription" className="btn-primary">
            Send me an email ↗
          </a>
        </section>
      </div>
    </div>
  )
}
