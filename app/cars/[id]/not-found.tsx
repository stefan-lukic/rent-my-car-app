import Link from 'next/link';
import { CarFront } from 'lucide-react';
import l from '@/helper/en';

export default function CarNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <CarFront className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">
          {l.carDetailsPage.carNotFound}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {l.carDetailsPage.carNotFoundDescription}
        </p>
        <Link
          href="/#car-search"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {l.carDetailsPage.browseAvailableCars}
        </Link>
      </div>
    </main>
  );
}
