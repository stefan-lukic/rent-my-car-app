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
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-tint file:px-3 file:py-2 file:font-semibold file:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
              className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
                className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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

        {error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {type === 'sign-up' ? (
          <div className="flex flex-col items-center">
            <button
              className="w-full rounded-xl bg-brand p-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? l.common.creating : l.auth.createAccount}
            </button>

            <button
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="rounded-xl bg-brand px-10 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? l.common.loggingIn : l.common.logIn}
            </button>

            <a
              className="text-sm font-medium text-brand underline-offset-4 hover:underline"
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
