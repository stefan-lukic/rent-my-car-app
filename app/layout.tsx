import l from '@/helper/en';
import { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import MobileFooter from '@/components/mobile/MobileFooter';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'RentMyCar',
  description: 'Find and rent cars from local owners across Serbia.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RentMyCar',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    apple: [
      { url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152' },
    ],
  },
};

export const viewport: Viewport = {
  // Keep browser chrome aligned with the manifest brand color.
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Ensures the viewport covers the entire screen, including the notch area
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} flex min-h-screen flex-col bg-surface font-body text-body`}
      >
        {/* Keep native document scrolling available in installed iOS PWAs. */}
        <Providers>
          <div className="min-h-0 flex-1">{children}</div>
          <MobileFooter />
        </Providers>
        <Analytics />
        <SpeedInsights />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
