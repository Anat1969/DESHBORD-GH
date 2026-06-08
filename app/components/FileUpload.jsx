import { useState, useRef } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { read, utils } from 'xlsx'

const COLUMN_MAP = {
  'שכונה': 'neighborhood',
  'קטגוריה': 'category',
  'כמות עסקים': 'business_count',
  'הכנסות': 'income',
  'מצב': 'status'
}

const STATUS_MAP = { 'פעיל': 'active', 'בריקנות': 'vacant' }

function processExcelData(workbook, neighborhoodsRef, categoriesRef) {
  const sheetName = workbook.SheetNames.find(
    name => name.includes('נתונים') || name.includes('עסקים')
  ) || workbook.SheetNames[0]

  const rows = utils.sheet_to_json(workbook.Sheets[sheetName])
  if (!rows.length) throw new Error('הגיליון ריק')

  const nLookup = {}
  neighborhoodsRef.forEach(n => { nLookup[n.name] = n })
  const cLookup = {}
  categoriesRef.forEach(c => { cLookup[c.name] = c })

  const nd = {}
  const cd = {}

  for (const row of rows) {
    const nName = row['שכונה']
    const cName = row['קטגוריה']
    const count = Number(row['כמות עסקים']) || 0
    const income = Number(row['הכנסות']) || 0
    const status = row['מצב']

    const nRef = nLookup[nName]
    const cRef = cLookup[cName]
    if (!nRef || !cRef) continue

    if (!nd[nRef.id]) {
      nd[nRef.id] = {
        id: nRef.id, name: nRef.name,
        businesses: 0, income: 0, vacantCount: 0, totalCount: 0, categories: {}
      }
    }
    const n = nd[nRef.id]
    n.businesses += count
    n.income += income
    n.totalCount++
    if (status === 'בריקנות') n.vacantCount++

    if (!n.categories[cRef.id]) {
      n.categories[cRef.id] = { id: cRef.id, name: cRef.name, count: 0, income: 0 }
    }
    n.categories[cRef.id].count += count
    n.categories[cRef.id].income += income

    if (!cd[cRef.id]) {
      cd[cRef.id] = { id: cRef.id, name: cRef.name, total_count: 0, color: cRef.color, by_neighborhood: {} }
    }
    cd[cRef.id].total_count += count
    cd[cRef.id].by_neighborhood[nRef.id] = (cd[cRef.id].by_neighborhood[nRef.id] || 0) + count
  }

  const neighborhoods = Object.values(nd).map(n => ({
    id: n.id, name: n.name, businesses: n.businesses, income: n.income,
    vacancy: n.totalCount > 0 ? n.vacantCount / n.totalCount : 0,
    categories: Object.values(n.categories)
  }))

  const categories = Object.values(cd)
  const totalBiz = neighborhoods.reduce((s, n) => s + n.businesses, 0)
  const totalInc = neighborhoods.reduce((s, n) => s + n.income, 0)
  const avgVac = neighborhoods.length > 0
    ? neighborhoods.reduce((s, n) => s + n.vacancy, 0) / neighborhoods.length : 0

  const today = new Date().toISOString().split('T')[0]

  return {
    meta: { version: '2.0', generated: new Date().toISOString(), source: 'file-upload', data_quality: 'validated' },
    summary: {
      total_businesses: totalBiz, total_income: totalInc,
      avg_vacancy: Math.round(avgVac * 10000) / 10000,
      neighborhoods_count: neighborhoods.length,
      categories_count: categories.length, last_updated: today
    },
    neighborhoods, categories
  }
}

export default function FileUpload() {
  const { setData } = useDashboard()
  const [status, setStatus] = useState(null)
  const [fileName, setFileName] = useState(null)
  const fileRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStatus('reading')

    try {
      const buffer = await file.arrayBuffer()
      const workbook = read(buffer, { type: 'array' })

      setStatus('processing')

      const { default: neighbData } = await import('../../data/neighborhoods.json')
      const { default: catData } = await import('../../data/categories.json')

      const processed = processExcelData(workbook, neighbData.neighborhoods, catData.categories)

      setData(processed)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      console.error('שגיאה בעיבוד:', err)
    }
  }

  return (
    <div className="file-upload-section">
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <button className="btn-upload" onClick={() => fileRef.current?.click()}>
        העלאת קובץ נתונים
      </button>

      {fileName && (
        <span className="upload-filename">{fileName}</span>
      )}

      {status === 'reading' && <span className="upload-status">קורא קובץ...</span>}
      {status === 'processing' && <span className="upload-status">מנתח נתונים...</span>}
      {status === 'done' && <span className="upload-status success">הנתונים עודכנו בהצלחה</span>}
      {status === 'error' && <span className="upload-status error">שגיאה בקריאת הקובץ — בדוק את המבנה</span>}
    </div>
  )
}
