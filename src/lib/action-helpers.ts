import { revalidatePath } from "next/cache";
import type { z } from "zod";

export type FieldErrors = Record<string, string[]>;

export type ActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors;
};

/** Initial state for useActionState. */
export type ActionState = ActionResult | null;

export const fail = (message: string, fieldErrors?: FieldErrors): ActionResult => ({
  ok: false,
  message,
  fieldErrors,
});

export const succeed = (message?: string): ActionResult => ({ ok: true, message });

export const UNAUTHORISED = fail(
  "Your session has expired or you are not authorised to do this. Please sign in again.",
);

/** Validates raw input; returns data on success or a ready-to-return failure. */
export function parseInput<S extends z.ZodTypeAny>(
  schema: S,
  raw: unknown,
): { data: z.output<S>; error?: undefined } | { data?: undefined; error: ActionResult } {
  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data };
  const fieldErrors = result.error.flatten().fieldErrors as FieldErrors;
  return { error: fail("Please correct the highlighted fields.", fieldErrors) };
}

type DbError = { code?: string; message?: string } | null;

/** Converts a database error into something safe and useful to show. */
export function dbFailure(
  error: DbError,
  opts: { uniqueField?: string; uniqueMessage?: string } = {},
): ActionResult {
  if (error?.code === "23505") {
    const message = opts.uniqueMessage ?? "That value is already in use.";
    return fail(
      message,
      opts.uniqueField ? { [opts.uniqueField]: [message] } : undefined,
    );
  }
  if (error?.code === "P0001" && error.message) return fail(error.message);
  if (error?.code === "42501") return UNAUTHORISED;
  console.error("[action] database error:", error);
  return fail("Something went wrong while saving. Please try again.");
}

/** Public pages are cached (ISR); call after any content change. */
export function revalidatePublic() {
  revalidatePath("/", "layout");
}
