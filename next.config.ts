import path from "node:path";
import type { NextConfig } from "next";

/**
 * Allow next/image to optimise photographs served from this project's Supabase
 * public storage buckets. The host is derived from NEXT_PUBLIC_SUPABASE_URL.
 */
function supabaseImagePattern() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return {
      protocol: "https" as const,
      hostname: "**.supabase.co",
      pathname: "/storage/v1/object/public/**",
    };
  }
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [supabaseImagePattern()],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
