import { getBaseUrl } from '@/app/api/api';
import MobileProfilePage from '@/components/mobile/MobileProfilePage';
import ProfilePage from '@/components/ProfilePage';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function MyProfilePage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    redirect('/sign-in');
  }

  const baseUrl = getBaseUrl();

  try {
    const userRes = await fetch(
      `${baseUrl}/api/users?email=${encodeURIComponent(session.user.email)}`,
      { cache: 'no-store' }
    );

    if (!userRes.ok) {
      throw new Error('Failed to fetch user');
    }

    const user = await userRes.json();

    const fetchJson = async (url: string) => {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { Cookie: cookies().toString() },
      });
      if (!res.ok) throw new Error();
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
        Something went wrong. Please try again later.
      </div>
    );
  }
}