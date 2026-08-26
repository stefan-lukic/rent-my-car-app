import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAddCar } from './useAddCar';
import l from '@/helper/en';

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  push: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: mocks.useSession,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}));

const createTextChangeEvent = (name: string, value: string) =>
  ({
    target: {
      name,
      value,
      type: 'text',
    },
  }) as React.ChangeEvent<HTMLInputElement>;

const createFileChangeEvent = (files: File[]) =>
  ({
    target: {
      name: 'images',
      type: 'file',
      files,
    },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;

const submitEvent = {
  preventDefault: vi.fn(),
} as unknown as React.FormEvent;

describe('useAddCar', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useSession.mockReturnValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
      status: 'authenticated',
    });

    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'generated-image-id'),
    });
  });

  it('returns initial car form data', () => {
    const { result } = renderHook(() => useAddCar());

    expect(result.current.carData.carModel).toBe('');
    expect(result.current.carData.images).toEqual([]);
    expect(result.current.carData.city).toBe('');
    expect(result.current.carData.firstRegistration).toBeNull();
    expect(result.current.carData.milage).toBe('');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showSuccess).toBe(false);
  });

  it('redirects unauthenticated user to sign-in page', async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    renderHook(() => useAddCar());

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith('/sign-in');
    });
  });

  it('updates text field values', () => {
    const { result } = renderHook(() => useAddCar());

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('carModel', 'C-Class')
      );
    });

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('pricePerDay', '55')
      );

      result.current.handleInputChange(
        createTextChangeEvent('milage', '50000')
      );
    });

    expect(result.current.carData.carModel).toBe('C-Class');
    expect(result.current.carData.pricePerDay).toBe('55');
    expect(result.current.carData.milage).toBe('50000');
  });

  it('adds selected image files and removes an image by id', () => {
    const { result } = renderHook(() => useAddCar());

    const image = new File(['car image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleInputChange(createFileChangeEvent([image]));
    });

    expect(result.current.carData.images).toEqual([
      {
        file: image,
        id: 'generated-image-id',
      },
    ]);

    act(() => {
      result.current.removeImage('generated-image-id');
    });

    expect(result.current.carData.images).toEqual([]);
  });

  it('updates first registration date', () => {
    const { result } = renderHook(() => useAddCar());

    const registrationDate = new Date('2022-01-01');

    act(() => {
      result.current.handleDateChange(registrationDate);
    });

    expect(result.current.carData.firstRegistration).toEqual(registrationDate);
  });

  it('updates the selected car location', () => {
    const { result } = renderHook(() => useAddCar());

    act(() => {
      result.current.handleLocationChange('Trg Republike 5, Beograd');
    });

    expect(result.current.carData.carLocation).toBe('Trg Republike 5, Beograd');
  });

  it('clears the location when the selected city changes', () => {
    const { result } = renderHook(() => useAddCar());

    act(() => {
      result.current.handleLocationChange('Liman 3');
      result.current.handleInputChange(
        createTextChangeEvent('city', 'Novi Sad')
      );
    });

    expect(result.current.carData.city).toBe('Novi Sad');
    expect(result.current.carData.carLocation).toBe('');
  });

  it('does not submit without first registration date', async () => {
    const { result } = renderHook(() => useAddCar());

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(alert).toHaveBeenCalledWith(l.cars.firstRegistrationRequired);

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('does not submit without an image', async () => {
    const { result } = renderHook(() => useAddCar());

    act(() => {
      result.current.handleDateChange(new Date('2022-01-01'));
      result.current.handleInputChange(
        createTextChangeEvent('city', 'Novi Sad')
      );
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(alert).toHaveBeenCalledWith(l.cars.atLeastOneImage);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('submits FormData and redirects after successful request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const { result } = renderHook(() => useAddCar());

    const image = new File(['car image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('carModel', 'C-Class')
      );

      result.current.handleDateChange(new Date('2022-01-01'));

      result.current.handleInputChange(
        createTextChangeEvent('city', 'Novi Sad')
      );

      result.current.handleInputChange(createFileChangeEvent([image]));
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/cars/add-car',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    expect(mocks.push).toHaveBeenCalledWith('/profile/my-profile');

    expect(result.current.showSuccess).toBe(true);
  });

  it('shows error when request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAddCar());

    const image = new File(['car image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleDateChange(new Date('2022-01-01'));

      result.current.handleInputChange(
        createTextChangeEvent('city', 'Novi Sad')
      );

      result.current.handleInputChange(createFileChangeEvent([image]));
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(alert).toHaveBeenCalledWith(l.cars.failedAddCar);
    expect(result.current.isSubmitting).toBe(false);
  });
});
