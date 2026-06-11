'use client';

import { Button } from '@/components/UI/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import { useAddCar } from '@/hooks/useAddCar';

export default function AddCar() {
  const {
    carData,
    isSubmitting,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    removeImage,
  } = useAddCar();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 md:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Add a New Car
          </h1>
          <p className="text-gray-500">
            Add your vehicle details to create a rental listing
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
              label="Avg. Consumption"
              name="averageConsumption"
              value={carData.averageConsumption}
              onChange={handleInputChange}
              placeholder="e.g. 6.5 L/100km"
              required
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
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className={labelClasses}>Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Tell us more about your car..."
              value={carData.description}
              onChange={handleInputChange}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Car Images</label>
            <div className="relative group">
              <div className="w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center bg-blue-50 cursor-pointer">
                <CloudUploadIcon
                  className="text-blue-500 mb-2"
                  fontSize="large"
                />
                <span className="text-sm font-medium text-blue-600">
                  {carData.images.length > 0
                    ? `${carData.images.length} ${carData.images.length === 1 ? 'file' : 'files'} selected`
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
            {carData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {carData.images.map(({ file, id }) => (
                  <div
                    key={id}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Car image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(id)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-4 rounded-2xl text-lg font-bold transition ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Car'}
          </Button>
        </form>
      </div>
    </div>
  );
}
