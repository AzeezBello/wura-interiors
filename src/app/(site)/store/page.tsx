import { Hammer, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import {
  getSiteSettings,
  getStoreCategories,
  getStoreProducts,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = { searchParams: Promise<{ category?: string }> };

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Store — Collectible Furniture, Lighting & Objects",
  description:
    "Shop bespoke and ready-to-ship furniture, lighting, and architectural objects crafted by Wura Interiors in African walnut, travertine, linen, and brass.",
  alternates: { canonical: "/store" },
};

const STORE_PILLARS = [
  {
    icon: Hammer,
    title: "Atelier Crafted",
    text: "Built in small batches and to order by master joiners and metalworkers.",
  },
  {
    icon: Sparkles,
    title: "Honest Materials",
    text: "Kiln-dried African walnut, iroko, honed travertine, Belgian linen, and solid brass.",
  },
  {
    icon: Truck,
    title: "White-Glove Delivery",
    text: "Careful nationwide delivery, placement, and assembly by our installation team.",
  },
  {
    icon: ShieldCheck,
    title: "Custom Dimensions",
    text: "Need a specific size or timber finish? Every piece can be tailored to your room.",
  },
];

export default async function StorePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = typeof category === "string" ? category : undefined;

  const [categories, allProducts, filteredProducts, settings] = await Promise.all([
    getStoreCategories(),
    getStoreProducts(),
    getStoreProducts(activeCategory),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-gold/25 bg-ink pb-20 pt-16 text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(209,173,97,0.14),transparent_55%)]"
        />
        <div className="container-page relative">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionHeading
                as="h1"
                eyebrow="The Wura Collection"
                title="Collectible furniture, lighting & objects"
                description="Heirloom-grade pieces designed in our studio and crafted from solid West African hardwoods, honed natural stone, and unlacquered brass."
                tone="dark"
              />
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-gold">
                {allProducts.length} Edition Pieces Available
              </p>
              <p className="mt-2 text-sm text-ivory/70">
                Add pieces to your selection bag or enquire directly for custom dimensions and trade pricing.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 border-t border-ivory/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {STORE_PILLARS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3.5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
                    {title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-ivory/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter + Product Grid */}
      <section className="container-page py-16 lg:py-24">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
          <nav aria-label="Filter store products by category" className="flex flex-wrap gap-2.5">
            <StoreFilterLink
              href="/store"
              active={!activeCategory}
              count={allProducts.length}
            >
              All Pieces
            </StoreFilterLink>
            {categories.map((cat) => {
              const count = allProducts.filter((p) => p.category === cat).length;
              const isActive =
                activeCategory?.toLowerCase() === cat.toLowerCase();
              return (
                <StoreFilterLink
                  key={cat}
                  href={`/store?category=${encodeURIComponent(cat)}`}
                  active={isActive}
                  count={count}
                >
                  {cat}
                </StoreFilterLink>
              );
            })}
          </nav>

          <p className="text-xs uppercase tracking-[0.2em] text-ink/55">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 2}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No pieces found in this category">
            <Link
              href="/store"
              className="underline underline-offset-4 hover:text-gold-dark"
            >
              View all collection pieces
            </Link>
          </EmptyState>
        )}

        {/* Bespoke Commission Banner */}
        <div className="mt-24 grid items-center gap-10 border border-gold/40 bg-ink p-8 text-ivory sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow-on-dark">Bespoke &amp; Trade Commissions</p>
            <h2 className="mt-3 text-3xl font-medium sm:text-4xl">
              Need a custom dimension, timber species, or fabric?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/75">
              Every piece in the Wura Collection can be tailored to the exact proportions of your room. Share your floor plan or finish preferences with our design team for a custom quotation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <WhatsAppButton
              number={settings.whatsapp_number}
              message={`Hello ${settings.business_name}, I would like to enquire about a custom furniture commission from the Wura Store.`}
              label="Enquire on WhatsApp"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function StoreFilterLink({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all",
        active
          ? "border-ink bg-ink text-gold shadow-sm"
          : "border-ink/20 bg-ivory-light text-ink/80 hover:border-gold-dark hover:text-gold-dark",
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "text-[0.65rem]",
          active ? "text-ivory/75" : "text-ink/45",
        )}
      >
        ({count})
      </span>
    </Link>
  );
}
