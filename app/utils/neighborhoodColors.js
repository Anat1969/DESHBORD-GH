/**
 * Shared neighborhood color palette.
 * Distinct, diverse colors so each neighborhood is immediately recognizable.
 * Used by both the line chart and the geo map.
 */

const NEIGHBORHOOD_COLORS = {
  merkaz:     { bg: 'rgba(59, 130, 246, 0.65)',  border: 'rgba(59, 130, 246, 0.9)',  label: 'מרכז עיר' },
  north:      { bg: 'rgba(16, 185, 129, 0.65)',  border: 'rgba(16, 185, 129, 0.9)',  label: 'צפון העיר' },
  south:      { bg: 'rgba(245, 158, 11, 0.65)',  border: 'rgba(245, 158, 11, 0.9)',  label: 'דרום העיר' },
  west:       { bg: 'rgba(168, 85, 247, 0.6)',   border: 'rgba(168, 85, 247, 0.85)', label: 'רובע י"ז' },
  industrial: { bg: 'rgba(239, 68, 68, 0.6)',    border: 'rgba(239, 68, 68, 0.85)',  label: 'אזור תעשייה' },
  marina:     { bg: 'rgba(6, 182, 212, 0.6)',    border: 'rgba(6, 182, 212, 0.85)',  label: 'מרינה / חוף' }
}

export default NEIGHBORHOOD_COLORS
