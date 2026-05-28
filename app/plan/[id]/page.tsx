import { notFound } from "next/navigation"
import Link from "next/link"
import { Salad, Calendar } from "lucide-react"
import PlanDashboard from "./PlanDashboard"

async function getPlan(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/plans/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function PlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ upgrade?: string; session_id?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const upgradeSession = sp.upgrade === "success" && sp.session_id ? sp.session_id : undefined

  const data = await getPlan(id)
  if (!data) notFound()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
            <Salad className="w-5 h-5" />
            NutriPlan
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/plan/${id}/checkin`}
              className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Check-in
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <PlanDashboard data={data} planId={id} upgradeSession={upgradeSession} />
      </div>
    </main>
  )
}
