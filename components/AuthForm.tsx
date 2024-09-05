'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ProfileForm from './ProfileForm';

const AuthForm = ({ type }: { type: string }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return null; // This will prevent the form from rendering while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal text-center">
            {type === 'sign-in' ? 'Log in to RentMyCar' : 'Create an account'}
          </h1>
          <p className="text-gray-600 text-center">Enter your details below</p>
        </div>

        <ProfileForm type={type} callbackUrl={callbackUrl} />

        <div className="text-center">
          {type !== 'sign-up' ? (
            <p className="text-black/[0.6]">
              Don&apos;t have an account yet?
              <a
                href="/sign-up"
                className="underline underline-offset-[6px] ml-2"
              >
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-black/[0.6]">
              Already have an account?
              <a
                href="/sign-in"
                className="underline underline-offset-[6px] ml-2"
              >
                Log in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
