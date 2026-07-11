-- K3: Minimal self-hosted activation events. Prompt content and BYOK keys are never stored here.
create table if not exists public.app_events (
  id bigint generated always as identity primary key,
  event_name text not null check (
    event_name in (
      'onboarding_completed',
      'guest_demo_prompt_viewed',
      'byok_key_added_success',
      'first_lesson_completed',
      'account_created_from_guest'
    )
  ),
  occurred_at timestamptz not null default now(),
  session_id uuid not null,
  user_id uuid references auth.users (id) on delete set null
);

alter table public.app_events enable row level security;

revoke all on table public.app_events from anon, authenticated;
grant insert on table public.app_events to anon, authenticated;
grant usage, select on sequence public.app_events_id_seq to anon, authenticated;

create policy "app_events_insert_guest"
  on public.app_events
  for insert
  to anon
  with check (user_id is null);

create policy "app_events_insert_authenticated"
  on public.app_events
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create index if not exists app_events_occurred_at_idx
  on public.app_events (occurred_at desc);
