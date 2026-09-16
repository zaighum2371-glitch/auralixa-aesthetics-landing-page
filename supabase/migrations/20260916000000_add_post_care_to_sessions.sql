ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS post_care_instructions TEXT;
