"use client"

import { useState } from "react"
import { Lock, ChevronDown, ChevronUp, Clock, Flame, ExternalLink } from "lucide-react"
import SafetyAlert from "@/components/ui/SafetyAlert"
import PaywallOverlay from "@/components/ui/PaywallOverlay"

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface WorkoutExercise {
  name: string
  sets?: number
  reps?: string
  duration?: string
  rest?: string
  note?: string
}

interface WorkoutBlock {
  title: string
  duration: string
  exercises: WorkoutExercise[]
}

interface PlanItem {
  exerciseName: string
  icon: string
  minutes: number
  caloriesBurn: string
  highlight: boolean
  workout?: WorkoutBlock[]
}

interface DailyPlan {
  label: string
  totalCalories: string
  tip: string
  items: PlanItem[]
}

// ─── Exercise card data ────────────────────────────────────────────────────────

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

// ─── Workout detail data ───────────────────────────────────────────────────────

const STRENGTH_WORKOUTS: Record<string, WorkoutBlock[]> = {
  "30": [
    {
      title: "Warm-up",
      duration: "3 min",
      exercises: [
        { name: "Light jog in place", duration: "1 min" },
        { name: "Arm circles + leg swings", duration: "1 min" },
        { name: "Bodyweight squats", duration: "1 min" },
      ],
    },
    {
      title: "Full Body Circuit — 3 rounds",
      duration: "22 min",
      exercises: [
        { name: "Squats", sets: 3, reps: "15 reps", rest: "60s" },
        { name: "Push-ups", sets: 3, reps: "15 reps", rest: "60s" },
        { name: "Dumbbell Row (each side)", sets: 3, reps: "12 reps", rest: "60s" },
        { name: "Glute Bridge", sets: 3, reps: "15 reps", rest: "60s" },
        { name: "Plank", sets: 3, reps: "30 seconds", rest: "45s" },
      ],
    },
    {
      title: "Cool-down",
      duration: "5 min",
      exercises: [
        { name: "Quad stretch", duration: "45s each leg" },
        { name: "Hip flexor stretch", duration: "45s each side" },
        { name: "Child's pose", duration: "1 min" },
      ],
    },
  ],
  "45": [
    {
      title: "Warm-up",
      duration: "5 min",
      exercises: [
        { name: "Light jog or jumping jacks", duration: "2 min" },
        { name: "Dynamic stretching", duration: "3 min" },
      ],
    },
    {
      title: "Compound Strength — 4 exercises",
      duration: "30 min",
      exercises: [
        { name: "Squats", sets: 4, reps: "12 reps", rest: "90s" },
        { name: "Romanian Deadlift", sets: 3, reps: "10 reps", rest: "90s" },
        { name: "Bench Press (or Push-ups)", sets: 4, reps: "10–12 reps", rest: "90s" },
        { name: "Dumbbell Row", sets: 3, reps: "12 reps each side", rest: "90s" },
        { name: "Overhead Press", sets: 3, reps: "10 reps", rest: "90s" },
        { name: "Plank", sets: 3, reps: "45 seconds", rest: "60s" },
      ],
    },
    {
      title: "Cool-down",
      duration: "10 min",
      exercises: [
        { name: "Full body stretching", duration: "5 min" },
        { name: "Deep breathing", duration: "2 min" },
        { name: "Foam rolling (if available)", duration: "3 min" },
      ],
    },
  ],
  "60": [
    {
      title: "Warm-up",
      duration: "5 min",
      exercises: [
        { name: "Light cardio (bike or treadmill)", duration: "3 min" },
        { name: "Mobility work", duration: "2 min" },
      ],
    },
    {
      title: "Push — Chest & Shoulders",
      duration: "18 min",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "10 reps", rest: "2 min" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "12 reps", rest: "90s" },
        { name: "Lateral Raises", sets: 3, reps: "15 reps", rest: "60s" },
        { name: "Tricep Dips", sets: 3, reps: "12 reps", rest: "60s" },
      ],
    },
    {
      title: "Pull & Legs",
      duration: "22 min",
      exercises: [
        { name: "Squats", sets: 4, reps: "10 reps", rest: "2 min" },
        { name: "Deadlift", sets: 3, reps: "8 reps", rest: "2 min", note: "Focus on form over weight" },
        { name: "Pull-ups or Lat Pulldown", sets: 4, reps: "8–10 reps", rest: "90s" },
        { name: "Bicep Curls", sets: 3, reps: "12 reps", rest: "60s" },
      ],
    },
    {
      title: "Core Finisher",
      duration: "10 min",
      exercises: [
        { name: "Plank", sets: 3, reps: "60 seconds", rest: "45s" },
        { name: "Russian Twists", sets: 3, reps: "20 reps", rest: "45s" },
        { name: "Leg Raises", sets: 3, reps: "12 reps", rest: "45s" },
      ],
    },
    {
      title: "Cool-down",
      duration: "5 min",
      exercises: [
        { name: "Full body stretching", duration: "5 min" },
      ],
    },
  ],
}

const HIIT_WORKOUTS: Record<string, WorkoutBlock[]> = {
  "20": [
    {
      title: "Warm-up",
      duration: "3 min",
      exercises: [
        { name: "Jumping jacks", duration: "1 min" },
        { name: "High knees (moderate)", duration: "1 min" },
        { name: "Arm swings + hip circles", duration: "1 min" },
      ],
    },
    {
      title: "HIIT Circuit — 7 rounds (30s on / 20s off)",
      duration: "12 min",
      exercises: [
        { name: "Burpees", duration: "30s on", rest: "20s off", note: "Full body, max effort" },
        { name: "Jump Squats", duration: "30s on", rest: "20s off" },
        { name: "Mountain Climbers", duration: "30s on", rest: "20s off" },
        { name: "High Knees", duration: "30s on", rest: "20s off", note: "Pump arms for more intensity" },
      ],
    },
    {
      title: "Cool-down",
      duration: "5 min",
      exercises: [
        { name: "Walk in place, slow breathing", duration: "2 min" },
        { name: "Full body stretch", duration: "3 min" },
      ],
    },
  ],
  "30": [
    {
      title: "Warm-up",
      duration: "5 min",
      exercises: [
        { name: "Light jog", duration: "2 min" },
        { name: "Dynamic stretching", duration: "3 min" },
      ],
    },
    {
      title: "HIIT Circuit — 10 rounds (40s on / 20s off)",
      duration: "20 min",
      exercises: [
        { name: "Burpees", duration: "40s on", rest: "20s off" },
        { name: "Jump Squats", duration: "40s on", rest: "20s off" },
        { name: "Push-ups", duration: "40s on", rest: "20s off" },
        { name: "Mountain Climbers", duration: "40s on", rest: "20s off" },
        { name: "High Knees", duration: "40s on", rest: "20s off" },
      ],
    },
    {
      title: "Cool-down",
      duration: "5 min",
      exercises: [
        { name: "Walk in place", duration: "2 min" },
        { name: "Quad + hip flexor stretch", duration: "3 min" },
      ],
    },
  ],
  "45": [
    {
      title: "Warm-up",
      duration: "5 min",
      exercises: [
        { name: "Light jog", duration: "3 min" },
        { name: "Dynamic mobility", duration: "2 min" },
      ],
    },
    {
      title: "Block 1 — Sprint Intervals",
      duration: "10 min",
      exercises: [
        { name: "Sprint 30s / Walk 30s", duration: "30s on / 30s off", note: "Repeat 10 rounds" },
      ],
    },
    {
      title: "Block 2 — Strength Circuit (4 rounds)",
      duration: "16 min",
      exercises: [
        { name: "Burpees", duration: "40s on", rest: "20s off" },
        { name: "Squat Jumps", duration: "40s on", rest: "20s off" },
        { name: "Push-ups", duration: "40s on", rest: "20s off" },
        { name: "Plank Hold", duration: "40s on", rest: "20s off" },
      ],
    },
    {
      title: "Core Finisher",
      duration: "9 min",
      exercises: [
        { name: "Mountain Climbers", sets: 3, reps: "30 seconds", rest: "30s" },
        { name: "Russian Twists", sets: 3, reps: "20 reps", rest: "30s" },
        { name: "V-ups", sets: 3, reps: "10 reps", rest: "30s" },
      ],
    },
    {
      title: "Cool-down",
      duration: "5 min",
      exercises: [
        { name: "Walk + deep breathing", duration: "2 min" },
        { name: "Full body stretch", duration: "3 min" },
      ],
    },
  ],
}

// ─── Daily plan definitions ────────────────────────────────────────────────────

const DAILY_PLANS: Record<number, DailyPlan> = {
  20: {
    label: "Quick Burn",
    totalCalories: "200–350 kcal",
    tip: "Short on time? HIIT is the most efficient option — burns as many calories as 40 min of jogging, plus EPOC keeps burning for hours.",
    items: [
      {
        exerciseName: "HIIT",
        icon: "⚡",
        minutes: 20,
        caloriesBurn: "200–350 kcal",
        highlight: true,
        workout: HIIT_WORKOUTS["20"],
      },
    ],
  },
  30: {
    label: "Efficient Session",
    totalCalories: "300–500 kcal",
    tip: "30 minutes of HIIT triggers afterburn (EPOC) — your body keeps burning calories for up to 24h after the workout.",
    items: [
      {
        exerciseName: "HIIT",
        icon: "⚡",
        minutes: 25,
        caloriesBurn: "280–450 kcal",
        highlight: true,
        workout: HIIT_WORKOUTS["30"],
      },
      {
        exerciseName: "Cool-down Walk",
        icon: "🚶",
        minutes: 5,
        caloriesBurn: "25–40 kcal",
        highlight: false,
      },
    ],
  },
  45: {
    label: "Balanced Workout",
    totalCalories: "350–550 kcal",
    tip: "45 min is the sweet spot for strength training — enough time for full compound lifts that preserve muscle during your caloric deficit.",
    items: [
      {
        exerciseName: "Strength Training",
        icon: "🏋️",
        minutes: 40,
        caloriesBurn: "300–500 kcal",
        highlight: true,
        workout: STRENGTH_WORKOUTS["45"],
      },
      {
        exerciseName: "Cool-down Walk",
        icon: "🚶",
        minutes: 5,
        caloriesBurn: "25–40 kcal",
        highlight: false,
      },
    ],
  },
  60: {
    label: "Full Session",
    totalCalories: "500–800 kcal",
    tip: "An hour lets you combine strength work and cardio. Always do strength first — it uses glycogen efficiently before cardio taps into fat stores.",
    items: [
      {
        exerciseName: "Strength Training",
        icon: "🏋️",
        minutes: 45,
        caloriesBurn: "350–550 kcal",
        highlight: true,
        workout: STRENGTH_WORKOUTS["60"],
      },
      {
        exerciseName: "Running / Cycling",
        icon: "🏃",
        minutes: 15,
        caloriesBurn: "150–250 kcal",
        highlight: false,
      },
    ],
  },
  90: {
    label: "Athlete Session",
    totalCalories: "700–1,100 kcal",
    tip: "90 minutes allows a complete strength session followed by HIIT. Rest 5–10 min between blocks and rehydrate well.",
    items: [
      {
        exerciseName: "Strength Training",
        icon: "🏋️",
        minutes: 50,
        caloriesBurn: "400–600 kcal",
        highlight: true,
        workout: STRENGTH_WORKOUTS["60"],
      },
      {
        exerciseName: "HIIT",
        icon: "⚡",
        minutes: 25,
        caloriesBurn: "250–400 kcal",
        highlight: true,
        workout: HIIT_WORKOUTS["20"],
      },
      {
        exerciseName: "Cool-down Walk",
        icon: "🚶",
        minutes: 15,
        caloriesBurn: "75–120 kcal",
        highlight: false,
      },
    ],
  },
}

const TIME_SLOTS = [
  { label: "20 min", value: 20 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "90 min+", value: 90 },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

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

function WorkoutDetail({ blocks }: { blocks: WorkoutBlock[] }) {
  return (
    <div className="mt-4 space-y-4 border-t dark:border-gray-700 pt-4">
      {blocks.map((block) => (
        <div key={block.title}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {block.title}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">{block.duration}</span>
          </div>
          <div className="space-y-1.5">
            {block.exercises.map((ex) => (
              <div
                key={ex.name}
                className="flex items-start justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{ex.name}</p>
                    <a
                      href={`https://www.youtube.com/results?search_query=how+to+${encodeURIComponent(ex.name)}+proper+form`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="See how to do this exercise"
                      className="text-red-500 hover:text-red-600 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {ex.note && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{ex.note}</p>
                  )}
                </div>
                <div className="text-right shrink-0 ml-4">
                  {ex.sets ? (
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {ex.sets}× {ex.reps}
                    </p>
                  ) : ex.duration ? (
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{ex.duration}</p>
                  ) : null}
                  {ex.rest && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">rest {ex.rest}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ExerciseTab({ activities, isPro, planId }: ExerciseTabProps) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)

  const hasActivities = activities && activities.length > 0
  const activeTypes = new Set(activities.map((a) => a.activity_type.toLowerCase()))
  const recommended = ALL_EXERCISES.filter((e) => !activeTypes.has(e.name.toLowerCase()))
  const exerciseList = hasActivities ? recommended : ALL_EXERCISES

  const todaysPlan = selectedTime ? DAILY_PLANS[selectedTime] : null

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

  // ── Time selector (shown for all users) ──────────────────────────────────────
  const timeSelector = (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          How much time do you have today?
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => {
              setSelectedTime(selectedTime === slot.value ? null : slot.value)
              setExpandedItem(null)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedTime === slot.value
                ? "bg-green-600 text-white border-green-600 shadow-sm"
                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600"
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  )

  // ── Today's plan panel ────────────────────────────────────────────────────────
  const todaysPlanPanel = todaysPlan && (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Today&apos;s Workout Plan
        </h3>
        <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full font-medium">
          {todaysPlan.label}
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">{todaysPlan.tip}</p>

      <div className="space-y-2">
        {todaysPlan.items.map((item, idx) => (
          <div key={item.exerciseName}>
            <div
              className={`rounded-xl border p-4 ${
                item.highlight
                  ? "bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 shadow-sm"
                  : "bg-white/60 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className={`font-medium text-sm ${item.highlight ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>
                      {item.exerciseName}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.minutes} min
                      </span>
                      <span className="text-xs text-orange-500 dark:text-orange-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {item.caloriesBurn}
                      </span>
                    </div>
                  </div>
                </div>
                {item.workout && (
                  <button
                    type="button"
                    onClick={() => setExpandedItem(expandedItem === item.exerciseName ? null : item.exerciseName)}
                    className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors shrink-0"
                  >
                    {expandedItem === item.exerciseName ? (
                      <><ChevronUp className="w-3 h-3" /> Hide</>
                    ) : (
                      <>See exercises <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>

              {item.workout && expandedItem === item.exerciseName && (
                <WorkoutDetail blocks={item.workout} />
              )}
            </div>

            {/* Connector */}
            {idx < todaysPlan.items.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="w-0.5 h-3 bg-green-200 dark:bg-green-800 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800/60 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">Estimated total burn</span>
        <span className="text-sm font-bold text-orange-500 dark:text-orange-400 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> {todaysPlan.totalCalories}
        </span>
      </div>
    </div>
  )

  // ── FREE TIER ─────────────────────────────────────────────────────────────────
  if (!isPro) {
    const preview = exerciseList.slice(0, 2)
    const blurred = exerciseList.slice(2, 5)

    return (
      <div className="space-y-4">
        {timeSelector}
        {todaysPlanPanel}

        {!hasActivities && (
          <SafetyAlert
            type="info"
            message="You haven't logged any exercise activities. Adding even light physical activity (like daily walks) can significantly increase your TDEE and accelerate fat loss."
          />
        )}
        {muscleAlert}

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

  // ── PRO TIER ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {timeSelector}
      {todaysPlanPanel}

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
