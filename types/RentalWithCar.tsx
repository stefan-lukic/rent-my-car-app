import { ICar } from '@/lib/model/car/Car';

export type RentalWithCar = {
  _id: string;
  car: ICar;
  rentalPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalCost: number;
};
