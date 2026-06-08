import { useState } from 'react'

const NEIGHBORHOOD_PATHS = {
  north: {
    d: 'M 80 20 L 220 20 L 240 60 L 220 120 L 80 120 L 60 60 Z',
    labelX: 150, labelY: 70
  },
  merkaz: {
    d: 'M 60 130 L 240 130 L 250 180 L 240 240 L 60 240 L 50 180 Z',
    labelX: 150, labelY: 185
  },
  west: {
    d: 'M 10 130 L 50 130 L 50 240 L 10 240 L 0 185 Z',
    labelX: 28, labelY: 185
  },
  industrial: {
    d: 'M 250 130 L 310 110 L 330 180 L 310 250 L 250 240 Z',
    labelX: 285, labelY: 180
  },
  south: {
    d: 'M 60 250 L 240 250 L 230 320 L 200 360 L 100 360 L 70 320 Z',
    labelX: 150, labelY: 300
  },
  marina: {
    d: 'M 0 250 L 50 250 L 60 320 L 50 380 L 0 380 Z',
    labelX: 30, labelY: 315
  }
}

function getColor(vacancy) {
  if (vacancy <= 0.12) return '#2a9d8f'
  if (vacancy <= 0.15) return '#59c9a5'
  if (vacancy <= 0.18) return '#e9c46a'
  if (vacancy <= 0.20) return '#f4a261'
  return '#e76f51'
}

export default function GeoMap({ neighborhoods }) {
  const [tooltip, setTooltip] = useState(null)

  const neighborhoodMap = {}
  neighborhoods.forEach(n => { neighborhoodMap[n.id] = n })

  return (
    <div className="geo-map-wrapper">
      <svg viewBox="-10 0 360 400" className="geo-map-svg">
        <text x="170" y="395" textAnchor="middle" className="map-sea-label">
          ים תיכון
        </text>

        {Object.entries(NEIGHBORHOOD_PATHS).map(([id, shape]) => {
          const n = neighborhoodMap[id]
          if (!n) return null
          const fill = getColor(n.vacancy)

          return (
            <g key={id}
              onMouseEnter={(e) => setTooltip({
                x: e.clientX, y: e.clientY,
                name: n.name,
                businesses: n.businesses,
                income: n.income,
                vacancy: n.vacancy
              })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={shape.d}
                fill={fill}
                stroke="#fff"
                strokeWidth="2"
                opacity={0.85}
              />
              <text
                x={shape.labelX}
                y={shape.labelY - 8}
                textAnchor="middle"
                className="map-label-name"
              >
                {n.name}
              </text>
              <text
                x={shape.labelX}
                y={shape.labelY + 12}
                textAnchor="middle"
                className="map-label-count"
              >
                {n.businesses.toLocaleString('he-IL')} עסקים
              </text>
            </g>
          )
        })}
      </svg>

      {tooltip && (
        <div className="map-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 60 }}>
          <strong>{tooltip.name}</strong>
          <div>{tooltip.businesses.toLocaleString('he-IL')} עסקים</div>
          <div>הכנסות: {tooltip.income} אלף ₪</div>
          <div>ריקנות: {(tooltip.vacancy * 100).toFixed(1)}%</div>
        </div>
      )}

      <div className="map-legend">
        <span className="map-legend-title">אחוז ריקנות:</span>
        <span className="map-legend-item"><span className="legend-dot" style={{ background: '#2a9d8f' }}></span>נמוך (&lt;12%)</span>
        <span className="map-legend-item"><span className="legend-dot" style={{ background: '#e9c46a' }}></span>בינוני (15-18%)</span>
        <span className="map-legend-item"><span className="legend-dot" style={{ background: '#e76f51' }}></span>גבוה (&gt;20%)</span>
      </div>
    </div>
  )
}
