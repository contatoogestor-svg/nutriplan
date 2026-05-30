import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { calculateNutritionPlan } from "@/lib/nutrition"
import { generateDailyMeals } from "@/lib/mealDatabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      date_of_birth,
      gender,
      height_cm,
      weight_kg,
      target_weight_kg,
      goal_days,
      unit_preference,
      activities,
      user_id,
    } = body

    // Validate required fields
    if (!name || !date_of_birth || !gender || !height_cm || !weight_kg || !target_weight_kg || !goal_days) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // Run scientific calculations
    const nutrition = calculateNutritionPlan({
      weight_kg: Number(weight_kg),
      height_cm: Number(height_cm),
      dateOfBirth: date_of_birth,
      gender,
      targetWeight_kg: Number(target_weight_kg),
      goalDays: Number(goal_days),
      activities: activities || [],
    })

    // Block if deficit is unsafe
    if (nutrition.safetyError) {
      return NextResponse.json({ error: nutrition.safetyError }, { status: 422 })
    }

    // Generate meal plan
    const meals = generateDailyMeals(nutrition.targetCalories, unit_preference)

    const supabase = createServerClient()

    // Save profile (link to auth user if provided)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        name,
        date_of_birth,
        gender,
        height_cm: Number(height_cm),
        weight_kg: Number(weight_kg),
        target_weight_kg: Number(target_weight_kg),
        goal_days: Number(goal_days),
        unit_preference: unit_preference || "metric",
        ...(user_id ? { user_id } : {}),
      })
      .select("id")
      .single()

    if (profileError || !profile) {
      console.error("Profile insert error:", profileError)
      return NextResponse.json({ error: "Failed to save profile." }, { status: 500 })
    }

    // Save activities
    if (activities && activities.length > 0) {
      const activityRows = activities.map((a: { activity_type: string; frequency_per_week: number; duration_minutes: number }) => ({
        profile_id: profile.id,
        activity_type: a.activity_type,
        frequency_per_week: a.frequency_per_week,
        duration_minutes: a.duration_minutes,
      }))

      const { error: actError } = await supabase.from("activities").insert(activityRows)
      if (actError) {
        console.error("Activities insert error:", actError)
      }
    }

    // Save meal plan
    const { data: mealPlan, error: planError } = await supabase
      .from("meal_plans")
      .insert({
        profile_id: profile.id,
        target_calories: nutrition.targetCalories,
        bmr: nutrition.bmr,
        tdee: nutrition.tdee,
        daily_deficit: nutrition.dailyDeficit,
        protein_g: nutrition.protein_g,
        carbs_g: nutrition.carbs_g,
        fat_g: nutrition.fat_g,
        plan_json: {
          meals,
          projectedWeights: nutrition.projectedWeights,
          bmi: nutrition.bmi,
          bmiCategory: nutrition.bmiCategory,
          estimatedWeeklyLoss_kg: nutrition.estimatedWeeklyLoss_kg,
          safetyWarning: nutrition.safetyWarning,
          minHealthyWeight_kg: nutrition.minHealthyWeight_kg,
          maxHealthyWeight_kg: nutrition.maxHealthyWeight_kg,
        },
      })
      .select("id")
      .single()

    if (planError || !mealPlan) {
      console.error("Meal plan insert error:", planError)
      return NextResponse.json({ error: "Failed to save meal plan." }, { status: 500 })
    }

    return NextResponse.json({ planId: mealPlan.id }, { status: 201 })
  } catch (err) {
    console.error("Generate route error:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
