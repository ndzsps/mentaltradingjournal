
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sidebarCollapsed");
      setIsCollapsed(saved ? JSON.parse(saved) : false);
    };

    // Initial check
    handleStorageChange();

    // Listen for changes
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-primary-light/5 to-secondary-light/5">
        <AppSidebar />
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isCollapsed ? "ml-[60px]" : "ml-[240px]"
        )}>
          <AppHeader />
          <main className="flex-1 p-6 animate-fade-in">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
