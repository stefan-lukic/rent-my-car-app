'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@/components/UI/Button';
import FormInput from '@/components/UI/FormInput';
import { useEditProfile } from '@/hooks/useEditProfile';
import { useRouter } from 'next/navigation';

type MobileEditProfileFormProps = {
  initialProfile: {
    name: string;
    email: string;
    contactInfo: string;
    profileImage: string;
  };
};

export default function MobileEditProfileForm({
  initialProfile,
}: MobileEditProfileFormProps) {
  const router = useRouter();

  const {
    profileData,
    imagePreview,
    isSubmitting,
    error,
    handleInputChange,
    handleSubmit,
  } = useEditProfile(initialProfile);

  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Edit Profile
        </h1>
        <p className="text-sm text-gray-500">
          Update your public contact details and profile photo.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Profile Photo
          </label>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-gray-100 shadow-sm shrink-0">
              <img
                src={imagePreview || '/placeholder-user.svg'}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>

            <label
              htmlFor="image"
              className="flex flex-1 items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-2xl cursor-pointer hover:bg-blue-600 text-sm font-medium"
            >
              <CloudUploadIcon fontSize="small" />
              Choose Photo
            </label>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          <p className="text-xs text-gray-400">JPG, PNG or WebP, up to 5 MB</p>
        </div>

        <FormInput
          label="Full Name"
          name="name"
          value={profileData.name}
          onChange={handleInputChange}
          placeholder="e.g. Srdjan Markovic"
          required
          maxLength={80}
        />

        <FormInput
          label="Phone or Contact"
          name="contactInfo"
          value={profileData.contactInfo}
          onChange={handleInputChange}
          placeholder="e.g. +381 60 123 4567"
          maxLength={100}
        />

        <div className="pt-2">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={initialProfile.email}
            disabled
            className="cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-2">
            Email changes require a separate verification process.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-2xl py-3 text-white w-full ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-2xl py-3 w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
