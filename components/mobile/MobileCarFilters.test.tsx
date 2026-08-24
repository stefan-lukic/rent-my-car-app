import { describe } from 'vitest';

import MobileCarFilters from './MobileCarFilters';
import { runCarFiltersSharedTests } from '@/test-utils/shared-tests/car-filters';

describe('MobileCarFilters', () => {
  runCarFiltersSharedTests({
    Component: MobileCarFilters,
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
    disclaimerText:
      'Prices in Euros (€) and exclude customized dropoff charges.',
    collapsible: true,
  });
});
