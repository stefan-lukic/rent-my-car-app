import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import l from '@/helper/en';

type ForgotPasswordData = {
  email: string;
};

export const useForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>();

  const onSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    setSuccessMessage('');
    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: data.email,
      });
      if (response.status === 200) {
        setSuccessMessage(
          l.auth.passwordResetSuccess
        );
      }
    } catch (error: any) {
      setError('root', {
        type: 'server',
        message:
          error.response?.data?.message ||
          l.auth.somethingWrong,
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    successMessage,
  };
};
