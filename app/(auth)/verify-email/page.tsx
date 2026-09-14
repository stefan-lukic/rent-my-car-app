'use client';

import l from '@/helper/en';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { AuthActionSkeleton } from '@/components/UI/LoadingSkeletons';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/verify-email', { token });
      setIsSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || l.auth.verificationFailed);
      } else {
        setError(l.auth.verificationFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-surface px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <header className="mb-8 text-center">
          <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-ink">
            {l.auth.verifyEmailHeading}
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            {token ? l.auth.verificationSent : l.auth.checkYourInbox}
          </p>
        </header>

        {token && !isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full rounded-xl bg-brand py-4 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {isLoading ? l.auth.verifying : l.auth.verifyButton}
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
              {l.auth.verificationSuccess}
            </p>
            <Link
              href="/sign-in"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              {l.auth.backToLogin}
            </Link>
          </div>
        )}

        {error && !isSuccess && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {!token && !isSuccess && (
          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              {l.auth.backToLogin}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<AuthActionSkeleton />}>
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
