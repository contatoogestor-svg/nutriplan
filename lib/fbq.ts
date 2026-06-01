export const FB_PIXEL_ID = "467837425622118"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function fbqEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("track", event, params)
}
