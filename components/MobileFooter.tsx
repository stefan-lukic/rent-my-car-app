'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';
import { useState } from 'react';

const MobileFooter = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleClick = (action: string) => {
    setActiveButton(action);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 md:hidden">
      <div className="flex items-start">
        <Link
          href="/"
          className={`flex items-center gap-2 cursor-pointer transition duration-300 ${activeButton === 'Home' ? 'bg-gray-700' : 'hover:bg-gray-600'} p-4`}
          onClick={() => handleClick('Home')}
        >
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
                  className={`flex items-center gap-2 cursor-pointer transition duration-300 ${activeButton === 'Sign-in' ? 'bg-gray-700' : 'hover:bg-gray-600'} p-4`}
                  onClick={() => handleClick('Sign-in')}
                >
                  Sign-in
                  <LoginIcon />
                </Link>
                <Link
                  href="/sign-up"
                  className={`flex items-center gap-2 cursor-pointer transition duration-300 ${activeButton === 'Sign-up' ? 'bg-gray-700' : 'hover:bg-gray-600'} p-4`}
                  onClick={() => handleClick('Sign-up')}
                >
                  Sign-up
                  <LoginIcon />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile/my-profile"
                  className={`flex items-start gap-2 cursor-pointer transition duration-300 ${activeButton === 'Profile' ? 'bg-gray-700' : 'hover:bg-gray-600'} p-4`}
                  onClick={() => handleClick('Profile')}
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
