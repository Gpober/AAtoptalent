-- ============================================================================
-- A&A Top Talent - Supabase Database Schema
-- ============================================================================
-- This SQL file creates the complete database schema for the recruiting platform.
-- Run this in the Supabase SQL Editor to set up your database.
-- ============================================================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DROP EXISTING TABLES (if re-running)
-- ============================================================================
-- Uncomment these lines if you need to reset the database
-- DROP TABLE IF EXISTS company_notes CASCADE;
-- DROP TABLE IF EXISTS candidate_notes CASCADE;
-- DROP TABLE IF EXISTS placements CASCADE;
-- DROP TABLE IF EXISTS applications CASCADE;
-- DROP TABLE IF EXISTS jobs CASCADE;
-- DROP TABLE IF EXISTS contacts CASCADE;
-- DROP TABLE IF EXISTS candidates CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores recruiter and admin accounts for the platform
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'recruiter', -- 'admin', 'recruiter'
    company_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);

COMMENT ON TABLE users IS 'Platform users (recruiters and admins)';
COMMENT ON COLUMN users.role IS 'User role: admin or recruiter';

-- ============================================================================
-- COMPANIES TABLE (CLIENTS)
-- ============================================================================
-- Stores employer/client company information
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(500),
    size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
    location VARCHAR(255),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'prospect'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies(location);

COMMENT ON TABLE companies IS 'Client companies that hire through the platform';
COMMENT ON COLUMN companies.size IS 'Company size range: 1-10, 11-50, 51-200, 201-500, 500+';
COMMENT ON COLUMN companies.status IS 'Company status: active, inactive, or prospect';

-- ============================================================================
-- CANDIDATES TABLE
-- ============================================================================
-- Stores job seeker/candidate information
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    location VARCHAR(255),
    current_title VARCHAR(200),
    current_company VARCHAR(200),
    years_experience INTEGER,
    skills TEXT, -- Comma-separated skills
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'placed', 'inactive', 'do_not_contact'
    source VARCHAR(100), -- 'referral', 'linkedin', 'job_board', 'website', etc.
    desired_salary VARCHAR(100),
    desired_role VARCHAR(200),
    availability VARCHAR(50), -- 'immediate', '2_weeks', '1_month', etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_location ON candidates(location);
CREATE INDEX IF NOT EXISTS idx_candidates_current_title ON candidates(current_title);
CREATE INDEX IF NOT EXISTS idx_candidates_source ON candidates(source);
CREATE INDEX IF NOT EXISTS idx_candidates_availability ON candidates(availability);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates(first_name, last_name);

-- Full-text search on skills
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON candidates USING GIN (to_tsvector('english', COALESCE(skills, '')));

COMMENT ON TABLE candidates IS 'Job seekers/candidates in the talent pool';
COMMENT ON COLUMN candidates.skills IS 'Comma-separated list of skills';
COMMENT ON COLUMN candidates.status IS 'Candidate status: active, placed, inactive, do_not_contact';
COMMENT ON COLUMN candidates.source IS 'How the candidate was sourced: referral, linkedin, job_board, website';
COMMENT ON COLUMN candidates.availability IS 'When candidate can start: immediate, 2_weeks, 1_month';

-- ============================================================================
-- CONTACTS TABLE
-- ============================================================================
-- Stores contact persons at client companies
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(200),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_is_primary ON contacts(is_primary);

COMMENT ON TABLE contacts IS 'Contact persons at client companies';
COMMENT ON COLUMN contacts.is_primary IS 'Whether this is the primary contact for the company';

-- ============================================================================
-- JOBS TABLE
-- ============================================================================
-- Stores job openings from client companies
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    location VARCHAR(255),
    type VARCHAR(50) NOT NULL DEFAULT 'full_time', -- 'full_time', 'part_time', 'contract', 'temp_to_hire'
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'filled', 'on_hold', 'closed'
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_salary ON jobs(salary_min, salary_max);

COMMENT ON TABLE jobs IS 'Job openings from client companies';
COMMENT ON COLUMN jobs.type IS 'Employment type: full_time, part_time, contract, temp_to_hire';
COMMENT ON COLUMN jobs.status IS 'Job status: open, filled, on_hold, closed';

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================
-- Tracks candidate applications to jobs
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'
    notes TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure one application per candidate per job
    UNIQUE(candidate_id, job_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at);

COMMENT ON TABLE applications IS 'Candidate applications to job openings';
COMMENT ON COLUMN applications.status IS 'Application status: submitted, screening, interview, offer, rejected, withdrawn';

-- ============================================================================
-- PLACEMENTS TABLE
-- ============================================================================
-- Records successful candidate placements
CREATE TABLE IF NOT EXISTS placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    job_id UUID REFERENCES jobs(id),
    start_date DATE,
    salary INTEGER,
    fee INTEGER, -- Placement fee earned
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'terminated'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_placements_candidate_id ON placements(candidate_id);
CREATE INDEX IF NOT EXISTS idx_placements_company_id ON placements(company_id);
CREATE INDEX IF NOT EXISTS idx_placements_job_id ON placements(job_id);
CREATE INDEX IF NOT EXISTS idx_placements_status ON placements(status);
CREATE INDEX IF NOT EXISTS idx_placements_start_date ON placements(start_date);

COMMENT ON TABLE placements IS 'Successful candidate placements at client companies';
COMMENT ON COLUMN placements.fee IS 'Placement fee earned from this placement';
COMMENT ON COLUMN placements.status IS 'Placement status: active, completed, terminated';

-- ============================================================================
-- CANDIDATE NOTES TABLE
-- ============================================================================
-- Notes/comments on candidates by recruiters
CREATE TABLE IF NOT EXISTS candidate_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_candidate_notes_candidate_id ON candidate_notes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_notes_author_id ON candidate_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_candidate_notes_created_at ON candidate_notes(created_at);

COMMENT ON TABLE candidate_notes IS 'Notes/comments on candidates by recruiters';

-- ============================================================================
-- COMPANY NOTES TABLE
-- ============================================================================
-- Notes/comments on companies by recruiters
CREATE TABLE IF NOT EXISTS company_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_company_notes_company_id ON company_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_company_notes_author_id ON company_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_company_notes_created_at ON company_notes(created_at);

COMMENT ON TABLE company_notes IS 'Notes/comments on companies by recruiters';

-- ============================================================================
-- ADD FOREIGN KEY FOR USERS -> COMPANIES
-- ============================================================================
-- Add the foreign key constraint after companies table is created
ALTER TABLE users
    ADD CONSTRAINT fk_users_company
    FOREIGN KEY (company_id)
    REFERENCES companies(id);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- APPLY UPDATED_AT TRIGGERS TO ALL TABLES
-- ============================================================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_placements_updated_at ON placements;
CREATE TRIGGER update_placements_updated_at
    BEFORE UPDATE ON placements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidate_notes_updated_at ON candidate_notes;
CREATE TRIGGER update_candidate_notes_updated_at
    BEFORE UPDATE ON candidate_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_notes_updated_at ON company_notes;
CREATE TRIGGER update_company_notes_updated_at
    BEFORE UPDATE ON company_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- USEFUL VIEWS
-- ============================================================================

-- View for candidate summary with application counts
CREATE OR REPLACE VIEW candidate_summary AS
SELECT
    c.*,
    CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    COUNT(DISTINCT a.id) AS total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'interview' THEN a.id END) AS interviews,
    COUNT(DISTINCT CASE WHEN a.status = 'offer' THEN a.id END) AS offers,
    COUNT(DISTINCT p.id) AS total_placements
FROM candidates c
LEFT JOIN applications a ON c.id = a.candidate_id
LEFT JOIN placements p ON c.id = p.candidate_id
GROUP BY c.id;

-- View for company summary with job counts
CREATE OR REPLACE VIEW company_summary AS
SELECT
    co.*,
    COUNT(DISTINCT j.id) AS total_jobs,
    COUNT(DISTINCT CASE WHEN j.status = 'open' THEN j.id END) AS open_jobs,
    COUNT(DISTINCT CASE WHEN j.status = 'filled' THEN j.id END) AS filled_jobs,
    COUNT(DISTINCT p.id) AS total_placements,
    COALESCE(SUM(p.fee), 0) AS total_fees
FROM companies co
LEFT JOIN jobs j ON co.id = j.company_id
LEFT JOIN placements p ON co.id = p.company_id
GROUP BY co.id;

-- View for job details with company info and application counts
CREATE OR REPLACE VIEW job_details AS
SELECT
    j.*,
    co.name AS company_name,
    co.industry AS company_industry,
    COUNT(DISTINCT a.id) AS total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'screening' THEN a.id END) AS in_screening,
    COUNT(DISTINCT CASE WHEN a.status = 'interview' THEN a.id END) AS in_interview,
    COUNT(DISTINCT CASE WHEN a.status = 'offer' THEN a.id END) AS offers_made
FROM jobs j
LEFT JOIN companies co ON j.company_id = co.id
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id, co.name, co.industry;

-- View for recent activity/pipeline
CREATE OR REPLACE VIEW recruitment_pipeline AS
SELECT
    a.id AS application_id,
    a.status AS application_status,
    a.applied_at,
    a.updated_at,
    c.id AS candidate_id,
    CONCAT(c.first_name, ' ', c.last_name) AS candidate_name,
    c.email AS candidate_email,
    c.current_title AS candidate_title,
    j.id AS job_id,
    j.title AS job_title,
    co.id AS company_id,
    co.name AS company_name
FROM applications a
JOIN candidates c ON a.candidate_id = c.id
JOIN jobs j ON a.job_id = j.id
JOIN companies co ON j.company_id = co.id
ORDER BY a.updated_at DESC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE 'A&A Top Talent database schema created successfully!';
    RAISE NOTICE 'Tables created: users, companies, candidates, contacts, jobs, applications, placements, candidate_notes, company_notes';
    RAISE NOTICE 'Views created: candidate_summary, company_summary, job_details, recruitment_pipeline';
END $$;
