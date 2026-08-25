const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s()./-]+$/;

export function isValidPhoneNumber(value: string): boolean {
  const phoneNumber = value.trim();
  const digitCount = phoneNumber.replace(/\D/g, '').length;

  return (
    PHONE_ALLOWED_CHARACTERS.test(phoneNumber) &&
    digitCount >= 7 &&
    digitCount <= 15
  );
}

export function normalizePhoneNumber(value: string): string {
  const phoneNumber = value.trim();
  const hasInternationalPrefix = phoneNumber.startsWith('+');
  const digits = phoneNumber.replace(/\D/g, '');

  return `${hasInternationalPrefix ? '+' : ''}${digits}`;
}
