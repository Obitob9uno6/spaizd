-- Core database schema for Grow Spaizd cannabis streetwear platform
-- This creates the foundational tables for users, products, drops, and VIP system

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

-- Pricing rules for automated pricing engine
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_type TEXT NOT NULL, -- 'tee', 'hoodie', 'hat', etc.
  tier TEXT NOT NULL, -- 'evergreen', 'limited', 'vip', 'collab'
  base_cost_cents INTEGER NOT NULL,
  markup_multiplier DECIMAL(4,2) NOT NULL,
  min_price_cents INTEGER,
  max_price_cents INTEGER,
  dynamic_adjustment BOOLEAN DEFAULT FALSE,
  adjustment_trigger TEXT, -- 'inventory', 'date', 'demand'
  adjustment_value DECIMAL(5,2), -- percentage or fixed amount
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue system for high-demand drops
CREATE TABLE IF NOT EXISTS public.drop_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'active', 'completed', 'expired'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(drop_id, user_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER DEFAULT 0,
  shipping_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
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

-- Inventory tracking
CREATE TABLE IF NOT EXISTS public.inventory_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  drop_product_id UUID REFERENCES public.drop_products(id),
  event_type TEXT NOT NULL, -- 'sale', 'restock', 'adjustment'
  quantity_change INTEGER NOT NULL, -- positive for restock, negative for sale
  qty_remaining INTEGER NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist/favorites
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- Email notifications preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  drop_announcements BOOLEAN DEFAULT TRUE,
  restock_alerts BOOLEAN DEFAULT TRUE,
  vip_early_access BOOLEAN DEFAULT TRUE,
  price_drop_alerts BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
