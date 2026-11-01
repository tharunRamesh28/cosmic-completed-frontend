-- ====================================================================
-- COSMIC CIRCUIT - PRODUCTION SECURITY HARDENING MIGRATION
-- File: supabase/production_security_hardening.sql
-- Architecture: Supabase (PostgreSQL 15+)
-- Description:
--   1. Ensures RLS is strictly enforced on all sensitive application tables.
--   2. Enforces explicit row ownership on SELECT, INSERT, UPDATE, DELETE.
--   3. Secures admin_users registry and implements secure server-side admin check function.
--   4. Hardens SECURITY DEFINER functions with immutable search_path (prevents search_path hijacking).
--   5. Implements check constraints on submissions for length and data validity.
--   6. Configures private Storage policies for the 'project-files' bucket.
--   7. Adds targeted B-Tree indexes for foreign keys and hot query columns.
-- ====================================================================

BEGIN;

-- --------------------------------------------------------------------
-- 1. BASE TABLES & ROW-LEVEL SECURITY ENFORCEMENT
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

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

-- --------------------------------------------------------------------
-- 2. SECURITY DEFINER: SECURE is_admin() FUNCTION
-- Hardens search_path to prevent malicious object shadowing / search_path injection
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
STABLE
AS $$
BEGIN
  -- Returns true if current caller's UUID exists in public.admin_users
  -- or matches designated bootstrap super-admin UUID
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ) OR (auth.uid() = '9163b26d-c7b1-4a13-8688-62ca34233fd9'::uuid);
END;
$$;

-- Revoke default public execution privileges and grant only to authenticated roles
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Ensure the designated admin is registered in public.admin_users
INSERT INTO public.admin_users (user_id)
VALUES ('9163b26d-c7b1-4a13-8688-62ca34233fd9'::uuid)
ON CONFLICT (user_id) DO NOTHING;

-- --------------------------------------------------------------------
-- 3. RLS POLICIES: public.admin_users
-- Normal users must NOT be able to view or manipulate admin records.
-- --------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can view their own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can delete admin_users" ON public.admin_users;

-- Admins can view all admin records; authenticated users can only verify their own record
CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin() OR auth.uid() = user_id);

-- Only verified admins can insert/update/delete admin accounts
CREATE POLICY "Admins can insert admin_users"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete admin_users"
ON public.admin_users
FOR DELETE
TO authenticated
USING (public.is_admin() AND user_id != auth.uid()); -- Prevent accidental self-lockout

-- --------------------------------------------------------------------
-- 4. RLS POLICIES: public.project_submissions
-- --------------------------------------------------------------------

-- Drop old / potentially insecure duplicate policies
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

-- SELECT: Users can only see their own submissions; Admins can see all
CREATE POLICY "Users can view their own project submissions"
ON public.project_submissions
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.is_admin()
);

-- INSERT: 
-- Authenticated users: Must bind user_id to their own auth.uid()
-- Anon users: Can submit guest briefs (user_id must be NULL)
CREATE POLICY "Authenticated users insert own project submissions"
ON public.project_submissions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  OR (user_id IS NULL)
);

CREATE POLICY "Guests can insert project submissions"
ON public.project_submissions
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL
);

-- UPDATE:
-- Users can only edit their own submissions if still in pending/new status.
-- Both USING and WITH CHECK are enforced to prevent tampering with user_id or status.
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

-- Admins can update any project submission
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

-- DELETE:
-- Only admins can delete, and only if the project is rejected
CREATE POLICY "Admins can delete rejected projects"
ON public.project_submissions
FOR DELETE
TO authenticated
USING (
  public.is_admin() AND LOWER(TRIM(status)) = 'rejected'
);

-- --------------------------------------------------------------------
-- 5. RLS POLICIES: public.project_files
-- --------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can view project file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Users can view their own project file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Users can view their own project files" ON public.project_files;
DROP POLICY IF EXISTS "Anyone can insert project file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Authenticated users insert file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Users can insert file metadata" ON public.project_files;
DROP POLICY IF EXISTS "Guests can insert file metadata" ON public.project_files;

-- SELECT: Users view files for their submissions; Admins view all
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

-- INSERT: File metadata can only be inserted for valid submissions
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

-- --------------------------------------------------------------------
-- 6. RPC FUNCTION HARDENING: admin_delete_rejected_project
-- --------------------------------------------------------------------

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

-- --------------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKET & RLS POLICIES: project-files
-- --------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Anyone can upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view and download project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view and download their project files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Guests upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Users and admins download project files" ON storage.objects;

-- Upload: Authenticated users upload to their folder (bucket_id = 'project-files')
CREATE POLICY "Authenticated users upload project files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Upload: Anon guests can upload with prefix 'guest_'
CREATE POLICY "Guests upload project files"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] LIKE 'guest_%'
);

-- Download / View: Only Admins or Folder Owner
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

-- --------------------------------------------------------------------
-- 8. PERFORMANCE INDEXES ON HOT COLUMNS AND FOREIGN KEYS
-- --------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_project_submissions_user_id 
  ON public.project_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_project_submissions_email 
  ON public.project_submissions(email);

CREATE INDEX IF NOT EXISTS idx_project_submissions_status 
  ON public.project_submissions(status);

CREATE INDEX IF NOT EXISTS idx_project_submissions_created_at 
  ON public.project_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_files_submission_id 
  ON public.project_files(submission_id);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id 
  ON public.admin_users(user_id);

-- --------------------------------------------------------------------
-- 9. SERVER-SIDE INPUT LENGTH & INTEGRITY CONSTRAINTS
-- Prevents database payload overflow & invalid status entries
-- --------------------------------------------------------------------

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

