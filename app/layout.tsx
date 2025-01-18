import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/UI/Header';
import { Providers } from '@/components/Providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import MobileFooter from '@/components/MobileFooter';

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
      </head>
      <body className={`${inter.className} overflow-hidden md:overflow-auto`}>
        <Providers>
          <Header className="hidden md:block" />
          {children}
          <Analytics />
          <SpeedInsights />
          <ServiceWorkerRegistration />
          <MobileFooter />
        </Providers>
      </body>
    </html>
  );
}
