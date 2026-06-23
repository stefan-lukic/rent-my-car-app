'use client';
import { useState } from 'react';
import { Button } from './UI/Button';

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/cars/delete-car', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: carId }),
      });

      if (!response.ok) throw new Error('Failed to delete car');

      onDelete(carId);
      onClose();
    } catch (error) {
      alert('Failed to delete car. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-2">Delete Car</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete this car? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarModal;
