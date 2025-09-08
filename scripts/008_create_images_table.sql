-- Create images table for storing uploaded image metadata
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'product',
  tags TEXT[] DEFAULT '{}',
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can manage images" ON images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cannabis-images', 'cannabis-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Admin users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cannabis-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin users can view images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cannabis-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin users can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cannabis-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('admin', 'owner')
    )
  );
