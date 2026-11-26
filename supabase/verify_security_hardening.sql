-- ====================================================================
-- ZENTECH SOLUTIONS - PRODUCTION SECURITY VERIFICATION SCRIPT
-- File: supabase/verify_security_hardening.sql
-- Run this in Supabase SQL Editor after running the hardening migration
-- ====================================================================

-- 1. VERIFY ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- Expected: rowsecurity = true for all 4 tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'project_submissions', 'project_files', 'customer_reviews');

-- 2. VERIFY ADMIN USER REGISTRY & REVOCATION OF OLD IDS
-- Expected: Only active admin (3f50b8c1... / zentechsolutionss@gmail.com) present. Old IDs (9163b26d..., 11ce9252...) MUST NOT exist.
SELECT 
    user_id, 
    email, 
    created_at,
    CASE 
        WHEN user_id = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc'::uuid THEN 'ACTIVE DESIGNATED ADMIN'
        WHEN LOWER(COALESCE(email, '')) = 'zentechsolutionss@gmail.com' THEN 'ACTIVE DESIGNATED ADMIN (EMAIL)'
        WHEN user_id IN ('9163b26d-c7b1-4a13-8688-62ca34233fd9'::uuid, '11ce9252-c48d-4a53-b1c3-dbb093678268'::uuid) THEN 'LEAKED OBSOLETE ADMIN (CRITICAL)'
        ELSE 'OTHER USER'
    END as status_assessment
FROM public.admin_users;

-- 3. VERIFY is_admin() FUNCTION SECURITY
-- Expected: prosecdef = true (SECURITY DEFINER), proconfig contains search_path
SELECT 
    proname, 
    prosecdef as is_security_definer,
    proconfig as execution_config
FROM pg_proc 
WHERE proname IN ('is_admin', 'admin_delete_rejected_project', 'admin_get_customer_reviews');

-- 4. VERIFY SUPABASE STORAGE PRIVACY
-- Expected: public = false
SELECT 
    id as bucket_id, 
    name, 
    public as is_public,
    created_at
FROM storage.buckets 
WHERE id = 'project-files';

-- 5. VERIFY ALL ACTIVE RLS POLICIES ACROSS TABLES
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd as operation
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'project_submissions', 'project_files', 'customer_reviews')
ORDER BY tablename, cmd;
