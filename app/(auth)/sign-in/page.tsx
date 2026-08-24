import React, { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
import { InstallPrompt } from '@/components/PushNotificationManager';
import { AuthFormSkeleton } from '@/components/UI/LoadingSkeletons';

const SignInPage = () => {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm type="sign-in" />
      <InstallPrompt />
    </Suspense>
  );
};

export default SignInPage;
