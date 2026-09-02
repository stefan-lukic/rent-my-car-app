import { RentalStatus } from '@/types/RentalWithCar';

export enum RentalLifecycleStatus {
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export type RentalStatusFilterValue = 'all' | RentalLifecycleStatus;

const CANCELLATION_CUTOFF_MS = 24 * 60 * 60 * 1000;

type RentalLifecycleInput = {
  status?: RentalStatus | 'active' | 'cancelled';
  rentalPeriod: {
    startDate: string | Date;
    endDate: string | Date;
  };
};

const getUtcDay = (value: string | Date) => {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export function canCancelRental(
  rental: RentalLifecycleInput,
  currentDate: string | Date
) {
  if (rental.status === RentalStatus.Cancelled) return false;

  const startTime = new Date(rental.rentalPeriod.startDate).getTime();
  const currentTime = new Date(currentDate).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(currentTime))
    return false;

  // Exactly 24 hours before the rental starts is still inside the allowed window.
  return startTime - currentTime >= CANCELLATION_CUTOFF_MS;
}

export function getRentalLifecycleStatus(
  rental: RentalLifecycleInput,
  currentDate: string | Date
): RentalLifecycleStatus {
  if (rental.status === RentalStatus.Cancelled) {
    return RentalLifecycleStatus.Cancelled;
  }

  const today = getUtcDay(currentDate);
  const startDate = getUtcDay(rental.rentalPeriod.startDate);
  const endDate = getUtcDay(rental.rentalPeriod.endDate);

  if (today < startDate) return RentalLifecycleStatus.Upcoming;
  if (today > endDate) return RentalLifecycleStatus.Completed;

  return RentalLifecycleStatus.Ongoing;
}
