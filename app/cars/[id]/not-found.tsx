import Link from 'next/link';
import { CarFront } from 'lucide-react';
import l from '@/helper/en';

export default function CarNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-tint text-brand">
          <CarFront className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-ink">
          {l.carDetailsPage.carNotFound}
        </h1>
        <p className="mt-2 text-sm leading-6 text-body-subtle">
          {l.carDetailsPage.carNotFoundDescription}
        </p>
        <Link
          href="/#car-search"
          className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          {l.carDetailsPage.browseAvailableCars}
        </Link>
      </div>
    </main>
  );
}
