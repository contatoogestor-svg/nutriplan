/**
 * NutriPlan — Scientific Calculation Engine
 *
 * All formulas are evidence-based and sourced from peer-reviewed literature.
 * This file is the single source of truth for all metabolic calculations.
 */

// ---------------------------------------------------------------------------
// Academic citations
// ---------------------------------------------------------------------------
export const SCIENCE_SOURCES = {
  mifflinStJeor: {
    authors: "Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.",
    title: "A new predictive equation for resting energy expenditure in healthy individuals.",
    journal: "Am J Clin Nutr.",
    year: 1990,
    volume: "51(2):241-7",
    doi: "10.1093/ajcn/51.2.241",
  },
  wishnofsky: {
    authors: "Wishnofsky M.",
    title: "Caloric equivalents of gained or lost weight.",
    journal: "Am J Clin Nutr.",
    year: 1958,
    volume: "6(5):542-6",
    doi: "10.1093/ajcn/6.5.542",
  },
  whoClassification: {
    authors: "World Health Organization.",
    title: "Obesity: preventing and managing the global epidemic. Report of a WHO Consultation.",
    journal: "WHO Technical Report Series 894.",
    year: 2000,
  },
  macroRatios: {
    authors: "Helms ER, Zinn C, Rowlands DS, Brown SR.",
    title: "A systematic review of dietary protein during caloric restriction in resistance trained lean athletes: a case for higher intakes.",
    journal: "Int J Sport Nutr Exerc Metab.",
    year: 2014,
    doi: "10.1123/ijsnem.2013-0054",
  },
} as const

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Gender = "male" | "female"

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active"

export interface NutritionResult {
  bmr: number
  tdee: number
  targetCalories: number
  dailyDeficit: number
  protein_g: number
  carbs_g: number
  fat_g: number
  bmi: number
  bmiCategory: string
  minHealthyWeight_kg: number
  maxHealthyWeight_kg: number
  safetyWarning?: string
  safetyError?: string
  estimatedWeeklyLoss_kg: number
  projectedWeights: ProjectedWeek[]
}

export interface ProjectedWeek {
  week: number
  projectedWeight_kg: number
  date: string
  milestone?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Activity multipliers from the Compendium of Physical Activities.
 * Applied to BMR to estimate Total Daily Energy Expenditure (TDEE).
 */
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job, no exercise)",
  lightly_active: "Lightly Active (1–3 days/week light exercise)",
  moderately_active: "Moderately Active (3–5 days/week moderate exercise)",
  very_active: "Very Active (6–7 days/week hard exercise)",
  extra_active: "Extra Active (athlete, physical job)",
}

/** kcal per kg of body fat — Wishnofsky rule (widely used clinical heuristic) */
export const KCAL_PER_KG_FAT = 7700

/** Safety floors: minimum calories served per day */
export const MIN_CALORIES_MEN = 1500
export const MIN_CALORIES_WOMEN = 1200

/** Maximum safe daily deficit before hard block */
export const MAX_SAFE_DEFICIT_HARD = 1200
/** Warning threshold */
export const MAX_SAFE_DEFICIT_WARN = 1000

// ---------------------------------------------------------------------------
// Utility: Age
// ---------------------------------------------------------------------------
/**
 * Calculates age in full years from a date of birth string (YYYY-MM-DD).
 */
export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// ---------------------------------------------------------------------------
// 1. BMR — Basal Metabolic Rate (Mifflin-St Jeor, 1990)
// ---------------------------------------------------------------------------
/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation.
 *
 * Men:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
 * Women: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
 *
 * @param weight_kg  - Current body weight in kilograms
 * @param height_cm  - Height in centimetres
 * @param age        - Age in full years
 * @param gender     - Biological sex ('male' | 'female')
 * @returns BMR in kcal/day
 */
export function calculateBMR(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age
  return Math.round(gender === "male" ? base + 5 : base - 161)
}

// ---------------------------------------------------------------------------
// 2. TDEE — Total Daily Energy Expenditure
// ---------------------------------------------------------------------------
/**
 * Multiplies BMR by an activity factor to estimate total daily caloric needs.
 *
 * @param bmr            - Basal Metabolic Rate (kcal/day)
 * @param activityLevel  - Activity level key
 * @returns TDEE in kcal/day (rounded)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activityLevel])
}

// ---------------------------------------------------------------------------
// 3. Caloric Target & Daily Deficit
// ---------------------------------------------------------------------------
/**
 * Calculates the daily caloric deficit required to reach the target weight
 * within the specified number of days.
 *
 * Formula: deficit = (weightToLose_kg × 7,700) / goal_days
 * Source: Wishnofsky rule (~7,700 kcal per kg of adipose tissue)
 *
 * @param current_kg  - Current weight in kg
 * @param target_kg   - Target weight in kg
 * @param goal_days   - Number of days to reach goal
 * @returns Daily caloric deficit (positive number = eating below TDEE)
 */
export function calculateDailyDeficit(
  current_kg: number,
  target_kg: number,
  goal_days: number
): number {
  const weightToLose = Math.max(0, current_kg - target_kg)
  if (weightToLose === 0) return 0
  return Math.round((weightToLose * KCAL_PER_KG_FAT) / goal_days)
}

/**
 * Determines the target daily calorie intake enforcing safety minimums.
 *
 * @param tdee         - Total Daily Energy Expenditure
 * @param deficit      - Desired daily deficit
 * @param gender       - Biological sex (for safety floor)
 * @returns Clamped target calories
 */
export function calculateTargetCalories(
  tdee: number,
  deficit: number,
  gender: Gender
): number {
  const floor = gender === "male" ? MIN_CALORIES_MEN : MIN_CALORIES_WOMEN
  return Math.max(floor, tdee - deficit)
}

// ---------------------------------------------------------------------------
// 4. Macronutrient Split
// ---------------------------------------------------------------------------
/**
 * Weight-loss optimised macronutrient allocation.
 *
 * Protein:        30% of target calories ÷ 4 kcal/g
 * Carbohydrates:  40% of target calories ÷ 4 kcal/g
 * Fat:            30% of target calories ÷ 9 kcal/g
 *
 * Minimum protein guardrail: ≥ 0.8 g per pound of current body weight.
 *
 * @param targetCalories  - Daily caloric target
 * @param weight_kg       - Current weight (to verify minimum protein)
 * @returns Macros in grams (rounded)
 */
export function calculateMacros(
  targetCalories: number,
  weight_kg: number
): { protein_g: number; carbs_g: number; fat_g: number } {
  const minProtein = Math.round(weight_kg * 2.20462 * 0.8) // 0.8g per lb
  const protein_g = Math.max(minProtein, Math.round((targetCalories * 0.3) / 4))
  const carbs_g = Math.round((targetCalories * 0.4) / 4)
  // Recalculate fat after protein might have been bumped up
  const remainingCalories = targetCalories - protein_g * 4 - carbs_g * 4
  const fat_g = Math.max(0, Math.round(remainingCalories / 9))
  return { protein_g, carbs_g, fat_g }
}

// ---------------------------------------------------------------------------
// 5. BMI
// ---------------------------------------------------------------------------
/**
 * Calculates Body Mass Index: weight_kg / height_m²
 * WHO classification: <18.5 Underweight | 18.5–24.9 Normal | 25–29.9 Overweight | ≥30 Obese
 *
 * @param weight_kg  - Weight in kilograms
 * @param height_cm  - Height in centimetres
 * @returns BMI rounded to one decimal place
 */
export function calculateBMI(weight_kg: number, height_cm: number): number {
  const height_m = height_cm / 100
  return Math.round((weight_kg / (height_m * height_m)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

// ---------------------------------------------------------------------------
// 6. Healthy Weight Range
// ---------------------------------------------------------------------------
/**
 * Returns the min/max healthy body weight based on WHO BMI thresholds.
 *
 * Min = 18.5 × height_m²
 * Max = 24.9 × height_m²
 */
export function getHealthyWeightRange(height_cm: number): {
  min_kg: number
  max_kg: number
} {
  const height_m = height_cm / 100
  return {
    min_kg: Math.round(18.5 * height_m * height_m * 10) / 10,
    max_kg: Math.round(24.9 * height_m * height_m * 10) / 10,
  }
}

// ---------------------------------------------------------------------------
// 7. Activity Level Inference from Activities Array
// ---------------------------------------------------------------------------
export interface ActivityEntry {
  activity_type: string
  frequency_per_week: number
  duration_minutes: number
}

/**
 * Infers activity level from a list of exercise activities.
 * Uses total weekly MET-minutes as a proxy.
 */
export function inferActivityLevel(activities: ActivityEntry[]): ActivityLevel {
  if (!activities || activities.length === 0) return "sedentary"

  const totalDaysPerWeek = activities.reduce(
    (sum, a) => sum + a.frequency_per_week,
    0
  )
  const totalMinutesPerWeek = activities.reduce(
    (sum, a) => sum + a.frequency_per_week * a.duration_minutes,
    0
  )

  if (totalDaysPerWeek <= 1 || totalMinutesPerWeek < 90) return "lightly_active"
  if (totalDaysPerWeek <= 3 || totalMinutesPerWeek < 200) return "lightly_active"
  if (totalDaysPerWeek <= 5 || totalMinutesPerWeek < 300) return "moderately_active"
  if (totalDaysPerWeek <= 6 || totalMinutesPerWeek < 420) return "very_active"
  return "extra_active"
}

// ---------------------------------------------------------------------------
// 8. Projected Weight Timeline
// ---------------------------------------------------------------------------
/**
 * Generates a week-by-week projected weight loss timeline.
 * Accounts for the safety floor — once target is reached, weight plateaus.
 *
 * @param startWeight_kg   - Starting weight
 * @param targetWeight_kg  - Goal weight
 * @param dailyDeficit     - Actual daily caloric deficit (post-floor clamping)
 * @param tdee             - TDEE (to derive actual weekly loss rate)
 * @returns Array of weekly projections
 */
export function generateProjectedTimeline(
  startWeight_kg: number,
  targetWeight_kg: number,
  dailyDeficit: number,
  weeks: number
): ProjectedWeek[] {
  const weeklyLoss_kg = (dailyDeficit * 7) / KCAL_PER_KG_FAT
  const totalLoss = startWeight_kg - targetWeight_kg
  const milestones = [0.25, 0.5, 0.75, 1.0]
  const milestoneLabels = ["25% reached", "Halfway there!", "75% reached", "Goal achieved! 🎉"]

  const today = new Date()
  const result: ProjectedWeek[] = []

  for (let w = 0; w <= weeks; w++) {
    const lostSoFar = Math.min(weeklyLoss_kg * w, totalLoss)
    const projectedWeight = Math.max(targetWeight_kg, startWeight_kg - lostSoFar)
    const date = new Date(today)
    date.setDate(date.getDate() + w * 7)

    const progress = totalLoss > 0 ? lostSoFar / totalLoss : 1
    let milestone: string | undefined
    milestones.forEach((m, i) => {
      const prevProgress = w === 0 ? -1 : ((w - 1) * weeklyLoss_kg) / totalLoss
      if (progress >= m && prevProgress < m) {
        milestone = milestoneLabels[i]
      }
    })

    result.push({
      week: w,
      projectedWeight_kg: Math.round(projectedWeight * 10) / 10,
      date: date.toISOString().split("T")[0],
      milestone,
    })
  }

  return result
}

// ---------------------------------------------------------------------------
// 9. Master calculation orchestrator
// ---------------------------------------------------------------------------
/**
 * Runs the full calculation pipeline given profile data.
 * Returns all metrics and validates safety constraints.
 */
export function calculateNutritionPlan(params: {
  weight_kg: number
  height_cm: number
  dateOfBirth: string
  gender: Gender
  targetWeight_kg: number
  goalDays: number
  activities: ActivityEntry[]
}): NutritionResult {
  const {
    weight_kg,
    height_cm,
    dateOfBirth,
    gender,
    targetWeight_kg,
    goalDays,
    activities,
  } = params

  const age = calculateAge(dateOfBirth)
  const activityLevel = inferActivityLevel(activities)
  const bmr = calculateBMR(weight_kg, height_cm, age, gender)
  const tdee = calculateTDEE(bmr, activityLevel)
  const rawDeficit = calculateDailyDeficit(weight_kg, targetWeight_kg, goalDays)
  const floor = gender === "male" ? MIN_CALORIES_MEN : MIN_CALORIES_WOMEN

  let safetyWarning: string | undefined
  let safetyError: string | undefined

  if (rawDeficit > MAX_SAFE_DEFICIT_HARD) {
    safetyError = `Your calculated daily deficit (${rawDeficit} kcal) exceeds the safe maximum of ${MAX_SAFE_DEFICIT_HARD} kcal/day. Please extend your goal deadline to at least ${Math.ceil((weight_kg - targetWeight_kg) * KCAL_PER_KG_FAT / MAX_SAFE_DEFICIT_HARD)} days.`
  } else if (rawDeficit > MAX_SAFE_DEFICIT_WARN) {
    safetyWarning = `Your daily deficit (${rawDeficit} kcal) is aggressive. Consider extending your deadline to reduce health risks.`
  }

  const effectiveDeficit = Math.min(rawDeficit, MAX_SAFE_DEFICIT_WARN)
  const targetCalories = calculateTargetCalories(tdee, effectiveDeficit, gender)
  const actualDeficit = tdee - targetCalories
  const macros = calculateMacros(targetCalories, weight_kg)
  const bmi = calculateBMI(weight_kg, height_cm)
  const bmiCategory = getBMICategory(bmi)
  const { min_kg, max_kg } = getHealthyWeightRange(height_cm)

  if (bmi < 18.5 && targetWeight_kg < weight_kg) {
    safetyWarning =
      (safetyWarning ? safetyWarning + " " : "") +
      "Your current BMI is below 18.5 (Underweight). Attempting further weight loss is not recommended. Please consult a physician before starting any caloric restriction."
  }

  const weeks = Math.ceil(goalDays / 7) + 4
  const projectedWeights = generateProjectedTimeline(
    weight_kg,
    targetWeight_kg,
    actualDeficit,
    weeks
  )

  const estimatedWeeklyLoss_kg =
    Math.round(((actualDeficit * 7) / KCAL_PER_KG_FAT) * 100) / 100

  return {
    bmr,
    tdee,
    targetCalories,
    dailyDeficit: actualDeficit,
    protein_g: macros.protein_g,
    carbs_g: macros.carbs_g,
    fat_g: macros.fat_g,
    bmi,
    bmiCategory,
    minHealthyWeight_kg: min_kg,
    maxHealthyWeight_kg: max_kg,
    safetyWarning,
    safetyError,
    estimatedWeeklyLoss_kg,
    projectedWeights,
  }
}

/**
 * Calculates minimum number of days to lose the target weight safely.
 */
export function minimumSafeGoalDays(current_kg: number, target_kg: number): number {
  const weightToLose = Math.max(0, current_kg - target_kg)
  return Math.ceil((weightToLose * KCAL_PER_KG_FAT) / MAX_SAFE_DEFICIT_HARD)
}
