'use client';

import { useForgotPassword } from '@/hooks/useForgotPassword';
import l from '@/helper/en';

const ForgotPasswordForm = () => {
  const { register, handleSubmit, errors, isSubmitting, successMessage } =
    useForgotPassword();

  return (
    <div className="h-[calc(100%-80px)] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 bg-white">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal text-center">
            {l.auth.forgotPasswordHeading}
          </h1>
          <p className="text-gray-600 text-center">
            {l.auth.forgotPasswordDesc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              type="email"
              placeholder={l.auth.enterEmail}
              {...register('email', { required: l.auth.emailRequired })}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          {errors.root && (
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 bg-[var(--secondary-2)] text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isSubmitting ? l.common.sending : l.auth.sendResetLink}
          </button>
        </form>

        <div className="text-center">
          <p className="text-black/[0.6] text-xs">
            {l.common.rememberedIt}
            <a
              href="/sign-in"
              className="underline underline-offset-[6px] ml-2"
            >
              {l.common.backToLogin}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
