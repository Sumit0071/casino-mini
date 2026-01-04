// src/types/index.ts
// ⚠️ COPY THIS EXACTLY - This matches your backend structure

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Game {
  id: number;
  name: string;
  provider?: string;
  category?: string;
  isFavorite?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

