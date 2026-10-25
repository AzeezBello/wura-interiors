import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { projectImageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = { searchParams: Promise<{ status?: string }> };

const FILTERS = [
  { value: "", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  updated_at: string;
  category: { name: string } | null;
  images: { storage_path: string; is_cover: boolean; sort_order: number }[];
};

export default async function ProjectsPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const filter = FILTERS.some((f) => f.value === status) ? (status ?? "") : "";

  let query = supabase
    .from("projects")
    .select("id,title,slug,status,featured,updated_at,category:categories(name),images:project_images(storage_path,is_cover,sort_order)")
    .order("updated_at", { ascending: false });
  if (filter) query = query.eq("status", filter);

  const { data, error } = await query;
  const projects = (data ?? []) as unknown as Row[];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create, edit, publish and archive portfolio projects."
        actions={
          <Link href="/admin/projects/new" className="btn-dark">
            <Plus className="h-4 w-4" aria-hidden /> New project
          </Link>
        }
      />

      <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/projects?status=${f.value}` : "/admin/projects"}
            aria-current={filter === f.value ? "true" : undefined}
            className={cn(
              "border px-4 py-1.5 text-sm",
              filter === f.value ? "border-ink bg-ink text-ivory" : "border-ink/25 hover:border-ink",
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {error && (
        <p role="alert" className="mb-6 border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-900">
          Could not load projects. Please refresh the page.
        </p>
      )}

      {projects.length === 0 ? (
        <div className="admin-card py-16 text-center">
          <h2 className="text-2xl font-medium">
            {filter ? `No ${filter} projects` : "No projects yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
            {filter
              ? "Projects with this status will appear here."
              : "Create your first project, upload its photographs, then publish it to the website."}
          </p>
          {!filter && (
            <Link href="/admin/projects/new" className="btn-dark mt-6">
              <Plus className="h-4 w-4" aria-hidden /> Create the first project
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-ink/10 border border-ink/10 bg-white">
          {projects.map((p) => {
            const sorted = [...p.images].sort((a, b) => a.sort_order - b.sort_order);
            const cover = sorted.find((i) => i.is_cover) ?? sorted[0];
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-ivory/60"
                >
                  <span className="h-16 w-20 shrink-0 overflow-hidden bg-ink/10">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={projectImageUrl(cover.storage_path)} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.title}</span>
                    <span className="block truncate text-sm text-ink/60">
                      {p.category?.name ?? "Uncategorised"} · {p.images.length} image
                      {p.images.length === 1 ? "" : "s"}
                      {p.featured && " · Featured"}
                    </span>
                  </span>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
