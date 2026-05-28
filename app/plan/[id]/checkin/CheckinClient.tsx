"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { kgToLb, lbToKg } from "@/lib/unitConversion"
import type { Profile, MealPlan, WeightLog } from "@/lib/supabase"
import type { ProjectedWeek } from "@/lib/nutrition"
import SafetyAlert from "@/components/ui/SafetyAlert"

interface CheckinClientProps {
  planId: string
  profile: Profile
  plan: MealPlan
  initialLogs: WeightLog[]
}

export default function CheckinClient({ planId, profile, plan, initialLogs }: CheckinClientProps) {
  const [logs, setLogs] = useState<WeightLog[]>(initialLogs)
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const unit = profile.unit_preference
  const convert = (kg: number) => unit === "imperial" ? Math.round(kgToLb(kg) * 10) / 10 : kg
  const unitLabel = unit === "imperial" ? "lb" : "kg"
  const projectedWeights: ProjectedWeek[] = plan.plan_json.projectedWeights || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    const w = parseFloat(weight)
    if (!w || w < 20) {
      setError("Please enter a valid weight.")
      return
    }
    setLoading(true)

    const weight_kg = unit === "imperial" ? lbToKg(w) : w

    try {
      const res = await fetch(`/api/plans/${planId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight_kg, notes }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to save check-in.")
        return
      }
      setLogs(data.logs)
      setWeight("")
      setNotes("")
      setSuccess(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Build chart data: merge projected + actual
  const planStartDate = new Date(plan.created_at)

  const chartData = projectedWeights.map((pw) => {
    const projDate = new Date(pw.date)
    const weekMs = 7 * 24 * 60 * 60 * 1000
    // Find the most recent actual log near this week
    const actual = logs.find((log) => {
      const logDate = new Date(log.logged_at)
      const diff = Math.abs(logDate.getTime() - projDate.getTime())
      return diff <= weekMs / 2
    })

    return {
      week: `W${pw.week}`,
      projected: convert(pw.projectedWeight_kg),
      actual: actual ? convert(actual.weight_kg) : undefined,
    }
  })

  return (
    <div className="space-y-6">
      {/* Check-in form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Log Today's Weight
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Weight ({unitLabel})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === "imperial" ? "165.0" : "75.0"}
                step="0.1"
                className="input-field"
              />
              <span className="text-gray-500 text-sm">{unitLabel}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Any changes this week?"
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {error && <SafetyAlert type="error" message={error} />}
          {success && (
            <SafetyAlert type="info" message="Check-in saved! Keep up the great work." />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save Check-in"}
          </button>
        </form>
      </div>

      {/* Chart */}
      {logs.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Actual vs Projected
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                interval={Math.max(1, Math.floor(chartData.length / 8))}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) => `${v}`}
                domain={["auto", "auto"]}
                width={50}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value} ${unitLabel}`,
                  name === "projected" ? "Projected" : "Actual",
                ]}
              />
              <Legend
                formatter={(value) => (value === "projected" ? "Projected" : "Actual")}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#639922"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#1D9E75"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#1D9E75" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log history */}
      {logs.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Check-in History ({logs.length})
            </h2>
          </div>
          <ul className="divide-y dark:divide-gray-800">
            {[...logs].reverse().map((log) => (
              <li key={log.id} className="px-5 py-3 flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {convert(log.weight_kg)} {unitLabel}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.logged_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.notes}</p>
                  )}
                </div>
                <div className="text-xs text-right">
                  {(() => {
                    const diff = log.weight_kg - profile.weight_kg
                    const displayDiff = unit === "imperial"
                      ? (diff * 2.20462).toFixed(1)
                      : diff.toFixed(1)
                    const isLoss = diff < 0
                    return (
                      <span className={isLoss ? "text-green-600 dark:text-green-400" : "text-red-500"}>
                        {isLoss ? "" : "+"}{displayDiff} {unitLabel}
                      </span>
                    )
                  })()}
                  <p className="text-gray-400 dark:text-gray-500">vs start</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-600">
          <p className="text-sm">No check-ins yet. Log your first weight above!</p>
        </div>
      )}
    </div>
  )
}
