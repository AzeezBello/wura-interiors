import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/inter";
import "./globals.css";
import { siteUrl } from "@/lib/env";

const description =
  "Wura Interiors designs and furnishes residential and commercial spaces. Explore our portfolio and enquire on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wura Interiors — Interior design & furniture",
    template: "%s | Wura Interiors",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Wura Interiors",
    title: "Wura Interiors — Interior design & furniture",
    description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
