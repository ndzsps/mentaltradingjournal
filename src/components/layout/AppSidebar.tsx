
import { Home, BookOpen, BarChart2, Settings, UserCog, FlaskConical, BrainCircuit, Notebook, LineChart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Journal Entry", icon: Home, url: "/journal-entry" },
  { title: "Dashboard", icon: BookOpen, url: "/dashboard" },
  { title: "Analytics", icon: BarChart2, url: "/analytics" },
  { title: "Backtesting", icon: FlaskConical, url: "/backtesting" },
  { title: "MFE & MAE Analysis", icon: LineChart, url: "/mfe-mae" },
  { title: "Notebook", icon: Notebook, url: "/notebook" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const { state } = useSidebar();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      <Sidebar className={cn(
        "transition-all duration-300 ease-in-out h-screen sticky top-0",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        <div className="absolute right-0 top-6 translate-x-1/2 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-6 h-6 shadow-md"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <SidebarContent>
          <div className="p-3">
            <Link to="/" className="flex items-center gap-1.5 group">
              <BrainCircuit className="w-5 h-5 text-primary transition-all duration-300 group-hover:text-accent" />
              {!isCollapsed && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300">
                  Mental
                </h1>
              )}
            </Link>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel className={cn(
              "transition-opacity duration-200",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}>
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={cn(
                          "flex items-center gap-1.5 transition-all duration-200",
                          isCollapsed ? "justify-center px-2" : "justify-start px-4"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setShowMentorDialog(true)}
                    className={cn(
                      "flex items-center gap-1.5 transition-all duration-200",
                      isCollapsed ? "justify-center px-2" : "justify-start px-4"
                    )}
                  >
                    <UserCog className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Mentor Mode</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog open={showMentorDialog} onOpenChange={setShowMentorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restricted Access</DialogTitle>
            <DialogDescription>
              Access to this feature is restricted. Only members of Tenacity Group are authorized to use it.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
