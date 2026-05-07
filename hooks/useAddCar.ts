import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';

const safeTextRegex = /^[\p{L}\p{N}\s\-]+$/u;
const safeLocationRegex = /^[\p{L}\p{N}\s\-.,]+$/u;

export const addCarSchema = z.object({
  make: z.nativeEnum(CarMake, { required_error: 'Make is required' }),
  carModel: z.string()
    .min(1, 'Model is required')
    .regex(safeTextRegex, 'Invalid characters in model!'),
  engine: z.nativeEnum(CarEngineType),
  power: z.coerce.number({ invalid_type_error: 'Power must be a number' })
    .positive('Power must be greater than 0'),
  carType: z.nativeEnum(CarType),
  city: z.nativeEnum(CarCity),
  carLocation: z.string()
    .min(1, 'Location is required')
    .regex(safeLocationRegex, 'Invalid characters in location!'),
  firstRegistration: z.date({ required_error: 'Registration date is required' })
    .max(new Date(), 'Registration date cannot be in the future!'),
  pricePerDay: z.coerce.number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be greater than 0'),
  averageConsumption: z.coerce.number({ invalid_type_error: 'Consumption must be a number' })
    .positive('Consumption must be positive'),
  milage: z.coerce.number({ invalid_type_error: 'Milage must be a number' })
    .nonnegative('Milage cannot be negative'),
  description: z.string().min(1, 'Description is required'), 
});

type CarFormValues = z.infer<typeof addCarSchema>;

export function useAddCar() {
  
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [isSuccess, setIsSuccess] = useState(false); 

  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm<CarFormValues>({
    resolver: zodResolver(addCarSchema),
    defaultValues: {
      make: CarMake.MERCEDES,
      carModel: '',
      engine: CarEngineType.PETROL,
      carType: CarType.SALOON,
      city: CarCity.NOVI_SAD,
      carLocation: '',
      description: '',
      power: undefined,
      pricePerDay: undefined,
      averageConsumption: undefined,
      firstRegistration: undefined,
      milage: undefined
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); //ili landing? 
    }
  }, [status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadImages(Array.from(files));
    }
  };

  const processSubmit = async (data: CarFormValues) => { 

     if (uploadImages.length === 0) {
    form.setError('root', { message: 'At least one car image is required!' }); 
    return;
  }

    try {
      const formData = new FormData();
      formData.append('owner', session?.user?.id || '');

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      uploadImages.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/cars/add-car', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add car');

      setIsSuccess(true);
      router.push('/profile/my-profile');
    } catch (err: any) {
    form.setError('root', { message: err.message || 'Failed to add car. Please try again.' }); 
  }
  };

  return {
    form,
    isSuccess,
    isSubmitting: form.formState.isSubmitting, 
    uploadImages,
    handleImageChange,
    onSubmit: form.handleSubmit(processSubmit), 
  };
}