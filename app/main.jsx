import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DashboardProvider } from './context/DashboardContext'
import Dashboard from './dashboard'
import ArticlesPage from './components/ArticlesPage'
import './styles/dashboard.css'

/* #/articles פותח את דף הכתבות. כל כתובת אחרת: הדשבורד, כמו קודם. */
function Root() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => { setHash(window.location.hash); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  if (hash === '#/articles') return <ArticlesPage />
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
