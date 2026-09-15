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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-car-title"
        className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-xl"
      >
        <h2
          id="delete-car-title"
          className="mb-2 font-heading text-xl font-bold text-ink"
        >
          {l.cars.deleteCar}
        </h2>
        <p className="mb-6 text-sm leading-6 text-slate-500">
          {l.cars.deleteCarConfirm}
        </p>
        {errorMessage && (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="sm:min-w-28"
          >
            {l.common.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            className="sm:min-w-28"
          >
            {isDeleting ? l.common.deleting : l.common.delete}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarModal;
