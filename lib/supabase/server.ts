// ===========================================================================
// lib/supabase/server.ts
// Server-side Supabase client utilities for the accounting engine.
// Uses service_role key to bypass RLS for automated background processing.
// ===========================================================================

import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase admin client using the service_role key.
 * Used by the accounting engine to bypass RLS for automated post-order processing.
 * NEVER expose this client to the browser.
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not set in environment variables.'
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. ' +
      'This is required for the accounting engine to bypass RLS.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
