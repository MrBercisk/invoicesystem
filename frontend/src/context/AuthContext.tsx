import { createContext, useContext, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { authApi } from '../lib/api';
import type { AuthUser, AuthContextValue } from '../types'


const AuthContext = createContext<AuthContextValue | null>(null);

const ME_QUERY_KEY = ['auth', 'me'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !isLoginPage, // tidak perlu cek session di halaman login itu sendiri
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(ME_QUERY_KEY, null);
      queryClient.clear();
    },
  });

  async function login(email: string, password: string) {
    const data = await loginMutation.mutateAsync({ email, password });
    return data as AuthUser;
  }

  async function logout() {
    await logoutMutation.mutateAsync();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}