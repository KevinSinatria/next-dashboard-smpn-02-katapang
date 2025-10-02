import { AuthProvider } from "@/features/auth/context/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}
