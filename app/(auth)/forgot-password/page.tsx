'use client';

import { useState, useEffect } from 'react';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';
import MobileForgotPasswordForm from '@/components/mobile/MobileForgotPasswordForm';

const ForgotPasswordPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setIsMobile(isMobileCSR());
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) return null;

  if (isMobile) {
    return <MobileForgotPasswordForm />;
  }

  return (
    <div className="h-[calc(100%-80px)] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 bg-white">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal text-center">
            Forgot your password?
          </h1>
          <p className="text-gray-600 text-center">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center">
          <p className="text-black/[0.6] text-xs">
            Remembered it?
            <a
              href="/sign-in"
              className="underline underline-offset-[6px] ml-2"
            >
              Back to Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
