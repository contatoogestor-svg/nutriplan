import Link from "next/link"
import { Salad, ArrowLeft } from "lucide-react"

const GLOSSARY = [
  { acronym: "BMR", fullName: "Basal Metabolic Rate", definition: "Calories your body burns at complete rest to maintain basic functions (breathing, circulation, organ function). Represents ~60–70% of total daily calorie burn." },
  { acronym: "TDEE", fullName: "Total Daily Energy Expenditure", definition: "Total calories burned per day, including BMR + physical activity + digestion (TEF). This is your true maintenance calorie number." },
  { acronym: "TEF", fullName: "Thermic Effect of Food", definition: "Energy spent digesting and metabolizing food. ~10% of total calories consumed." },
  { acronym: "BMI", fullName: "Body Mass Index", definition: "Ratio of weight to height squared. A population-level screening tool — not a direct measure of body fat or health." },
  { acronym: "kcal", fullName: "Kilocalorie", definition: "The standard unit of food energy. What people commonly call a 'calorie' on nutrition labels is technically 1 kcal." },
  { acronym: "EPOC", fullName: "Excess Post-exercise Oxygen Consumption", definition: "Elevated calorie burn that continues after intense exercise (especially HIIT). Colloquially called the 'afterburn effect.'" },
  { acronym: "LBM", fullName: "Lean Body Mass", definition: "Total body weight minus fat mass. Includes muscle, bone, organs, and water. Higher LBM = higher BMR." },
  { acronym: "WHO", fullName: "World Health Organization", definition: "UN agency that sets global BMI classification standards." },
  { acronym: "g", fullName: "Grams", definition: "Unit of weight used for macronutrient quantities." },
  { acronym: "oz", fullName: "Ounces", definition: "Imperial unit of weight. 1 oz = 28.35 g." },
  { acronym: "lb", fullName: "Pounds", definition: "Imperial unit of weight. 1 lb = 0.4536 kg." },
  { acronym: "ft / in", fullName: "Feet / Inches", definition: "Imperial units of height. 1 ft = 30.48 cm; 1 in = 2.54 cm." },
]

const ACTIVITY_FACTORS = [
  { level: "Sedentary", factor: "1.20", description: "Desk job, no exercise" },
  { level: "Lightly Active", factor: "1.375", description: "1–3 days/week light exercise" },
  { level: "Moderately Active", factor: "1.55", description: "3–5 days/week moderate exercise" },
  { level: "Very Active", factor: "1.725", description: "6–7 days/week hard exercise" },
  { level: "Extra Active", factor: "1.90", description: "Athlete, physical job" },
]

const BMI_SCALE = [
  { range: "< 18.5", category: "Underweight", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { range: "18.5 – 24.9", category: "Normal weight", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  { range: "25.0 – 29.9", category: "Overweight", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { range: "≥ 30.0", category: "Obese", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
]

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
            <Salad className="w-5 h-5" />
            NutriPlan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Scientific Basis
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Every calculation in NutriPlan is grounded in peer-reviewed research. This page explains each formula, its source, and the safety rules we enforce.
          </p>
        </div>

        {/* BMR */}
        <Section title="1. BMR — Basal Metabolic Rate">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We use the <strong>Mifflin-St Jeor equation</strong>, the most validated formula for general populations, published in the <em>American Journal of Clinical Nutrition</em> in 1990.
          </p>
          <div className="bg-gray-900 dark:bg-black text-green-400 rounded-xl p-4 font-mono text-sm space-y-2">
            <p>Men:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5</p>
            <p>Women: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161</p>
          </div>
          <Citation
            authors="Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO."
            title="A new predictive equation for resting energy expenditure in healthy individuals."
            journal="Am J Clin Nutr. 1990;51(2):241-7."
            doi="10.1093/ajcn/51.2.241"
          />
        </Section>

        {/* TDEE */}
        <Section title="2. TDEE — Total Daily Energy Expenditure">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            TDEE is estimated by multiplying BMR by an activity factor. This accounts for the energy cost of physical activity beyond baseline metabolism.
          </p>
          <div className="bg-gray-900 dark:bg-black text-green-400 rounded-xl p-4 font-mono text-sm mb-4">
            TDEE = BMR × Activity Factor
          </div>
          <table className="w-full text-sm border dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                <th className="text-left px-4 py-2">Level</th>
                <th className="text-center px-4 py-2">Factor</th>
                <th className="text-left px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {ACTIVITY_FACTORS.map((row) => (
                <tr key={row.level} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">{row.level}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-green-700 dark:text-green-400">{row.factor}</td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Deficit */}
        <Section title="3. Caloric Deficit & Target Calories">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on the <strong>Wishnofsky Rule</strong> — approximately 7,700 kcal of energy deficit equals 1 kg of fat loss. This is a widely used clinical heuristic, though actual rates vary with body composition.
          </p>
          <div className="bg-gray-900 dark:bg-black text-green-400 rounded-xl p-4 font-mono text-sm space-y-2">
            <p>Daily deficit = (weight_to_lose_kg × 7,700 kcal) / goal_days</p>
            <p>Target calories = TDEE − daily_deficit</p>
          </div>
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Safety Rules (enforced by NutriPlan)</p>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
              <li>Minimum 1,500 kcal/day for men</li>
              <li>Minimum 1,200 kcal/day for women</li>
              <li>Warning if daily deficit exceeds 1,000 kcal/day</li>
              <li>Hard block if daily deficit exceeds 1,200 kcal/day</li>
              <li>BMI &lt;18.5 with weight-loss goal triggers medical consultation alert</li>
            </ul>
          </div>
          <Citation
            authors="Wishnofsky M."
            title="Caloric equivalents of gained or lost weight."
            journal="Am J Clin Nutr. 1958;6(5):542-6."
            doi="10.1093/ajcn/6.5.542"
          />
        </Section>

        {/* Macros */}
        <Section title="4. Macronutrient Split">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            NutriPlan uses a weight-loss optimized macro split that prioritizes protein to preserve lean muscle mass during a caloric deficit.
          </p>
          <div className="bg-gray-900 dark:bg-black text-green-400 rounded-xl p-4 font-mono text-sm space-y-1.5">
            <p>Protein:        30% of target calories ÷ 4 kcal/g  (min 0.8g per lb body weight)</p>
            <p>Carbohydrates:  40% of target calories ÷ 4 kcal/g</p>
            <p>Fat:            30% of target calories ÷ 9 kcal/g</p>
          </div>
          <Citation
            authors="Helms ER, Zinn C, Rowlands DS, Brown SR."
            title="A systematic review of dietary protein during caloric restriction in resistance trained lean athletes."
            journal="Int J Sport Nutr Exerc Metab. 2014."
            doi="10.1123/ijsnem.2013-0054"
          />
        </Section>

        {/* BMI */}
        <Section title="5. BMI — Body Mass Index">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            BMI is calculated as weight in kilograms divided by height in meters squared. It is a population-level screening tool and does not directly measure body fat percentage.
          </p>
          <div className="bg-gray-900 dark:bg-black text-green-400 rounded-xl p-4 font-mono text-sm mb-4">
            BMI = weight_kg / (height_m)²
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BMI_SCALE.map((b) => (
              <div key={b.category} className={`rounded-xl p-3 text-center ${b.color}`}>
                <p className="text-xs font-mono mb-0.5">{b.range}</p>
                <p className="text-sm font-semibold">{b.category}</p>
              </div>
            ))}
          </div>
          <Citation
            authors="World Health Organization."
            title="Obesity: preventing and managing the global epidemic."
            journal="WHO Technical Report Series 894. 2000."
          />
        </Section>

        {/* Glossary */}
        <Section title="Glossary of Acronyms">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border dark:border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-4 py-2 w-16">Term</th>
                  <th className="text-left px-4 py-2 w-48">Full Name</th>
                  <th className="text-left px-4 py-2">Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {GLOSSARY.map((row) => (
                  <tr key={row.acronym} className="align-top bg-white dark:bg-gray-900">
                    <td className="px-4 py-2.5 font-bold text-green-700 dark:text-green-400 font-mono">{row.acronym}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{row.fullName}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 leading-relaxed">{row.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Disclaimer */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-5 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>
            NutriPlan provides educational information based on published research. It is not a substitute for advice from a registered dietitian, nutritionist, or physician.
            Always consult a qualified healthcare professional before making significant changes to your diet or exercise routine.
          </p>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Citation({ authors, title, journal, doi }: { authors: string; title: string; journal: string; doi?: string }) {
  return (
    <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border-l-2 border-green-400">
      <p><strong>Source:</strong> {authors}</p>
      <p className="italic">{title}</p>
      <p>{journal}{doi && ` DOI: ${doi}`}</p>
    </div>
  )
}
