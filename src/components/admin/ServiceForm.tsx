"use client";

import { useState } from "react";
import { createService, updateService } from "@/actions/services";
import { SelectField, TextAreaField, TextField } from "@/components/ui/fields";
import { Notice } from "@/components/ui/Notice";
import { slugify } from "@/lib/utils";
import type { Service } from "@/types";
import { useActionForm } from "./hooks";

export function ServiceForm({ service }: { service?: Service }) {
  const { state, pending, onSubmit } = useActionForm(service ? updateService : createService);
  const errors = state?.fieldErrors ?? {};

  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(service));

  return (
    <form onSubmit={onSubmit} className="admin-card space-y-6" noValidate>
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Service name"
          name="title"
          required
          maxLength={120}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          errors={errors.title}
        />
        <TextField
          label="URL slug"
          name="slug"
          required
          maxLength={80}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          hint={`Web address: /services/${slug || "your-service"}`}
          errors={errors.slug}
        />
      </div>

      <TextField
        label="Short summary"
        name="summary"
        maxLength={300}
        defaultValue={service?.summary ?? ""}
        hint="Shown on the services list. Only include what the client has confirmed they offer."
        errors={errors.summary}
      />

      <TextAreaField
        label="Full description"
        name="description"
        rows={9}
        maxLength={10000}
        defaultValue={service?.description ?? ""}
        hint="Optional. Leave a blank line between paragraphs. Do not add claims the client has not approved."
        errors={errors.description}
      />

      <SelectField
        label="Status"
        name="status"
        defaultValue={service?.status ?? "draft"}
        errors={errors.status}
        hint="Drafts are not shown on the website."
        className="max-w-xs"
      >
        <option value="draft">Draft (hidden)</option>
        <option value="published">Published (visible)</option>
      </SelectField>

      <Notice state={state} />

      <button type="submit" className="btn-dark" disabled={pending}>
        {pending ? "Saving…" : service ? "Save changes" : "Create service"}
      </button>
    </form>
  );
}
