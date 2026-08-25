'use client';

import Link from 'next/link';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowLeft, CarFront, ImagePlus, MapPin, X } from 'lucide-react';

import { Button } from '@/components/UI/Button';
import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import l from '@/helper/en';
import { useAddCar } from '@/hooks/useAddCar';
import { CarCity } from '@/lib/model/car/CarCity';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarType } from '@/lib/model/car/CarType';

const sectionClasses =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';

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
    <div className="px-4 pb-10 pt-6">
      <Link
        href="/profile/my-profile"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft className="h-4 w-4" /> {l.cars.backToMyCars}
      </Link>
      <header className="mb-6">
        <div className="mb-3 inline-flex rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
          <CarFront className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {l.cars.addNewCar}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {l.cars.addVehicleDesc}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className={sectionClasses}>
          <MobileSectionTitle
            icon={<CarFront className="h-5 w-5" />}
            title={l.cars.vehicleDetails}
          />
          <div className="space-y-4">
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
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>
        </section>

        <section className={sectionClasses}>
          <MobileSectionTitle
            icon={<MapPin className="h-5 w-5" />}
            title={l.cars.rentalDetails}
            violet
          />
          <div className="space-y-4">
            <FormSelect
              label={l.cars.city}
              name="city"
              value={carData.city}
              onChange={handleInputChange}
              options={Object.values(CarCity)}
            />
            <FormInput
              label={l.cars.carLocation}
              name="carLocation"
              value={carData.carLocation}
              onChange={handleInputChange}
              placeholder={l.cars.egLiman}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="mobile-first-registration"
                  className={labelClasses}
                >
                  {l.cars.firstRegistration}
                </label>
                <DatePicker
                  id="mobile-first-registration"
                  selected={carData.firstRegistration}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  maxDate={new Date()}
                  className={inputClasses}
                  placeholderText={l.cars.selectDate}
                />
              </div>
              <FormInput
                label={l.cars.pricePerDayLabel}
                name="pricePerDay"
                type="number"
                min="1"
                value={carData.pricePerDay}
                onChange={handleInputChange}
                placeholder={l.cars.eg45}
                required
              />
            </div>
            <div>
              <label htmlFor="mobile-car-description" className={labelClasses}>
                {l.common.description}
              </label>
              <textarea
                id="mobile-car-description"
                name="description"
                rows={4}
                placeholder={l.cars.descriptionPlaceholder}
                value={carData.description}
                onChange={handleInputChange}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
        </section>

        <section className={sectionClasses}>
          <h2 className="font-bold text-slate-900">{l.cars.carImages}</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            {l.cars.carImagesDesc}
          </p>
          <label className="relative flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 text-center">
            <ImagePlus className="mb-2 h-7 w-7 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">
              {l.common.clickToUpload}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              {l.cars.imageHint}
            </span>
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleInputChange}
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          {carData.images.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {carData.images.map(({ file, id }) => (
                <div
                  key={id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={l.cars.carImagePreview}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(id)}
                    aria-label={l.cars.removeImage}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/75 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 w-full rounded-2xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
        >
          {isSubmitting ? l.common.adding : l.cars.publishCar}
        </Button>
      </form>
    </div>
  );
}

function MobileSectionTitle({
  icon,
  title,
  violet = false,
}: {
  icon: React.ReactNode;
  title: string;
  violet?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`rounded-xl p-2 ${violet ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'}`}
      >
        {icon}
      </div>
      <h2 className="font-bold text-slate-900">{title}</h2>
    </div>
  );
}
