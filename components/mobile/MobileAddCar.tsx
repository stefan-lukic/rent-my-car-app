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
import { useAddCar } from '@/hooks/useAddCar';

export default function MobileAddCar() {
  const {
    carData,
    isSubmitting,
    handleInputChange,
    handleDateChange,
    handleSubmit,
  } = useAddCar();

  return (
    <div className="h-full overflow-auto  px-4 pt-6 pb-24 bg-white">
      <header className="mb-6">
        <h1 className="text-3xl  font-extrabold text-gray-900 mb-2">
          Add a New Car
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          required
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
          label="Horsepower"
          name="power"
          value={carData.power}
          onChange={handleInputChange}
          placeholder="e.g. 150"
          required
        />

        <FormInput
          label="Avg. Consumption"
          name="averageConsumption"
          value={carData.averageConsumption}
          onChange={handleInputChange}
          placeholder="e.g. 6.5 L/100km"
          required
        />

        <FormSelect
          label="City"
          name="city"
          value={carData.city}
          onChange={handleInputChange}
          options={Object.values(CarCity)}
        />

        <div>
          <label className={labelClasses}>First Registration</label>
          <DatePicker
            selected={carData.firstRegistration}
            onChange={handleDateChange}
            className={inputClasses}
            placeholderText="Select date"
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Car Images</label>
          <div className="relative">
            <div className="w-full h-32 border-2 border-dashed rounded-2xl flex items-center justify-center bg-blue-50">
              <CloudUploadIcon />
            </div>
            {carData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {carData.images.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Car image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              multiple
              className="absolute inset-0 opacity-0"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl"
        >
          {isSubmitting ? 'Adding...' : 'Add Car'}
        </Button>
      </form>
    </div>
  );
}
