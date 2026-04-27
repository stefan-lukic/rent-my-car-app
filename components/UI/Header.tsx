'use client';

import Link from 'next/link';
import LogoutButton from '../LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full h-20 bg-blue-100 backdrop-blur-md border-b border-blue-100/50 z-50 transition-all ${className}`}
    >
      <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-600 tracking-tight hover:text-blue-800 transition-colors duration-300"
          >
            RentMyCar
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {!loading && (
            <>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/sign-in"
                    className="text-gray-600 font-medium hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile/my-profile"
                    className="flex items-center gap-1.5 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                  >
                    <AccountBoxIcon fontSize="small" />
                    Profile
                  </Link>
                  <LogoutButton />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
