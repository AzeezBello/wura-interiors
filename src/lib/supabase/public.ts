import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * Cookie-less, anonymous client for the public website. Because it carries no
 * session, public pages can be statically generated and cached (ISR), and
 * row-level security guarantees visitors only ever receive published content.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
