'use client';

import l from '@/helper/en';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

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
        setError(
          err.response?.data?.message || l.auth.verificationFailed
        );
      } else {
        setError(l.auth.verificationFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center bg-blue-100 justify-center min-h-[400px]">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 p-8 border border-blue-50 transition-all">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {l.auth.verifyEmailHeading}
          </h1>
          <p className="text-gray-500 font-medium">
            {token ? l.auth.verificationSent : l.auth.checkYourInbox}
          </p>
        </header>

        {token && !isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? l.auth.verifying : l.auth.verifyButton}
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-green-600 font-medium text-center">
              {l.auth.verificationSuccess}
            </p>
            <Link
              href="/sign-in"
              className="text-blue-600 font-bold hover:underline"
            >
              {l.auth.backToLogin}
            </Link>
          </div>
        )}

        {error && !isSuccess && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        {!token && !isSuccess && (
          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="text-blue-600 font-bold hover:underline"
            >
              {l.auth.backToLogin}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">{l.common.loading}</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
