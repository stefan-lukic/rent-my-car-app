'use client';

import { Button } from '@/components/UI/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import MobileAddCar from '@/components/mobile/MobileAddCar';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import { useAddCar } from '@/hooks/useAddCar';

export default function AddCarPage() {
  const {
    carData,
    isSubmitting,
    showSuccess,
    handleInputChange,
    handleDateChange,
    handleSubmit,
  } = useAddCar();

  const isMobile = isMobileCSR();

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
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
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
                    required
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
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:scale-[1.01] active:scale-[0.99]'
                }`}
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
