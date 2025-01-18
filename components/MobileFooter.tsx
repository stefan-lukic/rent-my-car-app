'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';

const MobileFooter = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 md:hidden">
      <div className="flex items-start">
        <Link href="/" className="flex items-start gap-2 cursor-pointer">
          Home
          <HomeIcon />
        </Link>
      </div>
      <div className="flex justify-between">
        {!loading && (
          <>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  Sign-in
                  <LoginIcon />
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  Sign-up
                  <LoginIcon />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile/my-profile"
                  className="flex items-start gap-2 cursor-pointer"
                >
                  Profile
                  <AccountBoxIcon />
                </Link>
                <LogoutButton />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileFooter;
