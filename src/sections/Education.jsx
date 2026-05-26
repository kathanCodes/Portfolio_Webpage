import React from 'react'
import { useInView } from 'react-intersection-observer'
import './Education.css'

const EDUCATION = [
  {
    degree: 'B.Tech — Artificial Intelligence & Data Science',
    institution: 'Indian Institute of Technology, Jodhpur',
    period: '2023 – 2027',
    score: 'CGPA: 8.19 / 10.0',
    icon: '🎓',
    highlight: true,
    details: 'One of India\'s premier technical institutes. Specializing in AI, ML, and data-driven systems.',
    color: '#00ff88',
  },
  {
    degree: 'Senior Secondary (XII) — GHSEB Board',
    institution: 'Gujarat Higher Secondary Education Board',
    period: '2022',
    score: '90.94%',
    icon: '📖',
    highlight: false,
    details: 'Science stream with focus on Mathematics, Physics, and Chemistry.',
    color: '#00d4ff',
  },
  {
    degree: 'Secondary (X) — GSEB Board',
    institution: 'Gujarat Secondary Education Board',
    period: '2020',
    score: '99.66%',
    icon: '✏️',
    highlight: false,
    details: 'Outstanding academic performance across all subjects.',
    color: '#8b5cf6',
  },
]

export default function Education() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="education" className="education" ref={ref}>
      <div className="container">
        <div className={`education-header ${inView ? 'visible' : ''}`}>
          <div className="section-label">Education</div>
          <h2 className="section-title">
            Academic <span className="highlight">Journey</span>
          </h2>
        </div>

        <div className={`education-timeline ${inView ? 'visible' : ''}`}>
          {EDUCATION.map((edu, i) => (
            <div
              key={edu.degree}
              className={`edu-item ${edu.highlight ? 'featured' : ''}`}
              style={{ '--edu-color': edu.color, animationDelay: `${i * 0.15}s` }}
            >
              <div className="edu-line">
                <div className="edu-dot">
                  <span>{edu.icon}</span>
                </div>
                {i < EDUCATION.length - 1 && <div className="edu-connector" />}
              </div>

              <div className="edu-card glass-card">
                <div className="edu-period">{edu.period}</div>
                <h3 className="edu-degree">{edu.degree}</h3>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-score">
                  <span className="edu-score-label">Score</span>
                  <span className="edu-score-value">{edu.score}</span>
                </div>
                <p className="edu-details">{edu.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
