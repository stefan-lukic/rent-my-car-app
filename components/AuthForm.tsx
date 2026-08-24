'use client';

import l from '@/helper/en';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ProfileForm from './ProfileForm';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';
import MobileProfileForm from './mobile/MobileProfileForm';
import Link from 'next/link';
import { AuthFormSkeleton } from './UI/LoadingSkeletons';

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
    return <AuthFormSkeleton />;
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="flex items-center bg-blue-100 justify-center h-full overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 p-4 border border-blue-50 transition-all">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {isMobile
              ? type === 'sign-up'
                ? l.auth.joinUs
                : l.auth.welcomeBack
              : type === 'sign-in'
                ? l.auth.logInToRentMyCar
                : l.auth.createAnAccount}
          </h1>
          <p className="text-gray-500 font-medium">
            {type === 'sign-in' ? l.auth.enterDetails : l.auth.startJourney}
          </p>
        </header>

        <div className="mb-8">
          {isMobile ? (
            <MobileProfileForm type={type} callbackUrl={callbackUrl} />
          ) : (
            <ProfileForm type={type} callbackUrl={callbackUrl} />
          )}
        </div>

        <footer className="text-center pt-6 border-t border-gray-100">
          <p className="text-gray-500 font-medium text-sm">
            {type !== 'sign-up' ? (
              <>
                {l.auth.dontHaveAccount}
                <Link
                  href="/sign-up"
                  className="text-blue-600 font-bold ml-2 hover:underline decoration-2 underline-offset-4"
                >
                  {l.common.signUp}
                </Link>
              </>
            ) : (
              <>
                {l.auth.alreadyHaveAccount}
                <Link
                  href="/sign-in"
                  className="text-blue-600 font-bold ml-2 hover:underline decoration-2 underline-offset-4"
                >
                  {l.common.logIn}
                </Link>
              </>
            )}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthForm;
