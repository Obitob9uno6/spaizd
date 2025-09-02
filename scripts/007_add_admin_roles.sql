-- Add role column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'customer';

-- Create admin user (replace with actual admin email)
-- This would typically be done through a secure admin setup process
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@growspaizd.com';

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Add RLS policy for admin access
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Add admin access to orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Add admin access to products
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Add admin access to drops
CREATE POLICY "Admins can manage drops" ON drops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );
