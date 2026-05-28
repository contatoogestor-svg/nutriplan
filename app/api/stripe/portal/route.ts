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
    .select("stripe_customer_id")
    .eq("id", plan.profile_id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer found." }, { status: 404 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/plan/${planId}`,
  })

  return NextResponse.json({ url: portalSession.url })
}
