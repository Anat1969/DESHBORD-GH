import useCountUp from '../hooks/useCountUp'
import AnimatedBackground from './AnimatedBackground'

function AnimatedStat({ value, label, suffix = '' }) {
  const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''))
  const isDecimal = String(value).includes('.')
  const animated = useCountUp(numValue, 1400, isDecimal ? 1 : 0)
  const display = isNaN(animated) ? value : animated.toLocaleString('he-IL')

  return (
    <div className="landing-stat">
      <span className="landing-stat-value">
        {display}{suffix}
      </span>
      <span className="landing-stat-label">{label}</span>
    </div>
  )
}

export default function LandingPage({ summary, onEnter }) {
  return (
    <div className="landing-page">
      <AnimatedBackground />
      <div className="landing-hero">
        <h1>דשבורד עסקים עירוני</h1>
        <p className="subtitle">
          מערכת ניטור וניתוח פעילות עסקית בעיר אשדוד.
          נתונים בזמן אמת לפי שכונות, קטגוריות והכנסות —
          לקבלת החלטות מושכלת ברמה העירונית.
        </p>
        <button className="landing-btn" onClick={onEnter}>
          <span>כניסה לדשבורד</span>
          <span style={{ fontSize: '1.2rem' }}>←</span>
        </button>
      </div>

      {summary && (
        <div className="landing-stats">
          <AnimatedStat
            value={summary.total_businesses}
            label="עסקים פעילים"
          />
          <AnimatedStat
            value={summary.neighborhoods_count}
            label="שכונות במעקב"
          />
          <AnimatedStat
            value={summary.total_income}
            label="הכנסות (אלף ₪)"
          />
          <AnimatedStat
            value={(summary.avg_vacancy * 100).toFixed(1)}
            label="ריקנות ממוצעת"
            suffix="%"
          />
        </div>
      )}

      <div className="landing-features">
        <div className="landing-feature">
          <span className="feature-icon">📊</span>
          <h3>ניתוח שכונתי</h3>
          <p>
            השוואה בין שכונות לפי נפח עסקי, הכנסות ואחוזי ריקנות.
            זיהוי אזורים חזקים ואזורים שדורשים התערבות.
          </p>
        </div>
        <div className="landing-feature">
          <span className="feature-icon">📈</span>
          <h3>מגמות והתפתחות</h3>
          <p>
            מעקב אחר שינויים לאורך זמן.
            גרפים שמראים את הכיוון — צמיחה, ירידה או יציבות.
          </p>
        </div>
        <div className="landing-feature">
          <span className="feature-icon">💡</span>
          <h3>תובנות לפעולה</h3>
          <p>
            כל נתון מלווה בפרשנות.
            המערכת מזהה דפוסים ומציפה הזדמנויות וסיכונים.
          </p>
        </div>
      </div>
    </div>
  )
}
