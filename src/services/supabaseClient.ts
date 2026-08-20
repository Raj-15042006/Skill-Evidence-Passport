/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://lwyknurgoianubqadfsr.supabase.co';
const supabaseAnonKey =
  (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eWtudXJnb2lhbnVicWFkZnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMDExOTIsImV4cCI6MjA5ODg3NzE5Mn0.9_kpnyFNXQ_gtVz4ppjIERvbupG5eLefT2C7DyPi7iI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export interface SupabaseAuthResult {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
}

/**
 * Sign Up new user with Supabase Auth
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata: {
    name: string;
    role: string;
    institution?: string;
    department?: string;
  }
): Promise<SupabaseAuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message || 'Supabase signup failed' };
  }
}

/**
 * Sign In existing user with Supabase Auth
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<SupabaseAuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message || 'Supabase signin failed' };
  }
}

/**
 * Trigger Password Recovery Email via Supabase Auth
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const redirectUrl = `${window.location.origin}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send recovery email' };
  }
}

/**
 * Update password for logged-in or password recovery session
 */
export async function updateUserPassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update password' };
  }
}
