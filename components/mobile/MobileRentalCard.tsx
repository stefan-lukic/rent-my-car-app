'use client';

import RentalCard from '../RentalCard';
import { RentalWithCar } from '@/types/RentalWithCar';

interface MobileRentalCardProps {
  rental: RentalWithCar;
  showStatus?: boolean;
  onCancel?: (rentalId: string) => void;
  currentDate: string;
  onReviewed?: (
    rentalId: string,
    review: NonNullable<RentalWithCar['clientReview']>
  ) => void;
}

const MobileRentalCard = (props: MobileRentalCardProps) => (
  <RentalCard {...props} />
);

export default MobileRentalCard;
