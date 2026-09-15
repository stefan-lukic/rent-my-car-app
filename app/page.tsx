'use client';

import l from '@/helper/en';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BadgeEuro,
  CalendarCheck,
  CarFront,
  KeyRound,
} from 'lucide-react';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { useAuth } from '@/hooks/useAuth';
import useMediaQuery from '@/hooks/useMediaQuery';
import Header from '@/components/UI/Header';
import HowItWorksModal from '@/components/HowItWorksModal';
import CarFilters from '@/components/CarFilters';
import CarRentalSearch from '@/components/CarRentalSearch';
import MobileCarFilters from '@/components/mobile/MobileCarFilters';
import MobileCarRentalSearch from '@/components/mobile/MobileCarRentalSearch';
import { HomePageSkeleton } from '@/components/UI/LoadingSkeletons';
import { parseCalendarDate } from '@/lib/utils/calendarDate';

const initialFilters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  minSeats: '',
};

export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const { loading } = useAuth();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [filters, setFilters] = useState<CarFilterState>(() => ({
    minPrice: searchParams.get('minPrice') ?? initialFilters.minPrice,
    maxPrice: searchParams.get('maxPrice') ?? initialFilters.maxPrice,
    make: searchParams.get('make') ?? initialFilters.make,
    carType: searchParams.get('carType') ?? initialFilters.carType,
    engine: searchParams.get('engine') ?? initialFilters.engine,
    minSeats: searchParams.get('minSeats') ?? initialFilters.minSeats,
  }));
  const initialSearchValues = {
    city: searchParams.get('city') ?? '',
    startDate: parseCalendarDate(searchParams.get('start')),
    endDate: parseCalendarDate(searchParams.get('end')),
  };

  if (loading || isMobile === null) {
    return <HomePageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-surface text-ink">
      <Header onHowItWorksClick={() => setIsHowItWorksOpen(true)} />

      <section className="relative overflow-hidden border-b border-ink-secondary bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.24),_transparent_48%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand-light">
              <CarFront className="h-4 w-4" />
              {l.landing.localCarMarketplace}
            </div>
            <h1 className="max-w-3xl font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {l.landing.heroTitle}{' '}
              <span className="text-brand-light">
                {l.landing.heroHighlight}
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {l.landing.heroDescription}
            </p>

            <div className="mt-6">
              <a
                href="#car-search"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {l.landing.findACar}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-tint bg-brand-tint px-3 py-1.5 text-xs font-semibold text-brand">
                <CarFront className="h-4 w-4" />
                {l.landing.forCarOwners}
              </div>
              <h2 className="max-w-xl font-heading text-2xl font-bold tracking-tight text-ink md:text-3xl">
                {l.landing.putYourCarToWork}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {l.landing.ownerDescription}
              </p>

              <Link
                href="/cars/add-car"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-auto"
              >
                {l.landing.addYourCar}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: CarFront,
                  title: l.landing.createListing,
                  description: l.landing.createListingDescription,
                },
                {
                  icon: BadgeEuro,
                  title: l.landing.setYourPrice,
                  description: l.landing.setYourPriceDescription,
                },
                {
                  icon: CalendarCheck,
                  title: l.landing.chooseAvailability,
                  description: l.landing.chooseAvailabilityDescription,
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-brand/10 p-2 text-brand/70">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="car-search"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-6 sm:px-6 md:py-8 lg:px-8"
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {l.landing.browseCars}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-ink md:text-3xl">
            {l.search.findPerfectRide}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {l.search.findCompareChoose}
          </p>
        </div>

        {/* Mount only the active search view to prevent duplicate IDs and requests. */}
        {isMobile ? (
          <MobileCarRentalSearch
            filters={filters}
            initialValues={initialSearchValues}
            persistSearch
            filtersSlot={
              <MobileCarFilters filters={filters} setFilters={setFilters} />
            }
          />
        ) : (
          <div className="grid items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
            <aside className="sticky top-24">
              <CarFilters filters={filters} setFilters={setFilters} />
            </aside>
            <CarRentalSearch
              filters={filters}
              initialValues={initialSearchValues}
              persistSearch
            />
          </div>
        )}
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-brand-tint p-2.5 text-brand">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-ink">
                {l.landing.newToRentMyCar}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                {l.landing.howItWorksDescription}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsHowItWorksOpen(true)}
            className="min-h-11 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-body transition-colors hover:border-brand-light hover:bg-brand-tint hover:text-brand-dark"
          >
            {l.navigation.howItWorksNav}
          </button>
        </div>
      </section>

      <footer className="border-t border-ink-secondary bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-7 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icons/icon-192x192.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="text-left">
              <p className="font-heading text-sm font-bold tracking-tight text-white">
                RentMy<span className="text-brand/70">Car</span>
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {l.landing.copyright}
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-300 md:gap-x-6"
          >
            {[
              { href: '/about', label: l.landing.aboutUs },
              { href: '/help', label: l.landing.helpCenter },
              { href: '/terms', label: l.landing.termsOfService },
              { href: '/privacy', label: l.landing.privacyPolicy },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-brand-light focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </main>
  );
}
