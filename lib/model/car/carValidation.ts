export const CAR_FIELD_LIMITS = {
  modelLength: 100,
  horsepower: { min: 1, max: 2000 },
  seats: { min: 1, max: 9 },
  averageConsumption: { min: 0.1, max: 100 },
  pricePerDay: { min: 1, max: 100000 },
  mileage: { min: 0, max: 1000000 },
  locationLength: 200,
  descriptionLength: 2000,
} as const;

export const CAR_MODEL_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s._/()+-]*$/u;

const WHOLE_NUMBER_PATTERN = /^\d+$/;
const DECIMAL_NUMBER_PATTERN = /^\d+(?:\.\d+)?$/;

export function isNumberInRange(
  value: string | number,
  min: number,
  max: number,
  wholeNumber = false
): boolean {
  const stringValue = String(value).trim();
  const pattern = wholeNumber ? WHOLE_NUMBER_PATTERN : DECIMAL_NUMBER_PATTERN;

  if (!pattern.test(stringValue)) return false;

  const number = Number(stringValue);
  return Number.isFinite(number) && number >= min && number <= max;
}

export function normalizeLegacyNumericValue(value: string | number): string {
  const match = String(value).match(/\d+(?:\.\d+)?/);
  return match?.[0] ?? '';
}
