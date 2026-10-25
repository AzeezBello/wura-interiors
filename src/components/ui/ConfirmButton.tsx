"use client";

import { useId, useRef, useState } from "react";

/**
 * A button that asks for confirmation (native <dialog>, focus-trapped and
 * Escape-dismissible) before running a destructive action.
 */
export function ConfirmButton({
  label,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  disabled,
  className = "btn-danger btn-sm",
}: {
  label: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const titleId = useId();
  const descId = useId();

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => dialogRef.current?.showModal()}
      >
        {label}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-[min(92vw,28rem)] border border-ink/20 bg-white p-6 text-ink shadow-2xl backdrop:bg-black/60"
      >
        <h2 id={titleId} className="text-2xl font-medium">
          {title}
        </h2>
        <p id={descId} className="mt-3 text-sm leading-relaxed text-ink/70">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => dialogRef.current?.close()}
            disabled={busy}
          >
            Cancel
          </button>
          <button type="button" className="btn-danger btn-sm" onClick={confirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
