import { redirect } from "next/navigation"
import OnboardingForm from "@/components/forms/OnboardingForm"
import Link from "next/link"
import { Salad, ArrowLeft } from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { createServerClient } from "@/lib/supabase"

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const sp = await searchParams
  const isNewPlan = sp.new === "1"

  // If user is logged in and already has a plan, redirect them there —
  // unless they explicitly requested a new plan (?new=1).
  // IMPORTANT: redirect() must be called OUTSIDE try-catch — it works by
  // throwing a NEXT_REDIRECT error which a catch block would swallow.
  let existingPlanId: string | null = null
  try {
    const supabaseAuth = await createSupabaseServerClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (user) {
      const supabase = createServerClient()
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (profile) {
        const { data: plan } = await supabase
          .from("meal_plans")
          .select("id")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (plan) existingPlanId = plan.id
      }
    }
  } catch {
    // Not logged in or DB error — continue to onboarding
  }

  if (existingPlanId && !isNewPlan) redirect(`/plan/${existingPlanId}`)

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
            <Salad className="w-6 h-6" />
            NutriPlan
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Build Your Meal Plan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Takes 2 minutes. 100% free. No credit card required.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
          <OnboardingForm />
        </div>
      </div>
    </main>
  )
}
