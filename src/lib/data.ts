import { cache } from "react";
import {
  SAMPLE_CATEGORIES,
  SAMPLE_PRODUCTS,
  SAMPLE_PROJECTS,
  SAMPLE_SERVICES,
  SAMPLE_SETTINGS,
  STORE_CATEGORIES,
} from "@/lib/sample-data";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Category,
  ProjectWithRelations,
  Service,
  SiteSettings,
  StoreCategory,
  StoreProduct,
} from "@/types";

/**
 * Public data access. Everything here uses the anonymous client, so row-level
 * security guarantees only published content can ever be returned. When
 * Supabase is not yet configured or no published rows exist yet, curated
 * portfolio projects, services, and site copy are returned so the site and
 * portfolio render with complete visual imagery out of the box.
 */

export const DEFAULT_SETTINGS: SiteSettings = SAMPLE_SETTINGS;

const PROJECT_SELECT =
  "*, category:categories(name,slug), images:project_images(*)";

function sortImages(project: ProjectWithRelations): ProjectWithRelations {
  return {
    ...project,
    images: [...(project.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

function filterSampleProjects(categorySlug?: string): ProjectWithRelations[] {
  const list = categorySlug
    ? SAMPLE_PROJECTS.filter((p) => p.category?.slug === categorySlug)
    : SAMPLE_PROJECTS;
  return list.map(sortImages);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[data] site_settings:", error.message);
    return DEFAULT_SETTINGS;
  }

  const row = data as Partial<SiteSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...row,
    tagline: row.tagline ?? DEFAULT_SETTINGS.tagline,
    about_story: row.about_story ?? DEFAULT_SETTINGS.about_story,
    design_philosophy: row.design_philosophy ?? DEFAULT_SETTINGS.design_philosophy,
  };
});

export const getPublishedProjects = cache(
  async (categorySlug?: string): Promise<ProjectWithRelations[]> => {
    const supabase = createPublicClient();
    if (!supabase) return filterSampleProjects(categorySlug);

    let categoryId: string | null = null;
    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (!category) {
        const { count } = await supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("status", "published");
        return (count ?? 0) === 0 ? filterSampleProjects(categorySlug) : [];
      }
      categoryId = category.id as string;
    }

    let query = supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, error } = await query;
    if (error) {
      console.error("[data] projects:", error.message);
      return filterSampleProjects(categorySlug);
    }

    const rows = ((data ?? []) as unknown as ProjectWithRelations[]).map(sortImages);
    if (rows.length === 0 && !categorySlug) {
      return filterSampleProjects();
    }
    return rows;
  },
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectWithRelations | null> => {
    const supabase = createPublicClient();
    if (!supabase) {
      const sample = SAMPLE_PROJECTS.find((p) => p.slug === slug);
      return sample ? sortImages(sample) : null;
    }

    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("[data] project:", error.message);
    }
    if (data) {
      return sortImages(data as unknown as ProjectWithRelations);
    }

    const sample = SAMPLE_PROJECTS.find((p) => p.slug === slug);
    return sample ? sortImages(sample) : null;
  },
);

/** Categories that currently contain at least one published project. */
export const getPortfolioCategories = cache(async (): Promise<Category[]> => {
  const supabase = createPublicClient();
  if (!supabase) return SAMPLE_CATEGORIES;

  const [{ data: categories }, { data: projects }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").order("name"),
    supabase.from("projects").select("category_id").eq("status", "published"),
  ]);

  const used = new Set((projects ?? []).map((p) => p.category_id as string | null));
  const active = ((categories ?? []) as Category[]).filter((c) => used.has(c.id));
  return active.length > 0 ? active : SAMPLE_CATEGORIES;
});

export const getPublishedServices = cache(async (): Promise<Service[]> => {
  const supabase = createPublicClient();
  if (!supabase) return SAMPLE_SERVICES;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order")
    .order("title");

  if (error) {
    console.error("[data] services:", error.message);
    return SAMPLE_SERVICES;
  }
  const rows = (data ?? []) as Service[];
  return rows.length > 0 ? rows : SAMPLE_SERVICES;
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const supabase = createPublicClient();
  if (!supabase) {
    return SAMPLE_SERVICES.find((s) => s.slug === slug) ?? null;
  }

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (data) return data as Service;
  return SAMPLE_SERVICES.find((s) => s.slug === slug) ?? null;
});

export function coverImage(project: ProjectWithRelations) {
  return project.images.find((i) => i.is_cover) ?? project.images[0] ?? null;
}

export const getStoreCategories = cache(async (): Promise<StoreCategory[]> => {
  return STORE_CATEGORIES;
});

export const getStoreProducts = cache(
  async (category?: string): Promise<StoreProduct[]> => {
    if (!category) return SAMPLE_PRODUCTS;
    return SAMPLE_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  },
);

export const getStoreProductBySlug = cache(
  async (slug: string): Promise<StoreProduct | null> => {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  },
);
