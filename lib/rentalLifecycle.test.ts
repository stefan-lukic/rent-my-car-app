import { describe, expect, it } from 'vitest';
import {
  getRentalLifecycleStatus,
  RentalLifecycleStatus,
} from './rentalLifecycle';
import { RentalStatus } from '@/types/RentalWithCar';

const createRental = (
  startDate: string,
  endDate: string,
  status = RentalStatus.Active
) => ({
  status,
  rentalPeriod: { startDate, endDate },
});

describe('getRentalLifecycleStatus', () => {
  it('marks a future reservation as upcoming', () => {
    const rental = createRental('2026-09-01', '2026-09-05');

    expect(getRentalLifecycleStatus(rental, '2026-08-25')).toBe(
      RentalLifecycleStatus.Upcoming
    );
  });

  it('marks both the start and end date as ongoing', () => {
    const rental = createRental('2026-09-01', '2026-09-05');

    expect(getRentalLifecycleStatus(rental, '2026-09-01')).toBe(
      RentalLifecycleStatus.Ongoing
    );
    expect(getRentalLifecycleStatus(rental, '2026-09-05')).toBe(
      RentalLifecycleStatus.Ongoing
    );
  });

  it('marks a past reservation as completed', () => {
    const rental = createRental('2026-09-01', '2026-09-05');

    expect(getRentalLifecycleStatus(rental, '2026-09-06')).toBe(
      RentalLifecycleStatus.Completed
    );
  });

  it('keeps a cancelled reservation cancelled regardless of its dates', () => {
    const rental = createRental(
      '2026-09-01',
      '2026-09-05',
      RentalStatus.Cancelled
    );

    expect(getRentalLifecycleStatus(rental, '2026-08-25')).toBe(
      RentalLifecycleStatus.Cancelled
    );
  });
});
