"use client";

import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import type { ActionResult, ActionState } from "@/lib/action-helpers";

type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Wraps a server action for use in a <form>. Unlike passing the action straight
 * to <form action>, this does NOT let React reset the form after submission —
 * so what the administrator typed is never wiped by a failed validation or a
 * successful save.
 */
export function useActionForm(
  action: FormAction,
  options: { refreshOnSuccess?: boolean; resetOnSuccess?: boolean } = {},
) {
  const { refreshOnSuccess = true, resetOnSuccess = false } = options;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  useEffect(() => {
    if (!state?.ok) return;
    if (resetOnSuccess) formRef.current?.reset();
    if (refreshOnSuccess) router.refresh();
  }, [state, router, refreshOnSuccess, resetOnSuccess]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      startTransition(() => formAction(formData));
    },
    [formAction],
  );

  return { state, pending, onSubmit, formRef };
}

/** Runs a one-off server action (button click) and tracks its outcome. */
export function useRunAction() {
  const router = useRouter();
  const [pending, startPending] = useTransition();
  const [notice, setNotice] = useState<ActionResult | null>(null);

  const run = useCallback(
    (fn: () => Promise<ActionResult>, opts: { refresh?: boolean } = {}) => {
      const { refresh = true } = opts;
      startPending(async () => {
        setNotice(null);
        try {
          const result = await fn();
          setNotice(result);
          if (result.ok && refresh) router.refresh();
        } catch {
          setNotice({ ok: false, message: "Something went wrong. Please try again." });
        }
      });
    },
    [router],
  );

  return { run, pending, notice, clear: () => setNotice(null) };
}
