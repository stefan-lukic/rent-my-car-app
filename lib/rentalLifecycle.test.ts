import { describe, expect, it } from 'vitest';
import {
  canCancelRental,
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

describe('canCancelRental', () => {
  it('allows cancellation exactly 24 hours before the rental starts', () => {
    const rental = createRental('2026-09-02T12:00:00.000Z', '2026-09-05');

    expect(canCancelRental(rental, '2026-09-01T12:00:00.000Z')).toBe(true);
  });

  it('blocks cancellation when less than 24 hours remain', () => {
    const rental = createRental('2026-09-02T12:00:00.000Z', '2026-09-05');

    expect(canCancelRental(rental, '2026-09-01T12:00:00.001Z')).toBe(false);
  });

  it('never allows an already cancelled rental to be cancelled again', () => {
    const rental = createRental(
      '2026-09-05T12:00:00.000Z',
      '2026-09-07',
      RentalStatus.Cancelled
    );

    expect(canCancelRental(rental, '2026-09-01T12:00:00.000Z')).toBe(false);
  });
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
