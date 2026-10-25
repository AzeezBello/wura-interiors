import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn, whatsappLink } from "@/lib/utils";

/**
 * Primary conversion button. Links to WhatsApp when a verified number has been
 * saved in the dashboard; until then it falls back to the Contact page rather
 * than pointing at a made-up number.
 */
export function WhatsAppButton({
  number,
  message,
  label = "Enquire on WhatsApp",
  variant = "gold",
  className,
}: {
  number: string | null | undefined;
  message?: string;
  label?: string;
  variant?: "gold" | "dark" | "outline-light" | "outline";
  className?: string;
}) {
  const classes = cn(
    {
      gold: "btn-gold",
      dark: "btn-dark",
      "outline-light": "btn-outline-light",
      outline: "btn-outline",
    }[variant],
    className,
  );
  const href = whatsappLink(number, message);

  if (!href) {
    return (
      <Link href="/contact" className={classes}>
        <MessageCircle className="h-4 w-4" aria-hidden />
        {label === "Enquire on WhatsApp" ? "Enquire" : label}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}
