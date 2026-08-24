'use client';

import Link from 'next/link';
import l from '@/helper/en';
import { useResetPassword } from '@/hooks/useResetPassword';

type ResetPasswordFormProps = {
  token: string;
};

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { register, handleSubmit, errors, isSubmitting, isSuccess } =
    useResetPassword(token);

  return (
    <main className="flex h-[calc(100vh-80px)] items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 bg-white p-10">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-normal">
            {l.auth.resetPasswordHeading}
          </h1>
          <p className="text-gray-600">{l.auth.resetPasswordDesc}</p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center" role="status">
            <p className="text-sm text-green-600">
              {l.auth.passwordResetComplete}
            </p>
            <Link
              href="/sign-in"
              className="inline-block w-full rounded bg-[var(--secondary-2)] p-4 text-white hover:bg-red-600"
            >
              {l.common.backToLogin}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                {l.auth.newPassword}
              </span>
              <input
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: l.auth.passwordRequired,
                  minLength: { value: 8, message: l.auth.passwordMinLength },
                  maxLength: { value: 128, message: l.auth.passwordMaxLength },
                })}
                className="w-full rounded border border-gray-300 p-4 focus:border-gray-500 focus:outline-none"
              />
              {errors.password && (
                <span className="mt-1 block text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                {l.auth.confirmPassword}
              </span>
              <input
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: l.auth.confirmPasswordRequired,
                  validate: (value, formValues) =>
                    value === formValues.password || l.auth.passwordsDoNotMatch,
                })}
                className="w-full rounded border border-gray-300 p-4 focus:border-gray-500 focus:outline-none"
              />
              {errors.confirmPassword && (
                <span className="mt-1 block text-sm text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>

            {!token && (
              <p className="text-sm text-red-500">{l.auth.invalidResetLink}</p>
            )}
            {errors.root && (
              <p className="text-sm text-red-500" role="alert">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full rounded bg-[var(--secondary-2)] p-4 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? l.auth.resettingPassword : l.auth.resetPassword}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPasswordForm;
