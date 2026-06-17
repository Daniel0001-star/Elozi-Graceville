/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Retrieve environment variable configurations
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Validate if URL and Key are genuinely configured (non-empty and not the default placeholder text)
export const isSupabaseConfigured = (() => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your_supabase') || supabaseUrl.includes('MY_SUPABASE')) return false;
  if (supabaseAnonKey.includes('your_supabase') || supabaseAnonKey.includes('MY_SUPABASE')) return false;
  
  // Guard against malformed URLs to prevent throwing synchronous exceptions at startup
  try {
    new URL(supabaseUrl);
    return true;
  } catch (error) {
    console.warn("Invalid Supabase URL format:", supabaseUrl);
    return false;
  }
})();

// Provide the direct supabase instances if configured, otherwise safe null refs
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

console.log(`[Elozi-Graceville Service] Supabase status: ${isSupabaseConfigured ? '🟢 CONNECTED (LIVE DATABASE ACTIVATED)' : '🟡 DEVELOPER MOCK MODE (USING PRE-SEEDED LOCAL STORAGE)'}`);
