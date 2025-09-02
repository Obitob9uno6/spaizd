-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB,
  stripe_payment_intent_id VARCHAR(255),
  tracking_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  printful_item_id VARCHAR(255),
  fulfillment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fulfillment_webhooks table for tracking external service webhooks
CREATE TABLE IF NOT EXISTS fulfillment_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  webhook_type VARCHAR(100) NOT NULL,
  webhook_data JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin policies for fulfillment_webhooks
CREATE POLICY "Service role can manage webhooks" ON fulfillment_webhooks
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_fulfillment_webhooks_order_id ON fulfillment_webhooks(order_id);
CREATE INDEX idx_fulfillment_webhooks_processed ON fulfillment_webhooks(processed);

-- Create function to update order totals
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders 
  SET total_amount = (
    SELECT COALESCE(SUM(price * quantity), 0)
    FROM order_items 
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update order totals
CREATE TRIGGER update_order_total_on_insert
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_update
  AFTER UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_delete
  AFTER DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();
