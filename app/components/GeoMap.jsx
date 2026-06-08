import { useState } from 'react'

const ASHDOD_CENTER = { lat: 31.804, lng: 34.655 }

const NEIGHBORHOODS = {
  north:      { x: 58, y: 22, label: 'צפון העיר' },
  merkaz:     { x: 50, y: 42, label: 'מרכז עיר' },
  west:       { x: 33, y: 50, label: 'רובע י"ז' },
  industrial: { x: 72, y: 35, label: 'אזור תעשייה' },
  south:      { x: 48, y: 65, label: 'דרום העיר' },
  marina:     { x: 28, y: 72, label: 'מרינה / חוף' }
}

function getColor(vacancy) {
  if (vacancy <= 0.12) return 'rgba(160, 220, 190, 0.55)'
  if (vacancy <= 0.15) return 'rgba(170, 190, 220, 0.5)'
  if (vacancy <= 0.18) return 'rgba(220, 200, 150, 0.5)'
  if (vacancy <= 0.20) return 'rgba(220, 170, 150, 0.5)'
  return 'rgba(210, 140, 140, 0.55)'
}

function getBorderColor(vacancy) {
  if (vacancy <= 0.12) return 'rgba(160, 220, 190, 0.8)'
  if (vacancy <= 0.15) return 'rgba(170, 190, 220, 0.7)'
  if (vacancy <= 0.18) return 'rgba(220, 200, 150, 0.7)'
  if (vacancy <= 0.20) return 'rgba(220, 170, 150, 0.7)'
  return 'rgba(210, 140, 140, 0.8)'
}

function getRadius(businesses, max) {
  return 18 + (businesses / max) * 30
}

function getInsight(neighborhoods) {
  if (!neighborhoods.length) return ''
  const highVacancy = neighborhoods.filter(n => n.vacancy > 0.17)
  const lowVacancy = neighborhoods.filter(n => n.vacancy <= 0.12)
  const parts = []
  if (lowVacancy.length > 0) {
    parts.push(`${lowVacancy.map(n => n.name).join(' ו')} מציגות ריקנות נמוכה, מה שמעיד על ביקוש גבוה לשטחי מסחר ופעילות עסקית ערה`)
  }
  if (highVacancy.length > 0) {
    parts.push(`${highVacancy.map(n => n.name).join(' ו')} מציגות ריקנות מוגברת שעשויה להצביע על מגמת ירידה בביקוש או צורך בהתחדשות עירונית`)
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
      <p className="chart-insight large">{getInsight(neighborhoods)}</p>
      <div className="geo-map-wrapper">
        <div className="geo-map-container">
          {/* OpenStreetMap tile grid as background */}
          <div className="map-tiles">
            {[
              [4886, 3389], [4887, 3389], [4888, 3389],
              [4886, 3390], [4887, 3390], [4888, 3390],
              [4886, 3391], [4887, 3391], [4888, 3391]
            ].map(([x, y], i) => (
              <img key={i}
                src={`https://tile.openstreetmap.org/13/${x}/${y}.png`}
                alt=""
                className="map-tile"
                draggable={false}
              />
            ))}
          </div>
          <div className="map-overlay">
            <svg viewBox="0 0 100 100" className="map-svg-overlay" preserveAspectRatio="none">
              {Object.entries(NEIGHBORHOODS).map(([id, pos]) => {
                const n = neighborhoodMap[id]
                if (!n) return null
                const r = getRadius(n.businesses, maxBiz) / 5
                const fill = getColor(n.vacancy)
                const stroke = getBorderColor(n.vacancy)

                return (
                  <g key={id}
                    className="neighborhood-marker"
                    onMouseEnter={(e) => setTooltip({
                      x: e.clientX, y: e.clientY,
                      name: n.name, businesses: n.businesses,
                      income: n.income, vacancy: n.vacancy
                    })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <circle cx={pos.x} cy={pos.y} r={r}
                      fill={fill} stroke={stroke} strokeWidth="0.4" />
                    <text x={pos.x} y={pos.y - r - 1.5}
                      textAnchor="middle" className="marker-label">
                      {pos.label}
                    </text>
                    <text x={pos.x} y={pos.y + 1}
                      textAnchor="middle" className="marker-count">
                      {n.businesses.toLocaleString('he-IL')}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {tooltip && (
          <div className="map-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y - 70 }}>
            <strong>{tooltip.name}</strong>
            <div>{tooltip.businesses.toLocaleString('he-IL')} עסקים</div>
            <div>הכנסות: {tooltip.income} אלף ₪</div>
            <div>ריקנות: {(tooltip.vacancy * 100).toFixed(1)}%</div>
          </div>
        )}

        <div className="map-legend">
          <span className="map-legend-title">רמת ריקנות:</span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(160, 220, 190, 0.6)' }}></span>נמוכה
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(170, 190, 220, 0.55)' }}></span>בינונית
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(220, 200, 150, 0.55)' }}></span>מוגברת
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: 'rgba(210, 140, 140, 0.6)' }}></span>גבוהה
          </span>
        </div>
      </div>
    </>
  )
}
