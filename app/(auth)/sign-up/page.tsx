import l from '@/helper/en';
import React, { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

const SignUpPage = () => {
  return (
    <Suspense fallback={<div>{l.common.loading}</div>}>
      <AuthForm type="sign-up" />
    </Suspense>
  );
};

export default SignUpPage;
