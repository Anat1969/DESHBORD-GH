function getInsight(summary) {
  const vacancy = summary.avg_vacancy
  const businesses = summary.total_businesses

  let vacancyInsight
  if (vacancy <= 0.12) vacancyInsight = 'ריקנות נמוכה — ביקוש גבוה לשטחי מסחר, סימן לכלכלה עירונית חזקה'
  else if (vacancy <= 0.16) vacancyInsight = 'ריקנות בטווח בריא — שוק מאוזן בין היצע וביקוש. אין צורך בהתערבות מיידית'
  else if (vacancy <= 0.20) vacancyInsight = 'ריקנות מעל הממוצע — ייתכנו שכונות עם ירידה בביקוש. מומלץ לבחון את הפיזור'
  else vacancyInsight = 'ריקנות גבוהה — סימן לירידה בביקוש, ייתכן צורך בתמריצים כלכליים או התחדשות עירונית'

  return {
    businesses: businesses > 5000
      ? `ריכוז עסקי משמעותי עם פעילות ב-${summary.neighborhoods_count} שכונות. העיר מציגה בסיס עסקי רחב ומגוון`
      : 'מספר עסקים נמוך יחסית — ייתכנו שכונות שלא מיוצגות בנתונים',
    neighborhoods: summary.neighborhoods_count >= 6
      ? 'כיסוי גיאוגרפי רחב — הנתונים משקפים את מרבית אזורי העיר ומאפשרים השוואה מהימנה'
      : 'כיסוי חלקי — חלק מהשכונות אינן מיוצגות. התובנות עלולות לא לשקף את התמונה המלאה',
    income: `ממוצע ${Math.round(summary.total_income / summary.neighborhoods_count)} אלף ₪ לשכונה. פערי הכנסות בין שכונות יכולים להעיד על אי-שוויון כלכלי`,
    vacancy: vacancyInsight
  }
}

export default function KPICards({ summary }) {
  const insights = getInsight(summary)
  const vacancyColor = summary.avg_vacancy > 0.18 ? 'var(--color-risk)' : 'var(--color-growth)'

  const cards = [
    {
      label: 'סה"כ עסקים',
      value: summary.total_businesses.toLocaleString('he-IL'),
      unit: '',
      color: 'var(--color-neutral)',
      insight: insights.businesses
    },
    {
      label: 'שכונות במעקב',
      value: summary.neighborhoods_count,
      unit: '',
      color: 'var(--color-info)',
      insight: insights.neighborhoods
    },
    {
      label: 'הכנסות כולל',
      value: summary.total_income.toLocaleString('he-IL'),
      unit: 'אלף ₪',
      color: 'var(--color-growth)',
      insight: insights.income
    },
    {
      label: 'ריקנות ממוצעת',
      value: (summary.avg_vacancy * 100).toFixed(1),
      unit: '%',
      color: vacancyColor,
      insight: insights.vacancy
    }
  ]

  return (
    <div className="kpi-row">
      {cards.map((card) => (
        <div key={card.label} className="kpi-card">
          <span className="kpi-label">{card.label}</span>
          <span className="kpi-value" style={{ color: card.color }}>
            {card.value}
            {card.unit && <span className="kpi-unit">{card.unit}</span>}
          </span>
          <span className="kpi-insight">{card.insight}</span>
        </div>
      ))}
    </div>
  )
}
