'use client';

import Link from 'next/link';
import l from '@/helper/en';
import { useResetPassword } from '@/hooks/useResetPassword';

type MobileResetPasswordFormProps = {
  token: string;
};

const MobileResetPasswordForm = ({ token }: MobileResetPasswordFormProps) => {
  const { register, handleSubmit, errors, isSubmitting, isSuccess } =
    useResetPassword(token);

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-surface px-4 py-8">
      <section className="w-full max-w-md space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="space-y-3 text-center">
          <h1 className="font-heading text-3xl font-bold text-ink">
            {l.auth.resetPasswordHeading}
          </h1>
          <p className="text-sm leading-6 text-slate-500">
            {l.auth.resetPasswordDesc}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center" role="status">
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {l.auth.passwordResetComplete}
            </p>
            <Link
              href="/sign-in"
              className="inline-block w-full rounded-xl bg-brand p-4 font-semibold text-white transition-colors hover:bg-brand/90"
            >
              {l.common.backToLogin}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
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
                className="w-full rounded-xl border border-slate-200 p-4 text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
              />
              {errors.password && (
                <span className="mt-1 block text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
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
                className="w-full rounded-xl border border-slate-200 p-4 text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
              />
              {errors.confirmPassword && (
                <span className="mt-1 block text-sm text-red-600">
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>

            {!token && (
              <p className="text-center text-sm text-red-600">
                {l.auth.invalidResetLink}
              </p>
            )}
            {errors.root && (
              <p className="text-center text-sm text-red-600" role="alert">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full rounded-xl bg-brand p-4 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {isSubmitting ? l.auth.resettingPassword : l.auth.resetPassword}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default MobileResetPasswordForm;
