import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Accepts a number written in international format ("+234 803 123 4567") and
 * returns it normalised ("+2348031234567"), or null when it is not valid.
 * Local formats such as "0803…" are deliberately rejected: a WhatsApp link
 * needs the country code, and guessing it risks pointing at the wrong person.
 */
export function normalizeWhatsAppNumber(input: string): string | null {
  const cleaned = input.replace(/[\s\-().]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(cleaned) ? cleaned : null;
}

export function whatsappLink(
  number: string | null | undefined,
  message?: string,
): string | null {
  if (!number) return null;
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatPrice(amount: number): string {
  return `₦${new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
