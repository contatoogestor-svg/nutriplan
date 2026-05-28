import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()
  const body = await req.json()
  const { weight_kg, notes } = body

  if (!weight_kg || isNaN(Number(weight_kg))) {
    return NextResponse.json({ error: "Invalid weight value." }, { status: 400 })
  }

  // Verify the plan exists and get the profile_id
  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .select("profile_id")
    .eq("id", id)
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 })
  }

  const { data: log, error } = await supabase
    .from("weight_logs")
    .insert({
      profile_id: plan.profile_id,
      weight_kg: Number(weight_kg),
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to save check-in." }, { status: 500 })
  }

  const { data: allLogs } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("profile_id", plan.profile_id)
    .order("logged_at", { ascending: true })

  return NextResponse.json({ log, logs: allLogs || [] }, { status: 201 })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .select("profile_id")
    .eq("id", id)
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 })
  }

  const { data: logs, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("profile_id", plan.profile_id)
    .order("logged_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch check-ins." }, { status: 500 })
  }

  return NextResponse.json({ logs: logs || [] })
}
