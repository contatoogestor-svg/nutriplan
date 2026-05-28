import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { plan, priceId: clientPriceId, planId } = await req.json()

    // Resolve price ID server-side (never trust client with secret-dependent IDs)
    let priceId: string
    if (plan === "monthly") {
      priceId = process.env.STRIPE_PRICE_MONTHLY!
    } else if (plan === "annual") {
      priceId = process.env.STRIPE_PRICE_ANNUAL!
    } else if (clientPriceId) {
      priceId = clientPriceId
    } else {
      return NextResponse.json({ error: "Plan or price ID required." }, { status: 400 })
    }

    const supabase = createServerClient()
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL!

    // Try to find an existing customer via the planId → profile
    let customerId: string | undefined
    if (planId) {
      const { data: plan } = await supabase
        .from("meal_plans")
        .select("profile_id")
        .eq("id", planId)
        .single()

      if (plan) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("stripe_customer_id")
          .eq("id", plan.profile_id)
          .single()

        if (profile?.stripe_customer_id) {
          customerId = profile.stripe_customer_id
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      locale: "en",
      billing_address_collection: "auto",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { planId: planId || "" },
      },
      success_url: `${origin}/plan/${planId}?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plan/${planId}?upgrade=canceled`,
      metadata: { planId: planId || "" },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 })
  }
}
