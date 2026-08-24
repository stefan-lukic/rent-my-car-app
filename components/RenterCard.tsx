import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import l from '@/helper/en';

interface RenterCardProps {
  renter: {
    _id: string;
    name: string;
    rating: number;
    images?: string[];
    profilePicture?: string;
  };
}

const RenterCard: React.FC<RenterCardProps> = ({ renter }) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const profileImage = renter.images?.[0] || renter.profilePicture;

  return (
    <Link
      href={`/profile/${renter._id}`}
      className="group flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 p-3.5 shadow-sm transition hover:border-blue-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold text-blue-200">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={renter.name}
            fill
            className="object-cover"
          />
        ) : (
          getInitials(renter.name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-white">{renter.name}</p>
          {renter.rating > 0 && (
            <span
              aria-label={l.profile.rating}
              className="flex items-center gap-1 text-xs text-amber-400"
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold text-slate-300">
                {renter.rating.toFixed(1)}
              </span>
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-400">
          {l.profile.viewOwnerProfile}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 text-blue-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
};

export default RenterCard;
