import ResetPasswordForm from '@/components/ResetPasswordForm';
import MobileResetPasswordForm from '@/components/mobile/MobileResetPasswordForm';

type ResetPasswordPageProps = {
  searchParams: { token?: string | string[] };
};

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
  const token =
    typeof searchParams.token === 'string' ? searchParams.token : '';

  return (
    <>
      <div className="hidden min-[681px]:block">
        <ResetPasswordForm token={token} />
      </div>
      <div className="min-[681px]:hidden">
        <MobileResetPasswordForm token={token} />
      </div>
    </>
  );
};

export default ResetPasswordPage;
