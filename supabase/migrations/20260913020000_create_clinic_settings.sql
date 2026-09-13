-- Migration: Create clinic_settings table for Admin Clinic Settings & Global Parameters
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_name TEXT NOT NULL DEFAULT 'Auralixa Aesthetics',
  clinic_tagline TEXT DEFAULT 'Luxury Aesthetic Medicine & Clinical Skincare',
  clinic_email TEXT NOT NULL DEFAULT 'concierge@auralixa.com',
  clinic_phone TEXT NOT NULL DEFAULT '+44 20 7946 0912',
  clinic_address TEXT NOT NULL DEFAULT '48 Mayfair Court, Berkeley Street, London W1J 8EH',
  cancellation_notice_hours INTEGER NOT NULL DEFAULT 24,
  booking_buffer_minutes INTEGER NOT NULL DEFAULT 15,
  advance_booking_days INTEGER NOT NULL DEFAULT 60,
  slot_interval_minutes INTEGER NOT NULL DEFAULT 15,
  currency TEXT NOT NULL DEFAULT 'GBP',
  currency_symbol TEXT NOT NULL DEFAULT '£',
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  email_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_notifications_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger for auto-updated_at
DROP TRIGGER IF EXISTS set_clinic_settings_updated_at ON public.clinic_settings;
CREATE TRIGGER set_clinic_settings_updated_at
BEFORE UPDATE ON public.clinic_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for general clinic policies & parameters
DROP POLICY IF EXISTS "Public can view clinic settings" ON public.clinic_settings;
CREATE POLICY "Public can view clinic settings"
ON public.clinic_settings FOR SELECT
USING (true);

-- Admin full management access
DROP POLICY IF EXISTS "Admins can manage clinic settings" ON public.clinic_settings;
CREATE POLICY "Admins can manage clinic settings"
ON public.clinic_settings FOR ALL
USING (public.is_admin());

-- Default singleton record
INSERT INTO public.clinic_settings (
  clinic_name,
  clinic_tagline,
  clinic_email,
  clinic_phone,
  clinic_address,
  cancellation_notice_hours,
  booking_buffer_minutes,
  advance_booking_days,
  slot_interval_minutes,
  currency,
  currency_symbol,
  timezone,
  email_notifications_enabled,
  sms_notifications_enabled
)
SELECT
  'Auralixa Aesthetics',
  'Luxury Aesthetic Medicine & Clinical Skincare',
  'concierge@auralixa.com',
  '+44 20 7946 0912',
  '48 Mayfair Court, Berkeley Street, London W1J 8EH',
  24,
  15,
  60,
  15,
  'GBP',
  '£',
  'Europe/London',
  true,
  false
WHERE NOT EXISTS (SELECT 1 FROM public.clinic_settings);
