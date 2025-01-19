import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

export interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void
}

export const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token: string, user: User) => set((state) => ({ ...state, token, user })),
      logout: () => set((state) => ({ ...state, token: null, user: null }))
    }),
    {
      name: 'auth-storage'
    }
  )
)