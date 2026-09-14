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

// Keep redirects inside the app, including legacy absolute callback URLs.
const getInternalCallbackUrl = (callbackUrl: string | null) => {
  if (!callbackUrl) return '/';

  try {
    const parsedUrl = new URL(callbackUrl, 'https://rent-my-car.local');

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return '/';
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return '/';
  }
};

const AuthForm = ({ type }: { type: string }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getInternalCallbackUrl(searchParams.get('callbackUrl'));
  const isMobile = isMobileCSR();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // Keep feedback visible while the authenticated redirect completes.
  if (status === 'loading' || status === 'authenticated') {
    return <AuthFormSkeleton />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-surface-0 p-5 shadow-lg sm:p-8">
        <header className="mb-8 text-center">
          <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-ink">
            {isMobile
              ? type === 'sign-up'
                ? l.auth.joinUs
                : l.auth.welcomeBack
              : type === 'sign-in'
                ? l.auth.logInToRentMyCar
                : l.auth.createAnAccount}
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            {type === 'sign-in' ? l.auth.enterDetails : l.auth.startJourney}
          </p>
        </header>

        <div className="mb-7">
          {isMobile ? (
            <MobileProfileForm type={type} callbackUrl={callbackUrl} />
          ) : (
            <ProfileForm type={type} callbackUrl={callbackUrl} />
          )}
        </div>

        <footer className="border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            {type !== 'sign-up' ? (
              <>
                {l.auth.dontHaveAccount}
                <Link
                  href="/sign-up"
                  className="ml-2 font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {l.common.signUp}
                </Link>
              </>
            ) : (
              <>
                {l.auth.alreadyHaveAccount}
                <Link
                  href="/sign-in"
                  className="ml-2 font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {l.common.logIn}
                </Link>
              </>
            )}
          </p>
        </footer>
      </section>
    </main>
  );
};

export default AuthForm;
