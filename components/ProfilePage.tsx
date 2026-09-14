import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  Mail,
  Pencil,
  Phone,
  Star,
} from 'lucide-react';
import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import { RentalWithCar } from '@/types/RentalWithCar';
import { OwnerBooking } from '@/types/OwnerBooking';
import ProfileInteractiveSection from './ProfileInteractiveSection';
import IncomingBookingsSection from './IncomingBookingsSection';
import Header from '@/components/UI/Header';
import l from '@/helper/en';

interface ProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
  ownerBookings: OwnerBooking[];
  currentDate: string;
}

const ProfilePage = ({
  user,
  cars,
  rentals,
  ownerBookings,
  currentDate,
}: ProfilePageProps) => {
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const visibleRentalsCount = rentals.filter(
    (rental) => rental.car !== null
  ).length;

  const stats = [
    { icon: CarFront, value: cars.length, label: l.profile.cars },
    {
      icon: CalendarDays,
      value: visibleRentalsCount,
      label: l.profile.rentals,
    },
    {
      icon: Star,
      value: user.ratingCount
        ? (user.rating ?? 0).toFixed(1)
        : l.profile.noRatingYet,
      label: l.profile.rating,
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8">
        <section className="overflow-hidden rounded-2xl bg-ink px-7 py-8 shadow-md">
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white/15 bg-slate-800 shadow-sm">
              <Image
                src={user.images?.[0] || '/placeholder-user.svg'}
                alt={user.name}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand/20">
                  My account
                </span>
              </div>
              <h1 className="truncate font-heading text-3xl font-bold tracking-tight text-white">
                {user.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand/70" />
                  {user.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand/70" />
                  {user.contactInfo || l.profile.noPhoneNumber}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {l.profile.memberSince(memberSince)}
                </span>
              </div>
            </div>

            <Link
              href="/profile/edit"
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Pencil className="h-4 w-4" />
              {l.profile.editProfile}
            </Link>
          </div>
        </section>

        <section
          aria-label="Profile statistics"
          className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div
              key={label}
              className={`flex items-center justify-center gap-4 px-6 py-5 ${
                index > 0 ? 'border-l border-slate-200' : ''
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-xl font-bold text-ink">
                  {value}
                </p>
                <p className="text-xs font-medium text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </section>

        <IncomingBookingsSection
          bookings={ownerBookings}
          currentDate={currentDate}
        />

        <ProfileInteractiveSection
          cars={cars}
          rentals={rentals}
          currentDate={currentDate}
        />
      </main>
    </div>
  );
};

export default ProfilePage;
