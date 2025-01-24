'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import { Button } from '@/components/UI/Button';

export type CarData = {
  make: CarMake;
  carModel: string;
  engine: CarEngineType;
  power: string;
  carType: CarType;
  city: CarCity;
  carLocation: string;
  firstRegistration: Date | null;
  images: File[];
  owner: string;
  pricePerDay: string;
  milage: number;
  averageConsumption: string;
  description: string;
};

interface MobileAddCarProps {
  carData: CarData;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleDateChange: (date: Date | null) => void;
}

export default function MobileAddCar({
  carData,
  handleSubmit,
  handleInputChange,
  handleDateChange,
}: MobileAddCarProps) {
  return (
    <div className="h-full overflow-auto p-4 pb-24 bg-gray-100 rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <Button type="submit" className="w-full">
          Add Car
        </Button>
      </form>
    </div>
  );
}
