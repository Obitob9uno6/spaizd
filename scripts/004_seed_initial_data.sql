-- Seed initial data for Grow Spaizd platform

-- Insert VIP tiers
INSERT INTO public.vip_tiers (name, price_cents, early_access_hours, discount_percent, free_shipping, exclusive_drops) VALUES
('Gold', 5000, 24, 10.00, TRUE, FALSE),
('Platinum', 10000, 48, 15.00, TRUE, TRUE),
('Diamond', 20000, 72, 20.00, TRUE, TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert product categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('T-Shirts', 'tshirts', 'Premium cannabis-themed t-shirts', 1),
('Hoodies', 'hoodies', 'Cozy hoodies for the cannabis community', 2),
('Hats', 'hats', 'Stylish headwear with cannabis motifs', 3),
('Accessories', 'accessories', 'Cannabis lifestyle accessories', 4),
('Limited Drops', 'limited-drops', 'Exclusive limited edition releases', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert pricing rules
INSERT INTO public.pricing_rules (product_type, tier, base_cost_cents, markup_multiplier, min_price_cents, max_price_cents, dynamic_adjustment, adjustment_trigger, adjustment_value) VALUES
-- T-Shirts
('tee', 'evergreen', 2500, 2.00, 4500, 6000, FALSE, NULL, NULL),
('tee', 'limited', 2500, 2.50, 5500, 8000, TRUE, 'inventory', 15.00),
('tee', 'vip', 2500, 2.20, 5000, 7000, FALSE, NULL, NULL),
('tee', 'collab', 2500, 3.00, 6500, 10000, TRUE, 'inventory', 20.00),

-- Hoodies
('hoodie', 'evergreen', 3500, 2.00, 6500, 9000, FALSE, NULL, NULL),
('hoodie', 'limited', 3500, 2.50, 8000, 12000, TRUE, 'inventory', 15.00),
('hoodie', 'vip', 3500, 2.20, 7000, 10000, FALSE, NULL, NULL),
('hoodie', 'collab', 3500, 3.00, 9500, 15000, TRUE, 'inventory', 20.00),

-- Hats
('hat', 'evergreen', 1800, 2.00, 3500, 5000, FALSE, NULL, NULL),
('hat', 'limited', 1800, 2.50, 4000, 6500, TRUE, 'inventory', 15.00),
('hat', 'vip', 1800, 2.20, 3800, 5500, FALSE, NULL, NULL),
('hat', 'collab', 1800, 3.00, 5000, 8000, TRUE, 'inventory', 20.00)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, slug, description, base_price_cents, images, is_active) VALUES
('Grow Room Essentials Tee', 'grow-room-essentials-tee', 'Premium cotton tee featuring minimalist grow room graphics', 5000, '["https://placeholder.svg?height=600&width=600&query=premium black t-shirt with subtle cannabis leaf design"]', TRUE),
('LED Green Hoodie', 'led-green-hoodie', 'Cozy hoodie in signature LED green colorway', 8000, '["https://placeholder.svg?height=600&width=600&query=green hoodie with cannabis themed embroidery"]', TRUE),
('Harvest Gold Snapback', 'harvest-gold-snapback', 'Classic snapback in harvest gold with embroidered logo', 4500, '["https://placeholder.svg?height=600&width=600&query=gold snapback hat with cannabis leaf logo"]', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Get category and product IDs for variants
DO $$
DECLARE
    tshirt_cat_id UUID;
    hoodie_cat_id UUID;
    hat_cat_id UUID;
    tee_product_id UUID;
    hoodie_product_id UUID;
    hat_product_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO tshirt_cat_id FROM public.categories WHERE slug = 'tshirts';
    SELECT id INTO hoodie_cat_id FROM public.categories WHERE slug = 'hoodies';
    SELECT id INTO hat_cat_id FROM public.categories WHERE slug = 'hats';
    
    -- Get product IDs
    SELECT id INTO tee_product_id FROM public.products WHERE slug = 'grow-room-essentials-tee';
    SELECT id INTO hoodie_product_id FROM public.products WHERE slug = 'led-green-hoodie';
    SELECT id INTO hat_product_id FROM public.products WHERE slug = 'harvest-gold-snapback';
    
    -- Update products with category IDs
    UPDATE public.products SET category_id = tshirt_cat_id WHERE id = tee_product_id;
    UPDATE public.products SET category_id = hoodie_cat_id WHERE id = hoodie_product_id;
    UPDATE public.products SET category_id = hat_cat_id WHERE id = hat_product_id;
    
    -- Insert product variants
    INSERT INTO public.product_variants (product_id, name, sku, size, color) VALUES
    -- T-shirt variants
    (tee_product_id, 'Small Black', 'GRE-TEE-S-BLK', 'S', 'Black'),
    (tee_product_id, 'Medium Black', 'GRE-TEE-M-BLK', 'M', 'Black'),
    (tee_product_id, 'Large Black', 'GRE-TEE-L-BLK', 'L', 'Black'),
    (tee_product_id, 'XL Black', 'GRE-TEE-XL-BLK', 'XL', 'Black'),
    
    -- Hoodie variants
    (hoodie_product_id, 'Small Green', 'LED-HOOD-S-GRN', 'S', 'Green'),
    (hoodie_product_id, 'Medium Green', 'LED-HOOD-M-GRN', 'M', 'Green'),
    (hoodie_product_id, 'Large Green', 'LED-HOOD-L-GRN', 'L', 'Green'),
    (hoodie_product_id, 'XL Green', 'LED-HOOD-XL-GRN', 'XL', 'Green'),
    
    -- Hat variants
    (hat_product_id, 'One Size Gold', 'HG-SNAP-OS-GLD', 'One Size', 'Gold')
    ON CONFLICT (sku) DO NOTHING;
END $$;
