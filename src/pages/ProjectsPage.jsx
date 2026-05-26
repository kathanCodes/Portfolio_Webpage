import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import './ProjectsPage.css'

const ALL_PROJECTS = [
  {
    id: 1,
    title: 'High-Performance RAG API',
    subtitle: 'Document Intelligence Platform',
    period: 'Jul 2025 – Aug 2025',
    category: 'AI / ML',
    description: 'Engineered a scalable RAG pipeline with FastAPI and RESTful API endpoints for enterprise document intelligence. Achieved 80% factual accuracy in document-based Q&A through optimized semantic chunking and structured prompt design.',
    highlights: [
      '40% reduction in query latency via dual-layer Pinecone caching',
      '80% factual accuracy on document Q&A',
      'Enterprise-grade REST API with FastAPI',
    ],
    stack: ['Python', 'FastAPI', 'LangChain', 'GPT-3.5', 'Pinecone', 'Docker'],
    color: '#00ff88',
    icon: '🧠',
    github: 'https://github.com/kathanCodes',
    featured: true,
  },
  {
    id: 2,
    title: 'Bias-Resilient Image Classifier',
    subtitle: 'Deep Learning Research Project',
    period: 'Jan 2025 – Apr 2025',
    category: 'Deep Learning',
    description: 'Built an image classification model using ResNet-18 that accurately classifies heavily biased datasets with severe age-gender correlations. Used incremental knowledge distillation to mitigate bias.',
    highlights: [
      '82% accuracy on heavily biased dataset',
      'Knowledge distillation with KL divergence loss',
      'Heavy data augmentation for minority sampling',
    ],
    stack: ['Python', 'PyTorch', 'ResNet-18', 'Knowledge Distillation', 'Computer Vision'],
    color: '#8b5cf6',
    icon: '👁️',
    github: 'https://github.com/kathanCodes',
    featured: true,
  },
  {
    id: 3,
    title: 'GPS Navigation System',
    subtitle: 'Real-Time Web Application',
    period: 'Sep 2025 – Dec 2025',
    category: 'Full Stack',
    description: "Designed a web-based GPS navigation system with dynamic pathfinding using Dijkstra's Algorithm. Integrated OpenStreetMap API for real-time geospatial data and traffic updates.",
    highlights: [
      "Dijkstra's algorithm for real-time pathfinding",
      'OpenStreetMap API integration',
      'Responsive frontend with geolocation support',
    ],
    stack: ['Python', 'Flask', 'OpenStreetMap API', 'JavaScript', 'HTML/CSS'],
    color: '#00d4ff',
    icon: '🗺️',
    github: 'https://github.com/kathanCodes',
    featured: false,
  },
]

const CATEGORIES = ['All', 'AI / ML', 'Deep Learning', 'Full Stack']

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.8 + 0.8,
      opacity: Math.random() * 0.35 + 0.55,
    }))

    const resize = () => { 
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight 
    }
    resize()
    window.addEventListener('resize', resize)

    const isLight = () =>
      document.documentElement.getAttribute('data-theme') === 'light' ||
      document.querySelector('[data-theme]')?.getAttribute('data-theme') === 'light'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const rgb = isLight() ? '255, 200, 0' : '0, 255, 136'
      const lineRgb = isLight() ? '200, 130, 0' : '0, 255, 136'
      const lineMul = isLight() ? 0.55 : 0.35

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
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${lineRgb}, ${lineMul * (1 - d / 110)})`
            ctx.lineWidth = isLight() ? 0.65 : 0.45
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

  return <canvas ref={canvasRef} className="page-canvas" />
}

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`pp-card glass-card ${inView ? 'visible' : ''}`}
      style={{ '--project-color': project.color, transitionDelay: `${index * 0.1}s` }}
    >
      <div className="pp-card-top">
        <span className="pp-icon">{project.icon}</span>
        <div className="pp-meta">
          <span className="pp-category">{project.category}</span>
          {project.featured && <span className="pp-featured">Featured</span>}
        </div>
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="pp-gh-link" aria-label="GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
        </a>
      </div>

      <div>
        <h3 className="pp-title">{project.title}</h3>
        <p className="pp-subtitle">{project.subtitle}</p>
        <span className="pp-period">{project.period}</span>
      </div>

      <p className="pp-desc">{project.description}</p>

      <ul className="pp-highlights">
        {project.highlights.map((h, i) => (
          <li key={i}><span className="pp-bullet">▶</span>{h}</li>
        ))}
      </ul>

      <div className="pp-stack">
        {project.stack.map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      <div className="pp-glow" />
    </div>
  )
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All')

  const visible = filter === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.category === filter)

  useEffect(() => {
    const s = document.createElement('script')
    s.src = '/duck-game.js'
    s.async = true
    document.body.appendChild(s)
    return () => document.body.removeChild(s)
  }, [])

  return (
    <div className="pp-page">
      <ParticleCanvas />
      <div className="pp-glow-bg pp-glow-bg-1" />
      <div className="pp-glow-bg pp-glow-bg-2" />

      <div className="container pp-container">
        <header className="pp-header">
          <div className="section-label">Portfolio</div>
          <h1 className="section-title">
            All <span className="highlight">Projects</span>
          </h1>
          <p className="pp-header-desc">
            A collection of things I've built — from AI pipelines to full-stack applications.
          </p>
        </header>

        <div className="pp-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pp-filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="pp-grid">
          {visible.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <section className="pp-game-section">
          <div className="section-label">Mini Game</div>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>
            Rubber Duck <span className="highlight">Debugger</span>
          </h2>
          
          <div className="duck-game-container">
            <canvas id="duck-game-canvas" width="800" height="400"></canvas>
          </div>
        </section>

        <div className="pp-cta">
          <a href="https://github.com/kathanCodes" target="_blank" rel="noopener noreferrer" className="btn-outline">
            View All on GitHub ↗
          </a>
        </div>
      </div>
    </div>
  )
}