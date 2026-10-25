"use server";

import {
  UNAUTHORISED,
  dbFailure,
  fail,
  parseInput,
  revalidatePublic,
  succeed,
  type ActionResult,
  type ActionState,
} from "@/lib/action-helpers";
import { getAdmin } from "@/lib/auth";
import { BUCKETS } from "@/lib/env";
import { formToObject, settingsSchema } from "@/lib/validation";

export async function updateSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsed = parseInput(settingsSchema, formToObject(formData));
  if (parsed.error) return parsed.error;

  const { error } = await admin.supabase
    .from("site_settings")
    .upsert({ id: 1, ...parsed.data });
  if (error) return dbFailure(error);

  revalidatePublic();
  return succeed("Settings saved.");
}

const LOGO_PATH = /^logo\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|jpeg|webp|svg)$/;

/**
 * Registers an uploaded logo (the browser uploads straight to the brand-assets
 * bucket). Pass null to remove the logo and return to the text placeholder.
 */
export async function setLogo(path: string | null): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  if (path !== null && (typeof path !== "string" || !LOGO_PATH.test(path))) {
    return fail("Invalid logo file.");
  }

  const { supabase } = admin;

  const { data: current } = await supabase
    .from("site_settings")
    .select("logo_path")
    .eq("id", 1)
    .maybeSingle();

  const { error } = await supabase.from("site_settings").upsert({ id: 1, logo_path: path });
  if (error) {
    if (path) await supabase.storage.from(BUCKETS.brand).remove([path]);
    return dbFailure(error);
  }

  const previous = current?.logo_path as string | null | undefined;
  if (previous && previous !== path) {
    await supabase.storage.from(BUCKETS.brand).remove([previous]);
  }

  revalidatePublic();
  return succeed(path ? "Logo updated." : "Logo removed — the text placeholder is showing again.");
}
