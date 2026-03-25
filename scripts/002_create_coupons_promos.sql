-- Coupons and Promotional Codes Schema
-- Creates tables for managing discount codes, promotional campaigns, and their usage

-- Coupon/Promo Codes Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
  discount_value INTEGER NOT NULL, -- percentage (0-100) or cents for fixed amount
  min_order_cents INTEGER DEFAULT 0, -- minimum order value required
  max_discount_cents INTEGER, -- cap for percentage discounts
  usage_limit INTEGER, -- null = unlimited
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1, -- how many times a single user can use
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'products', 'categories', 'vip_only')),
  product_ids UUID[], -- specific products this applies to
  category_names TEXT[], -- specific categories this applies to
  vip_tier_ids UUID[], -- specific VIP tiers required
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon Usage Tracking
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_applied_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotional Campaigns Table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('sale', 'bundle', 'bogo', 'flash_sale', 'seasonal')),
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'products', 'categories')),
  product_ids UUID[],
  category_names TEXT[],
  banner_image TEXT,
  badge_text TEXT, -- e.g., "SALE", "20% OFF", "LIMITED"
  priority INTEGER DEFAULT 0, -- higher = takes precedence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Coupons
CREATE POLICY "coupons_select_active" ON public.coupons
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- RLS Policies for Coupon Usages
CREATE POLICY "coupon_usages_select_own" ON public.coupon_usages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "coupon_usages_insert_own" ON public.coupon_usages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coupon_usages_admin_select" ON public.coupon_usages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- RLS Policies for Promotions
CREATE POLICY "promotions_select_active" ON public.promotions
  FOR SELECT USING (is_active = true AND start_time <= NOW() AND (end_time IS NULL OR end_time > NOW()));

CREATE POLICY "promotions_admin_all" ON public.promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON public.coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON public.coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions(is_active, start_time, end_time);

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON public.coupons;
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_promotions_updated_at ON public.promotions;
CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON public.promotions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
