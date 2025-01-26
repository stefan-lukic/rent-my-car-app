'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from '../LogoutButton';
import { useState } from 'react';

const MobileFooter = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleClick = (action: string) => {
    setActiveButton(action);
  };

  return (
    <>
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-700 text-white p-2 md:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center gap-1 cursor-pointer transition duration-300 ${activeButton === 'Home' ? 'bg-blue-500 rounded' : 'hover:bg-blue-600'} p-1 text-xs`}
              onClick={() => handleClick('Home')}
            >
              Home
              <HomeIcon />
            </Link>
            <div className="flex space-x-2">
              {!loading && (
                <>
                  {!isAuthenticated ? (
                    <>
                      <Link
                        href="/sign-in"
                        className={`flex align-items justify-center items-center  gap-1 cursor-pointer transition duration-300 ${activeButton === 'Sign-in' ? 'bg-blue-500 rounded' : 'hover:bg-blue-600'} p-1 text-xs`}
                        onClick={() => handleClick('Sign-in')}
                      >
                        Sign-in
                        <LoginIcon />
                      </Link>
                      <Link
                        href="/sign-up"
                        className={`flex align-items justify-center items-center gap-1 cursor-pointer transition duration-300 ${activeButton === 'Sign-up' ? 'bg-blue-500 rounded' : 'hover:bg-blue-600'} p-1 text-xs`}
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
                        className={`flex align-items justify-center items-center gap-1 cursor-pointer transition duration-300 ${activeButton === 'Profile' ? 'bg-blue-500 rounded' : 'hover:bg-blue-600'} p-1 text-xs`}
                        onClick={() => handleClick('Profile')}
                      >
                        Profile
                        <AccountBoxIcon />
                      </Link>
                      <div className="flex align-items justify-center items-center text-xs">
                        <LogoutButton />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFooter;
