import { Home, BookOpen, BarChart2, Settings, UserCog, FlaskConical, BrainCircuit, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { title: "Journal Entry", icon: Home, url: "/journal-entry" },
  { title: "Dashboard", icon: BookOpen, url: "/dashboard" },
  { title: "Analytics", icon: BarChart2, url: "/analytics" },
  { title: "Backtesting", icon: FlaskConical, url: "/backtesting" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <BrainCircuit className="w-6 h-6 text-primary transition-all duration-300 group-hover:text-accent" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300">
                  Mental
                </h1>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="ml-2"
                title={state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {state === "expanded" ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setShowMentorDialog(true)}>
                    <UserCog className="w-5 h-5" />
                    <span>Mentor Mode</span>
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