import { Home, BookOpen, BarChart2, Settings, UserCog, FlaskConical, BrainCircuit, Notebook, ChevronRight, ChevronLeft } from "lucide-react";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Journal Entry", icon: Home, url: "/journal-entry" },
  { title: "Dashboard", icon: BookOpen, url: "/dashboard" },
  { title: "Analytics", icon: BarChart2, url: "/analytics" },
  { title: "Backtesting", icon: FlaskConical, url: "/backtesting" },
  { title: "Notebook", icon: Notebook, url: "/notebook" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <div className="p-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 group">
              <BrainCircuit className="w-5 h-5 text-primary transition-all duration-300 group-hover:text-accent" />
              <h1 className={`text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                Mental
              </h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute -right-4 top-6 bg-background border shadow-sm z-50"
              onClick={toggleSidebar}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? 'hidden' : 'block'}>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-2 relative group"
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className={`text-sm transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setShowMentorDialog(true)}
                    title={isCollapsed ? "Mentor Mode" : undefined}
                  >
                    <UserCog className="w-4 h-4" />
                    <span className={`text-sm ${isCollapsed ? 'hidden' : 'block'}`}>
                      Mentor Mode
                    </span>
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