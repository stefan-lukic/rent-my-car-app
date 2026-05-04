'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import { Button } from '@/components/UI/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import { CarData } from '@/hooks/useAddCar';

interface MobileAddCarProps {
  carData: CarData;
  isSubmitting: boolean;
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
  isSubmitting,
  handleSubmit,
  handleInputChange,
  handleDateChange,
}: MobileAddCarProps) {
  return (
    <div className="h-full overflow-auto px-4 pt-6 pb-24 bg-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Add a New Car
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your vehicle details to create a rental listing
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormSelect
          label="Make"
          name="make"
          value={carData.make}
          onChange={handleInputChange}
          options={Object.values(CarMake)}
          required
        />
        <FormInput
          label="Model"
          name="carModel"
          value={carData.carModel}
          onChange={handleInputChange}
          placeholder="e.g. C-Class"
          required
        />
        <FormSelect
          label="Car Type"
          name="carType"
          value={carData.carType}
          onChange={handleInputChange}
          options={Object.values(CarType)}
          required
        />
        <FormSelect
          label="Engine Type"
          name="engine"
          value={carData.engine}
          onChange={handleInputChange}
          options={Object.values(CarEngineType)}
          required
        />
        <FormInput
          label="Horsepower (HP)"
          name="power"
          value={carData.power}
          onChange={handleInputChange}
          placeholder="e.g. 150"
          required
        />
        <FormInput
          label="Average Consumption"
          name="averageConsumption"
          value={carData.averageConsumption}
          onChange={handleInputChange}
          placeholder="e.g. 6.5 L/100km"
          required
        />
        <FormSelect
          label="Car City"
          name="city"
          value={carData.city}
          onChange={handleInputChange}
          options={Object.values(CarCity)}
          required
        />
        <FormInput
          label="Car Location"
          name="carLocation"
          value={carData.carLocation}
          onChange={handleInputChange}
          placeholder="e.g. Liman 3"
          required
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
          required
        />

        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            name="description"
            rows={4}
            value={carData.description}
            onChange={handleInputChange}
            placeholder="Tell us more about your car..."
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Car Images</label>
          <div className="relative group">
            <div className="w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center bg-blue-50 transition-colors cursor-pointer">
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
              onChange={handleInputChange}
              accept="image/*"
              multiple
              required
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full text-white py-4 mt-4 rounded-2xl text-lg font-bold shadow-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Car'}
        </Button>
      </form>
    </div>
  );
}
