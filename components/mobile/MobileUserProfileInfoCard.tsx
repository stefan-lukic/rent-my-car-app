import Image from 'next/image';
import l from '@/helper/en';
import Link from 'next/link';

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

  const StatItem = ({
    icon,
    value,
    label,
  }: {
    icon: string;
    value: string | number;
    label: string;
  }) => (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-base">{icon}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-blue-400 to-blue-600">
        <Image
          className="rounded-full shadow-md border-2 border-white object-cover"
          src={user?.images?.[0] || '/placeholder-user.svg'}
          alt={user?.name || 'User'}
          width={56}
          height={56}
          priority
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-white truncate">
            {user.name}
          </h2>
          <p className="text-xs text-blue-100 truncate">
            {user.contactInfo || l.profile.noPhoneNumber}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-blue-200 text-xs">✓</span>
            <span className="text-blue-100 text-xs">
              {l.profile.memberSince(memberSince)}
            </span>
          </div>
        </div>
        <Link
          href="/profile/edit"
          className="flex-shrink-0 bg-white text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ✎
        </Link>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-100 py-3">
        <StatItem icon="🚗" value={carsCount} label={l.profile.cars} />
        <StatItem icon="📅" value={rentalsCount} label={l.profile.rentals} />
        <StatItem
          icon="⭐"
          value={(user.rating ?? 0).toFixed(1)}
          label={l.profile.rating}
        />
      </div>
    </div>
  );
}
