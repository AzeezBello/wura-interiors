import { BUCKETS, supabaseUrl } from "@/lib/env";

type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];

/** Public CDN URL for an object in one of the public buckets, or a local/external path. */
export function publicUrl(bucket: Bucket, path: string): string {
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encoded}`;
}

export const projectImageUrl = (path: string) => publicUrl(BUCKETS.projects, path);
export const brandAssetUrl = (path: string) => publicUrl(BUCKETS.brand, path);
