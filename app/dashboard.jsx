import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboard } from './context/DashboardContext'
import LandingPage from './components/LandingPage'
import KPICards from './components/KPICards'
import LineChart from './components/BarChart'
import DoughnutChart from './components/DoughnutChart'
import GeoMap from './components/GeoMap'
import Sidebar from './components/Sidebar'
import AnimatedBackground from './components/AnimatedBackground'
import sampleData from '../data/processed/sample-data.json'

export default function Dashboard() {
  const { setData, filteredData, data, loading } = useDashboard()
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    setData(sampleData)
  }, [setData])

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
        <motion.header
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>דשבורד עסקים — אשדוד</h1>
          <div className="header-right">
            <span className="pulse-dot" />
            <span className="last-updated">
              עדכון אחרון: {filteredData.summary.last_updated}
            </span>
          </div>
        </motion.header>

        <KPICards summary={filteredData.summary} />

        <div className="charts-row">
          <motion.div
            className="chart-container chart-line"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>עסקים לפי שכונה</h2>
            <LineChart neighborhoods={filteredData.neighborhoods} />
          </motion.div>
          <motion.div
            className="chart-container chart-doughnut"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>חלוקה לפי קטגוריה</h2>
            <DoughnutChart categories={filteredData.categories} />
          </motion.div>
        </div>

        <motion.div
          className="map-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>תפוסה גיאוגרפית</h2>
          <GeoMap neighborhoods={filteredData.neighborhoods} />
        </motion.div>
      </main>
    </div>
  )
}
