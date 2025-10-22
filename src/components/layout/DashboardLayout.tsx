import { useState } from "react";
import Sidebar from "../ui/Sidebar";
import { HeaderProvider, useHeader } from "@/contexts/HeaderContext";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Quicksand } from "next/font/google";
import { Button } from "../ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { BookOpenText, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickSand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

function DynamicHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { title } = useHeader();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-between bg-white shadow-md px-4 py-2 border-b">
      <div className="flex items-center justify-center gap-8">
        <div className="lg:hidden flex items-center justify-center top-4 left-4 z-30">
          <button
            onClick={toggleSidebar}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-xl flex font-semibold">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full bg-gray-800 text-white uppercase w-12 h-12 p-0"
            asChild
          >
            {user?.image_url ? (
              <Image
                src={user?.image_url ?? ""}
                alt={user?.username ?? ""}
                width={32}
                height={32}
                className="rounded-full object-cover border-2 border-gray-400"
              />
            ) : (
              <div className="flex items-center justify-center text-sm bg-gray-800 text-white">
                {user?.username.charAt(0)}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 px-2">
          <DropdownMenuItem className="flex items-center justify-start">
            <div className="w-12 flex flex-col items-center justify-center">
              <div className="rounded-full flex items-center justify-center w-8 p-0 h-8 text-sm bg-gray-800 text-white uppercase">
                {user?.image_url ? (
                  <Image
                    src={user?.image_url ?? ""}
                    alt={user?.username ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 border-gray-400"
                  />
                ) : (
                  <span>{user?.username.charAt(0)}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center items-start">
              <span className="font-medium capitalize">{user?.username}</span>
              <span className="text-sm text-gray-600">{user?.role}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"https://docs.smpn2katapang.sch.id"}>
              <BookOpenText />
              Panduan Penggunaan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout} variant="destructive">
            <LogOut />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <ProtectedPage>
      <HeaderProvider>
        <div
          suppressHydrationWarning
          className={`${quickSand.className} flex max-h-screen overflow-y-hidden bg-gray-50 text-gray-950`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            style="flat"
            setIsOpen={setIsSidebarOpen}
          />
          <main className="flex-1 flex flex-col overflow-y-hidden">
            <DynamicHeader toggleSidebar={toggleSidebar} />
            <div className="p-6 flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </HeaderProvider>
    </ProtectedPage>
  );
}
