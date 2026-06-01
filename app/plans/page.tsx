import { redirect } from "next/navigation"
import Link from "next/link"
import { Salad, Plus, UtensilsCrossed, ArrowRight, Calendar, Flame } from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { createServerClient } from "@/lib/supabase"
import { isProUser } from "@/lib/subscription"
import UserMenu from "@/components/ui/UserMenu"

export default async function PlansPage() {
  // Require auth
  let userEmail: string | null = null
  let userId: string | null = null

  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login?message=Sign in to access your plans")
    userEmail = user.email ?? null
    userId = user.id
  } catch {
    redirect("/login?message=Sign in to access your plans")
  }

  // Fetch all profiles + plans for this user
  const service = createServerClient()

  const { data: profiles } = await service
    .from("profiles")
    .select("id, name, subscription_status")
    .eq("user_id", userId!)

  if (!profiles?.length) redirect("/start")

  const { data: plans } = await service
    .from("meal_plans")
    .select("id, created_at, target_calories, profile_id")
    .in("profile_id", profiles.map((p) => p.id))
    .order("created_at", { ascending: false })

  if (!plans?.length) redirect("/start")

  // Merge profile info into each plan
  const userPlans = plans.map((mp) => {
    const profile = profiles.find((p) => p.id === mp.profile_id)!
    return {
      id: mp.id,
      created_at: mp.created_at,
      target_calories: mp.target_calories,
      profile_name: profile.name,
      subscription_status: profile.subscription_status,
    }
  })

  // Use the most recent profile's subscription status to determine Pro
  const latestProfile = profiles.find((p) => p.id === plans[0].profile_id)
  const isPro = isProUser(latestProfile?.subscription_status)
  const atLimit = userPlans.length >= 3

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
            <Salad className="w-5 h-5" />
            NutriPlan
          </Link>
          {userEmail && <UserMenu email={userEmail} />}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Plans</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {userPlans.length} of {isPro ? "3" : "1"} plan{userPlans.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isPro && !atLimit && (
            <Link
              href="/start?new=1"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Plan
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {userPlans.map((plan) => (
            <Link
              key={plan.id}
              href={`/plan/${plan.id}`}
              className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{plan.profile_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(plan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      <Flame className="w-3 h-3" />
                      {plan.target_calories} kcal/day
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-green-500 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Upgrade CTA for free users */}
        {!isPro && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 text-center">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Upgrade to Pro to create up to 3 meal plans
            </p>
            <Link
              href={`/plan/${userPlans[0].id}`}
              className="inline-block mt-2 text-xs text-green-600 dark:text-green-400 underline"
            >
              View upgrade options →
            </Link>
          </div>
        )}

        {/* At limit message */}
        {isPro && atLimit && (
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            You've reached the maximum of 3 plans. Delete a plan to create a new one.
          </p>
        )}
      </div>
    </main>
  )
}
