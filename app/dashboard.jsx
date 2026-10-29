import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDashboard } from './context/DashboardContext'
import LandingPage from './components/LandingPage'
import KPICards from './components/KPICards'
import LineChart from './components/BarChart'
import DoughnutChart from './components/DoughnutChart'
import GeoMap from './components/GeoMap'
import Sidebar from './components/Sidebar'
import AnimatedBackground from './components/AnimatedBackground'
import sampleData from '../data/processed/sample-data.json'

const SECTIONS = [
  { id: 'overview', label: 'תמונת מצב' },
  { id: 'neighborhoods', label: 'רובעים' },
  { id: 'categories', label: 'ענפים' },
  { id: 'map', label: 'מפה' }
]

export default function Dashboard() {
  const { setData, filteredData, data, loading } = useDashboard()
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const sectionRefs = useRef({})

  useEffect(() => {
    setData(sampleData)
  }, [setData])

  /* Scroll to section and update active indicator */
  function scrollToSection(id) {
    setActiveSection(id)
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* Track which section is visible */
  useEffect(() => {
    if (!showDashboard) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.section)
        })
      },
      { threshold: 0.3 }
    )
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [showDashboard, filteredData])

  if (loading || !filteredData) {
    return <div className="loading">טוען נתונים...</div>
  }

  if (!showDashboard) {
    return (
      <LandingPage
        summary={data.summary}
        onEnter={() => setShowDashboard(true)}
      />
    )
  }

  return (
    <div className="dashboard-layout">
      <AnimatedBackground />
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <motion.header
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>דשבורד עסקים — אשדוד</h1>
          <ai-menu></ai-menu>
          <div className="header-right">
            <span className="last-updated">
              נתוני דוגמה · {filteredData.summary.last_updated}
            </span>
          </div>
        </motion.header>

        {/* Step navigation */}
        <nav className="section-nav">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`section-nav-btn${activeSection === s.id ? ' active' : ''}`}
              onClick={() => scrollToSection(s.id)}
            >
              <span className="section-nav-num">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Section 1 — תמונת מצב */}
        <section
          ref={el => sectionRefs.current.overview = el}
          data-section="overview"
          className="dash-section"
        >
          <div className="section-guide">
            <h2>תמונת מצב</h2>
            <p className="guide-text">
              ארבעה מספרים שמסכמים את הפעילות העסקית בעיר.
              שימו לב לאחוז הריקנות — מעל 15% מצביע על ירידה בביקוש שדורשת בחינה.
            </p>
          </div>
          <KPICards summary={filteredData.summary} />
          <div className="planning-note">
            <span className="planning-label">שאלה לתכנון</span>
            האם ההכנסות מחולקות באופן שווה בין הרובעים, או שיש ריכוז גבוה ברובע אחד?
          </div>
        </section>

        {/* Section 2 — רובעים */}
        <section
          ref={el => sectionRefs.current.neighborhoods = el}
          data-section="neighborhoods"
          className="dash-section"
        >
          <div className="section-guide">
            <h2>השוואת רובעים</h2>
            <p className="guide-text">
              כל נקודה היא רובע.
              הפער בין הגדול לקטן מראה את עוצמת הריכוזיות — רובע חלש הוא הזדמנות לתכנון.
            </p>
          </div>
          <motion.div
            className="chart-container chart-line"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LineChart neighborhoods={filteredData.neighborhoods} />
          </motion.div>
          <div className="planning-note">
            <span className="planning-label">שאלה לתכנון</span>
            מה גורם לרובעים החלשים להישאר חלשים? תשתית, נגישות, סוג דיור, או חוסר שטחי מסחר?
          </div>
        </section>

        {/* Section 3 — ענפים */}
        <section
          ref={el => sectionRefs.current.categories = el}
          data-section="categories"
          className="dash-section"
        >
          <div className="section-guide">
            <h2>הרכב ענפי</h2>
            <p className="guide-text">
              כשענף אחד שולט — הרובע פגיע.
              גיוון ענפי מגן על הכלכלה המקומית מפני ירידה בענף בודד.
            </p>
          </div>
          <motion.div
            className="chart-container chart-doughnut"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DoughnutChart categories={filteredData.categories} />
          </motion.div>
          <div className="planning-note">
            <span className="planning-label">שאלה לתכנון</span>
            האם אפשר לעודד ענפים חסרים ברובעים ספציפיים דרך הקלות או ייעוד שטחים?
          </div>
        </section>

        {/* Section 4 — מפה */}
        <section
          ref={el => sectionRefs.current.map = el}
          data-section="map"
          className="dash-section"
        >
          <div className="section-guide">
            <h2>תפוסה גיאוגרפית</h2>
            <p className="guide-text">
              גודל העיגול = מספר עסקים.
              עיגול קטן עם ריקנות גבוהה הוא אזור שדורש תשומת לב בתכנון.
            </p>
          </div>
          <motion.div
            className="map-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GeoMap neighborhoods={filteredData.neighborhoods} />
          </motion.div>
          <div className="planning-note">
            <span className="planning-label">שאלה לתכנון</span>
            האם מיקום השטחים המסחריים מתאים לצרכי האוכלוסייה ברובע, או שתושבים צריכים לנסוע לרובע אחר?
          </div>
        </section>
      </main>
    </div>
  )
}
