import Link from "next/link";
import { getSiteSettings, getStoreCategories } from "@/lib/data";
import { Logo } from "./Logo";
import { NAV_LINKS } from "./SiteHeader";
import { WhatsAppButton } from "./WhatsAppButton";

export async function SiteFooter() {
  const [settings, storeCategories] = await Promise.all([
    getSiteSettings(),
    getStoreCategories(),
  ]);
  const social = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Facebook", href: settings.facebook_url },
    { label: "TikTok", href: settings.tiktok_url },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-gold/25 bg-ink text-ivory/80">
      <div className="container-page grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo settings={settings} />
          {settings.tagline && (
            <p className="mt-5 max-w-sm font-display text-xl leading-relaxed text-ivory/90">
              {settings.tagline}
            </p>
          )}
          <div className="mt-8">
            <WhatsAppButton
              number={settings.whatsapp_number}
              message={`Hello ${settings.business_name}, I would like to make an enquiry.`}
              variant="outline-light"
            />
          </div>
        </div>

        <nav aria-label="Footer navigation" className="md:col-span-2 md:col-start-6">
          <h2 className="eyebrow-on-dark font-sans">Navigation</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Store categories" className="md:col-span-3">
          <h2 className="eyebrow-on-dark font-sans">The Store</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {storeCategories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/store?category=${encodeURIComponent(cat)}`}
                  className="transition-colors hover:text-gold"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow-on-dark font-sans">Atelier &amp; Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-gold">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.address ? (
              <li className="whitespace-pre-line text-ivory/70">{settings.address}</li>
            ) : (
              <li className="text-ivory/70">
                Lagos &amp; Abuja · Private consultations by appointment
              </li>
            )}
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:underline"
              >
                Book a Consultation →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.2em] text-gold/75">
            Interior Architecture · Bespoke Millwork · Collectible Furniture
          </p>
        </div>
      </div>
    </footer>
  );
}
