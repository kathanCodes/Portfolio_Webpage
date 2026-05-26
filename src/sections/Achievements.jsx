import React from 'react'
import { useInView } from 'react-intersection-observer'
import './Achievements.css'

const ACHIEVEMENTS = [
  {
    icon: '🏆',
    title: 'Bajaj Finserv HackerX 6.0',
    subtitle: 'Hackathon',
    desc: 'Advanced to the 4th elimination round by building an enterprise-grade RAG Document Intelligence API.',
    color: '#ff6b35',
  },
  {
    icon: '⚡',
    title: 'LeetCode Peak Rating 1563',
    subtitle: 'Competitive Programming',
    desc: 'Ranked 2142 in Weekly Contest 445. Consistent competitive programmer across algorithmic challenges.',
    color: '#00ff88',
  },
  {
    icon: '🎯',
    title: 'JEE Mains 99.09 Percentile',
    subtitle: 'National Entrance Exam — 2022',
    desc: 'Secured 99.09 percentile among 900,000+ candidates — one of India\'s most competitive exams.',
    color: '#00d4ff',
  },
  {
    icon: '🔬',
    title: 'KVPY AIR 4890',
    subtitle: 'Scholarship Exam — 2021',
    desc: 'Qualified the Kishore Vaigyanik Protsahan Yojana with All India Rank 4890 in the SX stream.',
    color: '#8b5cf6',
  },
]

const POSITIONS = [
  {
    role: 'Assistant Head',
    org: 'Akshar — The Literary Arts Club',
    place: 'IIT Jodhpur',
    period: 'Aug 2024 – Dec 2024',
    desc: 'Coordinated event planning and managed a team of volunteers, ensuring smooth execution of literary activities and workshops.',
    icon: '📚',
  },
]

export default function Achievements() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="achievements" className="achievements" ref={ref}>
      <div className="container">
        <div className={`achievements-header ${inView ? 'visible' : ''}`}>
          <div className="section-label">Achievements</div>
          <h2 className="section-title">
            Notable <span className="highlight">Milestones</span>
          </h2>
        </div>

        <div className={`achievements-grid ${inView ? 'visible' : ''}`}>
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={a.title}
              className="achievement-card glass-card"
              style={{ '--ach-color': a.color, animationDelay: `${i * 0.1}s` }}
            >
              <div className="ach-icon-wrap">
                <span className="ach-icon">{a.icon}</span>
                <div className="ach-icon-ring" />
              </div>
              <div className="ach-subtitle">{a.subtitle}</div>
              <h3 className="ach-title">{a.title}</h3>
              <p className="ach-desc">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className={`positions-section ${inView ? 'visible' : ''}`}>
          <div className="section-label">Leadership</div>
          <div className="positions-list">
            {POSITIONS.map(pos => (
              <div key={pos.role} className="position-card glass-card">
                <span className="position-icon">{pos.icon}</span>
                <div className="position-info">
                  <div className="position-role">{pos.role}</div>
                  <div className="position-org">{pos.org} · <span>{pos.place}</span></div>
                  <div className="position-period">{pos.period}</div>
                  <p className="position-desc">{pos.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
