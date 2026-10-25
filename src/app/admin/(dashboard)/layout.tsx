import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side authorisation: verifies the session AND the admin profile.
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-ivory md:flex">
      <AdminSidebar email={profile.email} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
