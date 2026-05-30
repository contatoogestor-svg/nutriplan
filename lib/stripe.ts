import Stripe from "stripe"

/** Server-side Stripe client — lazy initialized, only use in API routes */
let _stripe: Stripe | undefined

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured")
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
    })
  }
  return _stripe
}

/** @deprecated Use getStripe() instead */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

/** Price IDs from environment */
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
}


export const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "1 personalized meal plan",
      "6 meals/day with portions",
      "Progress timeline",
      "Exercise recommendations",
      "1 weekly check-in",
    ],
    limitations: ["No PDF export", "No monthly shopping list"],
  },
  pro: {
    name: "Pro",
    monthlyPrice: "$9.99",
    annualPrice: "$59",
    annualMonthly: "$4.92",
    features: [
      "Everything in Free",
      "Unlimited meal plan regeneration",
      "Full PDF export (meal plan + shopping list)",
      "Weekly & monthly shopping list PDF",
      "Unlimited weekly check-ins",
      "Priority support",
    ],
  },
}
