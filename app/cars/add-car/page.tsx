'use client';

import MobileAddCar from '@/components/mobile/MobileAddCar';
import AddCar from '@/components/AddCar';
import { useState, useEffect } from 'react';

export default function AddCarPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 680);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white md:pt-24 pb-12 relative">
      {isMobile ? <MobileAddCar /> : <AddCar />}
    </main>
  );
}
//ovo sam ubacio jer je server i browser su renderovali razlicite komponete pa je next pucao tj. izbacivao je hydration error
