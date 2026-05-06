'use client';

import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from '@/components/UI/Form';
import { Button } from '@/components/UI/Button';
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

export default function MobileAddCar() {
  const { form, isSubmitting, uploadImages, handleImageChange, onSubmit } =
    useAddCar();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="h-full overflow-auto px-4 pt-6 pb-24 bg-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Add a New Car
        </h1>
        <p className="text-gray-500 text-sm">
          Add your vehicle details to create a rental listing
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <FormSelect
            label="Make"
            options={Object.values(CarMake)}
            error={errors.make?.message}
            {...register('make')}
          />

          <FormInput
            label="Model"
            placeholder="e.g. C-Class"
            error={errors.model?.message}
            {...register('model')}
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
            {...register('averageConsumption', { valueAsNumber: true })}
          />

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

          <div>
            <label className={labelClasses}>First Registration</label>
            <Controller
              name="firstRegistration"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ?? null}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  maxDate={new Date()}
                  className={inputClasses}
                  placeholderText="Select date"
                />
              )}
            />
            {errors.firstRegistration?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstRegistration.message}
              </p>
            )}
          </div>

          {/* DODATO: pricePerDay - koje je falilo */}
          <FormInput
            label="Price Per Day (€)"
            type="number"
            placeholder="e.g. 45"
            error={errors.pricePerDay?.message}
            {...register('pricePerDay', { valueAsNumber: true })}
          />

          {/* DODATO: description - koje je falilo */}
          <div className="flex flex-col">
            <label className={labelClasses}>Description</label>
            <textarea
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

          {/* SLIKE */}
          <div className="space-y-2 mt-2">
            <label className={labelClasses}>Car Images</label>
            <div className="relative group">
              <div className="w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
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
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            {errors.root?.message && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.root.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-4 rounded-2xl text-lg font-bold transition mt-4 ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 active:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Car'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
