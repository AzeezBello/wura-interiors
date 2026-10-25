import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeState = { ok: boolean; message?: string } | null | undefined;

/** Success / failure banner. Announced to screen readers via role. */
export function Notice({ state, className }: { state: NoticeState; className?: string }) {
  if (!state?.message) return null;
  const Icon = state.ok ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={state.ok ? "status" : "alert"}
      className={cn(
        "flex items-start gap-3 border px-4 py-3 text-sm",
        state.ok
          ? "border-emerald-700/30 bg-emerald-50 text-emerald-900"
          : "border-red-700/30 bg-red-50 text-red-900",
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{state.message}</p>
    </div>
  );
}
