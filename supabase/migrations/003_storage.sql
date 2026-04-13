-- Create the "media" storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to all files in the media bucket
CREATE POLICY "media_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Admins can upload files to articles/ path
CREATE POLICY "media_admin_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = 'articles'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update (replace) their uploads
CREATE POLICY "media_admin_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete uploads
CREATE POLICY "media_admin_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
