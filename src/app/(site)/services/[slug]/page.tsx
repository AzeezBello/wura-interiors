import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { getServiceBySlug, getSiteSettings } from "@/lib/data";
import { SERVICE_IMAGES, SITE_IMAGES } from "@/lib/sample-data";
import { truncate } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: truncate(service.summary ?? service.description ?? service.title, 155),
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) notFound();

  const img = SERVICE_IMAGES[service.slug] ?? {
    src: SITE_IMAGES.craftsmanship,
    alt: service.title,
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-12 text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(209,173,97,0.14),transparent_55%)]"
        />
        <div className="container-page relative">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ivory/70 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All services
          </Link>
          <p className="eyebrow-on-dark mt-10">Service Scope</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-medium leading-[1.05] sm:text-6xl">
            {service.title}
          </h1>
          {service.summary && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/75">{service.summary}</p>
          )}
        </div>
      </section>

      <div className="container-page -mt-8">
        <div className="editorial-frame relative aspect-[16/9] w-full border border-gold/30">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container-page py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Overview</p>
            <h2 className="mt-3 text-3xl font-medium">How we deliver</h2>
          </div>
          <div className="lg:col-span-8">
            {service.description && (
              <div className="max-w-3xl text-lg leading-relaxed text-ink/80">
                <Paragraphs text={service.description} />
              </div>
            )}
            <div className="mt-12 flex flex-wrap gap-4">
              <WhatsAppButton
                number={settings.whatsapp_number}
                message={`Hello ${settings.business_name}, I would like to know more about your ${service.title} service.`}
                variant="dark"
              />
              <Link href="/portfolio" className="btn-outline">
                View Completed Projects <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
