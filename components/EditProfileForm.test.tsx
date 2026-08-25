import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EditProfileForm from './EditProfileForm';

const handleInputChange = vi.fn();

const handleSubmit = vi.fn((event: React.FormEvent) => {
  event.preventDefault();
});

const useEditProfileMock = vi.fn();

vi.mock('@/hooks/useEditProfile', () => ({
  useEditProfile: (initialProfile: unknown) =>
    useEditProfileMock(initialProfile),
}));

const initialProfile = {
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '+381 60 123 4567',
  profileImage: 'https://example.com/profile.jpg',
};

describe('EditProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useEditProfileMock.mockReturnValue({
      profileData: {
        name: 'Marko Markovic',
        contactInfo: '+381 60 123 4567',
        image: null,
      },
      imagePreview: 'https://example.com/profile.jpg',
      isSubmitting: false,
      error: '',
      handleInputChange,
      handleSubmit,
    });
  });

  it('renders initial profile data and preview image', async () => {
    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(
      screen.getByRole('heading', {
        name: 'Make your profile feel like you.',
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Full Name')).toHaveValue('Marko Markovic');

    expect(screen.getByLabelText('Phone number')).toHaveValue(
      '+381 60 123 4567'
    );
    expect(screen.getByLabelText('Phone number')).toBeRequired();
    expect(screen.getByLabelText('Phone number')).toHaveAttribute(
      'type',
      'tel'
    );

    expect(screen.getByLabelText('Email')).toHaveValue('marko@example.com');

    expect(screen.getByLabelText('Email')).toBeDisabled();

    expect(
      screen.getByRole('img', { name: 'Profile preview' })
    ).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });

  it('forwards text field changes to the profile hook', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm initialProfile={initialProfile} />);

    await user.type(screen.getByLabelText('Full Name'), 'Ana Jovanovic');

    expect(handleInputChange).toHaveBeenCalled();
  });

  it('forwards image selection to the profile hook', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditProfileForm initialProfile={initialProfile} />
    );

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const image = new File(['image-content'], 'profile.png', {
      type: 'image/png',
    });

    await user.upload(fileInput, image);

    expect(handleInputChange).toHaveBeenCalled();
  });

  it('submits through the profile hook', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm initialProfile={initialProfile} />);

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  it('shows hook error message', async () => {
    useEditProfileMock.mockReturnValue({
      profileData: {
        name: 'Marko Markovic',
        contactInfo: '+381 60 123 4567',
        image: null,
      },
      imagePreview: '',
      isSubmitting: false,
      error: 'Full name is required.',
      handleInputChange,
      handleSubmit,
    });

    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
  });

  it('disables save button while submitting', async () => {
    useEditProfileMock.mockReturnValue({
      profileData: {
        name: 'Marko Markovic',
        contactInfo: '+381 60 123 4567',
        image: null,
      },
      imagePreview: '',
      isSubmitting: true,
      error: '',
      handleInputChange,
      handleSubmit,
    });

    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });

  it('links back to My Profile when Cancel is clicked', async () => {
    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/profile/my-profile'
    );
  });
});
