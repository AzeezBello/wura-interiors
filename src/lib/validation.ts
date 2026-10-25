import { z } from "zod";
import { isHttpUrl, normalizeWhatsAppNumber } from "@/lib/utils";

/** Empty / missing form values become null so optional fields stay optional. */
const blankToNull = (v: unknown) =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : null;

export const optionalText = (max: number, label = "This field") =>
  z.preprocess(
    blankToNull,
    z.string().max(max, `${label} must be ${max} characters or fewer`).nullable(),
  );

export const requiredText = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} is required` })
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or fewer`);

export const slugSchema = z
  .string({ required_error: "Slug is required", invalid_type_error: "Slug is required" })
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(80, "Slug must be 80 characters or fewer")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens only",
  );

export const uuidSchema = z.string().uuid("Invalid identifier");

export const optionalUuid = z.preprocess(blankToNull, z.string().uuid().nullable());

export const optionalDate = z.preprocess(
  blankToNull,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
    .refine((s) => !Number.isNaN(Date.parse(s)), "Use a valid date")
    .nullable(),
);

export const optionalUrl = (label: string) =>
  z.preprocess(
    blankToNull,
    z
      .string()
      .max(300)
      .refine(isHttpUrl, `${label} must be a full link starting with https://`)
      .nullable(),
  );

export const optionalEmail = z.preprocess(
  blankToNull,
  z.string().max(200).email("Enter a valid email address").nullable(),
);

export const optionalWhatsApp = z.preprocess(
  blankToNull,
  z
    .string()
    .transform((value, ctx) => {
      const normalised = normalizeWhatsAppNumber(value);
      if (!normalised) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Enter the number in international format starting with +, e.g. +234 803 123 4567",
        });
        return z.NEVER;
      }
      return normalised;
    })
    .nullable(),
);

/* ---------- Entity schemas ---------- */

export const projectSchema = z.object({
  title: requiredText(2, 140, "Title"),
  slug: slugSchema,
  summary: optionalText(300, "Summary"),
  description: optionalText(10000, "Description"),
  category_id: optionalUuid,
  location: optionalText(120, "Location"),
  completed_on: optionalDate,
  featured: z.boolean(),
});

export const categorySchema = z.object({
  name: requiredText(2, 60, "Name"),
  slug: slugSchema,
});

export const serviceSchema = z.object({
  title: requiredText(2, 120, "Title"),
  slug: slugSchema,
  summary: optionalText(300, "Summary"),
  description: optionalText(10000, "Description"),
  status: z.enum(["draft", "published"]),
});

export const settingsSchema = z.object({
  business_name: requiredText(2, 100, "Business name"),
  tagline: optionalText(160, "Tagline"),
  whatsapp_number: optionalWhatsApp,
  email: optionalEmail,
  phone: optionalText(40, "Phone"),
  address: optionalText(300, "Address"),
  instagram_url: optionalUrl("Instagram link"),
  facebook_url: optionalUrl("Facebook link"),
  tiktok_url: optionalUrl("TikTok link"),
  about_story: optionalText(6000, "Company story"),
  design_philosophy: optionalText(4000, "Design philosophy"),
  founder_name: optionalText(100, "Founder name"),
  founder_bio: optionalText(3000, "Founder bio"),
});

export const imageDetailsSchema = z.object({
  caption: optionalText(200, "Caption"),
  alt_text: optionalText(250, "Alt text"),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const projectStatusSchema = z.enum(["draft", "published", "archived"]);

/** Read checkbox + text inputs off a FormData into a plain object. */
export function formToObject(fd: FormData, checkboxes: string[] = []) {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value === "string") obj[key] = value;
  }
  for (const key of checkboxes) obj[key] = fd.get(key) === "on";
  return obj;
}
