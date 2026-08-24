import axios from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import l from '@/helper/en';

type ResetPasswordData = {
  password: string;
  confirmPassword: string;
};

export const useResetPassword = (token: string) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>();

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    setIsSuccess(false);

    if (!token) {
      setError('root', {
        type: 'server',
        message: l.auth.invalidResetLink,
      });
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setError('root', {
        type: 'server',
        message: message || l.auth.somethingWrong,
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isSuccess,
  };
};
