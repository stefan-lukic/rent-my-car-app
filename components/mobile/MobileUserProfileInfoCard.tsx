import Image from 'next/image';

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    images?: string[];
    createdAt: Date;
  };
}

export default function MobileProfileUserInfoCard({
  user,
}: UserProfileCardProps) {
  return (
    <div className="flex flex-col items-center p-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md">
      <Image
        className="rounded-full shadow-md mb-1 border-2 border-white"
        src={user?.images?.[0] || ''}
        alt={user?.name || 'User'}
        width={70}
        height={70}
        priority={true}
      />
      <h2 className="text-sm font-semibold text-white text-center truncate w-full">
        {user.name}
      </h2>
      <p className="text-xs text-blue-100 text-center truncate w-full">
        {user.email}
      </p>
      <div className="p-2 w-full">
        <h2 className="text-sm font-semibold text-black mb-1">
          Account Information
        </h2>
        <p className="text-xs text-black">
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
