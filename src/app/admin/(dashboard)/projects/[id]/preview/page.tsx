import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/data";
import { uuidSchema } from "@/lib/validation";
import type { ProjectWithRelations, SiteSettings } from "@/types";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Preview project" };

/**
 * Renders the real public project template with draft data. It runs as the
 * signed-in administrator, so row-level security lets it read unpublished work;
 * the public site can never reach this route.
 */
export default async function PreviewProjectPage({ params }: Props) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();

  const [{ data: project }, { data: settings }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, category:categories(name,slug), images:project_images(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (!project) notFound();

  const typed = project as unknown as ProjectWithRelations;
  typed.images = [...typed.images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="-mx-5 -my-8 sm:-mx-8 lg:-mx-12">
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 bg-gold px-5 py-3 text-sm text-ink">
        <p className="flex items-center gap-3">
          <strong>Preview</strong> <StatusBadge status={typed.status} />
          <span>This is how the project page will look to visitors.</span>
        </p>
        <Link href={`/admin/projects/${typed.id}`} className="underline underline-offset-4">
          Back to editor
        </Link>
      </div>
      <div className="bg-ivory">
        <ProjectDetail project={typed} settings={{ ...DEFAULT_SETTINGS, ...(settings as Partial<SiteSettings>) }} />
      </div>
    </div>
  );
}
