"use client"

import { useState } from "react"
import { Lock, ClipboardCheck, ChevronDown, ChevronUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { kgToLb, lbToKg } from "@/lib/unitConversion"
import type { ProjectedWeek } from "@/lib/nutrition"
import type { WeightLog } from "@/lib/supabase"
import PaywallOverlay from "@/components/ui/PaywallOverlay"
import SafetyAlert from "@/components/ui/SafetyAlert"

interface TimelineTabProps {
  projectedWeights: ProjectedWeek[]
  startWeight_kg: number
  targetWeight_kg: number
  unitPref: "metric" | "imperial"
  estimatedWeeklyLoss_kg: number
  isPro: boolean
  planId: string
  initialLogs?: WeightLog[]
}

export default function TimelineTab({
  projectedWeights,
  startWeight_kg,
  targetWeight_kg,
  unitPref,
  estimatedWeeklyLoss_kg,
  isPro,
  planId,
  initialLogs = [],
}: TimelineTabProps) {
  const [showPaywall, setShowPaywall] = useState(false)
  const [logs, setLogs] = useState<WeightLog[]>(initialLogs)
  const [showCheckin, setShowCheckin] = useState(false)
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [checkinError, setCheckinError] = useState("")
  const [checkinSuccess, setCheckinSuccess] = useState(false)

  const convert = (kg: number) =>
    unitPref === "imperial" ? Math.round(kgToLb(kg) * 10) / 10 : kg
  const unit = unitPref === "imperial" ? "lb" : "kg"
  const weeklyLossDisplay = unitPref === "imperial"
    ? `${(estimatedWeeklyLoss_kg * 2.20462).toFixed(1)} lb`
    : `${estimatedWeeklyLoss_kg.toFixed(2)} kg`

  // Build chart data merging projected + actual
  const chartData = projectedWeights.map((pw) => {
    const projDate = new Date(pw.date)
    const weekMs = 7 * 24 * 60 * 60 * 1000
    const actual = logs.find((log) => {
      const diff = Math.abs(new Date(log.logged_at).getTime() - projDate.getTime())
      return diff <= weekMs / 2
    })
    return {
      week: `W${pw.week}`,
      projected: convert(pw.projectedWeight_kg),
      actual: actual ? convert(actual.weight_kg) : undefined,
    }
  })

  const targetDisplay = convert(targetWeight_kg)
  const milestones = projectedWeights.filter((w) => w.milestone)

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault()
    setCheckinError("")
    setCheckinSuccess(false)
    const w = parseFloat(weight)
    if (!w || w < 20) { setCheckinError("Please enter a valid weight."); return }
    setSaving(true)
    const weight_kg = unitPref === "imperial" ? lbToKg(w) : w
    try {
      const res = await fetch(`/api/plans/${planId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight_kg, notes }),
      })
      const data = await res.json()
      if (!res.ok) { setCheckinError(data.error || "Failed to save."); return }
      setLogs(data.logs)
      setWeight("")
      setNotes("")
      setCheckinSuccess(true)
    } catch { setCheckinError("Network error. Please try again.") }
    finally { setSaving(false) }
  }

  // Stat cards shown to everyone
  const statCards = (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <StatCard label="Starting Weight" value={`${convert(startWeight_kg)} ${unit}`} color="gray" />
      <StatCard label="Goal Weight" value={`${targetDisplay} ${unit}`} color="green" />
      <StatCard
        label="Est. Weekly Loss"
        value={weeklyLossDisplay}
        color="teal"
        className="col-span-2 sm:col-span-1"
      />
    </div>
  )

  // ── Check-in panel ────────────────────────────────────────────────────────────
  const checkinPanel = (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setShowCheckin(!showCheckin)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Log Today's Weight
          </span>
          {logs.length > 0 && (
            <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              {logs.length} check-in{logs.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {showCheckin ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {showCheckin && (
        <div className="border-t dark:border-gray-800 p-5 space-y-4">
          <form onSubmit={handleCheckin} className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unitPref === "imperial" ? "165.0" : "75.0"}
                step="0.1"
                className="input-field flex-1"
              />
              <span className="text-gray-500 text-sm shrink-0">{unit}</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? (optional)"
              rows={2}
              className="input-field resize-none w-full"
            />
            {checkinError && <SafetyAlert type="error" message={checkinError} />}
            {checkinSuccess && <SafetyAlert type="info" message="Check-in saved! Keep it up." />}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Check-in"}
            </button>
          </form>

          {/* History */}
          {logs.length > 0 && (
            <div className="border-t dark:border-gray-800 pt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Check-in History
              </p>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {[...logs].reverse().map((log) => {
                  const diff = log.weight_kg - startWeight_kg
                  const displayDiff = unitPref === "imperial"
                    ? (diff * 2.20462).toFixed(1)
                    : diff.toFixed(1)
                  const isLoss = diff < 0
                  return (
                    <li key={log.id} className="flex items-start justify-between text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {convert(log.weight_kg)} {unit}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(log.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        {log.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.notes}</p>
                        )}
                      </div>
                      <span className={`text-xs font-medium shrink-0 ml-3 ${isLoss ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                        {isLoss ? "" : "+"}{displayDiff} {unit}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // ── FREE TIER ─────────────────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <div className="space-y-4">
        {statCards}

        {/* Blurred chart preview + lock */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="blur-sm pointer-events-none select-none space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Projected Weight Timeline
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} interval={Math.max(1, Math.floor(chartData.length / 8))} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} domain={["auto", "auto"]} tickFormatter={(v) => `${v}`} width={45} />
                  <ReferenceLine y={targetDisplay} stroke="#1D9E75" strokeDasharray="6 3" />
                  <Line type="monotone" dataKey="projected" stroke="#639922" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-2">
                {milestones.slice(0, 2).map((m, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold text-green-700 dark:text-green-400 flex-shrink-0">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.milestone}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Week {m.week}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 dark:via-gray-950/60 to-white dark:to-gray-950" />
          <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-3 pb-8 pt-16">
            <div className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Progress Timeline · Pro only
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
              Week-by-week projection · milestone tracking · actual vs projected check-ins
            </p>
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-md"
            >
              Unlock Progress Timeline →
            </button>
          </div>
        </div>

        {showPaywall && (
          <PaywallOverlay feature="Progress Timeline" planId={planId} onClose={() => setShowPaywall(false)} fullscreen />
        )}
      </div>
    )
  }

  // ── PRO TIER ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {statCards}

      {/* Inline Check-in */}
      {checkinPanel}

      {/* Chart — projected + actual */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {logs.length > 0 ? "Actual vs Projected Weight" : "Projected Weight Timeline"}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              interval={Math.max(1, Math.floor(chartData.length / 10))}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `${v} ${unit}`}
              width={60}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value} ${unit}`,
                name === "projected" ? "Projected" : "Actual",
              ]}
              labelFormatter={(label) => `Week ${String(label).replace("W", "")}`}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            />
            {logs.length > 0 && (
              <Legend formatter={(value) => (value === "projected" ? "Projected" : "Actual")} />
            )}
            <ReferenceLine
              y={targetDisplay}
              stroke="#1D9E75"
              strokeDasharray="6 3"
              label={{ value: "Goal", fill: "#1D9E75", fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#639922"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
            {logs.length > 0 && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#1D9E75"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#1D9E75" }}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Milestones</h3>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold text-green-700 dark:text-green-400 flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.milestone}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Week {m.week} · {new Date(m.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    {" · "}
                    {convert(m.projectedWeight_kg)} {unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Week-by-Week Projection</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white dark:bg-gray-900">
              <tr className="text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-800">
                <th className="text-left px-4 py-2">Week</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-right px-4 py-2">Weight</th>
                <th className="text-left px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {projectedWeights.map((w) => (
                <tr key={w.week} className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 ${w.milestone ? "bg-green-50/50 dark:bg-green-900/10" : ""}`}>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">Week {w.week}</td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-800 dark:text-gray-200">
                    {convert(w.projectedWeight_kg)} {unit}
                  </td>
                  <td className="px-4 py-2 text-xs text-green-600 dark:text-green-400">{w.milestone || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Projections assume consistent adherence to your meal plan. Actual results may vary.
      </p>
    </div>
  )
}

function StatCard({ label, value, color, className = "" }: { label: string; value: string; color: "gray" | "green" | "teal"; className?: string }) {
  const colors = { gray: "text-gray-700 dark:text-gray-200", green: "text-green-700 dark:text-green-400", teal: "text-teal-700 dark:text-teal-400" }
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm ${className}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${colors[color]}`}>{value}</p>
    </div>
  )
}
