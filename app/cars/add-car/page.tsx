'use client';

import { Button } from '@/components/UI/Button';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarType } from '@/lib/model/CarType';

export default function AddCarPage() {
  const [carData, setCarData] = useState({
    make: '',
    carModel: '',
    engine: '',
    power: '',
    carType: CarType.SALOON,
    city: '',
    firstRegistration: null as Date | null,
    image: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setCarData((prev) => ({ ...prev, firstRegistration: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cars/add-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error('Failed to add car');
      }

      const result = await response.json();
      console.log('Car added successfully:', result.car);
      // Reset form
      setCarData({
        make: '',
        carModel: '',
        engine: '',
        power: '',
        carType: CarType.SALOON,
        city: '',
        firstRegistration: null,
        image: '',
      });
      alert('Car added successfully!');
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Failed to add car. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add a New Car</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
        <div>
          <label htmlFor="make" className="block mb-1">
            Make
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={carData.make}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
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
          <input
            type="text"
            id="engine"
            name="engine"
            value={carData.engine}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
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
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={carData.city}
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
          <label htmlFor="image" className="block mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={carData.image}
            onChange={handleInputChange}
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
  );
}
