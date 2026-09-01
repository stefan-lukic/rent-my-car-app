import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditProfile } from './useEditProfile';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mocks.replace,
  }),
}));

const initialProfile = {
  name: 'Marko Markovic',
  contactInfo: '+381 60 123 4567',
  profileImage: 'https://example.com/profile.jpg',
};

const createTextChangeEvent = (name: string, value: string) =>
  ({
    target: {
      name,
      value,
      type: 'text',
    },
  }) as React.ChangeEvent<HTMLInputElement>;

const createFileChangeEvent = (file: File) =>
  ({
    target: {
      name: 'image',
      type: 'file',
      files: [file],
    },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;

describe('useEditProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('fetch', vi.fn());

    vi.stubGlobal('alert', vi.fn());

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:profile-image'),
    });
  });

  it('returns initial profile state', () => {
    const { result } = renderHook(() => useEditProfile(initialProfile));

    expect(result.current.profileData).toEqual({
      name: 'Marko Markovic',
      contactInfo: '+381 60 123 4567',
      image: null,
    });

    expect(result.current.imagePreview).toBe('https://example.com/profile.jpg');

    expect(result.current.error).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('updates name and contact information', () => {
    const { result } = renderHook(() => useEditProfile(initialProfile));

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('name', 'Ana Jovanovic')
      );

      result.current.handleInputChange(
        createTextChangeEvent('contactInfo', '+381 61 111 2222')
      );
    });

    expect(result.current.profileData.name).toBe('Ana Jovanovic');

    expect(result.current.profileData.contactInfo).toBe('+381 61 111 2222');
  });

  it('rejects a file that is not an image', () => {
    const { result } = renderHook(() => useEditProfile(initialProfile));

    const file = new File(['text'], 'document.pdf', {
      type: 'application/pdf',
    });

    act(() => {
      result.current.handleInputChange(createFileChangeEvent(file));
    });

    expect(result.current.error).toBe('Please select an image file.');

    expect(result.current.profileData.image).toBeNull();
  });

  it('rejects image larger than 5 MB', () => {
    const { result } = renderHook(() => useEditProfile(initialProfile));

    const oversizedFile = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      'large-image.png',
      { type: 'image/png' }
    );

    act(() => {
      result.current.handleInputChange(createFileChangeEvent(oversizedFile));
    });

    expect(result.current.error).toBe(
      'Profile image must be smaller than 5 MB.'
    );
  });

  it('accepts valid image and generates preview URL', () => {
    const { result } = renderHook(() => useEditProfile(initialProfile));

    const image = new File(['image'], 'profile.png', {
      type: 'image/png',
    });

    act(() => {
      result.current.handleInputChange(createFileChangeEvent(image));
    });

    expect(result.current.error).toBe('');
    expect(result.current.profileData.image).toBe(image);
    expect(result.current.imagePreview).toBe('blob:profile-image');
    expect(URL.createObjectURL).toHaveBeenCalledWith(image);
  });

  it('rejects submit when name is empty', async () => {
    const { result } = renderHook(() =>
      useEditProfile({
        ...initialProfile,
        name: '',
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('Full name is required.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects submit when contact information is not a phone number', async () => {
    const { result } = renderHook(() =>
      useEditProfile({
        ...initialProfile,
        contactInfo: '0#dfj,#&!$%213',
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('Enter a valid phone number.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('saves profile and redirects after successful request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const { result } = renderHook(() => useEditProfile(initialProfile));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/users/me',
        expect.objectContaining({
          method: 'PUT',
          body: expect.any(FormData),
        })
      );
    });

    const request = vi.mocked(fetch).mock.calls[0][1];
    const submittedData = request?.body as FormData;
    expect(submittedData.get('contactInfo')).toBe('+381601234567');

    expect(mocks.replace).toHaveBeenCalledWith('/profile/my-profile');
  });

  it('shows server error after unsuccessful request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Profile update failed.',
      }),
    } as Response);

    const { result } = renderHook(() => useEditProfile(initialProfile));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('Profile update failed.');
    expect(result.current.isSubmitting).toBe(false);
  });
});
