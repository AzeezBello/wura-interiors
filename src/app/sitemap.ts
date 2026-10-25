import type { MetadataRoute } from "next";
import {
  getPublishedProjects,
  getPublishedServices,
  getStoreProducts,
} from "@/lib/data";
import { siteUrl } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, products] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getStoreProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/store",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/portfolio/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const storeRoutes: MetadataRoute.Sitemap = products.map((item) => ({
    url: `${siteUrl}/store/${item.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...storeRoutes];
}
