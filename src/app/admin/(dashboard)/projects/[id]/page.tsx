import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageManager } from "@/components/admin/ImageManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectActions } from "@/components/admin/ProjectActions";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { projectImageUrl } from "@/lib/storage";
import { uuidSchema } from "@/lib/validation";
import type { Category, ProjectImage, ProjectWithRelations } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { created } = await searchParams;
  if (!uuidSchema.safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();

  const [{ data: project }, { data: categories }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, category:categories(name,slug), images:project_images(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("*").order("sort_order").order("name"),
  ]);

  if (!project) notFound();

  const typed = project as unknown as ProjectWithRelations;
  const images = [...typed.images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i: ProjectImage) => ({ ...i, url: projectImageUrl(i.storage_path) }));

  return (
    <>
      <PageHeader
        title={typed.title}
        description={`/portfolio/${typed.slug}`}
        actions={
          <>
            <StatusBadge status={typed.status} />
            <Link href="/admin/projects" className="btn-outline btn-sm">
              All projects
            </Link>
          </>
        }
      />

      {created && (
        <p role="status" className="mb-6 border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Draft created. Upload photographs below, then publish when you are ready.
        </p>
      )}

      <div className="space-y-8">
        <ProjectForm project={typed} categories={(categories ?? []) as Category[]} />
        <ImageManager projectId={typed.id} images={images} />
        <ProjectActions projectId={typed.id} slug={typed.slug} status={typed.status} />
      </div>
    </>
  );
}
