-- Insert a demo admin user (you'll need to create this user in Supabase Auth)
-- Note: Replace with your actual admin email
INSERT INTO public.admin_users (email, role) 
VALUES ('admin@personalize.com', 'admin')
ON CONFLICT (email) DO NOTHING;