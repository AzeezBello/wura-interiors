import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        title="New service"
        actions={
          <Link href="/admin/services" className="btn-outline">
            Cancel
          </Link>
        }
      />
      <ServiceForm />
    </>
  );
}
