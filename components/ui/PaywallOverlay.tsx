"use client"

import { useState } from "react"
import { Lock, Zap, X } from "lucide-react"

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited meal plan regeneration",
  "Full PDF export (meal plan + shopping list)",
  "Weekly & monthly shopping list PDF",
  "Unlimited weekly check-ins",
  "Priority support",
]

interface PaywallOverlayProps {
  feature: string
  planId: string
  onClose?: () => void
  fullscreen?: boolean
}

export default function PaywallOverlay({ feature, planId, onClose, fullscreen }: PaywallOverlayProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleUpgrade = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <div className={fullscreen
      ? "fixed inset-0 z-[100] backdrop-blur-sm bg-black/40 flex items-center justify-center p-4"
      : "absolute inset-0 z-20 backdrop-blur-sm bg-white/80 dark:bg-gray-950/80 rounded-xl flex items-center justify-center p-4"
    }>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-sm w-full p-6 relative">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Unlock {feature}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upgrade to NutriPlan Pro and get full access.
          </p>
        </div>

        {/* Plan toggle */}
        <div className="flex gap-2 mb-4">
          {(["monthly", "annual"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPlan(p)}
              className={`flex-1 rounded-xl border-2 p-3 text-center transition-all ${
                selectedPlan === p
                  ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <p className={`text-xs font-medium capitalize ${selectedPlan === p ? "text-green-700 dark:text-green-400" : "text-gray-500"}`}>
                {p === "annual" ? "Annual (save 50%)" : "Monthly"}
              </p>
              <p className={`text-lg font-bold mt-0.5 ${selectedPlan === p ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                {p === "annual" ? "$4.92" : "$9.99"}
                <span className="text-xs font-normal">/mo</span>
              </p>
              {p === "annual" && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                  billed $59/year
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <p className="text-xs text-center text-green-600 dark:text-green-400 font-medium mb-3">
          ✓ 7-day free trial · Cancel anytime
        </p>

        {error && (
          <p className="text-red-500 text-xs text-center mb-3">{error}</p>
        )}

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-60 shadow-md"
        >
          {loading ? "Redirecting…" : "Start 7-Day Free Trial →"}
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
          No credit card charged until trial ends
        </p>
      </div>
    </div>
  )
}
