-- IBD Connect — Supabase schema (optional cloud sync)
-- Run this in the Supabase SQL editor after creating a project, then put your
-- project URL + anon key into app.json → expo.extra.supabaseUrl / supabaseAnonKey.

-- One JSON snapshot per user (last-write-wins sync model).
create table if not exists public.snapshots (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.snapshots enable row level security;

-- Each user can only read/write their own snapshot.
create policy "own snapshot - select" on public.snapshots
  for select using (auth.uid() = user_id);
create policy "own snapshot - insert" on public.snapshots
  for insert with check (auth.uid() = user_id);
create policy "own snapshot - update" on public.snapshots
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Notes:
-- * Health data is stored as an opaque JSON blob under the user's own RLS-protected row.
-- * No medication names or doses are collected by the app, consistent with its
--   non-medical positioning.
-- * Enable Email auth under Authentication → Providers in the Supabase dashboard.
