import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { AdminProfile } from "@/types";

export type AdminContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: { id: string; email?: string };
  profile: AdminProfile;
};

/**
 * Returns the signed-in administrator, or null. The check is made against the
 * database on every call (never trusting client-supplied data):
 *   1. the auth token is validated with Supabase Auth (getUser), and
 *   2. the user must have an active "admin" row in public.profiles.
 */
export const getAdmin = cache(async (): Promise<AdminContext | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin" || !profile.is_active) return null;

  return {
    supabase,
    user: { id: user.id, email: user.email },
    profile: profile as AdminProfile,
  };
});

/** For pages and layouts: redirect to sign-in when not an administrator. */
export async function requireAdmin(): Promise<AdminContext> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login?error=not-authorised");
  return admin;
}
