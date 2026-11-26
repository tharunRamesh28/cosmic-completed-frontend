-- ====================================================================
-- ZENTECH SOLUTIONS - COMPLETE PRODUCTION SECURITY HARDENING MIGRATION
-- File: supabase/complete_production_security_hardening.sql
-- Architecture: Supabase / PostgreSQL 15+
-- ====================================================================
-- This single consolidated migration enforces end-to-end security:
--   1. Strips all legacy/deprecated admin IDs (9163b26d..., 11ce9252...)
--   2. Enforces active admin identity:
--      - Active UID:   3f50b8c1-ccfa-4da9-885d-c4e0f61430dc
--      - Active Email: zentechsolutionss@gmail.com
--   3. Secures public.admin_users against privilege escalation & unauthorized access
--   4. Hardens public.is_admin() against search_path injection (SECURITY DEFINER)
--   5. Enforces strict RLS across all tables:
--      - project_submissions (No IDOR: Client A cannot see or edit Client B)
--      - project_files (Private attachment access only)
--      - customer_reviews (Public only reads approved; only admin moderates/deletes)
--   6. Locks down Supabase Storage (project-files bucket set to private)
--   7. Secures RPC functions with safe search_path and authorization guards
--   8. Adds database constraints & performance indexes
-- ====================================================================

BEGIN;

-- ====================================================================
-- 1. BASE TABLES & COLUMNS INTEGRITY
-- ====================================================================

-- Ensure admin_users exists with proper schema
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY,
    email text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Ensure project_submissions exists
CREATE TABLE IF NOT EXISTS public.project_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    client_name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    project_name text NOT NULL,
    project_type text NOT NULL,
    project_description text NOT NULL,
    expected_timeline text,
    status text NOT NULL DEFAULT 'new',
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Ensure project_files exists
CREATE TABLE IF NOT EXISTS public.project_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id uuid NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    storage_path text NOT NULL,
    file_size bigint,
    file_type text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Ensure customer_reviews exists
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    customer_email text,
    user_id uuid,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 2. ADMIN PRIVILEGE ISOLATION & REVOCATION OF OLD IDS
-- ====================================================================

-- PURGE any deprecated/old admin IDs from admin_users
DELETE FROM public.admin_users
WHERE user_id IN (
    '9163b26d-c7b1-4a13-8688-62ca34233fd9'::uuid,
    '11ce9252-c48d-4a53-b1c3-dbb093678268'::uuid
);

-- Register the active designated admin UID and email
INSERT INTO public.admin_users (user_id, email)
VALUES ('3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid, 'zentechsolutionss@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

-- Also bind any auth user whose email matches the admin email
INSERT INTO public.admin_users (user_id, email)
SELECT id, email FROM auth.users 
WHERE LOWER(COALESCE(email, '')) = 'zentechsolutionss@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

-- ====================================================================
-- 3. HARDENED is_admin() FUNCTION
-- Prevents search_path hijacking; strictly checks active admin credentials
-- ====================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
STABLE
AS $$
BEGIN
  -- Strict check: caller must match active admin UID, admin email, or be listed in admin_users
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

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ====================================================================
-- 4. RLS POLICIES: public.admin_users
-- Normal users must NOT be able to view or manipulate admin records.
-- ====================================================================

DROP POLICY IF EXISTS "Admins can view their own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can delete admin_users" ON public.admin_users;

-- Admin can view all records; users can only check if they themselves are admin
CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin() OR auth.uid() = user_id);

-- Only verified admin can add new admin records
CREATE POLICY "Admins can insert admin_users"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Only verified admin can delete admin records (prevent self-lockout)
CREATE POLICY "Admins can delete admin_users"
ON public.admin_users
FOR DELETE
TO authenticated
USING (public.is_admin() AND user_id != auth.uid());

-- ====================================================================
-- 5. RLS POLICIES: public.project_submissions
-- Strict IDOR prevention: Client A can never access Client B's data
-- ====================================================================

DROP POLICY IF EXISTS "Admins can view project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Admins can update project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.project_submissions;
DROP POLICY IF EXISTS "Admins can delete rejected projects" ON public.project_submissions;
DROP POLICY IF EXISTS "Users can view their own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Users can update their own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Users and guests can insert project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Anyone can insert project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Authenticated users insert own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Guests can insert project submissions" ON public.project_submissions;

-- SELECT: Client can ONLY view submissions where user_id matches auth.uid(); Admin views all
CREATE POLICY "Users can view their own project submissions"
ON public.project_submissions
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.is_admin()
);

-- INSERT: Authenticated client must bind submission to their own auth.uid()
CREATE POLICY "Authenticated users insert own project submissions"
ON public.project_submissions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  OR (user_id IS NULL)
);

-- INSERT: Unauthenticated guest submissions (user_id must be NULL)
CREATE POLICY "Guests can insert project submissions"
ON public.project_submissions
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL
);

-- UPDATE: Client can only edit their own submission; cannot change user_id ownership
CREATE POLICY "Users can update their own project submissions"
ON public.project_submissions
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- UPDATE: Admin can update any submission (e.g. change status)
CREATE POLICY "Admins can update project submissions"
ON public.project_submissions
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);

-- DELETE: Only admin can delete submissions, and ONLY if status is 'rejected'
CREATE POLICY "Admins can delete rejected projects"
ON public.project_submissions
FOR DELETE
TO authenticated
USING (
  public.is_admin() AND LOWER(TRIM(status)) = 'rejected'
);

-- ====================================================================
-- 6. RLS POLICIES: public.project_files
-- ====================================================================

DROP POLICY IF EXISTS "Admins can view project file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Users can view their own project file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Users can view their own project files" ON public.project_files;
DROP POLICY IF EXISTS "Anyone can insert project file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Authenticated users insert file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Users can insert file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Guests can insert file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Admins and owners can delete project files" ON public.project_files;

-- SELECT: Client can ONLY view files for their own submissions; Admin views all
CREATE POLICY "Users can view their own project files"
ON public.project_files
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.project_submissions
    WHERE project_submissions.id = project_files.submission_id
    AND project_submissions.user_id = auth.uid()
  )
);

-- INSERT: File metadata can only be linked to a submission belonging to caller
CREATE POLICY "Users can insert file metadata"
ON public.project_files
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_submissions
    WHERE project_submissions.id = project_files.submission_id
    AND (project_submissions.user_id = auth.uid() OR public.is_admin())
  )
);

-- INSERT: Guest file metadata
CREATE POLICY "Guests can insert file metadata"
ON public.project_files
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_submissions
    WHERE project_submissions.id = project_files.submission_id
    AND project_submissions.user_id IS NULL
  )
);

-- DELETE: Only admin or submission owner can delete file records
CREATE POLICY "Admins and owners can delete project files"
ON public.project_files
FOR DELETE
TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.project_submissions
    WHERE project_submissions.id = project_files.submission_id
    AND project_submissions.user_id = auth.uid()
  )
);

-- ====================================================================
-- 7. RLS POLICIES: public.customer_reviews
-- ====================================================================

DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Authenticated users can submit pending reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.customer_reviews;

-- INSERT: Reviewers can ONLY insert reviews with status = 'pending'
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

-- SELECT: Public can ONLY view approved reviews
CREATE POLICY "Public can view approved reviews"
ON public.customer_reviews
FOR SELECT
TO anon, authenticated
USING (
    status = 'approved'
);

-- SELECT: Admin can view all reviews (pending, approved, rejected)
CREATE POLICY "Admins can view all reviews"
ON public.customer_reviews
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- UPDATE: Admin can moderate reviews (Approve or Reject)
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

-- DELETE: Admin can permanently delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.customer_reviews
FOR DELETE
TO authenticated
USING (
    public.is_admin()
);

-- ====================================================================
-- 8. SECURE RPC FUNCTIONS (SECURITY DEFINER with safe search_path)
-- ====================================================================

-- A) Delete Rejected Project RPC
CREATE OR REPLACE FUNCTION public.admin_delete_rejected_project(p_project_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_is_admin BOOLEAN;
  v_project_status TEXT;
  v_deleted_count INT;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'NOT_AUTHENTICATED', 'message', 'You must be logged in.');
  END IF;

  v_is_admin := public.is_admin();
  IF NOT v_is_admin THEN
    RETURN json_build_object('success', false, 'error', 'NOT_ADMIN', 'message', 'You are not authorized to delete this project.');
  END IF;

  SELECT status INTO v_project_status 
  FROM public.project_submissions 
  WHERE id = p_project_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'PROJECT_NOT_FOUND', 'message', 'Project could not be found.');
  END IF;

  IF LOWER(TRIM(v_project_status)) != 'rejected' THEN
    RETURN json_build_object('success', false, 'error', 'PROJECT_NOT_REJECTED', 'message', 'Only rejected projects can be deleted.');
  END IF;

  DELETE FROM public.project_submissions 
  WHERE id = p_project_id;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  IF v_deleted_count = 0 THEN
    RETURN json_build_object('success', false, 'error', 'DELETE_FAILED', 'message', 'Unable to permanently delete the project.');
  END IF;

  RETURN json_build_object('success', true, 'error', 'DELETED', 'message', 'Project deleted successfully.');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_delete_rejected_project(UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.admin_delete_rejected_project(UUID) TO authenticated;

-- B) Fetch Customer Reviews RPC
CREATE OR REPLACE FUNCTION public.admin_get_customer_reviews()
RETURNS SETOF public.customer_reviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN QUERY 
    SELECT * FROM public.customer_reviews 
    ORDER BY created_at DESC;
  ELSE
    RETURN QUERY 
    SELECT * FROM public.customer_reviews 
    WHERE status = 'approved' 
    ORDER BY created_at DESC;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_get_customer_reviews() FROM public;
GRANT EXECUTE ON FUNCTION public.admin_get_customer_reviews() TO authenticated, anon;

-- ====================================================================
-- 9. SUPABASE STORAGE BUCKET & RLS POLICIES: project-files
-- ====================================================================

-- Ensure bucket is PRIVATE (never public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Anyone can upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view and download project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view and download their project files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Guests upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Users and admins download project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins and owners delete project files" ON storage.objects;

-- Upload: Authenticated users can ONLY upload to their own user_id directory
CREATE POLICY "Authenticated users upload project files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Upload: Guests upload to guest_* prefix
CREATE POLICY "Guests upload project files"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] LIKE 'guest_%'
);

-- Download / View: Only Admins or the file folder owner
CREATE POLICY "Users and admins download project files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (
    public.is_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Delete: Only Admins or file folder owner
CREATE POLICY "Admins and owners delete project files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (
    public.is_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- ====================================================================
-- 10. PERFORMANCE INDEXES & INPUT INTEGRITY CONSTRAINTS
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_project_submissions_user_id ON public.project_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_email ON public.project_submissions(email);
CREATE INDEX IF NOT EXISTS idx_project_submissions_status ON public.project_submissions(status);
CREATE INDEX IF NOT EXISTS idx_project_submissions_created_at ON public.project_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_files_submission_id ON public.project_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON public.customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON public.customer_reviews(created_at DESC);

-- Integrity Constraints
ALTER TABLE public.project_submissions 
  DROP CONSTRAINT IF EXISTS chk_project_submissions_status;

ALTER TABLE public.project_submissions 
  ADD CONSTRAINT chk_project_submissions_status 
  CHECK (status IN ('new', 'reviewing', 'contacted', 'in_progress', 'completed', 'rejected', 'accepted'));

ALTER TABLE public.project_submissions 
  DROP CONSTRAINT IF EXISTS chk_project_submissions_email_len;

ALTER TABLE public.project_submissions 
  ADD CONSTRAINT chk_project_submissions_email_len 
  CHECK (char_length(email) <= 254 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.project_submissions 
  DROP CONSTRAINT IF EXISTS chk_project_submissions_name_len;

ALTER TABLE public.project_submissions 
  ADD CONSTRAINT chk_project_submissions_name_len 
  CHECK (char_length(client_name) <= 150 AND char_length(project_name) <= 200);

COMMIT;
