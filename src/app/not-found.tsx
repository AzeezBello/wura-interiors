import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-ivory">
      <p className="eyebrow-on-dark">Error 404</p>
      <h1 className="mt-4 text-6xl font-medium">Page not found</h1>
      <span aria-hidden className="mt-8 block h-px w-16 bg-gold" />
      <p className="mt-8 max-w-md text-ivory/70">
        The page you are looking for may have moved, or is no longer available.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/" className="btn-gold">
          Back to home
        </Link>
        <Link href="/portfolio" className="btn-outline-light">
          View portfolio
        </Link>
      </div>
    </main>
  );
}
