export interface CarDetailsOwner {
  _id: string;
  name: string;
  rating: number;
  images: string[];
  createdAt?: string;
}

export interface CarDetailsData {
  _id: string;
  make: string;
  carModel: string;
  engine: string;
  power: string;
  seats?: number;
  carType: string;
  city: string;
  carLocation: string;
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
