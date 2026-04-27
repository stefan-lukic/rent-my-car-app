'use client';

import { useState, useEffect } from 'react';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import MobileForgotPasswordForm from '@/components/mobile/MobileForgotPasswordForm';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';

const ForgotPasswordPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isMobile = isMobileCSR();

  return isMobile ? <MobileForgotPasswordForm /> : <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
