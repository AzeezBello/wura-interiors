import { getSiteSettings } from "@/lib/data";
import { CartTrigger } from "./CartProvider";
import { Logo } from "./Logo";
import { DesktopNav, MobileNav, type NavLink } from "./MobileNav";
import { WhatsAppButton } from "./WhatsAppButton";

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/store", label: "Store" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-ink/95 text-ivory backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Logo settings={settings} />
        <DesktopNav links={NAV_LINKS} />
        <div className="flex items-center gap-3">
          <CartTrigger />
          <WhatsAppButton
            number={settings.whatsapp_number}
            message={`Hello ${settings.business_name}, I would like to make an enquiry.`}
            label="Enquire"
            className="hidden px-5 py-2.5 sm:inline-flex"
          />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
