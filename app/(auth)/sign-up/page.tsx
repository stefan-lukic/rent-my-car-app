import React, { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
import { AuthFormSkeleton } from '@/components/UI/LoadingSkeletons';

const SignUpPage = () => {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm type="sign-up" />
    </Suspense>
  );
};

export default SignUpPage;
