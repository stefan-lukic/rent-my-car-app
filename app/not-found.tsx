import l from '@/helper/en';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-3xl items-center px-4 py-16 sm:px-6">
      <section className="w-full rounded-2xl border border-border bg-surface-0 px-6 py-14 text-center shadow-sm sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Error 404
        </p>
        <h1 className="mt-3 font-heading text-5xl font-bold tracking-tight text-ink sm:text-6xl">
          {l.pages.notFound}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-body-muted">
          {l.pages.pageNotFound}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {l.common.backToHome}
        </Link>
      </section>
    </div>
  );
}
