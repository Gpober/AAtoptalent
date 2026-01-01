-- ============================================================================
-- A&A Top Talent - Seed Data for Supabase
-- ============================================================================
-- This SQL file seeds the database with sample data for testing and development.
-- Run this AFTER running schema.sql in the Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- SAMPLE COMPANIES (CLIENTS)
-- ============================================================================
INSERT INTO companies (id, name, industry, website, size, location, description, status) VALUES
    ('11111111-1111-1111-1111-111111111111', 'TechCorp Solutions', 'Technology', 'https://techcorp.example.com', '51-200', 'San Francisco, CA', 'Leading software development company specializing in cloud solutions and enterprise applications.', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Global Financial Services', 'Financial Services', 'https://globalfinance.example.com', '201-500', 'New York, NY', 'Full-service financial institution offering investment banking, asset management, and advisory services.', 'active'),
    ('33333333-3333-3333-3333-333333333333', 'HealthFirst Medical', 'Healthcare', 'https://healthfirst.example.com', '500+', 'Boston, MA', 'Comprehensive healthcare provider with hospitals, clinics, and specialized medical centers.', 'active'),
    ('44444444-4444-4444-4444-444444444444', 'Green Energy Corp', 'Energy', 'https://greenenergy.example.com', '11-50', 'Austin, TX', 'Renewable energy startup focused on solar and wind power solutions.', 'prospect'),
    ('55555555-5555-5555-5555-555555555555', 'Retail Giant Inc', 'Retail', 'https://retailgiant.example.com', '500+', 'Seattle, WA', 'Major retail chain with both physical stores and e-commerce presence.', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE USERS (RECRUITERS & ADMINS)
-- ============================================================================
-- Note: Password is 'password123' hashed with bcrypt
-- In production, always use properly hashed passwords
INSERT INTO users (id, email, password, first_name, last_name, role, company_id) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@aatoptalent.com', '$2a$10$xQxJz6VfC6qmZfS9YqJZxOT7.y7YqxNvM9gMqO5gXKxCmOXz0EXEe', 'Admin', 'User', 'admin', NULL),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'john.recruiter@aatoptalent.com', '$2a$10$xQxJz6VfC6qmZfS9YqJZxOT7.y7YqxNvM9gMqO5gXKxCmOXz0EXEe', 'John', 'Recruiter', 'recruiter', NULL),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'sarah.smith@aatoptalent.com', '$2a$10$xQxJz6VfC6qmZfS9YqJZxOT7.y7YqxNvM9gMqO5gXKxCmOXz0EXEe', 'Sarah', 'Smith', 'recruiter', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE CONTACTS (COMPANY CONTACTS)
-- ============================================================================
INSERT INTO contacts (id, first_name, last_name, email, phone, title, is_primary, company_id) VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Michael', 'Johnson', 'mjohnson@techcorp.example.com', '415-555-0101', 'VP of Engineering', TRUE, '11111111-1111-1111-1111-111111111111'),
    ('c2222222-2222-2222-2222-222222222222', 'Lisa', 'Chen', 'lchen@techcorp.example.com', '415-555-0102', 'HR Director', FALSE, '11111111-1111-1111-1111-111111111111'),
    ('c3333333-3333-3333-3333-333333333333', 'Robert', 'Williams', 'rwilliams@globalfinance.example.com', '212-555-0201', 'Managing Director', TRUE, '22222222-2222-2222-2222-222222222222'),
    ('c4444444-4444-4444-4444-444444444444', 'Amanda', 'Davis', 'adavis@healthfirst.example.com', '617-555-0301', 'Chief Medical Officer', TRUE, '33333333-3333-3333-3333-333333333333'),
    ('c5555555-5555-5555-5555-555555555555', 'James', 'Taylor', 'jtaylor@greenenergy.example.com', '512-555-0401', 'CEO', TRUE, '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE CANDIDATES
-- ============================================================================
INSERT INTO candidates (id, first_name, last_name, email, phone, location, current_title, current_company, years_experience, skills, resume_url, linkedin_url, status, source, desired_salary, desired_role, availability) VALUES
    ('d1111111-1111-1111-1111-111111111111', 'Alex', 'Thompson', 'alex.thompson@email.com', '415-555-1001', 'San Francisco, CA', 'Senior Software Engineer', 'StartupXYZ', 8, 'JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Kubernetes', NULL, 'https://linkedin.com/in/alexthompson', 'active', 'linkedin', '$180,000 - $220,000', 'Staff Engineer', 'immediate'),

    ('d2222222-2222-2222-2222-222222222222', 'Emily', 'Rodriguez', 'emily.rodriguez@email.com', '212-555-1002', 'New York, NY', 'Financial Analyst', 'Big Bank Corp', 5, 'Financial Modeling, Excel, Python, SQL, Tableau, Bloomberg Terminal', NULL, 'https://linkedin.com/in/emilyrodriguez', 'active', 'referral', '$120,000 - $150,000', 'Senior Financial Analyst', '2_weeks'),

    ('d3333333-3333-3333-3333-333333333333', 'David', 'Kim', 'david.kim@email.com', '617-555-1003', 'Boston, MA', 'Healthcare IT Specialist', 'MedTech Solutions', 6, 'Epic Systems, Healthcare IT, HIPAA Compliance, SQL Server, Python, HL7, FHIR', NULL, 'https://linkedin.com/in/davidkim', 'active', 'job_board', '$100,000 - $130,000', 'Healthcare IT Manager', '1_month'),

    ('d4444444-4444-4444-4444-444444444444', 'Jessica', 'Martinez', 'jessica.martinez@email.com', '512-555-1004', 'Austin, TX', 'Product Manager', 'Tech Innovations Inc', 7, 'Product Management, Agile, Scrum, JIRA, User Research, Data Analysis, SQL', NULL, 'https://linkedin.com/in/jessicamartinez', 'active', 'website', '$150,000 - $180,000', 'Senior Product Manager', 'immediate'),

    ('d5555555-5555-5555-5555-555555555555', 'Ryan', 'O''Connor', 'ryan.oconnor@email.com', '206-555-1005', 'Seattle, WA', 'DevOps Engineer', 'Cloud Services LLC', 4, 'AWS, Azure, Terraform, Ansible, Docker, Kubernetes, CI/CD, Jenkins, GitLab', NULL, 'https://linkedin.com/in/ryanoconnor', 'active', 'linkedin', '$140,000 - $170,000', 'Senior DevOps Engineer', '2_weeks'),

    ('d6666666-6666-6666-6666-666666666666', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '415-555-1006', 'San Francisco, CA', 'UX Designer', 'Design Agency Co', 5, 'Figma, Sketch, Adobe XD, User Research, Prototyping, HTML, CSS, Design Systems', NULL, 'https://linkedin.com/in/sarahjohnson', 'active', 'referral', '$130,000 - $160,000', 'Senior UX Designer', 'immediate'),

    ('d7777777-7777-7777-7777-777777777777', 'Marcus', 'Brown', 'marcus.brown@email.com', '312-555-1007', 'Chicago, IL', 'Data Scientist', 'Analytics Corp', 6, 'Python, R, Machine Learning, TensorFlow, PyTorch, SQL, Spark, Data Visualization', NULL, 'https://linkedin.com/in/marcusbrown', 'placed', 'linkedin', '$160,000 - $190,000', 'Lead Data Scientist', 'immediate'),

    ('d8888888-8888-8888-8888-888888888888', 'Amanda', 'Wilson', 'amanda.wilson@email.com', '303-555-1008', 'Denver, CO', 'Marketing Manager', 'Brand Solutions Inc', 8, 'Digital Marketing, SEO, SEM, Google Analytics, HubSpot, Content Strategy, Social Media', NULL, 'https://linkedin.com/in/amandawilson', 'inactive', 'job_board', '$100,000 - $125,000', 'Director of Marketing', '1_month')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE JOBS
-- ============================================================================
INSERT INTO jobs (id, title, description, requirements, salary_min, salary_max, location, type, status, company_id) VALUES
    ('j1111111-1111-1111-1111-111111111111', 'Senior Software Engineer',
     'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and building scalable web applications using modern technologies.',
     '- 5+ years of software development experience\n- Strong proficiency in JavaScript/TypeScript\n- Experience with React and Node.js\n- Knowledge of cloud services (AWS preferred)\n- Excellent problem-solving skills',
     150000, 200000, 'San Francisco, CA', 'full_time', 'open', '11111111-1111-1111-1111-111111111111'),

    ('j2222222-2222-2222-2222-222222222222', 'Financial Analyst',
     'Join our finance team as a Financial Analyst. You will support investment decisions through detailed financial modeling and market analysis.',
     '- 3+ years of financial analysis experience\n- Strong Excel and financial modeling skills\n- Experience with Bloomberg Terminal\n- CFA or progress towards CFA preferred\n- Excellent analytical and communication skills',
     90000, 130000, 'New York, NY', 'full_time', 'open', '22222222-2222-2222-2222-222222222222'),

    ('j3333333-3333-3333-3333-333333333333', 'Healthcare IT Specialist',
     'We need a Healthcare IT Specialist to manage and optimize our clinical information systems and ensure HIPAA compliance.',
     '- 4+ years of healthcare IT experience\n- Experience with Epic or similar EHR systems\n- Knowledge of HIPAA regulations\n- Strong troubleshooting skills\n- Healthcare certifications preferred',
     80000, 110000, 'Boston, MA', 'full_time', 'open', '33333333-3333-3333-3333-333333333333'),

    ('j4444444-4444-4444-4444-444444444444', 'Product Manager',
     'Lead product development for our core platform. Work closely with engineering and design teams to deliver exceptional user experiences.',
     '- 5+ years of product management experience\n- Experience with agile methodologies\n- Strong analytical and data-driven mindset\n- Excellent stakeholder management skills\n- Technical background preferred',
     140000, 180000, 'San Francisco, CA', 'full_time', 'open', '11111111-1111-1111-1111-111111111111'),

    ('j5555555-5555-5555-5555-555555555555', 'DevOps Engineer',
     'Build and maintain our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability and security.',
     '- 3+ years of DevOps experience\n- Strong AWS or Azure experience\n- Proficiency with Docker and Kubernetes\n- Experience with infrastructure as code (Terraform)\n- Knowledge of security best practices',
     120000, 160000, 'Remote', 'full_time', 'open', '11111111-1111-1111-1111-111111111111'),

    ('j6666666-6666-6666-6666-666666666666', 'Senior Investment Analyst',
     'Conduct in-depth research and analysis on investment opportunities. Prepare investment recommendations for portfolio managers.',
     '- 5+ years of investment analysis experience\n- MBA or CFA preferred\n- Strong financial modeling skills\n- Experience in specific sectors (tech, healthcare preferred)\n- Excellent presentation skills',
     130000, 180000, 'New York, NY', 'full_time', 'filled', '22222222-2222-2222-2222-222222222222'),

    ('j7777777-7777-7777-7777-777777777777', 'Renewable Energy Consultant',
     'Advise clients on renewable energy solutions. Conduct feasibility studies and develop project proposals.',
     '- 3+ years of renewable energy experience\n- Knowledge of solar and wind technologies\n- Strong project management skills\n- Engineering background preferred\n- Excellent client communication skills',
     90000, 120000, 'Austin, TX', 'contract', 'open', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE APPLICATIONS
-- ============================================================================
INSERT INTO applications (id, candidate_id, job_id, status, notes, applied_at) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'j1111111-1111-1111-1111-111111111111', 'interview', 'Strong candidate. Passed technical screen. Scheduled for onsite interview.', NOW() - INTERVAL '5 days'),
    ('a2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'j2222222-2222-2222-2222-222222222222', 'screening', 'Resume looks promising. Scheduling initial phone screen.', NOW() - INTERVAL '3 days'),
    ('a3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'j3333333-3333-3333-3333-333333333333', 'submitted', 'New application. Need to review resume.', NOW() - INTERVAL '1 day'),
    ('a4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', 'j4444444-4444-4444-4444-444444444444', 'offer', 'Excellent interviews. Preparing offer letter.', NOW() - INTERVAL '10 days'),
    ('a5555555-5555-5555-5555-555555555555', 'd5555555-5555-5555-5555-555555555555', 'j5555555-5555-5555-5555-555555555555', 'interview', 'Good technical skills. Second round scheduled.', NOW() - INTERVAL '4 days'),
    ('a6666666-6666-6666-6666-666666666666', 'd6666666-6666-6666-6666-666666666666', 'j1111111-1111-1111-1111-111111111111', 'rejected', 'Good designer but role requires more engineering focus.', NOW() - INTERVAL '7 days'),
    ('a7777777-7777-7777-7777-777777777777', 'd1111111-1111-1111-1111-111111111111', 'j5555555-5555-5555-5555-555555555555', 'screening', 'Also interested in DevOps role. Reviewing background.', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE PLACEMENTS
-- ============================================================================
INSERT INTO placements (id, candidate_id, company_id, job_id, start_date, salary, fee, status, notes) VALUES
    ('p1111111-1111-1111-1111-111111111111', 'd7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'j6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '30 days', 175000, 35000, 'active', 'Successful placement. Candidate started on time and performing well.'),
    ('p2222222-2222-2222-2222-222222222222', 'd4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'j4444444-4444-4444-4444-444444444444', NOW() + INTERVAL '14 days', 165000, 33000, 'active', 'Offer accepted. Start date confirmed.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE CANDIDATE NOTES
-- ============================================================================
INSERT INTO candidate_notes (id, content, candidate_id, author_id) VALUES
    ('n1111111-1111-1111-1111-111111111111', 'Excellent technical skills. Very strong in React and Node.js. Would be great for senior engineering roles.', 'd1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('n2222222-2222-2222-2222-222222222222', 'Had a great initial call. Very articulate and passionate about finance. CFA Level 2 passed.', 'd2222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
    ('n3333333-3333-3333-3333-333333333333', 'Strong healthcare IT background. Has worked with Epic for 4 years. Good cultural fit.', 'd3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('n4444444-4444-4444-4444-444444444444', 'Impressive product portfolio. Led several successful product launches.', 'd4444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE COMPANY NOTES
-- ============================================================================
INSERT INTO company_notes (id, content, company_id, author_id) VALUES
    ('cn111111-1111-1111-1111-111111111111', 'Great company to work with. Fast hiring process and good compensation packages.', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('cn222222-2222-2222-2222-222222222222', 'Traditional finance culture. Candidates should be prepared for rigorous interview process.', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
    ('cn333333-3333-3333-3333-333333333333', 'Growing rapidly. Lots of opportunities in their IT department.', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- UPDATE PLACED CANDIDATE STATUS
-- ============================================================================
UPDATE candidates SET status = 'placed' WHERE id = 'd7777777-7777-7777-7777-777777777777';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE 'Sample data seeded successfully!';
    RAISE NOTICE 'Created: 5 companies, 3 users, 5 contacts, 8 candidates, 7 jobs, 7 applications, 2 placements';
    RAISE NOTICE 'Default login: admin@aatoptalent.com / password123';
END $$;
