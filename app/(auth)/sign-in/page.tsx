import React, { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
import { InstallPrompt } from '@/components/PushNotificationManager';

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm type="sign-in" />
      <InstallPrompt />
    </Suspense>
  );
};

export default SignInPage;
