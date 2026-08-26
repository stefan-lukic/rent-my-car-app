'use client';

import Link from 'next/link';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ArrowLeft,
  CarFront,
  Check,
  ImagePlus,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';

import { Button } from '@/components/UI/Button';
import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import AddressAutocompleteInput from '@/components/UI/AddressAutocompleteInput';
import l from '@/helper/en';
import { useAddCar } from '@/hooks/useAddCar';
import { CarCity } from '@/lib/model/car/CarCity';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarType } from '@/lib/model/car/CarType';

const sectionClasses =
  'rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm';

export default function AddCar() {
  const {
    carData,
    isSubmitting,
    handleInputChange,
    handleLocationChange,
    handleDateChange,
    handleSubmit,
    removeImage,
  } = useAddCar();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex items-end justify-between gap-8">
        <div>
          <Link
            href="/profile/my-profile"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {l.cars.backToMyCars}
          </Link>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
              <CarFront className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                {l.cars.addNewCar}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {l.cars.addVehicleDesc}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 lg:flex">
          <ShieldCheck className="h-4 w-4" />
          {l.cars.secureListing}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px]"
      >
        <div className="space-y-7">
          <section className={sectionClasses}>
            <SectionHeading
              icon={<CarFront className="h-5 w-5" />}
              title={l.cars.vehicleDetails}
              description={l.cars.vehicleDetailsDesc}
              color="blue"
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
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
                required
              />
              <FormSelect
                label={l.cars.engineType}
                name="engine"
                value={carData.engine}
                onChange={handleInputChange}
                options={Object.values(CarEngineType)}
                required
              />
              <FormInput
                label={l.cars.horsepower}
                name="power"
                value={carData.power}
                onChange={handleInputChange}
                placeholder={l.cars.eg150}
                required
              />
              <FormInput
                label={l.cars.seats}
                name="seats"
                type="number"
                min="1"
                max="9"
                step="1"
                value={carData.seats}
                onChange={handleInputChange}
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
          </section>

          <section className={sectionClasses}>
            <SectionHeading
              icon={<MapPin className="h-5 w-5" />}
              title={l.cars.rentalDetails}
              description={l.cars.rentalDetailsDesc}
              color="violet"
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <FormSelect
                label={l.cars.city}
                name="city"
                value={carData.city}
                onChange={handleInputChange}
                options={Object.values(CarCity)}
                placeholder={l.cars.selectCity}
                required
              />
              <AddressAutocompleteInput
                label={l.cars.carLocation}
                name="carLocation"
                value={carData.carLocation}
                city={carData.city}
                onValueChange={handleLocationChange}
                placeholder={l.cars.egStreetLocation}
                required
              />
              <div>
                <label htmlFor="first-registration" className={labelClasses}>
                  {l.cars.firstRegistration}
                </label>
                <DatePicker
                  id="first-registration"
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
              <div className="col-span-2">
                <label htmlFor="car-description" className={labelClasses}>
                  {l.common.description}
                </label>
                <textarea
                  id="car-description"
                  name="description"
                  rows={5}
                  placeholder={l.cars.descriptionPlaceholder}
                  value={carData.description}
                  onChange={handleInputChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className={sectionClasses}>
            <h2 className="font-bold text-slate-900">{l.cars.carImages}</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              {l.cars.carImagesDesc}
            </p>
            <label className="group relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
              <span className="mb-3 rounded-2xl bg-white p-3 text-blue-600 shadow-sm transition group-hover:-translate-y-0.5">
                <ImagePlus className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold text-slate-800">
                {l.common.clickToUpload}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                {l.cars.imageHint}
              </span>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleInputChange}
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>

            {carData.images.length > 0 ? (
              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {l.cars.selectedPhotos}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                    {carData.images.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {carData.images.map(({ file, id }) => (
                    <div
                      key={id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
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
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/75 text-white transition hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200">
            <div className="mb-5 flex gap-3">
              <span className="mt-0.5 rounded-full bg-emerald-400/15 p-1 text-emerald-300">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm leading-6 text-slate-300">
                {l.cars.publishHint}
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
            >
              {isSubmitting ? l.common.adding : l.cars.publishCar}
            </Button>
          </section>
        </aside>
      </form>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'violet';
}) {
  const iconClasses =
    color === 'blue'
      ? 'bg-blue-50 text-blue-600'
      : 'bg-violet-50 text-violet-600';
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className={`rounded-xl p-2.5 ${iconClasses}`}>{icon}</div>
      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
