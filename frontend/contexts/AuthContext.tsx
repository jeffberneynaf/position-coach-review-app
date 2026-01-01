'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterUserRequest, RegisterCoachRequest, User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (request: LoginRequest, userType: 'user' | 'coach') => Promise<void>;
  registerUser: (request: RegisterUserRequest) => Promise<void>;
  registerCoach: (request: RegisterCoachRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just set loading to false after initial render
    // This is a legitimate use of setState in an effect for initialization
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  const login = async (request: LoginRequest, userType: 'user' | 'coach') => {
    const response = await api.post<AuthResponse>(`/api/auth/login/${userType}`, request);
    const { token, ...userData } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const registerUser = async (request: RegisterUserRequest) => {
    await api.post('/api/auth/register/user', request);
    // Email verification required - user will need to verify email before logging in
  };

  const registerCoach = async (request: RegisterCoachRequest) => {
    await api.post('/api/auth/register/coach', request);
    // Email verification required - coach will need to verify email before logging in
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, registerCoach, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
