import OnboardingForm from "@/components/forms/OnboardingForm"
import Link from "next/link"
import { Salad, ArrowLeft } from "lucide-react"

export default function StartPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
            <Salad className="w-6 h-6" />
            NutriPlan
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Build Your Meal Plan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Takes 2 minutes. 100% free. No credit card required.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
          <OnboardingForm />
        </div>
      </div>
    </main>
  )
}
