import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { coverImage, getProjectBySlug, getSiteSettings } from "@/lib/data";
import { projectImageUrl } from "@/lib/storage";
import { truncate } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const cover = coverImage(project);
  const description = truncate(
    project.summary ?? project.description?.replace(/\s+/g, " ") ?? project.title,
    155,
  );

  return {
    title: project.title,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: `/portfolio/${project.slug}`,
      images: cover ? [{ url: projectImageUrl(cover.storage_path), alt: cover.alt_text ?? project.title }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) notFound();

  return <ProjectDetail project={project} settings={settings} />;
}
