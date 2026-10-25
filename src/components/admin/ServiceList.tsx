"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { deleteService, moveService, setServiceStatus } from "@/actions/services";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Notice } from "@/components/ui/Notice";
import type { Service } from "@/types";
import { useRunAction } from "./hooks";
import { StatusBadge } from "./StatusBadge";

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <ul className="space-y-4">
      {services.map((service, index) => (
        <ServiceRow
          key={service.id}
          service={service}
          isFirst={index === 0}
          isLast={index === services.length - 1}
        />
      ))}
    </ul>
  );
}

function ServiceRow({
  service,
  isFirst,
  isLast,
}: {
  service: Service;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { run, pending, notice } = useRunAction();
  const published = service.status === "published";

  return (
    <li className="admin-card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-medium">{service.title}</h2>
          <p className="text-sm text-ink/60">/services/{service.slug}</p>
        </div>
        <StatusBadge status={service.status} />
      </div>
      {service.summary && <p className="text-sm text-ink/70">{service.summary}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/admin/services/${service.id}`} className="btn-dark btn-sm">
          Edit
        </Link>
        <button
          type="button"
          className="btn-outline btn-sm"
          disabled={pending}
          onClick={() => run(() => setServiceStatus(service.id, published ? "draft" : "published"))}
        >
          {published ? "Unpublish" : "Publish"}
        </button>
        <span className="grow" />
        <button
          type="button"
          className="btn-outline btn-sm"
          aria-label={`Move ${service.title} up`}
          disabled={pending || isFirst}
          onClick={() => run(() => moveService(service.id, "up"))}
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className="btn-outline btn-sm"
          aria-label={`Move ${service.title} down`}
          disabled={pending || isLast}
          onClick={() => run(() => moveService(service.id, "down"))}
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
        </button>
        <ConfirmButton
          label="Delete"
          title={`Delete “${service.title}”?`}
          description="This service will be permanently removed from the website and dashboard."
          onConfirm={() => run(() => deleteService(service.id))}
          disabled={pending}
        />
      </div>
      <Notice state={notice} />
    </li>
  );
}
