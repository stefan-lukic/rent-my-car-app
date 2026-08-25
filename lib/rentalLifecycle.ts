import { RentalStatus } from '@/types/RentalWithCar';

export enum RentalLifecycleStatus {
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export type RentalStatusFilterValue = 'all' | RentalLifecycleStatus;

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
