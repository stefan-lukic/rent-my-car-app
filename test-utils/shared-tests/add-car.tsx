import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import l from '@/helper/en';

interface AddCarSharedConfig {
  Component: ComponentType<{}>;
  handleInputChange: ReturnType<typeof vi.fn>;
  handleLocationChange?: ReturnType<typeof vi.fn>;
  handleDateChange: ReturnType<typeof vi.fn>;
  handleSubmit: ReturnType<typeof vi.fn>;
  removeImage: ReturnType<typeof vi.fn>;
  useAddCarMock: ReturnType<typeof vi.fn>;
  carData: Record<string, unknown>;
}

export const runAddCarSharedTests = (config: AddCarSharedConfig) => {
  const {
    Component,
    handleInputChange,
    handleLocationChange,
    handleDateChange,
    handleSubmit,
    removeImage,
    useAddCarMock,
    carData,
  } = config;

  it('updates car data when user types in model input', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.type(screen.getByLabelText(/model/i), 'E-Class');
    await user.type(screen.getByLabelText(/make/i), 'BMW');

    expect(handleInputChange).toHaveBeenCalled();
  });

  it('updates first registration when date is selected', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.type(screen.getByLabelText(/first registration/i), '2020-01-01');

    expect(handleDateChange).toHaveBeenCalledWith(new Date('2020-01-01'));
  });

  it('uploads images when file input changes', async () => {
    const user = userEvent.setup();
    const { container } = render(<Component />);

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const image = new File(['car-image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    await user.upload(fileInput, [image]);

    expect(handleInputChange).toHaveBeenCalled();
  });

  it('submits form when Publish Car button is clicked', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.click(screen.getByRole('button', { name: l.cars.publishCar }));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('disables submit button and shows loading text while submitting', async () => {
    const user = userEvent.setup();
    useAddCarMock.mockReturnValue({
      carData,
      isSubmitting: true,
      handleInputChange,
      handleLocationChange,
      handleDateChange,
      handleSubmit,
      removeImage,
    });

    render(<Component />);

    expect(
      screen.getByRole('button', { name: l.common.adding })
    ).toBeDisabled();
  });
};
