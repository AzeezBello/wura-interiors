import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getPortfolioCategories, getPublishedProjects, getSiteSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = { searchParams: Promise<{ category?: string }> };

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected interior design and furniture projects by Wura Interiors.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const categorySlug = typeof category === "string" ? category : undefined;

  const [categories, allProjects, projects, settings] = await Promise.all([
    getPortfolioCategories(),
    getPublishedProjects(),
    getPublishedProjects(categorySlug),
    getSiteSettings(),
  ]);

  const active = categories.find((c) => c.slug === categorySlug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/25 bg-ink pb-20 pt-16 text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(209,173,97,0.14),transparent_55%)]"
        />
        <div className="container-page relative">
          <SectionHeading
            as="h1"
            eyebrow="Portfolio"
            title="Selected architectural & interior works"
            description="Completed residential, commercial, bespoke furniture, and hospitality commissions across Lagos and Abuja."
            tone="dark"
          />
        </div>
      </section>

      <div className="container-page py-16 lg:py-24">
        {categories.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <nav aria-label="Filter projects by category" className="flex flex-wrap gap-2.5">
              <FilterLink href="/portfolio" active={!active} count={allProjects.length}>
                All Works
              </FilterLink>
              {categories.map((c) => {
                const count = allProjects.filter((p) => p.category?.slug === c.slug).length;
                return (
                  <FilterLink
                    key={c.id}
                    href={`/portfolio?category=${encodeURIComponent(c.slug)}`}
                    active={active?.id === c.id}
                    count={count}
                  >
                    {c.name}
                  </FilterLink>
                );
              })}
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/55">
              Showing {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
        )}

        {projects.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} priority={i < 2} />
            ))}
          </div>
        ) : categorySlug ? (
          <EmptyState title="No projects in this category yet">
            <Link href="/portfolio" className="underline underline-offset-4 hover:text-gold-dark">
              View all projects
            </Link>
          </EmptyState>
        ) : (
          <EmptyState title="Our portfolio is being prepared">
            Completed projects will be shown here soon.
          </EmptyState>
        )}

        <div className="mt-24 grid items-center gap-10 border border-gold/40 bg-ink p-8 text-ivory sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow-on-dark">Start Your Project</p>
            <h2 className="mt-3 text-3xl font-medium sm:text-4xl">
              Have a residence or commercial space in mind?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/75">
              Share your architectural plans or schedule a private consultation with our design team, or browse individual furniture pieces in our Store.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <WhatsAppButton
              number={settings.whatsapp_number}
              message={`Hello ${settings.business_name}, I would like to discuss a project.`}
            />
            <Link href="/store" className="btn-outline-light">
              Visit Store <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterLink({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all",
        active
          ? "border-ink bg-ink text-gold shadow-sm"
          : "border-ink/20 bg-ivory-light text-ink/80 hover:border-gold-dark hover:text-gold-dark",
      )}
    >
      <span>{children}</span>
      <span className={cn("text-[0.65rem]", active ? "text-ivory/75" : "text-ink/45")}>
        ({count})
      </span>
    </Link>
  );
}
