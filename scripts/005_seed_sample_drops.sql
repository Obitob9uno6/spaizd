-- Seed sample drops for testing the drop system

-- Insert sample drops
INSERT INTO public.drops (name, slug, description, type, status, start_time, end_time, vip_early_access_hours, max_quantity, images) VALUES
(
  'Harvest Season Collection',
  'harvest-season-collection',
  'Limited edition pieces celebrating the harvest season with exclusive colorways and premium materials.',
  'limited',
  'live',
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '7 days',
  24,
  50,
  '["https://placeholder.svg?height=600&width=600&query=harvest season cannabis streetwear collection"]'
),
(
  'LED Glow Drop',
  'led-glow-drop',
  'Futuristic designs inspired by grow room LED lighting. Glow-in-the-dark elements and electric colorways.',
  'limited',
  'scheduled',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '10 days',
  48,
  25,
  '["https://placeholder.svg?height=600&width=600&query=LED glow cannabis streetwear with neon accents"]'
),
(
  'Grower x Artist Collab',
  'grower-artist-collab',
  'Exclusive collaboration between renowned cannabis growers and street artists. Ultra-limited quantities.',
  'collab',
  'scheduled',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '14 days',
  72,
  15,
  '["https://placeholder.svg?height=600&width=600&query=artist collaboration cannabis streetwear limited edition"]'
)
ON CONFLICT (slug) DO NOTHING;

-- Get the drop IDs and product IDs for creating drop_products
DO $$
DECLARE
    harvest_drop_id UUID;
    led_drop_id UUID;
    collab_drop_id UUID;
    tee_product_id UUID;
    hoodie_product_id UUID;
    hat_product_id UUID;
    tee_variant_ids UUID[];
    hoodie_variant_ids UUID[];
    hat_variant_id UUID;
BEGIN
    -- Get drop IDs
    SELECT id INTO harvest_drop_id FROM public.drops WHERE slug = 'harvest-season-collection';
    SELECT id INTO led_drop_id FROM public.drops WHERE slug = 'led-glow-drop';
    SELECT id INTO collab_drop_id FROM public.drops WHERE slug = 'grower-artist-collab';
    
    -- Get product IDs
    SELECT id INTO tee_product_id FROM public.products WHERE slug = 'grow-room-essentials-tee';
    SELECT id INTO hoodie_product_id FROM public.products WHERE slug = 'led-green-hoodie';
    SELECT id INTO hat_product_id FROM public.products WHERE slug = 'harvest-gold-snapback';
    
    -- Get variant IDs
    SELECT ARRAY_AGG(id) INTO tee_variant_ids FROM public.product_variants WHERE product_id = tee_product_id;
    SELECT ARRAY_AGG(id) INTO hoodie_variant_ids FROM public.product_variants WHERE product_id = hoodie_product_id;
    SELECT id INTO hat_variant_id FROM public.product_variants WHERE product_id = hat_product_id LIMIT 1;
    
    -- Insert drop products for Harvest Season Collection (live drop)
    IF harvest_drop_id IS NOT NULL AND tee_product_id IS NOT NULL THEN
        -- Add t-shirt variants to harvest drop
        FOR i IN 1..array_length(tee_variant_ids, 1) LOOP
            INSERT INTO public.drop_products (drop_id, product_id, variant_id, drop_price_cents, quantity_available, quantity_sold, max_per_customer)
            VALUES (harvest_drop_id, tee_product_id, tee_variant_ids[i], 6000, 12, 3, 2)
            ON CONFLICT (drop_id, product_id, variant_id) DO NOTHING;
        END LOOP;
        
        -- Add hoodie to harvest drop
        IF hoodie_product_id IS NOT NULL AND array_length(hoodie_variant_ids, 1) > 0 THEN
            INSERT INTO public.drop_products (drop_id, product_id, variant_id, drop_price_cents, quantity_available, quantity_sold, max_per_customer)
            VALUES (harvest_drop_id, hoodie_product_id, hoodie_variant_ids[1], 9500, 8, 2, 1)
            ON CONFLICT (drop_id, product_id, variant_id) DO NOTHING;
        END IF;
    END IF;
    
    -- Insert drop products for LED Glow Drop (upcoming)
    IF led_drop_id IS NOT NULL AND hoodie_product_id IS NOT NULL THEN
        FOR i IN 1..array_length(hoodie_variant_ids, 1) LOOP
            INSERT INTO public.drop_products (drop_id, product_id, variant_id, drop_price_cents, quantity_available, quantity_sold, max_per_customer)
            VALUES (led_drop_id, hoodie_product_id, hoodie_variant_ids[i], 10000, 6, 0, 1)
            ON CONFLICT (drop_id, product_id, variant_id) DO NOTHING;
        END LOOP;
    END IF;
    
    -- Insert drop products for Collab Drop (upcoming, very limited)
    IF collab_drop_id IS NOT NULL AND tee_product_id IS NOT NULL THEN
        INSERT INTO public.drop_products (drop_id, product_id, variant_id, drop_price_cents, quantity_available, quantity_sold, max_per_customer)
        VALUES (collab_drop_id, tee_product_id, tee_variant_ids[1], 12000, 5, 0, 1)
        ON CONFLICT (drop_id, product_id, variant_id) DO NOTHING;
        
        IF hat_product_id IS NOT NULL AND hat_variant_id IS NOT NULL THEN
            INSERT INTO public.drop_products (drop_id, product_id, variant_id, drop_price_cents, quantity_available, quantity_sold, max_per_customer)
            VALUES (collab_drop_id, hat_product_id, hat_variant_id, 8000, 10, 0, 1)
            ON CONFLICT (drop_id, product_id, variant_id) DO NOTHING;
        END IF;
    END IF;
END $$;
