
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionGuard } from "@/components/subscription/SubscriptionGuard";
import { Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import { Pricing } from "@/pages/Pricing";
import { Features } from "@/pages/Features";
import { Landing } from "@/pages/Landing";
import { AppLayout } from "@/components/layout/AppLayout";
import { Journal } from "@/pages/Journal";
import { Analytics } from "@/pages/Analytics";
import { AddJournalEntry } from "@/pages/AddJournalEntry";
import { Notebook } from "@/pages/Notebook";
import { Backtesting } from "@/pages/Backtesting";
import { BlueprintSessions } from "@/pages/BlueprintSessions";
import { MfeMae } from "@/pages/MfeMae";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <SubscriptionGuard>
                    <AppLayout>
                      <Routes>
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/add-entry" element={<AddJournalEntry />} />
                        <Route path="/notebook" element={<Notebook />} />
                        <Route path="/backtesting" element={<Backtesting />} />
                        <Route path="/blueprint/:id" element={<BlueprintSessions />} />
                        <Route path="/mfe-mae" element={<MfeMae />} />
                      </Routes>
                    </AppLayout>
                  </SubscriptionGuard>
                }
              />
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
