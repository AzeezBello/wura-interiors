import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <p className={cn(tone === "dark" ? "eyebrow-on-dark" : "eyebrow")}>{eyebrow}</p>
      )}
      <Heading
        className={cn(
          "mt-3 text-4xl font-medium leading-[1.1] sm:text-5xl",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </Heading>
      <span
        aria-hidden
        className={cn("mt-6 block h-px w-16 bg-gold", align === "center" && "mx-auto")}
      />
      {description && (
        <p className={cn("mt-6 text-lg leading-relaxed", tone === "dark" ? "text-ivory/75" : "text-ink/70")}>
          {description}
        </p>
      )}
    </div>
  );
}
