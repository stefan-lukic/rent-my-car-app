/**
 * ForgotPasswordForm.test.tsx
 *
 * ForgotPasswordForm komponenta omogućava korisnicima da zatraže reset
 * lozinke putem emaila. Komponenta koristi useForgotPassword hook koji
 * upravlja validacijom, submitom i prikazom poruka.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test (pored komponente) — testiraju se samo UI elementi
 *   i njihova interakcija, ne stvarni API pozivi.
 * - Hook useForgotPassword je mockovan — vraćamo fiksni set vrednosti
 *   (register, handleSubmit, errors, isSubmitting, successMessage).
 * - Stvarni axios.post, uspešan reset i server greške se testiraju
 *   zasebno u hooks/useForgotPassword.test.tsx gde im je pravo mesto.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Jasna separacija briga: komponenta testira da li se elementi renderuju
 *   i reaguju na hook state, hook testira stvarnu biznis logiku.
 * - Lakše održavanje: ako promeniš UI, ne moraš da menjam hook testove,
 *   i obrnuto.
 */

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
