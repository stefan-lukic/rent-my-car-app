import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ForgotPasswordForm from './ForgotPasswordForm';
import { runForgotPasswordFormSharedTests } from '@/test-utils/shared-tests/forgot-password-form';

const handleSubmit = vi.fn((event) => event.preventDefault());

const useForgotPasswordMock = vi.fn();

vi.mock('@/hooks/useForgotPassword', () => ({
  useForgotPassword: () => useForgotPasswordMock(),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  runForgotPasswordFormSharedTests({
    Component: ForgotPasswordForm,
    handleSubmit,
    useForgotPasswordMock,
  });
});
