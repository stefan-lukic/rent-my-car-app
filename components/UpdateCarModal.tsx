import { useState } from 'react';
import { Button } from './UI/Button';
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
import l from '@/helper/en';

type UpdateCarFields = Pick<
  ICar,
  | 'make'
  | 'carModel'
  | 'engine'
  | 'power'
  | 'carType'
  | 'city'
  | 'averageConsumption'
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
    power: car.power,
    carType: car.carType,
    city: car.city,
    averageConsumption: car.averageConsumption,
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
    setUpdatedCar({ ...updatedCar, [name]: value });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            {l.cars.updateCar}
          </h2>
          <p className="text-gray-500">{l.cars.editVehicleDesc}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
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
              value={updatedCar.power}
              onChange={handleInputChange}
              placeholder={l.cars.eg150}
              required
            />
            <FormInput
              label={l.cars.avgConsumption}
              name="averageConsumption"
              value={updatedCar.averageConsumption}
              onChange={handleInputChange}
              placeholder={l.cars.eg65L}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <FormSelect
              label={l.cars.city}
              name="city"
              value={updatedCar.city}
              onChange={handleInputChange}
              options={Object.values(CarCity)}
            />
            <FormInput
              label={l.cars.carLocation}
              name="carLocation"
              value={updatedCar.carLocation}
              onChange={handleInputChange}
              placeholder={l.cars.egLiman}
              required
            />
            <FormInput
              label={l.cars.pricePerDayLabel}
              name="pricePerDay"
              type="number"
              value={updatedCar.pricePerDay}
              onChange={handleInputChange}
              placeholder={l.cars.eg45}
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className={labelClasses}>{l.common.description}</label>
            <textarea
              name="description"
              rows={4}
              placeholder={l.common.clickToUpload}
              value={updatedCar.description}
              onChange={handleInputChange}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
            >
              {l.common.cancel}
            </Button>
            <Button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
            >
              {l.common.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarModal;
