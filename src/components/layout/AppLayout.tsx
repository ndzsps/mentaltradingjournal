
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
          isCollapsed 
            ? "ml-[60px] max-w-[calc(100%-60px)]" 
            : "ml-[240px] max-w-[calc(100%-240px)]"
        )}>
          <AppHeader />
          <main className={cn(
            "flex-1 animate-fade-in transition-all duration-300",
            isCollapsed 
              ? "px-8 lg:px-12 py-6 mx-auto w-full max-w-[1400px]" 
              : "p-6"
          )}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
