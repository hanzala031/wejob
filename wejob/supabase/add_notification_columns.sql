-- Add notification columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS browser_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false;

-- Check if user_settings table exists and migrate data if needed (optional, simplistic approach)
-- This part assumes you might want to move data, but for now we just ensure columns exist in profiles.
