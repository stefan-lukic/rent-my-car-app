'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/UI/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; //ovde sam i npm install ovo ali se onda promenili json fajlovi pa sam discard promene
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CarCity } from '@/lib/model/car/CarCity';
import MobileAddCar from '@/components/mobile/MobileAddCar';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const inputClasses =
  'w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700';
const labelClasses = 'block mb-2 text-sm font-semibold text-gray-600 ml-1';

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
}: any) => (
  <div>
    <label className={labelClasses}>{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className={inputClasses}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className={labelClasses}>{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={inputClasses}
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const isMobile = isMobileCSR();

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
        setCarData((prev) => ({ ...prev, images: Array.from(files) }));
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
    setIsSubmitting(true);
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

      setShowSuccess(true);

      setTimeout(() => {
        router.push('/profile/my-profile');
      }, 2000);
    } catch (error) {
      alert('Failed to add car. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 relative">
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center transform transition-all">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 mb-6">
              Your car has been successfully added. Redirecting to your
              profile...
            </p>
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {isMobile ? (
        <MobileAddCar
          carData={carData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 md:p-12">
            <header className="mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Add a New Car
              </h1>
              <p className="text-gray-500">
                Add your vehicle details to create a rental listing and make it
                available for bookings
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <FormSelect
                  label="Make"
                  name="make"
                  value={carData.make}
                  onChange={handleInputChange}
                  options={Object.values(CarMake)}
                />
                <FormInput
                  label="Model"
                  name="carModel"
                  value={carData.carModel}
                  onChange={handleInputChange}
                  placeholder="e.g. C-Class"
                />
                <FormSelect
                  label="Car Type"
                  name="carType"
                  value={carData.carType}
                  onChange={handleInputChange}
                  options={Object.values(CarType)}
                />
                <FormSelect
                  label="Engine Type"
                  name="engine"
                  value={carData.engine}
                  onChange={handleInputChange}
                  options={Object.values(CarEngineType)}
                />
                <FormInput
                  label="Horsepower (HP)"
                  name="power"
                  value={carData.power}
                  onChange={handleInputChange}
                  placeholder="e.g. 150"
                />
                <FormInput
                  label="Average Consumption"
                  name="averageConsumption"
                  value={carData.averageConsumption}
                  onChange={handleInputChange}
                  placeholder="e.g. 6.5 L/100km"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <FormSelect
                  label="City"
                  name="city"
                  value={carData.city}
                  onChange={handleInputChange}
                  options={Object.values(CarCity)}
                />
                <FormInput
                  label="Car Location"
                  name="carLocation"
                  value={carData.carLocation}
                  onChange={handleInputChange}
                  placeholder="e.g. Liman 3"
                />

                <div>
                  <label className={labelClasses}>First Registration</label>
                  <DatePicker
                    selected={carData.firstRegistration}
                    onChange={handleDateChange}
                    dateFormat="MM/yyyy"
                    showYearDropdown
                    className={inputClasses}
                    placeholderText="Select date"
                  />
                </div>

                <FormInput
                  label="Price Per Day (€)"
                  name="pricePerDay"
                  type="number"
                  value={carData.pricePerDay}
                  onChange={handleInputChange}
                  placeholder="e.g. 45"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className={labelClasses}>Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Tell us more about your car..."
                  value={carData.description}
                  onChange={handleInputChange}
                  required
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Car Images</label>
                <div className="relative group">
                  <div className="w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors cursor-pointer">
                    <CloudUploadIcon
                      className="text-blue-500 mb-2"
                      fontSize="large"
                    />
                    <span className="text-sm font-medium text-blue-600">
                      {carData.images.length > 0
                        ? `${carData.images.length} files selected`
                        : 'Click to upload photos'}
                    </span>
                  </div>
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleInputChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform 
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:scale-[1.01] active:scale-[0.99]'}`}
              >
                {isSubmitting ? 'Adding...' : 'Add a New Car'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
