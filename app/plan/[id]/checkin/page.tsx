import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Salad } from "lucide-react"
import CheckinClient from "./CheckinClient"

async function getPlanData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const [planRes, logsRes] = await Promise.all([
    fetch(`${baseUrl}/api/plans/${id}`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/plans/${id}/checkin`, { cache: "no-store" }),
  ])
  if (!planRes.ok) return null
  const planData = await planRes.json()
  const logsData = logsRes.ok ? await logsRes.json() : { logs: [] }
  return { ...planData, logs: logsData.logs }
}

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getPlanData(id)
  if (!data) notFound()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
            <Salad className="w-5 h-5" />
            NutriPlan
          </Link>
          <Link
            href={`/plan/${id}`}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plan
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Weekly Check-in
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Track your actual progress vs your projected timeline.
        </p>
        <CheckinClient
          planId={id}
          profile={data.profile}
          plan={data.plan}
          initialLogs={data.logs}
        />
      </div>
    </main>
  )
}
