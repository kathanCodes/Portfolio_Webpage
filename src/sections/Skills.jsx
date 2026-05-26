import React from 'react'
import { useInView } from 'react-intersection-observer'
import './Skills.css'

const SKILL_GROUPS = [
  {
    category: 'Languages',
    icon: '< >',
    color: '#00ff88',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'C/C++', level: 80 },
      { name: 'JavaScript', level: 75 },
      { name: 'SQL', level: 80 },
      { name: 'Bash', level: 65 },
    ],
  },
  {
    category: 'AI / ML & RAG',
    icon: '🧠',
    color: '#8b5cf6',
    skills: [
      { name: 'LangChain', level: 90 },
      { name: 'PyTorch', level: 85 },
      { name: 'OpenAI API', level: 90 },
      { name: 'Pinecone', level: 85 },
      { name: 'Scikit-learn', level: 80 },
      { name: 'NumPy/Pandas', level: 90 },
    ],
  },
  {
    category: 'Web & APIs',
    icon: '🌐',
    color: '#00d4ff',
    skills: [
      { name: 'FastAPI', level: 88 },
      { name: 'Flask', level: 80 },
      { name: 'React.js', level: 70 },
      { name: 'Node.js', level: 65 },
      { name: 'REST APIs', level: 90 },
    ],
  },
  {
    category: 'Databases & DevOps',
    icon: '⚙️',
    color: '#ff6b35',
    skills: [
      { name: 'PostgreSQL', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'Docker', level: 78 },
      { name: 'Git', level: 90 },
      { name: 'MySQL', level: 75 },
    ],
  },
]

function SkillBar({ name, level, color, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })
  return (
    <div className="skill-bar" ref={ref}>
      <div className="skill-bar-header">
        <span className="skill-name">{name}</span>
        <span className="skill-level" style={{ color }}>{level}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            width: inView ? `${level}%` : '0%',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            transitionDelay: delay,
            boxShadow: inView ? `0 0 10px ${color}40` : 'none',
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" className="skills" ref={ref}>
      <div className="container">
        <div className={`skills-header ${inView ? 'visible' : ''}`}>
          <div className="section-label">Skills</div>
          <h2 className="section-title">
            My <span className="highlight">Toolkit</span>
          </h2>
        </div>

        <div className={`skills-grid ${inView ? 'visible' : ''}`}>
          {SKILL_GROUPS.map((group, gi) => (
            <div
              key={group.category}
              className="skill-group glass-card"
              style={{ '--group-color': group.color, animationDelay: `${gi * 0.1}s` }}
            >
              <div className="skill-group-header">
                <span className="skill-group-icon">{group.icon}</span>
                <div>
                  <div className="skill-group-title">{group.category}</div>
                </div>
              </div>
              <div className="skill-bars">
                {group.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={group.color}
                    delay={`${si * 0.08}s`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className={`skills-courses ${inView ? 'visible' : ''}`}>
          <div className="section-label">Coursework</div>
          <div className="courses-tags">
            {[
              'Data Structures & Algorithms',
              'Design and Analysis of Algorithms',
              'Machine Learning',
              'Deep Learning',
              'Artificial Intelligence',
              'Natural Language Understanding',
              'Speech Understanding',
              'Data Engineering',
              'Optimization in ML',
              'Probability & Statistics',
              'Linear Algebra',
              'Maths for Big Data',
              'Human-Machine Interaction',
              'Data Visualization',
              'Principles of Computer Systems',
            ].map(course => (
              <span key={course} className="course-tag">{course}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
