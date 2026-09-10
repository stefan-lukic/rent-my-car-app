import type { OwnerReview } from './Review';

export type OwnerBooking = {
  _id: string;
  car: {
    _id: string;
    make: string;
    carModel: string;
    images?: string[];
    city?: string;
    carLocation?: string;
  } | null;
  client: {
    _id: string;
    name: string;
    email?: string;
    contactInfo?: string;
    images?: string[];
    rating?: number;
    ratingCount?: number;
  } | null;
  carLocation: string;
  rentalPeriod: {
    startDate: string | Date;
    endDate: string | Date;
  };
  totalCost: number;
  status?: 'active' | 'cancelled';
  ownerReview?: OwnerReview;
};
