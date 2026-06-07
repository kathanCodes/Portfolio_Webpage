import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const SECTION_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education',    href: '#education' },
  { label: 'Contact',      href: '#contact' },
]

const PAGE_TABS = [
  { label: 'Home',     path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog',     path: '/blog' },
]

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const goToSection = (e, href) => {
    e.preventDefault()
    if (!isHome) {
      navigate('/')
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 150)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveSection(href)
    setMenuOpen(false)
  }

  const isDark = theme === 'dark'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">

        <div className="nav-left">
          <button className="nav-logo" onClick={() => navigate('/')} aria-label="Go home">
            <span className="nav-logo-k">K</span>
            <span className="nav-logo-dot" />
          </button>

          <div className="nav-page-tabs" role="tablist" aria-label="Site pages">
            {PAGE_TABS.map(tab => (
              <button
                key={tab.path}
                role="tab"
                aria-selected={location.pathname === tab.path}
                className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
                onClick={() => navigate(tab.path)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li className="nav-mobile-pages">
            {PAGE_TABS.map(tab => (
              <button
                key={tab.path}
                className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
                onClick={() => { navigate(tab.path); setMenuOpen(false) }}
              >
                {tab.label}
              </button>
            ))}
          </li>

          <li className="nav-divider-item"><span className="nav-divider" /></li>

          {SECTION_LINKS.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.href && isHome ? 'active' : ''}`}
                onClick={e => goToSection(e, link.href)}
              >
                <span className="nav-num">0{i + 1}.</span>
                {link.label}
              </a>
            </li>
          ))}

          <li>
            <a href="/resume/Kathan_Resume.pdf" className="nav-resume" target="_blank" rel="noopener noreferrer">
              Resume ↗
            </a>
          </li>
          <li className="nav-theme-item">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </li>
        </ul>

        <div className="nav-right-mobile">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className={`nav-burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  )
}