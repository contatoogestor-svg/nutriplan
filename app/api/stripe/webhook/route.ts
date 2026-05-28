import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature failed:", err)
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  const supabase = createServerClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== "subscription") break

      const planId = session.metadata?.planId
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (!planId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id
      const rawSub = subscription as unknown as { current_period_end: number }
      const periodEnd = new Date(rawSub.current_period_end * 1000)

      // Find profile via planId
      const { data: plan } = await supabase
        .from("meal_plans")
        .select("profile_id")
        .eq("id", planId)
        .single()

      if (plan) {
        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_id: subscriptionId,
            subscription_status: subscription.status,
            price_id: priceId,
            current_period_end: periodEnd.toISOString(),
          })
          .eq("id", plan.profile_id)
      }
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const rawSub2 = sub as unknown as { current_period_end: number }
      const periodEnd = new Date(rawSub2.current_period_end * 1000)
      await supabase
        .from("profiles")
        .update({
          subscription_status: sub.status,
          price_id: sub.items.data[0]?.price.id,
          current_period_end: periodEnd.toISOString(),
        })
        .eq("subscription_id", sub.id)
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          subscription_id: null,
          price_id: null,
          current_period_end: null,
        })
        .eq("subscription_id", sub.id)
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription: string }
      if (invoice.subscription) {
        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("subscription_id", invoice.subscription)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
