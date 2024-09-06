import React, { useState } from 'react';
import { ICar } from '@/lib/model/car/Car';
import BookingDialog from './BookNowDialog';

interface SearchResultsProps {
  cars: ICar[];
  startDate: Date | null;
  endDate: Date | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  cars,
  startDate,
  endDate,
}) => {
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);

  if (cars.length === 0) return null;

  const handleBookNow = async (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!selectedCar) return;

    try {
      const response = await fetch('/api/book-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: selectedCar._id,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        alert('Booking successful!');
        setSelectedCar(null);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error booking car:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover transform"
                src={car.image || '/placeholder-car.jpg'}
                alt={car.carModel}
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{car.carModel}</h3>
                <p className="text-gray-600">{car.city}</p>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  ${car.pricePerDay}/day
                </span>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => setSelectedCar(car)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedCar && (
        <BookingDialog
          car={selectedCar}
          isOpen={!!selectedCar}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelectedCar(null)}
          onBook={() => handleBookNow(startDate, endDate)}
        />
      )}
    </div>
  );
};

export default SearchResults;
