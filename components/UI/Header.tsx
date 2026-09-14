'use client';

import Link from 'next/link';
import LogoutButton from '../LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { Compass } from 'lucide-react';
import l from '@/helper/en';

const Header = ({ onHowItWorksClick }: { onHowItWorksClick?: () => void }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();

  if (pathname === '/sign-in' || pathname === '/sign-up') return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-brand p-2 text-white shadow-sm">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-ink">
            RentMy<span className="text-brand">Car</span>
          </span>
        </Link>

        {!loading && (
          <div>
            {!isAuthenticated ? (
              <Link
                href="/sign-in"
                className="text-xs font-semibold text-brand transition-colors hover:text-brand/90"
              >
                {l.navigation.signIn}
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <LogoutButton />
                <Link href="/profile/my-profile">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors hover:border-brand">
                    <span className="text-xs font-bold uppercase text-slate-600">
                      {user?.name?.charAt(0) ?? l.common.profileInitial}
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:flex lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="rounded-xl bg-brand p-2.5 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-tight text-ink">
              RentMy<span className="text-brand">Car</span>
            </span>
            <p className="mt-0.5 hidden text-[9px] font-semibold uppercase leading-none tracking-widest text-slate-400 sm:block">
              {l.landing.verifiedVehicles}
            </p>
          </div>
        </Link>

        <nav className="flex gap-8 text-xs font-semibold text-slate-600">
          <Link href="/" className="transition-colors hover:text-brand">
            {l.navigation.catalog}
          </Link>
          <button
            onClick={onHowItWorksClick}
            className="transition-colors hover:text-brand"
          >
            {l.navigation.howItWorksNav}
          </button>
          <Link
            href="/profile/my-profile"
            className="transition-colors hover:text-brand"
          >
            {l.navigation.myProfileRentals}
          </Link>
        </nav>

        {!loading && (
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-xs font-semibold text-slate-600 transition-colors hover:text-brand"
                >
                  {l.navigation.signIn}
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
                >
                  {l.common.getStarted}
                </Link>
              </>
            ) : (
              <>
                <LogoutButton />
                <Link href="/profile/my-profile">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors hover:border-brand">
                    <span className="text-xs font-bold uppercase text-slate-600">
                      {user?.name?.charAt(0) ?? l.common.profileInitial}
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
