"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ArrowLeftRight, X } from "lucide-react"
import { formatFoodWeight } from "@/lib/unitConversion"
import { FOOD_DB } from "@/lib/mealDatabase"
import type { GeneratedMeal, ScaledFoodItem } from "@/lib/mealDatabase"
import dynamic from "next/dynamic"
import type { Profile, MealPlan } from "@/lib/supabase"
import PaywallOverlay from "@/components/ui/PaywallOverlay"

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

interface SwapTarget {
  mealName: string
  food: ScaledFoodItem
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
  const [showSwapPaywall, setShowSwapPaywall] = useState(false)
  const [localMeals, setLocalMeals] = useState<GeneratedMeal[]>(meals)
  const [swapTarget, setSwapTarget] = useState<SwapTarget | null>(null)
  const totalCals = protein_g * 4 + carbs_g * 4 + fat_g * 9

  function handleSwapClick(mealName: string, food: ScaledFoodItem) {
    if (!isPro) {
      setShowSwapPaywall(true)
      return
    }
    setSwapTarget({ mealName, food })
  }

  function applySwap(mealName: string, originalFoodId: string, replacement: ScaledFoodItem) {
    setLocalMeals((prev) =>
      prev.map((meal) => {
        if (meal.mealName !== mealName) return meal
        const newFoods = meal.foods.map((f) => (f.id === originalFoodId ? replacement : f))
        const newCals = newFoods.reduce((sum, f) => sum + f.scaledCalories, 0)
        const newProtein = Math.round(newFoods.reduce((sum, f) => sum + f.scaledProtein_g, 0) * 10) / 10
        const newCarbs = Math.round(newFoods.reduce((sum, f) => sum + f.scaledCarbs_g, 0) * 10) / 10
        const newFat = Math.round(newFoods.reduce((sum, f) => sum + f.scaledFat_g, 0) * 10) / 10
        return { ...meal, foods: newFoods, actualCalories: newCals, protein_g: newProtein, carbs_g: newCarbs, fat_g: newFat }
      })
    )
    setSwapTarget(null)
  }

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

      {/* Action buttons row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* PDF Export */}
        <div className="relative">
          {isPro ? (
            <PDFDownloadButton meals={localMeals} planData={planData} unitPref={unitPref} />
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

        {/* Substitute Foods button */}
        <div className="relative">
          {isPro ? (
            <button
              type="button"
              onClick={() => {}}
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium bg-green-50 dark:bg-green-900/10 cursor-default"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Substitute Foods — <span className="font-semibold">expand a meal below</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSwapPaywall(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span>🔒</span> Substitute Foods — <span className="text-green-600 dark:text-green-400 font-semibold">Pro</span>
            </button>
          )}
        </div>
      </div>

      {/* Swap paywall overlay */}
      {showSwapPaywall && (
        <PaywallOverlay feature="Food Substitution" planId={planId} onClose={() => setShowSwapPaywall(false)} />
      )}

      {/* Meals */}
      <div className="space-y-3">
        {localMeals.map((meal) => {
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
                        <tr
                          key={food.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/30 group"
                        >
                          <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <span>{food.name}</span>
                              <button
                                type="button"
                                onClick={() => handleSwapClick(meal.mealName, food)}
                                title={isPro ? "Swap this food" : "Pro feature — swap food"}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md ${
                                  isPro
                                    ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                              >
                                <ArrowLeftRight className="w-3 h-3" />
                                {!isPro
                                  ? <span className="text-xs">Substitute — Pro Plan</span>
                                  : <span className="text-xs">Substitute</span>
                                }
                              </button>
                            </div>
                          </td>
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

      {/* Swap Modal */}
      {swapTarget && (
        <SwapModal
          target={swapTarget}
          unitPref={unitPref}
          onSwap={(replacement) => applySwap(swapTarget.mealName, swapTarget.food.id, replacement)}
          onClose={() => setSwapTarget(null)}
        />
      )}
    </div>
  )
}

function SwapModal({
  target,
  unitPref,
  onSwap,
  onClose,
}: {
  target: SwapTarget
  unitPref: "metric" | "imperial"
  onSwap: (replacement: ScaledFoodItem) => void
  onClose: () => void
}) {
  const { food } = target

  // Build alternatives: same category, exclude current food, scale to match original calories
  const alternatives: ScaledFoodItem[] = FOOD_DB
    .filter((f) => f.category === food.category && f.id !== food.id)
    .map((f) => {
      const factor = food.scaledCalories / f.calories
      return {
        ...f,
        scaleFactor: factor,
        scaledGrams: Math.round(f.gramsPerServing * factor),
        scaledCalories: food.scaledCalories,
        scaledProtein_g: Math.round(f.protein_g * factor * 10) / 10,
        scaledCarbs_g: Math.round(f.carbs_g * factor * 10) / 10,
        scaledFat_g: Math.round(f.fat_g * factor * 10) / 10,
      }
    })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Swap Food</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Replacing: <span className="font-medium text-gray-700 dark:text-gray-300">{food.name}</span> — {food.scaledCalories} kcal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alternatives list */}
        <div className="overflow-y-auto max-h-80">
          {alternatives.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No alternatives available in this category.</p>
          ) : (
            <ul className="divide-y dark:divide-gray-800">
              {alternatives.map((alt) => (
                <li key={alt.id}>
                  <button
                    type="button"
                    onClick={() => onSwap(alt)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-400">
                        {alt.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatFoodWeight(alt.scaledGrams, unitPref)}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-4">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{alt.scaledCalories} kcal</p>
                      <p>P: <span className="text-blue-600 dark:text-blue-400">{alt.scaledProtein_g}g</span> C: <span className="text-amber-600 dark:text-amber-400">{alt.scaledCarbs_g}g</span> F: <span className="text-orange-600 dark:text-orange-400">{alt.scaledFat_g}g</span></p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Portions are scaled to maintain the same caloric value as the original item.
          </p>
        </div>
      </div>
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
