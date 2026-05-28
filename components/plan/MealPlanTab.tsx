"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { formatFoodWeight } from "@/lib/unitConversion"
import type { GeneratedMeal } from "@/lib/mealDatabase"
import dynamic from "next/dynamic"
import type { Profile, MealPlan } from "@/lib/supabase"
import PaywallOverlay from "@/components/ui/PaywallOverlay"
import { isProUser } from "@/lib/subscription"

const PDFDownloadButton = dynamic(() => import("@/components/pdf/PDFDownloadButton"), { ssr: false })

interface MealPlanTabProps {
  meals: GeneratedMeal[]
  targetCalories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  unitPref: "metric" | "imperial"
  isPro: boolean
  planId: string
  planData: {
    profile: Profile
    plan: MealPlan
  }
}

export default function MealPlanTab({
  meals,
  targetCalories,
  protein_g,
  carbs_g,
  fat_g,
  unitPref,
  isPro,
  planId,
  planData,
}: MealPlanTabProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [showPaywall, setShowPaywall] = useState(false)
  const totalCals = protein_g * 4 + carbs_g * 4 + fat_g * 9

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Daily Nutrition Target
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <NutrientBadge label="Calories" value={targetCalories} unit="kcal" color="green" />
          <NutrientBadge label="Protein" value={protein_g} unit="g" color="blue" />
          <NutrientBadge label="Carbs" value={carbs_g} unit="g" color="amber" />
          <NutrientBadge label="Fat" value={fat_g} unit="g" color="orange" />
        </div>
        {/* Macro bar */}
        <div className="space-y-1">
          <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 transition-all"
              style={{ width: `${Math.round((protein_g * 4 / totalCals) * 100)}%` }}
            />
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${Math.round((carbs_g * 4 / totalCals) * 100)}%` }}
            />
            <div
              className="bg-orange-400 transition-all"
              style={{ width: `${Math.round((fat_g * 9 / totalCals) * 100)}%` }}
            />
          </div>
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Protein {Math.round((protein_g * 4 / totalCals) * 100)}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Carbs {Math.round((carbs_g * 4 / totalCals) * 100)}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Fat {Math.round((fat_g * 9 / totalCals) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* PDF Export */}
      <div className="relative">
        {isPro ? (
          <PDFDownloadButton meals={meals} planData={planData} unitPref={unitPref} />
        ) : (
          <button
            type="button"
            onClick={() => setShowPaywall(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span>🔒</span> Export Full Plan PDF — <span className="text-green-600 dark:text-green-400 font-semibold">Pro</span>
          </button>
        )}
        {showPaywall && (
          <PaywallOverlay feature="PDF Export" planId={planId} onClose={() => setShowPaywall(false)} />
        )}
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {meals.map((meal) => {
          const key = meal.mealName
          const open = expanded[key] ?? false
          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setExpanded((p) => ({ ...p, [key]: !open }))}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{meal.mealName}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{meal.mealTime}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{meal.actualCalories} kcal</span>
                    <span>P: {meal.protein_g}g</span>
                    <span>C: {meal.carbs_g}g</span>
                    <span>F: {meal.fat_g}g</span>
                  </div>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {open && (
                <div className="border-t dark:border-gray-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
                        <th className="text-left px-4 py-2">Food</th>
                        <th className="text-right px-4 py-2">Amount</th>
                        <th className="text-right px-4 py-2">Cal</th>
                        <th className="text-right px-4 py-2">P</th>
                        <th className="text-right px-4 py-2">C</th>
                        <th className="text-right px-4 py-2">F</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                      {meal.foods.map((food) => (
                        <tr key={food.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{food.name}</td>
                          <td className="px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatFoodWeight(food.scaledGrams, unitPref)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{food.scaledCalories}</td>
                          <td className="px-4 py-2.5 text-right text-blue-600 dark:text-blue-400">{food.scaledProtein_g}g</td>
                          <td className="px-4 py-2.5 text-right text-amber-600 dark:text-amber-400">{food.scaledCarbs_g}g</td>
                          <td className="px-4 py-2.5 text-right text-orange-600 dark:text-orange-400">{food.scaledFat_g}g</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Portions are scaled to your caloric target. Adjust quantities as needed based on hunger and satiety cues.
      </p>
    </div>
  )
}

function NutrientBadge({
  label,
  value,
  unit,
  color,
}: {
  label: string
  value: number
  unit: string
  color: "green" | "blue" | "amber" | "orange"
}) {
  const colors = {
    green: "text-green-700 dark:text-green-400",
    blue: "text-blue-700 dark:text-blue-400",
    amber: "text-amber-700 dark:text-amber-400",
    orange: "text-orange-700 dark:text-orange-400",
  }
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  )
}
