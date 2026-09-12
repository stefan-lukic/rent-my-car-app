'use client';

import l from '@/helper/en';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Form } from './UI/Form';
import CustomInput from './UI/CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

const ProfileForm = ({
  type,
  callbackUrl,
}: {
  type: string;
  callbackUrl: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const router = useRouter();

  const form = useForm<z.infer<ReturnType<typeof authFormSchema>>>({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
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
          if (key === 'confirmPassword') return;
          if (value !== null) {
            formData.append(key, value.toString());
          }
        });

        uploadImages.forEach((file) => {
          formData.append('uploadImages', file);
        });

        const response = await axios.post('/api/auth/signup', formData);
        if (response.status === 201) {
          router.push(`/verify-email?status=verification-sent`);
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
        setError(err.response?.data?.message || l.auth.errorOccurred);
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
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files) {
        const filesArray = Array.from(files);
        setUploadImages(filesArray);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === 'sign-up' && (
          <>
            <CustomInput
              control={control}
              name="name"
              label={l.common.name}
              placeholder={l.common.name}
              type="text"
              visuallyHiddenLabel
            />
            <CustomInput
              control={control}
              name="phoneNumber"
              label={l.common.phoneNumber}
              placeholder={l.common.phoneNumber}
              type="tel"
              visuallyHiddenLabel
            />
            <label htmlFor="images" className="sr-only">
              {l.cars.chooseFiles}
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleInputChange}
              accept="image/*"
              multiple
              className="w-full p-2 border rounded"
            />
          </>
        )}

        <CustomInput
          control={control}
          name="email"
          label={l.common.email}
          placeholder={l.common.email}
          type="email"
          visuallyHiddenLabel
        />

        <CustomInput
          control={control}
          name="password"
          label={l.common.password}
          placeholder={l.common.password}
          type={isPasswordVisible ? 'text' : 'password'}
          visuallyHiddenLabel
          endAdornment={
            <button
              type="button"
              onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isPasswordVisible}
              className="rounded-md p-1 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {isPasswordVisible ? (
                <Eye aria-hidden="true" className="h-5 w-5" />
              ) : (
                <EyeOff aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          }
        />

        {type === 'sign-up' && (
          <CustomInput
            control={control}
            name="confirmPassword"
            label={l.auth.confirmPassword}
            placeholder={l.auth.confirmPassword}
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            visuallyHiddenLabel
            endAdornment={
              <button
                type="button"
                onClick={() =>
                  setIsConfirmPasswordVisible((isVisible) => !isVisible)
                }
                aria-label={
                  isConfirmPasswordVisible
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                aria-pressed={isConfirmPasswordVisible}
                className="rounded-md p-1 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {isConfirmPasswordVisible ? (
                  <Eye aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <EyeOff aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            }
          />
        )}

        {error && <p className="text-red-500">{error}</p>}

        {type === 'sign-up' ? (
          <div className="flex-center flex-col">
            <button
              className="w-full p-4 bg-red-500 text-white rounded hover:bg-red-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? l.common.creating : l.auth.createAccount}
            </button>

            <button
              className="mt-4 w-full p-4 text-base font-normal border border-gray-300 rounded flex items-center justify-center"
              type="button"
            >
              <Image
                className="mr-2"
                src="/icons/icon-google.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              {l.common.signUpWithGoogle}
            </button>
          </div>
        ) : (
          <div className="flex-between">
            <button
              className="px-12 py-4 bg-[var(--secondary-2)] text-white rounded hover:bg-red-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? l.common.loggingIn : l.common.logIn}
            </button>

            <a
              className="text-[var(--secondary-2)] hover:underline hover:underline-offset-4"
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

export default ProfileForm;
