import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  let sessionId: string | undefined
  try {
    const body = await req.json()
    sessionId = body.sessionId

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required." }, { status: 400 })
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })

    console.log("[verify-session] status:", session.status, "payment_status:", session.payment_status)

    // For trials, payment_status is "no_payment_required" — still valid
    if (session.status !== "complete") {
      return NextResponse.json({ status: "pending" })
    }

    const planId = session.metadata?.planId
    const customerId = session.customer as string
    const sub = session.subscription as Stripe.Subscription | null

    console.log("[verify-session] planId:", planId, "sub:", sub?.id, "sub.status:", sub?.status)

    if (!planId || !sub) {
      return NextResponse.json({ status: "no_plan" })
    }

    const supabase = createServerClient()

    const { data: plan, error: planError } = await supabase
      .from("meal_plans")
      .select("profile_id")
      .eq("id", planId)
      .single()

    console.log("[verify-session] plan lookup:", plan, "error:", planError)

    if (!plan) {
      return NextResponse.json({ status: "plan_not_found", detail: planError?.message })
    }

    const periodEnd = typeof (sub as unknown as Record<string, unknown>).current_period_end === "number"
      ? new Date(((sub as unknown as Record<string, unknown>).current_period_end as number) * 1000).toISOString()
      : null

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        stripe_customer_id: customerId,
        subscription_id: sub.id,
        subscription_status: sub.status,
        price_id: sub.items.data[0]?.price.id ?? null,
        current_period_end: periodEnd,
      })
      .eq("id", plan.profile_id)

    console.log("[verify-session] update error:", updateError)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ status: sub.status })
  } catch (err) {
    console.error("[verify-session] exception for session", sessionId, err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
