import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Backtesting from "./pages/Backtesting";
import BlueprintSessions from "./pages/BlueprintSessions";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SubscriptionDialog } from "./components/SubscriptionDialog";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isSubscribed, setIsSubscribed] = React.useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = React.useState(false);

  React.useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      setCheckingSubscription(true);
      try {
        const response = await fetch("/api/check-subscription", {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });
        const { subscribed } = await response.json();
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    if (user) {
      checkSubscription();
    }
  }, [user]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading spinner while checking subscription
  if (checkingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show subscription dialog if not subscribed
  if (!isSubscribed) {
    return <SubscriptionDialog />;
  }

  // If authenticated and subscribed, show the protected content
  return <>{children}</>;
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/journal-entry"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Journal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/backtesting"
                  element={
                    <ProtectedRoute>
                      <Backtesting />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blueprint/:blueprintId"
                  element={
                    <ProtectedRoute>
                      <BlueprintSessions />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;