-- Create compliance management tables for cannabis business regulatory oversight

-- Audit trail for tracking all system actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', etc.
  resource_type TEXT NOT NULL, -- 'product', 'order', 'user', 'drop', etc.
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance checks and monitoring
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  check_type TEXT NOT NULL, -- 'age_verification', 'geographic_restriction', 'product_compliance', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'passed', 'failed', 'requires_review'
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  checked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geographic restrictions and compliance rules
CREATE TABLE IF NOT EXISTS geographic_restrictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  state_code TEXT,
  restriction_type TEXT NOT NULL, -- 'blocked', 'age_restricted', 'product_restricted'
  min_age INTEGER DEFAULT 21,
  allowed_products TEXT[] DEFAULT '{}',
  blocked_products TEXT[] DEFAULT '{}',
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance documents and certifications
CREATE TABLE IF NOT EXISTS compliance_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type TEXT NOT NULL, -- 'license', 'certificate', 'policy', 'report'
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'pending_renewal'
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance alerts and notifications
CREATE TABLE IF NOT EXISTS compliance_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'document_expiry', 'failed_check', 'geographic_violation', 'age_verification_failure'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT,
  resource_id UUID,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all compliance tables
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies - only admin/owner can access compliance data
CREATE POLICY "Admin users can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin users can manage compliance" ON compliance_checks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin users can manage geographic restrictions" ON geographic_restrictions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin users can manage compliance documents" ON compliance_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin users can manage compliance alerts" ON compliance_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- Insert initial geographic restrictions (US cannabis-friendly states)
INSERT INTO geographic_restrictions (country_code, state_code, restriction_type, min_age, notes) VALUES
  ('US', 'CA', 'age_restricted', 21, 'California - Cannabis legal for adults 21+'),
  ('US', 'CO', 'age_restricted', 21, 'Colorado - Cannabis legal for adults 21+'),
  ('US', 'WA', 'age_restricted', 21, 'Washington - Cannabis legal for adults 21+'),
  ('US', 'OR', 'age_restricted', 21, 'Oregon - Cannabis legal for adults 21+'),
  ('US', 'NV', 'age_restricted', 21, 'Nevada - Cannabis legal for adults 21+'),
  ('US', 'AZ', 'age_restricted', 21, 'Arizona - Cannabis legal for adults 21+'),
  ('US', 'NY', 'age_restricted', 21, 'New York - Cannabis legal for adults 21+'),
  ('US', 'NJ', 'age_restricted', 21, 'New Jersey - Cannabis legal for adults 21+'),
  ('US', 'IL', 'age_restricted', 21, 'Illinois - Cannabis legal for adults 21+'),
  ('US', 'MI', 'age_restricted', 21, 'Michigan - Cannabis legal for adults 21+'),
  ('US', 'MA', 'age_restricted', 21, 'Massachusetts - Cannabis legal for adults 21+'),
  ('US', 'CT', 'age_restricted', 21, 'Connecticut - Cannabis legal for adults 21+'),
  ('US', 'VT', 'age_restricted', 21, 'Vermont - Cannabis legal for adults 21+'),
  ('US', 'ME', 'age_restricted', 21, 'Maine - Cannabis legal for adults 21+'),
  ('US', 'AK', 'age_restricted', 21, 'Alaska - Cannabis legal for adults 21+'),
  ('US', 'DC', 'age_restricted', 21, 'Washington DC - Cannabis legal for adults 21+')
ON CONFLICT DO NOTHING;

-- Insert sample compliance documents
INSERT INTO compliance_documents (document_type, title, description, expiry_date, status) VALUES
  ('policy', 'Age Verification Policy', 'Company policy for verifying customer age before purchase', '2025-12-31', 'active'),
  ('policy', 'Privacy Policy', 'Data protection and privacy compliance policy', '2025-06-30', 'active'),
  ('policy', 'Terms of Service', 'Legal terms and conditions for service use', '2025-12-31', 'active'),
  ('certificate', 'Business License', 'State business operating license', '2025-03-15', 'active'),
  ('certificate', 'Cannabis Retailer License', 'State cannabis retail license', '2025-08-20', 'active')
ON CONFLICT DO NOTHING;
