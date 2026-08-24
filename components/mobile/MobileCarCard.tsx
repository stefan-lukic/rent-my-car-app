'use client';

import { ICar } from '@/lib/model/car/Car';
import CarCard from '../CarCard';

interface MobileCarCardProps {
  car: ICar;
  onUpdate: (car: ICar) => void;
  onDeleteClick: (id: string) => void;
}

const MobileCarCard = ({
  car,
  onUpdate,
  onDeleteClick,
}: MobileCarCardProps) => (
  <CarCard
    car={car}
    onUpdate={onUpdate}
    onDeleteClick={(selectedCar) => onDeleteClick(selectedCar._id)}
  />
);

export default MobileCarCard;
