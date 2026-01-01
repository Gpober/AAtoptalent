-- ============================================================================
-- A&A Top Talent - Row Level Security (RLS) Policies for Supabase
-- ============================================================================
-- This SQL file sets up Row Level Security policies for the recruiting platform.
-- Run this AFTER running schema.sql in the Supabase SQL Editor.
--
-- IMPORTANT: Adjust these policies based on your authentication setup.
-- These policies assume you're using Supabase Auth and JWT tokens.
-- ============================================================================

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_notes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get current user's role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        current_setting('request.jwt.claims', true)::json->>'role',
        'anonymous'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's ID from JWT
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is authenticated (admin or recruiter)
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('admin', 'recruiter');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = get_user_id());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = get_user_id())
WITH CHECK (id = get_user_id());

-- Only admins can insert new users (or use service role for registration)
CREATE POLICY "Admins can create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Only admins can delete users
CREATE POLICY "Admins can delete users"
ON users FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- COMPANIES TABLE POLICIES
-- ============================================================================

-- All authenticated users can view companies
CREATE POLICY "Authenticated users can view companies"
ON companies FOR SELECT
TO authenticated
USING (is_authenticated());

-- All authenticated users can create companies
CREATE POLICY "Authenticated users can create companies"
ON companies FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- All authenticated users can update companies
CREATE POLICY "Authenticated users can update companies"
ON companies FOR UPDATE
TO authenticated
USING (is_authenticated())
WITH CHECK (is_authenticated());

-- Only admins can delete companies
CREATE POLICY "Only admins can delete companies"
ON companies FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- CANDIDATES TABLE POLICIES
-- ============================================================================

-- All authenticated users can view candidates
CREATE POLICY "Authenticated users can view candidates"
ON candidates FOR SELECT
TO authenticated
USING (is_authenticated());

-- All authenticated users can create candidates
CREATE POLICY "Authenticated users can create candidates"
ON candidates FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- All authenticated users can update candidates
CREATE POLICY "Authenticated users can update candidates"
ON candidates FOR UPDATE
TO authenticated
USING (is_authenticated())
WITH CHECK (is_authenticated());

-- Only admins can delete candidates
CREATE POLICY "Only admins can delete candidates"
ON candidates FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- CONTACTS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view contacts
CREATE POLICY "Authenticated users can view contacts"
ON contacts FOR SELECT
TO authenticated
USING (is_authenticated());

-- All authenticated users can manage contacts
CREATE POLICY "Authenticated users can create contacts"
ON contacts FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

CREATE POLICY "Authenticated users can update contacts"
ON contacts FOR UPDATE
TO authenticated
USING (is_authenticated())
WITH CHECK (is_authenticated());

CREATE POLICY "Authenticated users can delete contacts"
ON contacts FOR DELETE
TO authenticated
USING (is_authenticated());

-- ============================================================================
-- JOBS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view jobs
CREATE POLICY "Authenticated users can view jobs"
ON jobs FOR SELECT
TO authenticated
USING (is_authenticated());

-- All authenticated users can create jobs
CREATE POLICY "Authenticated users can create jobs"
ON jobs FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- All authenticated users can update jobs
CREATE POLICY "Authenticated users can update jobs"
ON jobs FOR UPDATE
TO authenticated
USING (is_authenticated())
WITH CHECK (is_authenticated());

-- Only admins can delete jobs
CREATE POLICY "Only admins can delete jobs"
ON jobs FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- APPLICATIONS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view applications
CREATE POLICY "Authenticated users can view applications"
ON applications FOR SELECT
TO authenticated
USING (is_authenticated());

-- All authenticated users can create applications
CREATE POLICY "Authenticated users can create applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- All authenticated users can update applications
CREATE POLICY "Authenticated users can update applications"
ON applications FOR UPDATE
TO authenticated
USING (is_authenticated())
WITH CHECK (is_authenticated());

-- Only admins can delete applications
CREATE POLICY "Only admins can delete applications"
ON applications FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- PLACEMENTS TABLE POLICIES
-- ============================================================================

-- All authenticated users can view placements
CREATE POLICY "Authenticated users can view placements"
ON placements FOR SELECT
TO authenticated
USING (is_authenticated());

-- All authenticated users can create placements
CREATE POLICY "Authenticated users can create placements"
ON placements FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- All authenticated users can update placements
CREATE POLICY "Authenticated users can update placements"
ON placements FOR UPDATE
TO authenticated
USING (is_authenticated())
WITH CHECK (is_authenticated());

-- Only admins can delete placements
CREATE POLICY "Only admins can delete placements"
ON placements FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- CANDIDATE NOTES TABLE POLICIES
-- ============================================================================

-- All authenticated users can view candidate notes
CREATE POLICY "Authenticated users can view candidate notes"
ON candidate_notes FOR SELECT
TO authenticated
USING (is_authenticated());

-- Authenticated users can create notes
CREATE POLICY "Authenticated users can create candidate notes"
ON candidate_notes FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- Users can only update their own notes (or admins can update any)
CREATE POLICY "Users can update own candidate notes"
ON candidate_notes FOR UPDATE
TO authenticated
USING (author_id = get_user_id() OR is_admin())
WITH CHECK (author_id = get_user_id() OR is_admin());

-- Users can only delete their own notes (or admins can delete any)
CREATE POLICY "Users can delete own candidate notes"
ON candidate_notes FOR DELETE
TO authenticated
USING (author_id = get_user_id() OR is_admin());

-- ============================================================================
-- COMPANY NOTES TABLE POLICIES
-- ============================================================================

-- All authenticated users can view company notes
CREATE POLICY "Authenticated users can view company notes"
ON company_notes FOR SELECT
TO authenticated
USING (is_authenticated());

-- Authenticated users can create notes
CREATE POLICY "Authenticated users can create company notes"
ON company_notes FOR INSERT
TO authenticated
WITH CHECK (is_authenticated());

-- Users can only update their own notes (or admins can update any)
CREATE POLICY "Users can update own company notes"
ON company_notes FOR UPDATE
TO authenticated
USING (author_id = get_user_id() OR is_admin())
WITH CHECK (author_id = get_user_id() OR is_admin());

-- Users can only delete their own notes (or admins can delete any)
CREATE POLICY "Users can delete own company notes"
ON company_notes FOR DELETE
TO authenticated
USING (author_id = get_user_id() OR is_admin());

-- ============================================================================
-- SERVICE ROLE BYPASS
-- ============================================================================
-- The service role (used for admin operations) bypasses RLS by default.
-- No additional configuration needed for the service role.

-- ============================================================================
-- ALTERNATIVE: POLICIES FOR CUSTOM AUTH (NON-SUPABASE AUTH)
-- ============================================================================
-- If you're using custom authentication (like the bcrypt-based auth in this
-- project), you may need to disable RLS or create more permissive policies
-- for your API routes to work properly.
--
-- OPTION 1: Disable RLS (NOT recommended for production)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
-- etc...
--
-- OPTION 2: Create permissive policies for API access
-- You can use the service role key for API operations which bypasses RLS.
-- ============================================================================

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE 'Row Level Security policies created successfully!';
    RAISE NOTICE 'Note: If using custom auth (not Supabase Auth), use the service role key for API operations.';
END $$;
