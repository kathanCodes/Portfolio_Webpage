import React from 'react'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <span className="footer-logo">K<span className="footer-dot">.</span></span>
          <span className="footer-copy">
            © {year} Kathan Zula · Built with React & Vite
          </span>
        </div>
        <div className="footer-right">
          <a href="https://github.com/kathanCodes" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://linkedin.com/in/kathan-zula-858a97254" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="mailto:zulakathan06@gmail.com" className="footer-link">Email</a>
        </div>
      </div>
    </footer>
  )
}
