export interface User {
  id: number;
  username: string;
  role: string[];
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    logout: () => void;
}
