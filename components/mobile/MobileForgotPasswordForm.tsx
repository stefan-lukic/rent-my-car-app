'use client';

import { useForgotPassword } from '@/hooks/useForgotPassword';
import l from '@/helper/en';

const MobileForgotPasswordForm = () => {
  const { register, handleSubmit, errors, isSubmitting, successMessage } =
    useForgotPassword();

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-surface px-4 py-8">
      <section className="w-full max-w-md space-y-7 rounded-2xl border border-border bg-white p-6 shadow-lg">
        <div className="space-y-3">
          <h1 className="text-center font-heading text-3xl font-bold text-ink">
            {l.auth.forgotPasswordHeading}
          </h1>
          <p className="text-center text-sm leading-6 text-body-subtle">
            {l.auth.forgotPasswordDesc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              {...register('email', { required: l.auth.emailRequired })}
              type="email"
              placeholder={l.auth.enterEmail}
              className="w-full rounded-xl border border-border bg-white p-4 text-ink shadow-sm placeholder:text-body-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {successMessage && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
              {successMessage}
            </p>
          )}
          {errors.root && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand p-4 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            {isSubmitting ? l.common.sending : l.auth.sendResetLink}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-body-subtle">
            {l.common.rememberedIt}
            <a
              href="/sign-in"
              className="ml-2 font-semibold text-brand underline-offset-4 hover:underline"
            >
              {l.common.backToLogin}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default MobileForgotPasswordForm;
