import { useEffect, useState } from 'react'
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
        <header className="dashboard-header">
          <h1>דשבורד עסקים — אשדוד</h1>
          <div className="header-right">
            <span className="pulse-dot" />
            <span className="last-updated">
              עדכון אחרון: {filteredData.summary.last_updated}
            </span>
          </div>
        </header>
        <KPICards summary={filteredData.summary} />
        <div className="charts-row">
          <div className="chart-container chart-line">
            <h2>
              <span className="chart-icon">📊</span>
              עסקים לפי שכונה
            </h2>
            <LineChart neighborhoods={filteredData.neighborhoods} />
          </div>
          <div className="chart-container chart-doughnut">
            <h2>
              <span className="chart-icon">🔵</span>
              חלוקה לפי קטגוריה
            </h2>
            <DoughnutChart categories={filteredData.categories} />
          </div>
        </div>
        <div className="map-section">
          <h2>
            <span className="chart-icon">🌍</span>
            תפוסה גיאוגרפית
          </h2>
          <GeoMap neighborhoods={filteredData.neighborhoods} />
        </div>
      </main>
    </div>
  )
}
