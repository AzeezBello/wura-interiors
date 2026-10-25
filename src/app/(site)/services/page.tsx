import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getPublishedServices, getSiteSettings } from "@/lib/data";
import { SERVICE_IMAGES, SITE_IMAGES } from "@/lib/sample-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description: "The interior design and furniture services offered by Wura Interiors.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getSiteSettings()]);

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
            eyebrow="Capabilities"
            title="Design, millwork & turnkey furnishing"
            description="Tailored interior architecture and custom furniture services for private residences, executive offices, and hospitality spaces."
            tone="dark"
          />
        </div>
      </section>

      <div className="container-page py-20 lg:py-28">
        {services.length > 0 ? (
          <ol className="space-y-12">
            {services.map((service, i) => {
              const img = SERVICE_IMAGES[service.slug] ?? {
                src: SITE_IMAGES.craftsmanship,
                alt: service.title,
              };
              const isPriority = i === 0;
              return (
                <li key={service.id} className="surface-card overflow-hidden">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid items-center gap-8 p-6 transition-colors hover:bg-ivory-dark/40 sm:p-8 lg:grid-cols-12"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/10 lg:col-span-5">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        priority={isPriority}
                        fetchPriority={isPriority ? "high" : undefined}
                        loading={isPriority ? undefined : "lazy"}
                        sizes="(min-width: 1024px) 38vw, 92vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="lg:col-span-6">
                      <span className="font-display text-3xl text-gold-dark">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-2 text-3xl font-medium group-hover:text-gold-dark sm:text-4xl">
                        {service.title}
                      </h2>
                      {service.summary && (
                        <p className="mt-4 leading-relaxed text-ink/75">{service.summary}</p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                        View Full Scope &amp; Deliverables
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                    <span className="hidden items-center lg:col-span-1 lg:flex lg:justify-end">
                      <ArrowRight
                        className="h-6 w-6 text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-gold-dark"
                        aria-label={`View ${service.title}`}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState title="Services coming soon">
            We are preparing our service descriptions. To talk about your project now, message us on
            WhatsApp.
          </EmptyState>
        )}

        <div className="mt-20 flex flex-wrap justify-center gap-4 text-center">
          <WhatsAppButton
            number={settings.whatsapp_number}
            message={`Hello ${settings.business_name}, I would like to ask about your services.`}
            variant="dark"
          />
          <Link href="/store" className="btn-outline">
            Shop Collectible Pieces
          </Link>
        </div>
      </div>
    </>
  );
}
