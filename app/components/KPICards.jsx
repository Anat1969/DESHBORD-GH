import { motion } from 'framer-motion'
import useCountUp from '../hooks/useCountUp'

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

/* Warm amber color palette for KPI cards */
const CARD_COLORS = {
  businesses: 'rgba(212, 180, 120, 0.75)',
  neighborhoods: 'rgba(184, 160, 110, 0.7)',
  income: '#7ec88a',
  vacancy_ok: '#7ec88a',
  vacancy_warn: '#d47070'
}

function AnimatedValue({ value, color, unit, decimals = 0 }) {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  const animated = useCountUp(numValue, 1000, decimals)
  const display = isNaN(animated) ? value : animated.toLocaleString('he-IL')

  return (
    <span className="kpi-value" style={{ color }}>
      {display}
      {unit && <span className="kpi-unit">{unit}</span>}
    </span>
  )
}

export default function KPICards({ summary }) {
  const insights = getInsight(summary)
  const vacancyColor = summary.avg_vacancy > 0.18 ? CARD_COLORS.vacancy_warn : CARD_COLORS.vacancy_ok

  const cards = [
    {
      label: 'סה"כ עסקים',
      value: summary.total_businesses,
      unit: '',
      color: CARD_COLORS.businesses,
      insight: insights.businesses,
      progress: Math.min(summary.total_businesses / 8000, 1)
    },
    {
      label: 'שכונות במעקב',
      value: summary.neighborhoods_count,
      unit: '',
      color: CARD_COLORS.neighborhoods,
      insight: insights.neighborhoods,
      progress: summary.neighborhoods_count / 10
    },
    {
      label: 'הכנסות כולל',
      value: summary.total_income,
      unit: 'אלף ₪',
      color: CARD_COLORS.income,
      insight: insights.income,
      progress: Math.min(summary.total_income / 600, 1)
    },
    {
      label: 'ריקנות ממוצעת',
      value: (summary.avg_vacancy * 100).toFixed(1),
      unit: '%',
      color: vacancyColor,
      insight: insights.vacancy,
      progress: summary.avg_vacancy,
      decimals: 1
    }
  ]

  return (
    <div className="kpi-row">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="kpi-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.35), 0 0 60px rgba(212,148,10,0.06)' }}
          whileTap={{ y: 0 }}
        >
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '3px', background: card.color, opacity: 0.5
          }} />
          <div className="kpi-header">
            <span className="kpi-label">{card.label}</span>
          </div>
          <AnimatedValue
            value={card.value}
            color={card.color}
            unit={card.unit}
            decimals={card.decimals || 0}
          />
          <div className="kpi-progress">
            <div
              className="kpi-progress-bar"
              style={{
                width: `${Math.round(card.progress * 100)}%`,
                background: card.color
              }}
            />
          </div>
          <span className="kpi-insight">{card.insight}</span>
        </motion.div>
      ))}
    </div>
  )
}
