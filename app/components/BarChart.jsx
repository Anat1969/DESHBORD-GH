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
  return `${top.name} מובילה עם ${top.businesses.toLocaleString('he-IL')} עסקים — פי ${ratio} מ${bottom.name} (${bottom.businesses.toLocaleString('he-IL')}). פער של ${gap.toLocaleString('he-IL')} עסקים מצביע על ריכוזיות עסקית גבוהה שעלולה ליצור תלות כלכלית באזורים מסוימים. מומלץ לבחון תמריצים לפיזור עסקי`
}

export default function LineChart({ neighborhoods }) {
  const sorted = [...neighborhoods].sort((a, b) => b.businesses - a.businesses)
  const maxBiz = Math.max(...sorted.map(n => n.businesses), 1)

  // Per-point colors from shared neighborhood palette
  const pointBgColors = sorted.map(n => {
    const c = NEIGHBORHOOD_COLORS[n.id]
    return c ? c.bg : 'rgba(180, 195, 220, 0.6)'
  })
  const pointBorderColors = sorted.map(n => {
    const c = NEIGHBORHOOD_COLORS[n.id]
    return c ? c.border : 'rgba(180, 195, 220, 0.9)'
  })
  // Point radius proportional to business count — same visual weight as map markers
  const pointRadii = sorted.map(n => 5 + (n.businesses / maxBiz) * 9)

  const data = {
    labels: sorted.map(n => n.name),
    datasets: [
      {
        label: 'מספר עסקים',
        data: sorted.map(n => n.businesses),
        borderColor: 'rgba(180, 195, 220, 0.3)',
        backgroundColor: 'rgba(180, 195, 220, 0.04)',
        fill: true,
        tension: 0.4,
        pointRadius: pointRadii,
        pointHoverRadius: pointRadii.map(r => r + 3),
        pointBackgroundColor: pointBgColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        borderWidth: 1.5
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
          label: (ctx) => `${ctx.parsed.y.toLocaleString('he-IL')} עסקים`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 12 },
          color: 'rgba(180, 190, 210, 0.5)'
        },
        grid: { display: false },
        border: { color: 'rgba(255,255,255,0.04)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 11 },
          color: 'rgba(180, 190, 210, 0.35)',
          callback: (v) => v.toLocaleString('he-IL')
        },
        grid: { color: 'rgba(255,255,255,0.03)' },
        border: { display: false }
      }
    }
  }

  return (
    <>
      <p className="chart-insight large">{getInsight(neighborhoods)}</p>
      <div style={{ height: 280 }}>
        <Line data={data} options={options} />
      </div>
    </>
  )
}
