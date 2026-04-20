'use client';

import { useForgotPassword } from '@/hooks/useForgotPassword';

const ForgotPasswordForm = () => {
  const { register, handleSubmit, errors, isSubmitting, successMessage } =
    useForgotPassword();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          {...register('email', { required: 'Email is required' })}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
