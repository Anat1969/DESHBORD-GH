/**
 * Shared neighborhood color palette.
 * Used by both the line chart and the geo map to create
 * a visual link between the two views.
 *
 * Each color is silver-toned and semi-transparent,
 * consistent with the dashboard design language.
 */

const NEIGHBORHOOD_COLORS = {
  merkaz:     { bg: 'rgba(130, 200, 180, 0.6)',  border: 'rgba(130, 200, 180, 0.9)',  label: 'מרכז עיר' },
  north:      { bg: 'rgba(120, 180, 220, 0.6)',  border: 'rgba(120, 180, 220, 0.9)',  label: 'צפון העיר' },
  south:      { bg: 'rgba(160, 170, 210, 0.6)',  border: 'rgba(160, 170, 210, 0.9)',  label: 'דרום העיר' },
  west:       { bg: 'rgba(210, 190, 140, 0.6)',  border: 'rgba(210, 190, 140, 0.9)',  label: 'רובע י"ז' },
  industrial: { bg: 'rgba(210, 150, 150, 0.6)',  border: 'rgba(210, 150, 150, 0.9)',  label: 'אזור תעשייה' },
  marina:     { bg: 'rgba(180, 160, 200, 0.6)',  border: 'rgba(180, 160, 200, 0.9)',  label: 'מרינה / חוף' }
}

export default NEIGHBORHOOD_COLORS
