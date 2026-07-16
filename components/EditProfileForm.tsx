'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@/components/UI/Button';
import FormInput from '@/components/UI/FormInput';
import { useEditProfile } from '@/hooks/useEditProfile';
import { useRouter } from 'next/navigation';

type EditProfileFormProps = {
  initialProfile: {
    name: string;
    email: string;
    contactInfo: string;
    profileImage: string;
  };
};

export default function EditProfileForm({
  initialProfile,
}: EditProfileFormProps) {
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
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 md:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-500">
            Update your public contact details and profile photo.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Profile Photo
            </label>

            <div className="relative group">
              <div className="w-full h-32 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center gap-4 bg-blue-50 cursor-pointer">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white bg-gray-100 shadow-sm">
                  <img
                    src={imagePreview || '/placeholder-user.svg'}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <CloudUploadIcon
                    className="text-blue-500 mb-1"
                    fontSize="large"
                  />
                  <p className="text-sm font-medium text-blue-600">
                    Click to upload a new profile photo
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or WebP, up to 5 MB
                  </p>
                </div>
              </div>

              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleInputChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div className="pt-4 border-t border-gray-100">
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

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-2xl px-6 py-3"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-2xl px-6 py-3 text-white ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
