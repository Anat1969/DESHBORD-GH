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
  return `${sorted[0].name} מהווה ${topPct}% מכלל העסקים. יחד עם ${sorted[1].name}, שני הענפים מרכזים ${topTwoPct}% מהפעילות — פיזור עסקי שדורש גיוון.`
}

const DARK_COLORS = [
  'rgba(96, 165, 250, 0.75)',
  'rgba(52, 211, 153, 0.75)',
  'rgba(167, 139, 250, 0.75)',
  'rgba(251, 191, 36, 0.75)',
  'rgba(248, 113, 113, 0.75)'
]

export default function DoughnutChart({ categories }) {
  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.total_count),
        backgroundColor: DARK_COLORS.slice(0, categories.length),
        borderWidth: 0,
        hoverOffset: 6,
        hoverBorderWidth: 2,
        hoverBorderColor: 'rgba(255,255,255,0.2)'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: {
          font: { family: 'Rubik, sans-serif', size: 12 },
          color: '#8b8fa3',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl',
        backgroundColor: '#1a1d27',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleFont: { family: 'Rubik, sans-serif' },
        bodyFont: { family: 'Rubik, sans-serif' },
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
      <p className="chart-insight">{getInsight(categories)}</p>
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
