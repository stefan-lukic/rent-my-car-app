import { describe, expect, it } from 'vitest';
import Rental from './Rental';
import Car from './car/Car';

describe('profile query indexes', () => {
  it('indexes rentals by client and owner pickup order', () => {
    const indexes = Rental.schema.indexes().map(([fields]) => fields);

    expect(indexes).toContainEqual({ client: 1 });
    expect(indexes).toContainEqual({
      renter: 1,
      'rentalPeriod.startDate': 1,
    });
  });

  it('indexes cars by owner', () => {
    const indexes = Car.schema.indexes().map(([fields]) => fields);

    expect(indexes).toContainEqual({ renter: 1 });
  });
});
