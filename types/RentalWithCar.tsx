import type { ICar } from '@/lib/model/car/Car';
import type { ClientReview } from './Review';

export enum RentalStatus {
  Active = 'active',
  Cancelled = 'cancelled',
}

export type RentalCarSummary = Pick<
  ICar,
  '_id' | 'make' | 'carModel' | 'city' | 'images' | 'pricePerDay'
> &
  Partial<Pick<ICar, 'carLocation' | 'renter'>>;

export type RentalWithCar = {
  _id: string;
  // Historical rentals can use a compact snapshot after the original car is deleted.
  car: RentalCarSummary | null;
  rentalPeriod: {
    startDate: string | Date;
    endDate: string | Date;
  };
  totalCost: number;
  status?: RentalStatus;
  // Keep the booking owner for cancellation attribution after listing changes.
  renter?: string;
  cancelledAt?: string | Date;
  cancelledBy?: string;
  clientReview?: ClientReview;
};
