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

const STEPS = [
  {
    num: '1',
    title: 'תמונת מצב',
    desc: 'כמה עסקים פעילים, כמה הכנסות, כמה ריקנות — המספרים הגדולים שמסכמים את העיר.'
  },
  {
    num: '2',
    title: 'השוואת רובעים',
    desc: 'איפה יש ריכוז עסקי ואיפה יש חולשה. הפערים בין הרובעים הם נקודת המוצא לתכנון.'
  },
  {
    num: '3',
    title: 'הרכב ענפי',
    desc: 'האם רובע מסוים תלוי בענף אחד? גיוון ענפי מגן על הכלכלה המקומית.'
  },
  {
    num: '4',
    title: 'מפה',
    desc: 'תפוסה גיאוגרפית — לראות את הנתונים על פני השטח ולזהות אזורים שדורשים תשומת לב.'
  }
]

export default function LandingPage({ summary, onEnter }) {
  return (
    <div className="landing-page">
      <AnimatedBackground />
      <header className="landing-top-bar">
        <span className="landing-app-name">דשבורד עסקים — אשדוד</span>
        <ai-menu></ai-menu>
      </header>

      {/* Hero — Vision */}
      <motion.div
        className="landing-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1>תכנון מסחר עירוני</h1>
        <p className="subtitle">
          הכנסות העיר ממסחר תלויות בתכנון נכון של הרובעים.
        </p>
        <p className="subtitle-secondary">
          הכלי הזה עוזר לך להבין את המצב העסקי בכל רובע,
          לזהות פערים בין שכונות,
          ולשאול את השאלות הנכונות לפני שמתכננים.
        </p>
      </motion.div>

      {/* Current numbers — context */}
      {summary && (
        <div className="landing-stats">
          <AnimatedStat value={summary.total_businesses} label="עסקים פעילים" delay={0} />
          <AnimatedStat value={summary.neighborhoods_count} label="רובעים" delay={1} />
          <AnimatedStat value={summary.total_income} label="מלש״ח הכנסות" delay={2} />
          <AnimatedStat value={(summary.avg_vacancy * 100).toFixed(1)} label="ריקנות ממוצעת" suffix="%" delay={3} />
        </div>
      )}

      {/* How it works — 4 steps */}
      <motion.div
        className="landing-how"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2>מה תמצאו בדשבורד</h2>
        <div className="landing-steps">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className="landing-step"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="landing-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.button
          className="landing-btn"
          onClick={onEnter}
          whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(212,148,10,0.15)' }}
          whileTap={{ y: 0 }}
        >
          בואו נתחיל
        </motion.button>
        <p className="landing-note">נתוני דוגמה להדגמה — ניתן להעלות קובץ Excel עם נתונים אמיתיים</p>
      </motion.div>
    </div>
  )
}
