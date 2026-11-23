-- ====================================================================
-- ZEN TECH SOLUTIONS - CUSTOMER REVIEWS & FEEDBACK SYSTEM MIGRATION
-- File: supabase/customer_reviews_migration.sql
-- Architecture: Supabase (PostgreSQL 15+)
-- Description:
--   1. Creates or verifies public.customer_reviews table with constraints.
--   2. Enables Row Level Security (RLS) on customer_reviews.
--   3. Configures secure policies for public visitors (insert pending, view approved).
--   4. Configures secure admin policies using public.is_admin() (view all, update status, delete).
-- ====================================================================

BEGIN;

-- --------------------------------------------------------------------
-- 1. BASE TABLE: public.customer_reviews
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Optimize queries for status filtering and date ordering
CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON public.customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON public.customer_reviews(created_at DESC);

-- Enable Row-Level Security
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Clean up any existing policies on customer_reviews
DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.customer_reviews;

-- POLICY 1: Public visitors (anon and authenticated) can submit reviews.
-- STRICT ENFORCEMENT:
--   - Initial status MUST be 'pending'
--   - customer_name must not be empty
--   - review_text must not be empty
--   - rating must be between 1 and 5
CREATE POLICY "Public can submit pending reviews"
ON public.customer_reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
    status = 'pending'
    AND length(trim(customer_name)) > 0
    AND length(trim(review_text)) > 0
    AND rating >= 1 AND rating <= 5
);

-- POLICY 2: Public visitors (anon and authenticated) can only read approved reviews.
CREATE POLICY "Public can view approved reviews"
ON public.customer_reviews
FOR SELECT
TO anon, authenticated
USING (
    status = 'approved'
);

-- POLICY 3: Only authorized administrators (verified via public.is_admin()) can view ALL reviews.
CREATE POLICY "Admins can view all reviews"
ON public.customer_reviews
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- POLICY 4: Only authorized administrators can update reviews (approve or reject status).
CREATE POLICY "Admins can update reviews"
ON public.customer_reviews
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);

-- POLICY 5: Only authorized administrators can delete reviews.
CREATE POLICY "Admins can delete reviews"
ON public.customer_reviews
FOR DELETE
TO authenticated
USING (
    public.is_admin()
);

COMMIT;
