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
  // Keep the booking owner for cancellation attribution after listing changes.
  renter?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  clientReview?: ClientReview;
};
