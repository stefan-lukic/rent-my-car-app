import { getBaseUrl } from '@/app/api/api';
import MobileProfilePage from '@/components/mobile/MobileProfilePage';
import ProfilePage from '@/components/ProfilePage';
import { getServerSession } from 'next-auth/next';
import { headers } from 'next/headers';

export default async function MyProfilePage() {
  const session = await getServerSession();
  const baseUrl = getBaseUrl();

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  if (!session.user.email) {
    return null;
  }

  const userRes = await fetch(
    `${baseUrl}/api/users?email=${encodeURIComponent(session.user.email)}`
  );
  const user = await userRes.json();

  const carsRes = await fetch(`${baseUrl}/api/cars/my-cars?userId=${user._id}`);
  const cars = await carsRes.json();

  const rentalsRes = await fetch(
    `${baseUrl}/api/my-rentals?userId=${user._id}`
  );
  const rentals = await rentalsRes.json();

  const userAgent = headers().get('user-agent') || '';
  const isMobile = /mobile/i.test(userAgent);

  // Render the appropriate component based on the device type
  return isMobile ? (
    <MobileProfilePage user={user} cars={cars} rentals={rentals} />
  ) : (
    <ProfilePage user={user} cars={cars} rentals={rentals} />
  );
}
