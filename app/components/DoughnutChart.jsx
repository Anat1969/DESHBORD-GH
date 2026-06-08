import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DoughnutChart({ categories }) {
  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.total_count),
        backgroundColor: categories.map(c => c.color),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: {
          font: { family: 'Rubik, sans-serif', size: 13 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 12
        }
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl',
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
    <div style={{ height: 300, position: 'relative' }}>
      <Doughnut data={data} options={options} />
      <div className="doughnut-center">
        <span className="doughnut-center-value">{totalBusinesses.toLocaleString('he-IL')}</span>
        <span className="doughnut-center-label">סה"כ</span>
      </div>
    </div>
  )
}
