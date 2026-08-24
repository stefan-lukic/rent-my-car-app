import l from '@/helper/en';
import MobileProfilePage from '@/components/mobile/MobileProfilePage';
import ProfilePage from '@/components/ProfilePage';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    await connectToDatabase();

    const userDocument = await User.findById(session.user.id)
      .select('name email contactInfo images rating createdAt')
      .lean();

    if (!userDocument) {
      throw new Error(l.errors.errorFetchingUser);
    }

    const user = JSON.parse(JSON.stringify(userDocument));
    const requestHeaders = headers();
    const host = requestHeaders.get('host');
    const forwardedProtocol = requestHeaders.get('x-forwarded-proto');
    const protocol =
      forwardedProtocol || (host?.startsWith('localhost') ? 'http' : 'https');
    const baseUrl = host
      ? `${protocol}://${host}`
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const fetchJson = async (url: string) => {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { Cookie: cookies().toString() },
      });
      if (!res.ok) {
        throw new Error(`Profile request failed with status ${res.status}`);
      }
      return res.json();
    };

    const [carsResult, rentalsResult] = await Promise.allSettled([
      fetchJson(`${baseUrl}/api/cars/my-cars`),
      fetchJson(`${baseUrl}/api/my-rentals`),
    ]);

    const cars = carsResult.status === 'fulfilled' ? carsResult.value : [];
    const rentals =
      rentalsResult.status === 'fulfilled' ? rentalsResult.value : [];

    const isMobile = isMobileSSR();

    return isMobile ? (
      <MobileProfilePage user={user} cars={cars} rentals={rentals} />
    ) : (
      <ProfilePage user={user} cars={cars} rentals={rentals} />
    );
  } catch (error) {
    console.error('Failed to load profile page:', error);
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        {l.pages.errorFallback}
      </div>
    );
  }
}
