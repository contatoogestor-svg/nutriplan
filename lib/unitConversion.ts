/**
 * Unit Conversion Utilities
 * All internal calculations use metric (kg / cm).
 * These helpers convert to/from Imperial (lb / ft·in) for display.
 */

export const lbToKg = (lb: number): number =>
  Math.round(lb * 0.453592 * 100) / 100

export const kgToLb = (kg: number): number =>
  Math.round(kg * 2.20462 * 10) / 10

export const cmToFtIn = (cm: number): { ft: number; in: number } => ({
  ft: Math.floor(cm / 30.48),
  in: Math.round(((cm % 30.48) / 2.54) * 10) / 10,
})

export const ftInToCm = (ft: number, inches: number): number =>
  Math.round((ft * 30.48 + inches * 2.54) * 10) / 10

export const gToOz = (g: number): number =>
  Math.round((g / 28.3495) * 10) / 10

export const ozToG = (oz: number): number =>
  Math.round(oz * 28.3495)

/** Format weight for display based on unit preference */
export function formatWeight(
  kg: number,
  unit: "metric" | "imperial",
  decimals = 1
): string {
  if (unit === "imperial") {
    return `${kgToLb(kg).toFixed(decimals)} lb`
  }
  return `${kg.toFixed(decimals)} kg`
}

/** Format height for display */
export function formatHeight(
  cm: number,
  unit: "metric" | "imperial"
): string {
  if (unit === "imperial") {
    const { ft, in: inches } = cmToFtIn(cm)
    return `${ft} ft ${inches} in`
  }
  return `${cm} cm`
}

/** Format a food quantity (grams or oz) */
export function formatFoodWeight(
  g: number,
  unit: "metric" | "imperial"
): string {
  if (unit === "imperial") {
    return `${gToOz(g)} oz`
  }
  return `${g}g`
}
