import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DashboardProvider } from './context/DashboardContext'
import Dashboard from './dashboard'
import './styles/dashboard.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  </StrictMode>
)
