"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  moveCategory,
  updateCategory,
} from "@/actions/categories";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { TextField } from "@/components/ui/fields";
import { Notice } from "@/components/ui/Notice";
import type { Category } from "@/types";
import { useActionForm, useRunAction } from "./hooks";

export function CategoryManager({
  categories,
  usage,
}: {
  categories: Category[];
  usage: Record<string, number>;
}) {
  return (
    <div className="space-y-8">
      <AddCategory />

      {categories.length === 0 ? (
        <div className="admin-card py-12 text-center">
          <h2 className="text-2xl font-medium">No categories yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
            Categories group your portfolio (for example by room or type of space). Add the ones
            that match the work you are showing. A category appears on the public filter once it
            contains a published project.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              count={usage[category.id] ?? 0}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddCategory() {
  const { state, pending, onSubmit, formRef } = useActionForm(createCategory, {
    resetOnSuccess: true,
  });
  const errors = state?.fieldErrors ?? {};

  return (
    <form ref={formRef} onSubmit={onSubmit} className="admin-card space-y-4" noValidate>
      <h2 className="text-2xl font-medium">Add a category</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          id="new-category-name"
          required
          maxLength={60}
          errors={errors.name}
        />
        <TextField
          label="URL slug"
          name="slug"
          id="new-category-slug"
          maxLength={80}
          hint="Optional — generated from the name if left blank."
          errors={errors.slug}
        />
      </div>
      <Notice state={state} />
      <button type="submit" className="btn-dark" disabled={pending}>
        {pending ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}

function CategoryRow({
  category,
  count,
  isFirst,
  isLast,
}: {
  category: Category;
  count: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { state, pending, onSubmit } = useActionForm(updateCategory);
  const { run, pending: moving, notice } = useRunAction();
  const errors = state?.fieldErrors ?? {};

  return (
    <li className="admin-card">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <input type="hidden" name="id" value={category.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            name="name"
            id={`name-${category.id}`}
            required
            maxLength={60}
            defaultValue={category.name}
            errors={errors.name}
          />
          <TextField
            label="URL slug"
            name="slug"
            id={`slug-${category.id}`}
            required
            maxLength={80}
            defaultValue={category.slug}
            hint={`${count} project${count === 1 ? "" : "s"} in this category`}
            errors={errors.slug}
          />
        </div>
        <Notice state={state ?? notice} />
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn-dark btn-sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </button>
          <span className="grow" />
          <button
            type="button"
            className="btn-outline btn-sm"
            aria-label={`Move ${category.name} up`}
            disabled={moving || isFirst}
            onClick={() => run(() => moveCategory(category.id, "up"))}
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className="btn-outline btn-sm"
            aria-label={`Move ${category.name} down`}
            disabled={moving || isLast}
            onClick={() => run(() => moveCategory(category.id, "down"))}
          >
            <ArrowDown className="h-4 w-4" aria-hidden />
          </button>
          <ConfirmButton
            label="Delete"
            title={`Delete “${category.name}”?`}
            description={
              count > 0
                ? `${count} project${count === 1 ? " is" : "s are"} in this category. They will be kept and become uncategorised.`
                : "This category has no projects. It will be permanently removed."
            }
            onConfirm={() => run(() => deleteCategory(category.id))}
            disabled={moving}
          />
        </div>
      </form>
    </li>
  );
}
