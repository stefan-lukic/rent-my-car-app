import React, { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import HowItWorksModal from './HowItWorksModal';
import { howItWorksContent, howItWorksIcons } from '@/helper/constants';
import OwnerCard from './OwnerCard';

interface CarDetailsDrawerProps {
  car: ICar | null;
  owner: {
    name: string;
    email: string;
    contactInfo: string;
    profilePicture: string;
    rating: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const CarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  car,
  owner,
  isOpen,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for current image index

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    if (car && car.images && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (!car || !isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Car Details
                  </h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-8">
                  <div className="relative">
                    <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                      <Image
                        src={
                          car.images?.[currentImageIndex] ||
                          '/placeholder-car.jpg'
                        }
                        alt={`${car.make} ${car.carModel}`}
                        width={500}
                        height={300}
                        className="object-center object-cover"
                      />
                    </div>
                    {car.images && car.images.length > 1 && (
                      <div className="absolute inset-0 flex justify-between items-center">
                        <button
                          className={`text-white p-4 rounded-full hover:bg-gray-700 transition-colors text-3xl ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handlePrevImage}
                          disabled={currentImageIndex === 0}
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          className={`text-white p-4 rounded-full hover:bg-gray-700 transition-colors text-3xl ${currentImageIndex === car.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleNextImage}
                          disabled={currentImageIndex === car.images.length - 1}
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {car.make} {car.carModel}
                    </h2>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <strong>Engine:</strong> {car.engine}
                      </li>
                      <li>
                        <strong>Power:</strong> {car.power}
                      </li>
                      <li>
                        <strong>Type:</strong> {car.carType}
                      </li>
                      <li>
                        <strong>City:</strong> {car.city}
                      </li>
                      <li>
                        <strong>First Registration:</strong>{' '}
                        {car.firstRegistration
                          ? new Date(car.firstRegistration).toLocaleDateString()
                          : 'N/A'}
                      </li>
                      <li>
                        <strong>Price per Day:</strong> ${car.pricePerDay}
                      </li>
                    </ul>
                  </div>
                </div>

                <OwnerCard owner={owner} />

                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleOpenModal}
                >
                  See How It Works
                </button>

                <HowItWorksModal
                  title="How It Works"
                  isOpen={isModalOpen}
                  content={howItWorksContent}
                  icons={howItWorksIcons}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CarDetailsDrawer;
