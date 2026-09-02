import MobileAddCar from '@/components/mobile/MobileAddCar';
import AddCar from '@/components/AddCar';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

export default async function AddCarPage() {
  // Middleware checks the cookie; this server check enforces session revocation.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/cars/add-car');
  }

  const isMobile = isMobileSSR();
  return (
    <div className="h-screen overflow-y-auto bg-slate-50">
      <main>{isMobile ? <MobileAddCar /> : <AddCar />}</main>
    </div>
  );
}
