import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function getInsight(categories) {
  if (!categories.length) return ''
  const sorted = [...categories].sort((a, b) => b.total_count - a.total_count)
  const total = sorted.reduce((s, c) => s + c.total_count, 0)
  const topPct = ((sorted[0].total_count / total) * 100).toFixed(0)
  const topTwo = sorted.slice(0, 2)
  const topTwoPct = (((topTwo[0].total_count + topTwo[1].total_count) / total) * 100).toFixed(0)
  const smallest = sorted[sorted.length - 1]
  const smallPct = ((smallest.total_count / total) * 100).toFixed(0)
  return `${sorted[0].name} מהווה ${topPct}% מכלל העסקים. יחד עם ${sorted[1].name}, שני הענפים מרכזים ${topTwoPct}% מהפעילות העסקית. ${smallest.name} מייצג רק ${smallPct}% — ריכוזיות זו יוצרת פגיעות כלכלית ומומלץ לעודד גיוון ענפי`
}

const SILVER_COLORS = [
  'rgba(170, 190, 220, 0.6)',
  'rgba(160, 210, 190, 0.55)',
  'rgba(190, 175, 220, 0.55)',
  'rgba(210, 200, 160, 0.55)',
  'rgba(210, 170, 170, 0.5)'
]

export default function DoughnutChart({ categories }) {
  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.total_count),
        backgroundColor: SILVER_COLORS.slice(0, categories.length),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        hoverOffset: 6,
        hoverBorderWidth: 2,
        hoverBorderColor: 'rgba(255,255,255,0.2)'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: {
          font: { family: 'Rubik, sans-serif', size: 12 },
          color: 'rgba(180, 190, 210, 0.5)',
          padding: 18,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl',
        backgroundColor: 'rgba(26, 29, 39, 0.95)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleFont: { family: 'Rubik, sans-serif', size: 13 },
        bodyFont: { family: 'Rubik, sans-serif', size: 12 },
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return `${ctx.label}: ${ctx.parsed.toLocaleString('he-IL')} (${pct}%)`
          }
        }
      }
    }
  }

  const totalBusinesses = categories.reduce((sum, c) => sum + c.total_count, 0)

  return (
    <>
      <p className="chart-insight large">{getInsight(categories)}</p>
      <div style={{ height: 280, position: 'relative' }}>
        <Doughnut data={data} options={options} />
        <div className="doughnut-center">
          <span className="doughnut-center-value">{totalBusinesses.toLocaleString('he-IL')}</span>
          <span className="doughnut-center-label">סה"כ</span>
        </div>
      </div>
    </>
  )
}
