-- =============================================
-- Spaizd Database Schema
-- =============================================

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_profiles (admin-facing, includes role)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'owner')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
-- Admins/owners can read all user_profiles
CREATE POLICY "user_profiles_admin_select" ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
    OR auth.uid() = id
  );
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "user_profiles_admin_update" ON public.user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- VIP Tiers
CREATE TABLE IF NOT EXISTS public.vip_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  early_access_hours INTEGER NOT NULL DEFAULT 24,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  free_shipping BOOLEAN NOT NULL DEFAULT FALSE,
  exclusive_drops BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vip_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vip_tiers_select_all" ON public.vip_tiers FOR SELECT USING (TRUE);
CREATE POLICY "vip_tiers_admin_all" ON public.vip_tiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Seed VIP Tiers
INSERT INTO public.vip_tiers (name, price_cents, early_access_hours, discount_percent, free_shipping, exclusive_drops)
VALUES
  ('Gold', 4900, 24, 5, FALSE, FALSE),
  ('Platinum', 9900, 48, 10, TRUE, FALSE),
  ('Diamond', 19900, 72, 15, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- VIP Memberships
CREATE TABLE IF NOT EXISTS public.vip_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.vip_tiers(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, status)
);

ALTER TABLE public.vip_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vip_memberships_select_own" ON public.vip_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vip_memberships_insert_own" ON public.vip_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vip_memberships_admin_select" ON public.vip_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  category TEXT,
  printful_product_id TEXT,
  images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_active" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products_admin_all" ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Product Variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  price_cents INTEGER,
  printful_variant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_variants_select_all" ON public.product_variants FOR SELECT USING (TRUE);
CREATE POLICY "product_variants_admin_all" ON public.product_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Drops
CREATE TABLE IF NOT EXISTS public.drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended')),
  vip_only BOOLEAN NOT NULL DEFAULT FALSE,
  vip_early_access_hours INTEGER NOT NULL DEFAULT 0,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drops_select_public" ON public.drops FOR SELECT USING (vip_only = FALSE OR
  EXISTS (
    SELECT 1 FROM public.vip_memberships vm
    WHERE vm.user_id = auth.uid() AND vm.status = 'active'
  )
);
CREATE POLICY "drops_admin_all" ON public.drops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Drop Products
CREATE TABLE IF NOT EXISTS public.drop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id),
  quantity_available INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.drop_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drop_products_select_all" ON public.drop_products FOR SELECT USING (TRUE);
CREATE POLICY "drop_products_admin_all" ON public.drop_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_number TEXT NOT NULL UNIQUE DEFAULT CONCAT('ORD-', UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8))),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  total_cents INTEGER NOT NULL,
  total_amount NUMERIC GENERATED ALWAYS AS (total_cents / 100.0) STORED,
  stripe_payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_select" ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "order_items_admin_select" ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Feature Flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feature_flags_select_all" ON public.feature_flags FOR SELECT USING (TRUE);
CREATE POLICY "feature_flags_admin_all" ON public.feature_flags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
    )
  );

-- Seed Feature Flags
INSERT INTO public.feature_flags (name, description, is_enabled)
VALUES
  ('vip_early_access', 'Enable VIP early access to drops', TRUE),
  ('age_verification', 'Show age verification modal', TRUE),
  ('google_auth', 'Enable Google OAuth sign-in', TRUE),
  ('facebook_auth', 'Enable Facebook OAuth sign-in', TRUE)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- Auto-create profile & user_profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    CONCAT(
      COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
      ' ',
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
    ),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
