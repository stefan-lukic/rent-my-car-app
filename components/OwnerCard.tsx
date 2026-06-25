import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OwnerCardProps {
  owner: {
    _id: string;
    name: string;
    rating: number;
    images?: string[];
    profilePicture?: string;
  };
}

const OwnerCard: React.FC<OwnerCardProps> = ({ owner }) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const profileImage = owner.images?.[0] || owner.profilePicture;

  return (
    <Link href={`/profile/${owner._id}`}>
      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-semibold text-sm">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={owner.name}
              fill
              className="object-cover"
            />
          ) : (
            getInitials(owner.name)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {owner.name}
            </p>
            {owner.rating > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                <span>★</span>
                <span className="text-gray-600 font-medium">
                  {owner.rating.toFixed(1)}
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

export default OwnerCard;
