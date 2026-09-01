import Rental from '@/lib/model/Rental';

export const PUBLIC_USER_PROFILE_PROJECTION = 'name images rating ratingCount';

const PUBLIC_PROFILE_PAGE_FIELDS = 'createdAt emailVerified';
const CONTACT_INFO_FIELDS = 'email contactInfo';

export function getProfilePageProjection(includeContactInfo: boolean): string {
  return [
    PUBLIC_USER_PROFILE_PROJECTION,
    PUBLIC_PROFILE_PAGE_FIELDS,
    includeContactInfo ? CONTACT_INFO_FIELDS : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export async function canViewContactInfo(
  viewerId: string | undefined,
  profileOwnerId: string
): Promise<boolean> {
  if (!viewerId) return false;
  if (viewerId === profileOwnerId) return true;

  // Rental periods are UTC calendar dates, so contact remains available
  // throughout the reserved return date.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const existingRental = await Rental.exists({
    client: viewerId,
    renter: profileOwnerId,
    status: 'active',
    'rentalPeriod.endDate': { $gte: today },
  });

  return Boolean(existingRental);
}
