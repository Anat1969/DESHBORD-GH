import { useEffect } from 'react'
import { useDashboard } from './context/DashboardContext'
import KPICards from './components/KPICards'
import BarChart from './components/BarChart'
import DoughnutChart from './components/DoughnutChart'
import GeoMap from './components/GeoMap'
import Sidebar from './components/Sidebar'
import sampleData from '../data/processed/sample-data.json'

export default function Dashboard() {
  const { setData, filteredData, loading } = useDashboard()

  useEffect(() => {
    setData(sampleData)
  }, [setData])

  if (loading || !filteredData) {
    return <div className="loading">טוען נתונים...</div>
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>דשבורד עסקים — אשדוד</h1>
          <span className="last-updated">
            עדכון אחרון: {filteredData.summary.last_updated}
          </span>
        </header>
        <KPICards summary={filteredData.summary} />
        <div className="charts-row">
          <div className="chart-container chart-bar">
            <h2>עסקים לפי שכונה</h2>
            <BarChart neighborhoods={filteredData.neighborhoods} />
          </div>
          <div className="chart-container chart-doughnut">
            <h2>חלוקה לפי קטגוריה</h2>
            <DoughnutChart categories={filteredData.categories} />
          </div>
        </div>
        <div className="map-section">
          <h2>התפוצה הגיאוגרפית</h2>
          <GeoMap neighborhoods={filteredData.neighborhoods} />
        </div>
      </main>
    </div>
  )
}
