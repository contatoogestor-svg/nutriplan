import Link from "next/link"
import { Salad, CheckCircle, ChevronRight, Star, Zap, ShieldCheck, BarChart2, FileDown, ShoppingBasket, TrendingUp, BarChart } from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { createServerClient } from "@/lib/supabase"
import UserMenu from "@/components/ui/UserMenu"

export default async function LandingPage() {
  let myPlanId: string | null = null
  let userEmail: string | null = null
  try {
    const supabaseAuth = await createSupabaseServerClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (user) {
      userEmail = user.email ?? null
      const supabase = createServerClient()
      const { data: profile } = await supabase
        .from("profiles").select("id").eq("user_id", user.id).single()
      if (profile) {
        const { data: plan } = await supabase
          .from("meal_plans").select("id").eq("profile_id", profile.id)
          .order("created_at", { ascending: false }).limit(1).single()
        if (plan) myPlanId = plan.id
      }
    }
  } catch { /* not logged in */ }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">

      {/* ── NAV ── */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
            <Salad className="w-6 h-6" />
            NutriPlan
          </div>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <UserMenu email={userEmail} planId={myPlanId ?? undefined} />
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/start" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all shadow-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO — split layout ── */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-green-200 dark:border-green-800">
              <Zap className="w-3.5 h-3.5" />
              Science-based · No guesswork · 100% free to start
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
              Your Personalized<br />
              <span className="text-green-600 dark:text-green-400">Balanced Diet</span> for<br />
              Weight Loss
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Get a science-based meal plan tailored to your body, goals, and lifestyle — in 2 minutes.
              Based on the same formulas used by registered dietitians.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <Link
                href="/start"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-base transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Generate My Free Meal Plan
                <ChevronRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-400 mt-2 sm:mt-3">No credit card · Ready in 2 min</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Trusted by thousands on their weight loss journey
              </span>
            </div>
          </div>

          {/* Hero image + floating cards */}
          <div className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"
                alt="Healthy balanced meal"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <BarChart className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Daily Target</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">1,650 kcal</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 border border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Plan ready!</p>
                <p className="text-xs text-gray-400">Generated in 1m 42s</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white dark:bg-gray-950 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            No complicated apps, no generic plans. NutriPlan calculates exactly what your body needs.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PREVIEW ── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              See inside the platform
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              A complete dashboard — meal plan, shopping list, progress timeline, and exercise guide — all in one place.
            </p>
          </div>

          {/* Main browser mockup */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl max-w-4xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 dark:border-gray-500">
                nutriplan.sbs/plan/...
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nathan's Meal Plan</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Generated June 1, 2026 · Goal: 80 kg in 60 days</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "BMR", value: "1,847" },
                  { label: "TDEE", value: "2,539" },
                  { label: "Target", value: "1,650", highlight: true },
                  { label: "Daily Deficit", value: "889" },
                ].map((m) => (
                  <div key={m.label} className={`rounded-xl border p-3 text-center shadow-sm ${m.highlight ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800" : "border-gray-100 dark:border-gray-700"}`}>
                    <p className="text-xs text-gray-400 mb-0.5">{m.label}</p>
                    <p className={`text-lg font-bold ${m.highlight ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>{m.value}</p>
                    <p className="text-xs text-gray-400">kcal/day</p>
                  </div>
                ))}
              </div>
              <div className="flex border-b border-gray-100 dark:border-gray-700 gap-1 mb-4 overflow-x-auto">
                {["🍽 Meal Plan", "🛒 Shopping List", "📈 Progress Timeline", "💪 Exercise"].map((t, i) => (
                  <div key={t} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px ${i === 0 ? "border-green-600 text-green-700 dark:text-green-400" : "border-transparent text-gray-400"}`}>{t}</div>
                ))}
              </div>
              <div className="space-y-2">
                {PREVIEW_MEALS.map((meal) => (
                  <div key={meal.name} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${meal.bg} rounded-lg flex items-center justify-center text-sm`}>{meal.emoji}</div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{meal.name}</p>
                        <p className="text-xs text-gray-400">{meal.food}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{meal.kcal}</p>
                      <p className="text-xs text-gray-400">{meal.macros}</p>
                    </div>
                  </div>
                ))}
                <p className="text-center text-xs text-gray-400 pt-1">+ 3 more meals · Total: 1,650 kcal/day</p>
              </div>
            </div>
          </div>

          {/* 3 smaller previews */}
          <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" /></div>
                <span className="text-xs text-gray-400">Shopping List</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">🛒 Weekly Shopping List</p>
                <div className="space-y-2">
                  {["Greek yogurt (500g)", "Chicken breast (800g)", "Quinoa (400g)", "Mixed berries (300g)", "Almonds (200g)"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded border border-gray-300 dark:border-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 mt-1">+ 14 more items</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" /></div>
                <span className="text-xs text-gray-400">Progress Timeline</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">📈 Weight Projection</p>
                <div className="flex items-end gap-1 h-20 mb-2">
                  {[100, 92, 84, 76, 68, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-green-500" style={{ height: `${h}%`, opacity: 0.4 + i * 0.12 }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Week 1</span><span>Week 4</span><span>Week 8</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">−0.9 kg/week projected</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" /></div>
                <span className="text-xs text-gray-400">Exercise</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">💪 Recommended Activities</p>
                <div className="space-y-2">
                  {[
                    { name: "Brisk Walking", detail: "30 min · 3×/week", kcal: "~210 kcal" },
                    { name: "Cycling", detail: "20 min · 2×/week", kcal: "~180 kcal" },
                    { name: "Strength Training", detail: "40 min · 2×/week", kcal: "~240 kcal" },
                  ].map(ex => (
                    <div key={ex.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{ex.name}</p>
                        <p className="text-xs text-gray-400">{ex.detail}</p>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">{ex.kcal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
            Real results from real people
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Thousands are reaching their goals with NutriPlan.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCIENCE PROOF ── */}
      <section className="bg-green-600 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck className="w-10 h-10 text-green-200 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Built on peer-reviewed nutrition science
          </h2>
          <p className="text-green-100 max-w-xl mx-auto mb-6 leading-relaxed">
            Your BMR is calculated using the Mifflin-St Jeor equation (Am J Clin Nutr, 1990).
            Caloric deficit based on the Wishnofsky Rule. BMI classified by WHO standards.
          </p>
          <Link href="/science" className="inline-flex items-center gap-2 text-white border border-green-400 hover:border-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors">
            Read the science
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="max-w-5xl mx-auto px-4 py-20" id="pricing">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
          Start free. Upgrade only when you're ready.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Free</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$0</p>
            <p className="text-sm text-gray-400 mb-6">forever</p>
            <ul className="space-y-3 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/start" className="block text-center py-2.5 rounded-xl border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
              Get Started Free
            </Link>
          </div>
          <div className="bg-green-600 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">MOST POPULAR</div>
            <p className="text-sm font-semibold text-green-100 mb-1">Pro</p>
            <div className="flex items-end gap-2 mb-1">
              <p className="text-4xl font-bold text-white">$4.92</p>
              <p className="text-green-200 text-sm mb-1">/mo</p>
            </div>
            <p className="text-sm text-green-200 mb-6">billed $59/year · or $9.99/month</p>
            <ul className="space-y-3 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-green-50">
                  <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/start" className="block text-center py-2.5 rounded-xl bg-white text-green-700 font-bold text-sm hover:bg-green-50 transition-colors shadow-md">
              Start 7-Day Free Trial →
            </Link>
            <p className="text-xs text-green-200 text-center mt-2">No credit card until trial ends</p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to start eating better?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Generate your personalized meal plan in 2 minutes. Free forever.
        </p>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Generate My Free Meal Plan
          <ChevronRight className="w-5 h-5" />
        </Link>
      </section>
    </main>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2 min", label: "to generate your plan" },
  { value: "6", label: "meals per day included" },
  { value: "WHO", label: "standard formulas" },
  { value: "$0", label: "to get started, forever" },
]

const FEATURES = [
  { icon: BarChart2, title: "Science-based calculations", description: "BMR, TDEE, and daily deficit calculated using formulas from peer-reviewed medical journals." },
  { icon: Salad, title: "6 balanced meals per day", description: "Breakfast, lunch, dinner, and 3 snacks — portioned to hit your exact caloric and macro targets." },
  { icon: ShoppingBasket, title: "Auto shopping list", description: "Weekly and monthly shopping lists organized by category. Ready to print or save as PDF." },
  { icon: TrendingUp, title: "Progress timeline", description: "Week-by-week projected weight loss chart with milestone markers and check-in tracking." },
  { icon: Zap, title: "Exercise recommendations", description: "Personalized exercise suggestions based on your current activity level and goals." },
  { icon: FileDown, title: "Export to PDF", description: "Download your full meal plan and shopping list as a clean, printable PDF anytime." },
]

const STEPS = [
  { title: "Tell us about yourself", description: "Enter your height, weight, goal, and activity level. Takes under 2 minutes." },
  { title: "Get your personalized plan", description: "Our engine calculates your BMR, TDEE, and macro targets — then generates your 6-meal daily plan." },
  { title: "Track & adjust", description: "Log weekly weigh-ins, compare actual vs projected, and regenerate as you reach milestones." },
]

const PREVIEW_MEALS = [
  { name: "Breakfast", food: "Greek yogurt with berries & granola", emoji: "🌅", bg: "bg-orange-100 dark:bg-orange-900/30", kcal: "342 kcal", macros: "P: 18g · C: 45g · F: 8g" },
  { name: "Morning Snack", food: "1 medium apple + 15g almonds", emoji: "☀️", bg: "bg-yellow-100 dark:bg-yellow-900/30", kcal: "168 kcal", macros: "P: 4g · C: 22g · F: 9g" },
  { name: "Lunch", food: "Grilled chicken breast with quinoa & salad", emoji: "🥗", bg: "bg-green-100 dark:bg-green-900/30", kcal: "485 kcal", macros: "P: 42g · C: 48g · F: 12g" },
]

const TESTIMONIALS = [
  {
    quote: "I lost 7 kg in 8 weeks just by following the meal plan. The shopping list made it so easy — I stopped buying random stuff and started eating with a purpose.",
    name: "Sarah M.",
    result: "Lost 7 kg in 8 weeks",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    quote: "Finally a plan that actually calculates MY numbers. The TDEE calculator alone is worth it. I've tried 4 different apps and NutriPlan is the only one that feels truly personalized.",
    name: "James T.",
    result: "Lost 12 kg in 14 weeks",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    quote: "The progress timeline is incredible. Seeing my projected weight week by week keeps me motivated. I'm on week 5 and right on track. The plan just works.",
    name: "Ana R.",
    result: "On track for −10 kg goal",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
]

const FREE_FEATURES = [
  "1 personalized meal plan",
  "6 meals/day with exact portions",
  "Full 4-tab dashboard",
  "Progress timeline",
  "Exercise recommendations",
]

const PRO_FEATURES = [
  "Everything in Free",
  "PDF export — meal plan & shopping list",
  "Monthly shopping list with quantities",
  "Unlimited weekly check-ins",
  "Unlimited plan regeneration",
  "Priority support",
]
