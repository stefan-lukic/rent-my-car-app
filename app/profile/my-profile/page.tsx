import l from '@/helper/en';
import { getBaseUrl } from '@/app/api/api';
import MobileProfilePage from '@/components/mobile/MobileProfilePage';
import ProfilePage from '@/components/ProfilePage';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const baseUrl = getBaseUrl();

  try {
    await connectToDatabase();

    const userDocument = await User.findById(session.user.id)
      .select('name email contactInfo images rating createdAt')
      .lean();

    if (!userDocument) {
      throw new Error(l.errors.errorFetchingUser);
    }

    const user = JSON.parse(JSON.stringify(userDocument));

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
        {l.pages.errorFallback}
      </div>
    );
  }
}
