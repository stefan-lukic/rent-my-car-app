import { describe, expect, it } from 'vitest';
import { calculateAverageRating, isRating } from './rating';

describe('rating helpers', () => {
  it('accepts only whole-number ratings from 1 to 5', () => {
    expect(isRating(1)).toBe(true);
    expect(isRating(5)).toBe(true);

    expect(isRating(0)).toBe(false);
    expect(isRating(6)).toBe(false);
    expect(isRating(4.5)).toBe(false);
    expect(isRating('5')).toBe(false);
    expect(isRating(null)).toBe(false);
    expect(isRating({ value: 5 })).toBe(false);
  });

  it('returns a rounded rating summary from an aggregation result', () => {
    expect(calculateAverageRating([{ average: 4.666, count: 3 }])).toEqual({
      rating: 4.7,
      ratingCount: 3,
    });
  });

  it('returns an empty rating summary when there are no ratings', () => {
    expect(calculateAverageRating([])).toEqual({
      rating: 0,
      ratingCount: 0,
    });
  });
});
