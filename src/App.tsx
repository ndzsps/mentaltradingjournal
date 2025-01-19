import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import Features from "@/pages/Features";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Journal from "@/pages/Journal";
import Backtesting from "@/pages/Backtesting";
import { AuthProvider } from "@/contexts/AuthContext";

// Create basic components for missing pages
const Register = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-md w-full space-y-8 p-6">
      <h1 className="text-2xl font-bold text-center">Register</h1>
      <p className="text-center text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

const Blueprint = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Blueprint</h1>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

const Settings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Settings</h1>
    <p className="text-muted-foreground">Coming soon...</p>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/blueprint/:id" element={<Blueprint />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;