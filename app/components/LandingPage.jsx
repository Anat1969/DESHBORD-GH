export default function LandingPage({ summary, onEnter }) {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1>דשבורד עסקים עירוני</h1>
        <p className="subtitle">
          מערכת ניטור וניתוח פעילות עסקית בעיר אשדוד.
          נתונים בזמן אמת לפי שכונות, קטגוריות והכנסות —
          לקבלת החלטות מושכלת ברמה העירונית.
        </p>
        <button className="landing-btn" onClick={onEnter}>
          כניסה לדשבורד
        </button>
      </div>

      {summary && (
        <div className="landing-stats">
          <div className="landing-stat">
            <span className="landing-stat-value">
              {summary.total_businesses.toLocaleString('he-IL')}
            </span>
            <span className="landing-stat-label">עסקים פעילים</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-value">{summary.neighborhoods_count}</span>
            <span className="landing-stat-label">שכונות במעקב</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-value">{summary.total_income}</span>
            <span className="landing-stat-label">הכנסות (אלף ₪)</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-value">
              {(summary.avg_vacancy * 100).toFixed(1)}%
            </span>
            <span className="landing-stat-label">ריקנות ממוצעת</span>
          </div>
        </div>
      )}

      <div className="landing-features">
        <div className="landing-feature">
          <h3>ניתוח שכונתי</h3>
          <p>
            השוואה בין שכונות לפי נפח עסקי, הכנסות ואחוזי ריקנות.
            זיהוי אזורים חזקים ואזורים שדורשים התערבות.
          </p>
        </div>
        <div className="landing-feature">
          <h3>מגמות והתפתחות</h3>
          <p>
            מעקב אחר שינויים לאורך זמן.
            גרפים קוויים שמראים את הכיוון — צמיחה, ירידה או יציבות.
          </p>
        </div>
        <div className="landing-feature">
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
