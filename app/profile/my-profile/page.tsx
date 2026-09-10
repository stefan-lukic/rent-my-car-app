import l from '@/helper/en';
import MobileProfilePage from '@/components/mobile/MobileProfilePage';
import ProfilePage from '@/components/ProfilePage';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import Car from '@/lib/model/car/Car';
import Rental from '@/lib/model/Rental';
import { protectOwnerBookingContact } from '@/lib/ownerBookingPrivacy';
import type { OwnerBooking } from '@/types/OwnerBooking';

type SerializedRental = Partial<
  Pick<OwnerBooking, 'status' | 'rentalPeriod' | 'client'>
> & {
  car: unknown | null;
  carSnapshot?: {
    carId: string;
    make: string;
    carModel: string;
    images?: string[];
    city: string;
    carLocation: string;
    pricePerDay: number;
  } | null;
  [key: string]: unknown;
};

const restoreHistoricalCar = (rental: SerializedRental) => {
  const { carSnapshot, ...rentalData } = rental;

  if (rental.car || !carSnapshot) {
    return rentalData;
  }

  const { carId, ...carData } = carSnapshot;
  return {
    ...rentalData,
    car: { _id: carId, ...carData },
  };
};

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  try {
    await connectToDatabase();

    const [
      userDocument,
      carsDocuments,
      rentalsDocuments,
      ownerBookingsDocuments,
    ] = await Promise.all([
      User.findById(session.user.id)
        .select('name email contactInfo images rating ratingCount createdAt')
        .lean(),
      Car.find({ renter: session.user.id }).lean(),
      Rental.find({ client: session.user.id }).populate('car').lean(),
      Rental.find({ renter: session.user.id })
        .sort({ 'rentalPeriod.startDate': 1 })
        .populate('car', 'make carModel images city carLocation')
        .populate('client', 'name email contactInfo images rating ratingCount')
        .lean(),
    ]);

    if (!userDocument) {
      throw new Error(l.errors.errorFetchingUser);
    }

    const [user, cars, serializedRentals, serializedOwnerBookings] = JSON.parse(
      JSON.stringify([
        userDocument,
        carsDocuments,
        rentalsDocuments,
        ownerBookingsDocuments,
      ])
    );
    const rentals = serializedRentals.map(restoreHistoricalCar);
    const currentDate = new Date().toISOString();
    const ownerBookings = serializedOwnerBookings
      .map(restoreHistoricalCar)
      .map((booking: SerializedRental) =>
        protectOwnerBookingContact(booking, currentDate)
      );

    const isMobile = isMobileSSR();

    return isMobile ? (
      <MobileProfilePage
        user={user}
        cars={cars}
        rentals={rentals}
        ownerBookings={ownerBookings}
        currentDate={currentDate}
      />
    ) : (
      <ProfilePage
        user={user}
        cars={cars}
        rentals={rentals}
        ownerBookings={ownerBookings}
        currentDate={currentDate}
      />
    );
  } catch (error) {
    console.error('Failed to load profile page:', error);
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        {l.pages.errorFallback}
      </div>
    );
  }
}
