import { readFile, writeFile, mkdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

async function loadLatestData() {
  const latestPath = resolve(rootDir, 'data', 'processed', 'latest.json')
  try {
    const raw = await readFile(latestPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    const samplePath = resolve(rootDir, 'data', 'processed', 'sample-data.json')
    const raw = await readFile(samplePath, 'utf-8')
    return JSON.parse(raw)
  }
}

function generateMarkdownReport(data) {
  const { summary, neighborhoods, categories } = data
  const date = summary.last_updated

  let report = `# דוח עסקים עירוני — אשדוד\n`
  report += `**תאריך:** ${date}\n\n`
  report += `---\n\n`

  report += `## סיכום כללי\n\n`
  report += `| מדד | ערך |\n`
  report += `|------|------|\n`
  report += `| סה"כ עסקים | ${summary.total_businesses.toLocaleString('he-IL')} |\n`
  report += `| הכנסות כולל | ${summary.total_income} אלף ₪ |\n`
  report += `| אחוז ריקנות ממוצע | ${(summary.avg_vacancy * 100).toFixed(1)}% |\n`
  report += `| שכונות | ${summary.neighborhoods_count} |\n`
  report += `| קטגוריות | ${summary.categories_count} |\n\n`

  report += `## עסקים לפי שכונה\n\n`
  report += `| שכונה | עסקים | הכנסות (אלף ₪) | ריקנות |\n`
  report += `|-------|-------|-----------------|--------|\n`

  const sorted = [...neighborhoods].sort((a, b) => b.businesses - a.businesses)
  for (const n of sorted) {
    report += `| ${n.name} | ${n.businesses.toLocaleString('he-IL')} | ${n.income} | ${(n.vacancy * 100).toFixed(1)}% |\n`
  }

  report += `\n## עסקים לפי קטגוריה\n\n`
  report += `| קטגוריה | סה"כ עסקים |\n`
  report += `|---------|------------|\n`

  const catSorted = [...categories].sort((a, b) => b.total_count - a.total_count)
  for (const c of catSorted) {
    report += `| ${c.name} | ${c.total_count.toLocaleString('he-IL')} |\n`
  }

  report += `\n---\n\n`
  report += `**נוצר אוטומטית ע"י דשבורד עסקים אשדוד** | גרסה ${data.meta.version}\n`

  return report
}

async function main() {
  console.log('טוען נתונים...')
  const data = await loadLatestData()

  console.log('מייצר דוח...')
  const report = generateMarkdownReport(data)

  const reportsDir = resolve(rootDir, 'docs', 'reports')
  await mkdir(reportsDir, { recursive: true })

  const date = data.summary.last_updated
  const outputPath = resolve(reportsDir, `report-${date}.md`)

  await writeFile(outputPath, report, 'utf-8')
  console.log(`דוח נשמר ב: ${outputPath}`)
}

main().catch(err => {
  console.error('שגיאה:', err.message)
  process.exit(1)
})
