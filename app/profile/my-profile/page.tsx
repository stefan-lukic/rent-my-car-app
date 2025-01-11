import { getBaseUrl } from '@/app/api/api';
import ProfilePage from '@/components/ProfilePage';
import { getServerSession } from 'next-auth/next';

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

  // change url for prod
  const userRes = await fetch(
    `${baseUrl}/api/users?email=${encodeURIComponent(session.user.email)}`
  );
  const user = await userRes.json();

  // change url for prod
  const carsRes = await fetch(`${baseUrl}/api/cars/my-cars?userId=${user._id}`);
  const cars = await carsRes.json();

  // change url for prod
  const rentalsRes = await fetch(
    `${baseUrl}/api/my-rentals?userId=${user._id}`
  );
  const rentals = await rentalsRes.json();

  return <ProfilePage user={user} cars={cars} rentals={rentals} />;
}
