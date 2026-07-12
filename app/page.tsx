'use client';

import { useState } from 'react';
import { Compass, LucideLoader2 } from 'lucide-react';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/UI/Header';
import HowItWorksModal from '@/components/HowItWorksModal';
import CarFilters from '@/components/CarFilters';
import CarRentalSearch from '@/components/CarRentalSearch';
import MobileCarFilters from '@/components/mobile/MobileCarFilters';
import MobileCarRentalSearch from '@/components/mobile/MobileCarRentalSearch';

export default function Home() {
  const { loading } = useAuth();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [filters, setFilters] = useState<CarFilterState>({
    minPrice: '',
    maxPrice: '',
    make: '',
    carType: '',
    engine: '',
  });

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <LucideLoader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header onHowItWorksClick={() => setIsHowItWorksOpen(true)} />

      <section className="bg-white border-b border-gray-100 py-8 md:py-16 text-center md:text-center px-4 md:px-0">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-full mb-4 md:mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Premium Marketplace Network in Serbia
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Find and Book Cars Across Serbia{' '}
            <span className="text-blue-600">Fast, Easy, Trusted</span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-8 md:mb-10 px-2">
            Inspect vehicle specifications, calculate real-time day rates, and
            book from trusted local renters in Novi Sad and Belgrade.
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-16 max-w-2xl mx-auto">
            {[
              { value: '150+', label: 'Premium Rides' },
              { value: '12k+', label: 'Kilometers Logged' },
              { value: '100%', label: 'Verified Hosts' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="border-r border-gray-100 last:border-0 md:border-none"
              >
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {value}
                </p>
                <p className="text-[9px] md:text-xs text-gray-400 mt-0.5 uppercase md:normal-case">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-10">
        <div className="block md:hidden space-y-6">
          <MobileCarFilters filters={filters} setFilters={setFilters} />
          <MobileCarRentalSearch filters={filters} />
        </div>

        <div className="hidden md:flex gap-8">
          <aside className="w-[280px] flex-shrink-0">
            <div className="sticky top-6">
              <CarFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>
          <div className="flex-1">
            <CarRentalSearch filters={filters} />
          </div>
        </div>
      </section>

      <footer className="hidden md:block bg-slate-900 text-slate-400 py-8 md:py-10 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-800 p-2 rounded-xl text-blue-500">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-black text-white tracking-tight">
                RentMy<span className="text-blue-500">Car</span>
              </p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">
                Serbia Marketplace • © 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[11px] font-medium text-slate-500">
            {[
              'About Us',
              'Help Center',
              'Terms of Service',
              'Privacy Policy',
            ].map((link) => (
              <span
                key={link}
                className="hover:text-blue-400 cursor-pointer transition-colors"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </main>
  );
}
