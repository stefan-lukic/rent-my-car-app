import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileAddCar from './MobileAddCar';
import l from '@/helper/en';
import { runAddCarSharedTests } from '@/test-utils/shared-tests/add-car';

const handleInputChange = vi.fn();
const handleDateChange = vi.fn();
const handleSubmit = vi.fn((event: React.FormEvent) => {
  event.preventDefault();
});
const removeImage = vi.fn();

const useAddCarMock = vi.fn();

vi.mock('@/hooks/useAddCar', () => ({
  useAddCar: () => useAddCarMock(),
}));

vi.mock('react-datepicker', () => ({
  default: ({
    selected,
    onChange,
    placeholderText,
  }: {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText: string;
  }) => (
    <input
      aria-label="First Registration"
      value={selected ? selected.toISOString() : ''}
      placeholder={placeholderText}
      onChange={() => onChange(new Date('2020-01-01'))}
    />
  ),
}));

const carData = {
  make: 'MERCEDES',
  carModel: 'C-Class',
  engine: 'PETROL',
  power: '150',
  carType: 'SALOON',
  city: 'NOVI_SAD',
  carLocation: 'Liman 3',
  firstRegistration: null,
  images: [],
  pricePerDay: '45',
  milage: 0,
  averageConsumption: '6.5 L/100km',
  description: 'Reliable car.',
};

describe('MobileAddCar', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAddCarMock.mockReturnValue({
      carData,
      isSubmitting: false,
      handleInputChange,
      handleDateChange,
      handleSubmit,
      removeImage,
    });
  });

  it('renders form heading and mobile-specific field values', () => {
    render(<MobileAddCar />);

    expect(
      screen.getByRole('heading', { name: l.cars.addNewCar })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(l.cars.model)).toHaveValue('C-Class');
    expect(screen.getByLabelText(l.cars.horsepowerMobile)).toHaveValue('150');
    expect(screen.getByLabelText(l.cars.avgConsumption)).toHaveValue(
      '6.5 L/100km'
    );
    expect(screen.getByLabelText(l.cars.city)).toHaveValue('Belgrade');
  });

  it('renders selected images and removes an image on click', async () => {
    const user = userEvent.setup();
    useAddCarMock.mockReturnValue({
      carData: {
        ...carData,
        images: [
          {
            id: 'image-1',
            file: new File(['car-image'], 'car.jpg', {
              type: 'image/jpeg',
            }),
          },
        ],
      },
      isSubmitting: false,
      handleInputChange,
      handleDateChange,
      handleSubmit,
      removeImage,
    });

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:car-image');

    render(<MobileAddCar />);

    expect(
      screen.getByRole('img', { name: l.cars.carImagePreview })
    ).toHaveAttribute('src', 'blob:car-image');

    await user.click(screen.getByRole('button', { name: l.cars.removeImage }));

    expect(removeImage).toHaveBeenCalledWith('image-1');
  });

  runAddCarSharedTests({
    Component: MobileAddCar,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    removeImage,
    useAddCarMock,
    carData,
  });
});
