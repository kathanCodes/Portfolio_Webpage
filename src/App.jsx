import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Achievements from './sections/Achievements'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import ProjectsPage from './pages/ProjectsPage'
import BlogPage from './pages/BlogPage'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [page, setPage] = useState('home')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <div data-theme={theme}>
      <Cursor />
      {loading ? (
        <Loader />
      ) : (
        <div className="app">
          <Navbar theme={theme} toggleTheme={toggleTheme} page={page} setPage={setPage} />
          <main>
            {page === 'home' && (
              <>
                <Hero />
                <About />
                <Skills />
                <Achievements />
                <Education />
                <Contact />
              </>
            )}
            {page === 'projects' && <ProjectsPage />}
            {page === 'blog'     && <BlogPage />}
          </main>
          <Footer />
        </div>
      )}
    </div>
  )
}

export default App
