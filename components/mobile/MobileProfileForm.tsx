'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { authFormSchema } from '@/lib/utils';
import { Form } from '../UI/Form';
import CustomInput from '../UI/CustomInput';
import l from '@/helper/en';

const MobileProfileForm = ({
  type,
  callbackUrl,
}: {
  type: string;
  callbackUrl: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadImages, setUploadImages] = useState<File[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<ReturnType<typeof authFormSchema>>>({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<ReturnType<typeof authFormSchema>>) => {
    setIsLoading(true);
    setError('');
    try {
      if (type === 'sign-up') {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) {
            formData.append(key, value.toString());
          }
        });

        uploadImages.forEach((file) => {
          formData.append('uploadImages', file);
        });

        const response = await axios.post('/api/auth/signup', formData);
        if (response.status === 201) {
          router.push(
            `/verify-email?status=verification-sent`
          );
        }
      } else {
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          if (result.error === 'Please verify your email before logging in') {
            setError(l.auth.emailNotVerified);
          } else {
            setError(l.auth.invalidCredentials);
          }
        } else {
          router.push(callbackUrl || '/');
        }
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message || l.auth.errorOccurred
        );
      } else {
        setError(l.auth.errorOccurred);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files) {
        setUploadImages(Array.from(files));
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {type === 'sign-up' && (
          <div className="flex flex-col gap-2">
            <CustomInput
              control={control}
              name="name"
              label=""
              placeholder={l.common.name}
              type="text"
            />
            <label
              htmlFor="images"
              className="justify-center flex px-2 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              {l.cars.chooseFiles}
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />
            {uploadImages.length > 0 && (
              <span className="text-gray-600">
                {uploadImages.length === 1
                  ? uploadImages[0].name
                  : `${uploadImages[0].name} ${l.common.andMore(uploadImages.length - 1)}`}
              </span>
            )}
          </div>
        )}

        <CustomInput
          control={control}
          name="email"
          label=""
          placeholder={l.common.email}
          type="email"
        />

        <CustomInput
          control={control}
          name="password"
          label=""
          placeholder={l.common.password}
          type="password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {type === 'sign-up' ? (
          <div className="flex flex-col items-center">
            <button
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? l.common.creating : l.auth.createAccount}
            </button>

            <button className="mt-4 w-full py-2 text-gray-600 border border-gray-300 rounded flex items-center justify-center" type="button">
              <Image
                className="mr-2"
                src="/icons/icon-google.svg"
                alt="Google logo"
                width={40}
                height={40}
              />
              {l.common.signUpWithGoogle}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? l.common.loggingIn : l.common.logIn}
            </button>

            <a
              className="mt-4 text-blue-500 text-sm hover:underline"
              href="/forgot-password"
            >
              {l.auth.forgotPassword}
            </a>
          </div>
        )}
      </form>
    </Form>
  );
};

export default MobileProfileForm;
