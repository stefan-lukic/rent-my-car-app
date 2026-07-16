import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';

export type CarData = {
  make: CarMake;
  carModel: string;
  engine: CarEngineType;
  power: string;
  carType: CarType;
  city: CarCity;
  carLocation: string;
  firstRegistration: Date | null;
  images: CarImage[];
  pricePerDay: string;
  milage: number;
  averageConsumption: string;
  description: string;
};

export type CarImage = {
  file: File;
  id: string;
};

const initialCarData: CarData = {
  make: CarMake.MERCEDES,
  carModel: '',
  engine: CarEngineType.PETROL,
  power: '',
  carType: CarType.SALOON,
  city: CarCity.NOVI_SAD,
  carLocation: '',
  firstRegistration: null as Date | null,
  images: [] as CarImage[],
  pricePerDay: '',
  milage: 0,
  averageConsumption: '',
  description: '',
};

export function useAddCar() {
  const [carData, setCarData] = useState(initialCarData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {

    } else if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, session, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setCarData((prev) => ({ ...prev, images: Array.from(files).map((file) => ({ file, id: crypto.randomUUID() })) }));
      }
    } else {
      setCarData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const removeImage = (id: string) => {
  setCarData((prev) => ({
    ...prev,
    images: prev.images.filter((img) => img.id !== id),
  }));
};

  const handleDateChange = (date: Date | null) => {
    setCarData((prev) => ({ ...prev, firstRegistration: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!carData.firstRegistration) {
      alert('First registration is required!');
      setIsSubmitting(false);
      return;
    }

    if (carData.images.length === 0) {
      alert('At least one image is required!');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(carData).forEach(([key, value]) => {
        if (value !== null) {
          if (Array.isArray(value)) {
            value.forEach((image) => formData.append('images', image.file));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch('/api/cars/add-car', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add car');

      setCarData(initialCarData);
      setShowSuccess(true);
      router.push('/profile/my-profile');
    } catch (error) {
      alert('Failed to add car. Please try again.');
      setIsSubmitting(false);
    }
  };

  return {
    carData,
    isSubmitting,
    showSuccess,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    removeImage,
  };
}