"use client";

import { updateSettings } from "@/actions/settings";
import { TextAreaField, TextField } from "@/components/ui/fields";
import { Notice } from "@/components/ui/Notice";
import type { SiteSettings } from "@/types";
import { useActionForm } from "./hooks";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { state, pending, onSubmit } = useActionForm(updateSettings);
  const errors = state?.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <fieldset className="admin-card space-y-6">
        <legend className="mb-1 text-2xl font-medium">Business &amp; contact</legend>
        <p className="-mt-3 text-sm text-ink/70">
          Leave a field empty until the client has confirmed it. Empty fields are simply not shown
          on the website.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Business name"
            name="business_name"
            required
            maxLength={100}
            defaultValue={settings.business_name}
            errors={errors.business_name}
          />
          <TextField
            label="Tagline"
            name="tagline"
            maxLength={160}
            defaultValue={settings.tagline ?? ""}
            hint="Optional. Shown under the home page headline."
            errors={errors.tagline}
          />
          <TextField
            label="WhatsApp number"
            name="whatsapp_number"
            type="tel"
            inputMode="tel"
            defaultValue={settings.whatsapp_number ?? ""}
            placeholder="+234 803 123 4567"
            hint="International format with country code. All enquiry buttons use this number — double-check it."
            errors={errors.whatsapp_number}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            defaultValue={settings.email ?? ""}
            errors={errors.email}
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            defaultValue={settings.phone ?? ""}
            errors={errors.phone}
          />
        </div>
        <TextAreaField
          label="Address"
          name="address"
          rows={3}
          maxLength={300}
          defaultValue={settings.address ?? ""}
          errors={errors.address}
        />
      </fieldset>

      <fieldset className="admin-card space-y-6">
        <legend className="mb-1 text-2xl font-medium">Social links</legend>
        <div className="grid gap-6 sm:grid-cols-3">
          <TextField
            label="Instagram"
            name="instagram_url"
            type="url"
            defaultValue={settings.instagram_url ?? ""}
            placeholder="https://instagram.com/…"
            errors={errors.instagram_url}
          />
          <TextField
            label="Facebook"
            name="facebook_url"
            type="url"
            defaultValue={settings.facebook_url ?? ""}
            placeholder="https://facebook.com/…"
            errors={errors.facebook_url}
          />
          <TextField
            label="TikTok"
            name="tiktok_url"
            type="url"
            defaultValue={settings.tiktok_url ?? ""}
            placeholder="https://tiktok.com/@…"
            errors={errors.tiktok_url}
          />
        </div>
      </fieldset>

      <fieldset className="admin-card space-y-6">
        <legend className="mb-1 text-2xl font-medium">About page</legend>
        <p className="-mt-3 text-sm text-ink/70">
          Only enter text the client has supplied or approved. Sections left empty are hidden.
        </p>
        <TextAreaField
          label="Company story"
          name="about_story"
          rows={7}
          maxLength={6000}
          defaultValue={settings.about_story ?? ""}
          hint="Leave a blank line between paragraphs."
          errors={errors.about_story}
        />
        <TextAreaField
          label="Design philosophy"
          name="design_philosophy"
          rows={5}
          maxLength={4000}
          defaultValue={settings.design_philosophy ?? ""}
          errors={errors.design_philosophy}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Founder name"
            name="founder_name"
            maxLength={100}
            defaultValue={settings.founder_name ?? ""}
            errors={errors.founder_name}
          />
        </div>
        <TextAreaField
          label="Founder bio"
          name="founder_bio"
          rows={5}
          maxLength={3000}
          defaultValue={settings.founder_bio ?? ""}
          errors={errors.founder_bio}
        />
      </fieldset>

      <Notice state={state} />
      <button type="submit" className="btn-dark" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
