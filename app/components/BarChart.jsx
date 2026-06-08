import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BarChart({ neighborhoods }) {
  const data = {
    labels: neighborhoods.map(n => n.name),
    datasets: [
      {
        label: 'מספר עסקים',
        data: neighborhoods.map(n => n.businesses),
        backgroundColor: [
          '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#4895ef'
        ],
        borderRadius: 6,
        borderSkipped: false
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
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString('he-IL')} עסקים`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { family: 'Rubik, sans-serif', size: 13 }
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: 'Rubik, sans-serif' },
          callback: (v) => v.toLocaleString('he-IL')
        },
        grid: { color: '#f0f0f0' }
      }
    }
  }

  return (
    <div style={{ height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  )
}
