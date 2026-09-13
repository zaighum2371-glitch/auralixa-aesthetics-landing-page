-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS policies for avatars bucket
-- 1. SELECT: Users can view their own avatar, admins can view all avatars
CREATE POLICY "Users can view their own avatar, admins can view all"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'avatars' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR auth.uid() = owner
    OR public.is_admin()
  )
);

-- 2. INSERT: Users can upload their own avatar, admins can upload any
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'avatars' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);

-- 3. UPDATE: Users can update their own avatar, admins can update any
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'avatars' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);

-- 4. DELETE: Users can delete their own avatar, admins can delete any
CREATE POLICY "Users can delete their own avatar, admins can delete any"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'avatars' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);
