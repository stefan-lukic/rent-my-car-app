/**
 * MobileForgotPasswordForm.test.tsx
 *
 * MobileForgotPasswordForm komponenta omogućava korisnicima da zatraže
 * reset lozinke putem emaila na mobilnom uređaju. Koristi useForgotPassword
 * hook za upravljanje validacijom, submitom i prikazom poruka.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — testiraju se UI elementi i njihova interakcija
 *   sa hookom.
 * - useForgotPassword hook je mockovan — vraćamo kontrolisane vrednosti.
 * - Stvarni axios pozivi se testiraju u hook testovima.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Jasna separacija: komponenta testira render i UI state,
 *   hook testira API pozive.
 */

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
