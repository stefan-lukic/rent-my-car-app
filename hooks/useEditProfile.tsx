'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type EditProfileData = {
  name: string;
  contactInfo: string;
  image: File | null;
};

type InitialProfileData = {
  name: string;
  contactInfo: string;
  profileImage: string;
};

export function useEditProfile(initialProfile: InitialProfileData) {
  const [profileData, setProfileData] = useState<EditProfileData>({
    name: initialProfile.name,
    contactInfo: initialProfile.contactInfo,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(initialProfile.profileImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const image = e.target.files?.[0];

      if (!image) return;

      if (!image.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }

      if (image.size > 5 * 1024 * 1024) {
        setError('Profile image must be smaller than 5 MB.');
        return;
      }

      setError('');
      setProfileData((prev) => ({ ...prev, image }));
      setImagePreview(URL.createObjectURL(image));
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profileData.name.trim()) {
      setError('Full name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('name', profileData.name);
      formData.append('contactInfo', profileData.contactInfo);

      if (profileData.image) {
        formData.append('image', profileData.image);
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to update profile.');
      }

      router.push('/profile/my-profile');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to update profile.'
      );
      setIsSubmitting(false);
    }
  };

  return {
    profileData,
    imagePreview,
    isSubmitting,
    error,
    handleInputChange,
    handleSubmit,
  };
}
