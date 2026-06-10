'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/UI/Button';
import { Form } from '@/components/UI/Form';
import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import { CarType } from '@/lib/model/car/CarType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarCity } from '@/lib/model/car/CarCity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAddCar } from '@/hooks/useAddCar';
import CustomDatePicker from './UI/CustomDatePicker';

export default function AddCar() {
  const {
    form,
    isSubmitting,
    isSuccess,
    uploadImages,
    handleImageChange,
    onSubmit,
  } = useAddCar();

  const {
    control,
    register,
    formState: { errors },
  } = form;

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

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <FormSelect
                label="Make"
                options={Object.values(CarMake)}
                error={errors.make?.message}
                {...register('make')}
              />

              <FormInput
                label="Model"
                placeholder="e.g. C-Class"
                error={errors.carModel?.message}
                {...register('carModel')}
              />

              <FormSelect
                label="Car Type"
                options={Object.values(CarType)}
                error={errors.carType?.message}
                {...register('carType')}
              />

              <FormSelect
                label="Engine Type"
                options={Object.values(CarEngineType)}
                error={errors.engine?.message}
                {...register('engine')}
              />

              <FormInput
                label="Milage (km)"
                type="number"
                placeholder="e.g. 120000"
                error={errors.milage?.message}
                {...register('milage', { valueAsNumber: true })}
              />

              <FormInput
                label="Horsepower (HP)"
                type="number"
                placeholder="e.g. 150"
                error={errors.power?.message}
                {...register('power', { valueAsNumber: true })}
              />

              <FormInput
                label="Avg. Consumption (L/100km)"
                type="number"
                step="0.1"
                placeholder="e.g. 6.5"
                error={errors.averageConsumption?.message}
                {...register('averageConsumption', {
                  valueAsNumber: true,
                })}
              />

              <FormInput
                label="Price Per Day (€)"
                type="number"
                placeholder="e.g. 45"
                error={errors.pricePerDay?.message}
                {...register('pricePerDay', { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <FormSelect
                label="City"
                options={Object.values(CarCity)}
                error={errors.city?.message}
                {...register('city')}
              />

              <FormInput
                label="Car Location"
                placeholder="e.g. Liman 3"
                error={errors.carLocation?.message}
                {...register('carLocation')}
              />

              <CustomDatePicker
                control={control}
                name="firstRegistration"
                label="First Registration"
                maxDate={new Date()}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label htmlFor="description" className={labelClasses}>
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Tell us more about your car..."
                className={`${inputClasses} resize-none`}
                {...register('description')}
              />
              {errors.description?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="carImages" className={labelClasses}>
                Car Images
              </label>
              <div className="relative group">
                <div className="w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center bg-blue-50 cursor-pointer">
                  <CloudUploadIcon
                    className="text-blue-500 mb-2"
                    fontSize="large"
                  />
                  <span className="text-sm font-medium text-blue-600">
                    {uploadImages.length > 0
                      ? `${uploadImages.length} files selected`
                      : 'Click to upload photos'}
                  </span>
                </div>
                <input
                  id="carImages"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {errors.root?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.root.message}
                </p>
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
        </Form>
      </div>
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center max-w-sm text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-500 mb-2">
              Your car has been successfully added to the platform.
            </p>
            <p className="text-sm text-blue-500 font-semibold animate-pulse">
              Redirecting to your profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
