/**
 * Shared neighborhood color palette.
 * Warm amber/copper tones matching the dashboard DNA.
 * Used by both the line chart and the geo map.
 */

const NEIGHBORHOOD_COLORS = {
  merkaz:     { bg: 'rgba(212, 148, 10, 0.6)',   border: 'rgba(212, 148, 10, 0.9)',   label: 'מרכז עיר' },
  north:      { bg: 'rgba(184, 155, 90, 0.6)',   border: 'rgba(184, 155, 90, 0.9)',   label: 'צפון העיר' },
  south:      { bg: 'rgba(194, 114, 32, 0.6)',   border: 'rgba(194, 114, 32, 0.9)',   label: 'דרום העיר' },
  west:       { bg: 'rgba(232, 184, 74, 0.55)',  border: 'rgba(232, 184, 74, 0.85)',  label: 'רובע י"ז' },
  industrial: { bg: 'rgba(184, 115, 51, 0.6)',   border: 'rgba(184, 115, 51, 0.9)',   label: 'אזור תעשייה' },
  marina:     { bg: 'rgba(160, 140, 90, 0.55)',  border: 'rgba(160, 140, 90, 0.85)',  label: 'מרינה / חוף' }
}

export default NEIGHBORHOOD_COLORS
