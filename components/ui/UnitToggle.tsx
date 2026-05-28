"use client"

interface UnitToggleProps {
  value: "metric" | "imperial"
  onChange: (unit: "metric" | "imperial") => void
}

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
      <button
        type="button"
        onClick={() => onChange("metric")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          value === "metric"
            ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        }`}
      >
        Metric (kg / cm)
      </button>
      <button
        type="button"
        onClick={() => onChange("imperial")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          value === "imperial"
            ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        }`}
      >
        Imperial (lb / ft·in)
      </button>
    </div>
  )
}
