import { Home, BookOpen, BarChart2, Menu, LogOut, User, Edit2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AppHeader() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const { user, signOut } = useAuth();
  
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Journal", path: "/journal" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
  ];

  const userInitials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  const handleUpdateUsername = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: newUsername })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success("Username updated successfully!");
      setIsEditingUsername(false);
      // Force reload the page to update the user data
      window.location.reload();
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error("Failed to update username");
    }
  };

  return (
    <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">TradingMind</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              asChild
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === item.path
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <Link to={item.path} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}

          <Dialog open={isEditingUsername} onOpenChange={setIsEditingUsername}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || user?.email || ""} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                      {user?.full_name || user?.email}
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Display Name</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    id="name"
                    placeholder="Enter your display name"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdateUsername} disabled={!newUsername.trim()}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[280px]">
            <nav className="flex flex-col gap-4 mt-6">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  asChild
                  className={cn(
                    "justify-start",
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}