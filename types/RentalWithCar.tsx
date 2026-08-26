import { ICar } from '@/lib/model/car/Car';
import type { ClientReview } from './Review';

export enum RentalStatus {
  Active = 'active',
  Cancelled = 'cancelled',
}

export type RentalWithCar = {
  _id: string;
  car: ICar;
  rentalPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalCost: number;
  status?: RentalStatus;
  cancelledAt?: Date;
  cancelledBy?: string;
  clientReview?: ClientReview;
};
