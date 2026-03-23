import ForgotPasswordForm from '@/components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="h-[calc(100%-80px)] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 bg-white">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal text-center">
            Forgot your password?
          </h1>
          <p className="text-gray-600 text-center">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center">
          <p className="text-black/[0.6] text-xs">
            Remembered it?
            <a
              href="/sign-in"
              className="underline underline-offset-[6px] ml-2"
            >
              Back to Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
