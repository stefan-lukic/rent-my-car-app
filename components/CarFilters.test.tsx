import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarFilters from './CarFilters';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { runCarFiltersSharedTests } from '@/test-utils/shared-tests/car-filters';

const defaultFilters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
};

describe('CarFilters', () => {
  afterEach(cleanup);

  runCarFiltersSharedTests({
    Component: CarFilters,
    headingText: 'Filters',
    minPlaceholder: 'Min $',
    maxPlaceholder: 'Max $',
    makeLabel: 'Car Make',
    carTypeLabel: 'Car Type',
    engineLabel: 'Engine Type',
    makeDisplayValue: 'All Makes',
    carTypeDisplayValue: 'All Types',
    engineDisplayValue: 'All Engine Types',
    carTypeOption: 'SUV',
    engineOption: 'DIESEL',
    makeOptionText: 'All Makes',
    carTypeOptionText: 'All Types',
    engineOptionText: 'All Engine Types',
  });
});
