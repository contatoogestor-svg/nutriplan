-- Fase 1: Auth + Subscription
-- Vincula profiles ao auth.users do Supabase e adiciona campos de assinatura Stripe

-- Adicionar campos de assinatura na tabela profiles
alter table profiles
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_status text check (
    subscription_status in ('free', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')
  ) default 'free',
  add column if not exists subscription_id text,
  add column if not exists price_id text,
  add column if not exists current_period_end timestamptz;

-- Index para lookup por user_id
create index if not exists idx_profiles_user_id on profiles(user_id);
create index if not exists idx_profiles_stripe_customer on profiles(stripe_customer_id);

-- Função utilitária: retorna o profile do usuário autenticado
create or replace function get_my_profile()
returns setof profiles
language sql security definer
as $$
  select * from profiles where user_id = auth.uid() limit 1;
$$;

-- RLS: cada usuário só vê e edita os próprios dados
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (user_id = auth.uid());

create policy "Users can update own profile"
  on profiles for update
  using (user_id = auth.uid());

create policy "Service role bypasses RLS"
  on profiles for all
  using (true)
  with check (true);

-- RLS nas outras tabelas
alter table meal_plans enable row level security;
alter table activities enable row level security;
alter table weight_logs enable row level security;

create policy "Users can view own meal plans"
  on meal_plans for select
  using (profile_id in (select id from profiles where user_id = auth.uid()));

create policy "Users can view own activities"
  on activities for select
  using (profile_id in (select id from profiles where user_id = auth.uid()));

create policy "Users can view own weight logs"
  on weight_logs for select
  using (profile_id in (select id from profiles where user_id = auth.uid()));

create policy "Users can insert own weight logs"
  on weight_logs for insert
  with check (profile_id in (select id from profiles where user_id = auth.uid()));

-- Service role tem acesso total (para API routes)
create policy "Service role full access meal_plans"
  on meal_plans for all using (true) with check (true);

create policy "Service role full access activities"
  on activities for all using (true) with check (true);

create policy "Service role full access weight_logs"
  on weight_logs for all using (true) with check (true);
