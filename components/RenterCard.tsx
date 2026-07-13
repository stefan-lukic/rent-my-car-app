import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    <Link href={`/profile/${renter._id}`}>
      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-semibold text-sm">
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {renter.name}
            </p>
            {renter.rating > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                <span>★</span>
                <span className="text-gray-600 font-medium">
                  {renter.rating.toFixed(1)}
                </span>
              </span>
            )}
          </div>
        </div>

        <span className="text-gray-400 text-sm group-hover:translate-x-0.5 transition-transform">
          →
        </span>
      </div>
    </Link>
  );
};

export default RenterCard;
