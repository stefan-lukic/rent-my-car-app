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
    ratingCount?: number;
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
      className="group flex min-h-16 items-center gap-3 rounded-2xl border border-brand-light bg-brand-tint/70 p-3.5 transition hover:border-brand/60 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand/20 bg-white text-sm font-bold text-brand/90 shadow-sm">
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
          <p className="truncate font-heading text-sm font-semibold text-ink">
            {renter.name}
          </p>
          {renter.rating > 0 && (
            <span
              aria-label={l.profile.rating}
              className="flex items-center gap-1 text-xs text-amber-500"
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold text-body-muted">
                {renter.rating.toFixed(1)}
                {renter.ratingCount ? ` (${renter.ratingCount})` : ''}
              </span>
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-body">{l.profile.viewOwnerProfile}</p>
      </div>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-sm transition group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
};

export default RenterCard;
