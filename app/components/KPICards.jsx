export default function KPICards({ summary }) {
  const cards = [
    {
      label: 'סה"כ עסקים',
      value: summary.total_businesses.toLocaleString('he-IL'),
      unit: '',
      color: '#4361ee'
    },
    {
      label: 'שכונות פעילות',
      value: summary.neighborhoods_count,
      unit: '',
      color: '#3a0ca3'
    },
    {
      label: 'הכנסות כולל',
      value: summary.total_income.toLocaleString('he-IL'),
      unit: 'אלף ₪',
      color: '#7209b7'
    },
    {
      label: 'אחוז ריקנות',
      value: (summary.avg_vacancy * 100).toFixed(1),
      unit: '%',
      color: summary.avg_vacancy > 0.18 ? '#e63946' : '#2a9d8f'
    }
  ]

  return (
    <div className="kpi-row">
      {cards.map((card) => (
        <div key={card.label} className="kpi-card" style={{ borderTopColor: card.color }}>
          <span className="kpi-label">{card.label}</span>
          <span className="kpi-value" style={{ color: card.color }}>
            {card.value}
            {card.unit && <span className="kpi-unit">{card.unit}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
