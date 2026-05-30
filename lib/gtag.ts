export const GA_ID = "AW-18186998227"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function gtagEvent(conversionLabel: string, value?: number) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", "conversion", {
    send_to: `${GA_ID}/${conversionLabel}`,
    ...(value !== undefined ? { value, currency: "USD" } : {}),
  })
}
