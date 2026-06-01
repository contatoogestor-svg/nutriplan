import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/** Client-side Supabase client (uses anon key — safe for browser) */
let _client: SupabaseClient | null = null
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  _client = createClient(url, key)
  return _client
}

/** Convenience export for client components */
export const supabase = {
  get client() { return getSupabaseClient() },
}

/** Server-side Supabase client (uses service role — only in API routes) */
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

// ---------------------------------------------------------------------------
// Database type definitions
// ---------------------------------------------------------------------------
export interface Profile {
  id: string
  created_at: string
  name: string
  date_of_birth: string
  gender: "male" | "female"
  height_cm: number
  weight_kg: number
  target_weight_kg: number
  goal_days: number
  is_active: boolean
  unit_preference: "metric" | "imperial"
  email?: string | null
  user_id?: string | null
  stripe_customer_id?: string | null
  subscription_status?: "free" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | null
  subscription_id?: string | null
  price_id?: string | null
  current_period_end?: string | null
}

export interface Activity {
  id: string
  profile_id: string
  activity_type: string
  frequency_per_week: number
  duration_minutes: number
}

export interface MealPlan {
  id: string
  profile_id: string
  created_at: string
  target_calories: number
  bmr: number
  tdee: number
  daily_deficit: number
  protein_g: number
  carbs_g: number
  fat_g: number
  plan_json: {
    meals: import("./mealDatabase").GeneratedMeal[]
    projectedWeights: import("./nutrition").ProjectedWeek[]
    bmi: number
    bmiCategory: string
    estimatedWeeklyLoss_kg: number
    safetyWarning?: string
    safetyError?: string
    minHealthyWeight_kg: number
    maxHealthyWeight_kg: number
  }
}

export interface WeightLog {
  id: string
  profile_id: string
  logged_at: string
  weight_kg: number
  notes?: string
}
