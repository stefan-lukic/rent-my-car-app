import { ICar } from '@/lib/model/car/Car';

export type RentalWithCar = {
  _id: string;
  car: ICar | null;
  rentalPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalCost: number;
  status?: 'active' | 'cancelled';
  cancelledAt?: Date;
  cancelledBy?: string;
};
