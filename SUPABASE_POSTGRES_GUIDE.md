# Live Supabase Integration Status & Developer Guide

> **Status**: Automated setup complete! The **Skills Evidence Passport** database schema and 10 real-life subject skills have been successfully provisioned on your active Supabase project.

---

## Live Supabase Project Credentials

- **Project Name**: `Skill Evidence Passport`
- **Project Reference**: `lwyknurgoianubqadfsr`
- **Region**: `ap-south-1` (Mumbai)
- **Supabase URL**: `https://lwyknurgoianubqadfsr.supabase.co`
- **Database Host**: `db.lwyknurgoianubqadfsr.supabase.co`
- **Anon Key**: Enforced in [.env](file:///c:/Users/Raj/.gemini/antigravity-ide/scratch/Skill%20Evidence%20Passport/.env)

---

## Automated Actions Executed

1. **Schema DDL Applied**: Ran [scripts/schema_supabase.sql](file:///c:/Users/Raj/.gemini/antigravity-ide/scratch/Skill%20Evidence%20Passport/scripts/schema_supabase.sql) creating all 7 core tables (`users`, `skills`, `evidence`, `ai_scores`, `verifications`, `portfolios`, `audit_logs`), indexes, and Row-Level Security (RLS) policies.
2. **Skill Taxonomy Seeded**: Seeded all **10 Real-Life Subject Skills** (Python, Data Science, Cloud Architecture, UI/UX Design, DevOps, Cybersecurity, Generative AI, Product Management, Database Systems, and Mobile Dev) into the `public.skills` table in Supabase.
3. **Default Users Seeded**: Seeded default student, verifier, recruiter, and admin user accounts into `public.users`.

---

## Connecting Your Connection String in `.env`

To connect the live Node Express backend to your Supabase Transaction Pooler:

1. Open your [.env](file:///c:/Users/Raj/.gemini/antigravity-ide/scratch/Skill%20Evidence%20Passport/.env) file.
2. Replace `[YOUR-PASSWORD]` in `DATABASE_URL` with your Supabase database password:
   ```env
   DATABASE_URL=postgresql://postgres.lwyknurgoianubqadfsr:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
3. Start or restart the Express backend:
   ```bash
   npm run server
   ```
4. You will see:
   ```text
   ✅ Successfully connected to Supabase / PostgreSQL database at: 2026-08-12 ...
   Express REST API Server listening on http://localhost:5000
   ```
