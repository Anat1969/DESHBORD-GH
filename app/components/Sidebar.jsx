import { useDashboard } from '../context/DashboardContext'
import FileUpload from './FileUpload'
import neighborhoodsData from '../../data/neighborhoods.json'
import categoriesData from '../../data/categories.json'

export default function Sidebar() {
  const { filters, setFilter, resetFilters } = useDashboard()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>מסננים</h2>
        <button className="btn-reset" onClick={resetFilters}>
          איפוס
        </button>
      </div>

      <FileUpload />

      <div className="filter-group">
        <label htmlFor="filter-neighborhood">שכונה</label>
        <select
          id="filter-neighborhood"
          value={filters.neighborhood}
          onChange={(e) => setFilter('neighborhood', e.target.value)}
        >
          <option value="all">הכל</option>
          {neighborhoodsData.neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-category">קטגוריה</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
        >
          <option value="all">הכל</option>
          {categoriesData.categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-info">
        <h3>מקורות נתונים</h3>
        <p>
          הנתונים מבוססים על מקורות ציבוריים:
          הלמ"ס, רשם החברות, ופורטל data.gov.il.
          העלו קובץ Excel לעדכון הנתונים.
        </p>
        <p className="version">גרסה 2.0</p>
      </div>
    </aside>
  )
}
