# Supabase Database Setup

This directory contains SQL files for setting up the A&A Top Talent recruiting platform database in Supabase.

## Files

| File | Description |
|------|-------------|
| `schema.sql` | Creates all tables, indexes, triggers, and views |
| `seed.sql` | Inserts sample data for testing and development |
| `policies.sql` | Sets up Row Level Security (RLS) policies |

## Quick Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the files in this order:
   - `schema.sql` (creates database structure)
   - `seed.sql` (adds sample data - optional)
   - `policies.sql` (enables security - optional for development)

## Database Schema

### Tables

```
users              - Platform users (recruiters, admins)
companies          - Client companies (employers)
candidates         - Job seekers in the talent pool
contacts           - Contact persons at client companies
jobs               - Job openings from client companies
applications       - Candidate applications to jobs
placements         - Successful candidate placements
candidate_notes    - Notes/comments on candidates
company_notes      - Notes/comments on companies
```

### Entity Relationships

```
                    ┌─────────────┐
                    │    Users    │
                    └──────┬──────┘
                           │ writes
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼─────────┐   ┌──────────▼─────────┐
    │  Candidate Notes  │   │   Company Notes    │
    └─────────┬─────────┘   └──────────┬─────────┘
              │                         │
    ┌─────────▼─────────┐   ┌──────────▼─────────┐
    │    Candidates     │   │     Companies      │
    └─────────┬─────────┘   └──────────┬─────────┘
              │                         │
              │    ┌───────────┐        │
              ├────►Applications◄───────┼─── Jobs
              │    └───────────┘        │
              │                         │
              │    ┌───────────┐        │
              └────► Placements ◄───────┘
                   └───────────┘
                         │
                    ┌────▼────┐
                    │ Contacts│
                    └─────────┘
```

## Sample Data

The `seed.sql` file creates:
- **5 Companies**: TechCorp, Global Financial, HealthFirst, Green Energy, Retail Giant
- **3 Users**: 1 admin + 2 recruiters
- **5 Contacts**: Company contact persons
- **8 Candidates**: Various tech, finance, and healthcare professionals
- **7 Jobs**: Open positions at different companies
- **7 Applications**: Candidates applied to jobs
- **2 Placements**: Successful hires

### Default Login
```
Email: admin@aatoptalent.com
Password: password123
```

## Views

The schema creates helpful views for reporting:

| View | Description |
|------|-------------|
| `candidate_summary` | Candidates with application/placement counts |
| `company_summary` | Companies with job/placement/fee totals |
| `job_details` | Jobs with company info and application counts |
| `recruitment_pipeline` | Activity feed of all applications |

## Using with Prisma

This project uses Prisma ORM. The SQL schema matches the Prisma schema in `prisma/schema.prisma`. You can use either:

**Option A: Prisma (Recommended)**
```bash
npm run db:push     # Push Prisma schema to database
npm run db:seed     # Run Prisma seed script
```

**Option B: Raw SQL**
Run the SQL files directly in Supabase SQL Editor.

## Row Level Security (RLS)

The `policies.sql` file enables RLS with these rules:

| Table | View | Create | Update | Delete |
|-------|------|--------|--------|--------|
| users | Self/Admin | Admin | Self | Admin |
| companies | All | All | All | Admin |
| candidates | All | All | All | Admin |
| contacts | All | All | All | All |
| jobs | All | All | All | Admin |
| applications | All | All | All | Admin |
| placements | All | All | All | Admin |
| notes | All | All | Author | Author |

**Note**: If using custom auth (not Supabase Auth), use the `service_role` key for API operations which bypasses RLS.

## Connection Strings

Get these from your Supabase dashboard under **Settings > Database**:

```env
# Pooled connection (for application)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```
