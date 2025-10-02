import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black/50 z-50 fixed top-0 left-0">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
        <span>Memuat...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
