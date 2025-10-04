import { useState } from "react";
import Sidebar from "../ui/Sidebar";
import { HeaderProvider, useHeader } from "@/contexts/HeaderContext";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Quicksand } from "next/font/google";

const quickSand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

function DynamicHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { title } = useHeader();
  return (
    <header className="sticky top-0 z-10 w-full flex items-center gap-8 bg-white shadow-md p-4 border-b">
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
