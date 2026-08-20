-- ====================================================================
-- Skills Evidence Passport — Supabase / PostgreSQL Production Schema DDL
-- Compatible with PostgreSQL 15+, Supabase, and pgvector extension
-- ====================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Optional semantic vector search extension

-- 2. Define Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'verifier', 'recruiter', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_type AS ENUM (
        'REPOSITORY', 'DOCUMENT', 'PROJECT_URL', 'CERTIFICATE', 'VIDEO_DEMO', 'CODE_SNIPPET'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_status AS ENUM (
        'SUBMITTED', 'AI_SCREENED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_INFO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_decision AS ENUM ('APPROVE', 'REJECT', 'REQUEST_INFO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    department VARCHAR(255),
    graduation_year INT,
    bio TEXT,
    institution VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Skill Taxonomy Table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    taxonomy_version INT NOT NULL DEFAULT 1,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'code',
    rubric_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Colleges & Universities Table (2,000+ Indian Institutes)
CREATE TABLE IF NOT EXISTS colleges (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Evidence Submissions Table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id VARCHAR(100) NOT NULL REFERENCES skills(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type evidence_type NOT NULL DEFAULT 'REPOSITORY',
    file_ref TEXT NOT NULL,
    external_url TEXT,
    status evidence_status NOT NULL DEFAULT 'SUBMITTED',
    content_hash CHAR(64) NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI Score Results Table
CREATE TABLE IF NOT EXISTS ai_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID UNIQUE NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    confidence_score NUMERIC(5, 4) NOT NULL,
    suggested_level VARCHAR(50) NOT NULL,
    similarity_flag BOOLEAN NOT NULL DEFAULT FALSE,
    rubric_suggestions JSONB NOT NULL DEFAULT '{}'::jsonb,
    model_version VARCHAR(100) NOT NULL,
    execution_source VARCHAR(50) NOT NULL DEFAULT 'python-ml',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Verifier Decisions Table
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES users(id),
    decision verification_decision NOT NULL,
    proficiency_level VARCHAR(50) NOT NULL,
    rubric_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_score INT NOT NULL,
    comments TEXT,
    overrode_ai_suggestion BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    decided_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Public Portfolio Settings Table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shareable_slug VARCHAR(255) UNIQUE NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    visible_fields JSONB NOT NULL DEFAULT '{"showEmail": true, "showDepartment": true, "showGraduationYear": true, "showTimeline": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tamper-Evident Audit Logs Table (Hash-Chained)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id VARCHAR(255) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    payload_summary TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    prev_hash CHAR(64) NOT NULL,
    hash CHAR(64) NOT NULL
);

-- 11. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(status);
CREATE INDEX IF NOT EXISTS idx_evidence_skill_id ON evidence(skill_id);
CREATE INDEX IF NOT EXISTS idx_verifications_evidence_id ON verifications(evidence_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_hash ON audit_logs(hash);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_category ON colleges(category);
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);

-- 12. Row-Level Security (RLS) Policies for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public portfolios viewable by everyone" ON portfolios FOR SELECT USING (is_public = true);
CREATE POLICY "Approved evidence is public" ON evidence FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Public colleges viewable by everyone" ON colleges FOR SELECT USING (true);
