'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ProfileForm from './ProfileForm';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';
import MobileProfileForm from './mobile/MobileProfileForm';

const AuthForm = ({ type }: { type: string }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const isMobile = isMobileCSR();

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
    <div className="h-[calc(100%-80px)] flex items-center justify-center align-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 bg-white">
        {isMobile ? (
          type === 'sign-up' ? (
            <h1>Sign up</h1>
          ) : (
            <h1>Sign in</h1>
          )
        ) : (
          <div className="space-y-3">
            <h1 className="text-3xl font-normal text-center">
              {type === 'sign-in' ? 'Log in to RentMyCar' : 'Create an account'}
            </h1>
            <p className="text-gray-600 text-center">
              Enter your details below
            </p>
          </div>
        )}

        {isMobile ? (
          <MobileProfileForm type={type} callbackUrl={callbackUrl} />
        ) : (
          <ProfileForm type={type} callbackUrl={callbackUrl} />
        )}

        <div className="text-center">
          {type !== 'sign-up' ? (
            <p className="text-black/[0.6] text-xs">
              Don&apos;t have an account yet?
              <a
                href="/sign-up"
                className="underline underline-offset-[6px] ml-2"
              >
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-black/[0.6] text-xs">
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
