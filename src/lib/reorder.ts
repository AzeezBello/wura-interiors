import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Moves a row one position up or down within an ordered table and rewrites
 * sort_order as a clean 0..n sequence (so duplicate / sparse values self-heal).
 */
export async function moveRow(
  supabase: SupabaseClient,
  table: "categories" | "services" | "project_images",
  id: string,
  direction: "up" | "down",
  scope?: { column: string; value: string },
): Promise<{ ok: boolean; error?: string }> {
  let query = supabase.from(table).select("id, sort_order").order("sort_order").order("created_at");
  if (scope) query = query.eq(scope.column, scope.value);

  const { data, error } = await query;
  if (error || !data) return { ok: false, error: error?.message ?? "Could not load items." };

  const rows = data as { id: string; sort_order: number }[];
  const index = rows.findIndex((r) => r.id === id);
  if (index === -1) return { ok: false, error: "Item not found." };

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= rows.length) return { ok: true }; // already at the edge

  [rows[index], rows[target]] = [rows[target], rows[index]];

  const results = await Promise.all(
    rows.map((row, position) =>
      row.sort_order === position
        ? Promise.resolve({ error: null })
        : supabase.from(table).update({ sort_order: position }).eq("id", row.id),
    ),
  );

  const failed = results.find((r) => r.error);
  return failed?.error ? { ok: false, error: failed.error.message } : { ok: true };
}
