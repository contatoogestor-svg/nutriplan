-- NutriPlan — Initial Database Schema
-- Run via: supabase db push

-- Users / profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  date_of_birth date not null,
  gender text check (gender in ('male','female')) not null,
  height_cm numeric not null,
  weight_kg numeric not null,
  target_weight_kg numeric not null,
  goal_days integer not null,
  is_active boolean default true,
  unit_preference text check (unit_preference in ('metric','imperial')) default 'metric'
);

-- Activity entries linked to a profile
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  activity_type text not null,
  frequency_per_week integer not null,
  duration_minutes integer not null
);

-- Generated meal plans (one plan per profile, versioned)
create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  target_calories integer not null,
  bmr integer not null,
  tdee integer not null,
  daily_deficit integer not null,
  protein_g integer not null,
  carbs_g integer not null,
  fat_g integer not null,
  plan_json jsonb not null
);

-- Weekly weight check-ins for progress tracking
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  logged_at timestamptz default now(),
  weight_kg numeric not null,
  notes text
);

-- Indexes for common queries
create index if not exists idx_activities_profile on activities(profile_id);
create index if not exists idx_meal_plans_profile on meal_plans(profile_id);
create index if not exists idx_weight_logs_profile on weight_logs(profile_id);
create index if not exists idx_weight_logs_logged_at on weight_logs(logged_at desc);

-- Row Level Security (optional — enable after adding auth)
-- alter table profiles enable row level security;
-- alter table activities enable row level security;
-- alter table meal_plans enable row level security;
-- alter table weight_logs enable row level security;
