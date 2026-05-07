-- Discounts table for corporate partner discounts
CREATE TABLE discounts (
  id SERIAL PRIMARY KEY,
  partner_name TEXT NOT NULL,
  category TEXT NOT NULL,
  discount_value TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  conditions TEXT,
  promo_code TEXT,
  link TEXT,
  logo_url TEXT,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS: everyone reads active, admins write
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "discounts_read_active" ON discounts
  FOR SELECT USING (
    is_active = true
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "discounts_insert" ON discounts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "discounts_update" ON discounts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "discounts_delete" ON discounts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Storage policy for discount logos (reuse media bucket, discounts/ folder)
CREATE POLICY "media_admin_insert_discounts" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = 'discounts'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
