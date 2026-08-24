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
import l from '@/helper/en';

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    contactInfo?: string;
    images?: string[];
    createdAt: Date;
    rating?: number;
  };
  carsCount: number;
  rentalsCount: number;
}

export default function MobileProfileUserInfoCard({
  user,
  carsCount,
  rentalsCount,
}: UserProfileCardProps) {
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const stats = [
    { icon: CarFront, value: carsCount, label: l.profile.cars },
    { icon: CalendarDays, value: rentalsCount, label: l.profile.rentals },
    {
      icon: Star,
      value: (user.rating ?? 0).toFixed(1),
      label: l.profile.rating,
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 shadow-lg shadow-slate-200">
      <div className="relative px-5 pb-5 pt-6">
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-blue-500/25 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-800">
            <Image
              src={user.images?.[0] || '/placeholder-user.svg'}
              alt={user.name || 'User'}
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
              My account
            </p>
            <h1 className="mt-1 truncate text-xl font-bold text-white">
              {user.name}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-300">
              <Mail className="h-3.5 w-3.5 text-blue-400" />
              {user.email}
            </p>
          </div>

          <Link
            href="/profile/edit"
            aria-label={l.profile.editProfile}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm transition hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative mt-5 grid gap-2 text-xs text-slate-300">
          <p className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-blue-400" />
            {user.contactInfo || l.profile.noPhoneNumber}
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {l.profile.memberSince(memberSince)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10 bg-white/[0.04]">
        {stats.map(({ icon: Icon, value, label }, index) => (
          <div
            key={label}
            className={`flex flex-col items-center py-4 ${
              index > 0 ? 'border-l border-white/10' : ''
            }`}
          >
            <Icon className="mb-1 h-4 w-4 text-blue-400" />
            <span className="text-base font-bold text-white">{value}</span>
            <span className="text-[11px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
