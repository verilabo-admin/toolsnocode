/*
  # Create uploads Storage Bucket

  ## Overview
  Creates a public storage bucket for user-uploaded images (logos, avatars,
  screenshots, thumbnails). Images are organized in sub-folders by type.

  ## Bucket
  - `uploads` – public bucket, max 5 MB per file, accepts images only

  ## Storage Policies
  - Authenticated users can upload files to their own user folder
  - Authenticated users can update/delete their own files
  - Anyone (anon + authenticated) can read/download all files (public CDN)

  ## Notes
  - Files are expected to be converted to WebP before upload by the client
  - Sub-folder structure: uploads/{type}/{userId}/{filename}
    e.g. uploads/logos/abc-123/tool-name.webp
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  5242880,
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access on uploads"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text));

CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'uploads' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text))
  WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text));

CREATE POLICY "Users can delete own uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'uploads' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text));
