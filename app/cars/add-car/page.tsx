'use client';

import { Button } from '@/components/UI/Button';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CarCity } from '@/lib/model/car/CarCity';
import useMediaQuery from '@/hooks/useMediaQuery';
import MobileAddCar from '@/components/mobile/MobileAddCar';

export default function AddCarPage() {
  const [carData, setCarData] = useState({
    make: CarMake.MERCEDES,
    carModel: '',
    engine: CarEngineType.PETROL,
    power: '',
    carType: CarType.SALOON,
    city: CarCity.NOVI_SAD,
    carLocation: '',
    firstRegistration: null as Date | null,
    images: [] as File[],
    owner: '',
    pricePerDay: '',
    milage: 0,
    averageConsumption: '',
    description: '',
  });

  const { data: session, status } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 680px)');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setCarData((prev) => ({ ...prev, owner: session.user.id }));
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files) {
        const filesArray = Array.from(files);
        setCarData((prev) => ({ ...prev, images: filesArray }));
      }
    } else {
      setCarData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setCarData((prev) => ({ ...prev, firstRegistration: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(carData).forEach(([key, value]) => {
        if (value !== null) {
          if (Array.isArray(value)) {
            value.forEach((file) => formData.append('images', file));
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

      if (!response.ok) {
        throw new Error('Failed to add car');
      }

      setCarData({
        make: CarMake.MERCEDES,
        carModel: '',
        engine: CarEngineType.PETROL,
        power: '',
        carType: CarType.SALOON,
        city: CarCity.NOVI_SAD,
        carLocation: '',
        firstRegistration: null,
        images: [],
        owner: session?.user?.id || '',
        pricePerDay: '',
        milage: 0,
        averageConsumption: '',
        description: '',
      });
      alert('Car added successfully!');
    } catch (error) {
      alert('Failed to add car. Please try again.');
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileAddCar
          carData={carData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Add a New Car</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="make" className="block mb-1">
                Make
              </label>
              <select
                id="make"
                name="make"
                value={carData.make}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                {Object.values(CarMake).map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="carModel" className="block mb-1">
                Model
              </label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                value={carData.carModel}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="engine" className="block mb-1">
                Engine
              </label>
              <select
                id="engine"
                name="engine"
                value={carData.engine}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                {Object.values(CarEngineType).map((engineType) => (
                  <option key={engineType} value={engineType}>
                    {engineType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="power" className="block mb-1">
                Power
              </label>
              <input
                type="text"
                id="power"
                name="power"
                value={carData.power}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="carType" className="block mb-1">
                Car Type
              </label>
              <select
                id="carType"
                name="carType"
                value={carData.carType}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                {Object.values(CarType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block mb-1">
                Car City
              </label>
              <select
                id="city"
                name="city"
                value={carData.city}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                {Object.values(CarCity).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="carLocation" className="block mb-1">
                Car Location
              </label>
              <input
                type="text"
                id="carLocation"
                name="carLocation"
                value={carData.carLocation}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="firstRegistration" className="block mb-1">
                First Registration
              </label>
              <DatePicker
                selected={carData.firstRegistration}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
                placeholderText="Select date"
              />
            </div>
            <div>
              <label htmlFor="pricePerDay" className="block mb-1">
                Price Per Day
              </label>
              <input
                type="number"
                id="pricePerDay"
                name="pricePerDay"
                value={carData.pricePerDay}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="averageConsumption" className="block mb-1">
                Average Consumption
              </label>
              <input
                type="text"
                id="averageConsumption"
                name="averageConsumption"
                value={carData.averageConsumption}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="images" className="block mb-1">
                Car Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleInputChange}
                accept="image/*"
                multiple
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-4">
              <Button type="submit" className="w-full">
                Add Car
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
