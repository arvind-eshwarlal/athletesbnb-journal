import { create } from 'zustand';

interface User {
  id: string;
  athletesbnb_user_id: string;
  sport: string;
  level: string;
  goals: string[];
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  logout: () => set({ user: null })
}));
