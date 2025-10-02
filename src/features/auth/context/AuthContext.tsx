import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from "../types/authTypes";
import { useRouter } from "next/router";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const logout = async () => {
    toast.loading("Logging out...", { id: "logout" });
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setUser(null);
      toast.dismiss("logout");
      toast.success("Berhasil keluar!");
      router.push("/login");
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
