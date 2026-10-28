import { motion } from 'framer-motion'
import useCountUp from '../hooks/useCountUp'
import AnimatedBackground from './AnimatedBackground'

function AnimatedStat({ value, label, suffix = '', delay = 0 }) {
  const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''))
  const isDecimal = String(value).includes('.')
  const animated = useCountUp(numValue, 1400, isDecimal ? 1 : 0)
  const display = isNaN(animated) ? value : animated.toLocaleString('he-IL')

  return (
    <motion.div
      className="landing-stat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="landing-stat-value">
        {display}{suffix}
      </span>
      <span className="landing-stat-label">{label}</span>
    </motion.div>
  )
}

export default function LandingPage({ summary, onEnter }) {
  return (
    <div className="landing-page">
      <AnimatedBackground />
      <header className="landing-top-bar">
        <span className="landing-app-name">דשבורד עסקים — אשדוד</span>
        <ai-menu></ai-menu>
      </header>
      <motion.div
        className="landing-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1>דשבורד עסקים עירוני</h1>
        <p className="subtitle">
          סקירה וניתוח פעילות עסקית בעיר אשדוד.
          נתונים לפי שכונות, קטגוריות והכנסות —
          לקבלת תמונת מצב ברמה העירונית.
        </p>
        <motion.button
          className="landing-btn"
          onClick={onEnter}
          whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(212,148,10,0.15)' }}
          whileTap={{ y: 0 }}
        >
          כניסה לדשבורד
        </motion.button>
      </motion.div>

      {summary && (
        <div className="landing-stats">
          <AnimatedStat value={summary.total_businesses} label="עסקים פעילים" delay={0} />
          <AnimatedStat value={summary.neighborhoods_count} label="שכונות במעקב" delay={1} />
          <AnimatedStat value={summary.total_income} label="הכנסות (מלש״ח)" delay={2} />
          <AnimatedStat value={(summary.avg_vacancy * 100).toFixed(1)} label="ריקנות ממוצעת" suffix="%" delay={3} />
        </div>
      )}

      <div className="landing-features">
        {[
          {
            title: 'חזון',
            desc: 'תמונת מצב עסקית שלמה של העיר אשדוד — במקום אחד, בשפה ברורה.'
          },
          {
            title: 'כלים',
            desc: 'גרפים, מפה אינטראקטיבית וכרטיסי מדד. סינון לפי שכונה וענף פעילות.'
          },
          {
            title: 'תוצאות',
            desc: 'השוואה בין שכונות, זיהוי ריכוזיות ענפית, ומדדי ריקנות לפי אזור.'
          }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            className="landing-feature"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
