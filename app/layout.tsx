import l from '@/helper/en';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import MobileFooter from '@/components/mobile/MobileFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rent My Car',
  description: 'Rent a car easily',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'RentCar',
  },
  icons: {
    apple: [
      { url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152' },
    ],
  },
};

export const viewport: Viewport = {
  // Let Next.js emit one accessible viewport definition for every page.
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Ensures the viewport covers the entire screen, including the notch area
  themeColor: '#dbeafe', // Match this with your app's theme color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#dbeafe" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${inter.className} flex flex-col h-screen overflow-hidden md:overflow-auto`}
      >
        <Script id="ios-pwa-fix" strategy="afterInteractive">
          {`
            if (window.navigator.standalone) {
              document.documentElement.style.height = '100vh';
              document.body.style.height = '100vh';
              document.body.style.overflow = 'hidden';
            }
          `}
        </Script>
        <Providers>
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">{children}</main>

          {/* Mobile Footer */}
          <MobileFooter />
        </Providers>

        {/* External components */}
        <Analytics />
        <SpeedInsights />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
