'use client';

import MobileAddCar from '@/components/mobile/MobileAddCar';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';
import { useAddCar } from '@/hooks/useAddCar';
import AddCar from '@/components/AddCar';

export default function AddCarPage() {
  const {
    carData,
    isSubmitting,
    showSuccess,
    handleInputChange,
    handleDateChange,
    handleSubmit,
  } = useAddCar();

  const isMobile = isMobileCSR();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 relative">
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 mb-6">
              Your car has been successfully added. Redirecting to your
              profile...
            </p>
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {isMobile ? (
        <MobileAddCar
          carData={carData}
          isSubmitting={isSubmitting}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <AddCar
          carData={carData}
          isSubmitting={isSubmitting}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
        />
      )}
    </main>
  );
}
