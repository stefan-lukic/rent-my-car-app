'use client';
import { useState } from 'react';
import { Button } from './UI/Button';
import l from '@/helper/en';

interface DeleteCarModalProps {
  isOpen: boolean;
  carId: string;
  onDelete: (carId: string) => void;
  onClose: () => void;
}

const DeleteCarModal: React.FC<DeleteCarModalProps> = ({
  isOpen,
  carId,
  onDelete,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/cars/delete-car', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: carId }),
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response
          .json()
          .catch(() => ({}));
        throw new Error(errorData.message || l.cars.deleteCarError);
      }

      onDelete(carId);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : l.cars.deleteCarError
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-2">{l.cars.deleteCar}</h2>
        <p className="text-gray-500 mb-6">{l.cars.deleteCarConfirm}</p>
        {errorMessage && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black"
          >
            {l.common.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? l.common.deleting : l.common.delete}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarModal;
