import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth";
import type { Category } from "@/types";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order").order("name");

  return (
    <>
      <PageHeader
        title="New project"
        description="Projects start as drafts and stay hidden until you publish them."
        actions={
          <Link href="/admin/projects" className="btn-outline">
            Cancel
          </Link>
        }
      />
      <ProjectForm categories={(data ?? []) as Category[]} />
    </>
  );
}
