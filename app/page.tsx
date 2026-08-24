'use client';

import l from '@/helper/en';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeEuro,
  CalendarCheck,
  CarFront,
  Compass,
  KeyRound,
  LucideLoader2,
} from 'lucide-react';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/UI/Header';
import HowItWorksModal from '@/components/HowItWorksModal';
import CarFilters from '@/components/CarFilters';
import CarRentalSearch from '@/components/CarRentalSearch';
import MobileCarFilters from '@/components/mobile/MobileCarFilters';
import MobileCarRentalSearch from '@/components/mobile/MobileCarRentalSearch';

const initialFilters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
};

export default function Home() {
  const { loading } = useAuth();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [filters, setFilters] = useState<CarFilterState>(initialFilters);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
        <LucideLoader2 className="animate-spin text-blue-600" />
        <span className="sr-only">{l.common.loading}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header onHowItWorksClick={() => setIsHowItWorksOpen(true)} />

      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.32),_transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <CarFront className="h-4 w-4" />
              {l.landing.localCarMarketplace}
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {l.landing.heroTitle}{' '}
              <span className="text-blue-400">{l.landing.heroHighlight}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {l.landing.heroDescription}
            </p>

            <div className="mt-6">
              <a
                href="#car-search"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                {l.landing.findACar}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-600/25 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
                <CarFront className="h-4 w-4" />
                {l.landing.forCarOwners}
              </div>
              <h2 className="max-w-xl text-2xl font-black tracking-tight text-white md:text-3xl">
                {l.landing.putYourCarToWork}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                {l.landing.ownerDescription}
              </p>

              <Link
                href="/cars/add-car"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:w-auto"
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
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            {l.landing.browseCars}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            {l.search.findPerfectRide}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {l.search.findCompareChoose}
          </p>
        </div>

        <div className="md:hidden">
          <MobileCarRentalSearch
            filters={filters}
            filtersSlot={
              <MobileCarFilters filters={filters} setFilters={setFilters} />
            }
          />
        </div>

        <div className="hidden items-start gap-6 md:grid md:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="sticky top-24">
            <CarFilters filters={filters} setFilters={setFilters} />
          </aside>
          <CarRentalSearch filters={filters} />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
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
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {l.navigation.howItWorksNav}
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-7 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-slate-800 p-2 text-blue-400">
              <Compass className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black tracking-tight text-white">
                RentMy<span className="text-blue-400">Car</span>
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {l.landing.copyright}
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs font-semibold text-slate-400 md:gap-x-6"
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
                className="transition-colors hover:text-blue-400 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
