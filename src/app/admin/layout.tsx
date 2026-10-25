import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Wura Dashboard" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
