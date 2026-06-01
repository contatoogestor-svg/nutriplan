import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { planId } = await req.json()
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL!
  const supabase = createServerClient()

  const { data: plan } = await supabase
    .from("meal_plans")
    .select("profile_id")
    .eq("id", planId)
    .single()

  if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, user_id")
    .eq("id", plan.profile_id)
    .single()

  let stripeCustomerId = profile?.stripe_customer_id

  // Secondary profiles don't have stripe_customer_id — look it up from
  // any other profile of the same user that went through Stripe checkout
  if (!stripeCustomerId && profile?.user_id) {
    const { data: proProfile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", profile.user_id)
      .not("stripe_customer_id", "is", null)
      .limit(1)
      .single()
    stripeCustomerId = proProfile?.stripe_customer_id
  }

  if (!stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer found." }, { status: 404 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${origin}/plan/${planId}`,
  })

  return NextResponse.json({ url: portalSession.url })
}
