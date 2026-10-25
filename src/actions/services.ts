"use server";

import { redirect } from "next/navigation";
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
import { moveRow } from "@/lib/reorder";
import { formToObject, serviceSchema, uuidSchema } from "@/lib/validation";

const SLUG_TAKEN = "Another service already uses this slug.";

export async function createService(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsed = parseInput(serviceSchema, formToObject(formData));
  if (parsed.error) return parsed.error;

  const { data: last } = await admin.supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await admin.supabase.from("services").insert({
    ...parsed.data,
    sort_order: ((last?.sort_order as number | undefined) ?? -1) + 1,
  });
  if (error) return dbFailure(error, { uniqueField: "slug", uniqueMessage: SLUG_TAKEN });

  revalidatePublic();
  redirect("/admin/services?saved=created");
}

export async function updateService(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const id = uuidSchema.safeParse(formData.get("id"));
  if (!id.success) return fail("Invalid service.");

  const parsed = parseInput(serviceSchema, formToObject(formData));
  if (parsed.error) return parsed.error;

  const { data, error } = await admin.supabase
    .from("services")
    .update(parsed.data)
    .eq("id", id.data)
    .select("id")
    .maybeSingle();
  if (error) return dbFailure(error, { uniqueField: "slug", uniqueMessage: SLUG_TAKEN });
  if (!data) return fail("Service not found.");

  revalidatePublic();
  return succeed("Service saved.");
}

export async function setServiceStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success || (status !== "draft" && status !== "published")) {
    return fail("Invalid request.");
  }

  const { data, error } = await admin.supabase
    .from("services")
    .update({ status })
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();
  if (error) return dbFailure(error);
  if (!data) return fail("Service not found.");

  revalidatePublic();
  return succeed(status === "published" ? "Service published." : "Service unpublished.");
}

export async function moveService(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success || (direction !== "up" && direction !== "down")) {
    return fail("Invalid request.");
  }

  const result = await moveRow(admin.supabase, "services", parsedId.data, direction);
  if (!result.ok) return fail(result.error ?? "Could not reorder services.");

  revalidatePublic();
  return succeed();
}

export async function deleteService(id: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return fail("Invalid service.");

  const { error } = await admin.supabase.from("services").delete().eq("id", parsedId.data);
  if (error) return dbFailure(error);

  revalidatePublic();
  return succeed("Service deleted.");
}
