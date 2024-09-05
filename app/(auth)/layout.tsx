import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Authentication | Exclusive',
  description:
    'Discover a world of shopping at your fingertips. Our e-commerce platform offers a seamless, enjoyable, and secure online shopping experience for everyone. With a vast selection of products across various categories, we are committed to providing quality, value, and convenience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`${poppins.className}`}>
      <Providers>{children}</Providers>
    </main>
  );
}
