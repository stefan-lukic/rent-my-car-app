'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CarFront, CirclePlus, UserRound, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import l from '@/helper/en';

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: l.navigation.explore,
    href: '/#car-search',
    icon: CarFront,
    isActive: (pathname) =>
      pathname === '/' ||
      (pathname.startsWith('/cars/') && pathname !== '/cars/add-car'),
  },
  {
    label: l.navigation.listCar,
    href: '/cars/add-car',
    icon: CirclePlus,
    isActive: (pathname) => pathname === '/cars/add-car',
  },
  {
    label: l.navigation.profile,
    href: '/profile/my-profile',
    icon: UserRound,
    isActive: (pathname) => pathname.startsWith('/profile/'),
  },
];

const MobileFooter = () => {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  if (loading || !isAuthenticated) return null;

  return (
    <nav
      aria-label={l.navigation.mobileNavigation}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_32px_rgba(15,23,42,0.18)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {navigationItems.map(({ label, href, icon: Icon, isActive }) => {
          const active = isActive(pathname);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon
                aria-hidden="true"
                className={`h-5 w-5 ${active ? 'text-blue-400' : ''}`}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileFooter;
