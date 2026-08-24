import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileForgotPasswordForm from './MobileForgotPasswordForm';
import { runForgotPasswordFormSharedTests } from '@/test-utils/shared-tests/forgot-password-form';

const handleSubmit = vi.fn((event) => event.preventDefault());

const useForgotPasswordMock = vi.fn();

vi.mock('@/hooks/useForgotPassword', () => ({
  useForgotPassword: () => useForgotPasswordMock(),
}));

describe('MobileForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  runForgotPasswordFormSharedTests({
    Component: MobileForgotPasswordForm,
    handleSubmit,
    useForgotPasswordMock,
  });
});
