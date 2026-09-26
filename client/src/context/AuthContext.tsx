import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types/index.js';
import { authApi } from '../services/api.js';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ares_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ares_token');
      if (savedToken) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          setToken(savedToken);
        } catch (err) {
          console.warn('[Auth] Token invalid or expired, clearing session.');
          localStorage.removeItem('ares_token');
          localStorage.removeItem('ares_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('ares_token', data.token);
    localStorage.setItem('ares_user', JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    localStorage.setItem('ares_token', data.token);
    localStorage.setItem('ares_user', JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('ares_token');
    localStorage.removeItem('ares_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
