import { cleanup } from '@testing-library/react';
import { afterEach, describe } from 'vitest';

import CarFilters from './CarFilters';
import { runCarFiltersSharedTests } from '@/test-utils/shared-tests/car-filters';

describe('CarFilters', () => {
  afterEach(cleanup);

  runCarFiltersSharedTests({
    Component: CarFilters,
    headingText: 'Filters',
    minPlaceholder: 'Min',
    maxPlaceholder: 'Max',
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
