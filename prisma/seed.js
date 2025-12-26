const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aatoptalent.com' },
    update: {},
    create: {
      email: 'admin@aatoptalent.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    }
  });
  console.log('Created admin user:', adminUser.email);

  // Create sample companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { id: 'company-1' },
      update: {},
      create: {
        id: 'company-1',
        name: 'TechCorp Solutions',
        industry: 'Technology',
        website: 'https://techcorp.example.com',
        size: '201-500',
        location: 'San Francisco, CA',
        description: 'Leading technology solutions provider',
        status: 'active'
      }
    }),
    prisma.company.upsert({
      where: { id: 'company-2' },
      update: {},
      create: {
        id: 'company-2',
        name: 'Global Financial Services',
        industry: 'Financial Services',
        website: 'https://globalfinancial.example.com',
        size: '500+',
        location: 'New York, NY',
        description: 'Premier financial services firm',
        status: 'active'
      }
    }),
    prisma.company.upsert({
      where: { id: 'company-3' },
      update: {},
      create: {
        id: 'company-3',
        name: 'HealthFirst Medical',
        industry: 'Healthcare',
        website: 'https://healthfirst.example.com',
        size: '51-200',
        location: 'Boston, MA',
        description: 'Innovative healthcare provider',
        status: 'active'
      }
    })
  ]);
  console.log('Created', companies.length, 'companies');

  // Create contacts for companies
  await Promise.all([
    prisma.contact.upsert({
      where: { id: 'contact-1' },
      update: {},
      create: {
        id: 'contact-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sjohnson@techcorp.example.com',
        phone: '(555) 123-4567',
        title: 'VP of Human Resources',
        isPrimary: true,
        companyId: 'company-1'
      }
    }),
    prisma.contact.upsert({
      where: { id: 'contact-2' },
      update: {},
      create: {
        id: 'contact-2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'mchen@globalfinancial.example.com',
        phone: '(555) 234-5678',
        title: 'Director of Talent Acquisition',
        isPrimary: true,
        companyId: 'company-2'
      }
    })
  ]);
  console.log('Created contacts');

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.upsert({
      where: { id: 'job-1' },
      update: {},
      create: {
        id: 'job-1',
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced software engineer to join our platform team.',
        requirements: '5+ years experience, React, Node.js, AWS',
        salaryMin: 150000,
        salaryMax: 200000,
        location: 'San Francisco, CA (Hybrid)',
        type: 'full_time',
        status: 'open',
        companyId: 'company-1'
      }
    }),
    prisma.job.upsert({
      where: { id: 'job-2' },
      update: {},
      create: {
        id: 'job-2',
        title: 'Financial Analyst',
        description: 'Join our finance team to provide strategic financial analysis.',
        requirements: 'CFA preferred, 3+ years experience, Excel, SQL',
        salaryMin: 90000,
        salaryMax: 130000,
        location: 'New York, NY',
        type: 'full_time',
        status: 'open',
        companyId: 'company-2'
      }
    }),
    prisma.job.upsert({
      where: { id: 'job-3' },
      update: {},
      create: {
        id: 'job-3',
        title: 'Healthcare IT Specialist',
        description: 'Support and maintain healthcare IT systems.',
        requirements: 'Healthcare IT experience, HIPAA knowledge, networking',
        salaryMin: 80000,
        salaryMax: 110000,
        location: 'Boston, MA',
        type: 'full_time',
        status: 'open',
        companyId: 'company-3'
      }
    })
  ]);
  console.log('Created', jobs.length, 'jobs');

  // Create sample candidates
  const candidates = await Promise.all([
    prisma.candidate.upsert({
      where: { email: 'john.developer@email.com' },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Developer',
        email: 'john.developer@email.com',
        phone: '(555) 111-2222',
        location: 'San Francisco, CA',
        currentTitle: 'Software Engineer',
        currentCompany: 'StartupXYZ',
        yearsExperience: 6,
        skills: 'JavaScript, React, Node.js, Python, AWS, Docker',
        linkedinUrl: 'https://linkedin.com/in/johndeveloper',
        status: 'active',
        source: 'linkedin',
        desiredSalary: '$160,000 - $190,000',
        desiredRole: 'Senior Software Engineer',
        availability: '2_weeks'
      }
    }),
    prisma.candidate.upsert({
      where: { email: 'emily.finance@email.com' },
      update: {},
      create: {
        firstName: 'Emily',
        lastName: 'Finance',
        email: 'emily.finance@email.com',
        phone: '(555) 333-4444',
        location: 'New York, NY',
        currentTitle: 'Financial Analyst',
        currentCompany: 'Investment Bank Co',
        yearsExperience: 4,
        skills: 'Financial Modeling, Excel, SQL, Python, CFA Level 2',
        linkedinUrl: 'https://linkedin.com/in/emilyfinance',
        status: 'active',
        source: 'referral',
        desiredSalary: '$110,000 - $140,000',
        desiredRole: 'Senior Financial Analyst',
        availability: '1_month'
      }
    }),
    prisma.candidate.upsert({
      where: { email: 'david.health@email.com' },
      update: {},
      create: {
        firstName: 'David',
        lastName: 'Health',
        email: 'david.health@email.com',
        phone: '(555) 555-6666',
        location: 'Boston, MA',
        currentTitle: 'IT Support Specialist',
        currentCompany: 'Regional Hospital',
        yearsExperience: 5,
        skills: 'Healthcare IT, HIPAA, Networking, EMR Systems, Help Desk',
        linkedinUrl: 'https://linkedin.com/in/davidhealth',
        status: 'active',
        source: 'job_board',
        desiredSalary: '$90,000 - $120,000',
        desiredRole: 'Healthcare IT Specialist',
        availability: 'immediate'
      }
    })
  ]);
  console.log('Created', candidates.length, 'candidates');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
