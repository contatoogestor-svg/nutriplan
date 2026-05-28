/**
 * NutriPlan — Food & Meal Database
 *
 * All nutritional values are per the listed serving size.
 * Portions scale proportionally based on the user's target_calories.
 */

export interface FoodItem {
  id: string
  name: string
  servingSize: string
  servingSizeMetric: string
  servingSizeImperial: string
  gramsPerServing: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  category: "protein" | "carb" | "fat" | "vegetable" | "fruit" | "dairy"
  shoppingUnit: string    // e.g. "units", "grams", "ml"
  shoppingQtyPerServing: number
}

export const FOOD_DB: FoodItem[] = [
  // === PROTEINS ===
  {
    id: "chicken_breast",
    name: "Chicken Breast (grilled)",
    servingSize: "1 medium breast",
    servingSizeMetric: "150g",
    servingSizeImperial: "5.3 oz",
    gramsPerServing: 150,
    calories: 248,
    protein_g: 46,
    carbs_g: 0,
    fat_g: 5,
    category: "protein",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 150,
  },
  {
    id: "eggs",
    name: "Whole Eggs",
    servingSize: "2 large eggs",
    servingSizeMetric: "100g",
    servingSizeImperial: "3.5 oz",
    gramsPerServing: 100,
    calories: 143,
    protein_g: 13,
    carbs_g: 1,
    fat_g: 10,
    category: "protein",
    shoppingUnit: "units",
    shoppingQtyPerServing: 2,
  },
  {
    id: "salmon",
    name: "Salmon Fillet (baked)",
    servingSize: "1 fillet",
    servingSizeMetric: "150g",
    servingSizeImperial: "5.3 oz",
    gramsPerServing: 150,
    calories: 280,
    protein_g: 38,
    carbs_g: 0,
    fat_g: 13,
    category: "protein",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 150,
  },
  {
    id: "tuna_can",
    name: "Canned Tuna in Water",
    servingSize: "1 can (drained)",
    servingSizeMetric: "120g",
    servingSizeImperial: "4.2 oz",
    gramsPerServing: 120,
    calories: 132,
    protein_g: 29,
    carbs_g: 0,
    fat_g: 1,
    category: "protein",
    shoppingUnit: "cans",
    shoppingQtyPerServing: 1,
  },
  {
    id: "ground_turkey",
    name: "Ground Turkey (lean, cooked)",
    servingSize: "¾ cup",
    servingSizeMetric: "100g",
    servingSizeImperial: "3.5 oz",
    gramsPerServing: 100,
    calories: 218,
    protein_g: 28,
    carbs_g: 0,
    fat_g: 11,
    category: "protein",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 100,
  },
  {
    id: "cottage_cheese",
    name: "Low-fat Cottage Cheese",
    servingSize: "½ cup",
    servingSizeMetric: "113g",
    servingSizeImperial: "4 oz",
    gramsPerServing: 113,
    calories: 90,
    protein_g: 12,
    carbs_g: 5,
    fat_g: 1,
    category: "dairy",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 113,
  },
  {
    id: "greek_yogurt",
    name: "Greek Yogurt (plain, 0%)",
    servingSize: "¾ cup",
    servingSizeMetric: "170g",
    servingSizeImperial: "6 oz",
    gramsPerServing: 170,
    calories: 100,
    protein_g: 17,
    carbs_g: 6,
    fat_g: 0,
    category: "dairy",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 170,
  },
  {
    id: "whey_protein",
    name: "Whey Protein Powder",
    servingSize: "1 scoop",
    servingSizeMetric: "30g",
    servingSizeImperial: "1 oz",
    gramsPerServing: 30,
    calories: 120,
    protein_g: 24,
    carbs_g: 3,
    fat_g: 2,
    category: "protein",
    shoppingUnit: "scoops",
    shoppingQtyPerServing: 1,
  },
  {
    id: "shrimp",
    name: "Shrimp (cooked)",
    servingSize: "100g",
    servingSizeMetric: "100g",
    servingSizeImperial: "3.5 oz",
    gramsPerServing: 100,
    calories: 99,
    protein_g: 24,
    carbs_g: 0,
    fat_g: 1,
    category: "protein",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 100,
  },
  // === CARBOHYDRATES & GRAINS ===
  {
    id: "brown_rice",
    name: "Brown Rice (cooked)",
    servingSize: "¾ cup",
    servingSizeMetric: "145g",
    servingSizeImperial: "5.1 oz",
    gramsPerServing: 145,
    calories: 162,
    protein_g: 4,
    carbs_g: 34,
    fat_g: 1,
    category: "carb",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 60,
  },
  {
    id: "oats",
    name: "Rolled Oats (dry)",
    servingSize: "½ cup",
    servingSizeMetric: "40g",
    servingSizeImperial: "1.4 oz",
    gramsPerServing: 40,
    calories: 150,
    protein_g: 5,
    carbs_g: 27,
    fat_g: 3,
    category: "carb",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 40,
  },
  {
    id: "sweet_potato",
    name: "Sweet Potato (baked)",
    servingSize: "1 medium",
    servingSizeMetric: "130g",
    servingSizeImperial: "4.6 oz",
    gramsPerServing: 130,
    calories: 112,
    protein_g: 2,
    carbs_g: 26,
    fat_g: 0,
    category: "carb",
    shoppingUnit: "units",
    shoppingQtyPerServing: 1,
  },
  {
    id: "quinoa",
    name: "Quinoa (cooked)",
    servingSize: "¾ cup",
    servingSizeMetric: "140g",
    servingSizeImperial: "4.9 oz",
    gramsPerServing: 140,
    calories: 160,
    protein_g: 6,
    carbs_g: 29,
    fat_g: 3,
    category: "carb",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 60,
  },
  {
    id: "whole_grain_bread",
    name: "Whole Grain Bread",
    servingSize: "2 slices",
    servingSizeMetric: "56g",
    servingSizeImperial: "2 oz",
    gramsPerServing: 56,
    calories: 140,
    protein_g: 6,
    carbs_g: 24,
    fat_g: 2,
    category: "carb",
    shoppingUnit: "slices",
    shoppingQtyPerServing: 2,
  },
  {
    id: "whole_grain_pasta",
    name: "Whole Grain Pasta (cooked)",
    servingSize: "1 cup",
    servingSizeMetric: "140g",
    servingSizeImperial: "4.9 oz",
    gramsPerServing: 140,
    calories: 174,
    protein_g: 7,
    carbs_g: 37,
    fat_g: 1,
    category: "carb",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 70,
  },
  {
    id: "banana",
    name: "Banana",
    servingSize: "1 medium",
    servingSizeMetric: "118g",
    servingSizeImperial: "4.2 oz",
    gramsPerServing: 118,
    calories: 105,
    protein_g: 1,
    carbs_g: 27,
    fat_g: 0,
    category: "fruit",
    shoppingUnit: "units",
    shoppingQtyPerServing: 1,
  },
  {
    id: "apple",
    name: "Apple",
    servingSize: "1 medium",
    servingSizeMetric: "182g",
    servingSizeImperial: "6.4 oz",
    gramsPerServing: 182,
    calories: 95,
    protein_g: 0,
    carbs_g: 25,
    fat_g: 0,
    category: "fruit",
    shoppingUnit: "units",
    shoppingQtyPerServing: 1,
  },
  {
    id: "mixed_berries",
    name: "Mixed Berries (fresh/frozen)",
    servingSize: "1 cup",
    servingSizeMetric: "150g",
    servingSizeImperial: "5.3 oz",
    gramsPerServing: 150,
    calories: 70,
    protein_g: 1,
    carbs_g: 17,
    fat_g: 0,
    category: "fruit",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 150,
  },
  // === VEGETABLES ===
  {
    id: "broccoli",
    name: "Broccoli (steamed)",
    servingSize: "1 cup",
    servingSizeMetric: "91g",
    servingSizeImperial: "3.2 oz",
    gramsPerServing: 91,
    calories: 31,
    protein_g: 3,
    carbs_g: 6,
    fat_g: 0,
    category: "vegetable",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 91,
  },
  {
    id: "spinach",
    name: "Baby Spinach",
    servingSize: "2 cups",
    servingSizeMetric: "60g",
    servingSizeImperial: "2.1 oz",
    gramsPerServing: 60,
    calories: 14,
    protein_g: 2,
    carbs_g: 2,
    fat_g: 0,
    category: "vegetable",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 60,
  },
  {
    id: "mixed_greens",
    name: "Mixed Greens Salad",
    servingSize: "2 cups",
    servingSizeMetric: "56g",
    servingSizeImperial: "2 oz",
    gramsPerServing: 56,
    calories: 15,
    protein_g: 1,
    carbs_g: 3,
    fat_g: 0,
    category: "vegetable",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 56,
  },
  {
    id: "cherry_tomatoes",
    name: "Cherry Tomatoes",
    servingSize: "1 cup",
    servingSizeMetric: "149g",
    servingSizeImperial: "5.3 oz",
    gramsPerServing: 149,
    calories: 27,
    protein_g: 1,
    carbs_g: 6,
    fat_g: 0,
    category: "vegetable",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 149,
  },
  {
    id: "bell_pepper",
    name: "Bell Pepper (sliced)",
    servingSize: "1 medium",
    servingSizeMetric: "119g",
    servingSizeImperial: "4.2 oz",
    gramsPerServing: 119,
    calories: 31,
    protein_g: 1,
    carbs_g: 7,
    fat_g: 0,
    category: "vegetable",
    shoppingUnit: "units",
    shoppingQtyPerServing: 1,
  },
  {
    id: "cucumber",
    name: "Cucumber (sliced)",
    servingSize: "1 cup",
    servingSizeMetric: "119g",
    servingSizeImperial: "4.2 oz",
    gramsPerServing: 119,
    calories: 16,
    protein_g: 1,
    carbs_g: 4,
    fat_g: 0,
    category: "vegetable",
    shoppingUnit: "units",
    shoppingQtyPerServing: 0.5,
  },
  // === HEALTHY FATS ===
  {
    id: "avocado",
    name: "Avocado",
    servingSize: "½ medium",
    servingSizeMetric: "75g",
    servingSizeImperial: "2.6 oz",
    gramsPerServing: 75,
    calories: 120,
    protein_g: 1,
    carbs_g: 6,
    fat_g: 11,
    category: "fat",
    shoppingUnit: "units",
    shoppingQtyPerServing: 0.5,
  },
  {
    id: "almonds",
    name: "Almonds (raw)",
    servingSize: "1 oz / ~23 almonds",
    servingSizeMetric: "28g",
    servingSizeImperial: "1 oz",
    gramsPerServing: 28,
    calories: 164,
    protein_g: 6,
    carbs_g: 6,
    fat_g: 14,
    category: "fat",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 28,
  },
  {
    id: "olive_oil",
    name: "Extra Virgin Olive Oil",
    servingSize: "1 tbsp",
    servingSizeMetric: "14g",
    servingSizeImperial: "0.5 oz",
    gramsPerServing: 14,
    calories: 119,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 14,
    category: "fat",
    shoppingUnit: "ml",
    shoppingQtyPerServing: 14,
  },
  {
    id: "peanut_butter",
    name: "Natural Peanut Butter",
    servingSize: "2 tbsp",
    servingSizeMetric: "32g",
    servingSizeImperial: "1.1 oz",
    gramsPerServing: 32,
    calories: 188,
    protein_g: 8,
    carbs_g: 6,
    fat_g: 16,
    category: "fat",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 32,
  },
  {
    id: "walnuts",
    name: "Walnuts",
    servingSize: "1 oz / ~14 halves",
    servingSizeMetric: "28g",
    servingSizeImperial: "1 oz",
    gramsPerServing: 28,
    calories: 185,
    protein_g: 4,
    carbs_g: 4,
    fat_g: 18,
    category: "fat",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 28,
  },
  // === DAIRY ===
  {
    id: "skim_milk",
    name: "Skim Milk",
    servingSize: "1 cup",
    servingSizeMetric: "240ml",
    servingSizeImperial: "8 fl oz",
    gramsPerServing: 240,
    calories: 83,
    protein_g: 8,
    carbs_g: 12,
    fat_g: 0,
    category: "dairy",
    shoppingUnit: "ml",
    shoppingQtyPerServing: 240,
  },
  {
    id: "mozzarella",
    name: "Part-skim Mozzarella",
    servingSize: "1 oz",
    servingSizeMetric: "28g",
    servingSizeImperial: "1 oz",
    gramsPerServing: 28,
    calories: 72,
    protein_g: 7,
    carbs_g: 1,
    fat_g: 4,
    category: "dairy",
    shoppingUnit: "grams",
    shoppingQtyPerServing: 28,
  },
]

// ---------------------------------------------------------------------------
// Meal Templates
// ---------------------------------------------------------------------------
export interface MealTemplate {
  mealName: string
  mealTime: string
  caloriePercent: number
  foods: string[] // food IDs from FOOD_DB
}

/**
 * Meal distribution across 6 daily meals.
 * Each template lists food IDs; portions are scaled at generation time.
 */
export const MEAL_TEMPLATES: MealTemplate[] = [
  {
    mealName: "Breakfast",
    mealTime: "7:00 AM",
    caloriePercent: 0.25,
    foods: ["oats", "greek_yogurt", "mixed_berries", "eggs"],
  },
  {
    mealName: "Morning Snack",
    mealTime: "10:00 AM",
    caloriePercent: 0.1,
    foods: ["apple", "almonds"],
  },
  {
    mealName: "Lunch",
    mealTime: "12:30 PM",
    caloriePercent: 0.3,
    foods: ["chicken_breast", "brown_rice", "broccoli", "olive_oil"],
  },
  {
    mealName: "Afternoon Snack",
    mealTime: "3:30 PM",
    caloriePercent: 0.1,
    foods: ["cottage_cheese", "cherry_tomatoes"],
  },
  {
    mealName: "Dinner",
    mealTime: "7:00 PM",
    caloriePercent: 0.2,
    foods: ["salmon", "quinoa", "mixed_greens", "avocado"],
  },
  {
    mealName: "Evening Snack",
    mealTime: "9:30 PM",
    caloriePercent: 0.05,
    foods: ["greek_yogurt", "mixed_berries"],
  },
]

// ---------------------------------------------------------------------------
// Meal Plan Generator
// ---------------------------------------------------------------------------
export interface ScaledFoodItem extends FoodItem {
  scaleFactor: number
  scaledCalories: number
  scaledProtein_g: number
  scaledCarbs_g: number
  scaledFat_g: number
  scaledGrams: number
}

export interface GeneratedMeal {
  mealName: string
  mealTime: string
  targetCalories: number
  actualCalories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  foods: ScaledFoodItem[]
}

export function generateDailyMeals(
  targetCalories: number,
  unitPref: "metric" | "imperial" = "metric"
): GeneratedMeal[] {
  const foodMap = new Map(FOOD_DB.map((f) => [f.id, f]))

  return MEAL_TEMPLATES.map((template) => {
    const mealTarget = Math.round(targetCalories * template.caloriePercent)
    const foods = template.foods
      .map((id) => foodMap.get(id))
      .filter(Boolean) as FoodItem[]

    const totalBaseCalories = foods.reduce((s, f) => s + f.calories, 0)
    const scaleFactor = totalBaseCalories > 0 ? mealTarget / totalBaseCalories : 1

    const scaledFoods: ScaledFoodItem[] = foods.map((f) => ({
      ...f,
      scaleFactor,
      scaledCalories: Math.round(f.calories * scaleFactor),
      scaledProtein_g: Math.round(f.protein_g * scaleFactor * 10) / 10,
      scaledCarbs_g: Math.round(f.carbs_g * scaleFactor * 10) / 10,
      scaledFat_g: Math.round(f.fat_g * scaleFactor * 10) / 10,
      scaledGrams: Math.round(f.gramsPerServing * scaleFactor),
    }))

    const actualCalories = scaledFoods.reduce((s, f) => s + f.scaledCalories, 0)
    const protein_g = scaledFoods.reduce((s, f) => s + f.scaledProtein_g, 0)
    const carbs_g = scaledFoods.reduce((s, f) => s + f.scaledCarbs_g, 0)
    const fat_g = scaledFoods.reduce((s, f) => s + f.scaledFat_g, 0)

    return {
      mealName: template.mealName,
      mealTime: template.mealTime,
      targetCalories: mealTarget,
      actualCalories,
      protein_g: Math.round(protein_g * 10) / 10,
      carbs_g: Math.round(carbs_g * 10) / 10,
      fat_g: Math.round(fat_g * 10) / 10,
      foods: scaledFoods,
    }
  })
}

// ---------------------------------------------------------------------------
// Shopping List Generator
// ---------------------------------------------------------------------------
export type ShoppingCategory =
  | "Proteins"
  | "Carbohydrates & Grains"
  | "Dairy"
  | "Fruits & Vegetables"
  | "Healthy Fats"
  | "Other"

const categoryMap: Record<FoodItem["category"], ShoppingCategory> = {
  protein: "Proteins",
  carb: "Carbohydrates & Grains",
  dairy: "Dairy",
  fruit: "Fruits & Vegetables",
  vegetable: "Fruits & Vegetables",
  fat: "Healthy Fats",
}

export interface ShoppingItem {
  name: string
  quantity: number
  unit: string
  category: ShoppingCategory
}

export function generateShoppingList(
  meals: GeneratedMeal[],
  period: "weekly" | "monthly" = "weekly"
): Record<ShoppingCategory, ShoppingItem[]> {
  const multiplier = period === "monthly" ? 4.3 : 1
  const DAYS = 7

  const foodMap = new Map(FOOD_DB.map((f) => [f.id, f]))
  const totals = new Map<string, { item: ShoppingItem; baseQty: number }>()

  for (const meal of meals) {
    for (const food of meal.foods) {
      const raw = foodMap.get(food.id)
      if (!raw) continue

      const dailyQty = raw.shoppingQtyPerServing * food.scaleFactor
      const key = food.id

      if (totals.has(key)) {
        totals.get(key)!.baseQty += dailyQty
      } else {
        totals.set(key, {
          item: {
            name: raw.name,
            quantity: 0,
            unit: raw.shoppingUnit,
            category: categoryMap[raw.category],
          },
          baseQty: dailyQty,
        })
      }
    }
  }

  const grouped: Record<ShoppingCategory, ShoppingItem[]> = {
    Proteins: [],
    "Carbohydrates & Grains": [],
    Dairy: [],
    "Fruits & Vegetables": [],
    "Healthy Fats": [],
    Other: [],
  }

  for (const { item, baseQty } of totals.values()) {
    const weeklyQty = baseQty * DAYS
    const finalQty = weeklyQty * multiplier

    const rounded =
      item.unit === "units"
        ? Math.ceil(finalQty)
        : item.unit === "grams" || item.unit === "ml"
        ? Math.round(finalQty / 50) * 50
        : Math.ceil(finalQty * 10) / 10

    grouped[item.category].push({ ...item, quantity: rounded })
  }

  return grouped
}
