import { readFile } from 'fs/promises'
import { read, utils } from 'xlsx'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

async function loadReference(filename) {
  const raw = await readFile(resolve(rootDir, 'data', filename), 'utf-8')
  return JSON.parse(raw)
}

export async function validateExcel(filePath) {
  const errors = []
  const warnings = []

  const neighborhoodsRef = await loadReference('neighborhoods.json')
  const categoriesRef = await loadReference('categories.json')

  const knownNeighborhoods = new Set(neighborhoodsRef.neighborhoods.map(n => n.name))
  const knownCategories = new Set(categoriesRef.categories.map(c => c.name))

  let buffer
  try {
    buffer = await readFile(filePath)
  } catch (err) {
    errors.push(`לא ניתן לקרוא את הקובץ: ${err.message}`)
    return { valid: false, errors, warnings }
  }

  const workbook = read(buffer, { type: 'buffer' })

  const sheetName = workbook.SheetNames.find(
    name => name.includes('נתונים') || name.includes('עסקים')
  )

  if (!sheetName) {
    errors.push('לא נמצא גיליון "נתונים עסקים" בקובץ')
    return { valid: false, errors, warnings }
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = utils.sheet_to_json(sheet)

  if (rows.length === 0) {
    errors.push('הגיליון ריק — אין שורות נתונים')
    return { valid: false, errors, warnings }
  }

  const requiredColumns = ['שכונה', 'קטגוריה', 'כמות עסקים', 'הכנסות', 'מצב']
  const firstRow = rows[0]
  const presentColumns = Object.keys(firstRow)

  for (const col of requiredColumns) {
    if (!presentColumns.includes(col)) {
      errors.push(`עמודה חסרה: "${col}"`)
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings }
  }

  rows.forEach((row, i) => {
    const rowNum = i + 2

    if (!knownNeighborhoods.has(row['שכונה'])) {
      warnings.push(`שורה ${rowNum}: שכונה לא מוכרת "${row['שכונה']}"`)
    }

    if (!knownCategories.has(row['קטגוריה'])) {
      warnings.push(`שורה ${rowNum}: קטגוריה לא מוכרת "${row['קטגוריה']}"`)
    }

    const count = Number(row['כמות עסקים'])
    if (isNaN(count) || count < 0) {
      errors.push(`שורה ${rowNum}: כמות עסקים לא תקינה (${row['כמות עסקים']})`)
    }

    const income = Number(row['הכנסות'])
    if (isNaN(income) || income < 0) {
      errors.push(`שורה ${rowNum}: הכנסות לא תקינות (${row['הכנסות']})`)
    }

    const validStatuses = ['פעיל', 'בריקנות']
    if (!validStatuses.includes(row['מצב'])) {
      warnings.push(`שורה ${rowNum}: מצב לא מוכר "${row['מצב']}"`)
    }
  })

  return {
    valid: errors.length === 0,
    rowCount: rows.length,
    errors,
    warnings
  }
}

const inputFile = process.argv[2]
if (inputFile) {
  validateExcel(inputFile).then(result => {
    console.log(JSON.stringify(result, null, 2))
    if (!result.valid) process.exit(1)
  })
} else {
  console.log('שימוש: node scripts/validate-excel.js <path-to-excel>')
}
