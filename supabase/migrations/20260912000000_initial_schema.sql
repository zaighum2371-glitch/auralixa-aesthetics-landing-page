-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'client', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('draft', 'active', 'archived', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled_by_client', 'cancelled_by_admin', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending_in_person', 'paid_in_person', 'waived', 'refunded_in_person');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE audit_action AS ENUM ('created', 'updated', 'archived', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  status user_status NOT NULL DEFAULT 'active',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_allergies TEXT,
  ban_reason TEXT,
  banned_at TIMESTAMPTZ,
  banned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Session Types (Categories)
CREATE TABLE IF NOT EXISTS public.session_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  default_duration_minutes INTEGER NOT NULL DEFAULT 60,
  buffer_minutes INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Sessions (Treatments)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_type_id UUID REFERENCES public.session_types(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  benefits TEXT[] DEFAULT '{}',
  pricing NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'GBP',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_slots INTEGER NOT NULL DEFAULT 1,
  location TEXT DEFAULT 'Auralixa Clinic',
  is_ongoing BOOLEAN NOT NULL DEFAULT true,
  active_from TIMESTAMPTZ,
  active_until TIMESTAMPTZ,
  image_url TEXT,
  status session_status NOT NULL DEFAULT 'active',
  cancel_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Availability Rules & Exceptions
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.availability_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_unavailable BOOLEAN NOT NULL DEFAULT true,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_count INTEGER NOT NULL DEFAULT 1,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending_in_person',
  payment_method_note TEXT,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  client_notes TEXT,
  admin_notes TEXT,
  cancel_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Audit & History Tables
CREATE TABLE IF NOT EXISTS public.user_login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  auth_method TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.session_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id),
  action audit_action NOT NULL,
  diff_snapshot JSONB,
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.booking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id),
  old_status TEXT,
  new_status TEXT,
  old_payment_status TEXT,
  new_payment_status TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id),
  old_role TEXT,
  new_role TEXT,
  old_status TEXT,
  new_status TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.clinical_treatment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  practitioner_id UUID REFERENCES public.profiles(id),
  clinical_notes TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT,
  aftercare_instructions_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_session_types_updated_at ON public.session_types;
CREATE TRIGGER set_session_types_updated_at
BEFORE UPDATE ON public.session_types
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_sessions_updated_at ON public.sessions;
CREATE TRIGGER set_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for auto-profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_role public.user_role := 'user';
  v_meta_role text;
BEGIN
  v_meta_role := NEW.raw_user_meta_data->>'role';
  IF v_meta_role = 'admin' THEN
    v_role := 'admin';
  ELSIF v_meta_role = 'client' THEN
    v_role := 'client';
  ELSE
    v_role := 'user';
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    v_role,
    'active'::public.user_status
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_treatment_records ENABLE ROW LEVEL SECURITY;

-- Helper function to check if auth user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- Session Types Policies
DROP POLICY IF EXISTS "Public can view active session types" ON public.session_types;
CREATE POLICY "Public can view active session types"
ON public.session_types FOR SELECT
USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage session types" ON public.session_types;
CREATE POLICY "Admins can manage session types"
ON public.session_types FOR ALL
USING (public.is_admin());

-- Sessions Policies
DROP POLICY IF EXISTS "Public can view active sessions" ON public.sessions;
CREATE POLICY "Public can view active sessions"
ON public.sessions FOR SELECT
USING (status = 'active' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage sessions" ON public.sessions;
CREATE POLICY "Admins can manage sessions"
ON public.sessions FOR ALL
USING (public.is_admin());

-- Availability Rules Policies
DROP POLICY IF EXISTS "Public can view availability rules" ON public.availability_rules;
CREATE POLICY "Public can view availability rules"
ON public.availability_rules FOR SELECT
USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage availability rules" ON public.availability_rules;
CREATE POLICY "Admins can manage availability rules"
ON public.availability_rules FOR ALL
USING (public.is_admin());

-- Availability Exceptions Policies
DROP POLICY IF EXISTS "Public can view availability exceptions" ON public.availability_exceptions;
CREATE POLICY "Public can view availability exceptions"
ON public.availability_exceptions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage availability exceptions" ON public.availability_exceptions;
CREATE POLICY "Admins can manage availability exceptions"
ON public.availability_exceptions FOR ALL
USING (public.is_admin());

-- Bookings Policies
DROP POLICY IF EXISTS "Clients can view their own bookings" ON public.bookings;
CREATE POLICY "Clients can view their own bookings"
ON public.bookings FOR SELECT
USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Clients can insert their own bookings" ON public.bookings;
CREATE POLICY "Clients can insert their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Clients can update their own bookings" ON public.bookings;
CREATE POLICY "Clients can update their own bookings"
ON public.bookings FOR UPDATE
USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings"
ON public.bookings FOR ALL
USING (public.is_admin());

-- Audit History Policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.user_login_history;
CREATE POLICY "Admins can view all audit logs" ON public.user_login_history FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view session history" ON public.session_history;
CREATE POLICY "Admins can view session history" ON public.session_history FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins and clients can view booking history" ON public.booking_history;
CREATE POLICY "Admins and clients can view booking history" ON public.booking_history FOR SELECT
USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.client_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view user status history" ON public.user_status_history;
CREATE POLICY "Admins can view user status history" ON public.user_status_history FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins and clients can view treatment records" ON public.clinical_treatment_records;
CREATE POLICY "Admins and clients can view treatment records" ON public.clinical_treatment_records FOR ALL
USING (public.is_admin() OR client_id = auth.uid());
