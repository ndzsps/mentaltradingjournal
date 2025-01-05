import { Home, BookOpen, BarChart2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const location = useLocation();
  
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Journal", path: "/journal" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
  ];

  return (
    <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              TradingMind
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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
          </nav>
        </div>
      </div>
    </header>
  );
}