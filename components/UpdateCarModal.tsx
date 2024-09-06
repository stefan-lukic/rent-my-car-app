import { useState } from 'react';
import { Button } from './UI/Button';
import { ICar } from '@/lib/model/car/Car';

type UpdateCarFields = Pick<ICar, 'make' | 'carModel' | 'engine' | 'power'>;

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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        throw new Error(errorData.message || 'Failed to update car');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Update Car</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="make"
              className="block text-sm font-medium text-gray-700"
            >
              Make
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={updatedCar.make}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="carModel"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <input
              type="text"
              id="carModel"
              name="carModel"
              value={updatedCar.carModel}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="engine"
              className="block text-sm font-medium text-gray-700"
            >
              Engine
            </label>
            <input
              type="text"
              id="engine"
              name="engine"
              value={updatedCar.engine}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="power"
              className="block text-sm font-medium text-gray-700"
            >
              Power
            </label>
            <input
              type="text"
              id="power"
              name="power"
              value={updatedCar.power}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarModal;
