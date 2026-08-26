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
import connectToDatabase from '@/lib/db/mongoose';
import User, { IUser } from '@/lib/model/User';

async function getRenter(id: string) {
  await connectToDatabase();
  const user = await User.findById(id).lean<IUser>();
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export default async function RenterProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const renter = await getRenter(params.id);

  if (!renter) notFound();

  const rating = Number(renter.rating) || 0;
  const carCount = renter.cars?.length ?? 0;
  const isEmailVerified = Boolean(renter.emailVerified);
  const memberSince = renter.createdAt
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric',
      }).format(new Date(renter.createdAt))
    : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 md:pb-0">
      <OwnerProfileHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.32),_transparent_45%)]" />
          <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 md:pb-20 md:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              {l.pages.backToCatalog}
            </Link>

            <div className="mt-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white/15 bg-slate-800 shadow-2xl shadow-blue-950/40 md:h-32 md:w-32">
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
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
                  <UserRound className="h-4 w-4" />
                  {l.profile.carOwner}
                </div>
                <h1 className="break-words text-3xl font-black tracking-tight text-white md:text-4xl">
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
                <MessageCircle className="h-5 w-5 text-blue-400" />
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
          <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {l.profile.ownerProfile}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                {l.profile.ownerAtGlance}
              </h2>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <p className="mt-3 text-lg font-black text-slate-900">
                  {rating > 0 ? rating.toFixed(1) : l.profile.noRatingYet}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {renter.ratingCount
                    ? `${renter.ratingCount} ${l.reviews.ratings}`
                    : l.profile.rating}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CarFront className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-lg font-black text-slate-900">
                  {carCount}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {l.profile.carsListed}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-sm font-black text-slate-900 sm:text-base">
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
                <p className="mt-3 text-sm font-black text-slate-900 sm:text-base">
                  {isEmailVerified ? l.profile.verified : l.profile.notVerified}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {l.profile.emailStatus}
                </p>
              </div>
            </div>

            <div className="my-8 border-t border-slate-200" />

            <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  {l.profile.contactOwner}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {l.profile.contactDescription}
                </p>
                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-blue-900">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="text-xs leading-5">{l.profile.messagingNote}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={`mailto:${renter.email}`}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="inline-flex rounded-xl bg-blue-100 p-2.5 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {l.profile.emailAddress}
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-slate-800 group-hover:text-blue-700">
                    {renter.email}
                  </p>
                </a>

                {renter.contactInfo ? (
                  <a
                    href={`tel:${renter.contactInfo}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="inline-flex rounded-xl bg-blue-100 p-2.5 text-blue-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {l.profile.phoneNumber}
                    </p>
                    <p className="mt-1 break-words text-sm font-bold text-slate-800 group-hover:text-blue-700">
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
          </div>
        </section>
      </main>
    </div>
  );
}
