-- Fix infinite recursion in admin_users RLS policy
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Create a simpler, non-recursive policy for admin_users
CREATE POLICY "Allow select for authenticated users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Allow insert for authenticated users (for registration)
CREATE POLICY "Allow insert for authenticated users"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);