-- ====================================================================
-- ZEN TECH SOLUTIONS - COMPLETE CUSTOMER REVIEWS & ADMIN SECURITY FIX
-- File: supabase/customer_reviews_migration.sql
-- Architecture: Supabase (PostgreSQL 15+)
-- Run this in your Supabase Dashboard -> SQL Editor
-- ====================================================================

BEGIN;

-- --------------------------------------------------------------------
-- 1. ENSURE ADMIN USERS TABLE & RECOGNIZE ADMIN EMAIL
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY,
    email text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure columns exist even if table was created earlier with fewer columns
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Insert/Upsert admin into admin_users table
INSERT INTO public.admin_users (user_id, email)
VALUES ('3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid, 'zentechsolutionss@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

-- Also link user by email if they signed up in auth.users
INSERT INTO public.admin_users (user_id, email)
SELECT id, email FROM auth.users 
WHERE LOWER(COALESCE(email, '')) = 'zentechsolutionss@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

-- --------------------------------------------------------------------
-- 2. HARDENED is_admin() FUNCTION
-- Checks:
--   a) Bootstrap admin UID (3f50b8c1-ccfa-4da9-885d-c4e0f61430dc)
--   b) Admin email in JWT claims (zentechsolutionss@gmail.com)
--   c) Presence in public.admin_users table
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
STABLE
AS $$
BEGIN
  RETURN (
    auth.uid() = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid
    OR LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'zentechsolutionss@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() 
         OR LOWER(COALESCE(email, '')) = 'zentechsolutionss@gmail.com'
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- --------------------------------------------------------------------
-- 3. CUSTOMER REVIEWS TABLE & COLUMNS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure optional email and user_id columns exist
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON public.customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON public.customer_reviews(created_at DESC);

ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Authenticated users can submit pending reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.customer_reviews;

-- POLICY 1: Authenticated users can insert pending reviews
CREATE POLICY "Authenticated users can submit pending reviews"
ON public.customer_reviews
FOR INSERT
TO authenticated, anon
WITH CHECK (
    status = 'pending'
    AND length(trim(customer_name)) > 0
    AND length(trim(review_text)) > 0
    AND rating >= 1 AND rating <= 5
);

-- POLICY 2: Public visitors can only view approved reviews
CREATE POLICY "Public can view approved reviews"
ON public.customer_reviews
FOR SELECT
TO anon, authenticated
USING (
    status = 'approved'
);

-- POLICY 3: Authorized admin can view ALL reviews (Pending, Approved, Rejected)
CREATE POLICY "Admins can view all reviews"
ON public.customer_reviews
FOR SELECT
TO authenticated
USING (
    public.is_admin()
    OR auth.uid() = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid
    OR LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'zentechsolutionss@gmail.com'
);

-- POLICY 4: Authorized admin can update reviews (Approve or Reject)
CREATE POLICY "Admins can update reviews"
ON public.customer_reviews
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
    OR auth.uid() = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid
    OR LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'zentechsolutionss@gmail.com'
)
WITH CHECK (
    public.is_admin()
    OR auth.uid() = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid
    OR LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'zentechsolutionss@gmail.com'
);

-- POLICY 5: Authorized admin can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.customer_reviews
FOR DELETE
TO authenticated
USING (
    public.is_admin()
    OR auth.uid() = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid
    OR LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'zentechsolutionss@gmail.com'
);

-- --------------------------------------------------------------------
-- 5. SECURE RPC TO GUARANTEE ADMIN REVIEWS VISIBILITY
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_get_customer_reviews()
RETURNS SETOF public.customer_reviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
BEGIN
  -- If caller is admin, return all reviews
  IF (
    auth.uid() = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid
    OR LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'zentechsolutionss@gmail.com'
    OR public.is_admin()
  ) THEN
    RETURN QUERY 
    SELECT * FROM public.customer_reviews 
    ORDER BY created_at DESC;
  ELSE
    -- If regular visitor, return approved reviews only
    RETURN QUERY 
    SELECT * FROM public.customer_reviews 
    WHERE status = 'approved' 
    ORDER BY created_at DESC;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_customer_reviews() TO authenticated, anon;

COMMIT;
