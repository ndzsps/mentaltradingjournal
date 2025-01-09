import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Blueprint from "./pages/Blueprint";
import Backtesting from "./pages/Backtesting";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/journal-entry" /> : <Landing />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/journal-entry"
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
        path="/blueprint"
        element={
          <ProtectedRoute>
            <Blueprint />
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
      {/* Remove any duplicate routes */}
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;