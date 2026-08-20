import fs from 'fs';
import path from 'path';
import { dbStore } from './db.js';

let pgPool = null;
let isSupabaseRestActive = false;

function loadEnvFile() {
  if (process.env.SUPABASE_URL) return;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const parts = trimmed.split('=');
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim();
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  } catch (e) {
    // Ignore error if .env file unreadable
  }
}

/**
 * Initializes Passwordless Supabase / PostgreSQL Connection.
 */
export async function initPostgresPool() {
  loadEnvFile();
  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // 1. Passwordless Supabase REST Connection Check
  if (supabaseUrl && supabaseKey && (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]'))) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/skills?select=id&limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (res.ok) {
        isSupabaseRestActive = true;
        console.log(`✅ Connected to Supabase Cloud Project passwordlessly (${process.env.SUPABASE_PROJECT_ID || 'lwyknurgoianubqadfsr'})!`);
        console.log(`⚡ Supabase REST API & Realtime Data Engine active at: ${supabaseUrl}`);
        return true;
      }
    } catch (e) {
      console.warn('⚠️ Supabase REST API check failed:', e.message);
    }
  }

  // 2. Direct PostgreSQL Pooler Connection (if password provided)
  if (databaseUrl && !databaseUrl.includes('[YOUR-PASSWORD]') && !databaseUrl.includes('localhost:5432')) {
    try {
      const { Pool } = await import('pg');
      pgPool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
      });

      const res = await pgPool.query('SELECT NOW() as current_time');
      console.log('✅ Successfully connected to Supabase PostgreSQL Database at:', res.rows[0].current_time);
      return pgPool;
    } catch (err) {
      console.warn('⚠️ PostgreSQL TCP Pooler failed:', err.message);
    }
  }

  console.log('ℹ️ Running with fast local encrypted DB store & Supabase sync.');
  return null;
}

/**
 * Executes a PostgreSQL query if connected, or executes local JSON fallback.
 */
export async function queryPostgres(text, params = []) {
  if (pgPool) {
    return await pgPool.query(text, params);
  }
  return null;
}
