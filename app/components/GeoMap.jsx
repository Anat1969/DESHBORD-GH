import { useState } from 'react'
import neighborhoodsData from '../../data/neighborhoods.json'

// OSM zoom 13, 3x3 tile grid centered on Ashdod
const ZOOM = 13
const TILES = [
  [4883, 3330], [4884, 3330], [4885, 3330],
  [4883, 3331], [4884, 3331], [4885, 3331],
  [4883, 3332], [4884, 3332], [4885, 3332]
]
const GRID_ORIGIN_X = 4883 * 256
const GRID_ORIGIN_Y = 3330 * 256
const GRID_SIZE = 3 * 256  // 768px

/** Convert lat/lng to percentage position within our tile grid */
function latLngToPercent(lat, lng) {
  const n = Math.pow(2, ZOOM)
  const xPixel = (lng + 180) / 360 * n * 256
  const latRad = lat * Math.PI / 180
  const yPixel = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n * 256
  return {
    x: (xPixel - GRID_ORIGIN_X) / GRID_SIZE * 100,
    y: (yPixel - GRID_ORIGIN_Y) / GRID_SIZE * 100
  }
}

// Pre-compute positions from real coordinates
const NEIGHBORHOOD_POS = {}
neighborhoodsData.neighborhoods.forEach(n => {
  const pos = latLngToPercent(n.coordinates[0], n.coordinates[1])
  NEIGHBORHOOD_POS[n.id] = { x: pos.x, y: pos.y, label: n.name }
})

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
          <div className="map-tiles">
            {TILES.map(([x, y], i) => (
              <img key={i}
                src={`https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`}
                alt=""
                className="map-tile"
                draggable={false}
              />
            ))}
          </div>
          <div className="map-overlay">
            <svg viewBox="0 0 100 100" className="map-svg-overlay" preserveAspectRatio="none">
              {Object.entries(NEIGHBORHOOD_POS).map(([id, pos]) => {
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
