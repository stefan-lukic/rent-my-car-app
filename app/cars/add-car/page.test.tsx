import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  redirect: vi.fn(),
  isMobileSSR: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: mocks.getServerSession,
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));

vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

vi.mock('@/utils/deviceDetectionSSR', () => ({
  isMobileSSR: mocks.isMobileSSR,
}));

vi.mock('@/components/AddCar', () => ({
  default: () => <div>Desktop add car</div>,
}));

vi.mock('@/components/mobile/MobileAddCar', () => ({
  default: () => <div>Mobile add car</div>,
}));

import AddCarPage from './page';

describe('AddCarPage session guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isMobileSSR.mockReturnValue(false);
  });

  it('redirects when the server session is missing or revoked', async () => {
    mocks.getServerSession.mockResolvedValue(null);

    await AddCarPage();

    expect(mocks.redirect).toHaveBeenCalledWith(
      '/sign-in?callbackUrl=/cars/add-car'
    );
  });

  it('renders the form when the server session is valid', async () => {
    mocks.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });

    const page = await AddCarPage();

    expect(mocks.redirect).not.toHaveBeenCalled();
    expect(page).toBeTruthy();
  });
});
