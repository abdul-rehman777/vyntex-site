-- =====================================================================
-- VYNTEX — Supabase migration (Phase 5)
--
-- Additive. Run AFTER supabase/schema.sql and supabase/phase4-migration.sql.
-- Safe to run against an existing Phase 4 database. No destructive resets.
--
-- Adds:
--   1. admin_users        — server-verified administrator role
--   2. client_files       — private file exchange (private Storage bucket)
--   3. email_deliveries   — durable outbox so a failed email is retried,
--                           not lost (Vercel Cron drains it)
--   4. cron_runs          — observability for scheduled jobs
--   5. vx_expire_partners()          — nightly term enforcement
--   6. vx_approve_application_admin()— approval callable by the admin API
--   7. Storage buckets: client-files (private)
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
-- 1) admin_users
--
-- Administrator status is a DATABASE FACT, never a client claim. There is no
-- "admin code", no magic query string, and no localStorage flag. A user is an
-- admin if and only if a row exists here with is_active = true, and that is
-- checked server-side on every admin request (lib/admin.ts).
-- =====================================================================
create table if not exists public.admin_users (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  email        text not null,
  role         text not null default 'admin' check (role in ('admin', 'super_admin')),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- An admin may read their OWN row (so the portal can confirm the session).
-- Nobody may read the full admin list through the API, and nobody may write.
drop policy if exists "admin_select_self" on public.admin_users;
create policy "admin_select_self" on public.admin_users
  for select using (auth.uid() = auth_user_id);

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- CREATE THE FIRST SUPER-ADMIN (run once, manually).
--
-- The account must sign in once via the email OTP flow first, so an
-- auth.users row exists. Then:
--
--   insert into public.admin_users (auth_user_id, email, role)
--   select id, email, 'super_admin' from auth.users
--    where email = 'info@vyntexusa.com'
--   on conflict (auth_user_id) do update
--     set role = 'super_admin', is_active = true;
--
-- There is deliberately no self-service path to becoming an admin.
-- ---------------------------------------------------------------------

-- =====================================================================
-- 2) client_files
--
-- Metadata only. The bytes live in the private `client-files` Storage bucket.
-- A row is created by the server AFTER a successful upload, so an orphaned
-- object can never masquerade as an approved file.
-- =====================================================================
create table if not exists public.client_files (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  partner_id    uuid references public.partners (id) on delete set null,
  order_id      uuid references public.orders (id) on delete set null,
  file_name     text not null,
  storage_path  text not null unique,
  mime_type     text not null,
  size_bytes    integer not null check (size_bytes > 0),
  direction     text not null default 'upload'
                check (direction in ('upload', 'deliverable')),
  uploaded_by   text not null default 'client'
                check (uploaded_by in ('client', 'vyntex')),
  created_at    timestamptz not null default now()
);
create index if not exists client_files_user_idx
  on public.client_files (user_id, created_at desc);

alter table public.client_files enable row level security;

-- Owner-scoped read. No write policy: uploads go through the server, which
-- validates size and MIME type before it will record a row.
drop policy if exists "client_files_select_own" on public.client_files;
create policy "client_files_select_own" on public.client_files
  for select using (auth.uid() = user_id);

-- =====================================================================
-- 3) email_deliveries  — the durable outbox
--
-- Every transactional email is recorded here BEFORE it is attempted. If the
-- provider is down, the row stays 'pending' and the nightly cron retries it
-- with backoff. An email is therefore never silently lost because Resend had
-- a bad minute — which matters most for the one email we cannot afford to
-- drop: the signed agreement copy.
-- =====================================================================
create table if not exists public.email_deliveries (
  id            uuid primary key default gen_random_uuid(),
  to_email      text not null,
  subject       text not null,
  html          text not null,
  text_body     text,
  reply_to      text,
  kind          text not null,
  -- Correlates the email back to what produced it (order id, agreement id...).
  ref_id        uuid,
  status        text not null default 'pending'
                check (status in ('pending', 'sent', 'failed', 'abandoned')),
  attempts      integer not null default 0 check (attempts >= 0),
  max_attempts  integer not null default 5,
  last_error    text,
  provider_id   text,
  next_retry_at timestamptz not null default now(),
  sent_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists email_deliveries_retry_idx
  on public.email_deliveries (status, next_retry_at)
  where status = 'pending';

alter table public.email_deliveries enable row level security;
-- No policies. The outbox contains rendered email bodies (names, order details).
-- It is server-only, readable by nobody through the API.

drop trigger if exists email_deliveries_set_updated_at on public.email_deliveries;
create trigger email_deliveries_set_updated_at
  before update on public.email_deliveries
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 4) cron_runs  — so a silently-failing scheduled job is visible
-- =====================================================================
create table if not exists public.cron_runs (
  id           uuid primary key default gen_random_uuid(),
  job          text not null,
  status       text not null check (status in ('ok', 'error')),
  detail       jsonb not null default '{}'::jsonb,
  duration_ms  integer,
  created_at   timestamptz not null default now()
);
create index if not exists cron_runs_job_idx on public.cron_runs (job, created_at desc);

alter table public.cron_runs enable row level security;
-- No policies: server-only.

-- =====================================================================
-- 5) vx_expire_partners()
--
-- Nightly term enforcement. Flips 'active' partners whose expiration_date has
-- passed to 'expired'.
--
-- NOTE this is belt-and-braces, not the security boundary. getPartnerAccess()
-- in lib/reseller.ts ALSO treats an active row with a past expiry as expired at
-- read time, so even if this cron never ran, an expired partner would still be
-- locked out of the wholesale library. The cron exists to keep the stored state
-- honest (for admin reporting and renewal emails), not to enforce access.
-- =====================================================================
create or replace function public.vx_expire_partners()
returns table (expired_count integer, partner_ids uuid[])
language plpgsql
security definer
set search_path = public
as $$
declare
  ids uuid[];
begin
  -- One statement: the UPDATE and the id collection are atomic, so a concurrent
  -- renewal cannot slip between them and get wrongly reported as expired.
  with expired as (
    update public.partners
       set status = 'expired'
     where status = 'active'
       and expiration_date is not null
       and expiration_date <= now()
    returning id
  )
  select coalesce(array_agg(id), '{}'::uuid[]) into ids from expired;

  return query select coalesce(array_length(ids, 1), 0), ids;
end;
$$;

revoke execute on function public.vx_expire_partners() from public, anon, authenticated;

-- =====================================================================
-- 6) vx_approve_application_admin()
--
-- Same effect as vx_approve_reseller_application (Phase 4), but callable by the
-- admin API via the service role. Kept as a DB function rather than TS so the
-- partner-number generation, the application status flip, and the partner
-- insert are one atomic statement — a half-approved partner is not a state that
-- can exist.
-- =====================================================================
create or replace function public.vx_approve_application_admin(
  p_application_id uuid
)
returns table (partner_id uuid, partner_number text, linked_user uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  app         public.reseller_applications%rowtype;
  target_user uuid;
  new_number  text;
  new_partner uuid;
begin
  select * into app from public.reseller_applications where id = p_application_id;
  if not found then
    raise exception 'application % not found', p_application_id;
  end if;
  if app.status = 'approved' then
    raise exception 'application % is already approved', p_application_id;
  end if;

  -- Prefer the linked account; otherwise match on the applicant's email.
  target_user := app.auth_user_id;
  if target_user is null then
    select id into target_user from auth.users where lower(email) = lower(app.email) limit 1;
  end if;

  if target_user is null then
    raise exception
      'no auth user for %. The applicant must sign in once (email OTP) before approval.',
      app.email;
  end if;

  if exists (select 1 from public.partners p where p.auth_user_id = target_user) then
    raise exception 'user % is already a partner', target_user;
  end if;

  new_number := public.vx_generate_partner_number();

  insert into public.partners (
    auth_user_id, partner_number, business_name, contact_name,
    email, phone, status, minimum_sales_required
  )
  values (
    target_user, new_number, app.business_name, app.full_name,
    app.email, app.phone, 'approved', 4
  )
  returning id into new_partner;

  update public.reseller_applications
     set status = 'approved',
         auth_user_id = coalesce(auth_user_id, target_user)
   where id = p_application_id;

  return query select new_partner, new_number, target_user;
end;
$$;

revoke execute on function public.vx_approve_application_admin(uuid) from public, anon, authenticated;

-- Reject an application (no partner record is created).
create or replace function public.vx_reject_application_admin(p_application_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reseller_applications
     set status = 'rejected'
   where id = p_application_id and status = 'pending';
end;
$$;

revoke execute on function public.vx_reject_application_admin(uuid) from public, anon, authenticated;

-- =====================================================================
-- 7) Storage
--
-- Both buckets are PRIVATE and have NO storage policies. With a private bucket
-- and no policies, only the service-role key can read or write objects — so the
-- server is the only path in or out, and it checks ownership first. Files are
-- served exclusively through short-lived signed URLs.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('agreements', 'agreements', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('client-files', 'client-files', false)
on conflict (id) do nothing;

-- =====================================================================
-- RLS VERIFICATION
-- Run this after migrating. Every row must show rls_enabled = true.
-- Every table below must have ZERO write policies.
-- =====================================================================
-- select
--   c.relname                          as table_name,
--   c.relrowsecurity                   as rls_enabled,
--   count(p.polname) filter (where p.polcmd = 'r') as read_policies,
--   count(p.polname) filter (where p.polcmd <> 'r') as write_policies
-- from pg_class c
-- join pg_namespace n on n.oid = c.relnamespace
-- left join pg_policy p on p.polrelid = c.oid
-- where n.nspname = 'public' and c.relkind = 'r'
-- group by c.relname, c.relrowsecurity
-- order by c.relname;
