import MobileAddCar from '@/components/mobile/MobileAddCar';
import AddCar from '@/components/AddCar';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';

export default function AddCarPage() {
  const isMobile = isMobileSSR();
  return (
    <div className="h-screen overflow-y-auto bg-slate-50">
      <main>{isMobile ? <MobileAddCar /> : <AddCar />}</main>
    </div>
  );
}
