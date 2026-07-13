import l from '@/helper/en';
import React, { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
import { InstallPrompt } from '@/components/PushNotificationManager';

const SignInPage = () => {
  return (
    <Suspense fallback={<div>{l.common.loading}</div>}>
      <AuthForm type="sign-in" />
      <InstallPrompt />
    </Suspense>
  );
};

export default SignInPage;
