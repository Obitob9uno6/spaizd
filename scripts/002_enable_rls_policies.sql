-- Enable Row Level Security on all tables
-- This ensures users can only access their own data

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- VIP memberships RLS
ALTER TABLE public.vip_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own VIP membership" ON public.vip_memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VIP membership" ON public.vip_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items RLS (through orders relationship)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Wishlists RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Drop queue RLS
ALTER TABLE public.drop_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own queue position" ON public.drop_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join queue" ON public.drop_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notification preferences RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for product-related tables (no auth required)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (is_active = true);

ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view drops" ON public.drops FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.drop_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view drop products" ON public.drop_products FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.vip_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view VIP tiers" ON public.vip_tiers FOR SELECT TO anon, authenticated USING (true);

-- Admin-only access for pricing rules and inventory
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only service role can manage pricing rules" ON public.pricing_rules FOR ALL TO service_role USING (true);

ALTER TABLE public.inventory_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only service role can manage inventory" ON public.inventory_events FOR ALL TO service_role USING (true);
