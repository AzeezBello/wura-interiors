import { cn } from "@/lib/utils";

/** Renders plain text from the dashboard as paragraphs (blank line = new paragraph). */
export function Paragraphs({
  text,
  className,
}: {
  text: string | null | undefined;
  className?: string;
}) {
  if (!text) return null;
  const parts = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("space-y-5", className)}>
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
