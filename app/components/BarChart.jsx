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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function getInsight(neighborhoods) {
  if (!neighborhoods.length) return ''
  const sorted = [...neighborhoods].sort((a, b) => b.businesses - a.businesses)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  const gap = top.businesses - bottom.businesses
  return `${top.name} מובילה עם ${top.businesses.toLocaleString('he-IL')} עסקים. הפער מ${bottom.name} (${bottom.businesses.toLocaleString('he-IL')}) עומד על ${gap.toLocaleString('he-IL')} — מצביע על ריכוזיות עסקית גבוהה במרכז העיר.`
}

export default function LineChart({ neighborhoods }) {
  const sorted = [...neighborhoods].sort((a, b) => b.businesses - a.businesses)

  const data = {
    labels: sorted.map(n => n.name),
    datasets: [
      {
        label: 'מספר עסקים',
        data: sorted.map(n => n.businesses),
        borderColor: 'rgba(96, 165, 250, 0.8)',
        backgroundColor: 'rgba(96, 165, 250, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(96, 165, 250, 0.9)',
        pointBorderColor: '#1a1d27',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        borderWidth: 2
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
        backgroundColor: '#1a1d27',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleFont: { family: 'Rubik, sans-serif' },
        bodyFont: { family: 'Rubik, sans-serif' },
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString('he-IL')} עסקים`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 12 },
          color: '#8b8fa3'
        },
        grid: { display: false },
        border: { color: 'rgba(255,255,255,0.06)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 11 },
          color: '#5c6070',
          callback: (v) => v.toLocaleString('he-IL')
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { display: false }
      }
    }
  }

  return (
    <>
      <p className="chart-insight">{getInsight(neighborhoods)}</p>
      <div style={{ height: 280 }}>
        <Line data={data} options={options} />
      </div>
    </>
  )
}
