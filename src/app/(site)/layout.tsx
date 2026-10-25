import { CartProvider } from "@/components/site/CartProvider";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <CartProvider
      businessName={settings.business_name}
      whatsappNumber={settings.whatsapp_number}
    >
      <a
        href="#main"
        className="sr-only z-50 bg-gold px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </CartProvider>
  );
}
