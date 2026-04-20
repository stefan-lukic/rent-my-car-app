'use client';

import { useForgotPassword } from '@/hooks/useForgotPassword';

const MobileForgotPasswordForm = () => {
  const { register, handleSubmit, errors, isSubmitting, successMessage } =
    useForgotPassword();

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-sm">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal text-center text-black">
            Forgot your password?
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {successMessage && (
            <p className="text-green-600 text-sm text-center">
              {successMessage}
            </p>
          )}
          {errors.root && (
            <p className="text-red-500 text-sm text-center">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 bg-[var(--secondary-2)] text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-black/[0.6] text-xs">
            Remembered it?
            <a
              href="/sign-in"
              className="underline underline-offset-[6px] ml-2 text-black hover:text-gray-700"
            >
              Back to Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileForgotPasswordForm;
