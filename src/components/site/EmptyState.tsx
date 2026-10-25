import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border border-dashed border-ink/25 px-6 py-16 text-center",
        className,
      )}
    >
      <span aria-hidden className="mb-5 block h-px w-12 bg-gold" />
      <h3 className="text-2xl text-ink">{title}</h3>
      {children && <div className="mt-3 max-w-md text-ink/70">{children}</div>}
    </div>
  );
}
