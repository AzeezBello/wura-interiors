"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/actions/projects";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/fields";
import { Notice } from "@/components/ui/Notice";
import { slugify } from "@/lib/utils";
import type { Category, Project } from "@/types";
import { useActionForm } from "./hooks";

export function ProjectForm({
  project,
  categories,
}: {
  project?: Project;
  categories: Category[];
}) {
  const { state, pending, onSubmit } = useActionForm(project ? updateProject : createProject);
  const errors = state?.fieldErrors ?? {};

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  return (
    <form onSubmit={onSubmit} className="admin-card space-y-6" noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Title"
          name="title"
          required
          maxLength={140}
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
          hint={`Web address: /portfolio/${slug || "your-project"}`}
          errors={errors.slug}
        />
      </div>

      <TextField
        label="Short summary"
        name="summary"
        maxLength={300}
        defaultValue={project?.summary ?? ""}
        hint="Optional. One or two sentences shown at the top of the project page and in search results."
        errors={errors.summary}
      />

      <TextAreaField
        label="Description"
        name="description"
        rows={8}
        maxLength={10000}
        defaultValue={project?.description ?? ""}
        hint="Optional. Only add details the client has approved. Leave a blank line between paragraphs."
        errors={errors.description}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <SelectField
          label="Category"
          name="category_id"
          defaultValue={project?.category_id ?? ""}
          errors={errors.category_id}
          hint={categories.length === 0 ? "Create categories first (Categories page)." : undefined}
        >
          <option value="">Uncategorised</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <TextField
          label="Location"
          name="location"
          maxLength={120}
          defaultValue={project?.location ?? ""}
          hint="Optional"
          errors={errors.location}
        />
        <TextField
          label="Completion date"
          name="completed_on"
          type="date"
          defaultValue={project?.completed_on ?? ""}
          hint="Optional"
          errors={errors.completed_on}
        />
      </div>

      <CheckboxField
        label="Feature on the home page"
        name="featured"
        defaultChecked={project?.featured ?? false}
        hint="Featured projects are shown first in the home page selection."
      />

      <Notice state={state} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-dark" disabled={pending}>
          {pending ? "Saving…" : project ? "Save changes" : "Create draft & add images"}
        </button>
        {!project && (
          <p className="text-sm text-ink/60">You can upload photographs on the next screen.</p>
        )}
      </div>
    </form>
  );
}
