import AuthForm from "@/components/auth/AuthForm"
import Link from "next/link"
import { Salad, CheckCircle } from "lucide-react"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
            <Salad className="w-6 h-6" />
            NutriPlan
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">Create free account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No credit card required</p>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {["Personalized 6-meal/day plan", "Science-based calculations", "Progress tracking & check-ins"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
          <AuthForm mode="signup" redirectTo={redirect} />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}
