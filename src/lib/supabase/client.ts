import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/** Browser client — used only for direct image uploads from the dashboard. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
