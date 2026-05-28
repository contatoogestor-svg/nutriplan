import Link from "next/link"
import { Salad, CheckCircle, ChevronRight, Star, Zap, ShieldCheck, BarChart2, FileDown, ShoppingBasket } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
            <Salad className="w-6 h-6" />
            NutriPlan
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/start"
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-green-200 dark:border-green-800">
          <Zap className="w-3.5 h-3.5" />
          Science-based · No guesswork · 100% free to start
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Your Personalized<br />
          <span className="text-green-600 dark:text-green-400">Balanced Diet</span> for<br />
          Weight Loss
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Get a science-based meal plan tailored to your body, goals, and lifestyle — in 2 minutes.
          Based on the same formulas used by registered dietitians.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/start"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Generate My Free Meal Plan
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400">No credit card · Ready in 2 minutes</p>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-1 mt-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            Trusted by thousands on their weight loss journey
          </span>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
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

      {/* How it works */}
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

      {/* Science proof */}
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

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 py-20" id="pricing">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
          Start free. Upgrade only when you're ready.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
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
            <Link
              href="/start"
              className="block text-center py-2.5 rounded-xl border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-green-600 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">
              MOST POPULAR
            </div>
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
            <Link
              href="/start"
              className="block text-center py-2.5 rounded-xl bg-white text-green-700 font-bold text-sm hover:bg-green-50 transition-colors shadow-md"
            >
              Start 7-Day Free Trial →
            </Link>
            <p className="text-xs text-green-200 text-center mt-2">No credit card until trial ends</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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

const FEATURES = [
  {
    icon: BarChart2,
    title: "Science-based calculations",
    description: "BMR, TDEE, and daily deficit calculated using formulas from peer-reviewed medical journals.",
  },
  {
    icon: Salad,
    title: "6 balanced meals per day",
    description: "Breakfast, lunch, dinner, and 3 snacks — portioned to hit your exact caloric and macro targets.",
  },
  {
    icon: ShoppingBasket,
    title: "Auto shopping list",
    description: "Weekly and monthly shopping lists organized by category. Ready to print or save as PDF.",
  },
  {
    icon: BarChart2,
    title: "Progress timeline",
    description: "Week-by-week projected weight loss chart with milestone markers and check-in tracking.",
  },
  {
    icon: Zap,
    title: "Exercise recommendations",
    description: "Personalized exercise suggestions based on your current activity level and goals.",
  },
  {
    icon: FileDown,
    title: "Export to PDF",
    description: "Download your full meal plan and shopping list as a clean, printable PDF anytime.",
  },
]

const STEPS = [
  {
    title: "Tell us about yourself",
    description: "Enter your height, weight, goal, and activity level. Takes under 2 minutes.",
  },
  {
    title: "Get your personalized plan",
    description: "Our engine calculates your BMR, TDEE, and macro targets — then generates your 6-meal daily plan.",
  },
  {
    title: "Track & adjust",
    description: "Log weekly weigh-ins, compare actual vs projected, and regenerate as you reach milestones.",
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
