import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("id", id)
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 })
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", plan.profile_id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 })
  }

  // If this profile has no active subscription but belongs to a user,
  // look up the subscription from any other profile of the same user.
  // This ensures all plans of a Pro user have Pro features unlocked.
  let effectiveProfile = profile
  const activeStatuses = ["active", "trialing"]
  const profileHasPro = activeStatuses.includes(profile.subscription_status ?? "")

  if (!profileHasPro && profile.user_id) {
    const { data: proProfile } = await supabase
      .from("profiles")
      .select("subscription_status, stripe_customer_id")
      .eq("user_id", profile.user_id)
      .in("subscription_status", activeStatuses)
      .limit(1)
      .single()

    if (proProfile) {
      effectiveProfile = {
        ...profile,
        subscription_status: proProfile.subscription_status,
        stripe_customer_id: proProfile.stripe_customer_id,
      }
    }
  }

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("profile_id", plan.profile_id)

  return NextResponse.json({ plan, profile: effectiveProfile, activities: activities || [] })
}
