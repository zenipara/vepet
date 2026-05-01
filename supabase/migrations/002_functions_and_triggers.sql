-- ============================================
-- HELPER FUNCTION: Get Role
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Handle new user profile
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name' OR new.email,
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Create profile on user signup
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Deduct product stock
-- ============================================
CREATE OR REPLACE FUNCTION public.deduct_product_stock(
  p_product_id UUID,
  p_quantity DECIMAL,
  p_reference_id UUID,
  p_reference_type TEXT
) RETURNS VOID AS $$
BEGIN
  -- Update stok produk
  UPDATE products
  SET
    stock_qty = stock_qty - p_quantity,
    updated_at = NOW()
  WHERE id = p_product_id;

  -- Catat mutasi stok
  INSERT INTO stock_movements (
    product_id, type, quantity,
    reference_id, reference_type, created_by
  ) VALUES (
    p_product_id, 'out', p_quantity,
    p_reference_id, p_reference_type, auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
