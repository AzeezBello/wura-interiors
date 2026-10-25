import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { uuidSchema } from "@/lib/validation";
import type { Service } from "@/types";

export const metadata = { title: "Edit service" };

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const service = data as Service;

  return (
    <>
      <PageHeader
        title={service.title}
        actions={
          <>
            <StatusBadge status={service.status} />
            <Link href="/admin/services" className="btn-outline btn-sm">
              All services
            </Link>
          </>
        }
      />
      <ServiceForm service={service} />
    </>
  );
}
