export interface User {
  id: number;
  username: string;
  image_url: string;
  role: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setIsLoading: (isLoading: (prev: boolean) => boolean) => void;
  logout: () => void;
}
