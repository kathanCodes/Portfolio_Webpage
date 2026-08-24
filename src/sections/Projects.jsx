import React, { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import './Projects.css'

const PROJECTS = [
  {
    id: 1,
    title: 'High-Performance RAG API',
    subtitle: 'Document Intelligence Platform',
    period: 'Jul 2025 – Aug 2025',
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

export default function Projects({ setPage }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [active, setActive] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 40; i++) {
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
        (document.querySelector('[data-theme]')?.getAttribute('data-theme') === 'light')

      const particleColorRGB = isLightMode ? '255, 215, 0' : '0, 255, 136'

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
    <section id="projects" className="projects" ref={ref}>
      <canvas ref={canvasRef} className="projects-canvas" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={`projects-header ${inView ? 'visible' : ''}`}>
          <div className="section-label">Projects</div>
          <h2 className="section-title">
            Things I've <span className="highlight">Built</span>
          </h2>
        </div>

        <div className={`projects-grid ${inView ? 'visible' : ''}`}>
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className={`project-card glass-card ${project.featured ? 'featured' : ''} ${active === project.id ? 'expanded' : ''}`}
              style={{ '--project-color': project.color, animationDelay: `${i * 0.15}s` }}
              onMouseEnter={() => setActive(project.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="project-top">
                <div className="project-icon">{project.icon}</div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="GitHub">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  </a>
                </div>
              </div>

              <div className="project-meta">
                <span className="project-period">{project.period}</span>
                {project.featured && <span className="project-featured-tag">Featured</span>}
              </div>

              <h3 className="project-title">{project.title}</h3>
              <div className="project-subtitle">{project.subtitle}</div>
              <p className="project-desc">{project.description}</p>

              <ul className="project-highlights">
                {project.highlights.map((h, i) => (
                  <li key={i}><span className="project-bullet">▶</span> {h}</li>
                ))}
              </ul>

              <div className="project-stack">
                {project.stack.map(tech => <span key={tech} className="tag">{tech}</span>)}
              </div>

              <div className="project-glow" />
            </div>
          ))}
        </div>

        <div className={`projects-footer ${inView ? 'visible' : ''}`}>
          {setPage && (
            <button className="btn-primary" onClick={() => setPage('projects')}>
              See All Projects →
            </button>
          )}
          <a href="https://github.com/kathanCodes" target="_blank" rel="noopener noreferrer" className="btn-outline">
            View on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
