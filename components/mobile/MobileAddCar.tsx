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
import l from '@/helper/en';

export default function MobileAddCar() {
  const {
    carData,
    isSubmitting,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    removeImage,
  } = useAddCar();

  return (
    <div className="h-full overflow-auto px-4 pb-24 bg-white">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {l.cars.addNewCar}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormSelect
          label={l.cars.make}
          name="make"
          value={carData.make}
          onChange={handleInputChange}
          options={Object.values(CarMake)}
        />

        <FormInput
          label={l.cars.model}
          name="carModel"
          value={carData.carModel}
          onChange={handleInputChange}
          placeholder={l.cars.egCClass}
          required
        />

        <FormSelect
          label={l.cars.carType}
          name="carType"
          value={carData.carType}
          onChange={handleInputChange}
          options={Object.values(CarType)}
        />

        <FormSelect
          label={l.cars.engineType}
          name="engine"
          value={carData.engine}
          onChange={handleInputChange}
          options={Object.values(CarEngineType)}
        />

        <FormInput
          label={l.cars.horsepowerMobile}
          name="power"
          value={carData.power}
          onChange={handleInputChange}
          placeholder={l.cars.eg150}
          required
        />

        <FormInput
          label={l.cars.avgConsumption}
          name="averageConsumption"
          value={carData.averageConsumption}
          onChange={handleInputChange}
          placeholder={l.cars.eg65L}
          required
        />

        <FormSelect
          label={l.cars.city}
          name="city"
          value={carData.city}
          onChange={handleInputChange}
          options={Object.values(CarCity)}
        />

        <div>
          <label className={labelClasses}>{l.cars.firstRegistration}</label>
          <DatePicker
            selected={carData.firstRegistration}
            onChange={handleDateChange}
            className={inputClasses}
            placeholderText={l.cars.selectDate}
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>{l.cars.carImages}</label>

          <div className="relative h-32 border-2 border-dashed rounded-2xl flex items-center justify-center bg-blue-50">
            <CloudUploadIcon />
            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              multiple
              className="absolute inset-0 opacity-0"
            />
          </div>

          {carData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {carData.images.map(({ file, id }) => (
                <div
                  key={id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Car Image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(id)}
                     className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {l.common.close}
              </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl"
        >
          {isSubmitting ? l.common.adding : l.cars.addCar}
        </Button>
      </form>
    </div>
  );
}
