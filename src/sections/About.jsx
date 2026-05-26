import React from 'react'
import { useInView } from 'react-intersection-observer'
import './About.css'

import aboutPhoto from '../assets/images/about_me.jpg'
const ABOUT_PHOTO = aboutPhoto

const FACTS = [
  { label: 'CGPA', value: '8.19', sub: 'IIT Jodhpur' },
  { label: 'JEE Rank', value: '99.09%', sub: 'Percentile' },
  { label: 'LeetCode', value: '1563', sub: 'Peak Rating' },
  { label: 'Projects', value: '10+', sub: 'AI Systems Built' },
]

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <div className={`about-inner ${inView ? 'visible' : ''}`}>
          <div className="about-left">
            <div className="about-photo-wrap">
              {ABOUT_PHOTO ? (
                <img src={ABOUT_PHOTO} alt="Kathan Zula" className="about-photo" />
              ) : (
                <div className="about-photo-placeholder">
                  <span>KZ</span>
                  <div className="about-photo-label">Your photo here</div>
                </div>
              )}
              <div className="about-photo-decoration" />
            </div>

            <div className="about-stats">
              {FACTS.map((f, i) => (
                <div key={f.label} className="about-stat" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="about-stat-value">{f.value}</div>
                  <div className="about-stat-label">{f.label}</div>
                  <div className="about-stat-sub">{f.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-right">
            <div className="section-label">About Me</div>
            <h2 className="section-title">
              Crafting Intelligent<br /><span className="highlight">Systems</span>
            </h2>

            <div className="about-text">
              <p>
                I'm <strong>Kathan Rajendrasinh Zula</strong>, a third-year B.Tech student at{' '}
                <span className="highlight">IIT Jodhpur</span> specializing in Artificial Intelligence
                and Data Science. I build end-to-end AI systems that solve real problems — from
                enterprise-grade RAG pipelines to bias-resilient classification models.
              </p>
              <p>
                My work lives at the intersection of <span className="highlight">Generative AI</span>,{' '}
                <span className="highlight">deep learning</span>, and scalable backend engineering.
                I'm passionate about making AI systems reliable, explainable, and production-ready.
              </p>
              <p>
                Beyond code, I lead literary events as Assistant Head of{' '}
                <span className="highlight">Akshar — The Literary Arts Club</span> at IIT Jodhpur,
                blending technical rigor with creative expression.
              </p>
            </div>

            <div className="about-links">
              <a
                href="mailto:zulakathan06@gmail.com"
                className="btn-primary"
              >
                zulakathan06@gmail.com
              </a>
              <a
                href="https://linkedin.com/in/kathan-zula-858a97254"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
