import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICar } from '@/lib/model/car/Car';
import UpdateCarModal from './UpdateCarModal';
import l from '@/helper/en';

const car = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
  engine: 'DIESEL',
  power: '250',
  carType: 'SUV',
  city: 'Belgrade',
  carLocation: 'New Belgrade',
  averageConsumption: '7.5',
  pricePerDay: 90,
  description: 'Family SUV',
} as ICar;

describe('UpdateCarModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  const renderModal = (overrides = {}) => {
    const props = {
      isOpen: true,
      car,
      onUpdate: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };

    render(<UpdateCarModal {...props} />);
    return props;
  };

  it('does not render when closed', async () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText(l.cars.updateCar)).not.toBeInTheDocument();
  });

  it('renders current car values', async () => {
    renderModal();

    expect(screen.getByLabelText(l.cars.model)).toHaveValue('X5');
    expect(screen.getByLabelText(l.cars.horsepower)).toHaveValue('250');

    expect(screen.getByLabelText(l.cars.carLocation)).toHaveValue(
      'New Belgrade'
    );

    expect(screen.getByLabelText(l.cars.pricePerDayLabel)).toHaveValue(90);

    expect(screen.getByPlaceholderText(l.common.clickToUpload)).toHaveValue(
      'Family SUV'
    );
  });

  it('updates field values before submitting', async () => {
    const user = userEvent.setup();
    renderModal();

    const modelInput = screen.getByLabelText(l.cars.model);
    await user.clear(modelInput);
    await user.type(modelInput, 'X3');

    expect(modelInput).toHaveValue('X3');
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.cancel }));

    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it('submits changed car data and calls callbacks on success', async () => {
    const user = userEvent.setup();
    const updatedCar = {
      ...car,
      carModel: 'X3',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ car: updatedCar }),
    } as Response);

    const props = renderModal();

    const modelInput = screen.getByLabelText(l.cars.model);
    await user.clear(modelInput);
    await user.type(modelInput, 'X3');

    await user.click(screen.getByRole('button', { name: l.common.save }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/cars/update-car',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    const requestOptions = vi.mocked(fetch).mock.calls[0][1];
    expect(JSON.parse(requestOptions?.body as string)).toMatchObject({
      _id: 'car-1',
      carModel: 'X3',
    });

    expect(props.onUpdate).toHaveBeenCalledWith(updatedCar);
    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it('shows server error when update fails', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Unable to update this car.',
      }),
    } as Response);

    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.save }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Unable to update this car.');
    });

    expect(props.onUpdate).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
