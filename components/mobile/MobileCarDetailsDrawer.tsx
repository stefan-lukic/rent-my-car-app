import React, { useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import OwnerCard from '../OwnerCard';
import HowItWorksModal from '../HowItWorksModal';

export interface IOwner {
  name: string;
  email: string;
  contactInfo: string;
  profilePicture?: string;
  rating: number;
  images?: string[];
}

interface CarDetailsDrawerProps {
  car: ICar | null;
  owner: IOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
}

const MobileCarDetailsDrawer: React.FC<CarDetailsDrawerProps> = ({
  car,
  owner,
  isOpen,
  onClose,
  onBookNow,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75">
      <div className="fixed inset-0 bg-white sm:max-w-md sm:ml-auto sm:rounded-t-lg sm:shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Car Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    car.images?.[currentImageIndex] || '/placeholder-car.svg'
                  }
                  alt={`${car.make} ${car.carModel}`}
                  width={500}
                  height={300}
                  className="object-cover"
                />
              </div>
              {car.images && car.images.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-4">
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className={`p-2 text-white bg-gray-800 bg-opacity-75 rounded-full ${
                      currentImageIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === car.images.length - 1}
                    className={`p-2 text-white bg-gray-800 bg-opacity-75 rounded-full ${
                      currentImageIndex === car.images.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900">
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

            {owner ? (
              <OwnerCard owner={owner} />
            ) : (
              <div className="mt-4 h-16 bg-gray-100 rounded-lg animate-pulse" />
            )}

            <button
              onClick={handleOpenModal}
              className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600"
            >
              See How It Works
            </button>

            <HowItWorksModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCarDetailsDrawer;
