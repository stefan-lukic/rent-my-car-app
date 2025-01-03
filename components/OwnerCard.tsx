import React from 'react';

interface OwnerCardProps {
  owner: {
    name: string;
    email: string;
    contactInfo: string;
    profilePicture: string;
    rating: number;
  };
}

const OwnerCard: React.FC<OwnerCardProps> = ({ owner }) => {
  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
      <img
        src={owner.profilePicture}
        alt={`${owner.name}'s profile`}
        className="w-16 h-16 rounded-full mr-4"
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
