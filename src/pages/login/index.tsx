"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Quicksand } from "next/font/google";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/router";

const quickSand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard/roles");
    }
  }, [isAuthenticated, isLoading, router]);
  return (
    <div
      className={`${quickSand.className} min-h-screen flex items-center justify-center bg-gray-300 p-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-md shadow-md flex flex-col md:flex-row overflow-hidden min-h-[300px] md:min-h-[500px]"
      >
        {/* Kiri */}
        <div className="bg-sky-600 rounded-b-[36px] md:rounded-none w-full md:w-1/2 p-6 flex flex-col justify-center items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white "
          >
            SMPN 2 Katapang
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white text-sm font-semibold sm:text-base mb-4 max-w-xs"
          >
            Sistem manajemen konten untuk website SMPN 2 Katapang
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Image
              src="/smpn2katapang_logo.png"
              alt="Logo SMPN 2 Katapang"
              width={500}
              height={500}
              priority
              className="w-[130px] h-[130px] sm:w-[180px] sm:h-[180px]"
            />
          </motion.div>
        </div>

        {/* Kanan */}
        <LoginForm />
      </motion.div>
    </div>
  );
}
