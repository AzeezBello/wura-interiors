import { Clock, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Wura Interiors on WhatsApp for interior design consultations and bespoke furniture orders.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const social = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Facebook", href: settings.facebook_url },
    { label: "TikTok", href: settings.tiktok_url },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

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
            eyebrow="Contact & Consultations"
            title="Start a conversation"
            description="Whether you are commissioning a full residence, fitting out an executive workplace, or ordering a bespoke piece from our Store, our team is ready to assist."
            tone="dark"
          />
        </div>
      </section>

      <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        {/* Primary Enquiry Card */}
        <div className="surface-card p-8 sm:p-12 lg:col-span-7">
          <p className="eyebrow">Direct Studio Channel</p>
          <h2 className="mt-3 text-3xl font-medium sm:text-4xl">
            Enquire via WhatsApp
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/75">
            WhatsApp is the fastest way to reach our design team. Share your project location, approximate timeline, or the Store pieces you are interested in, and we will respond promptly.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border border-ink/10 bg-ivory p-5">
              <h3 className="text-xl font-medium">Interior Design Brief</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">
                Residential homes, penthouses, executive offices, and hospitality spaces.
              </p>
              <div className="mt-5">
                <WhatsAppButton
                  number={settings.whatsapp_number}
                  message={`Hello ${settings.business_name}, I would like to schedule an interior design consultation.`}
                  label="Discuss a Space"
                  variant="dark"
                  className="w-full"
                />
              </div>
            </div>

            <div className="border border-ink/10 bg-ivory p-5">
              <h3 className="text-xl font-medium">Store &amp; Bespoke Pieces</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">
                Custom dimensions, timber/stone swatches, and white-glove delivery quotes.
              </p>
              <div className="mt-5">
                <WhatsAppButton
                  number={settings.whatsapp_number}
                  message={`Hello ${settings.business_name}, I would like to enquire about ordering furniture from the Wura Store.`}
                  label="Furniture Enquiry"
                  variant="gold"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {settings.whatsapp_number && (
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-ink/55">
              Direct WhatsApp line: {settings.whatsapp_number}
            </p>
          )}
        </div>

        {/* Studio Details */}
        <div className="space-y-8 lg:col-span-5">
          <div className="surface-card p-8">
            <p className="eyebrow">Atelier Details</p>
            <h2 className="mt-3 text-3xl font-medium">Studio &amp; Showroom</h2>

            <ul className="mt-6 space-y-5 text-sm text-ink/80">
              {settings.email && (
                <li className="flex gap-3.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                      Email
                    </p>
                    <a href={`mailto:${settings.email}`} className="mt-0.5 block hover:text-gold-dark">
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}
              {settings.phone && (
                <li className="flex gap-3.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                      Telephone
                    </p>
                    <a
                      href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                      className="mt-0.5 block hover:text-gold-dark"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex gap-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                    Locations
                  </p>
                  <p className="mt-0.5 whitespace-pre-line">
                    {settings.address ?? "Lagos & Abuja\nPrivate studio visits by appointment"}
                  </p>
                </div>
              </li>
              <li className="flex gap-3.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                    Consultation Hours
                  </p>
                  <p className="mt-0.5">Monday – Saturday · 9:00 AM – 6:00 PM WAT</p>
                </div>
              </li>
              {social.length > 0 && (
                <li className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-4">
                  {social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:text-gold-dark"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>

          <div className="border border-gold/40 bg-ink p-8 text-ivory">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-gold" aria-hidden />
              <h3 className="text-2xl font-medium">Looking for ready pieces?</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ivory/75">
              Browse our curated collection of dining tables, bouclé seating, travertine tables, and lighting in the Wura Store.
            </p>
            <Link href="/store" className="btn-outline-light mt-6 w-full">
              Browse the Store
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
