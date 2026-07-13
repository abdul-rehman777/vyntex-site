# VYNTEX — Official Website

AI Automation · Web Development · Digital Technology
Northfield, NJ · Bilingual EN/ES · [vyntexusa.com](https://vyntexusa.com)

Production-ready foundation built with **Next.js 15 (App Router)**, **TypeScript**,
**Tailwind CSS**, **Framer Motion**, and **Lucide** icons. Auth/OTP/database
(**Supabase**), transactional email (**Resend**), rate limiting (**Upstash Redis**),
and payments (**Square**) are wired in as modular libraries and activate as later
phases are built. The app runs locally with **zero** third-party keys configured.

---

## Phase status

**Phase 1: foundation + design system.** Config, design tokens, centralized
pricing/business/translation data, SEO metadata, structured data, responsive
bilingual nav and footer, one-page shell.

**Phase 2 (this build): complete public marketing site.** Hero with an
interactive automation example, Services, How It Works, an AI Automation
Showcase (4 demo tabs), Pricing (driven entirely from `lib/pricing.ts`),
Industries, a Case Studies placeholder, About, a public Reseller preview, FAQ
with visible-content FAQ schema, a Contact preview (details + a disabled
Phase-3 form), and a final CTA. All copy is bilingual EN/ES.

Still **not** built (later phases): live form submission, consultation
submission, reseller authentication, client login, OTP, checkout, Square
payments, e-signatures, protected portal, database tables.

### Phase 2 components

| Section | File | Notes |
|---|---|---|
| Hero | `components/Hero.tsx` | single H1; interactive automation example (illustrative) |
| Services | `components/Services.tsx` | 6 cards + automatable-process chips |
| How It Works | `components/HowItWorks.tsx` | 5-step timeline, connector drawn once on view |
| AI Showcase | `components/AIShowcase.tsx` | tabs: Lead, Chatbot, CRM, Onboarding + disclaimer |
| Pricing | `components/Pricing.tsx` | tabbed; every value from `lib/pricing.ts` + `LABOR_TERMS` |
| Industries | `components/Industries.tsx` | 14 cards; healthcare says "HIPAA-aware may be scoped" |
| Case Studies | `components/CaseStudies.tsx` | placeholder only — no invented results |
| About | `components/About.tsx` | verified copy; 3 values; location |
| Partners | `components/Partners.tsx` | public preview only; no wholesale data |
| FAQ | `components/FAQ.tsx` | accordion + FAQPage JSON-LD matching visible text |
| Contact | `components/ContactPreview.tsx` | working tel/mailto; disabled Phase-3 form |
| Final CTA | `components/FinalCTA.tsx` | links to Pricing + Contact |
| UI primitives | `components/ui/AnimatedSection, ServiceCard, PricingCard, AutomationFlow, TerminalDemo, Accordion` | reusable; motion respects `prefers-reduced-motion` |

`app/page.tsx` is a Server Component that composes the sections (each section is
a self-contained Client Component), so the page ships no client JS of its own
and every section still server-renders for SEO. Reseller wholesale pricing lives
only in `lib/pricing.ts` and is never imported into a client component.

---

## Prerequisites

- **Node.js 20+** — https://nodejs.org
- **npm** (ships with Node)

---

## Install & run

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file (values optional in Phase 1)
cp .env.example .env.local

# 3. Start the dev server
npm run dev
# open http://localhost:3000

# Type-check without emitting
npm run typecheck

# Production build + start
npm run build
npm start
```

The site builds and runs even with an empty `.env.local`. Supabase, Resend, and
Upstash all degrade gracefully until configured.

---

## The logo (transparent version)

The provided source logo (`vyntex_logo.png`) had a solid near-black background.
Two transparent, production-ready assets are already included in `public/`:

- `public/vyntex-logo.png` — full transparent lockup (icon + wordmark + tagline).
- `public/vyntex-mark.png` — the V monogram only, used in the nav and footer beside
  the "VYNTEX" text wordmark (the full lockup is unreadable at nav height).

These were produced by luminance-keying the dark background to transparent while
preserving the silver, blue, and glow detail — **the logo was not redesigned**.
They are tuned for the site's near-black surfaces (the only backgrounds used).

**To regenerate a transparent logo yourself** if you get a new source file:

1. Fastest: upload it to https://remove.bg and download the transparent PNG.
2. In an editor (Photoshop/Figma/GIMP): select the dark background by color range /
   luminance, delete it, keep the silver + blue detail and glow, then export as PNG
   with transparency. Preserve the original aspect ratio.
3. Replace `public/vyntex-logo.png` (keep the same filename). If the new file is a
   full lockup, also export a monogram-only crop to `public/vyntex-mark.png`.

Do not stretch, recolor, crop the mark's proportions, or place the logo inside a box.

---

## Environment variables

All variables live in `.env.example`. Copy to `.env.local` and fill in as each
phase is activated. Only `NEXT_PUBLIC_*` values are exposed to the browser.

| Variable | Purpose | Needed for |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical apex URL | metadata, sitemap, robots |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | auth, OTP, DB (later) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin key — never exposed | trusted server ops (later) |
| `RESEND_API_KEY` | Transactional email | forms, OTP, agreements (later) |
| `INTERNAL_INBOX` | Internal notification inbox | forms (later) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting | public endpoints (later) |
| `SQUARE_ENV` / `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` / `SQUARE_APPLICATION_ID` | Payments | checkout (later) |
| `SMTP_*` / `FROM_EMAIL` | Optional SMTP fallback | only if Resend unavailable |

---

## Project structure

```
vyntex/
├── app/
│   ├── layout.tsx        # metadata, JSON-LD, fonts, LanguageProvider
│   ├── page.tsx          # Phase 1 landing shell (all hash sections)
│   ├── globals.css       # design tokens, focus states, reduced-motion
│   ├── fonts.ts          # Inter + JetBrains Mono (next/font)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Nav.tsx           # sticky, responsive, active-section, mobile drawer
│   ├── Footer.tsx
│   └── ui/               # Button, Container, SectionHeading, GlowCard, LanguageToggle
├── context/
│   └── LanguageContext.tsx   # EN/ES with localStorage persistence
├── lib/
│   ├── site.ts           # verified business info + nav config
│   ├── pricing.ts        # SINGLE SOURCE of direct + reseller pricing
│   ├── translations.ts   # EN/ES UI strings
│   ├── schema.ts         # JSON-LD (verified facts only)
│   ├── resend.ts         # email (modular)
│   ├── rate-limit.ts     # Upstash (modular, no-op fallback)
│   └── supabase/         # client.ts + server.ts
├── middleware.ts         # Supabase session refresh (no-op until configured)
├── public/               # vyntex-logo.png, vyntex-mark.png, og-image.png
├── tailwind.config.ts    # VYNTEX design tokens
├── next.config.ts        # www → apex redirect, image config
└── .env.example
```

### Where to change things

| To change… | Edit |
|---|---|
| Any price | `lib/pricing.ts` |
| Business info (email, phones, address) | `lib/site.ts` |
| UI copy (EN + ES) | `lib/translations.ts` |
| Colors / design tokens | `tailwind.config.ts` + `app/globals.css` |
| SEO metadata | `app/layout.tsx` |
| Structured data | `lib/schema.ts` |
| Logo | replace files in `public/` (keep filenames) |

---

## Design system

Approved palette (from the logo): near-black background `#050714`, deep navy panels
`#0A0D1F` / `#0E1229`, chrome silver `#CBD5E1`, electric blue `#0EA5E9`, cyan `#22D3EE`.
No violet, no gold. Type: **Inter** (display + body), **JetBrains Mono** (labels/data).
Featured pricing cards use a blue/cyan glow, never gold.

---

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo at https://vercel.com/new (Next.js auto-detected).
3. Add environment variables (Settings → Environment Variables) as each phase goes live.
4. Add domains `vyntexusa.com` and `www.vyntexusa.com`; the apex is canonical and
   `www` redirects to it (`next.config.ts` enforces this at the app layer too).
5. Vercel provisions SSL automatically.

---

## Notes

- `next-env.d.ts` is generated automatically on first `npm run dev` / `npm run build`.
- The reseller agreement is a business template and must be reviewed by a licensed
  attorney before use. The typed-name signature flow (later phase) is **not** an
  enterprise e-signature platform; DocuSign / Dropbox Sign / Adobe / PandaDoc can be
  connected later.

## Phase 3 (this build): live forms, auth, and client portal

Adds working server-backed features on top of the Phase 2 marketing site.

**Forms (server route handlers, `runtime = "nodejs"`)**
- Live **Contact** form and a **Book a Consultation** modal (focus-trapped, ESC to close, restores focus). Both validate on the client (RHF + Zod, translated messages) and again on the server (`lib/validation/*`).
- Anti-spam: hidden honeypot, minimum completion time, and link-flood checks (`lib/request.ts`). Upstash rate limits per IP (`lib/rate-limit.ts`): contact 5/h, consultation 3/h.
- Email via Resend (`lib/email/templates.ts`): internal notification to `CONTACT_TO_EMAIL` + a bilingual confirmation to the submitter. Submissions are saved even if email fails (a "partial success" state is shown). Submissions are written server-side with the **service-role** client (`lib/supabase/admin.ts`, `server-only`), so the tables need no public insert policy.

**Auth (Supabase email OTP)**
- `/login` requests a 6-digit code (`/api/auth/otp`, rate-limited 5/h); `/verify` confirms it (`/api/auth/verify`, 10 per 15 min) and sets the session cookie. `/auth/callback` handles the magic-link path.
- `middleware.ts` refreshes the session and guards routes: `/portal` → `/login` when signed out; `/login` and `/verify` → `/portal` when signed in. The portal page also calls `requireUser()` server-side (defense in depth).

**Client portal (`/portal`, dynamic, noindex)**
- Editable profile (server action `app/portal/actions.ts`, RLS-scoped) and a working support-request form + list (`/api/support`, 10/h). Projects / Orders / Agreements / Files are labeled empty states for later phases.

**Database (`supabase/schema.sql`)** — 4 tables with RLS enabled:
- `contact_submissions`, `consultation_requests`: **no** anon/authenticated policies (server/service-role only).
- `user_profiles`, `support_requests`: owner-scoped (`auth.uid()`), users see and change only their own rows. IPs are stored only as a salted hash.

**New env** (`.env.example`): `SUPABASE_SERVICE_ROLE_KEY` (server-only), `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `FROM_EMAIL`, `IP_HASH_SALT`, and the Upstash pair. The site still builds and runs with these empty (forms and auth return clear errors instead of crashing).

**Still not built (later phases):** Square/Stripe checkout, reseller enrollment + wholesale portal, e-signature capture, legal pages (`/privacy`, `/terms`, `/cookies`, `/accessibility`), chatbot widget, and testimonials (only if real ones are provided).

---

# Phase 4 — Reseller Program, Agreements & Square Checkout

Phase 4 adds the Authorized Reseller Program end to end: application, approval,
agreement signature with an audit trail, Square-hosted checkout, the confidential
wholesale library, and partner renewal enforcement.

## Install

```bash
npm install
```

Two new dependencies were added in this phase:

```bash
npm install square pdf-lib
```

- **`square`** — the official SDK. Used for Payment Links and, critically,
  `WebhooksHelper.verifySignature`.
- **`pdf-lib`** — generates the signed-agreement PDF. Chosen over pdfkit or
  Puppeteer because it is pure JS with embedded standard fonts: no filesystem
  access, no Chromium binary, so it runs reliably inside a Vercel Node function.

## Database migration

Run **`supabase/phase4-migration.sql`** in the Supabase SQL editor, after
`supabase/schema.sql`. It is additive — no Phase 3 table is modified.

It creates nine tables (`reseller_applications`, `partners`,
`reseller_agreements`, `agreement_audit_events`, `orders`, `order_items`,
`payment_events`, `partner_sales`, `partner_renewals`), enables RLS on all of
them, and creates the private `agreements` storage bucket.

### The RLS model, stated plainly

- **Reads** happen through the user's own session, so RLS scopes every query to
  their own rows.
- **Writes** happen only through trusted server code using the service-role key.
  There are therefore **no INSERT/UPDATE/DELETE policies anywhere.** That is
  deliberate: a browser cannot write to any Phase 4 table at all.
- `agreement_audit_events` and `payment_events` have **no policies whatsoever** —
  not even read. The audit trail is not readable or alterable through the API by
  anyone, including the partner it belongs to.

### Approving a partner

There is no admin dashboard yet, by design. Approval is a single deliberate
statement you run in the Supabase SQL editor.

The applicant must sign in once first (via the email OTP flow) so an `auth.users`
row exists to attach the partner record to:

```sql
-- 1. Find the application and the user's auth id
select id, business_name, email, status from public.reseller_applications
 where status = 'pending' order by created_at desc;

select id, email from auth.users where email = 'partner@example.com';

-- 2. Approve
select * from public.vx_approve_reseller_application(
  '<application-uuid>',
  '<auth-user-uuid>'
);
-- returns: partner_id | partner_number  (e.g. VTX-K7M2QX)
```

The partner is created with status **`approved`**, *not* `active`. Wholesale
pricing stays locked. They must still sign the agreement and pay the $199
activation; only the verified Square webhook flips them to `active`.

To suspend, reinstate, or terminate:

```sql
select public.vx_set_partner_status('<partner-uuid>', 'suspended');
```

## Square setup (sandbox first)

1. **Developer dashboard** → <https://developer.squareup.com/apps> → create an
   application.
2. **Sandbox** tab → copy the **Sandbox Access Token** → `SQUARE_ACCESS_TOKEN`.
3. **Locations** → copy the sandbox **Location ID** → `SQUARE_LOCATION_ID`.
4. Set `SQUARE_ENVIRONMENT=sandbox`.
5. **Webhooks → Subscriptions → Add endpoint.**
   - URL: `https://<your-domain>/api/square/webhook`
     (locally, tunnel it: `npx untun tunnel http://localhost:3000` or ngrok)
   - Events: `payment.created`, `payment.updated`, `refund.updated`
   - Copy the **Signature Key** → `SQUARE_WEBHOOK_SIGNATURE_KEY`
   - Put the **exact same URL** into `SQUARE_WEBHOOK_NOTIFICATION_URL`.

> **The notification URL must match byte-for-byte.** Square signs
> `notification_url + raw_body`. A trailing slash difference makes every webhook
> fail verification, and payments will silently never confirm. This is the single
> most common Square integration mistake.

6. Test with Square's sandbox card: `4111 1111 1111 1111`, any future expiry,
   any CVV, postal `10003`.
7. To go live: swap in the production token, location, and a **new** signature key
   (the sandbox key does not work in production), and set
   `SQUARE_ENVIRONMENT=production`.

## Security invariants

These are the load-bearing guarantees. Each is enforced by construction, not by
convention:

1. **The browser never states a price.** `/api/checkout/create` accepts an order
   type and a service key — there is no amount field in the Zod schema. The
   server resolves the amount from `lib/pricing.ts` (`lib/orders.ts#resolveOrder`).
   A tampered request buys nothing at a discount.

2. **Confidential pricing is `server-only`.** `RESELLER_PRICING` lives in
   `lib/pricing-reseller.ts`, which imports `server-only`. A Client Component
   that imports it **fails the build**. The wholesale rows reach an authorized
   partner as props from a Server Component, so they exist only in the response
   to a request that already passed the active-partner check — never in a
   downloadable JS chunk.

   > Verified: `grep -r "RESELLER_PRICING" .next/static/` returns nothing, and
   > no wholesale-only figure ($300 / $660 / $720 / $650 / $210 / $360 / $150 /
   > $440 / $480 / $76 / $64) appears in any client bundle.

3. **Only a verified webhook can mark an order paid.** Returning from Square
   proves nothing. `/checkout/success` reads the status from our database and
   says *"confirming your payment"* until `/api/square/webhook` has verified the
   HMAC signature against the raw request body. Partner activation, expiry
   extension, and qualifying-sale recording all hang off that same gate.

4. **Webhook processing is idempotent.** A unique index on
   `payment_events (provider, provider_event_id)` means Square's retries — which
   are normal — cannot double-activate a partner or double-count a sale.

5. **Quote-only tiers cannot be auto-charged.** Any price ending in `+`
   ($2,000+, $4,000+, $1,200+) is a starting price, so it is excluded from every
   picker and rejected by the API with `quote_required`.

6. **Raw IPs are never stored.** Only `sha256(salt + ip)`, via `IP_HASH_SALT`.

7. **The webhook bypasses middleware.** `middleware.ts` excludes
   `/api/square/webhook` from its matcher so the raw body arrives byte-for-byte.

## The agreement

`lib/agreement-content.ts` is the single canonical source. The same text is used
to render the page, compute the SHA-256 hash stored with every signature, and
generate the PDF — so what a partner reads is provably what they signed.

**Version 2.0** derives verbatim from the uploaded reseller agreement, with two
corrections and no change to business meaning:

1. Contact details updated to the official ones (the legacy file carried a
   retired email and phone number).
2. The English §8 now states that the English version controls. The Spanish §8
   already said this; the English did not, leaving the two versions asymmetric.

**What the signature is:** a typed-name electronic signature with a tamper-evident
audit trail (agreement hash, signer, title, timestamp, salted IP hash, user
agent, consent text, and `viewed`/`consented`/`signed`/`emailed`/`downloaded`
events).

**What it is not:** a certificate-based e-signature service. The UI says so
explicitly. We do not claim DocuSign equivalency. The attorney-review disclaimer
from the source agreement is preserved verbatim in both languages.

## Routes added

| Route | Access |
|---|---|
| `/partners/apply` | Public |
| `/checkout` | Public |
| `/checkout/success` · `/checkout/cancel` | Public, noindex |
| `/portal/partner` | Authenticated; **wholesale library renders only when active** |
| `/portal/partner/agreement` | Authenticated partner |
| `/portal/partner/orders` | Authenticated partner |
| `/portal/orders` | Authenticated |
| `/api/reseller/apply` | Public, rate-limited |
| `/api/reseller/agreement/sign` · `/download` | Authenticated partner |
| `/api/checkout/create` | Public for `direct`; partner-gated otherwise |
| `/api/square/webhook` | Square only (HMAC-verified) |

## Verify

```bash
npm run typecheck   # tsc --noEmit
npm run build
```

---

# DEPLOYMENT — read this first

Everything below is the complete path from this ZIP to a live, reviewable site.
No further coding phase is required.

## 0. What you are deploying

| | |
|---|---|
| **Framework** | Next.js 15 App Router · React 19 · TypeScript strict |
| **Database / auth / storage** | Supabase |
| **Payments** | Square (hosted checkout — no card data ever touches this app) |
| **Email** | Resend, behind a durable retry outbox |
| **Rate limiting** | Upstash Redis |
| **Hosting** | Vercel (incl. Vercel Cron) |
| **Runtime** | Node.js — declared explicitly on every API route |

---

## 1. GitHub

```bash
unzip vyntex-final-production.zip
cd vyntex
git init
git add .
git commit -m "VYNTEX production site"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/vyntex.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `.next/`, every `.env*` except
`.env.example`, test artifacts, OS metadata, and `*.zip`. **`.env.example`
contains no real values.**

---

## 2. Supabase — run the migrations IN THIS ORDER

Supabase Dashboard → **SQL Editor** → paste and run each file, in order. All
migrations are additive; none is destructive.

| # | File | When |
|---|---|---|
| 1 | `supabase/schema.sql` | **Only on a brand-new Supabase project.** Skip if you already ran it. |
| 2 | `supabase/phase4-migration.sql` | Always (unless already run). |
| 3 | `supabase/phase5-migration.sql` | Always. |

There is no seed script and none is needed.

### 2a. Authentication

**Authentication → Providers → Email**
- Enable **Email**
- **Disable** "Confirm email" (we use OTP codes, not confirmation links)
- Enable **Email OTP**

**Authentication → URL Configuration**
- **Site URL:** `https://vyntexusa.com`
- **Redirect URLs:** add both
  - `https://vyntexusa.com/auth/callback`
  - `https://vyntexusa.com/**`

### 2b. Storage

The migrations create both buckets automatically. Verify under **Storage**:

| Bucket | Public? | Policies |
|---|---|---|
| `agreements` | **No** | **None** |
| `client-files` | **No** | **None** |

> Zero policies on a private bucket is correct, not an oversight. It means only
> the service-role key can read or write objects — so the server is the only
> path in or out, and it checks ownership before issuing a short-lived signed
> URL. There is no public file URL anywhere in this system.

### 2c. Create the first administrator

The account must sign in **once** at `/login` first, so an `auth.users` row
exists to attach to. Then, in the SQL editor:

```sql
insert into public.admin_users (auth_user_id, email, role)
select id, email, 'super_admin' from auth.users
 where email = 'info@vyntexusa.com'
on conflict (auth_user_id) do update
  set role = 'super_admin', is_active = true;
```

There is deliberately **no self-service path** to becoming an administrator.

### 2d. Verify RLS

```sql
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  count(p.polname) filter (where p.polcmd = 'r')  as read_policies,
  count(p.polname) filter (where p.polcmd <> 'r') as write_policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policy p on p.polrelid = c.oid
where n.nspname = 'public' and c.relkind = 'r'
group by c.relname, c.relrowsecurity
order by c.relname;
```

**Expected:** `rls_enabled = true` on every row, and `write_policies = 0`
everywhere. Writes go exclusively through server code holding the service-role
key. A browser cannot write to any table.

---

## 3. Square

### Sandbox (use this for the first live review)

1. <https://developer.squareup.com/apps> → your app → **Sandbox**
2. Copy **Sandbox Access Token** → `SQUARE_ACCESS_TOKEN`
3. **Locations** → copy the sandbox Location ID → `SQUARE_LOCATION_ID`
4. `SQUARE_ENVIRONMENT=sandbox`
5. **Webhooks → Subscriptions → Add endpoint**
   - URL: `https://YOUR-DOMAIN/api/square/webhook`
   - Events: `payment.created`, `payment.updated`, `refund.updated`
   - Copy the **Signature Key** → `SQUARE_WEBHOOK_SIGNATURE_KEY`
   - Put the **identical** URL into `SQUARE_WEBHOOK_NOTIFICATION_URL`

> ### ⚠️ The one mistake that silently breaks payments
> Square signs `notification_url + raw_body`. If `SQUARE_WEBHOOK_NOTIFICATION_URL`
> differs from the registered URL **by even a trailing slash**, every webhook
> fails verification, no order is ever marked paid, and no partner is ever
> activated — with no visible error. There is an automated test asserting exactly
> this failure mode (`tests/integration/square-webhook.test.ts`).

Sandbox test card: `4111 1111 1111 1111`, any future expiry, any CVV, postal `10003`.

While in sandbox, the admin portal shows a persistent banner:
**"SANDBOX — test payments only, no real money moves."** No test payment can be
mistaken for revenue.

### Switching to production — **no code change required**

Change three environment variables in Vercel and redeploy:

```
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=<production token>
SQUARE_LOCATION_ID=<production location id>
SQUARE_WEBHOOK_SIGNATURE_KEY=<NEW key from the PRODUCTION webhook subscription>
```

The sandbox signature key does **not** work in production — you must create a
separate production webhook subscription and copy its own key. The admin banner
flips to **"PRODUCTION — real cards are being charged."**

---

## 4. Resend

1. Add and verify the domain `vyntexusa.com` (DNS records in the Resend dashboard).
2. Create an API key → `RESEND_API_KEY`.
3. `FROM_EMAIL=info@vyntexusa.com` (must be on the verified domain).

**If Resend is down, nothing is lost.** Every transactional email is written to
the `email_deliveries` outbox *before* delivery is attempted. A failure leaves
the row `pending` and the cron retries it with backoff (1m → 5m → 30m → 2h →
12h). After `max_attempts` it is marked `abandoned` and surfaced in the admin
portal — a failed email is always *visible*, never silently dropped.

---

## 5. Upstash

Create a Redis database → copy the REST URL and token.

Without them the limiters fall back to permissive **and log an error on every
boot**. Do not ship to production this way.

---

## 6. Vercel

1. **Add New → Project → import the GitHub repo.** Framework auto-detects as Next.js.
2. **Settings → Environment Variables** — add everything from section 7 below.
3. **Deploy.**
4. **Settings → Domains** — add `vyntexusa.com` and `www.vyntexusa.com`.
   `next.config.ts` already 301s www → apex at the application layer.
5. **Cron is automatic.** `vercel.json` registers both jobs on deploy:

| Job | Schedule | Does |
|---|---|---|
| `/api/cron/expire-partners` | `0 7 * * *` (daily 07:00 UTC) | Expires lapsed partner terms; emails 14-day renewal warnings |
| `/api/cron/process-emails` | `*/30 * * * *` (every 30 min) | Drains the email retry outbox |

Both **fail closed** without `CRON_SECRET` — a missing variable locks the door
rather than removing it.

### First thing to do after deploying

Open **`https://YOUR-DOMAIN/api/health`**.

It returns exactly which environment variables are missing and what each one
does — without ever echoing a secret. `"ready": true` means everything is
configured. This is faster than clicking around wondering why checkout fails.

---

## 7. Environment variables — the complete list

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical URL. Used by metadata, sitemap, email links, Square redirect. |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (public, RLS-scoped). |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-only.** Bypasses RLS. Never expose. |
| `RESEND_API_KEY` | ✅ | Transactional email. |
| `FROM_EMAIL` | ✅ | Sender address on the Resend-verified domain. |
| `CONTACT_TO_EMAIL` | ✅ | Internal inbox for form notifications. |
| `INTERNAL_INBOX` | — | Fallback for the above. |
| `IP_HASH_SALT` | ✅ | Salt for one-way IP hashing. Raw IPs are never stored. `openssl rand -hex 32` |
| `UPSTASH_REDIS_REST_URL` | ✅ | Rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Rate limiting. |
| `SQUARE_ENVIRONMENT` | ✅ | `sandbox` or `production`. |
| `SQUARE_ACCESS_TOKEN` | ✅ | **Server-only.** Never expose. |
| `SQUARE_LOCATION_ID` | ✅ | The location that receives payment. |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | ✅ | Without it, **no payment is ever confirmed**. |
| `SQUARE_WEBHOOK_NOTIFICATION_URL` | ✅ | Must match the registered URL byte-for-byte. |
| `CRON_SECRET` | ✅ | Without it, the cron jobs refuse to run. `openssl rand -hex 32` |

Every one of these is documented in `.env.example`. There are **no undocumented
required variables.**

---

## 8. Behaviour when a provider is not yet configured

The public site **always loads**. Nothing hard-crashes on a missing key.

| Missing | What happens |
|---|---|
| Square | Checkout returns `payments_unavailable`; the UI says "online payment is temporarily unavailable — contact us and we'll take your order directly." |
| Resend | Submissions still save; emails queue for retry; the user sees an honest "we have your request, the confirmation may be delayed." |
| Upstash | Limiters go permissive and log an error every boot. |
| Supabase | Forms return a server error and log it. The marketing site still renders. |
| `CRON_SECRET` | Cron routes return 401 and refuse to run. |

---

## 9. Verify

```bash
npm install
npm run typecheck   # tsc --noEmit, strict
npm run lint        # eslint
npm run test        # vitest — 94 unit + integration tests
npm run build       # next build
```

Or all four: `npm run verify`

### End-to-end (Playwright)

```bash
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```

The e2e suite needs **no live credentials** — it asserts on public behaviour,
auth redirects, accessibility, and the *absence* of confidential pricing in the
delivered HTML and JS.

---

## 10. The security properties, and why they hold

1. **Wholesale pricing cannot leak.** `RESELLER_PRICING` lives in
   `lib/pricing-reseller.ts`, which imports `server-only`. A Client Component
   that imports it **fails the build**. Rows reach an authorized partner as
   props from a Server Component — they exist only inside the response to a
   request that already passed the active-partner check, never in a downloadable
   chunk. Asserted by `tests/unit/wholesale-isolation.test.ts` and by an e2e test
   that scans every delivered byte.

2. **The browser cannot state a price.** `/api/checkout/create` has no amount
   field in its schema. The server resolves the amount from `lib/pricing.ts`.
   A tampered request buys nothing at a discount.

3. **Only a verified webhook can mark an order paid.** Returning from Square
   proves nothing. Partner activation, term extension, and qualifying-sale
   recording all hang off the same HMAC-verified gate.

4. **Webhooks are idempotent.** Unique index on
   `payment_events (provider, provider_event_id)`. Square's retries — which are
   normal — cannot double-activate a partner or double-count a sale.

5. **An expired partner is locked out even if the cron never ran.** Access is
   computed at *read* time (`getPartnerAccess`), so the nightly job is
   bookkeeping, not the security boundary.

6. **Administrator status is a database fact.** A row in `admin_users`. No admin
   code, no magic query string, no environment password.

7. **Raw IPs are never stored.** Only `sha256(salt + ip)`.

8. **No card field exists anywhere in this codebase.** Square's hosted page
   collects card data. Verified by an e2e test.

## Multi-page marketing architecture

The public site now uses a focused homepage plus dedicated routes for services, individual service detail pages, industries, pricing, process, about, partners, and contact. Detailed service content is centralized in `lib/marketing-content.ts`; navigation and the sitemap point to the new routes. Existing authentication, portal, checkout, reseller, Supabase, Square, Resend, and rate-limiting architecture remain intact.

## FormSubmit secondary notifications

Every business-facing user submission is persisted through its normal secure workflow and also sends a secondary internal alert through FormSubmit to `info@vyntexusa.com`. This covers contact forms, consultation requests, reseller applications, support requests, profile updates, agreement signatures, checkout/order creation, and client file uploads.

FormSubmit requires a one-time activation: after the first live submission, open the activation email delivered to `info@vyntexusa.com` and approve the endpoint. Supabase persistence and the existing Resend outbox remain the primary durable systems, so a missing or unactivated FormSubmit endpoint never causes the original submission to be lost.

Authentication and infrastructure events are intentionally excluded. OTP codes, login verification, Square webhook payloads, cron calls, health checks, and internal admin actions are not sent to FormSubmit because forwarding those events to a third party would create avoidable security and privacy exposure.
