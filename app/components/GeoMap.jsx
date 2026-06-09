import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import neighborhoodsData from '../../data/neighborhoods.json'

function getColor(vacancy) {
  if (vacancy <= 0.12) return 'rgba(160, 220, 190, 0.6)'
  if (vacancy <= 0.15) return 'rgba(170, 190, 220, 0.55)'
  if (vacancy <= 0.18) return 'rgba(220, 200, 150, 0.55)'
  if (vacancy <= 0.20) return 'rgba(220, 170, 150, 0.55)'
  return 'rgba(210, 140, 140, 0.6)'
}

function getBorderColor(vacancy) {
  if (vacancy <= 0.12) return 'rgba(160, 220, 190, 0.9)'
  if (vacancy <= 0.15) return 'rgba(170, 190, 220, 0.8)'
  if (vacancy <= 0.18) return 'rgba(220, 200, 150, 0.8)'
  if (vacancy <= 0.20) return 'rgba(220, 170, 150, 0.8)'
  return 'rgba(210, 140, 140, 0.9)'
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

// Build a lookup from neighborhoods.json coordinates
const COORDS_MAP = {}
neighborhoodsData.neighborhoods.forEach(n => {
  COORDS_MAP[n.id] = n.coordinates  // [lat, lng]
})

export default function GeoMap({ neighborhoods }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const neighborhoodMap = {}
  neighborhoods.forEach(n => { neighborhoodMap[n.id] = n })
  const maxBiz = Math.max(...neighborhoods.map(n => n.businesses), 1)

  // Initialize map once
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [31.805, 34.650],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    })

    // Dark tiles from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 11
    }).addTo(map)

    // Zoom controls on the left (RTL friendly)
    L.control.zoom({ position: 'topleft' }).addTo(map)

    // Small attribution
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© <a href="https://carto.com/" style="color:#666">CARTO</a> © <a href="https://osm.org/" style="color:#666">OSM</a>')
      .addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    neighborhoods.forEach(n => {
      const coords = COORDS_MAP[n.id]
      if (!coords) return

      const radius = 10 + (n.businesses / maxBiz) * 22

      const circle = L.circleMarker(coords, {
        radius: radius,
        fillColor: getColor(n.vacancy),
        fillOpacity: 0.7,
        color: getBorderColor(n.vacancy),
        weight: 1.5
      }).addTo(map)

      // Tooltip on hover
      circle.bindTooltip(
        `<div class="map-tip">
          <strong>${n.name}</strong>
          <div>${n.businesses.toLocaleString('he-IL')} עסקים</div>
          <div>הכנסות: ${n.income} אלף ₪</div>
          <div>ריקנות: ${(n.vacancy * 100).toFixed(1)}%</div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -radius],
          className: 'leaflet-dark-tooltip'
        }
      )

      // Permanent label
      const label = L.marker(coords, {
        icon: L.divIcon({
          className: 'map-div-label',
          html: `<span class="map-label-name">${n.name}</span>
                 <span class="map-label-count">${n.businesses.toLocaleString('he-IL')}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, radius + 16]
        })
      }).addTo(map)

      markersRef.current.push(circle, label)
    })
  }, [neighborhoods, maxBiz])

  return (
    <>
      <p className="chart-insight large">{getInsight(neighborhoods)}</p>
      <div className="geo-map-wrapper">
        <div ref={mapRef} className="geo-map-leaflet" />
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
