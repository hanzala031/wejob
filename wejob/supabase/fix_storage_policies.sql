-- Fix Storage Policies for Avatars Bucket
-- The error "invalid input syntax for type uuid: 'avatars'" usually happens when a policy compares auth.uid() (uuid) with bucket_id (text) directly.
-- We need to ensure we cast auth.uid() to text.

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop potential bad policies (Generic clean up)
DROP POLICY IF EXISTS "Avatar Upload Policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_2" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_3" ON storage.objects;

-- 3. Create correct policies
-- Allow public read access to avatars
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload to their own folder (avatars/{user_id}/...)
-- We strictly cast auth.uid() to text to avoid UUID casting errors
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
