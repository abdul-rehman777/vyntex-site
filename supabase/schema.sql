-- =====================================================================
-- VYNTEX — Supabase schema (Phase 3)
-- Run in the Supabase SQL editor. Row Level Security is enabled on every
-- table. Public marketing submissions (contact/consultation) have NO
-- anon/authenticated policies, so they are only writable by trusted server
-- code using the service-role key (which bypasses RLS). Portal tables are
-- owner-scoped: a user can only ever see or change their own rows.
-- =====================================================================

create extension if not exists "pgcrypto";

-- Keeps updated_at fresh on row changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 1) contact_submissions  (server-insert only)
-- ---------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  business_name     text,
  email             text not null,
  phone             text,
  service_interest  text not null,
  message           text not null,
  preferred_contact text,
  language          text not null default 'en',
  ip_hash           text,
  status            text not null default 'new',
  created_at        timestamptz not null default now()
);
create index if not exists contact_submissions_created_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;
-- No policies: only the service-role key (server) may read or write.

-- ---------------------------------------------------------------------
-- 2) consultation_requests  (server-insert only)
-- ---------------------------------------------------------------------
create table if not exists public.consultation_requests (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  business_name     text,
  email             text not null,
  phone             text,
  services          text[] not null default '{}',
  budget            text,
  timeline          text,
  preferred_contact text,
  referral_source   text,
  message           text not null,
  language          text not null default 'en',
  ip_hash           text,
  status            text not null default 'new',
  created_at        timestamptz not null default now()
);
create index if not exists consultation_requests_created_idx
  on public.consultation_requests (created_at desc);

alter table public.consultation_requests enable row level security;
-- No policies: server-only.

-- ---------------------------------------------------------------------
-- 3) user_profiles  (owner-scoped)
-- ---------------------------------------------------------------------
create table if not exists public.user_profiles (
  id                 uuid primary key default gen_random_uuid(),
  auth_user_id       uuid not null unique references auth.users (id) on delete cascade,
  full_name          text,
  business_name      text,
  phone              text,
  preferred_language text not null default 'en',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy if exists "profiles_select_own" on public.user_profiles;
create policy "profiles_select_own" on public.user_profiles
  for select using (auth.uid() = auth_user_id);

drop policy if exists "profiles_insert_own" on public.user_profiles;
create policy "profiles_insert_own" on public.user_profiles
  for insert with check (auth.uid() = auth_user_id);

drop policy if exists "profiles_update_own" on public.user_profiles;
create policy "profiles_update_own" on public.user_profiles
  for update using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 4) support_requests  (owner-scoped read/insert; staff update via service role)
-- ---------------------------------------------------------------------
create table if not exists public.support_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  subject    text not null,
  message    text not null,
  status     text not null default 'open'
             check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists support_requests_user_idx
  on public.support_requests (user_id, created_at desc);

alter table public.support_requests enable row level security;

drop policy if exists "support_select_own" on public.support_requests;
create policy "support_select_own" on public.support_requests
  for select using (auth.uid() = user_id);

drop policy if exists "support_insert_own" on public.support_requests;
create policy "support_insert_own" on public.support_requests
  for insert with check (auth.uid() = user_id);

drop trigger if exists support_requests_set_updated_at on public.support_requests;
create trigger support_requests_set_updated_at
  before update on public.support_requests
  for each row execute function public.set_updated_at();
