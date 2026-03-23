'use client';

import { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });

      if (response.status === 200) {
        setSuccessMessage(
          'If this email exists, you will receive a reset link shortly.'
        );
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
      />

      {successMessage && (
        <p className="text-green-600 text-sm">{successMessage}</p>
      )}

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-4 bg-[var(--secondary-2)] text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
