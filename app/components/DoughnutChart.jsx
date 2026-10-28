import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import useCountUp from '../hooks/useCountUp'

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

/* Warm amber/copper palette for doughnut slices */
const WARM_COLORS = [
  'rgba(212, 148, 10, 0.65)',
  'rgba(184, 115, 51, 0.6)',
  'rgba(232, 184, 74, 0.55)',
  'rgba(160, 130, 80, 0.55)',
  'rgba(194, 114, 32, 0.5)'
]

const WARM_HOVER = [
  'rgba(212, 148, 10, 0.85)',
  'rgba(184, 115, 51, 0.8)',
  'rgba(232, 184, 74, 0.75)',
  'rgba(160, 130, 80, 0.75)',
  'rgba(194, 114, 32, 0.7)'
]

export default function DoughnutChart({ categories }) {
  const totalBusinesses = categories.reduce((sum, c) => sum + c.total_count, 0)
  const animatedTotal = useCountUp(totalBusinesses, 1200)

  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.total_count),
        backgroundColor: WARM_COLORS.slice(0, categories.length),
        hoverBackgroundColor: WARM_HOVER.slice(0, categories.length),
        borderWidth: 0,
        hoverOffset: 8,
        hoverBorderWidth: 2,
        hoverBorderColor: 'rgba(232, 228, 220, 0.2)',
        spacing: 3,
        borderRadius: 0
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: {
          font: { family: 'IBM Plex Sans Hebrew, sans-serif', size: 12 },
          color: 'rgba(154, 147, 134, 0.6)',
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl',
        backgroundColor: 'rgba(12, 14, 21, 0.96)',
        borderColor: 'rgba(212, 148, 10, 0.15)',
        borderWidth: 1,
        titleFont: { family: 'IBM Plex Sans Hebrew, sans-serif', size: 13, weight: '500' },
        bodyFont: { family: 'IBM Plex Sans Hebrew, sans-serif', size: 12 },
        padding: 14,
        cornerRadius: 0,
        displayColors: true,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return ` ${ctx.label}: ${ctx.parsed.toLocaleString('he-IL')} (${pct}%)`
          }
        }
      }
    }
  }

  return (
    <>
      <p className="chart-insight large">{getInsight(categories)}</p>
      <div style={{ height: 300, position: 'relative' }}>
        <Doughnut data={data} options={options} />
        <div className="doughnut-center">
          <span className="doughnut-center-value">
            {animatedTotal.toLocaleString('he-IL')}
          </span>
          <span className="doughnut-center-label">סה"כ</span>
        </div>
      </div>
    </>
  )
}
