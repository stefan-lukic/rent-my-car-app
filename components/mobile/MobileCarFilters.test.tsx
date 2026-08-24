import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import MobileCarFilters from './MobileCarFilters';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { runCarFiltersSharedTests } from '@/test-utils/shared-tests/car-filters';

const defaultFilters: CarFilterState = {
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
};

describe('MobileCarFilters', () => {
  runCarFiltersSharedTests({
    Component: MobileCarFilters,
    headingText: 'Filters',
    minPlaceholder: 'Min',
    maxPlaceholder: 'Max',
    makeLabel: 'Car Make',
    carTypeLabel: 'Car Type',
    engineLabel: 'Engine Type',
    makeDisplayValue: 'All Manufacturers',
    carTypeDisplayValue: 'All Types',
    engineDisplayValue: 'All Engine Types',
    carTypeOption: 'SUV',
    engineOption: 'DIESEL',
    disclaimerText:
      'Prices in Euros (€) and exclude customized dropoff charges.',
  });
});
