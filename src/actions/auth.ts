"use server";

import { redirect } from "next/navigation";
import { fail, parseInput, type ActionState } from "@/lib/action-helpers";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formToObject, signInSchema } from "@/lib/validation";

/** Only allow redirects back into the dashboard (prevents open redirects). */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return /^\/admin(\/[A-Za-z0-9\-_/]*)?$/.test(next) && !next.includes("//")
    ? next
    : "/admin";
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return fail("Supabase is not configured yet. Add the environment variables and redeploy.");
  }

  const parsed = parseInput(signInSchema, formToObject(formData));
  if (parsed.error) return parsed.error;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message for every failure so the form never reveals which emails exist.
  if (error) return fail("Invalid email or password.");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("role,is_active")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    await supabase.auth.signOut();
    return fail("This account is not authorised to use the dashboard.");
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
