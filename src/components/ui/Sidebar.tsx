"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  GraduationCap,
  Images,
  LogOut,
  School,
  Tag,
  Shield,
  Users,
  ChevronDown,
  CalendarRange,
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
  Roles: <Shield size={18} />,
  Personil: <Users size={18} />,
  "Kepala Sekolah": <GraduationCap size={18} />,
  "Album Galeri": <Images size={18} />,
  "Kategori Artikel": <Tag size={18} />,
  "Informasi Sekolah": <School size={18} />,
  "Statistik Sekolah": <BarChart3 size={18} />,
  "Agenda Sekolah": <CalendarRange size={18} />,
};

const navGroups: {
  label: string;
  items: NavItem[];
}[] = [
  {
    label: "Manajemen Sekolah",
    items: [
      { name: "Roles", path: "/dashboard/roles", role: ["admin"] },
      { name: "Personil", path: "/dashboard/personnels", role: ["admin"] },
      {
        name: "Kepala Sekolah",
        path: "/dashboard/headmasters",
        role: ["admin"],
      },
    ],
  },
  {
    label: "Konten & Informasi",
    items: [
      {
        name: "Album Galeri",
        path: "/dashboard/gallery-albums",
        role: ["admin"],
      },
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
        name: "Agenda Sekolah",
        path: "/dashboard/school-events",
        role: ["admin"],
      }
    ],
  },
  {
    label: "Statistik & Data",
    items: [
      {
        name: "Statistik Sekolah",
        path: "/dashboard/school-stats",
        role: ["admin"],
      },
    ],
  },
];

// ──────────────────────────────────────────────
// 🔹 NAV ITEM COMPONENT
// ──────────────────────────────────────────────
const NavItemButton = ({
  item,
  isActive,
  onClick,
  index,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all duration-200
        ${
          isActive
            ? "text-sky-600 bg-sky-50 border border-sky-100"
            : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
        }`}
      style={{ fontFamily: "Quicksand, sans-serif" }}
    >
      <span className="relative z-10">{iconMap[item.name]}</span>
      <span className="relative z-10 flex-1 text-left text-[14px] font-medium tracking-wide">
        {item.name}
      </span>
    </motion.button>
  );
};

// ──────────────────────────────────────────────
// 🔹 GROUP / ACCORDION COMPONENT
// ──────────────────────────────────────────────
const SidebarGroup = ({
  label,
  items,
  activePath,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(!open);

  return (
    <div className="space-y-1">
      {/* Group Header */}
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition"
        style={{ fontFamily: "Quicksand, sans-serif" }}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {/* Collapsible Items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pl-1 space-y-0.5"
          >
            {items.map((item, i) => (
              <NavItemButton
                key={item.path}
                item={item}
                isActive={activePath.includes(item.path!)}
                index={i}
                onClick={() => onNavigate(item.path!)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────
// 🔹 SIDEBAR MAIN COMPONENT
// ──────────────────────────────────────────────
const Sidebar = ({
  isOpen,
  setIsOpen,
  style = "gradient",
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  style?: "flat" | "gradient" | "glass";
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [isAccessible, setIsAccessible] = useState(navGroups);

  const closeSidebar = () => setIsOpen(false);

  const baseStyle = {
    flat: "bg-white border-r border-slate-200",
    gradient:
      "bg-gradient-to-b from-slate-50 to-white border-r border-slate-200",
    glass: "bg-white/80 backdrop-blur-md border-r border-slate-200/80",
  }[style];

  const SidebarContent = (
    <>
      {/* Header / Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <Image
            src="/smpn2katapang_logo.png"
            width={500}
            height={500}
            alt="Logo"
            className="rounded-xl w-10 h-10 ring-1 ring-slate-200 shadow-sm"
          />
          <div
            className="flex flex-col"
            style={{ fontFamily: "Quicksand, sans-serif" }}
          >
            <span className="font-semibold text-[15px] tracking-wide text-slate-800">
              Portal Dukat
            </span>
            <span className="text-[10px] text-slate-500 tracking-widest uppercase font-medium">
              Dashboard
            </span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {isAccessible.map((group) => (
          <SidebarGroup
            key={group.label}
            label={group.label}
            items={group.items}
            activePath={pathname}
            onNavigate={(path) => {
              router.push(path);
              if (window.innerWidth < 1024) closeSidebar();
            }}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-slate-200">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 
            bg-slate-800 hover:bg-slate-900
            text-white rounded-xl text-[14px] font-semibold 
            shadow-sm hover:shadow
            transition-all duration-200"
          style={{ fontFamily: "Quicksand, sans-serif" }}
        >
          <LogOut className="w-4 h-4" />
          <span className="tracking-wide">Logout</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeSidebar}
            />

            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-0 left-0 w-64 h-full ${baseStyle} text-slate-800 z-50 flex flex-col shadow-xl`}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:sticky top-0 left-0 w-64 h-screen ${baseStyle} text-slate-800 shadow-sm`}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
