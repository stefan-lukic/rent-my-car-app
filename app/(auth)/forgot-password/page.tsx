'use client';

import l from '@/helper/en';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import MobileForgotPasswordForm from '@/components/mobile/MobileForgotPasswordForm';
import { isMobileCSR } from '@/utils/deviceDetectionCSR';

const ForgotPasswordPage = () => {
  const isMobile = isMobileCSR();

  return isMobile ? <MobileForgotPasswordForm /> : <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
