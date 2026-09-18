import MobileAddCar from '@/components/mobile/MobileAddCar';
import AddCar from '@/components/AddCar';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import GooglePlacesScript from '@/components/GooglePlacesScript';

export default async function AddCarPage() {
  // Middleware checks the cookie; this server check enforces session revocation.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/cars/add-car');
  }

  const isMobile = isMobileSSR();
  return (
    <>
      {/* Load Places from the server for both add-car layouts. */}
      <GooglePlacesScript />
      {/* Use document scrolling so the shared header does not create a nested viewport. */}
      <div className="min-h-full bg-surface">
        <main>{isMobile ? <MobileAddCar /> : <AddCar />}</main>
      </div>
    </>
  );
}
