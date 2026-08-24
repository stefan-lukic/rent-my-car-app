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
import ProfileInteractiveSection from './ProfileInteractiveSection';
import Header from '@/components/UI/Header';
import l from '@/helper/en';

interface ProfilePageProps {
  user: IUser;
  cars: ICar[];
  rentals: RentalWithCar[];
}

const ProfilePage = ({ user, cars, rentals }: ProfilePageProps) => {
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
      value: (user.rating ?? 0).toFixed(1),
      label: l.profile.rating,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-7 py-8 shadow-xl shadow-slate-200/70">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative flex items-center gap-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-4 border-white/15 bg-slate-800 shadow-lg">
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
                <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-200">
                  My account
                </span>
              </div>
              <h1 className="truncate text-3xl font-bold tracking-tight text-white">
                {user.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
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
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-slate-950">{value}</p>
                <p className="text-xs font-medium text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </section>

        <ProfileInteractiveSection cars={cars} rentals={rentals} />
      </main>
    </div>
  );
};

export default ProfilePage;
