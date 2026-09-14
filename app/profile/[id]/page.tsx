import l from '@/helper/en';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CarFront,
  Mail,
  MessageCircle,
  Phone,
  Star,
  UserRound,
} from 'lucide-react';
import OwnerProfileHeader from '@/components/OwnerProfileHeader';
import PublicOwnerCarCard, {
  PublicOwnerCar,
} from '@/components/PublicOwnerCarCard';
import connectToDatabase from '@/lib/db/mongoose';
import User, { IUser } from '@/lib/model/User';
import Car from '@/lib/model/car/Car';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import {
  canViewContactInfo,
  getProfilePageProjection,
} from '@/lib/profileAccess';
import mongoose from 'mongoose';

type ProfileUser = Pick<
  IUser,
  'name' | 'images' | 'rating' | 'ratingCount' | 'createdAt' | 'emailVerified'
> &
  Partial<Pick<IUser, 'email' | 'contactInfo'>>;

const PUBLIC_OWNER_CAR_PROJECTION =
  'make carModel city engine power seats carType firstRegistration milage averageConsumption images pricePerDay rating ratingCount';

async function getRenter(id: string, viewerId: string | undefined) {
  await connectToDatabase();
  const showContactInfo = await canViewContactInfo(viewerId, id);
  const projection = getProfilePageProjection(showContactInfo);
  const [user, cars] = await Promise.all([
    User.findById(id).select(projection).lean<ProfileUser>(),
    Car.find({ renter: id })
      .select(PUBLIC_OWNER_CAR_PROJECTION)
      .lean<PublicOwnerCar[]>(),
  ]);

  return { user, cars, showContactInfo };
}

export default async function RenterProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // Reject malformed IDs before they reach any MongoDB query.
  if (!mongoose.Types.ObjectId.isValid(params.id)) notFound();

  const session = await getServerSession(authOptions);
  const {
    user: renter,
    cars,
    showContactInfo,
  } = await getRenter(params.id, session?.user?.id);

  if (!renter) notFound();

  const rating = Number(renter.rating) || 0;
  const carCount = cars.length;
  const isEmailVerified = Boolean(renter.emailVerified);
  const memberSince = renter.createdAt
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric',
      }).format(new Date(renter.createdAt))
    : null;

  return (
    <div className="min-h-screen bg-surface pb-20 text-ink md:pb-0">
      <OwnerProfileHeader />

      <main>
        <section className="bg-ink">
          <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 md:pb-20 md:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
            >
              <ArrowLeft className="h-4 w-4" />
              {l.pages.backToCatalog}
            </Link>

            <div className="mt-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white/15 bg-slate-800 shadow-md md:h-32 md:w-32">
                <Image
                  src={renter.images?.[0] || '/placeholder-user.svg'}
                  alt={renter.name}
                  fill
                  priority
                  sizes="(min-width: 768px) 128px, 112px"
                  className="object-cover"
                />
              </div>

              <div className="w-full min-w-0 flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand/20">
                  <UserRound className="h-4 w-4" />
                  {l.profile.carOwner}
                </div>
                <h1 className="break-words font-heading text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {renter.name}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                  {l.profile.ownerIntro}
                </p>
              </div>

              <button
                type="button"
                disabled
                aria-describedby="message-owner-status"
                className="flex w-full shrink-0 cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-3.5 text-left opacity-80 sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 text-brand/70" />
                <span>
                  <span className="block text-sm font-bold text-white">
                    {l.profile.messageOwner}
                  </span>
                  <span
                    id="message-owner-status"
                    className="block text-[11px] text-slate-400"
                  >
                    {l.profile.comingSoon}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-7 max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-lg md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {l.profile.ownerProfile}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink">
                {l.profile.ownerAtGlance}
              </h2>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <p className="mt-3 font-heading text-lg font-bold text-ink">
                  {rating > 0 ? rating.toFixed(1) : l.profile.noRatingYet}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {renter.ratingCount
                    ? `${renter.ratingCount} ${l.reviews.ratings}`
                    : l.profile.rating}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CarFront className="h-5 w-5 text-brand" />
                <p className="mt-3 font-heading text-lg font-bold text-ink">
                  {carCount}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {l.profile.carsListed}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CalendarDays className="h-5 w-5 text-brand" />
                <p className="mt-3 text-sm font-semibold text-ink sm:text-base">
                  {memberSince ?? l.profile.notAvailable}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {l.profile.memberSinceLabel}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <BadgeCheck
                  className={`h-5 w-5 ${
                    isEmailVerified ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <p className="mt-3 text-sm font-semibold text-ink sm:text-base">
                  {isEmailVerified ? l.profile.verified : l.profile.notVerified}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {l.profile.emailStatus}
                </p>
              </div>
            </div>

            {showContactInfo && renter.email ? (
              <>
                <div className="my-8 border-t border-slate-200" />

                <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                  <div>
                    <h2 className="font-heading text-xl font-bold tracking-tight text-ink">
                      {l.profile.contactOwner}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {l.profile.contactDescription}
                    </p>
                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-tint p-4 text-brand/25">
                      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <p className="text-xs leading-5">
                        {l.profile.messagingNote}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <a
                      href={`mailto:${renter.email}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-brand/20 hover:bg-brand-tint/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <div className="inline-flex rounded-xl bg-brand-tint p-2.5 text-brand">
                        <Mail className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {l.profile.emailAddress}
                      </p>
                      <p className="mt-1 break-all text-sm font-bold text-slate-800 group-hover:text-brand/90">
                        {renter.email}
                      </p>
                    </a>

                    {renter.contactInfo ? (
                      <a
                        href={`tel:${renter.contactInfo}`}
                        className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-brand/20 hover:bg-brand-tint/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <div className="inline-flex rounded-xl bg-brand-tint p-2.5 text-brand">
                          <Phone className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                          {l.profile.phoneNumber}
                        </p>
                        <p className="mt-1 break-words text-sm font-bold text-slate-800 group-hover:text-brand/90">
                          {renter.contactInfo}
                        </p>
                      </a>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="inline-flex rounded-xl bg-slate-200 p-2.5 text-slate-500">
                          <Phone className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                          {l.profile.phoneNumber}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {l.profile.noPhoneNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {cars.length > 0 ? (
            <div className="mt-8">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  {l.profile.carOwner}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink">
                  {renter.name}&apos;s {l.profile.cars.toLowerCase()}
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                  <PublicOwnerCarCard key={car._id.toString()} car={car} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
