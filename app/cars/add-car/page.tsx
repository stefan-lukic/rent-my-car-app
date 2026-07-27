'use client';

import MobileAddCar from '@/components/mobile/MobileAddCar';
import AddCar from '@/components/AddCar';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';

export default function AddCarPage() {
  const isMobile = isMobileCSR();
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white md:pt-24 pb-12 relative">
      {isMobile ? <MobileAddCar /> : <AddCar />}
    </main>
  );
}
