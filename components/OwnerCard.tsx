import React from 'react';
import Image from 'next/image';

interface OwnerCardProps {
  owner: {
    name: string;
    email: string;
    contactInfo: string;
    profilePicture: string;
    rating: number;
    images?: string[];
  };
}

const OwnerCard: React.FC<OwnerCardProps> = ({ owner }) => {
  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
      <Image
        src={owner.images?.[0] || '/placeholder-car.jpg'}
        alt={owner.name}
        width={80}
        height={80}
        className="object-cover rounded-xl mr-4"
      />
      <div>
        <h3 className="text-lg font-semibold">{owner.name}</h3>
        <p className="text-gray-600">{owner.email}</p>
        <p className="text-gray-600">{owner.contactInfo}</p>
        <p className="text-yellow-500">Rating: {owner.rating} ★</p>
      </div>
    </div>
  );
};

export default OwnerCard;
