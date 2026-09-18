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
import { CAR_FIELD_LIMITS } from '@/lib/model/car/carValidation';

const sectionClasses =
  'rounded-2xl border border-border bg-white p-7 shadow-sm';

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
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-body-subtle transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            {l.cars.backToMyCars}
          </Link>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand p-3 text-white shadow-sm">
              <CarFront className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-ink">
                {l.cars.addNewCar}
              </h1>
              <p className="mt-1 text-sm text-body-subtle">
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
                maxLength={CAR_FIELD_LIMITS.modelLength}
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
                type="number"
                min={CAR_FIELD_LIMITS.horsepower.min}
                max={CAR_FIELD_LIMITS.horsepower.max}
                step="1"
                inputMode="numeric"
                value={carData.power}
                onChange={handleInputChange}
                placeholder={l.cars.eg150}
                required
              />
              <FormInput
                label={l.cars.seats}
                name="seats"
                type="number"
                min={CAR_FIELD_LIMITS.seats.min}
                max={CAR_FIELD_LIMITS.seats.max}
                step="1"
                inputMode="numeric"
                value={carData.seats}
                onChange={handleInputChange}
                required
              />
              <FormInput
                label={l.cars.avgConsumption}
                name="averageConsumption"
                type="number"
                min={CAR_FIELD_LIMITS.averageConsumption.min}
                max={CAR_FIELD_LIMITS.averageConsumption.max}
                step="0.1"
                inputMode="decimal"
                value={carData.averageConsumption}
                onChange={handleInputChange}
                placeholder={l.cars.eg65L}
                required
              />
              <FormInput
                label={l.cars.mileage}
                name="milage"
                type="number"
                min={CAR_FIELD_LIMITS.mileage.min}
                max={CAR_FIELD_LIMITS.mileage.max}
                step="1"
                inputMode="numeric"
                value={carData.milage}
                onChange={handleInputChange}
                placeholder={l.cars.eg50000}
                required
              />
            </div>
          </section>

          <section className={sectionClasses}>
            <SectionHeading
              icon={<MapPin className="h-5 w-5" />}
              title={l.cars.rentalDetails}
              description={l.cars.rentalDetailsDesc}
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
                min={CAR_FIELD_LIMITS.pricePerDay.min}
                max={CAR_FIELD_LIMITS.pricePerDay.max}
                step="0.01"
                inputMode="decimal"
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
                  maxLength={CAR_FIELD_LIMITS.descriptionLength}
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className={sectionClasses}>
            <h2 className="font-bold text-ink-secondary">{l.cars.carImages}</h2>
            <p className="mb-5 mt-1 text-sm text-body-subtle">
              {l.cars.carImagesDesc}
            </p>
            <label className="group relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-brand-tint/60 px-6 text-center transition hover:border-brand/70 hover:bg-brand-tint">
              <span className="mb-3 rounded-2xl bg-white p-3 text-brand shadow-sm transition group-hover:-translate-y-0.5">
                <ImagePlus className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold text-ink-secondary">
                {l.common.clickToUpload}
              </span>
              <span className="mt-1 text-xs text-body-subtle">
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
                  <span className="font-bold text-body">
                    {l.cars.selectedPhotos}
                  </span>
                  <span className="rounded-full bg-brand-tint px-2.5 py-1 font-bold text-brand">
                    {carData.images.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {carData.images.map(({ file, id }) => (
                    <div
                      key={id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted"
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
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/75 text-white transition hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl bg-ink p-6 text-white shadow-lg">
            <div className="mb-5 flex gap-3">
              <span className="mt-0.5 rounded-full bg-emerald-400/15 p-1 text-emerald-300">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm leading-6 text-border-strong">
                {l.cars.publishHint}
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full text-sm"
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl bg-brand-tint p-2.5 text-brand">{icon}</div>
      <div>
        <h2 className="font-heading font-semibold text-ink-secondary">
          {title}
        </h2>
        <p className="mt-1 text-sm text-body-subtle">{description}</p>
      </div>
    </div>
  );
}
