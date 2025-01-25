import { headers } from 'next/headers';

export const isMobileSSR = (): boolean => {
  const userAgent = headers().get('user-agent') || '';
  return /mobile/i.test(userAgent);
};
