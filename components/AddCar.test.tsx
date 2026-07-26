/**
 * AddCar.test.tsx
 *
 * AddCar komponenta omogućava korisnicima da dodaju novi automobil
 * za iznajmljivanje. Komponenta koristi useAddCar hook za upravljanje
 * kompletnim state-om forme (marka, model, motor, slike, datum, cena, itd.).
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — testiraju se samo UI elementi i njihova
 *   interakcija sa hookom.
 * - useAddCar hook je mockovan — vraćamo kontrolisane vrednosti.
 * - react-datepicker je takodje mockovan jer bi inače zahtevao DOM
 *   operacije koje ne postoje u jsdom.
 * - Stvarna validacija slika, fetch pozivi i redirect se testiraju
 *   u hooks/useAddCar.test.tsx.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Komponenta test: "Da li se sva polja renderuju i prosleđuju
 *   promene hooku?"
 * - Hook test: "Da li hook ispravno validira, kreira FormData,
 *   zove API i menja state?"
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddCar from './AddCar';
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

describe('AddCar', () => {
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

  it('renders form heading and current field values', async () => {
    const user = userEvent.setup();
    render(<AddCar />);

    expect(
      screen.getByRole('heading', { name: l.cars.addNewCar })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(l.cars.model)).toHaveValue('C-Class');
    expect(screen.getByLabelText(l.cars.horsepower)).toHaveValue('150');
    expect(screen.getByLabelText(l.cars.carLocation)).toHaveValue('Liman 3');
    expect(screen.getByLabelText(/Price Per Day/)).toHaveValue(45);
    expect(
      screen.getByPlaceholderText('Tell us more about your car...')
    ).toHaveValue('Reliable car.');
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

    render(<AddCar />);

    expect(screen.getByText('1 file selected')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: 'Car image' })).toHaveAttribute(
      'src',
      'blob:car-image'
    );

    await user.click(screen.getByRole('button', { name: '✕' }));

    expect(removeImage).toHaveBeenCalledWith('image-1');
  });

  runAddCarSharedTests({
    Component: AddCar,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    removeImage,
    useAddCarMock,
    carData,
  });
});
