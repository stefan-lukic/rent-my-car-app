export interface MockFiltersOverrides {
  minPrice?: string;
  maxPrice?: string;
  make?: string;
  carType?: string;
  engine?: string;
}

export const createMockFilters = (overrides?: MockFiltersOverrides) => ({
  minPrice: '',
  maxPrice: '',
  make: '',
  carType: '',
  engine: '',
  ...overrides,
});
