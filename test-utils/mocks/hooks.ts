import { vi } from 'vitest';

export const createUseAuthMock = () => {
  const mocks = vi.hoisted(() => ({
    useAuth: vi.fn(),
  }));

  vi.mock('@/hooks/useAuth', () => ({
    useAuth: mocks.useAuth,
  }));

  return mocks;
};

export const createUseEditProfileMock = () => {
  const mocks = vi.hoisted(() => ({
    useEditProfile: vi.fn(),
  }));

  vi.mock('@/hooks/useEditProfile', () => ({
    useEditProfile: (initialProfile: unknown) => mocks.useEditProfile(initialProfile),
  }));

  return mocks;
};

export const createUseAddCarMock = () => {
  const mocks = vi.hoisted(() => ({
    useAddCar: vi.fn(),
  }));

  vi.mock('@/hooks/useAddCar', () => ({
    useAddCar: () => mocks.useAddCar(),
  }));

  return mocks;
};

export const createUseForgotPasswordMock = () => {
  const mocks = vi.hoisted(() => ({
    useForgotPassword: vi.fn(),
  }));

  vi.mock('@/hooks/useForgotPassword', () => ({
    useForgotPassword: () => mocks.useForgotPassword(),
  }));

  return mocks;
};

export const createUseCarSearchMock = () => {
  const mocks = vi.hoisted(() => ({
    useCarSearchForm: vi.fn(),
  }));

  vi.mock('@/hooks/useCarSearch', () => ({
    useCarSearchForm: mocks.useCarSearchForm,
  }));

  return mocks;
};

export const createUseBookingFlowMock = () => {
  const mocks = vi.hoisted(() => ({
    useBookingFlow: vi.fn(),
  }));

  vi.mock('@/hooks/useBookingFlow', () => ({
    useBookingFlow: mocks.useBookingFlow,
  }));

  return mocks;
};