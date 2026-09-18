export interface CarDetailsOwner {
  _id: string;
  name: string;
  rating: number;
  images: string[];
  createdAt?: string;
}

export interface CarDetailsData {
  // Public car details deliberately omit the private pickup address.
  _id: string;
  make: string;
  carModel: string;
  engine: string;
  power: string;
  seats?: number;
  carType: string;
  city: string;
  firstRegistration?: string;
  milage: number;
  averageConsumption: string;
  images: string[];
  pricePerDay: number;
  description?: string;
  rating?: number;
  ratingCount?: number;
  renter: string;
  owner: CarDetailsOwner | null;
  bookedPeriods: Array<{
    startDate: string;
    endDate: string;
  }>;
}
