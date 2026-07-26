/**
 * useForgotPassword.test.tsx
 *
 * useForgotPassword hook upravlja kompletnom logikom za "Forgot Password" formu:
 *   - Registracija email inputa sa validacijom (required)
 *   - Submit forme slanjem axios.post('/api/auth/forgot-password')
 *   - Prikaz success poruke ako status bude 200
 *   - Prikaz error poruke ako request fail-uje (server greška ili network error)
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i grane hook-a.
 * - Koristimo "Harness komponentu" (ForgotPasswordHarness) koja omotava
 *   hook i renderuje jednostavnu HTML formu sa njegovim povratnim vrednostima.
 * - Ovo je bolje nego renderHook samostalno jer možemo da interagujemo
 *   sa formom preko fireEvent (popravicemo korisnicku interakciju).
 * - axios je mockovan (vi.hoisted) da ne bismo pozivali stvarni API.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Hook test: "Da li hook ispravno menja state i poziva axios?"
 * - Component test (ForgotPasswordForm.test.tsx): "Da li se elementi
 *   renderuju i reaguju na hook state?"
 * - Jasna separacija = lakše debugovanje i održavanje.
 */

import React from 'react';
import {  render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { useForgotPassword } from './useForgotPassword';
import l from '@/helper/en';

/**
 * mocks.axiosPost: cross-module mock za axios.post funkciju.
 * Znacaj: useForgotPassword hook poziva axios.post('/api/auth/forgot-password')
 * kada korisnik submit-uje formu. Mockujemo da ne bismo pozivali
 * stvarni API.
 *
 * Koristimo vi.hoisted() jer useForgotPassword.tsx importuje axios
 * na top nivou, a mock factory takode treba pristup istom mocku.
 */
const mocks = vi.hoisted(() => ({
  axiosPost: vi.fn(),
}));

/**
 * Mockujemo axios biblioteku.
 * Znacaj: useForgotPassword koristi axios.post za slanje emaila.
 * Vracamo kontrolisanu implementaciju gde default.post referira
 * na naš mocks.axiosPost.
 */
vi.mock('axios', () => ({
  default: {
    post: mocks.axiosPost,
  },
}));

/**
 * ForgotPasswordHarness: Komponenta koja omotava useForgotPassword hook.
 * Znacaj: Ovo je "test harness" — jednostavna HTML forma koja koristi
 * sve povratne vrednosti hooka i omogucava nam da interagujemo sa njima
 * preko Testing Library-jeve fireEvent API-ja.
 *
 * ŠTA RENDERUJE:
 * - Email input sa react-hook-form register()
 * - Error poruke za email i root
 * - Success poruka
 * - Submit button sa disabled state
 */
const ForgotPasswordHarness = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    successMessage,
  } = useForgotPassword();

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        aria-label="Email"
        {...register('email', {
          required: l.auth.emailRequired,
        })}
      />

      {errors.email && <p>{errors.email.message}</p>}
      {errors.root && <p>{errors.root.message}</p>}
      {successMessage && <p>{successMessage}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending' : 'Send'}
      </button>
    </form>
  );
};

describe('useForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Prikaz validacione greške za email (required)
   * ZAŠTO: Kada korisnik klikne "Send" bez unosa emaila, react-hook-form
   * treba da prikaže grešku "Email is required" i da NE pozove axios.post.
   * KAKO:
   * 1. Renderujemo ForgotPasswordHarness
   * 2. Kliknemo na "Send" button bez unosa emaila
   * 3. Cekamo da se pojavi error tekst (findByText - async)
   * 4. Proveravamo da axiosPost NIJE pozvan
   */
  it('shows required email error when form is submitted empty', async () => {
        const user = userEvent.setup();
render(<ForgotPasswordHarness />);

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(
      await screen.findByText(l.auth.emailRequired)
    ).toBeInTheDocument();

    expect(mocks.axiosPost).not.toHaveBeenCalled();
  });

  /**
   * TEST 2: Uspešan request — prikaz success poruke
   * ZAŠTO: Kada korisnik unese validan email i axios.post uspe (status 200),
   * hook treba da postavi successMessage i prikaže "Password reset link has
   * been successfully sent to your email."
   * KAKO:
   * 1. Mockujemo axiosPost da vrati { status: 200 }
   * 2. Unesemo email 'marko@example.com'
   * 3. Kliknemo "Send"
   * 4. Cekamo da axiosPost bude pozvan sa tacnim argumentima
   * 5. Proveravamo da je successMessage postavljen
   */
  it('sends email and exposes success message after successful request', async () => {
        const user = userEvent.setup();
mocks.axiosPost.mockResolvedValue({
      status: 200,
    });

    render(<ForgotPasswordHarness />);

    await user.type(screen.getByLabelText('Email'), 'marko@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(mocks.axiosPost).toHaveBeenCalledWith(
        '/api/auth/forgot-password',
        { email: 'marko@example.com' }
      );
    });

    expect(
      screen.getByText(l.auth.passwordResetSuccess)
    ).toBeInTheDocument();
  });

  /**
   * TEST 3: Server greška sa custom porukom
   * ZAŠTO: Kada API vrati error sa custom message (npr. "No account exists
   * with this email."), hook treba da prikaže tu poruku kao root error.
   * KAKO:
   * 1. Mockujemo axiosPost da odbije (rejected) sa response.data.message
   * 2. Unesemo email
   * 3. Kliknemo "Send"
   * 4. Cekamo da se pojavi custom error tekst
   */
  it('shows server message when request fails with server response', async () => {
        const user = userEvent.setup();
mocks.axiosPost.mockRejectedValue({
      response: {
        data: {
          message: 'No account exists with this email.',
        },
      },
    });

    render(<ForgotPasswordHarness />);

    await user.type(screen.getByLabelText('Email'), 'missing@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(
      await screen.findByText('No account exists with this email.')
    ).toBeInTheDocument();
  });

  /**
   * TEST 4: Network error — prikaz fallback greške
   * ZAŠTO: Kada axios odbije bez response (npr. network failure, timeout,
   * CORS error), hook treba da prikaže genericku grešku "Something went
   * wrong. Please try again."
   * KAKO:
   * 1. Mockujemo axiosPost da odbije sa Error('Network failure')
   *    — ovo simulira network error bez response objekta
   * 2. Unesemo email
   * 3. Kliknemo "Send"
   * 4. Cekamo da se pojavi fallback error tekst
   */
  it('shows fallback error when request fails without server message', async () => {
        const user = userEvent.setup();
mocks.axiosPost.mockRejectedValue(new Error('Network failure'));

    render(<ForgotPasswordHarness />);

    await user.type(screen.getByLabelText('Email'), 'marko@example.com')

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(
      await screen.findByText(l.auth.somethingWrong)
    ).toBeInTheDocument();
  });
});

