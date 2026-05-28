"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { generateShoppingList, type ShoppingCategory } from "@/lib/mealDatabase"
import { formatFoodWeight } from "@/lib/unitConversion"
import type { GeneratedMeal } from "@/lib/mealDatabase"
import dynamic from "next/dynamic"
import PaywallOverlay from "@/components/ui/PaywallOverlay"

const ShoppingListPDFButton = dynamic(
  () => import("@/components/pdf/ShoppingListPDFButton"),
  { ssr: false }
)

interface ShoppingListTabProps {
  meals: GeneratedMeal[]
  unitPref: "metric" | "imperial"
  userName: string
  isPro: boolean
  planId: string
}

const CATEGORY_ICONS: Record<ShoppingCategory, string> = {
  Proteins: "🥩",
  "Carbohydrates & Grains": "🌾",
  Dairy: "🥛",
  "Fruits & Vegetables": "🥦",
  "Healthy Fats": "🥑",
  Other: "📦",
}

export default function ShoppingListTab({ meals, unitPref, userName, isPro, planId }: ShoppingListTabProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly")
  const [showPaywall, setShowPaywall] = useState(false)

  const list = generateShoppingList(meals, period)
  const categories = Object.keys(list) as ShoppingCategory[]

  const formatQty = (qty: number, unit: string) => {
    if (unit === "grams") {
      return unitPref === "imperial"
        ? `${Math.round((qty / 28.35) * 10) / 10} oz`
        : `${qty}g`
    }
    if (unit === "ml") return `${qty} ml`
    return `${qty} ${unit}`
  }

  // ── FREE TIER: teaser view ─────────────────────────────────────────────────
  if (!isPro) {
    const firstCat = categories[0]
    const firstItems = firstCat ? (list[firstCat] ?? []).slice(0, 4) : []
    const blurCats = categories.slice(1, 3)

    return (
      <div className="space-y-4">
        {/* Teaser: first category visible */}
        {firstCat && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800 flex items-center gap-2">
              <span className="text-lg">{CATEGORY_ICONS[firstCat]}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{firstCat}</span>
              <span className="ml-auto text-xs text-gray-400">{(list[firstCat] ?? []).length} items</span>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {firstItems.map((item, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {formatQty(item.quantity, item.unit)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blurred preview + lock */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="blur-sm pointer-events-none select-none space-y-4">
            {blurCats.map((cat) => {
              const items = list[cat] ?? []
              return (
                <div key={cat} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800 flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{cat}</span>
                    <span className="ml-auto text-xs text-gray-400">{items.length} items</span>
                  </div>
                  <ul className="divide-y dark:divide-gray-800">
                    {items.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {formatQty(item.quantity, item.unit)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Gradient + CTA */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 dark:via-gray-950/70 to-white dark:to-gray-950" />
          <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-3 pb-6 pt-12">
            <div className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Full shopping list · Pro only
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
              {categories.length} categories · organized by food group · weekly &amp; monthly view · PDF export
            </p>
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-md"
            >
              Unlock Full Shopping List →
            </button>
          </div>
        </div>

        {showPaywall && (
          <PaywallOverlay feature="Shopping List" planId={planId} onClose={() => setShowPaywall(false)} fullscreen />
        )}
      </div>
    )
  }

  // ── PRO TIER: full view ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">View:</span>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {(["weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                period === p
                  ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {period === "monthly" && (
          <span className="text-xs text-gray-400 dark:text-gray-500">(×4.3 weekly quantities)</span>
        )}
      </div>

      {/* PDF Download */}
      <ShoppingListPDFButton list={list} period={period} unitPref={unitPref} userName={userName} />

      {/* Lists by category */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const items = list[cat]
          if (!items || items.length === 0) return null
          return (
            <div key={cat} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800 flex items-center gap-2">
                <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{cat}</span>
                <span className="ml-auto text-xs text-gray-400">{items.length} items</span>
              </div>
              <ul className="divide-y dark:divide-gray-800">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatQty(item.quantity, item.unit)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Quantities are estimates based on your meal plan. Adjust for personal preferences and waste.
        {period === "monthly" && " Monthly = weekly × 4.3 weeks."}
      </p>
    </div>
  )
}
