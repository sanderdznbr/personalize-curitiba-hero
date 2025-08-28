-- Add the current user to admin_users table
INSERT INTO public.admin_users (id, email, role) 
VALUES ('484caa90-a6be-4f12-8ad8-7592b96736b9', 'sander@criativize.co', 'admin')
ON CONFLICT (id) DO NOTHING;