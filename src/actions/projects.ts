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
import { BUCKETS } from "@/lib/env";
import {
  formToObject,
  projectSchema,
  projectStatusSchema,
  uuidSchema,
} from "@/lib/validation";

const SLUG_TAKEN = "Another project already uses this slug.";

export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsed = parseInput(projectSchema, formToObject(formData, ["featured"]));
  if (parsed.error) return parsed.error;

  const { data, error } = await admin.supabase
    .from("projects")
    .insert({ ...parsed.data, status: "draft", created_by: admin.user.id })
    .select("id")
    .single();

  if (error) return dbFailure(error, { uniqueField: "slug", uniqueMessage: SLUG_TAKEN });

  redirect(`/admin/projects/${data.id}?created=1`);
}

export async function updateProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const id = uuidSchema.safeParse(formData.get("id"));
  if (!id.success) return fail("Invalid project.");

  const parsed = parseInput(projectSchema, formToObject(formData, ["featured"]));
  if (parsed.error) return parsed.error;

  const { data, error } = await admin.supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", id.data)
    .select("id")
    .maybeSingle();

  if (error) return dbFailure(error, { uniqueField: "slug", uniqueMessage: SLUG_TAKEN });
  if (!data) return fail("Project not found.");

  revalidatePublic();
  return succeed("Project details saved.");
}

export async function setProjectStatus(id: string, status: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  const parsedStatus = projectStatusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return fail("Invalid request.");

  const { supabase } = admin;

  if (parsedStatus.data === "published") {
    const { count } = await supabase
      .from("project_images")
      .select("id", { count: "exact", head: true })
      .eq("project_id", parsedId.data);
    if (!count) return fail("Upload at least one image before publishing this project.");

    // Make sure a cover image is chosen.
    const { data: cover } = await supabase
      .from("project_images")
      .select("id")
      .eq("project_id", parsedId.data)
      .eq("is_cover", true)
      .maybeSingle();
    if (!cover) {
      const { data: first } = await supabase
        .from("project_images")
        .select("id")
        .eq("project_id", parsedId.data)
        .order("sort_order")
        .limit(1)
        .maybeSingle();
      if (first) await supabase.from("project_images").update({ is_cover: true }).eq("id", first.id);
    }
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) return dbFailure(error);
  if (!data) return fail("Project not found.");

  revalidatePublic();
  const messages = {
    published: "Project published — it is now live on the website.",
    draft: "Project unpublished and returned to draft.",
    archived: "Project archived and removed from the website.",
  } as const;
  return succeed(messages[parsedStatus.data]);
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return fail("Invalid project.");

  const { supabase } = admin;

  const { data: images } = await supabase
    .from("project_images")
    .select("storage_path")
    .eq("project_id", parsedId.data);

  const paths = (images ?? []).map((i) => i.storage_path as string);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(BUCKETS.projects).remove(paths);
    if (storageError) console.error("[projects] storage cleanup failed:", storageError.message);
  }

  const { error } = await supabase.from("projects").delete().eq("id", parsedId.data);
  if (error) return dbFailure(error);

  revalidatePublic();
  return succeed("Project deleted.");
}
