"use client";

import React, { useEffect, useState } from "react";
import {
  ChartColumn,
  GraduationCap,
  Images,
  LogOut,
  School,
  Tag,
  UserLock,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/AuthContext";

interface NavItem {
  name: keyof typeof iconMap;
  path?: string;
  role?: string[];
}

const iconMap = {
  Roles: <UserLock size={18} />,
  Personil: <Users size={18} />,
  "Kepala Sekolah": <GraduationCap size={18} />,
  "Album Galeri": <Images size={18} />,
  "Kategori Artikel": <Tag size={18} />,
  "Informasi Sekolah": <School size={18} />,
  "Statistik Sekolah": <ChartColumn size={18} />,
};

const navItems: NavItem[] = [
  // { name: "Beranda", path: "/dashboard", role: ["admin"] },
  { name: "Roles", path: "/dashboard/roles", role: ["admin"] },
  { name: "Personil", path: "/dashboard/personnels", role: ["admin"] },
  { name: "Kepala Sekolah", path: "/dashboard/headmasters", role: ["admin"] },
  { name: "Album Galeri", path: "/dashboard/gallery-albums", role: ["admin"] },
  {
    name: "Kategori Artikel",
    path: "/dashboard/article-categories",
    role: ["admin"],
  },
  {
    name: "Informasi Sekolah",
    path: "/dashboard/school-informations",
    role: ["admin"],
  },
  {
    name: "Statistik Sekolah",
    path: "/dashboard/school-stats",
    role: ["admin"],
  },
];

const Sidebar = ({
  isOpen,
  setIsOpen,
  style = "gradient", // 🔥 pilih: "flat" | "gradient" | "glass"
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  style?: "flat" | "gradient" | "glass";
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [isAccessible, setIsAccessible] = useState<NavItem[] | null>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    if (!isAccessible) return;
    const index = isAccessible.findIndex(
      (item) => item.path === pathname || pathname.includes(item.path!)
    );
    setActiveIndex(index);
  }, [pathname, isAccessible]);

  useEffect(() => {
    if (!user || !isAuthenticated || isLoading) return;
    setIsAccessible(
      navItems.filter((item) => {
        for (const role of user!.role) {
          if (item.role?.includes(role.toLowerCase())) {
            return true;
          }
          return false;
        }
      })
    );
  }, [isLoading, user, isAuthenticated, router]);

  // ✅ Style variants
  const baseStyle = {
    flat: "bg-sky-600",
    gradient: "bg-gradient-to-b from-sky-600 via-sky-700 to-sky-800",
    glass: "bg-sky-600/80 backdrop-blur-xl border-r border-white/10",
  }[style];

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <Image
          src="/smpn2katapang_logo.png"
          width={200}
          height={200}
          alt="Logo"
          className="rounded-lg w-9 h-9"
        />
        <span className="font-semibold text-lg tracking-wide">
          Portal Dukat
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {isAccessible!.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path!);
                if (window.innerWidth < 1024) closeSidebar();
              }}
              className={`group relative flex items-center gap-3 w-full px-8 py-3 rounded-xl text-sm font-medium transition-all
        ${
          isActive
            ? "bg-white/15 text-white shadow"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
            >
              <span className="text-lg">{iconMap[item.name]}</span>
              {item.name}

              {/* 🔥 Animated Indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-2 w-1.5 h-6 bg-white rounded-full"
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-6 py-5 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
            bg-white text-red-600 hover:text-red-100 rounded-xl text-sm font-semibold shadow-md hover:bg-red-500 cursor-pointer transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 🔥 Overlay klik buat close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={closeSidebar}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 w-64 h-full ${baseStyle} text-white z-30 flex flex-col shadow-xl`}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:sticky top-0 left-0 w-64 h-screen ${baseStyle} text-white shadow-xl`}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
