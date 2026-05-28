"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import SafetyAlert from "@/components/ui/SafetyAlert"
import PaywallOverlay from "@/components/ui/PaywallOverlay"

interface ActivityEntry {
  activity_type: string
  frequency_per_week: number
  duration_minutes: number
}

interface ExerciseTabProps {
  activities: ActivityEntry[]
  isPro: boolean
  planId: string
}

interface ExerciseCard {
  name: string
  icon: string
  badge: "Recommended" | "High Priority" | "Advanced"
  badgeColor: string
  frequency: string
  caloriesPerSession: string
  tip: string
}

const ALL_EXERCISES: ExerciseCard[] = [
  {
    name: "Strength Training",
    icon: "🏋️",
    badge: "High Priority",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    frequency: "3–4x per week",
    caloriesPerSession: "250–400 kcal/session",
    tip: "Critical during a caloric deficit to preserve lean muscle mass (LBM) and maintain a higher resting BMR.",
  },
  {
    name: "Walking",
    icon: "🚶",
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    frequency: "Daily, 30–60 min",
    caloriesPerSession: "150–300 kcal/session",
    tip: "Low impact, sustainable. Great for active recovery days and increasing overall TDEE without extra stress.",
  },
  {
    name: "HIIT",
    icon: "⚡",
    badge: "High Priority",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    frequency: "2x per week max",
    caloriesPerSession: "300–500 kcal/session (+ EPOC)",
    tip: "Maximizes calorie burn and EPOC (afterburn effect). Limit to 2x/week to avoid excessive fatigue during a deficit.",
  },
  {
    name: "Cycling",
    icon: "🚴",
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    frequency: "3–5x per week",
    caloriesPerSession: "300–600 kcal/session",
    tip: "Excellent cardiovascular training with low joint impact. Effective for both fat loss and endurance.",
  },
  {
    name: "Swimming",
    icon: "🏊",
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    frequency: "2–4x per week",
    caloriesPerSession: "400–700 kcal/session",
    tip: "Full-body workout with near-zero joint impact. Ideal for those with mobility limitations.",
  },
  {
    name: "Running",
    icon: "🏃",
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    frequency: "3–4x per week",
    caloriesPerSession: "400–600 kcal/session",
    tip: "High calorie burn per minute. Start at conversational pace to avoid injury and burnout.",
  },
  {
    name: "Yoga / Pilates",
    icon: "🧘",
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    frequency: "2–3x per week",
    caloriesPerSession: "150–250 kcal/session",
    tip: "Reduces cortisol (stress hormone) which can cause fat retention. Great for recovery and mobility.",
  },
  {
    name: "Functional Training",
    icon: "🤸",
    badge: "Advanced",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    frequency: "2–3x per week",
    caloriesPerSession: "300–450 kcal/session",
    tip: "Combines strength, cardio, and flexibility. High intensity — best for intermediate/advanced trainees.",
  },
]

function ExerciseCardUI({ ex }: { ex: ExerciseCard }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ex.icon}</span>
          <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{ex.name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ex.badgeColor}`}>
          {ex.badge}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span>📅 {ex.frequency}</span>
        <span>🔥 {ex.caloriesPerSession}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ex.tip}</p>
    </div>
  )
}

export default function ExerciseTab({ activities, isPro, planId }: ExerciseTabProps) {
  const [showPaywall, setShowPaywall] = useState(false)
  const hasActivities = activities && activities.length > 0
  const activeTypes = new Set(activities.map((a) => a.activity_type.toLowerCase()))
  const recommended = ALL_EXERCISES.filter((e) => !activeTypes.has(e.name.toLowerCase()))
  const exerciseList = hasActivities ? recommended : ALL_EXERCISES

  const muscleAlert = (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">💪</span>
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Preserve Lean Muscle Mass
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            During any caloric deficit, resistance/strength training is essential to prevent muscle loss.
            Losing muscle reduces your BMR — making future weight maintenance harder.
            Aim for at least <strong>2 strength sessions per week</strong>.
          </p>
        </div>
      </div>
    </div>
  )

  // ── FREE TIER: teaser view ─────────────────────────────────────────────────
  if (!isPro) {
    const preview = exerciseList.slice(0, 2)
    const blurred = exerciseList.slice(2, 5)

    return (
      <div className="space-y-4">
        {!hasActivities && (
          <SafetyAlert
            type="info"
            message="You haven't logged any exercise activities. Adding even light physical activity (like daily walks) can significantly increase your TDEE and accelerate fat loss."
          />
        )}
        {muscleAlert}

        {/* 2 cards visible */}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {hasActivities ? "Recommended Additions" : "Exercise Recommendations"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {preview.map((ex) => <ExerciseCardUI key={ex.name} ex={ex} />)}
        </div>

        {/* Blurred rest + lock */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="blur-sm pointer-events-none select-none grid gap-3 sm:grid-cols-2">
            {blurred.map((ex) => <ExerciseCardUI key={ex.name} ex={ex} />)}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 dark:via-gray-950/60 to-white dark:to-gray-950" />
          <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-3 pb-8 pt-16">
            <div className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Full Exercise Plan · Pro only
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
              {ALL_EXERCISES.length} exercises · calorie estimates · science-backed tips · personalized to your activities
            </p>
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-md"
            >
              Unlock Full Exercise Plan →
            </button>
          </div>
        </div>

        {showPaywall && (
          <PaywallOverlay feature="Exercise Plan" planId={planId} onClose={() => setShowPaywall(false)} fullscreen />
        )}
      </div>
    )
  }

  // ── PRO TIER: full view ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {!hasActivities && (
        <SafetyAlert
          type="info"
          message="You haven't logged any exercise activities. Adding even light physical activity (like daily walks) can significantly increase your TDEE and accelerate fat loss — while also boosting energy, mood, and muscle retention during a caloric deficit."
        />
      )}
      {muscleAlert}

      {hasActivities && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Current Activities</h3>
          <div className="space-y-2">
            {activities.map((a, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">
                  {ALL_EXERCISES.find((e) => e.name.toLowerCase() === a.activity_type.toLowerCase())?.icon ?? "🏃"}
                </span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{a.activity_type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {a.frequency_per_week}x/week · {a.duration_minutes} min/session
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {hasActivities ? "Recommended Additions" : "Exercise Recommendations"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {exerciseList.map((ex) => <ExerciseCardUI key={ex.name} ex={ex} />)}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Calorie estimates vary based on body weight, intensity, and fitness level. Consult a fitness professional for a personalized program.
      </p>
    </div>
  )
}
