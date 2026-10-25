"use client";

import { signIn } from "@/actions/auth";
import { TextField } from "@/components/ui/fields";
import { Notice } from "@/components/ui/Notice";
import { useActionForm } from "./hooks";

export function LoginForm({ next }: { next?: string }) {
  const { state, pending, onSubmit } = useActionForm(signIn, { refreshOnSuccess: false });
  const errors = state?.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={errors.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={errors.password}
      />
      {state && !state.ok && !state.fieldErrors && <Notice state={state} />}
      <button type="submit" className="btn-gold w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
