/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { brandAssetUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";

/**
 * Brand mark. Shows the uploaded official logo when one exists; otherwise a
 * text placeholder. The logo sits in a fixed-height box (object-contain), so a
 * real asset can replace the placeholder without any layout or design change.
 */
export function Logo({
  settings,
  className,
  asLink = true,
}: {
  settings: Pick<SiteSettings, "business_name" | "logo_path">;
  className?: string;
  asLink?: boolean;
}) {
  const mark = settings.logo_path ? (
    <img
      src={brandAssetUrl(settings.logo_path)}
      alt={settings.business_name}
      className="h-10 w-auto max-w-[200px] object-contain"
    />
  ) : (
    <span className="flex flex-col leading-none">
      <span className="font-display text-2xl font-semibold uppercase tracking-[0.32em] text-gold">
        Wura
      </span>
      <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.5em] text-ivory/80">
        Interiors
      </span>
    </span>
  );

  if (!asLink) return <span className={cn("inline-flex items-center", className)}>{mark}</span>;

  return (
    <Link
      href="/"
      aria-label={`${settings.business_name} — home`}
      className={cn("inline-flex h-10 items-center", className)}
    >
      {mark}
    </Link>
  );
}
