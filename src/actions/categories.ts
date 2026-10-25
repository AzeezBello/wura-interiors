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
import { moveRow } from "@/lib/reorder";
import { slugify } from "@/lib/utils";
import { categorySchema, formToObject, uuidSchema } from "@/lib/validation";

const SLUG_TAKEN = "Another category already uses this slug.";

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const raw = formToObject(formData);
  if (!raw.slug && typeof raw.name === "string") raw.slug = slugify(raw.name);

  const parsed = parseInput(categorySchema, raw);
  if (parsed.error) return parsed.error;

  const { data: last } = await admin.supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await admin.supabase
    .from("categories")
    .insert({ ...parsed.data, sort_order: ((last?.sort_order as number | undefined) ?? -1) + 1 });
  if (error) return dbFailure(error, { uniqueField: "slug", uniqueMessage: SLUG_TAKEN });

  revalidatePublic();
  return succeed(`Category “${parsed.data.name}” added.`);
}

export async function updateCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const id = uuidSchema.safeParse(formData.get("id"));
  if (!id.success) return fail("Invalid category.");

  const parsed = parseInput(categorySchema, formToObject(formData));
  if (parsed.error) return parsed.error;

  const { data, error } = await admin.supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id.data)
    .select("id")
    .maybeSingle();
  if (error) return dbFailure(error, { uniqueField: "slug", uniqueMessage: SLUG_TAKEN });
  if (!data) return fail("Category not found.");

  revalidatePublic();
  return succeed("Category saved.");
}

export async function moveCategory(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success || (direction !== "up" && direction !== "down")) {
    return fail("Invalid request.");
  }

  const result = await moveRow(admin.supabase, "categories", parsedId.data, direction);
  if (!result.ok) return fail(result.error ?? "Could not reorder categories.");

  revalidatePublic();
  return succeed();
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return fail("Invalid category.");

  // Projects in this category are kept and become uncategorised (ON DELETE SET NULL).
  const { error } = await admin.supabase.from("categories").delete().eq("id", parsedId.data);
  if (error) return dbFailure(error);

  revalidatePublic();
  return succeed("Category deleted. Its projects are now uncategorised.");
}
