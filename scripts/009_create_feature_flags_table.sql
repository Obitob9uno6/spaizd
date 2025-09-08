-- Create feature flags table for managing application features
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  key TEXT NOT NULL UNIQUE, -- kebab-case key for code reference
  description TEXT,
  is_enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_audience TEXT DEFAULT 'all', -- 'all', 'vip', 'admin', 'beta'
  environment TEXT DEFAULT 'production', -- 'development', 'staging', 'production'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policies - only admin/owner can manage feature flags
CREATE POLICY "Admin users can manage feature flags" ON feature_flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- Insert initial feature flags based on requirements
INSERT INTO feature_flags (name, key, description, is_enabled, target_audience) VALUES
  ('Snip to Cart', 'snip-to-cart', 'Enable quick add to cart functionality from product previews', false, 'all'),
  ('Drying Room Overlays', 'drying-room-overlays', 'Show cannabis drying room overlay effects on product images', false, 'vip'),
  ('Grow Light Tabs', 'grow-light-tabs', 'Enable grow light product category tabs and filtering', true, 'all'),
  ('VIP Early Access', 'vip-early-access', 'Allow VIP members early access to drops', true, 'vip'),
  ('Dynamic Pricing', 'dynamic-pricing', 'Enable automated pricing adjustments based on demand', false, 'admin'),
  ('Queue System', 'queue-system', 'Enable queue system for high-demand drops', true, 'all'),
  ('Cannabis Strain Info', 'strain-info', 'Show detailed strain information on products', false, 'all'),
  ('Macro Photography Mode', 'macro-photography', 'Enable high-resolution macro photography viewer', false, 'vip')
ON CONFLICT (key) DO NOTHING;
