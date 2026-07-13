-- =====================================================================
-- VYNTEX — Supabase migration (Phase 4)
--
-- Additive. Run AFTER supabase/schema.sql. Does not modify any Phase 3 table.
-- Run the whole file in the Supabase SQL editor.
--
-- SECURITY MODEL
--   Reads   : performed by the user's own session -> RLS scopes them to
--             their own rows.
--   Writes  : performed by trusted server code with the service-role key,
--             which bypasses RLS. There are therefore NO insert/update/delete
--             policies anywhere below. That is deliberate, not an omission:
--             a browser cannot write to any of these tables at all.
--   Pricing : wholesale pricing is NOT stored in the database. It lives only
--             in lib/pricing.ts and is rendered server-side after
--             getPartnerAccess() returns state='active'. There is no table to
--             leak and no query that can return it.
-- =====================================================================

create extension if not exists "pgcrypto";

-- =====================================================================
-- Partner number generator: VTX-XXXXXX
-- CSPRNG-backed, non-sequential, ambiguous characters removed (no 0/1/I/L/O/U).
-- Loops until it finds a value not already taken.
-- =====================================================================
create or replace function public.vx_generate_partner_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  candidate text;
  i int;
  attempts int := 0;
begin
  loop
    attempts := attempts + 1;
    candidate := 'VTX-';
    for i in 1..6 loop
      candidate := candidate ||
        substr(alphabet, 1 + (get_byte(gen_random_bytes(1), 0) % length(alphabet)), 1);
    end loop;

    exit when not exists (
      select 1 from public.partners p where p.partner_number = candidate
    );

    if attempts > 50 then
      raise exception 'vx_generate_partner_number: exhausted attempts';
    end if;
  end loop;

  return candidate;
end;
$$;

-- =====================================================================
-- 1) reseller_applications  (server-write only; owner-read once linked)
-- =====================================================================
create table if not exists public.reseller_applications (
  id                uuid primary key default gen_random_uuid(),
  auth_user_id      uuid references auth.users (id) on delete set null,
  full_name         text not null,
  business_name     text not null,
  email             text not null,
  phone             text not null,
  website           text,
  city              text not null,
  state             text not null,
  client_count      text not null,
  services_interest text[] not null default '{}',
  resell_model      text not null,
  message           text,
  language          text not null default 'en',
  ip_hash           text,
  status            text not null default 'pending'
                    check (status in ('pending','approved','rejected','withdrawn')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists reseller_applications_email_idx
  on public.reseller_applications (lower(email));
create index if not exists reseller_applications_status_idx
  on public.reseller_applications (status, created_at desc);

alter table public.reseller_applications enable row level security;

-- An applicant may read their OWN application only if it is linked to their
-- account. The public cannot read applications at all.
drop policy if exists "applications_select_own" on public.reseller_applications;
create policy "applications_select_own" on public.reseller_applications
  for select using (auth.uid() is not null and auth.uid() = auth_user_id);

drop trigger if exists reseller_applications_set_updated_at on public.reseller_applications;
create trigger reseller_applications_set_updated_at
  before update on public.reseller_applications
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 2) partners
-- =====================================================================
create table if not exists public.partners (
  id                     uuid primary key default gen_random_uuid(),
  auth_user_id           uuid not null unique references auth.users (id) on delete cascade,
  partner_number         text not null unique,
  business_name          text not null,
  contact_name           text not null,
  email                  text not null,
  phone                  text,
  status                 text not null default 'pending'
                         check (status in ('pending','approved','active','suspended','expired','terminated')),
  activation_date        timestamptz,
  expiration_date        timestamptz,
  annual_sales_count     integer not null default 0 check (annual_sales_count >= 0),
  minimum_sales_required integer not null default 4 check (minimum_sales_required >= 0),
  agreement_id           uuid,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists partners_status_idx on public.partners (status);
create index if not exists partners_expiration_idx on public.partners (expiration_date);

alter table public.partners enable row level security;

drop policy if exists "partners_select_own" on public.partners;
create policy "partners_select_own" on public.partners
  for select using (auth.uid() = auth_user_id);

drop trigger if exists partners_set_updated_at on public.partners;
create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 3) reseller_agreements
-- =====================================================================
create table if not exists public.reseller_agreements (
  id                  uuid primary key default gen_random_uuid(),
  partner_id          uuid not null references public.partners (id) on delete cascade,
  agreement_version   text not null,
  agreement_hash      text not null,
  agreement_language  text not null default 'en',
  signed_name         text not null,
  signed_business_name text not null,
  signed_title        text not null,
  signed_email        text not null,
  signed_at           timestamptz not null default now(),
  ip_hash             text,
  user_agent          text,
  consent_text        text not null,
  document_path       text,
  status              text not null default 'signed'
                      check (status in ('signed','superseded','voided')),
  created_at          timestamptz not null default now()
);
create index if not exists reseller_agreements_partner_idx
  on public.reseller_agreements (partner_id, signed_at desc);

alter table public.reseller_agreements enable row level security;

-- A partner may read only their own agreements. The public cannot read any.
drop policy if exists "agreements_select_own" on public.reseller_agreements;
create policy "agreements_select_own" on public.reseller_agreements
  for select using (
    exists (
      select 1 from public.partners p
      where p.id = reseller_agreements.partner_id
        and p.auth_user_id = auth.uid()
    )
  );

-- Now that reseller_agreements exists, wire up the partners FK.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'partners_agreement_id_fkey'
  ) then
    alter table public.partners
      add constraint partners_agreement_id_fkey
      foreign key (agreement_id) references public.reseller_agreements (id)
      on delete set null;
  end if;
end
$$;

-- =====================================================================
-- 4) agreement_audit_events   (append-only; server-write only; no public read)
-- =====================================================================
create table if not exists public.agreement_audit_events (
  id           uuid primary key default gen_random_uuid(),
  agreement_id uuid not null references public.reseller_agreements (id) on delete cascade,
  event_type   text not null
               check (event_type in ('viewed','consented','signed','emailed','downloaded')),
  event_data   jsonb not null default '{}'::jsonb,
  ip_hash      text,
  user_agent   text,
  created_at   timestamptz not null default now()
);
create index if not exists agreement_audit_events_agreement_idx
  on public.agreement_audit_events (agreement_id, created_at desc);

alter table public.agreement_audit_events enable row level security;
-- No policies at all: the audit trail is server-only. Not even the partner may
-- read (let alone alter) their own audit events through the API.

-- =====================================================================
-- 5) orders
-- =====================================================================
create table if not exists public.orders (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users (id) on delete set null,
  partner_id             uuid references public.partners (id) on delete set null,
  customer_email         text not null,
  customer_name          text,
  order_type             text not null
                         check (order_type in ('direct','reseller_activation','reseller_renewal','partner_wholesale')),
  status                 text not null default 'pending'
                         check (status in ('pending','paid','failed','canceled','refunded')),
  subtotal               integer not null check (subtotal >= 0),   -- cents
  tax                    integer not null default 0 check (tax >= 0),
  total                  integer not null check (total >= 0),
  currency               text not null default 'USD',
  client_reference       text,
  notes                  text,
  language               text not null default 'en',
  square_payment_link_id text,
  square_order_id        text,
  square_payment_id      text,
  paid_at                timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_partner_idx on public.orders (partner_id, created_at desc);
create unique index if not exists orders_square_order_idx
  on public.orders (square_order_id) where square_order_id is not null;

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() is not null and auth.uid() = user_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 6) order_items
-- =====================================================================
create table if not exists public.order_items (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid not null references public.orders (id) on delete cascade,
  service_key           text not null,
  service_name_snapshot text not null,
  unit_price            integer not null check (unit_price >= 0),  -- cents
  quantity              integer not null default 1 check (quantity > 0),
  billing_type          text not null
                        check (billing_type in ('one_time','setup','recurring_monthly','annual')),
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- =====================================================================
-- 7) payment_events   (server-only; the idempotency ledger)
-- =====================================================================
create table if not exists public.payment_events (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid references public.orders (id) on delete set null,
  provider          text not null default 'square',
  provider_event_id text not null,
  event_type        text not null,
  payload_hash      text,
  processed_at      timestamptz,
  status            text not null default 'received'
                    check (status in ('received','processed','ignored','error')),
  created_at        timestamptz not null default now()
);

-- THE idempotency guard. Square retries webhooks; this unique index means a
-- replayed event can never apply its side effects twice.
create unique index if not exists payment_events_provider_event_idx
  on public.payment_events (provider, provider_event_id);

alter table public.payment_events enable row level security;
-- No policies: payment events are never readable by any browser session.

-- =====================================================================
-- 8) partner_sales
-- =====================================================================
create table if not exists public.partner_sales (
  id              uuid primary key default gen_random_uuid(),
  partner_id      uuid not null references public.partners (id) on delete cascade,
  order_id        uuid not null references public.orders (id) on delete cascade,
  service_key     text not null,
  wholesale_amount integer not null check (wholesale_amount >= 0), -- cents
  client_price    integer,  -- cents; null unless the partner chooses to report it
  qualifying_sale boolean not null default false,
  status          text not null default 'recorded'
                  check (status in ('recorded','reversed')),
  recorded_at     timestamptz not null default now()
);
create unique index if not exists partner_sales_order_idx on public.partner_sales (order_id);
create index if not exists partner_sales_partner_idx
  on public.partner_sales (partner_id, recorded_at desc);

alter table public.partner_sales enable row level security;

drop policy if exists "partner_sales_select_own" on public.partner_sales;
create policy "partner_sales_select_own" on public.partner_sales
  for select using (
    exists (
      select 1 from public.partners p
      where p.id = partner_sales.partner_id
        and p.auth_user_id = auth.uid()
    )
  );

-- =====================================================================
-- 9) partner_renewals
-- =====================================================================
create table if not exists public.partner_renewals (
  id               uuid primary key default gen_random_uuid(),
  partner_id       uuid not null references public.partners (id) on delete cascade,
  renewal_year     integer not null,
  payment_order_id uuid references public.orders (id) on delete set null,
  amount           integer not null check (amount >= 0), -- cents
  status           text not null default 'pending'
                   check (status in ('pending','paid','failed','canceled')),
  starts_at        timestamptz,
  expires_at       timestamptz,
  created_at       timestamptz not null default now()
);
create index if not exists partner_renewals_partner_idx
  on public.partner_renewals (partner_id, created_at desc);

alter table public.partner_renewals enable row level security;

drop policy if exists "partner_renewals_select_own" on public.partner_renewals;
create policy "partner_renewals_select_own" on public.partner_renewals
  for select using (
    exists (
      select 1 from public.partners p
      where p.id = partner_renewals.partner_id
        and p.auth_user_id = auth.uid()
    )
  );

-- =====================================================================
-- Atomic sales counter.
-- Called by the Square webhook (service role) after a verified wholesale
-- payment. Doing this in SQL avoids a read-modify-write race between two
-- webhook deliveries landing at once.
-- =====================================================================
create or replace function public.vx_increment_partner_sales(p_partner_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.partners
     set annual_sales_count = annual_sales_count + 1
   where id = p_partner_id
  returning annual_sales_count into new_count;

  return coalesce(new_count, 0);
end;
$$;

revoke execute on function public.vx_increment_partner_sales(uuid) from public, anon, authenticated;

-- =====================================================================
-- ADMIN: approve a reseller application.
--
-- A full admin dashboard is out of scope for Phase 4. Approval is therefore a
-- single deliberate statement run by the business owner in the Supabase SQL
-- editor (which runs as the service role):
--
--     select * from public.vx_approve_reseller_application(
--       '<application-uuid>',
--       '<auth-user-uuid>'     -- the account the partner will sign in with
--     );
--
-- It returns the new partner id and the generated VTX-XXXXXX number.
--
-- IMPORTANT: the applicant must already have signed in at least once (via the
-- email OTP flow) so an auth.users row exists to link. Look it up with:
--     select id, email from auth.users where email = 'partner@example.com';
--
-- The partner is created with status='approved', NOT 'active'. They still have
-- to sign the agreement and pay the $199 activation before the webhook flips
-- them to 'active'. Wholesale pricing stays locked until then.
-- =====================================================================
create or replace function public.vx_approve_reseller_application(
  p_application_id uuid,
  p_auth_user_id   uuid
)
returns table (partner_id uuid, partner_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  app         public.reseller_applications%rowtype;
  new_number  text;
  new_partner uuid;
begin
  select * into app
    from public.reseller_applications
   where id = p_application_id;

  if not found then
    raise exception 'application % not found', p_application_id;
  end if;

  if app.status = 'approved' then
    raise exception 'application % is already approved', p_application_id;
  end if;

  if exists (select 1 from public.partners p where p.auth_user_id = p_auth_user_id) then
    raise exception 'user % is already a partner', p_auth_user_id;
  end if;

  new_number := public.vx_generate_partner_number();

  insert into public.partners (
    auth_user_id, partner_number, business_name, contact_name,
    email, phone, status, minimum_sales_required
  )
  values (
    p_auth_user_id, new_number, app.business_name, app.full_name,
    app.email, app.phone, 'approved', 4
  )
  returning id into new_partner;

  update public.reseller_applications
     set status = 'approved',
         auth_user_id = coalesce(auth_user_id, p_auth_user_id)
   where id = p_application_id;

  return query select new_partner, new_number;
end;
$$;

revoke execute on function public.vx_approve_reseller_application(uuid, uuid) from public, anon, authenticated;

-- =====================================================================
-- ADMIN: suspend / reinstate / terminate a partner.
--     select public.vx_set_partner_status('<partner-uuid>', 'suspended');
-- =====================================================================
create or replace function public.vx_set_partner_status(
  p_partner_id uuid,
  p_status     text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('pending','approved','active','suspended','expired','terminated') then
    raise exception 'invalid partner status: %', p_status;
  end if;

  update public.partners set status = p_status where id = p_partner_id;
end;
$$;

revoke execute on function public.vx_set_partner_status(uuid, text) from public, anon, authenticated;

-- =====================================================================
-- STORAGE: private bucket for signed agreement PDFs.
-- Private, so there is no public URL. The server issues short-lived signed URLs
-- only after verifying the requester owns the agreement.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('agreements', 'agreements', false)
on conflict (id) do nothing;

-- No storage policies are created: with the bucket private and no policies,
-- only the service-role key can read or write objects in it.
