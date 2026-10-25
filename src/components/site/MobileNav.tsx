"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-1 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-gold",
              active ? "text-gold" : "text-ivory/80",
            )}
          >
            {link.label}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px bg-gold"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory hover:border-gold hover:text-gold"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-t border-gold/25 bg-ink px-5 pb-8 pt-3 shadow-2xl"
        >
          <ul className="divide-y divide-ivory/10">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between py-4 font-display text-2xl transition-colors hover:text-gold",
                      active ? "text-gold" : "text-ivory",
                    )}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-gold">
                        Current
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
