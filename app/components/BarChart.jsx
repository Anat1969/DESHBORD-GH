import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import NEIGHBORHOOD_COLORS from '../utils/neighborhoodColors'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function getInsight(neighborhoods) {
  if (!neighborhoods.length) return ''
  const sorted = [...neighborhoods].sort((a, b) => b.businesses - a.businesses)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  const gap = top.businesses - bottom.businesses
  const ratio = (top.businesses / bottom.businesses).toFixed(1)
  return `${top.name} מובילה עם ${top.businesses.toLocaleString('he-IL')} עסקים — פי ${ratio} מ${bottom.name} (${bottom.businesses.toLocaleString('he-IL')}). פער של ${gap.toLocaleString('he-IL')} עסקים מצביע על ריכוזיות עסקית גבוהה שעלולה ליצור תלות כלכלית באזורים מסוימים`
}

export default function LineChart({ neighborhoods }) {
  const sorted = [...neighborhoods].sort((a, b) => b.businesses - a.businesses)
  const maxBiz = Math.max(...sorted.map(n => n.businesses), 1)

  const pointBgColors = sorted.map(n => {
    const c = NEIGHBORHOOD_COLORS[n.id]
    return c ? c.bg : 'rgba(180, 195, 220, 0.6)'
  })
  const pointBorderColors = sorted.map(n => {
    const c = NEIGHBORHOOD_COLORS[n.id]
    return c ? c.border : 'rgba(180, 195, 220, 0.9)'
  })
  const pointRadii = sorted.map(n => 5 + (n.businesses / maxBiz) * 9)

  const data = {
    labels: sorted.map(n => n.name),
    datasets: [
      {
        label: 'מספר עסקים',
        data: sorted.map(n => n.businesses),
        borderColor: 'rgba(100, 180, 255, 0.25)',
        backgroundColor: (ctx) => {
          if (!ctx.chart.chartArea) return 'rgba(100, 180, 255, 0.04)'
          const gradient = ctx.chart.ctx.createLinearGradient(0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom)
          gradient.addColorStop(0, 'rgba(100, 180, 255, 0.12)')
          gradient.addColorStop(1, 'rgba(100, 180, 255, 0)')
          return gradient
        },
        fill: true,
        tension: 0.45,
        pointRadius: pointRadii,
        pointHoverRadius: pointRadii.map(r => r + 4),
        pointBackgroundColor: pointBgColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        borderWidth: 2,
        pointHitRadius: 20
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
      delay: (ctx) => ctx.dataIndex * 100
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        textDirection: 'rtl',
        backgroundColor: 'rgba(16, 18, 28, 0.95)',
        borderColor: 'rgba(100, 180, 255, 0.12)',
        borderWidth: 1,
        titleFont: { family: 'Rubik, sans-serif', size: 13, weight: '500' },
        bodyFont: { family: 'Rubik, sans-serif', size: 12 },
        padding: 14,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (ctx) => `${ctx.parsed.y.toLocaleString('he-IL')} עסקים`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 12 },
          color: 'rgba(180, 190, 210, 0.45)'
        },
        grid: { display: false },
        border: { color: 'rgba(255,255,255,0.04)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 11 },
          color: 'rgba(180, 190, 210, 0.3)',
          callback: (v) => v.toLocaleString('he-IL')
        },
        grid: { color: 'rgba(255,255,255,0.025)' },
        border: { display: false }
      }
    }
  }

  return (
    <>
      <p className="chart-insight large">{getInsight(neighborhoods)}</p>
      <div style={{ height: 300 }}>
        <Line data={data} options={options} />
      </div>
    </>
  )
}
