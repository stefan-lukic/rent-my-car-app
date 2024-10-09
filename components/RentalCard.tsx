import React from 'react';
import { ICar } from '@/lib/model/car/Car';

interface RentalCardProps {
  rental: {
    _id: string;
    car: ICar;
    rentalPeriod: {
      startDate: Date;
      endDate: Date;
    };
    totalCost: number;
  };
}

const RentalCard: React.FC<RentalCardProps> = ({ rental }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-semibold">{rental.car.carModel}</h3>
      <p>
        Rented from:{' '}
        {new Date(rental.rentalPeriod.startDate).toLocaleDateString()} to{' '}
        {new Date(rental.rentalPeriod.endDate).toLocaleDateString()}
      </p>
      <p>Total Cost: ${rental.totalCost}</p>
    </div>
  );
};

export default RentalCard;
