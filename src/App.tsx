import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Backtesting from "./pages/Backtesting";
import BlueprintSessions from "./pages/BlueprintSessions";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionDialog } from "@/components/subscription/SubscriptionDialog";

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
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);

  React.useEffect(() => {
    if (user && !subscriptionLoading && !isSubscribed) {
      setShowSubscriptionDialog(true);
    }
  }, [user, subscriptionLoading, isSubscribed]);

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isSubscribed) {
    return (
      <div className="filter blur-sm">
        {children}
        <SubscriptionDialog 
          open={showSubscriptionDialog} 
          onOpenChange={setShowSubscriptionDialog} 
        />
      </div>
    );
  }

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
              <BrowserRouter>
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
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;