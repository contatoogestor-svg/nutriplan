"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UtensilsCrossed, ShoppingCart, TrendingDown, Dumbbell, AlertTriangle, Info, RefreshCw, CheckCircle, DollarSign, Plus, BookOpen } from "lucide-react"
import MealPlanTab from "@/components/plan/MealPlanTab"
import ShoppingListTab from "@/components/plan/ShoppingListTab"
import TimelineTab from "@/components/plan/TimelineTab"
import ExerciseTab from "@/components/plan/ExerciseTab"
import SafetyAlert from "@/components/ui/SafetyAlert"
import AcronymTooltip from "@/components/ui/AcronymTooltip"
import { formatWeight } from "@/lib/unitConversion"
import type { Profile, MealPlan, Activity, WeightLog } from "@/lib/supabase"
import { isProUser } from "@/lib/subscription"
import { gtagEvent } from "@/lib/gtag"
import Link from "next/link"

interface UserPlanSummary {
  id: string
  created_at: string
  target_calories: number
  profile_name: string
}

interface PlanDashboardProps {
  data: { plan: MealPlan; profile: Profile; activities: Activity[] }
  planId: string
  upgradeSession?: string
  initialLogs?: WeightLog[]
  userPlans?: UserPlanSummary[]
}

const TABS = [
  { id: "meals", label: "Meal Plan", icon: UtensilsCrossed },
  { id: "shopping", label: "Shopping List", icon: ShoppingCart },
  { id: "timeline", label: "Progress Timeline", icon: TrendingDown },
  { id: "exercise", label: "Exercise", icon: Dumbbell },
] as const

type TabId = typeof TABS[number]["id"]

export default function PlanDashboard({ data, planId, upgradeSession, initialLogs = [], userPlans = [] }: PlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("meals")
  const [upgradeState, setUpgradeState] = useState<"idle" | "polling" | "done">("idle")
  const router = useRouter()

  const { plan, profile, activities } = data
  const isPro = isProUser(profile.subscription_status)

  async function handleManageSubscription() {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  // Verify subscription directly from Stripe after checkout redirect
  useEffect(() => {
    if (!upgradeSession) return
    if (isPro) { setUpgradeState("done"); return }

    setUpgradeState("polling")
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: upgradeSession }),
        })
        const json = await res.json()
        if (json.status === "active" || json.status === "trialing") {
          clearInterval(interval)
          setUpgradeState("done")
          gtagEvent("hLlkCLurmbYcENOjnuBD", json.value)
          router.refresh()
          return
        }
      } catch { /* keep trying */ }

      if (attempts >= 8) {
        clearInterval(interval)
        setUpgradeState("idle")
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [upgradeSession, isPro, router])
  const pj = plan.plan_json
  const unit = profile.unit_preference

  // Recalculation reminder: every 5kg (or 11lb)
  const weightLostSoFar = profile.weight_kg - profile.target_weight_kg
  const showRecalcReminder = weightLostSoFar >= 5

  return (
    <div className="space-y-6">
      {/* Upgrade status banner */}
      {upgradeState === "polling" && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Activating your Pro subscription… this takes a few seconds.
          </p>
        </div>
      )}
      {upgradeState === "done" && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Welcome to NutriPlan Pro! All features are now unlocked.
          </p>
        </div>
      )}

      {/* Plan Selector — Pro only, shown when user has multiple plans */}
      {isPro && userPlans.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
              My Plans ({userPlans.length}/3)
            </h2>
            {userPlans.length < 3 && (
              <Link
                href="/start"
                className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Plan
              </Link>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {userPlans.map((up) => (
              <Link
                key={up.id}
                href={`/plan/${up.id}`}
                className={`shrink-0 flex flex-col gap-0.5 px-3 py-2.5 rounded-xl border text-xs transition-all ${
                  up.id === planId
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">{up.profile_name}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(up.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">{up.target_calories} kcal</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.name}'s Meal Plan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generated {new Date(plan.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {" · "}
            Goal: {formatWeight(profile.target_weight_kg, unit)} in {profile.goal_days} days
          </p>
        </div>
        {isPro && (
          <button
            onClick={handleManageSubscription}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0 mt-1"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Manage Plan
          </button>
        )}
      </div>

      {/* Safety warnings */}
      {pj.safetyWarning && (
        <SafetyAlert type="warning" message={pj.safetyWarning} />
      )}

      {/* Recalculation reminder */}
      {showRecalcReminder && (
        <SafetyAlert
          type="info"
          message={`You're close to your goal! As you lose weight, your TDEE decreases. We recommend recalculating your meal plan after every ${unit === "imperial" ? "11 lb" : "5 kg"} lost to keep your caloric targets accurate.`}
        />
      )}

      {/* Metrics overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label={<AcronymTooltip acronym="BMR" />}
          value={plan.bmr.toLocaleString()}
          unit="kcal/day"
        />
        <MetricCard
          label={<AcronymTooltip acronym="TDEE" />}
          value={plan.tdee.toLocaleString()}
          unit="kcal/day"
        />
        <MetricCard
          label="Target"
          value={plan.target_calories.toLocaleString()}
          unit="kcal/day"
          highlight
        />
        <MetricCard
          label="Daily Deficit"
          value={plan.daily_deficit.toLocaleString()}
          unit="kcal/day"
        />
      </div>

      {/* BMI */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-wrap items-center gap-4 shadow-sm">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <AcronymTooltip acronym="BMI" /> (current)
          </span>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{pj.bmi}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{pj.bmiCategory}</p>
        </div>
        <div className="flex-1 min-w-48">
          <BMIBar bmi={pj.bmi} />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Healthy range:</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">
            {formatWeight(pj.minHealthyWeight_kg, unit)} – {formatWeight(pj.maxHealthyWeight_kg, unit)}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        This plan is for informational purposes only and is not a substitute for advice from a registered dietitian or physician.
        <a href="/science" className="ml-1 underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          Scientific basis →
        </a>
      </p>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex border-b dark:border-gray-800 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-green-600 text-green-700 dark:text-green-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-5">
          {activeTab === "meals" && (
            <MealPlanTab
              meals={pj.meals}
              targetCalories={plan.target_calories}
              protein_g={plan.protein_g}
              carbs_g={plan.carbs_g}
              fat_g={plan.fat_g}
              unitPref={unit}
              isPro={isPro}
              planId={planId}
              planData={{ profile, plan }}
            />
          )}
          {activeTab === "shopping" && (
            <ShoppingListTab meals={pj.meals} unitPref={unit} userName={profile.name} isPro={isPro} planId={planId} />
          )}
          {activeTab === "timeline" && (
            <TimelineTab
              projectedWeights={pj.projectedWeights}
              startWeight_kg={profile.weight_kg}
              targetWeight_kg={profile.target_weight_kg}
              unitPref={unit}
              estimatedWeeklyLoss_kg={pj.estimatedWeeklyLoss_kg}
              isPro={isPro}
              planId={planId}
              initialLogs={initialLogs}
            />
          )}
          {activeTab === "exercise" && (
            <ExerciseTab activities={activities} isPro={isPro} planId={planId} />
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: React.ReactNode
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        highlight
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
      }`}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  )
}

function BMIBar({ bmi }: { bmi: number }) {
  const categories = [
    { label: "Under", max: 18.5, color: "bg-blue-400" },
    { label: "Normal", max: 25, color: "bg-green-500" },
    { label: "Over", max: 30, color: "bg-yellow-400" },
    { label: "Obese", max: 40, color: "bg-red-500" },
  ]
  const clampedBmi = Math.max(10, Math.min(40, bmi))
  const pct = ((clampedBmi - 10) / 30) * 100

  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden">
        <div className="bg-blue-400 flex-1" />
        <div className="bg-green-500 flex-[1.3]" />
        <div className="bg-yellow-400 flex-1" />
        <div className="bg-red-500 flex-[2]" />
      </div>
      <div
        className="relative mt-1"
        style={{ marginLeft: `${Math.max(0, Math.min(98, pct))}%` }}
      >
        <div className="w-px h-3 bg-gray-800 dark:bg-white absolute -translate-x-1/2" />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-4">
        <span>10</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40+</span>
      </div>
    </div>
  )
}
