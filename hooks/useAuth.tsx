import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthHook {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  user?: {
    name?: string | null;
  };
}

export const useAuth = (): AuthHook => {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'authenticated') {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [status]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = (): void => {
    signOut({ redirect: false });
  };

  return {
    isAuthenticated,
    login,
    logout,
    loading,
    user: session?.user,
  };
};
