import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-primary-light/5 to-secondary-light/5">
        <AppSidebar />
        <main className="flex-1 p-6 animate-fade-in">{children}</main>
      </div>
    </SidebarProvider>
  );
};