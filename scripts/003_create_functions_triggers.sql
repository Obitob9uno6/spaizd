-- Database functions and triggers for automation

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER vip_memberships_updated_at BEFORE UPDATE ON public.vip_memberships
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER drops_updated_at BEFORE UPDATE ON public.drops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER pricing_rules_updated_at BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate dynamic pricing
CREATE OR REPLACE FUNCTION public.calculate_dynamic_price(
  product_type_param TEXT,
  tier_param TEXT,
  current_inventory INTEGER DEFAULT NULL,
  total_inventory INTEGER DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  rule RECORD;
  base_price INTEGER;
  inventory_ratio DECIMAL;
  price_adjustment DECIMAL := 0;
BEGIN
  -- Get pricing rule
  SELECT * INTO rule
  FROM public.pricing_rules
  WHERE product_type = product_type_param AND tier = tier_param
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pricing rule found for product_type: % and tier: %', product_type_param, tier_param;
  END IF;

  -- Calculate base price
  base_price := ROUND(rule.base_cost_cents * rule.markup_multiplier);

  -- Apply dynamic adjustments if enabled
  IF rule.dynamic_adjustment AND current_inventory IS NOT NULL AND total_inventory IS NOT NULL THEN
    inventory_ratio := current_inventory::DECIMAL / total_inventory::DECIMAL;
    
    -- Increase price as inventory gets low
    IF rule.adjustment_trigger = 'inventory' AND inventory_ratio < 0.2 THEN
      price_adjustment := rule.adjustment_value / 100.0; -- Convert percentage to decimal
      base_price := ROUND(base_price * (1 + price_adjustment));
    END IF;
  END IF;

  -- Ensure price stays within bounds
  IF rule.min_price_cents IS NOT NULL AND base_price < rule.min_price_cents THEN
    base_price := rule.min_price_cents;
  END IF;

  IF rule.max_price_cents IS NOT NULL AND base_price > rule.max_price_cents THEN
    base_price := rule.max_price_cents;
  END IF;

  RETURN base_price;
END;
$$;

-- Function to update inventory after order
CREATE OR REPLACE FUNCTION public.handle_inventory_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update drop_products quantity_sold
  IF NEW.drop_product_id IS NOT NULL THEN
    UPDATE public.drop_products
    SET quantity_sold = quantity_sold + NEW.quantity
    WHERE id = NEW.drop_product_id;
  END IF;

  -- Log inventory event
  INSERT INTO public.inventory_events (
    product_id,
    variant_id,
    drop_product_id,
    event_type,
    quantity_change,
    qty_remaining,
    order_id
  )
  VALUES (
    NEW.product_id,
    NEW.variant_id,
    NEW.drop_product_id,
    'sale',
    -NEW.quantity,
    COALESCE((
      SELECT quantity_available - quantity_sold
      FROM public.drop_products
      WHERE id = NEW.drop_product_id
    ), 0),
    NEW.order_id
  );

  RETURN NEW;
END;
$$;

-- Trigger for inventory updates
CREATE TRIGGER order_items_inventory_update
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_inventory_update();
