import type { OwnerBooking } from '@/types/OwnerBooking';

type OwnerBookingForPrivacy = Partial<
  Pick<OwnerBooking, 'status' | 'rentalPeriod' | 'client'>
>;

const getStartOfUtcDay = (value: string | Date) => {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export function protectOwnerBookingContact(
  booking: OwnerBookingForPrivacy,
  currentDate: string | Date
): OwnerBookingForPrivacy {
  if (!booking.client) return booking;

  const rentalEndDate = booking.rentalPeriod?.endDate;
  const canViewContact =
    booking.status === 'active' &&
    rentalEndDate !== undefined &&
    getStartOfUtcDay(rentalEndDate) >= getStartOfUtcDay(currentDate);

  if (canViewContact) return booking;

  // Contact details must not leave the server after cancellation or completion.
  const {
    email: _email,
    contactInfo: _contactInfo,
    ...publicClient
  } = booking.client;

  return { ...booking, client: publicClient };
}
