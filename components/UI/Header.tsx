'use client';

import Link from 'next/link';
import LogoutButton from '../LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header
      className={`sticky top-0 h-12 w-full flex justify-between bg-black text-white text-sm font-extralight z-50 ${className}`}
    >
      <div className="flex items-center pl-8">
        <Link href="/" className="flex items-center gap-1 cursor-pointer">
          Home
          <HomeIcon />
        </Link>
      </div>
      <div className="flex justify-end gap-2 pr-8">
        {!loading && (
          <>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Sign-in
                  <LoginIcon />
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Sign-up
                  <LoginIcon />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile/my-profile"
                  className="flex items-center gap-1 cursor-pointer"
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
    </header>
  );
};

export default Header;
