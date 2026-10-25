import { CategoryManager } from "@/components/admin/CategoryManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import type { Category } from "@/types";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();

  const [{ data: categories }, { data: projects }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").order("name"),
    supabase.from("projects").select("category_id"),
  ]);

  const usage: Record<string, number> = {};
  for (const p of projects ?? []) {
    const id = p.category_id as string | null;
    if (id) usage[id] = (usage[id] ?? 0) + 1;
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organise the portfolio. Categories are managed here — none are hard-coded."
      />
      <CategoryManager categories={(categories ?? []) as Category[]} usage={usage} />
    </>
  );
}
