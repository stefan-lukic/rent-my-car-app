import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType, Dispatch, SetStateAction } from 'react';
import { CarFilterState } from '@/lib/model/car/CarFilterState';

export interface CarFiltersSharedConfig {
  Component: ComponentType<{
    filters: CarFilterState;
    setFilters: Dispatch<SetStateAction<CarFilterState>>;
  }>;
  headingText: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  makeLabel: string;
  carTypeLabel: string;
  engineLabel: string;
  makeDisplayValue: string;
  carTypeDisplayValue: string;
  engineDisplayValue: string;
  carTypeOption: string;
  engineOption: string;
  makeOptionText?: string;
  carTypeOptionText?: string;
  engineOptionText?: string;
  disclaimerText?: string;
  collapsible?: boolean;
}

export const runCarFiltersSharedTests = (config: CarFiltersSharedConfig) => {
  const {
    Component,
    headingText,
    minPlaceholder,
    maxPlaceholder,
    makeLabel,
    carTypeLabel,
    engineLabel,
    makeDisplayValue,
    carTypeDisplayValue,
    engineDisplayValue,
    carTypeOption,
    engineOption,
    makeOptionText,
    carTypeOptionText,
    engineOptionText,
    disclaimerText,
    collapsible,
  } = config;

  const expandFilters = async (user: ReturnType<typeof userEvent.setup>) => {
    if (collapsible) await user.click(screen.getByText(headingText));
  };

  const defaultFilters: CarFilterState = {
    minPrice: '',
    maxPrice: '',
    make: '',
    carType: '',
    engine: '',
  };

  it('renders filter heading', () => {
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    expect(screen.getByText(headingText)).toBeInTheDocument();
  });

  it('renders price range inputs', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    expect(screen.getByPlaceholderText(minPlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(maxPlaceholder)).toBeInTheDocument();
  });

  it('renders make, car type and engine selects', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    expect(screen.getByText(makeLabel)).toBeInTheDocument();
    expect(screen.getByText(carTypeLabel)).toBeInTheDocument();
    expect(screen.getByText(engineLabel)).toBeInTheDocument();
  });

  it('requests filter update when min price changes', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    await user.type(screen.getByPlaceholderText(minPlaceholder), '50');
    expect(setFilters).toHaveBeenCalled();
  });

  it('requests filter update when max price changes', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    await user.type(screen.getByPlaceholderText(maxPlaceholder), '200');
    expect(setFilters).toHaveBeenCalled();
  });

  it('requests filter update when make changes', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    await user.selectOptions(screen.getByDisplayValue(makeDisplayValue), 'BMW');
    expect(setFilters).toHaveBeenCalled();
  });

  it('requests filter update when car type changes', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    await user.selectOptions(
      screen.getByDisplayValue(carTypeDisplayValue),
      carTypeOption
    );
    expect(setFilters).toHaveBeenCalled();
  });

  it('requests filter update when engine changes', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    render(<Component filters={defaultFilters} setFilters={setFilters} />);
    await expandFilters(user);
    await user.selectOptions(
      screen.getByDisplayValue(engineDisplayValue),
      engineOption
    );
    expect(setFilters).toHaveBeenCalled();
  });

  it('displays current filter values as controlled inputs', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();
    const filledFilters: CarFilterState = {
      minPrice: '30',
      maxPrice: '150',
      make: 'Audi',
      carType: 'Hatchback',
      engine: 'Electric',
    };
    render(<Component filters={filledFilters} setFilters={setFilters} />);
    await expandFilters(user);
    expect(screen.getByPlaceholderText(minPlaceholder)).toHaveValue(30);
    expect(screen.getByPlaceholderText(maxPlaceholder)).toHaveValue(150);
  });

  if (makeOptionText) {
    it('renders make select with all options', async () => {
      const user = userEvent.setup();
      const setFilters = vi.fn();
      render(<Component filters={defaultFilters} setFilters={setFilters} />);
      await expandFilters(user);
      expect(screen.getByText(makeOptionText)).toBeInTheDocument();
    });
  }

  if (carTypeOptionText) {
    it('renders car type select with all options', async () => {
      const user = userEvent.setup();
      const setFilters = vi.fn();
      render(<Component filters={defaultFilters} setFilters={setFilters} />);
      await expandFilters(user);
      expect(screen.getByText(carTypeOptionText)).toBeInTheDocument();
    });
  }

  if (engineOptionText) {
    it('renders engine type select with all options', async () => {
      const user = userEvent.setup();
      const setFilters = vi.fn();
      render(<Component filters={defaultFilters} setFilters={setFilters} />);
      await expandFilters(user);
      expect(screen.getByText(engineOptionText)).toBeInTheDocument();
    });
  }

  if (disclaimerText) {
    it('renders prices disclaimer', async () => {
      const user = userEvent.setup();
      const setFilters = vi.fn();
      render(<Component filters={defaultFilters} setFilters={setFilters} />);
      await expandFilters(user);
      expect(screen.getByText(disclaimerText)).toBeInTheDocument();
    });
  }
};
