'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ICar } from '@/lib/model/car/Car';
import { useParams } from 'next/navigation';

export default function ViewCar() {
  const { id } = useParams();
  const [car, setCar] = useState<ICar | null>(null);

  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      if (response.ok) {
        const carData = await response.json();
        setCar(carData);
      } else {
        console.error('Failed to fetch car details');
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {car.make} {car.carModel}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {car.image && (
            <Image
              src={car.image}
              alt={`${car.make} ${car.carModel}`}
              width={500}
              height={300}
              className="rounded-lg"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Car Details</h2>
          <ul className="space-y-2">
            <li>
              <strong>Make:</strong> {car.make}
            </li>
            <li>
              <strong>Model:</strong> {car.carModel}
            </li>
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
    </div>
  );
}
