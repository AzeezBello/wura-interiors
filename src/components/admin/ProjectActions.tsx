"use client";

import { Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProject, setProjectStatus } from "@/actions/projects";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Notice } from "@/components/ui/Notice";
import type { ProjectStatus } from "@/types";
import { useRunAction } from "./hooks";

export function ProjectActions({
  projectId,
  slug,
  status,
}: {
  projectId: string;
  slug: string;
  status: ProjectStatus;
}) {
  const router = useRouter();
  const { run, pending, notice } = useRunAction();

  const change = (next: ProjectStatus) => run(() => setProjectStatus(projectId, next));

  return (
    <section className="admin-card space-y-4" aria-labelledby="publishing">
      <h2 id="publishing" className="text-2xl font-medium">
        Publishing
      </h2>
      <p className="text-sm text-ink/70">
        {status === "published" && "This project is live on the website."}
        {status === "draft" && "This project is a draft and is not visible to the public."}
        {status === "archived" && "This project is archived and is not visible to the public."}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {status !== "published" && status !== "archived" && (
          <button type="button" className="btn-gold" disabled={pending} onClick={() => change("published")}>
            Publish
          </button>
        )}
        {status === "published" && (
          <button type="button" className="btn-outline" disabled={pending} onClick={() => change("draft")}>
            Unpublish
          </button>
        )}
        {status === "archived" && (
          <button type="button" className="btn-outline" disabled={pending} onClick={() => change("draft")}>
            Restore to draft
          </button>
        )}
        {status !== "archived" && (
          <ConfirmButton
            label="Archive"
            className="btn-outline"
            title="Archive this project?"
            description="It will be removed from the public website. You can restore it to draft at any time."
            confirmLabel="Archive"
            disabled={pending}
            onConfirm={() => change("archived")}
          />
        )}

        <Link href={`/admin/projects/${projectId}/preview`} className="btn-outline">
          <Eye className="h-4 w-4" aria-hidden /> Preview
        </Link>
        {status === "published" && (
          <Link href={`/portfolio/${slug}`} target="_blank" className="btn-outline">
            <ExternalLink className="h-4 w-4" aria-hidden /> View live
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
        )}

        <span className="grow" />

        <ConfirmButton
          label="Delete project"
          title="Delete this project permanently?"
          description="The project and all of its uploaded images will be permanently deleted. This cannot be undone."
          onConfirm={() =>
            run(
              async () => {
                const result = await deleteProject(projectId);
                if (result.ok) router.push("/admin/projects");
                return result;
              },
              { refresh: false },
            )
          }
        />
      </div>

      <Notice state={notice} />
    </section>
  );
}
