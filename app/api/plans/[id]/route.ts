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

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("profile_id", plan.profile_id)

  return NextResponse.json({ plan, profile, activities: activities || [] })
}
