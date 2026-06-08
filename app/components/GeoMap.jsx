import { useState } from 'react'

const CITY_NEIGHBORHOODS = {
  north: { cx: 310, cy: 90, label: 'צפון' },
  merkaz: { cx: 250, cy: 200, label: 'מרכז' },
  west: { cx: 150, cy: 240, label: 'רובע י"ז' },
  industrial: { cx: 380, cy: 180, label: 'תעשייה' },
  south: { cx: 220, cy: 320, label: 'דרום' },
  marina: { cx: 120, cy: 370, label: 'מרינה' }
}

const ROADS = [
  { x1: 100, y1: 50, x2: 420, y2: 50 },
  { x1: 100, y1: 150, x2: 420, y2: 150 },
  { x1: 100, y1: 280, x2: 420, y2: 280 },
  { x1: 150, y1: 20, x2: 150, y2: 430 },
  { x1: 300, y1: 20, x2: 300, y2: 430 },
  { x1: 50, y1: 200, x2: 450, y2: 200 },
]

function getColor(vacancy) {
  if (vacancy <= 0.12) return 'rgba(52, 211, 153, 0.7)'
  if (vacancy <= 0.15) return 'rgba(96, 165, 250, 0.6)'
  if (vacancy <= 0.18) return 'rgba(251, 191, 36, 0.55)'
  if (vacancy <= 0.20) return 'rgba(248, 113, 113, 0.5)'
  return 'rgba(248, 113, 113, 0.7)'
}

function getRadius(businesses, max) {
  const min = 22
  const maxR = 48
  return min + (businesses / max) * (maxR - min)
}

function getInsight(neighborhoods) {
  if (!neighborhoods.length) return ''
  const highVacancy = neighborhoods.filter(n => n.vacancy > 0.17)
  const lowVacancy = neighborhoods.filter(n => n.vacancy <= 0.12)
  const parts = []
  if (lowVacancy.length > 0) {
    parts.push(`${lowVacancy.map(n => n.name).join(' ו')} — ריקנות נמוכה, ביקוש גבוה`)
  }
  if (highVacancy.length > 0) {
    parts.push(`${highVacancy.map(n => n.name).join(' ו')} — ריקנות מוגברת, דורש תשומת לב`)
  }
  return parts.join('. ') + '.'
}

export default function GeoMap({ neighborhoods }) {
  const [tooltip, setTooltip] = useState(null)

  const neighborhoodMap = {}
  neighborhoods.forEach(n => { neighborhoodMap[n.id] = n })
  const maxBiz = Math.max(...neighborhoods.map(n => n.businesses), 1)

  return (
    <>
      <p className="map-insight">{getInsight(neighborhoods)}</p>
      <div className="geo-map-wrapper">
        <div className="geo-map-container">
          <svg viewBox="0 0 500 450" className="geo-map-svg">
            {/* Sea on the left */}
            <rect x="0" y="0" width="70" height="450" fill="rgba(96, 165, 250, 0.06)" />
            <text x="35" y="225" textAnchor="middle" fill="rgba(96,165,250,0.25)"
              style={{ fontSize: '11px', fontFamily: 'Rubik', fontWeight: 500 }}
              transform="rotate(-90, 35, 225)">
              ים תיכון
            </text>

            {/* City grid roads */}
            {ROADS.map((r, i) => (
              <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* City outline */}
            <path
              d="M 80 30 Q 420 30, 440 100 Q 460 200, 430 300 Q 400 400, 250 430 Q 100 430, 70 350 Q 50 250, 80 30 Z"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            {/* Neighborhood bubbles */}
            {Object.entries(CITY_NEIGHBORHOODS).map(([id, pos]) => {
              const n = neighborhoodMap[id]
              if (!n) return null
              const r = getRadius(n.businesses, maxBiz)
              const fill = getColor(n.vacancy)

              return (
                <g key={id}
                  className="neighborhood-marker"
                  opacity={0.9}
                  onMouseEnter={(e) => setTooltip({
                    x: e.clientX, y: e.clientY,
                    name: n.name, businesses: n.businesses,
                    income: n.income, vacancy: n.vacancy
                  })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <circle cx={pos.cx} cy={pos.cy} r={r}
                    fill={fill} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <text x={pos.cx} y={pos.cy - 6}
                    textAnchor="middle" className="marker-label">
                    {pos.label}
                  </text>
                  <text x={pos.cx} y={pos.cy + 10}
                    textAnchor="middle" className="marker-value">
                    {n.businesses.toLocaleString('he-IL')}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {tooltip && (
          <div className="map-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 60 }}>
            <strong>{tooltip.name}</strong>
            <div>{tooltip.businesses.toLocaleString('he-IL')} עסקים</div>
            <div>הכנסות: {tooltip.income} אלף ₪</div>
            <div>ריקנות: {(tooltip.vacancy * 100).toFixed(1)}%</div>
          </div>
        )}

        <div className="map-legend">
          <span className="map-legend-title">ריקנות:</span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(52, 211, 153, 0.7)' }}></span>
            נמוכה
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(96, 165, 250, 0.6)' }}></span>
            בינונית
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(251, 191, 36, 0.55)' }}></span>
            מוגברת
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(248, 113, 113, 0.6)' }}></span>
            גבוהה
          </span>
        </div>
      </div>
    </>
  )
}
