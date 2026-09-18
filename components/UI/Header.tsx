'use client';

import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '../LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import l from '@/helper/en';

const Header = ({ onHowItWorksClick }: { onHowItWorksClick?: () => void }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();

  if (pathname === '/sign-in' || pathname === '/sign-up') return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icons/icon-192x192.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-cover shadow-sm"
          />
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

                <Link
                  href="/profile/my-profile"
                  aria-label={l.navigation.myProfileRentals}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-brand hover:bg-brand-tint">
                    <span className="text-xs font-bold uppercase text-body">
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
          <Image
            src="/icons/icon-192x192.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover shadow-sm"
          />
          <div>
            <span className="font-heading text-xl font-bold tracking-tight text-ink">
              RentMy<span className="text-brand">Car</span>
            </span>
            <p className="mt-0.5 hidden text-[9px] font-semibold uppercase leading-none tracking-widest text-body-faint sm:block">
              {l.landing.verifiedVehicles}
            </p>
          </div>
        </Link>

        <nav
          aria-label={l.navigation.catalog}
          className="flex gap-8 text-sm font-semibold text-body"
        >
          <Link href="/" className="transition-colors hover:text-brand-dark">
            {l.navigation.catalog}
          </Link>
          <button
            onClick={onHowItWorksClick}
            className="transition-colors hover:text-brand-dark"
          >
            {l.navigation.howItWorksNav}
          </button>
          {/* Protected navigation appears only after authentication is known. */}
          {!loading && isAuthenticated ? (
            <Link
              href="/profile/my-profile"
              className="transition-colors hover:text-brand-dark"
            >
              {l.navigation.myProfileRentals}
            </Link>
          ) : null}
        </nav>

        {!loading && (
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-body transition-colors hover:text-brand-dark"
                >
                  {l.navigation.signIn}
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  {l.common.getStarted}
                </Link>
              </>
            ) : (
              <>
                <LogoutButton />
                <Link
                  href="/profile/my-profile"
                  aria-label={l.navigation.myProfileRentals}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:border-brand hover:bg-brand-tint">
                    <span className="text-xs font-bold uppercase text-body">
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
