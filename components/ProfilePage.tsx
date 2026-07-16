import { ICar } from '@/lib/model/car/Car';
import { IUser } from '@/lib/model/User';
import Image from 'next/image';
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

  const StatItem = ({
    icon,
    value,
    label,
  }: {
    icon: string;
    value: string | number;
    label: string;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-lg">{icon}</span>
      <span className="text-base font-semibold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* privremeno da moze da se krece kroz app */}
      <div className="max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 flex items-center gap-6 overflow-hidden">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              <Image
                src={user?.images?.[0] || '/placeholder-user.svg'}
                alt={user?.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
            {/* ovako ce biti kada bude required contancInfo */}
            {/* <p className="text-blue-100 text-sm">{user.contactInfo}</p> */}
            <p className="text-blue-100 text-sm mt-0.5">
              {user.contactInfo || l.profile.noPhoneNumber}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-blue-200 text-xs">✓</span>
              <span className="text-blue-100 text-xs">
                {l.profile.memberSince(memberSince)}
              </span>
            </div>
          </div>

          {/* Edit Profile dugme ce biti kad se napravi na svojoj grani, za sada ne vodi nigde */}
          <button className="flex-shrink-0 bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
            {l.profile.editProfileBtn}
          </button>
          {/* <a
            href="/profile/edit"
            className="flex-shrink-0 bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            ✎ Edit Profile
          </a> */}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 py-4">
          <StatItem icon="🚗" value={cars.length} label={l.profile.cars} />
          <StatItem
            icon="📅"
            value={rentals.length}
            label={l.profile.rentals}
          />
          <StatItem
            icon="⭐"
            value={(user.rating ?? 0).toFixed(1)}
            label={l.profile.rating}
          />
        </div>

        <ProfileInteractiveSection cars={cars} rentals={rentals} />
      </div>
    </div>
  );
};

export default ProfilePage;
