import { Home, BookOpen, BarChart2, Menu, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function AppHeader() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const { user, signOut, updateUsername } = useAuth();
  const { toast } = useToast();
  
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Journal", path: "/journal" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
  ];

  const handleUpdateUsername = async () => {
    try {
      await updateUsername(username);
      setIsEditing(false);
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update username",
      });
    }
  };

  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

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

          <ThemeToggle />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                <span>{displayName}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username"
                      />
                      <Button onClick={handleUpdateUsername}>Save</Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setUsername(displayName);
                        setIsEditing(true);
                      }}
                    >
                      Edit Username
                    </Button>
                  )}
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
              <ThemeToggle />
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter new username"
                    />
                    <Button onClick={handleUpdateUsername} className="w-full">
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setUsername(displayName);
                      setIsEditing(true);
                    }}
                  >
                    Edit Username
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}