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

  //claude kaze da je bolje bez isMobileCSR()

  return (
    <header className="sticky top-0 z-40 bg-white/90 md:bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-slate-900 tracking-tight">
            RentMy<span className="text-blue-600">Car</span>
          </span>
        </Link>

        {!loading && (
          <div>
            {!isAuthenticated ? (
              <Link
                href="/sign-in"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {l.navigation.signIn}
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <LogoutButton />
                <Link href="/profile/my-profile">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center hover:border-blue-400 transition-colors">
                    <span className="text-slate-500 text-xs font-bold uppercase">
                      {user?.name?.charAt(0) ?? l.common.profileInitial}
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2.5 rounded-2xl shadow-sm shadow-blue-500/25">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              RentMy<span className="text-blue-600">Car</span>
            </span>
            <p className="hidden sm:block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {l.landing.verifiedVehicles}
            </p>
          </div>
        </Link>

        <nav className="flex gap-8 text-xs font-semibold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            {l.navigation.catalog}
          </Link>
          <button
            onClick={onHowItWorksClick}
            className="hover:text-blue-600 transition-colors"
          >
            {l.navigation.howItWorksNav}
          </button>
          <Link
            href="/profile/my-profile"
            className="hover:text-blue-600 transition-colors"
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
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {l.navigation.signIn}
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                >
                  {l.common.getStarted}
                </Link>
              </>
            ) : (
              <>
                <LogoutButton />
                <Link href="/profile/my-profile">
                  <div className="h-9 w-9 bg-slate-100 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-blue-400 transition-colors">
                    <span className="text-slate-500 text-xs font-bold uppercase">
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
