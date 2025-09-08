-- Complete database setup for Grow Spaizd cannabis streetwear platform
-- Copy and paste this into your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  role TEXT DEFAULT 'customer', -- 'customer', 'vip', 'admin', 'owner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VIP membership tiers
CREATE TABLE IF NOT EXISTS public.vip_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- 'gold', 'platinum', 'diamond'
  price_cents INTEGER NOT NULL,
  early_access_hours INTEGER DEFAULT 24,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  free_shipping BOOLEAN DEFAULT FALSE,
  exclusive_drops BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VIP memberships
CREATE TABLE IF NOT EXISTS public.vip_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.vip_tiers(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  base_price_cents INTEGER NOT NULL,
  printful_product_id INTEGER, -- Printful integration
  images JSONB DEFAULT '[]', -- Array of image URLs
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants (sizes, colors, etc.)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Small Black", "Large Green", etc.
  sku TEXT NOT NULL UNIQUE,
  printful_variant_id INTEGER, -- Printful integration
  size TEXT,
  color TEXT,
  additional_price_cents INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop types and scheduling
CREATE TABLE IF NOT EXISTS public.drops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'limited', -- 'limited', 'evergreen', 'collab'
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'live', 'ended', 'cancelled'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  vip_early_access_hours INTEGER DEFAULT 24,
  max_quantity INTEGER, -- Total items available in drop
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products in drops with specific pricing
CREATE TABLE IF NOT EXISTS public.drop_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  drop_price_cents INTEGER NOT NULL, -- Override price for this drop
  quantity_available INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  max_per_customer INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(drop_id, product_id, variant_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER DEFAULT 0,
  shipping_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  tracking_number TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  drop_product_id UUID REFERENCES public.drop_products(id),
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table for admin management
CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'product',
  tags TEXT[] DEFAULT '{}',
  size_bytes INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  environment TEXT DEFAULT 'production',
  value JSONB DEFAULT 'true',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance tables
CREATE TABLE IF NOT EXISTS public.compliance_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.compliance_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook tables
CREATE TABLE IF NOT EXISTS public.fulfillment_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_type TEXT NOT NULL,
  webhook_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user data
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Public read access for catalog
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Anyone can view active variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Anyone can view drops" ON public.drops FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view drop products" ON public.drop_products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view VIP tiers" ON public.vip_tiers FOR SELECT TO anon, authenticated USING (true);

-- User order access
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin access for management tables
CREATE POLICY "Service role can manage images" ON public.images FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage feature flags" ON public.feature_flags FOR ALL TO service_role USING (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.categories (name, slug, description) VALUES
('T-Shirts', 'tshirts', 'Premium cannabis-themed t-shirts'),
('Hoodies', 'hoodies', 'Comfortable hoodies with cannabis streetwear designs'),
('Hats', 'hats', 'Snapbacks and beanies with cannabis culture'),
('Accessories', 'accessories', 'Cannabis lifestyle accessories')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.vip_tiers (name, price_cents, early_access_hours, discount_percent, free_shipping) VALUES
('Gold', 2999, 24, 10.00, true),
('Platinum', 4999, 48, 15.00, true),
('Diamond', 9999, 72, 20.00, true)
ON CONFLICT (name) DO NOTHING;

-- Sample products
INSERT INTO public.products (name, slug, description, category_id, base_price_cents, images, is_active) VALUES
('Essential Black Tee', 'essential-black-tee', 'Premium cotton with minimalist design', 
  (SELECT id FROM public.categories WHERE slug = 'tshirts'), 
  5000, 
  '["/black-premium-t-shirt-with-subtle-cannabis-leaf-em.png"]', 
  true),
('Signature Green Hoodie', 'signature-green-hoodie', 'Signature colorway, premium comfort', 
  (SELECT id FROM public.categories WHERE slug = 'hoodies'), 
  8000, 
  '["/green-hoodie-with-cannabis-themed-embroidery-premi.png"]', 
  true),
('Classic Gold Snapback', 'classic-gold-snapback', 'Classic fit with embroidered logo', 
  (SELECT id FROM public.categories WHERE slug = 'hats'), 
  4500, 
  '["/gold-snapback-hat-with-cannabis-leaf-logo-premium-.png"]', 
  true)
ON CONFLICT (slug) DO NOTHING;

-- Add product variants
INSERT INTO public.product_variants (product_id, name, sku, size, color) VALUES
((SELECT id FROM public.products WHERE slug = 'essential-black-tee'), 'Small Black', 'EBT-S-BLK', 'S', 'Black'),
((SELECT id FROM public.products WHERE slug = 'essential-black-tee'), 'Medium Black', 'EBT-M-BLK', 'M', 'Black'),
((SELECT id FROM public.products WHERE slug = 'essential-black-tee'), 'Large Black', 'EBT-L-BLK', 'L', 'Black'),
((SELECT id FROM public.products WHERE slug = 'essential-black-tee'), 'XL Black', 'EBT-XL-BLK', 'XL', 'Black'),
((SELECT id FROM public.products WHERE slug = 'signature-green-hoodie'), 'Small Green', 'SGH-S-GRN', 'S', 'Green'),
((SELECT id FROM public.products WHERE slug = 'signature-green-hoodie'), 'Medium Green', 'SGH-M-GRN', 'M', 'Green'),
((SELECT id FROM public.products WHERE slug = 'signature-green-hoodie'), 'Large Green', 'SGH-L-GRN', 'L', 'Green'),
((SELECT id FROM public.products WHERE slug = 'signature-green-hoodie'), 'XL Green', 'SGH-XL-GRN', 'XL', 'Green'),
((SELECT id FROM public.products WHERE slug = 'classic-gold-snapback'), 'One Size Gold', 'CGS-OS-GLD', 'OS', 'Gold')
ON CONFLICT (sku) DO NOTHING;

-- Sample drop
INSERT INTO public.drops (name, slug, description, type, status, start_time, end_time, vip_early_access_hours, max_quantity, images) VALUES
('Spring 2025 Collection', 'spring-2025', 'Limited edition spring collection featuring fresh designs', 'limited', 'live', 
  NOW() - INTERVAL '1 day', 
  NOW() + INTERVAL '30 days', 
  24, 
  1000, 
  '["/cannabis-cultivation-workspace-with-design-materia.png"]')
ON CONFLICT (slug) DO NOTHING;

-- Add products to drop
INSERT INTO public.drop_products (drop_id, product_id, variant_id, drop_price_cents, quantity_available, max_per_customer) 
SELECT 
  d.id,
  p.id,
  v.id,
  p.base_price_cents - 500, -- 5 dollar discount for drop
  100,
  2
FROM public.drops d
CROSS JOIN public.products p
CROSS JOIN public.product_variants v
WHERE d.slug = 'spring-2025' 
  AND v.product_id = p.id
ON CONFLICT (drop_id, product_id, variant_id) DO NOTHING;

-- Add some feature flags
INSERT INTO public.feature_flags (key, name, description, enabled, environment) VALUES
('enable_vip_early_access', 'VIP Early Access', 'Allow VIP members early access to drops', true, 'production'),
('enable_dynamic_pricing', 'Dynamic Pricing', 'Enable dynamic pricing based on inventory', false, 'production'),
('enable_queue_system', 'Queue System', 'Enable queue system for high-demand drops', true, 'production'),
('enable_age_verification', 'Age Verification', 'Require age verification for purchases', true, 'production')
ON CONFLICT (key) DO NOTHING;