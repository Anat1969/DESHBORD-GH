import { readFile, writeFile, readdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { read, utils } from 'xlsx'
import { validateExcel } from './validate-excel.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const rawDir = resolve(rootDir, 'data', 'raw')
const processedDir = resolve(rootDir, 'data', 'processed')

const COLUMN_MAP = {
  'שכונה': 'neighborhood',
  'קטגוריה': 'category',
  'כמות עסקים': 'business_count',
  'הכנסות': 'income',
  'מצב': 'status'
}

const STATUS_MAP = {
  'פעיל': 'active',
  'בריקנות': 'vacant'
}

async function loadReference(filename) {
  const raw = await readFile(resolve(rootDir, 'data', filename), 'utf-8')
  return JSON.parse(raw)
}

async function findLatestExcel() {
  const files = await readdir(rawDir)
  const excelFiles = files.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'))

  if (excelFiles.length === 0) {
    throw new Error('לא נמצאו קבצי Excel ב-data/raw/')
  }

  excelFiles.sort().reverse()
  return resolve(rawDir, excelFiles[0])
}

async function processExcel(filePath) {
  const neighborhoodsRef = await loadReference('neighborhoods.json')
  const categoriesRef = await loadReference('categories.json')

  const neighborhoodLookup = {}
  neighborhoodsRef.neighborhoods.forEach(n => { neighborhoodLookup[n.name] = n })

  const categoryLookup = {}
  categoriesRef.categories.forEach(c => { categoryLookup[c.name] = c })

  const buffer = await readFile(filePath)
  const workbook = read(buffer, { type: 'buffer' })

  const sheetName = workbook.SheetNames.find(
    name => name.includes('נתונים') || name.includes('עסקים')
  ) || workbook.SheetNames[0]

  const rows = utils.sheet_to_json(workbook.Sheets[sheetName])

  const neighborhoodData = {}
  const categoryData = {}
  let totalVacant = 0
  let totalRows = 0

  for (const row of rows) {
    const neighborhoodName = row['שכונה']
    const categoryName = row['קטגוריה']
    const businessCount = Number(row['כמות עסקים']) || 0
    const income = Number(row['הכנסות']) || 0
    const status = row['מצב']

    const nRef = neighborhoodLookup[neighborhoodName]
    const cRef = categoryLookup[categoryName]

    if (!nRef || !cRef) continue

    if (!neighborhoodData[nRef.id]) {
      neighborhoodData[nRef.id] = {
        id: nRef.id,
        name: nRef.name,
        businesses: 0,
        income: 0,
        vacantCount: 0,
        totalCount: 0,
        categories: {}
      }
    }

    const nd = neighborhoodData[nRef.id]
    nd.businesses += businessCount
    nd.income += income
    nd.totalCount++
    if (status === 'בריקנות') {
      nd.vacantCount++
      totalVacant++
    }
    totalRows++

    if (!nd.categories[cRef.id]) {
      nd.categories[cRef.id] = { id: cRef.id, name: cRef.name, count: 0, income: 0 }
    }
    nd.categories[cRef.id].count += businessCount
    nd.categories[cRef.id].income += income

    if (!categoryData[cRef.id]) {
      categoryData[cRef.id] = {
        id: cRef.id,
        name: cRef.name,
        total_count: 0,
        color: cRef.color,
        by_neighborhood: {}
      }
    }
    categoryData[cRef.id].total_count += businessCount
    if (!categoryData[cRef.id].by_neighborhood[nRef.id]) {
      categoryData[cRef.id].by_neighborhood[nRef.id] = 0
    }
    categoryData[cRef.id].by_neighborhood[nRef.id] += businessCount
  }

  const neighborhoods = Object.values(neighborhoodData).map(nd => ({
    id: nd.id,
    name: nd.name,
    businesses: nd.businesses,
    income: nd.income,
    vacancy: nd.totalCount > 0 ? nd.vacantCount / nd.totalCount : 0,
    categories: Object.values(nd.categories)
  }))

  const categories = Object.values(categoryData)

  const totalBusinesses = neighborhoods.reduce((s, n) => s + n.businesses, 0)
  const totalIncome = neighborhoods.reduce((s, n) => s + n.income, 0)
  const avgVacancy = neighborhoods.length > 0
    ? neighborhoods.reduce((s, n) => s + n.vacancy, 0) / neighborhoods.length
    : 0

  const today = new Date().toISOString().split('T')[0]

  return {
    meta: {
      version: '2.0',
      generated: new Date().toISOString(),
      source: filePath.split(/[/\\]/).pop(),
      data_quality: 'validated'
    },
    summary: {
      total_businesses: totalBusinesses,
      total_income: totalIncome,
      avg_vacancy: Math.round(avgVacancy * 10000) / 10000,
      neighborhoods_count: neighborhoods.length,
      categories_count: categories.length,
      last_updated: today
    },
    neighborhoods,
    categories
  }
}

async function main() {
  console.log('מחפש קובץ Excel אחרון...')

  const filePath = await findLatestExcel()
  console.log(`נמצא: ${filePath}`)

  console.log('מאמת נתונים...')
  const validation = await validateExcel(filePath)

  if (!validation.valid) {
    console.error('שגיאות אימות:')
    validation.errors.forEach(e => console.error(`  - ${e}`))
    process.exit(1)
  }

  if (validation.warnings.length > 0) {
    console.warn('אזהרות:')
    validation.warnings.forEach(w => console.warn(`  - ${w}`))
  }

  console.log('מעבד נתונים...')
  const processed = await processExcel(filePath)

  const today = new Date().toISOString().split('T')[0]
  const outputPath = resolve(processedDir, `ashdod-data-${today}.json`)
  const latestPath = resolve(processedDir, 'latest.json')

  await writeFile(outputPath, JSON.stringify(processed, null, 2), 'utf-8')
  await writeFile(latestPath, JSON.stringify(processed, null, 2), 'utf-8')

  console.log(`נתונים מעובדים נשמרו ב: ${outputPath}`)
  console.log(`סה"כ עסקים: ${processed.summary.total_businesses}`)
  console.log(`שכונות: ${processed.summary.neighborhoods_count}`)
  console.log(`קטגוריות: ${processed.summary.categories_count}`)
  console.log('סינכרוניזציה הושלמה בהצלחה')
}

main().catch(err => {
  console.error('שגיאה:', err.message)
  process.exit(1)
})
