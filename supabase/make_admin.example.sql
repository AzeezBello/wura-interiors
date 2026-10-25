-- Create the first administrator.
--
-- 1. Supabase dashboard → Authentication → Users → "Add user" → "Create new
--    user". Enter the administrator's email + a strong password and tick
--    "Auto Confirm User".
-- 2. Replace the email below with that address and run this in the SQL editor.
--
-- Only users with a row in public.profiles can use the dashboard.

insert into public.profiles (id, email, full_name, role)
select id, email, 'Administrator', 'admin'
from auth.users
where email = 'admin@example.com'
on conflict (id) do update set role = 'admin', is_active = true;

-- To suspend an administrator without deleting their account:
--   update public.profiles set is_active = false where email = 'admin@example.com';
