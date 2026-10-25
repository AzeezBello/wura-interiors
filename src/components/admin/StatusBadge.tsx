import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  published: "border-emerald-700/30 bg-emerald-50 text-emerald-900",
  draft: "border-amber-700/30 bg-amber-50 text-amber-900",
  archived: "border-ink/20 bg-ink/5 text-ink/70",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? styles.archived,
      )}
    >
      {status}
    </span>
  );
}
