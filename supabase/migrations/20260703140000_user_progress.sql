-- E2: Per-user learning progress (JSON snapshot). BYOK keys are NOT stored here.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "user_progress_select_own"
  on public.user_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_progress_insert_own"
  on public.user_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_progress_update_own"
  on public.user_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_progress_updated_at_idx
  on public.user_progress (updated_at desc);
