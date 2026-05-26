import React, { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import './Contact.css'

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.location.href = `mailto:zulakathan06@gmail.com?subject=${subject}&body=${body}`
    setStatus('sent')
    setTimeout(() => setStatus(null), 4000)
  }

  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="container">
        <div className={`contact-inner ${inView ? 'visible' : ''}`}>
          <div className="contact-left">
            <div className="section-label">Contact</div>
            <h2 className="section-title">
              Let's <span className="highlight">Connect</span>
            </h2>
            <p className="contact-desc">
              I'm actively looking for internship opportunities, research collaborations,
              and exciting AI/ML projects. If you have something in mind, let's talk.
            </p>

            <div className="contact-links">
              <a href="mailto:zulakathan06@gmail.com" className="contact-link">
                <div className="contact-link-icon">✉️</div>
                <div>
                  <div className="contact-link-label">Email</div>
                  <div className="contact-link-value">zulakathan06@gmail.com</div>
                </div>
              </a>
              <a href="mailto:b23cm1063@iitj.ac.in" className="contact-link">
                <div className="contact-link-icon">🎓</div>
                <div>
                  <div className="contact-link-label">IIT Email</div>
                  <div className="contact-link-value">b23cm1063@iitj.ac.in</div>
                </div>
              </a>
              <a href="https://linkedin.com/in/kathan-zula-858a97254" target="_blank" rel="noopener noreferrer" className="contact-link">
                <div className="contact-link-icon">💼</div>
                <div>
                  <div className="contact-link-label">LinkedIn</div>
                  <div className="contact-link-value">kathan-zula</div>
                </div>
              </a>
              <a href="https://github.com/kathanCodes" target="_blank" rel="noopener noreferrer" className="contact-link">
                <div className="contact-link-icon">🐙</div>
                <div>
                  <div className="contact-link-label">GitHub</div>
                  <div className="contact-link-value">kathanCodes</div>
                </div>
              </a>
              <a href="tel:+918200101064" className="contact-link">
                <div className="contact-link-icon">📱</div>
                <div>
                  <div className="contact-link-label">Phone</div>
                  <div className="contact-link-value">+91 8200101064</div>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label">name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">message</label>
                <textarea
                  name="message"
                  className="form-input form-textarea"
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="btn-primary form-submit">
                {status === 'sent' ? '✓ Message ready — check your mail app' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
