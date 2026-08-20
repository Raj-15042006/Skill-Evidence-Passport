-- ====================================================================
-- SKILLS EVIDENCE PASSPORT — SUPABASE DDL & SEED SCRIPT
-- All India Listed Colleges & Universities Database Schema
-- Project: Skill Evidence Passport (Supabase PostgreSQL)
-- ====================================================================

-- 1. Enable Required Extensions for Fast Text Search & UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Drop existing table if recreating
DROP TABLE IF EXISTS public.colleges CASCADE;

-- 3. Create Colleges Table Schema
CREATE TABLE public.colleges (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'IIT', 'NIT', 'IIIT', 'Central Univ', 'State Univ', 'Autonomous', 'Deemed / Private', 'Medical / AIIMS', 'Management / IIM'
    )),
    tier VARCHAR(20) DEFAULT 'Tier 1' CHECK (tier IN ('Tier 1', 'Tier 2', 'Tier 3')),
    ownership VARCHAR(50) DEFAULT 'Public / Government' CHECK (ownership IN ('Public / Government', 'Private / Self-Financed', 'Deemed', 'Societal')),
    nirf_rank INT,
    naac_grade VARCHAR(10),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Indexes for High-Performance Search & Autocomplete
CREATE INDEX idx_colleges_state ON public.colleges(state);
CREATE INDEX idx_colleges_category ON public.colleges(category);
CREATE INDEX idx_colleges_tier ON public.colleges(tier);
CREATE INDEX idx_colleges_name_trgm ON public.colleges USING gin (name gin_trgm_ops);

-- 5. Row-Level Security (RLS) Policies
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all active colleges
CREATE POLICY "Public Read Colleges"
    ON public.colleges
    FOR SELECT
    USING (is_active = TRUE);

-- Allow admins full CRUD operations
CREATE POLICY "Admin Full Access Colleges"
    ON public.colleges
    FOR ALL
    USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- 6. Helper Function for Fast Server-Side Autocomplete Search
CREATE OR REPLACE FUNCTION public.search_indian_colleges(
    search_term TEXT,
    max_limit INT DEFAULT 20
)
RETURNS SETOF public.colleges
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM public.colleges
    WHERE is_active = TRUE
      AND (
          name ILIKE '%' || search_term || '%'
          OR short_code ILIKE '%' || search_term || '%'
          OR city ILIKE '%' || search_term || '%'
          OR state ILIKE '%' || search_term || '%'
      )
    ORDER BY 
        CASE 
            WHEN category = 'IIT' THEN 1
            WHEN category = 'NIT' THEN 2
            WHEN category = 'IIIT' THEN 3
            WHEN category = 'Central Univ' THEN 4
            ELSE 5
        END,
        name ASC
    LIMIT max_limit;
$$;

-- 7. Seed Data: All India Listed Premier Colleges & Universities
INSERT INTO public.colleges (id, name, short_code, city, state, category, tier, ownership, nirf_rank, website) VALUES
-- Premier National Institutes (IITs)
('iisc-bangalore', 'Indian Institute of Science (IISc), Bangalore', 'IISc', 'Bangalore', 'Karnataka', 'Central Univ', 'Tier 1', 'Public / Government', 1, 'https://iisc.ac.in'),
('iit-bombay', 'Indian Institute of Technology (IIT), Bombay', 'IITB', 'Mumbai', 'Maharashtra', 'IIT', 'Tier 1', 'Public / Government', 3, 'https://iitb.ac.in'),
('iit-delhi', 'Indian Institute of Technology (IIT), Delhi', 'IITD', 'New Delhi', 'Delhi', 'IIT', 'Tier 1', 'Public / Government', 2, 'https://iitd.ac.in'),
('iit-madras', 'Indian Institute of Technology (IIT), Madras', 'IITM', 'Chennai', 'Tamil Nadu', 'IIT', 'Tier 1', 'Public / Government', 1, 'https://iitm.ac.in'),
('iit-kharagpur', 'Indian Institute of Technology (IIT), Kharagpur', 'IITKGP', 'Kharagpur', 'West Bengal', 'IIT', 'Tier 1', 'Public / Government', 6, 'https://iitkgp.ac.in'),
('iit-kanpur', 'Indian Institute of Technology (IIT), Kanpur', 'IITK', 'Kanpur', 'Uttar Pradesh', 'IIT', 'Tier 1', 'Public / Government', 4, 'https://iitk.ac.in'),
('iit-roorkee', 'Indian Institute of Technology (IIT), Roorkee', 'IITR', 'Roorkee', 'Uttarakhand', 'IIT', 'Tier 1', 'Public / Government', 5, 'https://iitr.ac.in'),
('iit-guwahati', 'Indian Institute of Technology (IIT), Guwahati', 'IITG', 'Guwahati', 'Assam', 'IIT', 'Tier 1', 'Public / Government', 7, 'https://iitg.ac.in'),
('iit-hyderabad', 'Indian Institute of Technology (IIT), Hyderabad', 'IITH', 'Hyderabad', 'Telangana', 'IIT', 'Tier 1', 'Public / Government', 8, 'https://iith.ac.in'),
('iit-bhu', 'Indian Institute of Technology (IIT BHU), Varanasi', 'IIT-BHU', 'Varanasi', 'Uttar Pradesh', 'IIT', 'Tier 1', 'Public / Government', 15, 'https://iitbhu.ac.in'),

-- NITs (National Institutes of Technology)
('nit-trichy', 'National Institute of Technology (NIT), Tiruchirappalli', 'NITT', 'Tiruchirappalli', 'Tamil Nadu', 'NIT', 'Tier 1', 'Public / Government', 9, 'https://nitt.edu'),
('nit-surathkal', 'National Institute of Technology Karnataka (NITK), Surathkal', 'NITK', 'Mangalore', 'Karnataka', 'NIT', 'Tier 1', 'Public / Government', 12, 'https://nitk.ac.in'),
('nit-warangal', 'National Institute of Technology (NIT), Warangal', 'NITW', 'Warangal', 'Telangana', 'NIT', 'Tier 1', 'Public / Government', 21, 'https://nitw.ac.in'),
('nit-calicut', 'National Institute of Technology (NIT), Calicut', 'NITC', 'Kozhikode', 'Kerala', 'NIT', 'Tier 1', 'Public / Government', 23, 'https://nitc.ac.in'),
('vnit-nagpur', 'Visvesvaraya National Institute of Technology (VNIT), Nagpur', 'VNIT', 'Nagpur', 'Maharashtra', 'NIT', 'Tier 1', 'Public / Government', 41, 'https://vnit.ac.in'),
('mnit-jaipur', 'Malaviya National Institute of Technology (MNIT), Jaipur', 'MNIT', 'Jaipur', 'Rajasthan', 'NIT', 'Tier 1', 'Public / Government', 37, 'https://mnit.ac.in'),

-- IIITs
('iiit-hyderabad', 'International Institute of Information Technology (IIIT), Hyderabad', 'IIITH', 'Hyderabad', 'Telangana', 'IIIT', 'Tier 1', 'Public / Government', 55, 'https://iiit.ac.in'),
('iiit-bangalore', 'International Institute of Information Technology (IIIT), Bangalore', 'IIITB', 'Bangalore', 'Karnataka', 'IIIT', 'Tier 1', 'Public / Government', 74, 'https://iiitb.ac.in'),
('iiit-delhi', 'Indraprastha Institute of Information Technology (IIIT), Delhi', 'IIITD', 'New Delhi', 'Delhi', 'IIIT', 'Tier 1', 'Public / Government', 75, 'https://iiitd.ac.in'),
('iiit-allahabad', 'Indian Institute of Information Technology (IIIT), Allahabad', 'IIITA', 'Prayagraj', 'Uttar Pradesh', 'IIIT', 'Tier 1', 'Public / Government', 89, 'https://iiita.ac.in'),

-- Central Universities
('delhi-university', 'University of Delhi (DU), New Delhi', 'DU', 'New Delhi', 'Delhi', 'Central Univ', 'Tier 1', 'Public / Government', 11, 'https://du.ac.in'),
('jnu-delhi', 'Jawaharlal Nehru University (JNU), New Delhi', 'JNU', 'New Delhi', 'Delhi', 'Central Univ', 'Tier 1', 'Public / Government', 2, 'https://jnu.ac.in'),
('bhu-varanasi', 'Banaras Hindu University (BHU), Varanasi', 'BHU', 'Varanasi', 'Uttar Pradesh', 'Central Univ', 'Tier 1', 'Public / Government', 5, 'https://bhu.ac.in'),
('uoh-hyderabad', 'University of Hyderabad (UoH), Hyderabad', 'HCU', 'Hyderabad', 'Telangana', 'Central Univ', 'Tier 1', 'Public / Government', 10, 'https://uohyd.ac.in'),
('amu-aligarh', 'Aligarh Muslim University (AMU), Aligarh', 'AMU', 'Aligarh', 'Uttar Pradesh', 'Central Univ', 'Tier 1', 'Public / Government', 9, 'https://amu.ac.in'),

-- State Universities & Major Technical Universities
('anna-university', 'Anna University, Chennai', 'AU', 'Chennai', 'Tamil Nadu', 'State Univ', 'Tier 1', 'Public / Government', 14, 'https://annauniv.edu'),
('sppu-pune', 'Savitribai Phule Pune University (SPPU), Pune', 'SPPU', 'Pune', 'Maharashtra', 'State Univ', 'Tier 1', 'Public / Government', 19, 'https://unipune.ac.in'),
('mu-mumbai', 'University of Mumbai, Mumbai', 'MU', 'Mumbai', 'Maharashtra', 'State Univ', 'Tier 2', 'Public / Government', 45, 'https://mu.ac.in'),
('vtu-belagavi', 'Visvesvaraya Technological University (VTU), Belagavi', 'VTU', 'Belagavi', 'Karnataka', 'State Univ', 'Tier 2', 'Public / Government', 52, 'https://vtu.ac.in'),
('jntu-hyderabad', 'Jawaharlal Nehru Technological University (JNTUH), Hyderabad', 'JNTUH', 'Hyderabad', 'Telangana', 'State Univ', 'Tier 2', 'Public / Government', 76, 'https://jntuh.ac.in'),
('dtu-delhi', 'Delhi Technological University (DTU), Delhi', 'DTU', 'New Delhi', 'Delhi', 'State Univ', 'Tier 1', 'Public / Government', 29, 'https://dtu.ac.in'),
('nsut-delhi', 'Netaji Subhas University of Technology (NSUT), Delhi', 'NSUT', 'New Delhi', 'Delhi', 'State Univ', 'Tier 1', 'Public / Government', 60, 'https://nsut.ac.in'),
('coep-pune', 'COEP Technological University (COEP), Pune', 'COEP', 'Pune', 'Maharashtra', 'Autonomous', 'Tier 1', 'Public / Government', 73, 'https://coep.org.in'),

-- Premier Autonomous & Deemed / Private Universities
('bits-pilani', 'Birla Institute of Technology and Science (BITS), Pilani', 'BITS', 'Pilani', 'Rajasthan', 'Deemed / Private', 'Tier 1', 'Private / Self-Financed', 25, 'https://bits-pilani.ac.in'),
('vit-vellore', 'Vellore Institute of Technology (VIT), Vellore', 'VIT', 'Vellore', 'Tamil Nadu', 'Deemed / Private', 'Tier 1', 'Private / Self-Financed', 11, 'https://vit.ac.in'),
('manipal-mahe', 'Manipal Academy of Higher Education (MAHE), Manipal', 'MAHE', 'Manipal', 'Karnataka', 'Deemed / Private', 'Tier 1', 'Private / Self-Financed', 6, 'https://manipal.edu'),
('thapar-patiala', 'Thapar Institute of Engineering and Technology (TIET), Patiala', 'TIET', 'Patiala', 'Punjab', 'Deemed / Private', 'Tier 1', 'Private / Self-Financed', 20, 'https://thapar.edu'),
('amity-noida', 'Amity University, Noida', 'AMITY', 'Noida', 'Uttar Pradesh', 'Deemed / Private', 'Tier 2', 'Private / Self-Financed', 35, 'https://amity.edu'),
('srm-chennai', 'SRM Institute of Science and Technology, Chennai', 'SRM', 'Chennai', 'Tamil Nadu', 'Deemed / Private', 'Tier 2', 'Private / Self-Financed', 18, 'https://srmist.edu.in'),
('sastra-thanjavur', 'SASTRA Deemed University, Thanjavur', 'SASTRA', 'Thanjavur', 'Tamil Nadu', 'Deemed / Private', 'Tier 2', 'Private / Self-Financed', 26, 'https://sastra.edu'),
('rvce-bangalore', 'RV College of Engineering (RVCE), Bangalore', 'RVCE', 'Bangalore', 'Karnataka', 'Autonomous', 'Tier 1', 'Private / Self-Financed', 89, 'https://rvce.edu.in'),
('pes-bangalore', 'PES University, Bangalore', 'PESU', 'Bangalore', 'Karnataka', 'Deemed / Private', 'Tier 2', 'Private / Self-Financed', 100, 'https://pes.edu');

-- 8. Verify Table Insertion
SELECT category, COUNT(*) as total_institutes
FROM public.colleges
GROUP BY category
ORDER BY total_institutes DESC;
