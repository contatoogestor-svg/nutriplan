# NutriPlan — Personalized Meal Plan & Weight-Loss Tracker

A production-quality, science-based nutrition platform built with Next.js 16, Supabase, and Recharts.

## Features

- **Personalized meal plans** — 6 meals/day scaled to your caloric target
- **Scientific engine** — Mifflin-St Jeor BMR, TDEE, Wishnofsky deficit, WHO BMI
- **Metric & Imperial** support with full unit conversion
- **PDF export** — Full meal plan + shopping list via `@react-pdf/renderer`
- **Shopping list** — Weekly or monthly, organized by category
- **Progress timeline** — Recharts line chart with milestone markers
- **Exercise recommendations** — Tailored to your activity level
- **Weekly check-in** — Track actual vs projected weight
- **Safety rules** — Min calories enforced, max deficit blocked, BMI alerts
- **Dark mode** — Tailwind `dark:` class support

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run Supabase migration
# In your Supabase dashboard SQL editor, run: supabase/migrations/001_initial.sql

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| PDF | @react-pdf/renderer |
| Icons | lucide-react |

## Project Structure

```
nutriplan/
├── app/
│   ├── page.tsx                  # Onboarding form
│   ├── plan/[id]/page.tsx        # Plan dashboard (4 tabs)
│   ├── plan/[id]/checkin/        # Weekly check-in
│   ├── science/page.tsx          # Scientific basis
│   └── api/plans/                # API routes
├── components/
│   ├── forms/OnboardingForm.tsx
│   ├── plan/                     # Tab components
│   ├── pdf/                      # PDF export
│   └── ui/                       # Shared components
├── lib/
│   ├── nutrition.ts              # Calculation engine
│   ├── mealDatabase.ts           # Food DB + meal generator
│   ├── unitConversion.ts         # Metric ↔ Imperial
│   └── supabase.ts               # DB client + types
└── supabase/migrations/001_initial.sql
```

## Scientific Basis

Full documentation at `/science`. Key formulas:

- **BMR**: Mifflin-St Jeor equation (Am J Clin Nutr, 1990)
- **Deficit**: Wishnofsky Rule ~7,700 kcal/kg fat (Am J Clin Nutr, 1958)
- **BMI**: WHO classification (Technical Report Series 894, 2000)
- **Macros**: 30/40/30 (P/C/F) with ≥0.8g protein per lb body weight

## Safety Rules

1. Min 1,500 kcal/day (men) / 1,200 kcal/day (women)
2. Warning if deficit > 1,000 kcal/day
3. Hard block if deficit > 1,200 kcal/day
4. BMI < 18.5 with weight-loss goal → medical consultation alert
5. Recalculation reminder every 5 kg / 11 lb lost

---

*Not a substitute for advice from a registered dietitian or physician.*
