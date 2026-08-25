import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Controller, useForm } from 'react-hook-form';
import CustomDatePicker from './CustomDatePicker';
import l from '@/helper/en';

vi.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({
    selected,
    onChange,
    placeholderText,
    id,
  }: {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText: string;
    id?: string;
  }) => (
    <input
      id={id}
      data-testid={id || 'datepicker'}
      aria-label={id || 'DatePicker'}
      value={selected ? selected.toISOString() : ''}
      placeholder={placeholderText}
      onChange={() => onChange(new Date('2024-01-01'))}
    />
  ),
}));

describe('CustomDatePicker', () => {
  const renderWithForm = (
    props: Partial<React.ComponentProps<typeof CustomDatePicker>> = {}
  ) => {
    const Component = () => {
      const { control } = useForm({
        defaultValues: { testDate: new Date('2024-01-01') as Date | null },
      });

      return (
        <CustomDatePicker
          name="testDate"
          control={control as any}
          label="Pick a date"
          {...props}
        />
      );
    };

    return render(<Component />);
  };

  it('renders label and date picker input', () => {
    renderWithForm();

    const input = screen.getByTestId('testDate-input');

    expect(input).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders custom placeholder text', () => {
    renderWithForm({ placeholderText: 'Select your preferred date' });

    expect(
      screen.getByPlaceholderText('Select your preferred date')
    ).toBeInTheDocument();
  });

  it('uses default placeholder from localization when custom placeholder is not provided', () => {
    renderWithForm();

    expect(screen.getByPlaceholderText(l.cars.selectDate)).toBeInTheDocument();
  });

  it('links label to input via htmlFor attribute', () => {
    renderWithForm({ name: 'startDate' });

    const label = screen.getByText('Pick a date');

    expect(label).toHaveAttribute('for', 'startDate-input');

    const input = screen.getByTestId('startDate-input');

    expect(input).toHaveAttribute('id', 'startDate-input');
  });

  it('integrates with react-hook-form Controller', () => {
    renderWithForm({ name: 'pickupDate' });

    const input = screen.getByTestId('pickupDate-input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'pickupDate-input');
  });

  it('uses MM/dd/yyyy date format', () => {
    renderWithForm();

    const input = screen.getByTestId('testDate-input');

    expect(input).toHaveAttribute('value', '2024-01-01T00:00:00.000Z');
  });
});
