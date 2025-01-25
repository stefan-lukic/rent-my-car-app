export const isMobileCSR = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 680;
};
