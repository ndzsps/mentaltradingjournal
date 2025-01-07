import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Company Name */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            TradingMind
          </span>
        </Link>

        {/* Login Button */}
        <Button
          variant="ghost"
          asChild
          className="gap-2"
        >
          <Link to="/login">
            <User className="h-4 w-4" />
            <span>Log In</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}