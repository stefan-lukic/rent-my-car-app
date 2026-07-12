import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RenterCardProps {
  renter: {
    _id: string;
    name: string;
    email: string;
    contactInfo: string;
    profilePicture?: string;
    rating: number;
    images?: string[];
  };
}

const RenterCard: React.FC<RenterCardProps> = ({ renter }) => {
  return (
    <Link href={`/profile/${renter._id}`}>
      <div className="flex items-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <Image
          src={renter.images?.[0] || '/placeholder-car.jpg'}
          alt={renter.name}
          width={80}
          height={80}
          className="object-cover rounded-xl mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{renter.name}</h3>
          <p className="text-gray-600">{renter.email}</p>
          <p className="text-gray-600">{renter.contactInfo}</p>
          <p className="text-yellow-500">Rating: {renter.rating} ★</p>
        </div>
      </div>
    </Link>
  );
};

export default RenterCard;
