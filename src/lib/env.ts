// NEXT_PUBLIC_* variables must be referenced literally so Next.js can inline
// them into the browser bundle.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const BUCKETS = {
  projects: "project-images",
  brand: "brand-assets",
} as const;

export const IMAGE_LIMITS = {
  projectMaxBytes: 10 * 1024 * 1024,
  logoMaxBytes: 2 * 1024 * 1024,
  projectTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  logoTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
} as const;
