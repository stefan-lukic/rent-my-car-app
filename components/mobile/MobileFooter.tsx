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
    <>
      <div
        aria-hidden="true"
        data-testid="mobile-footer-spacer"
        className="h-[calc(4.25rem+env(safe-area-inset-bottom))] shrink-0 md:hidden"
      />
      <nav
        aria-label={l.navigation.mobileNavigation}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {navigationItems.map(({ label, href, icon: Icon, isActive }) => {
            const active = isActive(pathname);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                  active
                    ? 'bg-brand-tint text-brand-dark'
                    : 'text-body-subtle hover:bg-surface hover:text-ink'
                }`}
              >
                <Icon
                  aria-hidden="true"
                  className={`h-5 w-5 ${active ? 'text-brand' : ''}`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileFooter;
