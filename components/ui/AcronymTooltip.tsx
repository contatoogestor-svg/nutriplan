"use client"

import { useState } from "react"

const GLOSSARY: Record<string, string> = {
  BMR: "Basal Metabolic Rate — calories your body burns at complete rest to maintain basic functions.",
  TDEE: "Total Daily Energy Expenditure — total calories burned per day including activity and digestion.",
  TEF: "Thermic Effect of Food — energy spent digesting food (~10% of calories consumed).",
  BMI: "Body Mass Index — ratio of weight to height squared. A screening tool, not a direct fat measure.",
  kcal: "Kilocalorie — standard unit of food energy (what people call a 'calorie' on nutrition labels).",
  EPOC: "Excess Post-exercise Oxygen Consumption — elevated calorie burn after intense exercise ('afterburn effect').",
  LBM: "Lean Body Mass — total weight minus fat mass. Includes muscle, bone, organs, and water.",
  WHO: "World Health Organization — UN agency that sets global BMI classification standards.",
}

interface AcronymTooltipProps {
  acronym: string
  children?: React.ReactNode
}

export default function AcronymTooltip({ acronym, children }: AcronymTooltipProps) {
  const [visible, setVisible] = useState(false)
  const definition = GLOSSARY[acronym]

  if (!definition) return <span>{children ?? acronym}</span>

  return (
    <span className="relative inline-block">
      <button
        type="button"
        className="underline decoration-dotted cursor-help text-green-700 dark:text-green-400 font-semibold"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label={`Definition of ${acronym}`}
      >
        {children ?? acronym}
      </button>
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs p-3 shadow-xl leading-relaxed">
          <strong>{acronym}:</strong> {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </span>
      )}
    </span>
  )
}
