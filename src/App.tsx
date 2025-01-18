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
import { useSubscription } from "./hooks/useSubscription";
import { SubscriptionWall } from "./components/SubscriptionWall";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscription();

  // Show loading spinner while checking auth or subscription
  if (authLoading || (user && subscriptionLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not subscribed, show subscription wall
  if (!subscriptionData?.subscribed) {
    return <SubscriptionWall />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        {/* Protected routes */}
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

        {/* Catch all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;