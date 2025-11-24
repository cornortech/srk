import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthState['user']) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Implement login logic
    const mockUser = { id: '1', name: 'John Doe', email };
    const mockToken = 'mock-jwt-token';
    
    set({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });
  },
  
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
  
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
