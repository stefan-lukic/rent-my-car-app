'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Form } from './UI/Form';
import CustomInput from './UI/CustomInput';
import { authFormSchema } from '@/lib/utils';

const ProfileForm = ({
  type,
  callbackUrl,
}: {
  type: string;
  callbackUrl: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        const response = await axios.post('/api/auth/signup', data);
        if (response.status === 201) {
          router.push(
            `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
          );
        }
      } else {
        const result = await signIn('credentials', {
          redirect: true,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {type === 'sign-up' && (
          <CustomInput
            control={control}
            name="name"
            label=""
            placeholder="Name"
            type="text"
          />
        )}

        <CustomInput
          control={control}
          name="email"
          label=""
          placeholder="Email or Phone Number"
          type="text"
        />

        <CustomInput
          control={control}
          name="password"
          label=""
          placeholder="Password"
          type="password"
        />

        {error && <p className="text-red-500">{error}</p>}

        {type === 'sign-up' ? (
          <div className="flex-center flex-col">
            <button
              type="submit"
              className="w-full p-4 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button className="mt-4 w-full p-4 text-base font-normal border border-gray-300 rounded flex items-center justify-center">
              <Image
                src="/icons/icon-google.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </button>
          </div>
        ) : (
          <div className="flex-between">
            <button
              type="submit"
              className="px-12 py-4 bg-[var(--secondary-2)] text-white rounded hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>

            <a
              href="#"
              className="text-[var(--secondary-2)] hover:underline hover:underline-offset-4"
            >
              Forget Password?
            </a>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ProfileForm;
