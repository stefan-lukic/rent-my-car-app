import { getBaseUrl } from '@/app/api/api';
import MobileProfilePage from '@/components/mobile/MobileProfilePage';
import ProfilePage from '@/components/ProfilePage';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function MyProfilePage() {
  const session = await getServerSession();
  const baseUrl = getBaseUrl();
  const isMobile = isMobileSSR();

  if (!session) {
    redirect('/api/auth/signin');
  }
  if (!session.user.email) {
    return null;
  }
  const userRes = await fetch(
    `${baseUrl}/api/users?email=${encodeURIComponent(session.user.email)}`
  );
  const user = await userRes.json();

  const [carsRes, rentalsRes] = await Promise.all([
    fetch(`${baseUrl}/api/cars/my-cars?userId=${user._id}`),
    fetch(`${baseUrl}/api/my-rentals?userId=${user._id}`),
  ]);

  const [cars, rentals] = await Promise.all([
    carsRes.json(),
    rentalsRes.json(),
  ]);

  return isMobile ? (
    <MobileProfilePage user={user} cars={cars} rentals={rentals} />
  ) : (
    <ProfilePage user={user} cars={cars} rentals={rentals} />
  );
}
