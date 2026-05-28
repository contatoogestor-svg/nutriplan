import AuthForm from "@/components/auth/AuthForm"
import Link from "next/link"
import { Salad } from "lucide-react"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; message?: string }>
}) {
  const { redirect, message } = await searchParams
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
            <Salad className="w-6 h-6" />
            NutriPlan
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to access your meal plans</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm text-center">
              {message}
            </div>
          )}
          <AuthForm mode="login" redirectTo={redirect} />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
