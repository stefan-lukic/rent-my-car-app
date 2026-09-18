'use client';

import { usePathname } from 'next/navigation';
import OwnerProfileHeader from '@/components/OwnerProfileHeader';

const standaloneRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/help',
  '/terms',
  '/privacy',
];

export default function AppHeader() {
  const pathname = usePathname();

  // Auth and informational routes keep their purpose-built page chrome.
  if (standaloneRoutes.includes(pathname)) return null;

  return <OwnerProfileHeader />;
}
