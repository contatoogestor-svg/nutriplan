"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import UnitToggle from "@/components/ui/UnitToggle"
import SafetyAlert from "@/components/ui/SafetyAlert"
import AcronymTooltip from "@/components/ui/AcronymTooltip"
import { lbToKg, ftInToCm, kgToLb, cmToFtIn } from "@/lib/unitConversion"
import { minimumSafeGoalDays, calculateNutritionPlan, calculateAge } from "@/lib/nutrition"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

const ACTIVITY_TYPES = [
  "Walking", "Running", "Weight Training", "Swimming", "Cycling",
  "HIIT", "Yoga", "Soccer/Football", "Pilates", "Functional Training",
]

interface ActivityEntry {
  activity_type: string
  frequency_per_week: number
  duration_minutes: number
}

interface FormData {
  name: string
  date_of_birth: string
  gender: "male" | "female" | ""
  height_cm: string
  height_ft: string
  height_in: string
  weight: string
  target_weight: string
  goal_days: string
  has_activity: boolean
  activities: ActivityEntry[]
}

const INITIAL_FORM: FormData = {
  name: "",
  date_of_birth: "",
  gender: "",
  height_cm: "",
  height_ft: "",
  height_in: "",
  weight: "",
  target_weight: "",
  goal_days: "90",
  has_activity: false,
  activities: [],
}

export default function OnboardingForm() {
  const router = useRouter()
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "form", string>>>({})
  const [loading, setLoading] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [preview, setPreview] = useState<{ deficit: number; minDays: number } | null>(null)

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const addActivity = () => {
    set("activities", [
      ...form.activities,
      { activity_type: ACTIVITY_TYPES[0], frequency_per_week: 3, duration_minutes: 45 },
    ])
  }

  const removeActivity = (i: number) => {
    set("activities", form.activities.filter((_, idx) => idx !== i))
  }

  const updateActivity = (i: number, field: keyof ActivityEntry, value: string | number) => {
    const updated = [...form.activities]
    updated[i] = { ...updated[i], [field]: value }
    set("activities", updated)
  }

  // Compute estimated goal date
  const goalDate = form.goal_days
    ? new Date(Date.now() + parseInt(form.goal_days) * 86400000)
        .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null

  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!form.name.trim()) newErrors.name = "Full name is required."
    if (!form.date_of_birth) newErrors.date_of_birth = "Date of birth is required."
    else {
      const age = calculateAge(form.date_of_birth)
      if (age < 16) newErrors.date_of_birth = "You must be at least 16 years old."
      if (age > 99) newErrors.date_of_birth = "Please enter a valid date of birth."
    }
    if (!form.gender) newErrors.gender = "Please select a biological sex."

    if (unit === "metric") {
      if (!form.height_cm || isNaN(+form.height_cm) || +form.height_cm < 100 || +form.height_cm > 250)
        newErrors.height_cm = "Enter a valid height between 100–250 cm."
      if (!form.weight || isNaN(+form.weight) || +form.weight < 30 || +form.weight > 300)
        newErrors.weight = "Enter a valid weight between 30–300 kg."
      if (!form.target_weight || isNaN(+form.target_weight) || +form.target_weight < 30)
        newErrors.target_weight = "Enter a valid target weight (≥ 30 kg)."
    } else {
      if (!form.height_ft || isNaN(+form.height_ft))
        newErrors.height_ft = "Enter a valid height in feet."
      if (!form.weight || isNaN(+form.weight) || +form.weight < 66)
        newErrors.weight = "Enter a valid weight (≥ 66 lb)."
      if (!form.target_weight || isNaN(+form.target_weight) || +form.target_weight < 66)
        newErrors.target_weight = "Enter a valid target weight (≥ 66 lb)."
    }

    const days = parseInt(form.goal_days)
    if (!form.goal_days || isNaN(days) || days < 14 || days > 730)
      newErrors.goal_days = "Goal must be between 14 and 730 days."

    if (form.has_activity && form.activities.length === 0)
      newErrors.form = "Please add at least one activity or toggle 'No' for physical activity."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const weight_kg =
        unit === "metric" ? parseFloat(form.weight) : lbToKg(parseFloat(form.weight))
      const target_weight_kg =
        unit === "metric" ? parseFloat(form.target_weight) : lbToKg(parseFloat(form.target_weight))
      const height_cm =
        unit === "metric"
          ? parseFloat(form.height_cm)
          : ftInToCm(parseFloat(form.height_ft), parseFloat(form.height_in || "0"))

      const res = await fetch("/api/plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          date_of_birth: form.date_of_birth,
          gender: form.gender,
          height_cm,
          weight_kg,
          target_weight_kg,
          goal_days: parseInt(form.goal_days),
          unit_preference: unit,
          activities: form.has_activity ? form.activities : [],
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setErrors({ form: data.error || "Something went wrong. Please try again." })
        return
      }
      router.push(`/plan/${data.planId}`)
    } catch {
      setErrors({ form: "Network error. Please check your connection and try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Unit Toggle */}
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Measurement system</p>
        <UnitToggle value={unit} onChange={setUnit} />
      </div>

      {/* Personal Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
          Personal Information
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Alex Johnson"
            className="input-field"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => set("date_of_birth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="input-field"
          />
          {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Biological Sex{" "}
            <span className="text-xs text-gray-400 font-normal">
              (used for the <AcronymTooltip acronym="BMR" /> formula)
            </span>
          </label>
          <div className="flex gap-3">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set("gender", g)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                  form.gender === g
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>
      </section>

      {/* Body Measurements */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
          Body Measurements
        </h2>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
          </label>
          {unit === "metric" ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.height_cm}
                onChange={(e) => set("height_cm", e.target.value)}
                placeholder="170"
                min="100"
                max="250"
                className="input-field"
              />
              <span className="text-gray-500 text-sm whitespace-nowrap">cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.height_ft}
                onChange={(e) => set("height_ft", e.target.value)}
                placeholder="5"
                min="3"
                max="8"
                className="input-field"
              />
              <span className="text-gray-500 text-sm">ft</span>
              <input
                type="number"
                value={form.height_in}
                onChange={(e) => set("height_in", e.target.value)}
                placeholder="8"
                min="0"
                max="11"
                className="input-field"
              />
              <span className="text-gray-500 text-sm">in</span>
            </div>
          )}
          {(errors.height_cm || errors.height_ft) && (
            <p className="text-red-500 text-xs mt-1">{errors.height_cm || errors.height_ft}</p>
          )}
        </div>

        {/* Current Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Weight
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              placeholder={unit === "metric" ? "75" : "165"}
              step="0.1"
              className="input-field"
            />
            <span className="text-gray-500 text-sm">{unit === "metric" ? "kg" : "lb"}</span>
          </div>
          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
        </div>

        {/* Target Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Weight
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.target_weight}
              onChange={(e) => set("target_weight", e.target.value)}
              placeholder={unit === "metric" ? "68" : "150"}
              step="0.1"
              className="input-field"
            />
            <span className="text-gray-500 text-sm">{unit === "metric" ? "kg" : "lb"}</span>
          </div>
          {errors.target_weight && (
            <p className="text-red-500 text-xs mt-1">{errors.target_weight}</p>
          )}
        </div>

        {/* Goal Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Goal Deadline (days)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.goal_days}
              onChange={(e) => set("goal_days", e.target.value)}
              placeholder="90"
              min="14"
              max="730"
              className="input-field"
            />
            <span className="text-gray-500 text-sm">days</span>
          </div>
          {goalDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Goal date: <span className="font-medium text-green-600 dark:text-green-400">{goalDate}</span>
            </p>
          )}
          {errors.goal_days && <p className="text-red-500 text-xs mt-1">{errors.goal_days}</p>}
        </div>
      </section>

      {/* Physical Activity */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2">
          Physical Activity
        </h2>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Do you exercise regularly?
          </p>
          <div className="flex gap-3">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => set("has_activity", v)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.has_activity === v
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                {v ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {form.has_activity && (
          <div className="space-y-3">
            {form.activities.map((act, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Activity {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeActivity(i)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={act.activity_type}
                    onChange={(e) => updateActivity(i, "activity_type", e.target.value)}
                    className="input-field"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Days/week
                    </label>
                    <input
                      type="number"
                      value={act.frequency_per_week}
                      onChange={(e) =>
                        updateActivity(i, "frequency_per_week", parseInt(e.target.value) || 1)
                      }
                      min="1"
                      max="7"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Minutes/session
                    </label>
                    <input
                      type="number"
                      value={act.duration_minutes}
                      onChange={(e) =>
                        updateActivity(i, "duration_minutes", parseInt(e.target.value) || 30)
                      }
                      min="10"
                      max="300"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addActivity}
              className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add another activity
            </button>
          </div>
        )}

        {errors.form && (
          <SafetyAlert type="error" message={errors.form} />
        )}
      </section>

      {/* Glossary Collapsible */}
      <section className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGlossary(!showGlossary)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span>Acronym Glossary (BMR, TDEE, BMI…)</span>
          {showGlossary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showGlossary && (
          <div className="border-t dark:border-gray-700 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="pb-2 w-16">Term</th>
                  <th className="pb-2 w-40">Full Name</th>
                  <th className="pb-2">Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {GLOSSARY_ROWS.map((row) => (
                  <tr key={row.acronym} className="align-top">
                    <td className="py-2 font-bold text-green-700 dark:text-green-400 pr-3">{row.acronym}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-400 pr-3">{row.fullName}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">{row.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
        This plan is for informational purposes only and is not a substitute for advice from a registered dietitian or physician.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating your plan…
          </span>
        ) : (
          "Generate My Meal Plan →"
        )}
      </button>
    </form>
  )
}

const GLOSSARY_ROWS = [
  { acronym: "BMR", fullName: "Basal Metabolic Rate", definition: "Calories burned at complete rest to maintain basic body functions. ~60–70% of total daily burn." },
  { acronym: "TDEE", fullName: "Total Daily Energy Expenditure", definition: "Total calories burned per day, including BMR + activity + digestion (TEF)." },
  { acronym: "TEF", fullName: "Thermic Effect of Food", definition: "Energy spent digesting food. ~10% of total calories consumed." },
  { acronym: "BMI", fullName: "Body Mass Index", definition: "Weight ÷ height². A screening tool — not a direct measure of body fat." },
  { acronym: "kcal", fullName: "Kilocalorie", definition: "Standard unit of food energy. What labels call a 'calorie' is technically 1 kcal." },
  { acronym: "EPOC", fullName: "Excess Post-exercise Oxygen Consumption", definition: "Elevated calorie burn after intense exercise. The 'afterburn effect'." },
  { acronym: "LBM", fullName: "Lean Body Mass", definition: "Total weight minus fat. Includes muscle, bone, organs, and water. Higher LBM = higher BMR." },
  { acronym: "WHO", fullName: "World Health Organization", definition: "UN agency that sets global BMI classification standards." },
]
