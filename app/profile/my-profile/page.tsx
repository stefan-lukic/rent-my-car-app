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
import type { RentalWithCar, RentalStatus } from '@/types/RentalWithCar';
import type { ICar } from '@/lib/model/car/Car';
import type { IUser } from '@/lib/model/User';
import GooglePlacesScript from '@/components/GooglePlacesScript';

type SerializedCar = Pick<
  ICar,
  '_id' | 'make' | 'carModel' | 'city' | 'images' | 'pricePerDay'
> &
  Partial<Pick<ICar, 'carLocation' | 'renter'>>;

type SerializedRental = {
  _id: string;
  car: SerializedCar | null;
  rentalPeriod: RentalWithCar['rentalPeriod'];
  totalCost: number;
  status?: RentalStatus;
  renter?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  clientReview?: RentalWithCar['clientReview'];
  carSnapshot?: {
    carId: string;
    make: string;
    carModel: string;
    images?: string[];
    city: string;
    carLocation: string;
    pricePerDay: number;
  } | null;
};

type SerializedOwnerBooking = OwnerBooking & {
  carSnapshot?: SerializedRental['carSnapshot'];
};

const restoreHistoricalCar = <
  Rental extends SerializedRental | SerializedOwnerBooking,
>(
  rental: Rental
) => {
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

const reusePopulatedCars = <
  Car extends { _id: string },
  Rental extends { car: Car | null },
>(
  rentals: Rental[]
) => {
  const carCache = new Map<string, Car>();

  return rentals.map((rental) => {
    if (!rental.car) return rental;

    const carId = rental.car._id.toString();
    const cachedCar = carCache.get(carId);
    if (cachedCar) return { ...rental, car: cachedCar };

    carCache.set(carId, rental.car);
    return rental;
  });
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
      Rental.find({ client: session.user.id })
        .select(
          'car renter rentalPeriod totalCost status cancelledAt cancelledBy clientReview carSnapshot'
        )
        .populate('car', 'make carModel images city pricePerDay renter')
        .lean(),
      Rental.find({ renter: session.user.id })
        .select(
          'car client carLocation rentalPeriod totalCost status ownerReview carSnapshot'
        )
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
    ) as [IUser, ICar[], SerializedRental[], SerializedOwnerBooking[]];

    const rentals = reusePopulatedCars(
      serializedRentals.map(restoreHistoricalCar)
    ) as RentalWithCar[];
    const currentDate = new Date().toISOString();
    const restoredOwnerBookings = reusePopulatedCars(
      serializedOwnerBookings.map(restoreHistoricalCar)
    ) as SerializedOwnerBooking[];
    const ownerBookings = restoredOwnerBookings.map((booking) => {
      const compactBooking = {
        ...booking,
        car: booking.car
          ? { ...booking.car, images: booking.car.images?.slice(0, 1) }
          : null,
        client:
          'client' in booking && booking.client
            ? {
                ...booking.client,
                images: booking.client.images?.slice(0, 1),
              }
            : null,
      } as OwnerBooking;
      const protectedBooking = protectOwnerBookingContact(
        compactBooking,
        currentDate
      );

      return {
        ...compactBooking,
        client: protectedBooking.client ?? null,
      };
    });

    const isMobile = isMobileSSR();

    return (
      <>
        {/* Share the server-loaded Places script with the update-car modal. */}
        <GooglePlacesScript />
        {isMobile ? (
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
        )}
      </>
    );
  } catch (error) {
    console.error('Failed to load profile page:', error);
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4 text-center text-body-subtle">
        {l.pages.errorFallback}
      </main>
    );
  }
}
