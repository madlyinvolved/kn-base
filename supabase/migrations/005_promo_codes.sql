ALTER TABLE discounts ADD COLUMN IF NOT EXISTS promo_codes JSONB DEFAULT '[]';

UPDATE discounts SET promo_codes = jsonb_build_array(jsonb_build_object('code', promo_code, 'description', '')) WHERE promo_code IS NOT NULL AND promo_code != '';

ALTER TABLE discounts DROP COLUMN IF EXISTS promo_code;
