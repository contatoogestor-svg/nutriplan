"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { Download } from "lucide-react"
import MealPlanPDF from "./MealPlanPDF"
import type { GeneratedMeal } from "@/lib/mealDatabase"

interface PDFDownloadButtonProps {
  meals: GeneratedMeal[]
  planData: {
    profile: { name: string; gender: string; weight_kg: number; target_weight_kg: number; goal_days: number; unit_preference: string }
    plan: { bmr: number; tdee: number; target_calories: number; daily_deficit: number; protein_g: number; carbs_g: number; fat_g: number; plan_json: { bmi: number; bmiCategory: string; estimatedWeeklyLoss_kg: number; projectedWeights: import("@/lib/nutrition").ProjectedWeek[] } }
  }
  unitPref: "metric" | "imperial"
}

export default function PDFDownloadButton({ meals, planData, unitPref }: PDFDownloadButtonProps) {
  const doc = (
    <MealPlanPDF
      profile={{
        ...planData.profile,
        unit_preference: unitPref,
      }}
      plan={planData.plan}
      meals={meals}
    />
  )

  return (
    <PDFDownloadLink
      document={doc}
      fileName={`nutriplan-${planData.profile.name.toLowerCase().replace(/\s+/g, "-")}.pdf`}
    >
      {({ loading }) => (
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          disabled={loading}
        >
          <Download className="w-4 h-4" />
          {loading ? "Preparing PDF…" : "Export Full Plan PDF"}
        </button>
      )}
    </PDFDownloadLink>
  )
}
