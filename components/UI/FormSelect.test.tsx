import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormSelect from './FormSelect';

describe('FormSelect', () => {
  it('renders label text', () => {
    render(
      <FormSelect label="Car Type" name="carType" options={['Sedan', 'SUV']} />
    );

    expect(screen.getByText('Car Type')).toBeInTheDocument();
  });

  it('links label to select element via htmlFor', () => {
    render(
      <FormSelect label="Car Type" name="carType" options={['Sedan', 'SUV']} />
    );

    const label = screen.getByText('Car Type');
    const select = screen.getByLabelText('Car Type');

    expect(label).toHaveAttribute('for', 'carType');
    expect(select).toHaveAttribute('id', 'carType');
  });

  it('renders all options', () => {
    render(
      <FormSelect
        label="Car Type"
        name="carType"
        options={['Sedan', 'SUV', 'Hatchback']}
      />
    );

    const select = screen.getByLabelText('Car Type');
    expect(select).toContainHTML('Sedan');
    expect(select).toContainHTML('SUV');
    expect(select).toContainHTML('Hatchback');
  });

  it('generates default id from label when name and id are missing', () => {
    render(<FormSelect label="Engine Type" options={['Petrol', 'Diesel']} />);

    const label = screen.getByText('Engine Type');
    expect(label).toHaveAttribute('for', 'engine-type');
  });

  it('displays error message when provided', () => {
    render(
      <FormSelect
        label="Car Type"
        name="carType"
        options={['Sedan', 'SUV']}
        error="Car type is required"
      />
    );

    expect(screen.getByText('Car type is required')).toBeInTheDocument();
  });
});
