import { useState } from 'react';
import { register as registerService, login as loginService, logout as logoutService } from '@/services/auth';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerService(username, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginService(username, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutService();
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, handleLogin, handleLogout, isLoading, error };
};


