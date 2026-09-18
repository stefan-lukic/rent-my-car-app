import { useState } from 'react';
import { Button } from './UI/Button';
import { Dialog } from './UI/Dialog';
import { ICar } from '@/lib/model/car/Car';
import { CarMake } from '@/lib/model/car/CarMake';
import { CarEngineType } from '@/lib/model/car/CarEngineType';
import { CarType } from '@/lib/model/car/CarType';
import { CarCity } from '@/lib/model/car/CarCity';
import FormInput, {
  inputClasses,
  labelClasses,
} from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import AddressAutocompleteInput from '@/components/UI/AddressAutocompleteInput';
import l from '@/helper/en';
import {
  CAR_FIELD_LIMITS,
  normalizeLegacyNumericValue,
} from '@/lib/model/car/carValidation';

type UpdateCarFields = Pick<
  ICar,
  | 'make'
  | 'carModel'
  | 'engine'
  | 'power'
  | 'seats'
  | 'carType'
  | 'city'
  | 'averageConsumption'
  | 'milage'
  | 'carLocation'
  | 'pricePerDay'
  | 'description'
>;

interface UpdateCarModalProps {
  isOpen: boolean;
  car: ICar;
  onUpdate: (updatedCar: ICar) => void;
  onClose: () => void;
}

const UpdateCarModal: React.FC<UpdateCarModalProps> = ({
  isOpen,
  car,
  onUpdate,
  onClose,
}) => {
  const [updatedCar, setUpdatedCar] = useState<UpdateCarFields>({
    make: car.make,
    carModel: car.carModel,
    engine: car.engine,
    power: normalizeLegacyNumericValue(car.power),
    seats: car.seats ?? 5,
    carType: car.carType,
    city: car.city,
    averageConsumption: normalizeLegacyNumericValue(car.averageConsumption),
    milage: car.milage,
    carLocation: car.carLocation,
    pricePerDay: car.pricePerDay,
    description: car.description,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedCar({
      ...updatedCar,
      [name]: name === 'seats' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/cars/update-car`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedCar, _id: car._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || l.cars.updateCarError);
      }

      const { car: updatedCarData } = await response.json();
      onUpdate(updatedCarData);
      onClose();
    } catch (error) {
      console.error('Error updating car:', error);
      alert((error as Error).message);
    }
  };

  const handleLocationChange = (carLocation: string) => {
    setUpdatedCar((currentCar) => ({ ...currentCar, carLocation }));
  };

  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="update-car-title"
      overlayClassName="z-[100] bg-ink/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      panelClassName="max-h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-white p-5 shadow-xl sm:p-8"
    >
      {/* Contain the long edit form without losing keyboard focus or scroll. */}
      <header className="mb-8">
        <h2
          id="update-car-title"
          className="mb-1 font-heading text-2xl font-bold text-ink sm:text-3xl"
        >
          {l.cars.updateCar}
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          {l.cars.editVehicleDesc}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <FormSelect
            label={l.cars.make}
            name="make"
            value={updatedCar.make}
            onChange={handleInputChange}
            options={Object.values(CarMake)}
          />
          <FormInput
            label={l.cars.model}
            name="carModel"
            value={updatedCar.carModel}
            onChange={handleInputChange}
            placeholder={l.cars.egCClass}
            maxLength={CAR_FIELD_LIMITS.modelLength}
            required
          />
          <FormSelect
            label={l.cars.carType}
            name="carType"
            value={updatedCar.carType}
            onChange={handleInputChange}
            options={Object.values(CarType)}
            required
          />
          <FormSelect
            label={l.cars.engineType}
            name="engine"
            value={updatedCar.engine}
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
            value={updatedCar.power}
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
            value={updatedCar.seats}
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
            value={updatedCar.averageConsumption}
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
            value={updatedCar.milage}
            onChange={handleInputChange}
            placeholder={l.cars.eg50000}
            required
          />
        </div>

        <div className="grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 sm:gap-6">
          <FormSelect
            label={l.cars.city}
            name="city"
            value={updatedCar.city}
            onChange={handleInputChange}
            options={Object.values(CarCity)}
          />
          <AddressAutocompleteInput
            label={l.cars.carLocation}
            name="carLocation"
            value={updatedCar.carLocation}
            city={updatedCar.city}
            onValueChange={handleLocationChange}
            placeholder={l.cars.egStreetLocation}
            required
          />
          <FormInput
            label={l.cars.pricePerDayLabel}
            name="pricePerDay"
            type="number"
            min={CAR_FIELD_LIMITS.pricePerDay.min}
            max={CAR_FIELD_LIMITS.pricePerDay.max}
            step="0.01"
            inputMode="decimal"
            value={updatedCar.pricePerDay}
            onChange={handleInputChange}
            placeholder={l.cars.eg45}
            required
          />
        </div>

        <div className="border-t border-slate-200 pt-6">
          <label className={labelClasses}>{l.common.description}</label>
          <textarea
            name="description"
            rows={4}
            placeholder={l.common.clickToUpload}
            value={updatedCar.description}
            onChange={handleInputChange}
            maxLength={CAR_FIELD_LIMITS.descriptionLength}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="sm:min-w-32"
          >
            {l.common.cancel}
          </Button>
          <Button type="submit" className="sm:min-w-36">
            {l.common.save}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default UpdateCarModal;
