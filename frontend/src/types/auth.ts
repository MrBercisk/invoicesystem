export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  department?: string;
  [key: string]: unknown;
}

export interface AuthContextValue {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}