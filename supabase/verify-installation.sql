-- VYNTEX Supabase installation verification. Read-only.
with expected(table_name) as (
  values
    ('contact_submissions'),
    ('consultation_requests'),
    ('user_profiles'),
    ('support_requests'),
    ('reseller_applications'),
    ('partners'),
    ('reseller_agreements'),
    ('agreement_audit_events'),
    ('orders'),
    ('order_items'),
    ('payment_events'),
    ('partner_sales'),
    ('partner_renewals'),
    ('admin_users'),
    ('client_files'),
    ('email_deliveries'),
    ('cron_runs')
)
select
  e.table_name,
  (c.oid is not null) as table_exists,
  coalesce(c.relrowsecurity, false) as rls_enabled
from expected e
left join pg_class c on c.relname = e.table_name and c.relkind = 'r'
left join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
order by e.table_name;
