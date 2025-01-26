import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/UI/Header';
import { Providers } from '@/components/Providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import MobileFooter from '@/components/mobile/MobileFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rent My Car',
  description: 'Car rental service',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${inter.className} flex flex-col h-screen overflow-hidden md:overflow-auto`}
      >
        <Providers>
          {/* Header for desktop only */}
          <Header className="hidden md:block" />

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
