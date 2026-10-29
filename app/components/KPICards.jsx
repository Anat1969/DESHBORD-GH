import { motion } from 'framer-motion'
import useCountUp from '../hooks/useCountUp'
import { ProseText } from '../utils/prose.jsx'

function getInsight(summary) {
  const vacancy = summary.avg_vacancy
  const businesses = summary.total_businesses

  let vacancyInsight
  if (vacancy <= 0.12) vacancyInsight = 'ריקנות נמוכה — ביקוש גבוה לשטחי מסחר'
  else if (vacancy <= 0.16) vacancyInsight = 'ריקנות בטווח סביר — שוק מאוזן בין היצע לביקוש'
  else if (vacancy <= 0.20) vacancyInsight = 'ריקנות מעל הממוצע — ייתכנו שכונות עם ירידה בביקוש'
  else vacancyInsight = 'ריקנות גבוהה — ירידה בביקוש באזורים מסוימים'

  return {
    businesses: businesses > 5000
      ? `ריכוז של ${businesses.toLocaleString('he-IL')} עסקים ב-${summary.neighborhoods_count} שכונות`
      : `${businesses.toLocaleString('he-IL')} עסקים — ייתכנו שכונות שלא מיוצגות בנתונים`,
    neighborhoods: summary.neighborhoods_count >= 6
      ? `${summary.neighborhoods_count} שכונות — כיסוי גיאוגרפי רחב`
      : `${summary.neighborhoods_count} שכונות — כיסוי חלקי`,
    income: `ממוצע ${Math.round(summary.total_income / summary.neighborhoods_count)} מלש״ח לשכונה`,
    vacancy: vacancyInsight
  }
}

/* Distinct color per KPI card */
const CARD_COLORS = {
  businesses: '#3b82f6',
  neighborhoods: '#8b5cf6',
  income: '#10b981',
  vacancy_ok: '#10b981',
  vacancy_warn: '#ef4444'
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
      unit: 'מלש״ח',
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
          whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.35), 0 12px 40px rgba(0,0,0,0.25)' }}
          whileTap={{ y: 0 }}
        >
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
          <ProseText text={card.insight} className="kpi-insight" />
        </motion.div>
      ))}
    </div>
  )
}
