"use server";

import { z } from "zod";
import {
  UNAUTHORISED,
  dbFailure,
  fail,
  parseInput,
  revalidatePublic,
  succeed,
  type ActionResult,
} from "@/lib/action-helpers";
import { getAdmin } from "@/lib/auth";
import { BUCKETS } from "@/lib/env";
import { moveRow } from "@/lib/reorder";
import { imageDetailsSchema, uuidSchema } from "@/lib/validation";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

const uploadedImageSchema = z.object({
  path: z.string().max(200),
  width: z.number().int().positive().max(20000).nullable(),
  height: z.number().int().positive().max(20000).nullable(),
});

/**
 * Called after the browser has uploaded files straight to the storage bucket
 * (storage policies already restrict that to administrators). Registers the
 * files against the project. Paths are validated so a project can only claim
 * files that live under its own folder.
 */
export async function addProjectImages(
  projectId: string,
  uploads: { path: string; width: number | null; height: number | null }[],
): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const id = uuidSchema.safeParse(projectId);
  const items = z.array(uploadedImageSchema).min(1).max(40).safeParse(uploads);
  if (!id.success || !items.success) return fail("Invalid upload.");

  const pathPattern = new RegExp(`^projects/${id.data}/${UUID}\\.(jpg|jpeg|png|webp|avif)$`);
  if (!items.data.every((i) => pathPattern.test(i.path))) return fail("Invalid file path.");

  const { supabase } = admin;

  const { data: project } = await supabase.from("projects").select("id").eq("id", id.data).maybeSingle();
  if (!project) return fail("Project not found.");

  const { data: existing } = await supabase
    .from("project_images")
    .select("sort_order,is_cover")
    .eq("project_id", id.data);

  const maxOrder = (existing ?? []).reduce((m, r) => Math.max(m, r.sort_order as number), -1);
  const hasCover = (existing ?? []).some((r) => r.is_cover);

  const rows = items.data.map((item, index) => ({
    project_id: id.data,
    storage_path: item.path,
    width: item.width,
    height: item.height,
    sort_order: maxOrder + 1 + index,
    is_cover: !hasCover && index === 0,
  }));

  const { error } = await supabase.from("project_images").insert(rows);
  if (error) {
    // Don't leave orphaned files behind.
    await supabase.storage.from(BUCKETS.projects).remove(items.data.map((i) => i.path));
    return dbFailure(error);
  }

  revalidatePublic();
  return succeed(`${rows.length} image${rows.length === 1 ? "" : "s"} added.`);
}

export async function updateImageDetails(
  imageId: string,
  details: { caption: string; alt_text: string },
): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const id = uuidSchema.safeParse(imageId);
  if (!id.success) return fail("Invalid image.");

  const parsed = parseInput(imageDetailsSchema, details);
  if (parsed.error) return parsed.error;

  const { data, error } = await admin.supabase
    .from("project_images")
    .update(parsed.data)
    .eq("id", id.data)
    .select("id")
    .maybeSingle();

  if (error) return dbFailure(error);
  if (!data) return fail("Image not found.");

  revalidatePublic();
  return succeed("Image details saved.");
}

export async function moveImage(
  projectId: string,
  imageId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const pid = uuidSchema.safeParse(projectId);
  const iid = uuidSchema.safeParse(imageId);
  if (!pid.success || !iid.success || (direction !== "up" && direction !== "down")) {
    return fail("Invalid request.");
  }

  const result = await moveRow(admin.supabase, "project_images", iid.data, direction, {
    column: "project_id",
    value: pid.data,
  });
  if (!result.ok) return fail(result.error ?? "Could not reorder images.");

  revalidatePublic();
  return succeed();
}

export async function setCoverImage(projectId: string, imageId: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const pid = uuidSchema.safeParse(projectId);
  const iid = uuidSchema.safeParse(imageId);
  if (!pid.success || !iid.success) return fail("Invalid request.");

  const { supabase } = admin;

  const { data: image } = await supabase
    .from("project_images")
    .select("id")
    .eq("id", iid.data)
    .eq("project_id", pid.data)
    .maybeSingle();
  if (!image) return fail("Image not found.");

  const cleared = await supabase
    .from("project_images")
    .update({ is_cover: false })
    .eq("project_id", pid.data)
    .eq("is_cover", true);
  if (cleared.error) return dbFailure(cleared.error);

  const { error } = await supabase
    .from("project_images")
    .update({ is_cover: true })
    .eq("id", iid.data);
  if (error) return dbFailure(error);

  revalidatePublic();
  return succeed("Cover image updated.");
}

export async function deleteImage(imageId: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return UNAUTHORISED;

  const iid = uuidSchema.safeParse(imageId);
  if (!iid.success) return fail("Invalid image.");

  const { supabase } = admin;

  const { data: image } = await supabase
    .from("project_images")
    .select("id,project_id,storage_path,is_cover")
    .eq("id", iid.data)
    .maybeSingle();
  if (!image) return fail("Image not found.");

  const { data: siblings } = await supabase
    .from("project_images")
    .select("id")
    .eq("project_id", image.project_id)
    .order("sort_order");
  const remaining = (siblings ?? []).filter((s) => s.id !== image.id);

  if (remaining.length === 0) {
    const { data: project } = await supabase
      .from("projects")
      .select("status")
      .eq("id", image.project_id)
      .maybeSingle();
    if (project?.status === "published") {
      return fail("A published project needs at least one image. Unpublish it before removing the last image.");
    }
  }

  const { error } = await supabase.from("project_images").delete().eq("id", image.id);
  if (error) return dbFailure(error);

  const { error: storageError } = await supabase.storage
    .from(BUCKETS.projects)
    .remove([image.storage_path as string]);
  if (storageError) console.error("[images] storage cleanup failed:", storageError.message);

  if (image.is_cover && remaining.length > 0) {
    await supabase.from("project_images").update({ is_cover: true }).eq("id", remaining[0].id);
  }

  revalidatePublic();
  return succeed("Image deleted.");
}
