import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { getSiteSettings } from "@/lib/data";
import { SITE_IMAGES } from "@/lib/sample-data";
import { truncate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "About",
    description: settings.about_story
      ? truncate(settings.about_story.replace(/\s+/g, " "), 155)
      : `About ${settings.business_name}.`,
    alternates: { canonical: "/about" },
  };
}

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Spatial Brief",
    text: "We begin with an in-depth walkthrough of your architectural drawings or existing space, understanding how light, circulation, and daily rituals shape your brief.",
  },
  {
    step: "02",
    title: "Material & Millwork Curation",
    text: "Our studio prepares scaled layouts, lighting plans, and physical sample boards of kiln-dried African walnut, honed travertine, brushed brass, and natural linens.",
  },
  {
    step: "03",
    title: "Atelier Fabrication",
    text: "Bespoke furniture, cabinetry, and architectural joinery are crafted to measure in our workshop alongside vetted specialist artisans.",
  },
  {
    step: "04",
    title: "White-Glove Installation",
    text: "We coordinate site execution, delivery, placement, and final styling so you step into a calm, finished space.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const hasContent = Boolean(
    settings.about_story || settings.design_philosophy || settings.founder_name || settings.founder_bio,
  );

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
            eyebrow="The Studio & Atelier"
            title={`About ${settings.business_name}`}
            description="An interior architecture studio and bespoke furniture house dedicated to warm minimalism, enduring materials, and quiet craftsmanship."
            tone="dark"
          />
        </div>
      </section>

      <div className="container-page py-20 lg:py-28">
        {hasContent ? (
          <div className="space-y-24">
            {settings.about_story && (
              <section className="grid items-center gap-12 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="editorial-frame relative aspect-[4/5] w-full border border-ink/10">
                    <Image
                      src={SITE_IMAGES.studio}
                      alt="Wura Interiors atelier table with travertine stone, brushed brass hardware, handwoven linen swatches, and walnut samples"
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(min-width: 1024px) 38vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <p className="eyebrow">Our Origins</p>
                  <h2 className="mt-3 text-4xl font-medium">Our story</h2>
                  <div className="mt-6 text-lg leading-relaxed text-ink/80">
                    <Paragraphs text={settings.about_story} />
                  </div>
                </div>
              </section>
            )}

            {settings.design_philosophy && (
              <section className="grid items-center gap-12 border-t border-gold/40 pt-24 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="eyebrow">Material Ethos</p>
                  <h2 className="mt-3 text-4xl font-medium">Design philosophy</h2>
                  <div className="mt-6 text-lg leading-relaxed text-ink/80">
                    <Paragraphs text={settings.design_philosophy} />
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="editorial-frame relative aspect-[4/5] w-full border border-ink/10">
                    <Image
                      src={SITE_IMAGES.craftsmanship}
                      alt="Macro detail of a sculpted solid African walnut armchair frame with precision brushed brass joinery"
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 38vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </section>
            )}

            {(settings.founder_name || settings.founder_bio) && (
              <section className="grid gap-10 border-t border-gold/40 pt-24 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow">Leadership</p>
                  {settings.founder_name && (
                    <h2 className="mt-3 text-3xl font-medium">{settings.founder_name}</h2>
                  )}
                </div>
                <div className="text-lg leading-relaxed text-ink/80 lg:col-span-8">
                  <Paragraphs text={settings.founder_bio} />
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-medium">Our story is coming soon</h2>
            <p className="mt-4 text-ink/70">
              We are putting the finishing touches on this page. In the meantime, feel free to get
              in touch.
            </p>
          </div>
        )}

        {/* Studio Process */}
        <section className="mt-24 border-t border-ink/15 pt-20">
          <SectionHeading
            eyebrow="How We Work"
            title="From concept to completion"
            description="Every interior and custom piece follows a structured four-stage studio process."
          />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((item) => (
              <li key={item.step} className="surface-card flex flex-col justify-between p-6">
                <div>
                  <span className="font-display text-3xl text-gold-dark">{item.step}</span>
                  <h3 className="mt-3 text-2xl font-medium text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-20 flex flex-wrap justify-center gap-4 text-center">
          <WhatsAppButton
            number={settings.whatsapp_number}
            message={`Hello ${settings.business_name}, I would like to make an enquiry.`}
            variant="dark"
          />
          <Link href="/store" className="btn-outline">
            Explore the Store <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}
