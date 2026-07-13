# VYNTEX Supabase production setup

## 1. Configure environment variables

Create `.env.local` locally and configure the same values in Vercel.

```env
NEXT_PUBLIC_SUPABASE_URL=https://phtpogiaupzdsueodiqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_ROTATED_SERVER_SECRET
```

The server secret must never be committed to GitHub and must never use a `NEXT_PUBLIC_` prefix.

Run locally:

```bash
npm run check:env
```

## 2. Create the database

For a new Supabase project, open **SQL Editor**, paste the complete contents of:

```text
supabase/setup-new-project.sql
```

and run it once.

For an existing project that already has the Phase 3 schema, run only the migrations not yet applied, in order:

1. `supabase/phase4-migration.sql`
2. `supabase/phase5-migration.sql`

Do not reset the database.

## 3. Configure authentication

In **Authentication > URL Configuration**:

- Site URL: `https://vyntexusa.com`
- Redirect URLs:
  - `http://localhost:3000/**`
  - `https://vyntexusa.com/**`
  - `https://www.vyntexusa.com/**`
  - your Vercel preview domain pattern

Enable Email OTP in **Authentication > Providers > Email**.

## 4. Create the first super administrator

Sign in once at `/login` using `info@vyntexusa.com`, then run:

```sql
insert into public.admin_users (auth_user_id, email, role)
select id, email, 'super_admin'
from auth.users
where lower(email) = lower('info@vyntexusa.com')
on conflict (auth_user_id)
do update set role = 'super_admin', is_active = true, updated_at = now();
```

## 5. Verify installation

Run `supabase/verify-installation.sql` in SQL Editor. Every result should report `true` for table existence and RLS.
